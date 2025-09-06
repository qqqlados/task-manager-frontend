"use client";

import { useEffect, useState } from "react";
import { ProjectsService } from "@/services/projects.service";
import { TasksService } from "@/services/tasks.service";
import { NotificationsService } from "@/services/notifications.service";
import { IProject } from "@/types/project.type";
import { ITask } from "@/types/task.type";
import { INotification } from "@/types/notification.type";

export default function DashboardPage() {
	const [projects, setProjects] = useState<IProject[]>([]);
	const [tasks, setTasks] = useState<ITask[]>([]);
	const [notifications, setNotifications] = useState<INotification[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [projectsRes, notificationsRes] = await Promise.all([
					ProjectsService.getProjects({ page: 1 }),
					NotificationsService.getNotifications({ page: 1 }),
				]);

				setProjects(projectsRes.data);
				setNotifications(notificationsRes.data);

				// Get tasks from first project if available
				if (projectsRes.data.length > 0) {
					const tasksRes = await TasksService.getProjectTasks(
						projectsRes.data[0].id
					);
					setTasks(tasksRes.data);
				}
			} catch (error) {
				console.error("Failed to fetch dashboard data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return (
			<div className='flex items-center justify-center h-64'>
				<span className='loading loading-spinner loading-lg'></span>
			</div>
		);
	}

	const completedTasks = tasks.filter(task => task.status === "DONE").length;
	const totalTasks = tasks.length;
	const progressPercentage =
		totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

	return (
		<div className='space-y-6'>
			<h1 className='text-2xl font-bold'>Dashboard</h1>

			<div className='stats shadow w-full'>
				<div className='stat'>
					<div className='stat-title'>Projects</div>
					<div className='stat-value'>{projects.length}</div>
					<div className='stat-desc'>Active projects</div>
				</div>
				<div className='stat'>
					<div className='stat-title'>Tasks</div>
					<div className='stat-value'>{totalTasks}</div>
					<div className='stat-desc'>{progressPercentage}% done</div>
				</div>
				<div className='stat'>
					<div className='stat-title'>Notifications</div>
					<div className='stat-value'>{notifications.length}</div>
					<div className='stat-desc'>Unread notifications</div>
				</div>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				<div className='card bg-base-100 shadow border border-base-200'>
					<div className='card-body'>
						<h2 className='card-title'>Task Progress</h2>
						<progress
							className='progress progress-primary w-full'
							value={progressPercentage}
							max='100'
						></progress>
						<p className='text-sm text-base-content/70'>
							{completedTasks} of {totalTasks} tasks completed
						</p>
					</div>
				</div>

				<div className='card bg-base-100 shadow border border-base-200'>
					<div className='card-body'>
						<h2 className='card-title'>Upcoming Deadlines</h2>
						<ul className='menu bg-base-100 rounded-box'>
							{tasks
								.filter(
									task => task.deadline && new Date(task.deadline) > new Date()
								)
								.sort(
									(a, b) =>
										new Date(a.deadline!).getTime() -
										new Date(b.deadline!).getTime()
								)
								.slice(0, 3)
								.map(task => (
									<li key={task.id}>
										<a href={`/projects/${task.projectId}/tasks/${task.id}`}>
											{task.title} — due{" "}
											{new Date(task.deadline!).toLocaleDateString()}
										</a>
									</li>
								))}
							{tasks.filter(
								task => task.deadline && new Date(task.deadline) > new Date()
							).length === 0 && (
								<li>
									<span className='text-base-content/60'>
										No upcoming deadlines
									</span>
								</li>
							)}
						</ul>
					</div>
				</div>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				<div className='card bg-base-100 shadow border border-base-200'>
					<div className='card-body'>
						<h2 className='card-title'>Recent Tasks</h2>
						<div className='overflow-x-auto'>
							<table className='table'>
								<thead>
									<tr>
										<th>Task</th>
										<th>Assignee</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
									{tasks.slice(0, 5).map(task => (
										<tr key={task.id}>
											<td>{task.title}</td>
											<td>{task.assignee?.name || "Unassigned"}</td>
											<td>
												<span
													className={`badge ${
														task.status === "DONE"
															? "badge-success"
															: "badge-outline"
													}`}
												>
													{task.status}
												</span>
											</td>
										</tr>
									))}
									{tasks.length === 0 && (
										<tr>
											<td
												colSpan={3}
												className='text-center text-base-content/60'
											>
												No tasks found
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>

				<div className='card bg-base-100 shadow border border-base-200'>
					<div className='card-body'>
						<h2 className='card-title'>Recent Notifications</h2>
						<ul className='timeline timeline-vertical'>
							{notifications.slice(0, 3).map(notification => (
								<li key={notification.id}>
									<div className='timeline-middle'>•</div>
									<div className='timeline-end timeline-box'>
										<div className='font-semibold'>{notification.title}</div>
										<div className='text-sm text-base-content/70'>
											{notification.message}
										</div>
									</div>
								</li>
							))}
							{notifications.length === 0 && (
								<li>
									<div className='timeline-middle'>•</div>
									<div className='timeline-end timeline-box'>
										No recent notifications
									</div>
								</li>
							)}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
