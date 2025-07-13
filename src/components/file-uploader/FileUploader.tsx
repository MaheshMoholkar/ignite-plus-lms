"use client";

import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import {
  RenderEmptyState,
  RenderErrorState,
  RenderUploadedState,
  RenderUploadingState,
} from "./RenderState";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useConstructUrl } from "@/hooks/use-contruct-url";

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

interface FileUploaderProps {
  value?: string;
  onChange?: (value: string) => void;
  fileType: "image" | "video";
}

function FileUploader({ value, onChange, fileType }: FileUploaderProps) {
  const [fileState, setFileState] = useState<UploaderState>({
    id: null,
    file: null,
    uploading: false,
    progress: 0,
    key: value,
    error: false,
    isDeleting: false,
    objectUrl: value ? useConstructUrl(value) : undefined,
    fileType: fileType,
  });

  const uploadFile = useCallback(
    async (file: File) => {
      setFileState((prev) => ({
        ...prev,
        uploading: true,
        progress: 0,
      }));

      try {
        const response = await fetch("/api/s3/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file: file.name,
            contentType: file.type,
            size: file.size,
            isImage: fileType === "image",
          }),
        });

        if (!response.ok) {
          toast.error("Failed to upload file");
          setFileState((prev) => ({
            ...prev,
            uploading: false,
            progress: 0,
            error: true,
          }));
          return;
        }

        const data = await response.json();

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);
              setFileState((prev) => ({
                ...prev,
                progress,
              }));
            }
          };
          xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 204) {
              setFileState((prev) => ({
                ...prev,
                uploading: false,
                progress: 100,
                key: data.key,
                objectUrl: data.presignedUrl,
              }));
              toast.success("File uploaded successfully");
              onChange?.(data.key);
              resolve();
            } else {
              reject();
            }
          };
          xhr.onerror = () => {
            reject();
          };
          xhr.open("PUT", data.presignedUrl);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file);
        });
      } catch (error) {
        toast.error("Failed to upload file");
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progress: 0,
          error: true,
        }));
      }
    },
    [fileType, onChange]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length) {
        const file = acceptedFiles[0];

        // Clean up existing object URL if it exists
        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectUrl);
        }

        setFileState({
          ...fileState,
          file,
          uploading: true,
          progress: 0,
          key: undefined,
          error: false,
          isDeleting: false,
          objectUrl: URL.createObjectURL(file),
          fileType: fileType,
          id: uuidv4(),
        });

        uploadFile(file);
      }
    },
    [fileState.objectUrl, fileType, uploadFile]
  );

  async function deleteFile() {
    if (fileState.isDeleting || !fileState.objectUrl) return;

    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));

      const response = await fetch(
        `/api/s3/delete?key=${encodeURIComponent(fileState.key || "")}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        toast.error("Failed to delete file");
        setFileState((prev) => ({
          ...prev,
          isDeleting: false,
          error: true,
        }));
        return;
      }

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      onChange?.("");

      setFileState(() => ({
        isDeleting: false,
        objectUrl: undefined,
        key: undefined,
        file: null,
        uploading: false,
        progress: 0,
        error: false,
        fileType: fileType,
        id: null,
      }));

      toast.success("File deleted successfully");
    } catch {
      toast.error("Failed to delete file");
      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        error: false,
      }));
    }
  }

  const rejectedFiles = (fileRejection: FileRejection[]) => {
    if (fileRejection.length) {
      const tooManyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files"
      );
      if (tooManyFiles) {
        toast.error("You can only upload one file");
      }
      const fileTooLarge = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large"
      );
      if (fileTooLarge) {
        toast.error("File is too large");
      }
      const invalidType = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-invalid-type"
      );
      if (invalidType) {
        toast.error(
          `Only ${fileType === "image" ? "images" : "videos"} are allowed`
        );
      }
    }
  };

  function renderContent() {
    if (fileState.uploading) {
      return (
        <RenderUploadingState
          progress={fileState.progress}
          file={fileState.file!}
        />
      );
    }
    if (fileState.error) {
      return <RenderErrorState />;
    }
    if (fileState.objectUrl) {
      return (
        <RenderUploadedState
          previewUrl={fileState.objectUrl}
          isDeleting={fileState.isDeleting}
          handleRemoveFile={deleteFile}
          fileType={fileType}
        />
      );
    }
    return <RenderEmptyState isDragActive={isDragActive} />;
  }

  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDrop,
    accept: fileType === "video" ? { "video/*": [] } : { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: fileType === "image" ? 1024 * 1024 * 5 : 1024 * 1024 * 500, // 5MB for image, 500MB for video
    onDropRejected: rejectedFiles,
    disabled: !!fileState.uploading || !!fileState.objectUrl,
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary"
      )}
    >
      <CardContent className="flex flex-col items-center justify-center p-4 w-full h-full">
        <input {...getInputProps()} />

        {renderContent()}
      </CardContent>
    </Card>
  );
}

export default FileUploader;
