"use client";

import { TasksService } from "@/services/tasks.service";
import { UsersService } from "@/services/users.service";
import { IProjectMember } from "@/types/project.type";
import {
	ITask,
	IUpdateTask,
	TaskPriority,
	TaskStatus,
} from "@/types/task.type";
import React from "react";

export const EditTaskForm = ({
	projectId,
	task,
	projectMembers,
}: {
	projectId: string;
	task: ITask;
	projectMembers: IProjectMember[];
}) => {
	const handleOnSubmit = async (e: React.FormEvent, formData: FormData) => {
		e.preventDefault();
		const deadlineStr = formData.get("deadline") as string | null;

		const dto: Partial<IUpdateTask> = {
			title: (formData.get("title") as string) ?? undefined,
			description: (formData.get("description") as string) ?? undefined,
			priority: (formData.get("priority") as TaskPriority) ?? undefined,
			deadline: deadlineStr ? new Date(deadlineStr) : undefined,
			assignedTo: Number(formData.get("assignedTo")) ?? undefined,
		};

		console.log(dto);

		await TasksService.updateTask(projectId, task.id.toString(), dto);
	};

	return (
		<form
			className='grid grid-cols-1 md:grid-cols-2 gap-4'
			onSubmit={e => handleOnSubmit(e, new FormData(e.currentTarget))}
		>
			<div className='md:col-span-2'>
				<label className='label'>
					<span className='label-text'>Title</span>
				</label>
				<input
					name='title'
					className='input input-bordered w-full'
					defaultValue={"Setup CI"}
				/>
			</div>
			<div className='md:col-span-2'>
				<label className='label'>
					<span className='label-text'>Description</span>
				</label>
				<textarea
					name='description'
					className='textarea textarea-bordered w-full'
					defaultValue={"Integrate CI pipeline"}
				/>
			</div>
			<div>
				<label className='label'>
					<span className='label-text'>Assignee</span>
				</label>
				<select
					name='assignedTo'
					className='select select-bordered w-full'
					defaultValue={task.assignedTo?.toString() || ""}
				>
					<option value=''>Unassigned</option>
					{projectMembers.map(member => (
						<option key={member.id} value={member.id}>
							{member.name} ({member.email})
						</option>
					))}
				</select>
			</div>
			<div>
				<label className='label'>
					<span className='label-text'>Deadline</span>
				</label>
				<input
					type='date'
					name='deadline'
					className='input input-bordered w-full'
				/>
			</div>
			<div>
				<label className='label'>
					<span className='label-text'>Priority</span>
				</label>
				<select name='priority' className='select select-bordered w-full'>
					<option value='LOW'>Low</option>
					<option value='MEDIUM'>Medium</option>
					<option value='HIGH'>High</option>
				</select>
			</div>
			<div className='md:col-span-2 flex justify-end gap-2'>
				<a
					href={`/projects/${projectId}/tasks/${task.id}`}
					className='btn btn-ghost'
				>
					Cancel
				</a>
				<button className='btn btn-primary' type='submit'>
					Save
				</button>
			</div>
		</form>
	);
};
