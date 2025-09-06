"use client";

import { useEffect, useState } from "react";
import { ProjectsService } from "@/services/projects.service";
import { IProject } from "@/types/project.type";
import toast from "react-hot-toast";

export default function AdminProjectsPage() {
	const [projects, setProjects] = useState<IProject[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchProjects();
	}, []);

	const fetchProjects = async () => {
		try {
			const response = await ProjectsService.getProjects({ page: 1 });
			setProjects(response.data);
		} catch (error) {
			toast.error("Failed to fetch projects");
		} finally {
			setLoading(false);
		}
	};

	const handleStatusChange = async (projectId: number, newStatus: string) => {
		try {
			await ProjectsService.updateProject(projectId, { status: newStatus });
			toast.success("Project status updated");
			fetchProjects();
		} catch (error) {
			toast.error("Failed to update project status");
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<span className="loading loading-spinner loading-lg"></span>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Admin — Projects</h1>
			<div className="overflow-x-auto border border-base-200 rounded-box">
				<table className="table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Owner</th>
							<th>Type</th>
							<th>Status</th>
							<th>Created</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{projects.map((project) => (
							<tr key={project.id}>
								<td>
									<div className="flex items-center gap-3">
										<div className="avatar">
											<div className="mask mask-squircle w-10 h-10">
												<img src={project.image} alt={project.name} />
											</div>
										</div>
										<div>
											<div className="font-bold">{project.name}</div>
											<div className="text-sm opacity-50">ID: {project.id}</div>
										</div>
									</div>
								</td>
								<td>
									<div className="flex items-center gap-2">
										<div className="avatar placeholder">
											<div className="bg-neutral text-neutral-content rounded-full w-6 h-6">
												<span className="text-xs">
													{project.lead.name?.charAt(0).toUpperCase()}
												</span>
											</div>
										</div>
										<span>{project.lead.name}</span>
									</div>
								</td>
								<td>
									<span className="badge badge-ghost">{project.type}</span>
								</td>
								<td>
									<select
										className="select select-bordered select-sm"
										value={project.status}
										onChange={(e) => handleStatusChange(project.id, e.target.value)}
									>
										<option value="ACTIVE">Active</option>
										<option value="COMPLETED">Completed</option>
										<option value="ARCHIVED">Archived</option>
										<option value="CANCELLED">Cancelled</option>
									</select>
								</td>
								<td>
									{new Date(project.createdAt).toLocaleDateString()}
								</td>
								<td>
									<a
										className="btn btn-ghost btn-sm"
										href={`/projects/${project.id}`}
									>
										Open
									</a>
								</td>
							</tr>
						))}
						{projects.length === 0 && (
							<tr>
								<td colSpan={6} className="text-center text-base-content/60">
									No projects found
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
