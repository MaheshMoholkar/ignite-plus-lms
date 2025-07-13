"use client";

import { useMemo, useState, useEffect } from "react";
import TextAlign from "@tiptap/extension-text-align";
import { generateHTML, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import parse from "html-react-parser";
import { Skeleton } from "@/components/ui/skeleton";

export function RenderDescription({
  description,
}: {
  description: JSONContent;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const output = useMemo(() => {
    if (!isClient || !description) {
      return "";
    }

    return generateHTML(description, [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ]);
  }, [description, isClient]);

  // During SSR and initial client render, show skeleton
  if (!isClient) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  // Don't render anything if no output
  if (!output) {
    return null;
  }

  return (
    <div className="prose dark:prose-invert prose-li:marker:text-primary">
      {parse(output)}
    </div>
  );
}
