import ConfirmSignup from "./components/Auth/ConfirmSignup";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import NodeMap from "./components/story-editor/NodeMap";
import NodesList from "./components/story-editor/NodesList";

import StoryDetails from "./components/story-editor/StoryDetails";
import StoryEditor from "./components/story-editor/StoryEditor";
import StoryList from "./components/story-list/StoryList";

type ReactFunc = () => React.ReactNode;

export interface RouteConfig {
  path: string;
  body: ReactFunc;
  requiresAuth: boolean;
  children?: RouteConfig[];
}

export const routes: RouteConfig[] = [
  {
    path: "/stories/:id",
    body: () => <StoryEditor />,
    requiresAuth: true,
    children: [
      {
        path: "",
        body: () => <StoryDetails />,
        requiresAuth: true,
      },
      {
        path: "map",
        body: () => <NodeMap />,
        requiresAuth: true,
      },
      {
        path: "nodes",
        body: () => <NodesList />,
        requiresAuth: true,
      },
    ],
  },
  {
    path: "/login",
    body: () => <Login />,
    requiresAuth: false,
  },
  {
    path: "/signup",
    body: () => <Signup />,
    requiresAuth: false,
  },
  {
    path: "/confirm-signup",
    body: () => <ConfirmSignup />,
    requiresAuth: false,
  },
  {
    path: "*",
    body: () => <div>404</div>,
    requiresAuth: false,
  },
  {
    path: "/stories",
    body: () => <StoryList />,
    requiresAuth: true,
  },
  {
    path: "/",
    body: () => <StoryList />,
    requiresAuth: true,
  },
];
