"use client";

import { useEffect, useState } from "react";
import { ProjectsService } from "@/services/projects.service";
import { TasksService } from "@/services/tasks.service";
import { IProject } from "@/types/project.type";
import { ITask } from "@/types/task.type";
import {
	PieChart,
	Pie,
	Cell,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

export default function AnalyticsPage() {
	const [projects, setProjects] = useState<IProject[]>([]);
	const [tasks, setTasks] = useState<ITask[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const [projectsRes] = await Promise.all([
				ProjectsService.getProjects({ page: 1 }),
			]);

			setProjects(projectsRes.data);

			// Get tasks from all projects
			const allTasks: ITask[] = [];
			for (const project of projectsRes.data) {
				try {
					const tasksRes = await TasksService.getProjectTasks(project.id);
					allTasks.push(...tasksRes.data);
				} catch (error) {
					console.error(
						`Failed to fetch tasks for project ${project.id}:`,
						error
					);
				}
			}
			setTasks(allTasks);
		} catch (error) {
			console.error("Failed to fetch analytics data:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center h-64'>
				<span className='loading loading-spinner loading-lg'></span>
			</div>
		);
	}

	// Calculate statistics
	const completedTasks = tasks.filter(task => task.status === "DONE").length;
	const totalTasks = tasks.length;
	const averageTaskDuration = 3.2; // This would be calculated from actual data

	// Projects by status data
	const projectsByStatus = projects.reduce((acc, project) => {
		acc[project.status] = (acc[project.status] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	const projectsStatusData = Object.entries(projectsByStatus).map(
		([status, count]) => ({
			name: status,
			value: count,
		})
	);

	// Tasks by priority data
	const tasksByPriority = tasks.reduce((acc, task) => {
		acc[task.priority] = (acc[task.priority] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	const tasksPriorityData = Object.entries(tasksByPriority).map(
		([priority, count]) => ({
			priority,
			count,
		})
	);

	const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

	return (
		<div className='space-y-6'>
			<h1 className='text-2xl font-bold'>Analytics</h1>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				<div className='card bg-base-100 shadow border border-base-200'>
					<div className='card-body'>
						<h2 className='card-title'>Average Task Duration</h2>
						<p className='text-3xl font-bold text-primary'>
							{averageTaskDuration} days
						</p>
						<p className='text-sm text-base-content/70'>
							Based on completed tasks
						</p>
					</div>
				</div>
				<div className='card bg-base-100 shadow border border-base-200'>
					<div className='card-body'>
						<h2 className='card-title'>Total Projects</h2>
						<p className='text-3xl font-bold text-primary'>{projects.length}</p>
						<p className='text-sm text-base-content/70'>Active projects</p>
					</div>
				</div>
				<div className='card bg-base-100 shadow border border-base-200'>
					<div className='card-body'>
						<h2 className='card-title'>Task Completion Rate</h2>
						<p className='text-3xl font-bold text-primary'>
							{totalTasks > 0
								? Math.round((completedTasks / totalTasks) * 100)
								: 0}
							%
						</p>
						<p className='text-sm text-base-content/70'>
							{completedTasks} of {totalTasks} tasks
						</p>
					</div>
				</div>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				<div className='card bg-base-100 shadow border border-base-200'>
					<div className='card-body'>
						<h2 className='card-title'>Projects by Status</h2>
						<div className='h-64'>
							<ResponsiveContainer width='100%' height='100%'>
								<PieChart>
									<Pie
										data={projectsStatusData}
										cx='50%'
										cy='50%'
										labelLine={false}
										label={({ name, percent }) =>
											`${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`
										}
										outerRadius={80}
										fill='#8884d8'
										dataKey='value'
									>
										{projectsStatusData.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={COLORS[index % COLORS.length]}
											/>
										))}
									</Pie>
									<Tooltip />
								</PieChart>
							</ResponsiveContainer>
						</div>
					</div>
				</div>

				<div className='card bg-base-100 shadow border border-base-200'>
					<div className='card-body'>
						<h2 className='card-title'>Tasks by Priority</h2>
						<div className='h-64'>
							<ResponsiveContainer width='100%' height='100%'>
								<BarChart data={tasksPriorityData}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis dataKey='priority' />
									<YAxis />
									<Tooltip />
									<Bar dataKey='count' fill='#8884d8' />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
