"use client";

import { useEffect, useState } from "react";
import { TasksService } from "@/services/tasks.service";
import { ITask, TaskPriority, TaskStatus } from "@/types/task.type";
import { KanbanBoard } from "@/components/kanban-board";
import toast from "react-hot-toast";
import { IProject } from "@/types/project.type";

type Props = { params: Promise<{ projectId: string }> };

export default function ProjectTasksPage({ params }: Props) {
	const [projectId, setProjectId] = useState<string>("");
	const [tasks, setTasks] = useState<ITask[]>([]);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState({
		status: "",
		priority: "",
		assigneeId: undefined,
	});

	useEffect(() => {
		params.then(({ projectId }) => {
			setProjectId(projectId);
			fetchTasks(projectId);
		});
	}, [params]);

	const fetchTasks = async (projectId: string) => {
		try {
			const query = {
				status: filters.status ? (filters.status as TaskStatus) : undefined,
				priority: filters.priority ? (filters.priority as TaskPriority) : undefined,
				assigneeId: filters.assigneeId ? Number(filters.assigneeId) : undefined,
			};
			const response = await TasksService.getProjectTasks(Number(projectId), query);
			setTasks(response.data);
		} catch (error) {
			toast.error("Failed to fetch tasks");
		} finally {
			setLoading(false);
		}
	};

	const handleFilterChange = (key: "status" | "priority" | "assigneeId", value: string) => {
		const newFilters = { ...filters, [key]: value };
		setFilters(newFilters);
		fetchTasks(projectId);
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center h-64'>
				<span className='loading loading-spinner loading-lg'></span>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h1 className='text-2xl font-bold'>Tasks — Project #{projectId}</h1>
				<div className='flex items-center gap-2'>
					<a
						href={`/projects/${projectId}/tasks/new`}
						className='btn btn-primary'
					>
						Create task
					</a>
				</div>
			</div>

			<div className='flex gap-3'>
				<select
					className='select select-bordered'
					value={filters.status}
					onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange("status", e.target.value)}
				>
					<option value=''>All Status</option>
					<option value='TODO'>Todo</option>
					<option value='IN_PROGRESS'>In progress</option>
					<option value='REVIEW'>Review</option>
					<option value='DONE'>Done</option>
				</select>
				<select
					className='select select-bordered'
					value={filters.assigneeId}
					onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange("assigneeId", e.target.value)}
				>
					<option value=''>All Assignees</option>
					<option value='1'>User 1</option>
					<option value='2'>User 2</option>
				</select>
				{/* <select
					className='select select-bordered'
					value={filters.due}
					onChange={e => handleFilterChange("due", e.target.value)}
				>
					<option value=''>All Due Dates</option>
					<option value='overdue'>Overdue</option>
					<option value='today'>Today</option>
					<option value='week'>This week</option>
				</select> */}
			</div>

			<KanbanBoard projectId={projectId} initialTasks={tasks} />
		</div>
	);
}

