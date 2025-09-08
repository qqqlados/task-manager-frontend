import { TasksService } from "@/services/tasks.service";
import { formatActionTaskStrings, formatSnakeCase } from "@/lib/utils";
import { UsersService } from "@/services/users.service";

type Props = { params: Promise<{ projectId: string; taskId: string }> };

export default async function TaskDetailsPage({ params }: Props) {
	const { projectId, taskId } = await params;

	const taskResponse = await TasksService.getTask(projectId, taskId);
	const task = taskResponse.data;

	const historyStrings = formatActionTaskStrings(task.taskHistory ?? []);

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h1 className='text-2xl font-bold'>Task #{taskId}</h1>
				<a className='btn' href={`/projects/${projectId}/tasks/${taskId}/edit`}>
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-4'>
						<path d='M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712Z' />
						<path d='M19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z' />
					</svg>
					<span>Edit</span>
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
							<b>Due:</b>{" "}
							{task.deadline
								? new Date(task.deadline).toLocaleDateString()
								: "—"}
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
					<div className='max-h-64 overflow-y-auto rounded-box border border-base-200'>
						<ul className='timeline timeline-vertical p-4'>
							{historyStrings.map((line, i) => (
								<li key={i}>
									<div className='timeline-start'>{line}</div>
									<div className='timeline-middle'>
										<span className='badge badge-primary'></span>
									</div>
									{ i !== historyStrings.length - 1 && <hr /> }
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
