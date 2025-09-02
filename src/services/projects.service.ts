import { IProject } from '@/types/project.type'
import { http } from '../lib/utils'
import { PaginatedResponse } from '@/types/dto'

export class ProjectsService {
	static async getProjects() {
		const projects = await http<PaginatedResponse<IProject[]>>('/projects', { cache: 'force-cache' })

		console.log('pagination', projects)

		return projects
	}
}
