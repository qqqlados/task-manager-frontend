import { ProjectsList } from '@/components/projects-list'
import { SearchInput } from '@/components/ui/search-input'
import { FC, Suspense } from 'react'

const ProjectsPage: FC = () => {
	return (
		<div>
			<SearchInput />

			<Suspense fallback={<div>Loading...</div>}>
				<ProjectsList />
			</Suspense>
		</div>
	)
}

export default ProjectsPage
