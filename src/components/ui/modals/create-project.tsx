"use client";

import { Modal } from "@/components/modal";
import { closeModal } from "@/lib/utils";
import { FC, useEffect, useState } from "react";
import { ProjectsService } from "@/services/projects.service";
import { ProjectType } from "@/types/project.type";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { IUser } from "@/types/user.type";

export const CreateProjectModal: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    deadline: "",
    type: "SOFTWARE_DEVELOPMENT" as ProjectType,
  });
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  const projectTypes: { value: ProjectType; label: string }[] = [
    { value: "SOFTWARE_DEVELOPMENT", label: "Software Development" },
    { value: "MOBILE_APP", label: "Mobile App" },
    { value: "WEBSITE_REDESIGN", label: "Website Redesign" },
    { value: "MARKETING_CAMPAIGN", label: "Marketing Campaign" },
    { value: "RESEARCH", label: "Research" },
    { value: "INTERNAL_TOOL", label: "Internal Tool" },
    { value: "MAINTENANCE", label: "Maintenance" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description || null,
        deadline: formData.deadline
          ? new Date(formData.deadline).toISOString()
          : null,
        type: formData.type,
        memberIds: [user!.id],
      };

      await ProjectsService.createProject(payload);
      toast.success("Project created successfully!");
      closeModal("create-project");

      // Reset form
      setFormData({
        name: "",
        description: "",
        deadline: "",
        type: "SOFTWARE_DEVELOPMENT",
      });

      // Refresh the page to show the new project
      router.refresh();
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal id="create-project" title="Create New Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Project Name */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Project Name *</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter project name"
            className="input input-bordered w-full"
            required
            disabled={isLoading}
          />
        </div>

        {/* Project Type */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Project Type *</span>
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="select select-bordered w-full"
            required
            disabled={isLoading}
          >
            {projectTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Description</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter project description (optional)"
            className="textarea textarea-bordered w-full h-24 resize-none"
            disabled={isLoading}
          />
        </div>

        {/* Deadline */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Deadline</span>
          </label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            disabled={isLoading}
          />
        </div>

        {/* Action Buttons */}
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => closeModal("create-project")}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || !formData.name.trim()}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Creating...
              </>
            ) : (
              "Create Project"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
