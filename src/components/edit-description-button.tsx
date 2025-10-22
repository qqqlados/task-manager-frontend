"use client";

import { Edit3 } from "lucide-react";

export function EditDescriptionButton() {
  const handleEditClick = () => {
    const modal = document.getElementById(
      "edit-description-modal"
    ) as HTMLDialogElement;
    modal?.showModal();
  };

  return (
    <button className="btn btn-ghost btn-sm" onClick={handleEditClick}>
      <Edit3 className="w-4 h-4" />
    </button>
  );
}
