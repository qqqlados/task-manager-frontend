import { ProjectsTable } from "./projects-table";
import { ProjectsService } from "@/services/projects.service";
import { PaginationComponent } from "./pagination";

export const ProjectsList = async ({
	searchParams,
}: {
	searchParams: { name?: string; status?: string; page?: number };
}) => {
	const { name, status, page } = await searchParams;
	const query = {
		name,
		status,
		page,
	};

	const paginatedProjects = await ProjectsService.getProjects(query);
	console.log(paginatedProjects);
	return (
		<>
			<ProjectsTable projects={paginatedProjects.data} />
			<PaginationComponent
				page={page ?? 1}
				totalPages={paginatedProjects.pagination.totalPages}
			/>
		</>
	);
};
