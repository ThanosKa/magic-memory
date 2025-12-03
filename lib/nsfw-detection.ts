"use client"

import * as nsfwjs from "nsfwjs"

let model: nsfwjs.NSFWJS | null = null
let modelLoading: Promise<nsfwjs.NSFWJS> | null = null

// Load the NSFW model (cached)
export async function loadNSFWModel(): Promise<nsfwjs.NSFWJS> {
  if (model) return model

  if (modelLoading) return modelLoading

  modelLoading = nsfwjs.load().then((loadedModel) => {
    model = loadedModel
    return model
  })

  return modelLoading
}

export interface NSFWResult {
  isNSFW: boolean
  confidence: number
  categories: {
    drawing: number
    hentai: number
    neutral: number
    porn: number
    sexy: number
  }
}

// Check if an image is NSFW
export async function checkImageNSFW(imageElement: HTMLImageElement): Promise<NSFWResult> {
  try {
    const nsfwModel = await loadNSFWModel()
    const predictions = await nsfwModel.classify(imageElement)

    // Convert predictions array to object
    const categories = {
      drawing: 0,
      hentai: 0,
      neutral: 0,
      porn: 0,
      sexy: 0,
    }

    predictions.forEach((pred) => {
      const className = pred.className.toLowerCase() as keyof typeof categories
      if (className in categories) {
        categories[className] = pred.probability
      }
    })

    // Consider NSFW if porn or hentai probability > 0.3 or sexy > 0.5
    const isNSFW = categories.porn > 0.3 || categories.hentai > 0.3 || categories.sexy > 0.5
    const confidence = Math.max(categories.porn, categories.hentai, categories.sexy)

    return {
      isNSFW,
      confidence,
      categories,
    }
  } catch (error) {
    console.error("[NSFW Detection] Error:", error)
    // In case of error, allow the image (fail open)
    return {
      isNSFW: false,
      confidence: 0,
      categories: { drawing: 0, hentai: 0, neutral: 1, porn: 0, sexy: 0 },
    }
  }
}

// Check a file for NSFW content before upload
export async function checkFileNSFW(file: File): Promise<NSFWResult> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = async () => {
      const result = await checkImageNSFW(img)
      URL.revokeObjectURL(img.src)
      resolve(result)
    }

    img.onerror = () => {
      URL.revokeObjectURL(img.src)
      // On error, allow the image
      resolve({
        isNSFW: false,
        confidence: 0,
        categories: { drawing: 0, hentai: 0, neutral: 1, porn: 0, sexy: 0 },
      })
    }

    img.src = URL.createObjectURL(file)
  })
}
