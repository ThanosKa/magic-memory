import type React from "react";
import Image from "next/image";
import Link from "next/link";
import type { DropzoneInputProps, DropzoneRootProps } from "react-dropzone";
import { ImageUp } from "lucide-react";
import { Button, ButtonArrow } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-states";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

/** Print-frame shadow shared with the restoration lens. */
const PRINT_SHADOW =
  "shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85),0_2px_6px_rgba(0,0,0,0.3)]";

/**
 * Caps a photo's width so a tall portrait still fits the viewport.
 * Used for both the preview and the lens so the frame does not jump
 * when the result arrives.
 */
export function photoWidthStyle(aspectRatio: number): React.CSSProperties {
  return { maxWidth: `min(100%, calc(72svh * ${aspectRatio}))` };
}

function Sprockets() {
  return <div className="mm-sprockets h-[14px] w-full" aria-hidden="true" />;
}

type UploadFrameProps = {
  rootProps: DropzoneRootProps;
  inputProps: DropzoneInputProps;
  isDragActive: boolean;
  isPreparing: boolean;
};

/** The drop zone, drawn as the film-strip upload frame from the home page. */
export function UploadFrame({ rootProps, inputProps, isDragActive, isPreparing }: UploadFrameProps) {
  return (
    <div className="rounded-[6px] bg-surface px-3 py-2 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)] sm:px-4">
      <Sprockets />
      <div className="my-2 rounded-[3px] bg-surface-2 p-3 sm:p-4">
        <div
          {...rootProps}
          aria-busy={isPreparing}
          className={cn(
            "focus-ring flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-[3px] border border-dashed px-6 py-12 text-center transition-colors duration-200 sm:min-h-[420px]",
            isDragActive
              ? "border-ember bg-ember/[0.06]"
              : "cursor-pointer border-paper/25 bg-paper/[0.03] hover:border-paper/45 hover:bg-paper/[0.05]"
          )}
        >
          <input {...inputProps} />
          {isPreparing ? (
            <>
              <LoadingSpinner size="lg" />
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-paper/60">
                Preparing photo
              </p>
            </>
          ) : (
            <>
              <ImageUp
                className={cn(
                  "size-9 transition-[color,transform] duration-200",
                  isDragActive ? "-translate-y-1 text-ember" : "text-paper/70"
                )}
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <p className="text-[16px] leading-[1.6] text-paper/80">
                Drag and drop or{" "}
                <span className="mm-underline font-medium text-paper">choose file</span> to
                upload
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-paper/60">
                JPG, PNG, WebP up to 20MB
              </p>
            </>
          )}
        </div>
      </div>
      <Sprockets />
    </div>
  );
}

type PhotoFrameProps = {
  src: string;
  alt: string;
  aspectRatio: number;
  /** 0-100 while a restoration is running; omit when idle. */
  progress?: number;
};

/** The uploaded photo as a print, with the restoring state laid over it. */
export function PhotoFrame({ src, alt, aspectRatio, progress }: PhotoFrameProps) {
  const isRestoring = progress !== undefined;

  return (
    <figure className="mx-auto w-full" style={photoWidthStyle(aspectRatio)}>
      <div className={cn("rounded-[4px] bg-paper-deep p-2 sm:p-3", PRINT_SHADOW)}>
        <div className="relative w-full overflow-hidden bg-ink" style={{ aspectRatio }}>
          <Image
            src={src}
            alt={alt}
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 58vw"
            className={cn(
              "object-cover transition-[filter] duration-300 ease-(--ease-out)",
              isRestoring && "blur-[2px] grayscale-[40%]"
            )}
          />
          {isRestoring && (
            <div
              role="status"
              aria-live="polite"
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink/65 px-6 text-center"
            >
              <p className="font-mono flex items-center gap-2.5 text-[11px] uppercase tracking-[0.22em] text-paper/80">
                <span className="size-1.5 animate-pulse rounded-full bg-ember" aria-hidden="true" />
                Restoring your photo...
              </p>
              <p className="font-serif text-[clamp(3rem,8vw,5rem)] leading-none tracking-[-0.02em] text-paper tabular-nums">
                {Math.round(progress)}%
              </p>
              <Progress value={progress} className="h-1 w-48 max-w-full bg-paper/15" />
            </div>
          )}
        </div>
      </div>
    </figure>
  );
}

/** Shown under the photo when the user has no generations left. */
export function OutOfCreditsNote() {
  return (
    <div className="rounded-[20px] border border-paper/12 bg-surface p-5 sm:p-6">
      <p className="font-mono flex items-center gap-2.5 text-[11px] uppercase tracking-[0.22em] text-ember">
        <span className="size-1.5 rounded-full bg-ember" aria-hidden="true" />
        Out of credits
      </p>
      <p className="mt-3 text-[15px] leading-[1.6] text-paper/70">
        You have <strong className="font-medium text-paper">0 generations</strong> left.
      </p>
      <Button asChild className="mt-4">
        <Link href="/pricing">
          Buy more credits here.
          <ButtonArrow />
        </Link>
      </Button>
    </div>
  );
}
