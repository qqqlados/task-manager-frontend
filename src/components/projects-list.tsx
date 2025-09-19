import { ProjectsService } from "@/services/projects.service";
import { PaginationComponent } from "./pagination";
import { formatSnakeCase } from "@/lib/utils";
import Link from "next/link";

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
	const projects = paginatedProjects.data;
	return (
		<>
			<div className='flex flex-col justify-between gap-5 flex-1 h-full'>
				<div className='rounded-box border border-base-300'>
					{projects?.length ? (
						<ul className='menu w-full'>
							{projects.map(project => (
								<li key={project.id}>
									<Link
										href={`projects/${project.id}`}
										className='flex items-center gap-4 py-3'
									>
										<div className='avatar'>
											<div className='mask mask-squircle w-12 h-12'>
												<img src={project?.image} alt='Project logo' />
											</div>
										</div>
										<div className='flex-1'>
											<div className='font-semibold'>{project?.name}</div>
											<div className='text-sm text-base-content/60'>
												{formatSnakeCase(project?.type)}
											</div>
										</div>
										<div className='flex items-center gap-2'>
											<span className='badge badge-ghost uppercase'>
												{project?.status}
											</span>
											{project?.lead?.name && (
												<span className='badge badge-outline'>
													{project.lead.name}
												</span>
											)}
										</div>
									</Link>
								</li>
							))}
						</ul>
					) : (
						<div className='p-6 text-center text-base-content/60'>
							No projects found
						</div>
					)}
				</div>
			</div>

			<PaginationComponent
				page={page ?? 1}
				totalPages={paginatedProjects.pagination.totalPages}
			/>
		</>
	);
};
