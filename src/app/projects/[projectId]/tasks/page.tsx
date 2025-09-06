"use client";

import { useEffect, useState } from "react";
import { TasksService } from "@/services/tasks.service";
import { ITask, TaskPriority, TaskStatus } from "@/types/task.type";
import { KanbanBoard } from "@/components/kanban-board";
import toast from "react-hot-toast";
import { ProjectsService } from "@/services/projects.service";

type FilterState = {
	status: string;
	priority: string;
	assigneeId: string;
};

type Props = { params: Promise<{ projectId: string }> };

export default function ProjectTasksPage({ params }: Props) {
	const [projectId, setProjectId] = useState<string>("");
	const [tasks, setTasks] = useState<ITask[]>([]);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState<FilterState>({
		status: "",
		priority: "",
		assigneeId: "",
	});
	const [assignees, setAssignees] = useState<{ id: number; name: string }[]>(
		[]
	);

	useEffect(() => {
		params.then(async ({ projectId }) => {
			setProjectId(projectId);
			await Promise.all([fetchAssignees(projectId), fetchTasks(projectId)]);
		});
	}, [params]);

	useEffect(() => {
		if (!projectId) return;
		fetchTasks(projectId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filters, projectId]);

	const fetchTasks = async (projectId: string) => {
		try {
			setLoading(true);
			const query = {
				status: filters.status ? (filters.status as TaskStatus) : undefined,
				priority: filters.priority
					? (filters.priority as TaskPriority)
					: undefined,
				assigneeId: filters.assigneeId ? Number(filters.assigneeId) : undefined,
			};
			const response = await TasksService.getProjectTasks(
				Number(projectId),
				query
			);
			setTasks(response.data);
		} catch (error) {
			toast.error("Failed to fetch tasks");
		} finally {
			setLoading(false);
		}
	};

	const fetchAssignees = async (projectId: string) => {
		try {
			const projectResponse = await ProjectsService.getProject(projectId);

			const members = projectResponse.data?.members ?? [];
			console.log(projectResponse);
			const mapped = members
				.map(m => ({
					id: m.user?.id ?? (m.userId as unknown as number),
					name: m.user?.name ?? `User #${m.userId}`,
				}))
				.filter(a => !!a.id && !!a.name);
			setAssignees(mapped);
		} catch (error) {
			// Ignore assignees load errors for now
		}
	};

	const handleFilterChange = (
		key: "status" | "priority" | "assigneeId",
		value: string
	) => {
		setFilters((prev: FilterState) => ({ ...prev, [key]: value }));
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
					onChange={(_e: any) => handleFilterChange("status", _e.target.value)}
				>
					<option value=''>All Status</option>
					<option value='TODO'>Todo</option>
					<option value='IN_PROGRESS'>In progress</option>
					<option value='REVIEW'>Review</option>
					<option value='DONE'>Done</option>
				</select>
				<select
					className='select select-bordered'
					value={filters.priority}
					onChange={(_e: any) =>
						handleFilterChange("priority", _e.target.value)
					}
				>
					<option value=''>All Priority</option>
					<option value='LOW'>Low</option>
					<option value='MEDIUM'>Medium</option>
					<option value='HIGH'>High</option>
					<option value='URGENT'>Urgent</option>
				</select>
				<select
					className='select select-bordered'
					value={filters.assigneeId}
					onChange={(_e: any) =>
						handleFilterChange("assigneeId", _e.target.value)
					}
				>
					<option value=''>All Assignees</option>
					{assignees.map((a: { id: number; name: string }) => (
						<option key={a.id} value={a.id.toString()}>
							{a.name}
						</option>
					))}
				</select>
			</div>

			<KanbanBoard projectId={projectId} initialTasks={tasks} />
		</div>
	);
}
