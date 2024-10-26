import React from "react";
import { Outlet } from "react-router-dom";
import styled from "@emotion/styled";

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StoryEditor: React.FC = () => {
  return (
    <EditorContainer>
      <Outlet />
    </EditorContainer>
  );
};

export default StoryEditor;
