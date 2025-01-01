import { styled } from '@mui/joy/styles';
import { NodePlugin } from '../../types/story-maker';

const PluginList = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const PluginItem = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5),
  borderRadius: theme.radius.sm,
  backgroundColor: theme.vars.palette.background.level1,
}));

const PluginIcon = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.vars.palette.text.secondary,
}));

const PluginInfo = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

const PluginName = styled('h3')(({ theme }) => ({
  margin: 0,
  fontSize: theme.fontSize.md,
  fontWeight: theme.fontWeight.md,
}));

const PluginDescription = styled('p')(({ theme }) => ({
  margin: 0,
  fontSize: theme.fontSize.sm,
  color: theme.vars.palette.text.secondary,
}));

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.vars.palette.background.surface,
  borderRadius: theme.radius.md,
}));

const Header = styled('h2')(({ theme }) => ({
  margin: 0,
  fontSize: theme.fontSize.lg,
  fontWeight: theme.fontWeight.lg,
  color: theme.vars.palette.text.primary,
}));

type ActivePluginsListProps = {
  plugins: NodePlugin<unknown>[];
};

// eslint-disable-next-line react/prop-types
export const ActivePluginsList: React.FC<ActivePluginsListProps> = ({ plugins }) => {
  return (
    <Container>
      <Header>Active Plugins</Header>
      <PluginList>
        {plugins.map((plugin) => (
          <PluginItem key={plugin.id}>
            <PluginIcon>{plugin.icon}</PluginIcon>
            <PluginInfo>
              <PluginName>{plugin.name}</PluginName>
              <PluginDescription>{plugin.description}</PluginDescription>
            </PluginInfo>
          </PluginItem>
        ))}
      </PluginList>
    </Container>
  );
}; 