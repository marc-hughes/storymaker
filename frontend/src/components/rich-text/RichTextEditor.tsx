import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { styled } from "@mui/joy/styles";
import { Sheet } from '@mui/joy';
import { Typography } from '@mui/joy';
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { EditorState } from 'lexical';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';

const EditorContainer = styled(Sheet)`
  position: relative;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 16px;
  margin: 16px 0;
`;

const ContentEditableStyled = styled(ContentEditable)`
  min-height: 150px;
  outline: none;
  
  &:focus {
    outline: none;
  }
`;

const Placeholder = styled(Typography)`
  color: #999;
  position: absolute;
  top: 16px;
  left: 16px;
  pointer-events: none;
`;

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const initialConfig = {
    namespace: 'MyRichTextEditor',
    editorState: value,
    theme: {
      // Add custom theme classes if needed
    },
    onError: (error: Error) => {
      console.error(error);
    },
  };

  const handleChange = (editorState: EditorState) => {
    editorState.read(() => {
      const jsonString = JSON.stringify(editorState.toJSON());
      onChange?.(jsonString);
    });
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <EditorContainer>
        <RichTextPlugin
          contentEditable={<ContentEditableStyled />}
          placeholder={<Placeholder>Enter some text...</Placeholder>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin onChange={handleChange} />
      </EditorContainer>
    </LexicalComposer>
  );
};
