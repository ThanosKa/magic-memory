"use client"

import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Download, ImageIcon, Coins, SlidersHorizontal, LayoutGrid, RefreshCw } from "lucide-react"
import Image from "next/image"
import useSWR, { mutate } from "swr"
import { ImageComparisonSlider } from "./image-comparison-slider"
import { ErrorAlert, type ErrorType } from "@/components/ui/error-alert"
import { ProgressLoading, CreditsSkeleton } from "@/components/ui/loading-states"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type ViewMode = "slider" | "side-by-side"
type RestorationStage = "idle" | "restoring" | "complete"

// Max image dimensions (GFPGAN limit)
const MAX_IMAGE_DIMENSION = 4000

async function validateImageDimensions(file: File): Promise<{ valid: boolean; width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new window.Image()
    img.onload = () => {
      URL.revokeObjectURL(img.src)
      resolve({
        valid: img.width <= MAX_IMAGE_DIMENSION && img.height <= MAX_IMAGE_DIMENSION,
        width: img.width,
        height: img.height,
      })
    }
    img.onerror = () => {
      URL.revokeObjectURL(img.src)
      resolve({ valid: true, width: 0, height: 0 }) // Allow on error
    }
    img.src = URL.createObjectURL(file)
  })
}

export function RestoreUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [restoredImage, setRestoredImage] = useState<string | null>(null)
  const [stage, setStage] = useState<RestorationStage>("idle")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<{ type: ErrorType; message?: string } | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("slider")
  const [originalFilename, setOriginalFilename] = useState<string>("photo")

  const { data: creditsData, isLoading: isLoadingCredits } = useSWR("/api/credits", fetcher)
  const totalCredits = creditsData?.data?.totalCredits ?? 0
  const freeResetTime = creditsData?.data?.freeResetTime
  const hasCredits = totalCredits > 0

  useEffect(() => {
    if (stage === "restoring") {
      setProgress(0)
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval)
            return 90
          }
          return prev + Math.random() * 3
        })
      }, 1000)
      return () => clearInterval(interval)
    } else if (stage === "complete") {
      setProgress(100)
    }
  }, [stage])

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: unknown[]) => {
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0] as { errors: { code: string }[] }
      if (rejection.errors[0]?.code === "file-too-large") {
        setError({ type: "file_too_large" })
      } else if (rejection.errors[0]?.code === "file-invalid-type") {
        setError({ type: "invalid_file_type" })
      }
      return
    }

    const selectedFile = acceptedFiles[0]
    if (!selectedFile) return

    setError(null)

    // Validate image dimensions
    const { valid, width, height } = await validateImageDimensions(selectedFile)
    if (!valid) {
      setError({
        type: "generic",
        message: `Image too large (${width}x${height}). Maximum dimensions: ${MAX_IMAGE_DIMENSION}x${MAX_IMAGE_DIMENSION} pixels.`,
      })
      return
    }

    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
    setRestoredImage(null)
    const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "")
    setOriginalFilename(nameWithoutExt)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled: stage !== "idle" || !!preview,
  })

  const handleRestore = async () => {
    if (!file) return

    if (!hasCredits) {
      setError({ type: "out_of_credits" })
      return
    }

    setStage("restoring")
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("originalFilename", originalFilename)

      const restoreResponse = await fetch("/api/restore", {
        method: "POST",
        body: formData,
      })

      const restoreData = await restoreResponse.json()

      if (!restoreData.success) {
        if (restoreData.error?.includes("No credits")) {
          setError({ type: "out_of_credits", message: restoreData.error })
        } else if (restoreData.error?.includes("timed out")) {
          setError({ type: "timeout", message: restoreData.error })
        } else if (restoreResponse.status === 401) {
          setError({ type: "auth_error" })
        } else if (restoreData.error?.includes("dimensions")) {
          setError({ type: "generic", message: restoreData.error })
        } else {
          setError({ type: "restoration_failed", message: restoreData.error })
        }
        setStage("idle")
        return
      }

      setRestoredImage(restoreData.data.restoredImageUrl)
      setStage("complete")
      mutate("/api/credits")
    } catch (err) {
      if (err instanceof TypeError && err.message.includes("fetch")) {
        setError({ type: "network_error" })
      } else {
        setError({ type: "generic", message: err instanceof Error ? err.message : "Something went wrong" })
      }
      setStage("idle")
    }
  }

  const handleRestoreAnother = () => {
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    setFile(null)
    setPreview(null)
    setRestoredImage(null)
    setError(null)
    setStage("idle")
    setProgress(0)
    setOriginalFilename("photo")
    mutate("/api/credits")
  }

  const handleClear = () => {
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    setFile(null)
    setPreview(null)
    setRestoredImage(null)
    setError(null)
    setStage("idle")
    setProgress(0)
  }

  const handleDownload = async () => {
    if (!restoredImage) return

    try {
      const response = await fetch(restoredImage)
      const blob = await response.blob()
      const contentType = blob.type
      const extension = contentType.includes("jpeg") || contentType.includes("jpg") ? "jpg" : "png"
      const downloadFilename = `${originalFilename}-restored.${extension}`

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = downloadFilename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (_err) {
      const link = document.createElement("a")
      link.href = restoredImage
      link.download = `${originalFilename}-restored.png`
      link.click()
    }
  }

  const isProcessing = stage === "restoring"

  return (
    <div className="mt-12 space-y-8">
      <div className="flex justify-center">
        {isLoadingCredits ? (
          <CreditsSkeleton />
        ) : (
          <div className="flex items-center gap-2 rounded-full bg-accent px-4 py-2">
            <Coins className="h-5 w-5 text-primary" />
            <span className="font-medium">{totalCredits} credits available</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mx-auto max-w-lg">
          <ErrorAlert
            type={error.type}
            message={error.message}
            freeResetTime={freeResetTime}
            onDismiss={() => setError(null)}
            onRetry={
              error.type === "restoration_failed" || error.type === "network_error" || error.type === "timeout"
                ? handleRestore
                : undefined
            }
          />
        </div>
      )}

      {/* Upload Area */}
      {!preview && (
        <Card className="border-dashed border-2">
          <CardContent className="p-0">
            <div
              {...getRootProps()}
              className={`flex flex-col items-center justify-center py-16 px-8 cursor-pointer transition-colors ${isDragActive ? "bg-accent" : "hover:bg-accent/50"}`}
            >
              <input {...getInputProps()} />
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <p className="mt-4 text-lg font-medium">
                {isDragActive ? "Drop your photo here" : "Drag & drop your photo here"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">or click to select a file</p>
              <p className="mt-4 text-xs text-muted-foreground">Supports JPG, PNG, WebP up to 10MB (max 4000x4000px)</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview & Results */}
      {preview && (
        <div className="space-y-6">
          {isProcessing && (
            <Card className="overflow-hidden">
              <ProgressLoading
                progress={progress}
                message="AI is restoring your photo..."
                submessage="This may take up to 60 seconds"
              />
            </Card>
          )}

          {!isProcessing && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{restoredImage ? "Comparison" : "Preview"}</h2>
                <div className="flex items-center gap-2">
                  {restoredImage && (
                    <div className="flex items-center gap-1 rounded-lg border p-1">
                      <Button
                        variant={viewMode === "slider" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("slider")}
                        className="h-8 px-2"
                      >
                        <SlidersHorizontal className="h-4 w-4 mr-1" />
                        Slider
                      </Button>
                      <Button
                        variant={viewMode === "side-by-side" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("side-by-side")}
                        className="h-8 px-2"
                      >
                        <LayoutGrid className="h-4 w-4 mr-1" />
                        Side by Side
                      </Button>
                    </div>
                  )}
                  {!restoredImage && (
                    <Button variant="ghost" size="sm" onClick={handleClear}>
                      <X className="mr-2 h-4 w-4" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              {restoredImage && viewMode === "slider" ? (
                <ImageComparisonSlider
                  originalImage={preview}
                  restoredImage={restoredImage}
                  className="max-w-2xl mx-auto"
                />
              ) : (
                <div className={`grid gap-6 ${restoredImage ? "md:grid-cols-2" : "md:grid-cols-1 max-w-md mx-auto"}`}>
                  <Card className="overflow-hidden">
                    <div className="bg-muted px-4 py-2 text-sm font-medium">Original</div>
                    <div className="relative aspect-square">
                      <Image src={preview || "/placeholder.svg"} alt="Original photo" fill className="object-contain" />
                    </div>
                  </Card>

                  {restoredImage && (
                    <Card className="overflow-hidden">
                      <div className="bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Restored</div>
                      <div className="relative aspect-square">
                        <Image
                          src={restoredImage || "/placeholder.svg"}
                          alt="Restored photo"
                          fill
                          className="object-contain"
                          crossOrigin="anonymous"
                        />
                      </div>
                    </Card>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                {!restoredImage ? (
                  <Button size="lg" onClick={handleRestore} disabled={!hasCredits} className="gap-2">
                    {!hasCredits ? (
                      "No credits available"
                    ) : (
                      <>
                        <ImageIcon className="h-4 w-4" />
                        Restore Photo
                      </>
                    )}
                  </Button>
                ) : (
                  <>
                    <Button size="lg" onClick={handleDownload} className="gap-2">
                      <Download className="h-4 w-4" />
                      Download {originalFilename}-restored
                    </Button>
                    <Button size="lg" variant="outline" onClick={handleRestoreAnother} className="gap-2 bg-transparent">
                      <RefreshCw className="h-4 w-4" />
                      Restore Another Photo
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
