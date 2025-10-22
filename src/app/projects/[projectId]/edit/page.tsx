"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ProjectsService } from "@/services/projects.service";
import { ProjectType } from "@/types/project.type";

const projectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum([
    "SOFTWARE_DEVELOPMENT",
    "MOBILE_APP",
    "WEBSITE_REDESIGN",
    "MARKETING_CAMPAIGN",
    "RESEARCH",
    "INTERNAL_TOOL",
    "MAINTENANCE",
  ]),
  description: z.string().optional(),
  deadline: z.string().optional(),
  status: z.enum(["ACTIVE", "COMPLETED", "ARCHIVED", "CANCELLED"]),
});

type ProjectForm = z.infer<typeof projectSchema>;

type Props = { params: Promise<{ projectId: string }> };

export default function EditProjectPage({ params }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [projectId, setProjectId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { projectId } = await params;
        setProjectId(projectId);

        const response = await ProjectsService.getProject(projectId);
        const project = response.data;

        // Prefill form fields
        setValue("name", project.name);
        setValue("type", project.type);
        setValue("description", project.description || "");
        setValue(
          "deadline",
          project.deadline
            ? new Date(project.deadline).toISOString().split("T")[0]
            : ""
        );
        setValue("status", project.status);
      } catch (error) {
        toast.error("Failed to load project data");
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [params, setValue]);

  const onSubmit = async (data: ProjectForm) => {
    if (!projectId) return;
    setIsLoading(true);
    try {
      const payload = {
        name: data.name,
        type: data.type as ProjectType,
        description: data.description || null,
        deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
        status: data.status,
      };

      const response = await ProjectsService.updateProject(projectId, payload);
      if (response.success) {
        toast.success("Project updated successfully!");
        router.push(`/projects/${projectId}`);
      } else {
        toast.error("Failed to update project");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto card bg-base-100 shadow border border-base-200">
      <div className="card-body">
        <h1 className="card-title mb-4">Edit Project</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Name */}
          <div className="md:col-span-2">
            <label className="label">
              <span className="label-text font-medium">Project Name *</span>
            </label>
            <input
              {...register("name")}
              className={`input input-bordered w-full ${
                errors.name ? "input-error" : ""
              }`}
              placeholder="Enter project name"
            />
            {errors.name && (
              <span className="text-error text-sm">{errors.name.message}</span>
            )}
          </div>

          {/* Type */}
          <div className="md:col-span-2">
            <label className="label">
              <span className="label-text font-medium">Project Type *</span>
            </label>
            <select
              {...register("type")}
              className={`select select-bordered w-full ${
                errors.type ? "select-error" : ""
              }`}
            >
              <option value="SOFTWARE_DEVELOPMENT">Software Development</option>
              <option value="MOBILE_APP">Mobile App</option>
              <option value="WEBSITE_REDESIGN">Website Redesign</option>
              <option value="MARKETING_CAMPAIGN">Marketing Campaign</option>
              <option value="RESEARCH">Research</option>
              <option value="INTERNAL_TOOL">Internal Tool</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
            {errors.type && (
              <span className="text-error text-sm">{errors.type.message}</span>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="label">
              <span className="label-text font-medium">Description</span>
            </label>
            <textarea
              {...register("description")}
              className={`textarea textarea-bordered w-full h-24 resize-none ${
                errors.description ? "textarea-error" : ""
              }`}
              placeholder="Enter project description (optional)"
            />
            {errors.description && (
              <span className="text-error text-sm">
                {errors.description.message}
              </span>
            )}
          </div>

          {/* Deadline */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Deadline</span>
            </label>
            <input
              type="date"
              {...register("deadline")}
              className={`input input-bordered w-full ${
                errors.deadline ? "input-error" : ""
              }`}
            />
            {errors.deadline && (
              <span className="text-error text-sm">
                {errors.deadline.message}
              </span>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Status</span>
            </label>
            <select
              {...register("status")}
              className={`select select-bordered w-full ${
                errors.status ? "select-error" : ""
              }`}
            >
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            {errors.status && (
              <span className="text-error text-sm">
                {errors.status.message}
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex justify-end gap-2 mt-2">
            <a href={`/projects/${projectId}`} className="btn btn-ghost">
              Cancel
            </a>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
