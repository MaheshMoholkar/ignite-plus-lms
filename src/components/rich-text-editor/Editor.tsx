"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Menubar from "./Menubar";
import TextAlign from "@tiptap/extension-text-align";

const RichTextEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
  });

  if (!editor) {
    return null;
  }

  return (
    <>
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </>
  );
};

export default RichTextEditor;
