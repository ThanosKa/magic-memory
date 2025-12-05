"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageComparisonSliderProps {
  originalImage: string
  restoredImage: string
  originalAlt?: string
  restoredAlt?: string
  className?: string
}

export function ImageComparisonSlider({
  originalImage,
  restoredImage,
  originalAlt = "Original photo",
  restoredAlt = "Restored photo",
  className,
}: ImageComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }, [])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)
      handleMove(e.clientX)
    },
    [handleMove],
  )

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true)
      handleMove(e.touches[0].clientX)
    },
    [handleMove],
  )

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        handleMove(e.touches[0].clientX)
      }
    }

    const handleEnd = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleEnd)
      window.addEventListener("touchmove", handleTouchMove)
      window.addEventListener("touchend", handleEnd)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleEnd)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleEnd)
    }
  }, [isDragging, handleMove])

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-square w-full cursor-ew-resize select-none overflow-hidden",
        className,
      )}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Restored Image (Background - Full) */}
      <div className="absolute inset-0">
        <Image
          src={restoredImage || "/placeholder.svg"}
          alt={restoredAlt}
          fill
          className="object-cover"
          crossOrigin="anonymous"
        />
        {/* Label */}
        <div className="absolute bottom-4 right-4 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow-lg">
          Restored
        </div>
      </div>

      {/* Original Image (Foreground - Clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
        <Image
          src={originalImage || "/placeholder.svg"}
          alt={originalAlt}
          fill
          className="object-cover"
          crossOrigin="anonymous"
        />
        {/* Label */}
        <div className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm shadow-lg">
          Original
        </div>
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 z-10 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
      >
        {/* Handle Circle */}
        <div className="absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-primary shadow-lg">
          <svg
            className="h-4 w-4 text-primary-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
          </svg>
        </div>
      </div>

      {/* Instructions overlay (shown briefly) */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className={cn(
            "rounded-lg bg-black/60 px-4 py-2 text-sm text-white transition-opacity duration-500",
            isDragging ? "opacity-0" : "opacity-100",
          )}
        >
          Drag to compare
        </div>
      </div>
    </div>
  )
}
