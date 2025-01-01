/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Sheet,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Snackbar,
  CircularProgress,
  Box,
  Button,
} from "@mui/joy";
import { styled } from "@mui/joy/styles";
import { useGetStory, useUpdateNode } from "../../services/useStoryQueries";
import { StoryNode, NodeEditorContainers } from "../../types/story-maker";
import { useWorkingCopy } from "./useWorkingCopy";
import { AvailablePlugins } from "../../plugins/plugin-list";
import SaveIcon from "@mui/icons-material/Save";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const OverallLayout = styled(Box)({
  label: "overall-layout",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
});

const TopLayout = styled(Box)({
  label: "top-layout",
  display: "flex",
  flexGrow: 1,
  flexDirection: "row",
  width: "100%",
  alignItems: "center",
  marginBottom: "16px",
  gap: "16px",
});

// Each section is a Sheet for consistent styling
const MainArea = styled(Sheet)({
  label: "main-area",
  gridColumn: "span 9",
  overflow: "auto",
  flexGrow: 1,
  height: "100%",
  padding: "16px",
});

const Sidebar = styled(Sheet)({
  label: "sidebar",
  gridColumn: "span 3",
  overflow: "auto",
  height: "100%",
  padding: "16px",
  minWidth: "200px",
  
});

const BottomPanel = styled(Sheet)({
  label: "bottom-panel",
  gridColumn: "span 12",
  height: "300px",
});

const SidebarContent = styled(Stack)({
  label: "sidebar-content",
  width: "100%",
  height: "100%",
  gap: "16px",
});

const NodeEditor: React.FC = () => {
  const { id: storyId, nodeId } = useParams<{ id: string; nodeId: string }>();
  const { data: story, isLoading } = useGetStory(storyId || "");
  const updateNodeMutation = useUpdateNode();

  const getNode = () => story?.nodes?.find((n) => n.id === nodeId) || null;
  const { workingCopy: nodeData, setWorkingCopy: setNodeData } = useWorkingCopy(
    getNode,
    [storyId, nodeId]
  );

  const [openSnackbar, setOpenSnackbar] = useState(false);

  if (isLoading || !nodeData) return <CircularProgress />;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFieldChange = (field: keyof StoryNode, value: any) => {
    setNodeData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    if (storyId && nodeId && nodeData) {
      await updateNodeMutation.mutateAsync({
        storyId,
        nodeId,
        node: nodeData,
      });
      setOpenSnackbar(true);
    }
  };

  const renderPluginEditors = (container: NodeEditorContainers) => {
    return story?.activePlugins
      .map((pluginId) => {
        const plugin = AvailablePlugins.find((p) => p.id === pluginId);
        if (!plugin || plugin.editorContainer !== container) return null;

        const pluginData = nodeData.pluginData.find(
          (pd) => pd.pluginId === plugin.id
        )?.data;

        const setPluginData = (data: unknown) => {
          const pluginData = [...nodeData.pluginData];          
          const exists = pluginData.find(
            (pd) => pd.pluginId === plugin.id
          );

          if(exists) {
            exists.data = data as Record<string, any>;
          } else {
            pluginData.push({
              pluginId: plugin.id,              
              data: data as Record<string, any>
            });
          }

          console.log(pluginData);
          setNodeData({
            ...nodeData,
            pluginData,
          });
          
          
        };

        return (
          <plugin.Editor
            key={plugin.id}
            story={story}
            node={nodeData}
            pluginData={pluginData}
            setPluginData={setPluginData}
            setNode={setNodeData}
            setStory={undefined} // Implement if needed
          />
        );
      })
      .filter(Boolean);
  };

  return (
    <>
      <OverallLayout>
        <TopLayout>
          <MainArea>
            <Stack spacing={1}>
              {/* Node Metadata Section */}
              <Sheet variant="outlined" sx={{ p: 2 }}>
                <Stack direction="row" spacing={2}>
                  <FormControl required sx={{ flex: 2 }}>
                    <FormLabel>Name</FormLabel>
                    <Input
                      value={nodeData.label}
                      onChange={(e) =>
                        handleFieldChange("label", e.target.value)
                      }
                    />
                  </FormControl>
                  <FormControl required sx={{ flex: 1 }}>
                    <FormLabel>Order</FormLabel>
                    <Input
                      type="number"
                      value={nodeData.nodeOrder}
                      onChange={(e) =>
                        handleFieldChange("nodeOrder", Number(e.target.value))
                      }
                    />
                  </FormControl>
                </Stack>
              </Sheet>

              {renderPluginEditors("default")}
            </Stack>
          </MainArea>

          <Sidebar>
            <SidebarContent>
              <Button
                variant="solid"
                color="primary"
                startDecorator={<SaveIcon />}
                onClick={handleSave}
                loading={updateNodeMutation.isPending}
                fullWidth
              >
                Save Changes
              </Button>
              {renderPluginEditors("right-sidebar")}
            </SidebarContent>
          </Sidebar>
        </TopLayout>

        <BottomPanel>{renderPluginEditors("bottom-gutter")}</BottomPanel>
      </OverallLayout>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        Node updated successfully!
      </Snackbar>
    </>
  );
};

export default NodeEditor;
