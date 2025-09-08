import { EditTaskForm } from "@/components/forms/edit-task-form";
import { ProjectMembersService } from "@/services/project-members.service";
import { ProjectsService } from "@/services/projects.service";
import { TasksService } from "@/services/tasks.service";

type Props = { params: Promise<{ projectId: string; taskId: string }> };

export default async function EditTaskPage({ params }: Props) {
	const { projectId, taskId } = await params;

	const members = await ProjectMembersService.getMembers(projectId);
	const task = await TasksService.getTask(projectId, taskId);

	return (
		<div className='max-w-2xl mx-auto card bg-base-100 shadow border border-base-200'>
			<div className='card-body'>
				<h1 className='card-title'>
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-5'>
						<path d='M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712Z' />
						<path d='M19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z' />
					</svg>
					<span>Edit Task #{taskId}</span>
				</h1>
				<EditTaskForm
					projectId={projectId}
					task={task.data}
					projectMembers={members.data}
				/>
			</div>
		</div>
	);
}
