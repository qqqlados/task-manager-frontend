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
				<h1 className='card-title'>Edit Task #{taskId}</h1>
				<EditTaskForm
					projectId={projectId}
					task={task.data}
					projectMembers={members.data}
				/>
			</div>
		</div>
	);
}
