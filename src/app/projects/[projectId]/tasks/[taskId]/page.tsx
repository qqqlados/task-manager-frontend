import { TasksService } from "@/services/tasks.service";
import { formatSnakeCase } from "@/lib/utils";

type Props = { params: Promise<{ projectId: string; taskId: string }> };

export default async function TaskDetailsPage({ params }: Props) {
	const { projectId, taskId } = await params;

	const taskResponse = await TasksService.getTask(projectId, taskId);
	const task = taskResponse.data;

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h1 className='text-2xl font-bold'>Task #{taskId}</h1>
				<a className='btn' href={`/projects/${projectId}/tasks/${taskId}/edit`}>
					Edit
				</a>
			</div>
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				<div className='lg:col-span-2 card bg-base-100 shadow border border-base-200'>
					<div className='card-body'>
						<h2 className='card-title'>Description</h2>
						<p className='text-base-content/70'>
							{task.description ?? "No description provided."}
						</p>
					</div>
				</div>
				<div className='card bg-base-100 shadow border border-base-200'>
					<div className='card-body'>
						<h2 className='card-title'>Meta</h2>
						<p>
							<b>Assignee:</b> {task.assignee?.name ?? "Unassigned"}
						</p>
						<p>
							<b>Due:</b> {task.deadline ? new Date(task.deadline).toLocaleDateString() : "—"}
						</p>
						<p>
							<b>Status:</b>{" "}
							<span className='badge badge-outline'>
								{formatSnakeCase(task.status)}
							</span>
						</p>
						<p>
							<b>Priority:</b>{" "}
							<span className='badge badge-ghost'>
								{formatSnakeCase(task.priority)}
							</span>
						</p>
					</div>
				</div>
			</div>
			<div className='card bg-base-100 shadow border border-base-200'>
				<div className='card-body'>
					<h2 className='card-title'>Change history</h2>
					<ul className='menu'>
						<li>
							<a>Created at: {new Date(task.createdAt).toLocaleString()}</a>
						</li>
						<li>
							<a>Updated at: {new Date(task.updatedAt).toLocaleString()}</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

