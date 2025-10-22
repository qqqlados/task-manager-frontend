"use client";

import { useState, useRef, useEffect } from "react";
import { TasksService } from "@/services/tasks.service";
import toast from "react-hot-toast";

interface EditDescriptionModalProps {
  taskId: string;
  projectId: string;
  initialDescription: string;
}

export function EditDescriptionModal({
  taskId,
  projectId,
  initialDescription,
}: EditDescriptionModalProps) {
  const [description, setDescription] = useState(initialDescription);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // === Handle paste (Ctrl+V) ===
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          if (file) handleImageUpload(file);
        }
      }
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener("paste", handlePaste);
      return () => textarea.removeEventListener("paste", handlePaste);
    }
  }, []);

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setImages((prev) => [...prev, file]);
      const url = URL.createObjectURL(file);
      setImageUrls((prev) => [...prev, url]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) Array.from(files).forEach((file) => handleImageUpload(file));
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imageUrls[index]);
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const insertImageAtCursor = (imageUrl: string, fileName: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const textBefore = description.substring(0, cursorPos);
    const textAfter = description.substring(cursorPos);
    const imageMarkdown = `![${fileName}](${imageUrl})\n`;

    setDescription(textBefore + imageMarkdown + textAfter);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        cursorPos + imageMarkdown.length,
        cursorPos + imageMarkdown.length
      );
    }, 0);
  };

  const handleSaveDescription = async () => {
    try {
      const uploadedImageUrls: string[] = [];

      for (const image of images) {
        uploadedImageUrls.push(URL.createObjectURL(image));
      }

      let finalDescription = description;
      imageUrls.forEach((blobUrl, index) => {
        if (uploadedImageUrls[index]) {
          finalDescription = finalDescription.replace(
            blobUrl,
            uploadedImageUrls[index]
          );
        }
      });

      await TasksService.updateTask(projectId, taskId, {
        description: finalDescription,
      });

      toast.success("Description updated successfully!");
      (
        document.getElementById("edit-description-modal") as HTMLDialogElement
      )?.close();
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update description");
      console.error(error);
    }
  };

  return (
    <dialog id="edit-description-modal" className="modal">
      <div className="modal-box w-11/12 max-w-5xl h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Edit Description</h3>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              multiple
              onChange={handleFileSelect}
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              ➕ Add Image
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Thumbnails */}
          {imageUrls.length > 0 && (
            <div className="flex gap-2 mb-4 flex-wrap">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Preview ${index}`}
                    className="w-40 h-40 object-cover rounded border cursor-pointer hover:opacity-80"
                    onClick={() => setPreviewUrl(url)}
                    title="Click to preview"
                  />
                  <button
                    className="absolute -top-2 -right-2 btn btn-circle btn-xs btn-error opacity-0 group-hover:opacity-100"
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Description textarea */}
          <textarea
            ref={textareaRef}
            className="
              textarea textarea-bordered flex-1 w-full resize-none 
              focus:outline-none focus:ring-0 focus:border-transparent
              rounded-lg p-3 text-base leading-relaxed
            "
            placeholder="Enter task description... (Ctrl+V to paste images)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-ghost">Cancel</button>
            <button className="btn btn-primary" onClick={handleSaveDescription}>
              Save Changes
            </button>
          </form>
        </div>
      </div>

      {/* Backdrop */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>

      {/* Image preview modal */}
      {previewUrl && (
        <dialog
          open
          className="modal modal-open"
          onClick={() => setPreviewUrl(null)}
        >
          <div className="modal-box max-w-5xl bg-base-200">
            <img
              src={previewUrl}
              alt="Preview large"
              className="max-h-[80vh] w-auto mx-auto rounded-lg"
            />
            <div className="modal-action">
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                Open in new tab
              </a>
              <button className="btn" onClick={() => setPreviewUrl(null)}>
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </dialog>
  );
}
