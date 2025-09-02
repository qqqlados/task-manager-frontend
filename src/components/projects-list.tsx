import { FC } from 'react'
import { ProjectsTable } from './projects-table'
import { ProjectsService } from '@/services/projects.service'

export const ProjectsList: FC = async () => {
	const paginatedProjects = await ProjectsService.getProjects()
	return <ProjectsTable projects={paginatedProjects.data} />
}
