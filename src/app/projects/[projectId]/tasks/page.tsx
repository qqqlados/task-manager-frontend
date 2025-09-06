"use client";

import { useEffect, useState } from "react";
import { TasksService } from "@/services/tasks.service";
import { ITask, TaskStatus } from "@/types/task.type";
import { KanbanBoard } from "@/components/kanban-board";
import toast from "react-hot-toast";
import { IProject } from "@/types/project.type";

type Props = { params: Promise<{ projectId: string }> };

export default function ProjectTasksPage({ params }: Props) {
	const [projectId, setProjectId] = useState<string>("");
	const [tasks, setTasks] = useState<ITask[]>([]);
	const [loading, setLoading] = useState(true);
	const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
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

	const fetchTasks = async (projectId: Pick<IProject, "id">) => {
		try {
			const response = await TasksService.getProjectTasks(projectId, filters);
			setTasks(response.data);
		} catch (error) {
			toast.error("Failed to fetch tasks");
		} finally {
			setLoading(false);
		}
	};

	const handleFilterChange = (key: string, value: string) => {
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
					<div className='tabs tabs-boxed'>
						<button
							className={`tab ${viewMode === "kanban" ? "tab-active" : ""}`}
							onClick={() => setViewMode("kanban")}
						>
							Kanban
						</button>
						<button
							className={`tab ${viewMode === "table" ? "tab-active" : ""}`}
							onClick={() => setViewMode("table")}
						>
							Table
						</button>
					</div>
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
					onChange={e => handleFilterChange("status", e.target.value)}
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
					onChange={e => handleFilterChange("assigneeId", e.target.value)}
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

			{viewMode === "kanban" ? (
				<KanbanBoard projectId={projectId} initialTasks={tasks} />
			) : (
				<div className='overflow-x-auto border border-base-200 rounded-box'>
					<table className='table'>
						<thead>
							<tr>
								<th>Title</th>
								<th>Assignee</th>
								<th>Due</th>
								<th>Status</th>
								<th>Priority</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{tasks.map(task => (
								<tr key={task.id}>
									<td>
										<a
											href={`/projects/${projectId}/tasks/${task.id}`}
											className='link link-hover'
										>
											{task.title}
										</a>
									</td>
									<td>{task.assignee?.name || "Unassigned"}</td>
									<td>
										{task.deadline
											? new Date(task.deadline).toLocaleDateString()
											: "No deadline"}
									</td>
									<td>
										<span className='badge badge-outline'>{task.status}</span>
									</td>
									<td>
										<span className='badge badge-ghost'>{task.priority}</span>
									</td>
									<td>
										<a
											className='btn btn-ghost btn-sm'
											href={`/projects/${projectId}/tasks/${task.id}`}
										>
											Open
										</a>
									</td>
								</tr>
							))}
							{tasks.length === 0 && (
								<tr>
									<td colSpan={6} className='text-center text-base-content/60'>
										No tasks found
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
