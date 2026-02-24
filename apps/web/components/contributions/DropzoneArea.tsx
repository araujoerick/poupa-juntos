"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface DropzoneAreaProps {
  onFileAccepted: (file: File) => void;
  dark?: boolean;
}

export function DropzoneArea({ onFileAccepted, dark }: DropzoneAreaProps) {
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

  if (dark) {
    return (
      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          isDragActive
            ? "border-dark-primary bg-dark-primary/10"
            : "border-white/10 hover:border-dark-primary/50 bg-white/5"
        }`}
      >
        <input {...getInputProps()} />
        {fileName ? (
          <p className="text-sm font-medium text-dark-accent">✓ {fileName}</p>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <svg
                className="w-5 h-5 text-white/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-sm text-white/50">
              {isDragActive
                ? "Solte o arquivo aqui..."
                : "Arraste o comprovante ou clique para selecionar"}
            </p>
            <p className="mt-1 text-xs text-white/30">
              PNG, JPG ou PDF — máx. 10 MB
            </p>
          </>
        )}
      </div>
    );
  }

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
