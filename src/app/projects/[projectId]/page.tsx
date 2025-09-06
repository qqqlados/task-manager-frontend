import { ProjectsService } from "@/services/projects.service";
import { TasksService } from "@/services/tasks.service";
import { formatSnakeCase } from "@/lib/utils";

type Props = { params: Promise<{ projectId: string }> };

export default async function ProjectDetailsPage({ params }: Props) {
	const { projectId } = await params;

	const [projectResponse, tasksResponse] = await Promise.all([
		ProjectsService.getProject(projectId),
		TasksService.getProjectTasks(projectId),
	]);

	const project = projectResponse.data;
	const tasks = tasksResponse.data;

	const totalTasks = tasks.length;
	const doneTasks = tasks.filter(t => t.status === "DONE").length;
	const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h1 className='text-2xl font-bold'>Project #{projectId}</h1>
				<div className='flex gap-2'>
					<a href={`/projects/${projectId}/edit`} className='btn'>
						Edit
					</a>
					<button className='btn btn-error'>Delete</button>
				</div>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				<div className='lg:col-span-2 card bg-base-100 shadow border border-base-200'>
					<div className='card-body'>
						<h2 className='card-title'>Description</h2>
						<p className='text-base-content/70'>
							{project.description ?? "No description provided."}
						</p>
					</div>
				</div>
				<div className='card bg-base-100 shadow border border-base-200'>
					<div className='card-body'>
						<h2 className='card-title'>Meta</h2>
						<p>
							<b>Deadline:</b>{" "}
							{project.deadline ? new Date(project.deadline).toLocaleDateString() : "—"}
						</p>
						<p>
							<b>Status:</b>{" "}
							<span className='badge badge-outline'>
								{formatSnakeCase(project.status)}
							</span>
						</p>
						<p>
							<b>Members:</b> {project.members ? project.members.length : 0}
						</p>
					</div>
				</div>
			</div>

			<div className='card bg-base-100 shadow border border-base-200'>
				<div className='card-body'>
					<h2 className='card-title'>Task Progress</h2>
					<progress
						className='progress progress-primary w-full'
						value={progress}
						max='100'
					></progress>
					<div className='text-sm text-base-content/60 mt-2'>
						{doneTasks} of {totalTasks} tasks done ({progress}%)
					</div>
				</div>
			</div>

			<div className='card bg-base-100 shadow border border-base-200'>
				<div className='card-body'>
					<h2 className='card-title'>Tasks</h2>
					<div className='overflow-x-auto'>
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
										<td>{task.assignee?.name ?? "Unassigned"}</td>
										<td>{task.deadline ? new Date(task.deadline).toLocaleDateString() : "No deadline"}</td>
										<td>
											<span className='badge badge-outline'>
												{formatSnakeCase(task.status)}
											</span>
										</td>
										<td>
											<span className='badge badge-ghost'>
												{formatSnakeCase(task.priority)}
											</span>
										</td>
										<td>
											<a className='btn btn-ghost btn-sm' href={`/projects/${projectId}/tasks/${task.id}`}>
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
				</div>
			</div>
		</div>
	);
}

