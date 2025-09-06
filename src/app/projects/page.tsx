import { ProjectsList } from "@/components/projects-list";
import { CreateProjectModal } from "@/components/ui/modals/create-project";
import { SearchInput } from "@/components/search-input";
import { FC, Suspense } from "react";

const ProjectsPage = async ({
	searchParams,
}: {
	searchParams: { name?: string; status?: string; page?: number };
}) => {
	const { name, status, page } = await searchParams;

	return (
		<div className='flex flex-col gap-7 flex-1 h-full'>
			<SearchInput />

			<Suspense key={name || status || page} fallback={<div>Loading...</div>}>
				<ProjectsList searchParams={searchParams} />
			</Suspense>

			<CreateProjectModal />
		</div>
	);
};

export default ProjectsPage;
