import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class StoryMakerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    const vpc = new ec2.Vpc(this, 'StoryMakerVPC', {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    // DynamoDB Table
    const table = new dynamodb.Table(this, 'StoryMakerTable', {
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 5,
    });

    // Cognito User Pool
    const userPool = new cognito.UserPool(this, 'StoryMakerUserPool', {
      selfSignUpEnabled: true,
      autoVerify: { email: true },
      signInAliases: { email: true },
    });

    const userPoolClient = userPool.addClient('StoryMakerUserPoolClient', {
      generateSecret: false,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
    });

    // API Gateway
    const api = new apigateway.RestApi(this, 'StoryMakerAPIGateway', {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key', 'X-Amz-Security-Token'],
        allowCredentials: true,
      },
    });

    // Add a GatewayResponse for UNAUTHORIZED errors
    api.addGatewayResponse('UnauthorizedResponse', {
      type: apigateway.ResponseType.UNAUTHORIZED,
      responseHeaders: {
        'Access-Control-Allow-Origin': "'*'",
        'Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
        'Access-Control-Allow-Methods': "'GET,POST,PUT,DELETE,OPTIONS'",
      },
      templates: {
        'application/json': '{"message":$context.error.messageString}',
      },
    });

    // Cognito Authorizer
    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'StoryMakerAuthorizer', {
      cognitoUserPools: [userPool],
    });

    const lambdaRole = new iam.Role(this, 'LambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    lambdaRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'));

    // Grant read and write permissions to the main table
    table.grantReadWriteData(lambdaRole);

    const lambdaFunction = new nodejs.NodejsFunction(this, `StoryFunction`, {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: path.join(__dirname, '..', 'lambda', `story.ts`),
      environment: {
        STORY_TABLE_NAME: table.tableName,
      },
      role: lambdaRole,
    });

    // Create API resources and methods
    const stories = api.root.addResource('stories');
    const story = stories.addResource('{id}');

    // GET /stories (currentUserStories)
    stories.addMethod('GET', new apigateway.LambdaIntegration(lambdaFunction), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    // GET /stories/{id} (story)
    story.addMethod('GET', new apigateway.LambdaIntegration(lambdaFunction), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    // POST /stories (createStory)
    stories.addMethod('POST', new apigateway.LambdaIntegration(lambdaFunction), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    // PATCH /stories/{id} (updateStoryTitle)
    story.addMethod('PATCH', new apigateway.LambdaIntegration(lambdaFunction), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    // DELETE /stories/{id} (remove story)
    story.addMethod('DELETE', new apigateway.LambdaIntegration(lambdaFunction), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });


    // POST /stories/{id}/nodes (createNode)
    const nodes = story.addResource('nodes');
    nodes.addMethod('POST', new apigateway.LambdaIntegration(lambdaFunction), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    // PATCH /stories/{id}/nodes/{nodeId} (updateNode)
    const node = nodes.addResource('{nodeId}');
    node.addMethod('PATCH', new apigateway.LambdaIntegration(lambdaFunction), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    // Static Website
    const websiteBucket = new s3.Bucket(this, 'StoryMakerWebsiteBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS
    });

    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset('frontend/dist')],
      destinationBucket: websiteBucket,
    });

    const distribution = new cloudfront.Distribution(this, 'StoryMakerDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
    });

    // Create an IAM user for CLI access
    const cliUser = new iam.User(this, 'StoryMakerCLIUser', {
      userName: 'story-maker-cli-user',
    });

    // Grant the user permissions to access DynamoDB
    table.grantReadWriteData(cliUser);

    // Create access key for the CLI user
    const accessKey = new iam.CfnAccessKey(this, 'StoryMakerCLIUserAccessKey', {
      userName: cliUser.userName,
    });

    // Output the access key and secret (be careful with these!)
    new cdk.CfnOutput(this, 'CLIUserAccessKeyId', { value: accessKey.ref });
    new cdk.CfnOutput(this, 'CLIUserSecretAccessKey', { value: accessKey.attrSecretAccessKey });

    new cdk.CfnOutput(this, 'StoryTableName', { value: table.tableName });

    // Output values
    new cdk.CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
    new cdk.CfnOutput(this, 'UserPoolClientId', { value: userPoolClient.userPoolClientId });
    new cdk.CfnOutput(this, 'ApiUrl', { value: api.url });
    new cdk.CfnOutput(this, 'WebsiteUrl', { value: distribution.distributionDomainName });
  }
}
