"use client"

import { useState } from "react"
import { Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

interface ImageUploaderProps {
  onUpload: (url: string) => void
  currentImage?: string | null
}

export function ImageUploader({ onUpload, currentImage }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage ?? null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const supabase = createClient()
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`

    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (error) {
      console.error("Upload error:", error)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(data.path)

    const publicUrl = urlData.publicUrl
    setPreview(publicUrl)
    onUpload(publicUrl)
    setUploading(false)
  }

  function removeImage() {
    setPreview(null)
    onUpload("")
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Image
      </label>

      {preview ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-700">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 hover:border-pink-500 dark:border-zinc-700 dark:hover:border-pink-500">
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
          ) : (
            <>
              <Upload className="mb-2 h-8 w-8 text-zinc-400" />
              <span className="text-sm text-zinc-500">Click to upload image</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
            disabled={uploading}
          />
        </label>
      )}
    </div>
  )
}
