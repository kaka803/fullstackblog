'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  $createParagraphNode,
  $createHeadingNode,
  $wrapNodes
} from 'lexical';
import { useCallback } from 'react';

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  // Format bold / italic text
  const formatText = (format) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  // Heading (wrap selected text in <h1>, <h2>)
  const formatHeading = useCallback((level) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () => $createHeadingNode(`h${level}`));
      }
    });
  }, [editor]);

  // Paragraph
  const formatParagraph = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () => $createParagraphNode());
      }
    });
  }, [editor]);

  return (
    <div className="flex gap-2 mb-2">
      <button onClick={() => formatText('bold')} className="px-2 py-1 border rounded">Bold</button>
      <button onClick={() => formatText('italic')} className="px-2 py-1 border rounded">Italic</button>
      <button onClick={() => formatHeading(1)} className="px-2 py-1 border rounded">H1</button>
      <button onClick={() => formatHeading(2)} className="px-2 py-1 border rounded">H2</button>
      <button onClick={formatParagraph} className="px-2 py-1 border rounded">P</button>
    </div>
  );
}
