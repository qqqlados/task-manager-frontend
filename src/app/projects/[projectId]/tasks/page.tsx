"use client";

import { useEffect, useState } from "react";
import { TasksService } from "@/services/tasks.service";
import { ITask, TaskPriority, TaskStatus } from "@/types/task.type";
import { KanbanBoard } from "@/components/kanban-board";
import toast from "react-hot-toast";
import { ProjectsService } from "@/services/projects.service";
import { capitalize } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProjectMembersService } from "@/services/project-members.service";

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

	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

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
			const projectResponse = await ProjectMembersService.getMembers(projectId);

			const members = projectResponse.data ?? [];
			const mapped = members
				.map(m => ({
					id: m?.id ?? (m.id as unknown as number),
					name: m?.name ?? `User #${m.id}`,
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
		const params = new URLSearchParams(searchParams.toString());

		if (value) {
			params.set(key, value);
		} else {
			params.delete(key);
		}

		router.replace(`${pathname}?${params.toString()}`);
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center h-64'>
				<span className='loading loading-spinner loading-lg'></span>
			</div>
		);
	}

	const statusesArr = Array.from(new Set(tasks.map(task => task.status)));

	const prioritiesArr = Array.from(new Set(tasks.map(task => task.priority)));

	const shouldFilterAssigneesByRenderedTasks = Boolean(
		searchParams.get("status") || searchParams.get("priority")
	);

	const renderedAssigneeIdsSet = new Set(
		tasks
			.map(t => (t.assignedTo ?? t.assignee?.id) as number | undefined)
			.filter((id): id is number => typeof id === "number")
	);

	const assigneesForSelect = shouldFilterAssigneesByRenderedTasks
		? assignees.filter(a => renderedAssigneeIdsSet.has(a.id))
		: assignees;

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h1 className='text-2xl font-bold'>Tasks — Project #{projectId}</h1>
				<div className='flex items-center gap-2'>
					<a
						href={`/projects/${projectId}/tasks/new`}
						className='btn btn-primary'
					>
						<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='size-4'>
							<path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
						</svg>
						<span>Create task</span>
					</a>
				</div>
			</div>

			<div className='flex gap-3'>
				<select
					className='select select-bordered'
					value={filters.status}
					onChange={(_e: any) => handleFilterChange("status", _e.target.value)}
				>
					{statusesArr.length > 1 && <option value=''>All Status</option>}
					{statusesArr.map(status => (
						<option key={status} value={status}>
							{capitalize(status)}
						</option>
					))}
				</select>
				<select
					className='select select-bordered'
					value={filters.priority}
					onChange={(_e: any) =>
						handleFilterChange("priority", _e.target.value)
					}
				>
					{prioritiesArr.length > 1 && <option value=''>All Priorities</option>}
					{prioritiesArr.map(pr => (
						<option key={pr} value={pr}>
							{capitalize(pr)}
						</option>
					))}
				</select>
				<select
					className='select select-bordered'
					value={filters.assigneeId}
					onChange={(_e: any) =>
						handleFilterChange("assigneeId", _e.target.value)
					}
				>
					{assigneesForSelect.length > 1 && (
						<option value=''>All Assignees</option>
					)}
					{assigneesForSelect.map((a: { id: number; name: string }) => (
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
