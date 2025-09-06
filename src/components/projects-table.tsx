"use client";

import { FC } from "react";
import { IProject } from "@/types/project.type";
import { useRouter } from "next/navigation";
import { formatSnakeCase } from "@/lib/utils";

type ProjectsTableProps = {
	projects: IProject[];
};

export const ProjectsTable: FC<ProjectsTableProps> = ({ projects }) => {
	const router = useRouter();

	const handleOpenProject = (id: string) => {
		router.push(`projects/${id}`);
	};

	return (
		<div className='flex flex-col justify-between gap-5 flex-1 h-full'>
			<div className='overflow-x-auto rounded-box border border-base-300'>
				<table className='table'>
					{/* <caption className='table-caption text-base-content/70 p-4'>
						A list of your projects.
					</caption> */}
					<thead>
						<tr>
							<th>Name</th>
							<th>Type</th>
							<th>Status</th>
							<th className='text-right'>Lead</th>
						</tr>
					</thead>
					<tbody>
						{projects?.map(project => (
							<tr
								key={project.id}
								className='cursor-pointer hover'
								onClick={() => handleOpenProject(project?.id?.toString())}
							>
								<td>
									<div className='flex items-center gap-3'>
										<div className='avatar'>
											<div className='mask mask-squircle w-12 h-12'>
												<img src={project?.image} alt='Project logo' />
											</div>
										</div>
										<div>
											<div className='font-bold'>{project?.name}</div>
										</div>
									</div>
								</td>
								<td>{formatSnakeCase(project?.type)}</td>
								<td>
									<span className='badge badge-ghost uppercase'>
										{project?.status}
									</span>
								</td>
								<td className='text-right'>{project?.lead?.name}</td>
							</tr>
						))}
						{!projects?.length && (
							<tr>
								<td colSpan={4} className='text-center text-base-content/60'>
									No projects found
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};
