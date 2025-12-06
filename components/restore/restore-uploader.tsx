"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Upload,
  X,
  Download,
  ImageIcon,
  Coins,
  SlidersHorizontal,
  LayoutGrid,
  RefreshCw,
  FileText,
  FileIcon,
  TriangleAlert,
  CloudUpload,
} from "lucide-react";
import Image from "next/image";
import useSWR, { mutate } from "swr";
import { ImageComparisonSlider } from "./image-comparison-slider";
import { ErrorAlert, type ErrorType } from "@/components/ui/error-alert";
import {
  ProgressLoading,
  CreditsSkeleton,
} from "@/components/ui/loading-states";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type ViewMode = "slider" | "side-by-side";
type RestorationStage = "idle" | "restoring" | "complete";
type ImageDimensions = { width: number; height: number };

// Max image dimensions (GFPGAN limit)
const MAX_IMAGE_DIMENSION = 4000;

async function validateImageDimensions(
  file: File
): Promise<{ valid: boolean; width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve({
        valid:
          img.width <= MAX_IMAGE_DIMENSION && img.height <= MAX_IMAGE_DIMENSION,
        width: img.width,
        height: img.height,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      resolve({ valid: true, width: 0, height: 0 }); // Allow on error
    };
    img.src = URL.createObjectURL(file);
  });
}

export function RestoreUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [stage, setStage] = useState<RestorationStage>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<{
    type: ErrorType;
    message?: string;
  } | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("side-by-side");
  const [originalFilename, setOriginalFilename] = useState<string>("photo");
  const [imageDimensions, setImageDimensions] =
    useState<ImageDimensions | null>(null);

  const { data: creditsData, isLoading: isLoadingCredits } = useSWR(
    "/api/credits",
    fetcher
  );
  const totalCredits = creditsData?.data?.totalCredits ?? 0;
  const freeResetTime = creditsData?.data?.freeResetTime;
  const hasCredits = totalCredits > 0;

  useEffect(() => {
    if (stage === "restoring") {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + Math.random() * 6 + 2; // 2-8% per second, reaches ~90% in ~15 seconds
        });
      }, 800); // Faster updates every 800ms
      return () => clearInterval(interval);
    } else if (stage === "complete") {
      setProgress(100);
    }
  }, [stage]);

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: unknown[]) => {
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0] as { errors: { code: string }[] };
        if (rejection.errors[0]?.code === "file-too-large") {
          setError({ type: "file_too_large" });
        } else if (rejection.errors[0]?.code === "file-invalid-type") {
          setError({ type: "invalid_file_type" });
        }
        return;
      }

      const selectedFile = acceptedFiles[0];
      if (!selectedFile) return;

      setError(null);
      if (preview) {
        URL.revokeObjectURL(preview);
      }

      // Validate image dimensions
      const { valid, width, height } = await validateImageDimensions(
        selectedFile
      );
      if (!valid) {
        setError({
          type: "generic",
          message: `Image too large (${width}x${height}). Maximum dimensions: ${MAX_IMAGE_DIMENSION}x${MAX_IMAGE_DIMENSION} pixels.`,
        });
        return;
      }

      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setRestoredImage(null);
      setImageDimensions({ width, height });
      const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
      setOriginalFilename(nameWithoutExt);
    },
    [preview]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled: stage !== "idle",
  });

  const handleRestore = async () => {
    if (!file) return;

    if (!hasCredits) {
      setError({ type: "out_of_credits" });
      return;
    }

    setStage("restoring");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("originalFilename", originalFilename);

      const restoreResponse = await fetch("/api/restore", {
        method: "POST",
        body: formData,
      });

      const restoreData = await restoreResponse.json();

      if (!restoreData.success) {
        if (restoreData.error?.includes("No credits")) {
          setError({ type: "out_of_credits", message: restoreData.error });
        } else if (restoreData.error?.includes("timed out")) {
          setError({ type: "timeout", message: restoreData.error });
        } else if (restoreResponse.status === 401) {
          setError({ type: "auth_error" });
        } else if (restoreData.error?.includes("dimensions")) {
          setError({ type: "generic", message: restoreData.error });
        } else {
          setError({ type: "restoration_failed", message: restoreData.error });
        }
        setStage("idle");
        return;
      }

      setRestoredImage(restoreData.data.restoredImageUrl);
      setStage("complete");
      mutate("/api/credits");
    } catch (err) {
      if (err instanceof TypeError && err.message.includes("fetch")) {
        setError({ type: "network_error" });
      } else {
        setError({
          type: "generic",
          message: err instanceof Error ? err.message : "Something went wrong",
        });
      }
      setStage("idle");
    }
  };

  const handleRestoreAnother = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
    setRestoredImage(null);
    setError(null);
    setStage("idle");
    setProgress(0);
    setOriginalFilename("photo");
    setImageDimensions(null);
    mutate("/api/credits");
  };

  const handleClear = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
    setRestoredImage(null);
    setError(null);
    setStage("idle");
    setProgress(0);
    setImageDimensions(null);
  };

  const handleDownload = async () => {
    if (!restoredImage) return;

    try {
      const response = await fetch(restoredImage);
      const blob = await response.blob();
      const contentType = blob.type;
      const extension =
        contentType.includes("jpeg") || contentType.includes("jpg")
          ? "jpg"
          : "png";
      const downloadFilename = `${originalFilename}-restored.${extension}`;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = downloadFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (_err) {
      const link = document.createElement("a");
      link.href = restoredImage;
      link.download = `${originalFilename}-restored.png`;
      link.click();
    }
  };

  const isProcessing = stage === "restoring";
  const aspectRatio =
    imageDimensions && imageDimensions.height
      ? imageDimensions.width / imageDimensions.height
      : 1;
  const comparisonContainerClass = "w-full max-w-7xl mx-auto";

  return (
    <div className="mt-4 space-y-8">
      {!restoredImage && !isProcessing && (
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Restore Your Photo
          </h1>
          <p className="mt-4 text-muted-foreground">
            Upload an old, blurry, or damaged photo and let AI work its magic.
          </p>
        </div>
      )}

      {error && (
        <div className="mx-auto max-w-lg">
          <ErrorAlert
            type={error.type}
            message={error.message}
            freeResetTime={freeResetTime}
            onDismiss={() => setError(null)}
            onRetry={
              error.type === "restoration_failed" ||
              error.type === "network_error" ||
              error.type === "timeout"
                ? handleRestore
                : undefined
            }
          />
        </div>
      )}

      {/* Upload Area */}
      {!preview && (
        <div className="relative group w-full max-w-2xl mx-auto">
          {/* Gradient glow effect */}
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 opacity-50 blur transition duration-500 group-hover:opacity-100" />

          {/* Main upload container */}
          <div className="relative rounded-xl bg-background p-2 ring-1 ring-border">
            <div
              {...getRootProps()}
              className={`flex justify-center rounded-md border mt-2 border-dashed border-input px-6 py-12 transition-colors ${
                isDragActive
                  ? "bg-accent/50"
                  : "hover:bg-muted/50 cursor-pointer"
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-center relative w-full">
                <CloudUpload className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="mt-4 flex text-sm leading-6 text-muted-foreground justify-center">
                  <p>Drag and drop or</p>
                  <span className="relative cursor-pointer rounded-sm pl-1 font-medium text-primary hover:underline hover:underline-offset-4">
                    choose file
                  </span>
                  <p className="pl-1">to upload</p>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  JPG, PNG, WebP up to 10MB
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview & Results */}
      {preview && (
        <div className="space-y-6">
          {!hasCredits && (
            <div className="text-center">
              <p className="text-muted-foreground">
                You have <strong>0 generations</strong> left.{" "}
                <Link href="/pricing" className="text-primary hover:underline">
                  Buy more credits here.
                </Link>
              </p>
            </div>
          )}

          {restoredImage && (
            <div className="flex justify-center">
              <Tabs
                defaultValue="side-by-side"
                className="w-full max-w-4xl"
                onValueChange={(val) => setViewMode(val as ViewMode)}
              >
                <div className="flex justify-center">
                  <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                    <TabsTrigger
                      value="side-by-side"
                      className="flex items-center gap-2"
                    >
                      <LayoutGrid className="h-4 w-4" />
                      Side by Side
                    </TabsTrigger>
                    <TabsTrigger
                      value="slider"
                      className="flex items-center gap-2"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      Slider
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="mt-6">
                  <TabsContent value="slider">
                    <div className={comparisonContainerClass}>
                      <ImageComparisonSlider
                        originalImage={preview}
                        restoredImage={restoredImage}
                        aspectRatio={aspectRatio}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="side-by-side">
                    <div className={comparisonContainerClass}>
                      <div
                        className={`grid gap-6 ${
                          restoredImage
                            ? "md:grid-cols-2"
                            : "md:grid-cols-1 max-w-md mx-auto"
                        }`}
                      >
                        <div className="relative w-full">
                          {restoredImage && (
                            <div className="absolute top-2 left-2 z-10 rounded-md bg-black/50 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                              Original
                            </div>
                          )}
                          <img
                            src={preview || "/placeholder.svg"}
                            alt="Original photo"
                            className="h-auto w-full rounded-lg"
                          />
                        </div>

                        {restoredImage && (
                          <div className="relative w-full">
                            <div className="absolute top-2 left-2 z-10 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground shadow-lg">
                              Restored
                            </div>
                            <img
                              src={restoredImage || "/placeholder.svg"}
                              alt="Restored photo"
                              className="h-auto w-full rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          )}

          {!restoredImage && (
            <div className={comparisonContainerClass}>
              <div className="flex justify-center">
                <div className="relative max-w-md w-full">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt="Original photo"
                    className="h-auto w- rounded-lg"
                  />

                  {isProcessing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-black/10 backdrop-blur-sm transition-all duration-300">
                      <div className="w-48 space-y-4 text-center">
                        <div className="relative h-16 w-16 mx-auto">
                          <div className="absolute inset-0 rounded-full border-4 border-primary/10" />
                          <div className="absolute inset-0 rounded-full border-4 border-primary/70 border-t-transparent animate-spin" />
                          <ImageIcon className="absolute inset-0 m-auto h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-white">
                            Restoring your photo...
                          </p>
                          <p className="text-lg font-bold text-white">
                            {Math.round(progress)}%
                          </p>
                        </div>
                        <Progress
                          value={progress}
                          className="h-1.5 bg-white/20"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          {!isProcessing && (
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              {!restoredImage ? (
                hasCredits ? (
                  <div className="flex gap-4">
                    <Button
                      size="lg"
                      onClick={handleRestore}
                      className="gap-2 px-8"
                    >
                      <ImageIcon className="h-4 w-4" />
                      Restore Photo
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleClear}
                      className="px-8 bg-transparent"
                    >
                      Remove
                    </Button>
                  </div>
                ) : null
              ) : (
                <>
                  <Button
                    size="lg"
                    onClick={handleDownload}
                    className="gap-2 px-8"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleRestoreAnother}
                    className="gap-2 px-8 bg-transparent"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Restore Another Photo
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
