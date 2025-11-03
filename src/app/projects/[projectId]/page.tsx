import { ProjectsService } from '@/services/projects.service';
import { TasksService } from '@/services/tasks.service';
import ProjectDetails from './project-details';

type Props = { params: Promise<{ projectId: string }> };

export default async function ProjectDetailsPage({ params }: Props) {
  const { projectId } = await params;

  const [projectResponse, tasksResponse] = await Promise.all([ProjectsService.getProject(projectId), TasksService.getProjectTasks(projectId)]);

  const project = projectResponse.data;
  const tasks = tasksResponse.data;

  return <ProjectDetails project={project} tasks={tasks} />;
}
