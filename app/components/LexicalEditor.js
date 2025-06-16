import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ToolbarPlugin } from './ToolbarPlugin';
import { $getRoot, $getSelection } from 'lexical';

// ✅ Starter Kit Import
import { HeadingNode, QuoteNode, CodeNode } from '@lexical/rich-text';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { ListItemNode, ListNode } from '@lexical/list';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';

import { $createParagraphNode, ParagraphNode, TextNode } from 'lexical';

import { LinkNode } from '@lexical/link';
import { CodeHighlightNode } from '@lexical/code';

import { Klass, LexicalNode } from 'lexical';

const theme = {};

const onError = (error) => {
  console.error(error);
};

const editorConfig = {
  namespace: 'MyEditor',
  theme,
  onError,
  nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, CodeNode, ParagraphNode, TextNode, LinkNode, CodeHighlightNode],
};

export default function LexicalEditor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="border p-4 rounded-md">
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor-input mt-2" />}
          placeholder={<div className="editor-placeholder">Start typing...</div>}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <ClearEditorPlugin />
        <ListPlugin />
        <OnChangePlugin onChange={() => {}} />
      </div>
    </LexicalComposer>
  );
}
