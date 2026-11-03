"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import useSWR, { mutate } from "swr";
import { Download, ImageIcon, RefreshCw } from "lucide-react";
import { BeforeAfterSlider } from "@/components/before-after-slider";
import { SectionLabel } from "@/components/layout/section-label";
import {
  OutOfCreditsNote,
  PhotoFrame,
  UploadFrame,
  photoWidthStyle,
} from "./restore-frames";
import { Button } from "@/components/ui/button";
import { ErrorAlert, type ErrorType } from "@/components/ui/error-alert";
import { cn } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
type RestorationStage = "idle" | "restoring" | "complete";
type ImageDimensions = { width: number; height: number };

const FRIENDLY_RESTORE_ERROR =
  "We couldn't restore your photo this time. Please try again shortly.";

const MAX_UPLOAD_SIZE = 3.5 * 1024 * 1024;
const RESIZE_MAX_DIMENSION = 1536;

async function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

async function compressImage(
  file: File
): Promise<{ file: File; width: number; height: number }> {
  const img = await loadImage(file);
  const origWidth = img.width;
  const origHeight = img.height;

  const needsResize =
    origWidth > RESIZE_MAX_DIMENSION ||
    origHeight > RESIZE_MAX_DIMENSION ||
    file.size > MAX_UPLOAD_SIZE;

  if (!needsResize) {
    URL.revokeObjectURL(img.src);
    return { file, width: origWidth, height: origHeight };
  }

  let targetWidth = origWidth;
  let targetHeight = origHeight;
  const maxDim = RESIZE_MAX_DIMENSION;

  if (targetWidth > maxDim || targetHeight > maxDim) {
    if (targetWidth >= targetHeight) {
      targetHeight = Math.round((targetHeight / targetWidth) * maxDim);
      targetWidth = maxDim;
    } else {
      targetWidth = Math.round((targetWidth / targetHeight) * maxDim);
      targetHeight = maxDim;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  URL.revokeObjectURL(img.src);

  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error("Image compression failed"));
      },
      "image/jpeg",
      0.9,
    )
  );

  canvas.width = 0;
  canvas.height = 0;

  const compressed = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
    type: "image/jpeg",
  });

  return { file: compressed, width: targetWidth, height: targetHeight };
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
  const [originalFilename, setOriginalFilename] = useState<string>("photo");
  const [imageDimensions, setImageDimensions] =
    useState<ImageDimensions | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);

  const { data: creditsData } = useSWR("/api/credits", fetcher);
  const totalCredits = creditsData?.data?.totalCredits ?? 0;
  const freeResetTime = creditsData?.data?.freeResetTime;
  const hasCredits = totalCredits > 0;
  const creditsError =
    creditsData?.success === false && typeof creditsData.error === "string"
      ? creditsData.error
      : null;

  useEffect(() => {
    if (creditsError) toast.error(creditsError, { id: "credits-error" });
  }, [creditsError]);

  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  const clearProgressInterval = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const startRestoringProgress = useCallback(() => {
    clearProgressInterval();
    setProgress((prev) => (prev < 5 ? 5 : prev));
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const target = 95;
        if (prev >= target) return prev;
        const delta = Math.max(0.5, (target - prev) * 0.08);
        return Math.min(prev + delta, target);
      });
    }, 200);
  }, [clearProgressInterval]);

  const completeProgress = useCallback(() => {
    clearProgressInterval();
    setProgress(100);
  }, [clearProgressInterval]);

  useEffect(() => {
    return () => {
      clearProgressInterval();
    };
  }, [clearProgressInterval]);

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: unknown[]) => {
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0] as { errors: { code: string }[] };
        if (rejection.errors[0]?.code === "file-too-large") {
          setError({ type: "file_too_large" });
        } else if (rejection.errors[0]?.code === "file-invalid-type") {
          setError({
            type: "generic",
            message: "Please upload a valid image file (JPG, PNG, or WebP).",
          });
        }
        return;
      }

      const selectedFile = acceptedFiles[0];
      if (!selectedFile) return;

      setError(null);
      if (preview) {
        URL.revokeObjectURL(preview);
      }

      setIsPreparing(true);
      try {
        const { file: processedFile, width, height } =
          await compressImage(selectedFile);
        setFile(processedFile);
        setPreview(URL.createObjectURL(processedFile));
        setRestoredImage(null);
        setImageDimensions({ width, height });
        const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
        setOriginalFilename(nameWithoutExt);
      } catch {
        setError({
          type: "generic",
          message: "Could not process this image. Please try a different photo.",
        });
      } finally {
        setIsPreparing(false);
      }
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
    maxSize: 20 * 1024 * 1024,
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
    startRestoringProgress();

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
        console.error("Restore failed", restoreData.error);

        if (restoreData.error?.includes("No credits")) {
          setError({ type: "out_of_credits", message: restoreData.error });
        } else if (restoreResponse.status === 401) {
          setError({ type: "auth_error" });
        } else {
          setError({ type: "generic", message: FRIENDLY_RESTORE_ERROR });
          toast.error(FRIENDLY_RESTORE_ERROR);
        }
        completeProgress();
        setStage("idle");
        return;
      }

      setRestoredImage(restoreData.data.restoredImageUrl);
      setStage("complete");
      completeProgress();
      mutate("/api/credits");
    } catch (err) {
      console.error("Restore error", err);
      setError({
        type: "generic",
        message: FRIENDLY_RESTORE_ERROR,
      });
      completeProgress();
      setStage("idle");
    }
  };

  const handleRestoreAnother = () => {
    clearProgressInterval();
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
    clearProgressInterval();
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
    } catch {
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
  const step = restoredImage
    ? { index: "03", label: "Compare and download" }
    : preview
      ? { index: "02", label: "Restore" }
      : { index: "01", label: "Upload" };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-16 lg:gap-y-10">
      <div className="max-w-xl lg:self-end">
        <SectionLabel index={step.index}>{step.label}</SectionLabel>
        <h1 className="font-serif mt-6 text-[clamp(2.75rem,5.6vw,5rem)] leading-[0.95] tracking-[-0.02em] text-paper">
          Restore <span className="italic text-paper/70">Your Photo</span>
        </h1>
        {!restoredImage && !isProcessing && (
          <p className="mt-6 max-w-[30rem] text-[17px] leading-[1.6] text-paper/70">
            Upload an old, blurry, or damaged photo and let AI work its magic.
          </p>
        )}

        {error && (
          <div className="mt-8">
            <ErrorAlert
              type={error.type}
              message={error.message}
              freeResetTime={freeResetTime}
              onDismiss={() => setError(null)}
              onRetry={error.type === "generic" ? handleRestore : undefined}
            />
          </div>
        )}
      </div>

      <div className={cn(preview && "lg:row-span-2")}>
        {!preview && (
          <UploadFrame
            rootProps={getRootProps()}
            inputProps={getInputProps()}
            isDragActive={isDragActive}
            isPreparing={isPreparing}
          />
        )}

        {preview && !restoredImage && (
          <PhotoFrame
            src={preview}
            alt="Original photo"
            aspectRatio={aspectRatio}
            progress={isProcessing ? progress : undefined}
          />
        )}

        {preview && restoredImage && (
          <div className="mx-auto w-full" style={photoWidthStyle(aspectRatio)}>
            <BeforeAfterSlider
              key={restoredImage}
              before={{ src: preview, alt: "Original photo", label: "Before" }}
              after={{ src: restoredImage, alt: "Restored photo", label: "After" }}
              aspectRatio={aspectRatio}
              sizes="(max-width: 1024px) 100vw, 58vw"
              unoptimized
            />
          </div>
        )}
      </div>

      {preview && (
        <div className="flex max-w-xl flex-col gap-6 lg:col-start-1 lg:row-start-2 lg:self-start">
          {!hasCredits && <OutOfCreditsNote />}

          {!isProcessing && (restoredImage || hasCredits) && (
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {!restoredImage ? (
                <>
                  <Button size="lg" onClick={handleRestore}>
                    <ImageIcon aria-hidden="true" />
                    Restore Photo
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleClear}>
                    Remove
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" onClick={handleDownload}>
                    <Download aria-hidden="true" />
                    Download
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleRestoreAnother}>
                    <RefreshCw aria-hidden="true" />
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
