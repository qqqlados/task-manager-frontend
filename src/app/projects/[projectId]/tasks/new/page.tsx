"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TasksService } from "@/services/tasks.service";
import { TaskPriority } from "@/types/task.type";

const taskSchema = z.object({
	title: z.string().min(2, "Title must be at least 2 characters"),
	description: z.string().optional(),
	assigneeId: z.string().optional(),
	deadline: z.string().optional(),
	priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
});

type TaskForm = z.infer<typeof taskSchema>;

type Props = { params: Promise<{ projectId: string }> };

export default function NewTaskPage({ params }: Props) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [projectId, setProjectId] = useState<string>("");

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TaskForm>({
		resolver: zodResolver(taskSchema),
	});

	useEffect(() => {
		params.then(({ projectId }) => setProjectId(projectId));
	}, [params]);

	const onSubmit = async (data: TaskForm) => {
		setIsLoading(true);
		try {
			const payload = {
				title: data.title,
				description: data.description || null,
				assigneeId: data.assigneeId ? parseInt(data.assigneeId) : null,
				deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
				priority: data.priority || "MEDIUM",
			};

			const response = await TasksService.createTask(projectId, payload);
			if (response.success) {
				toast.success("Task created successfully!");
				router.push(`/projects/${projectId}/tasks`);
			}
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to create task"
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='max-w-2xl mx-auto card bg-base-100 shadow border border-base-200'>
			<div className='card-body'>
				<h1 className='card-title'>Create Task — Project #{projectId}</h1>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='grid grid-cols-1 md:grid-cols-2 gap-4'
				>
					<div className='md:col-span-2'>
						<label className='label'>
							<span className='label-text'>Title</span>
						</label>
						<input
							{...register("title")}
							className={`input input-bordered w-full ${
								errors.title ? "input-error" : ""
							}`}
							placeholder='Task title'
						/>
						{errors.title && (
							<span className='text-error text-sm'>{errors.title.message}</span>
						)}
					</div>
					<div className='md:col-span-2'>
						<label className='label'>
							<span className='label-text'>Description</span>
						</label>
						<textarea
							{...register("description")}
							className='textarea textarea-bordered w-full'
							placeholder='Describe the task'
						/>
					</div>
					<div>
						<label className='label'>
							<span className='label-text'>Assignee ID</span>
						</label>
						<input
							{...register("assigneeId")}
							type='number'
							className='input input-bordered w-full'
							placeholder='User ID'
						/>
					</div>
					<div>
						<label className='label'>
							<span className='label-text'>Deadline</span>
						</label>
						<input
							{...register("deadline")}
							type='date'
							className='input input-bordered w-full'
						/>
					</div>
					<div>
						<label className='label'>
							<span className='label-text'>Priority</span>
						</label>
						<select
							{...register("priority")}
							className='select select-bordered w-full'
							defaultValue='MEDIUM'
						>
							<option value='LOW'>Low</option>
							<option value='MEDIUM'>Medium</option>
							<option value='HIGH'>High</option>
							<option value='URGENT'>Urgent</option>
						</select>
					</div>
					<div className='md:col-span-2 flex justify-end gap-2'>
						<a href={`/projects/${projectId}/tasks`} className='btn btn-ghost'>
							Cancel
						</a>
						<button
							className={`btn btn-primary ${isLoading ? "loading" : ""}`}
							type='submit'
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
