"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { ProjectsService } from "@/services/projects.service";

const projectSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	description: z.string().optional(),
	deadline: z.string().optional(),
	members: z.string().optional(),
});

type ProjectForm = z.infer<typeof projectSchema>;

export default function NewProjectPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ProjectForm>({
		resolver: zodResolver(projectSchema),
	});

	const onSubmit = async (data: ProjectForm) => {
		setIsLoading(true);
		try {
			const payload = {
				name: data.name,
				description: data.description || null,
				deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
				members: data.members ? data.members.split(",").map(email => email.trim()) : [],
			};
			
			const response = await ProjectsService.createProject(payload);
			if (response.success) {
				toast.success("Project created successfully!");
				router.push("/projects");
			}
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to create project");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto card bg-base-100 shadow border border-base-200">
			<div className="card-body">
				<h1 className="card-title">Create Project</h1>
				<form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="md:col-span-2">
						<label className="label"><span className="label-text">Name</span></label>
						<input
							{...register("name")}
							className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`}
							placeholder="Project name"
						/>
						{errors.name && (
							<span className="text-error text-sm">{errors.name.message}</span>
						)}
					</div>
					<div className="md:col-span-2">
						<label className="label"><span className="label-text">Description</span></label>
						<textarea
							{...register("description")}
							className="textarea textarea-bordered w-full"
							placeholder="Short description"
						/>
					</div>
					<div>
						<label className="label"><span className="label-text">Deadline</span></label>
						<input
							{...register("deadline")}
							type="date"
							className="input input-bordered w-full"
						/>
					</div>
					<div>
						<label className="label"><span className="label-text">Members (emails)</span></label>
						<input
							{...register("members")}
							className="input input-bordered w-full"
							placeholder="Comma-separated emails"
						/>
					</div>
					<div className="md:col-span-2">
						<label className="label"><span className="label-text">Attachments / Links</span></label>
						<input className="file-input file-input-bordered w-full" type="file" multiple />
					</div>
					<div className="md:col-span-2 flex justify-end gap-2">
						<a href="/projects" className="btn btn-ghost">Cancel</a>
						<button
							className={`btn btn-primary ${isLoading ? "loading" : ""}`}
							type="submit"
							disabled={isLoading}
						>
							{isLoading ? "Creating..." : "Create"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
