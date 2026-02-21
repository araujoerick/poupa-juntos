"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface DropzoneAreaProps {
  onFileAccepted: (file: File) => void;
}

export function DropzoneArea({ onFileAccepted }: DropzoneAreaProps) {
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setFileName(file.name);
        onFileAccepted(file);
      }
    },
    [onFileAccepted],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [], "application/pdf": [] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10 MB
  });

  return (
    <div
      {...getRootProps()}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50"
      }`}
    >
      <input {...getInputProps()} />
      {fileName ? (
        <p className="text-sm font-medium text-foreground">✓ {fileName}</p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {isDragActive
              ? "Solte o arquivo aqui..."
              : "Arraste o comprovante ou clique para selecionar"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            PNG, JPG ou PDF — máx. 10 MB
          </p>
        </>
      )}
    </div>
  );
}
