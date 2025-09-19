import { TasksService } from "@/services/tasks.service";
import {
	Pencil,
	FileText,
	Flag,
	Calendar,
	CheckCircle,
	User,
	Edit3,
	MessageSquare,
} from "lucide-react";
import { JSX } from "react";

import { ITaskHistory } from "@/types/task.type";

export interface IFormattedHistory {
	date: string;
	text: JSX.Element;
	icon: JSX.Element;
}

export const formatActionTaskStrings = (
	history: ITaskHistory[]
): IFormattedHistory[] => {
	if (!history || history.length === 0) return [];

	return history.map(el => {
		const userName = el.user?.name ?? el.user?.email ?? "Unknown user";

		const bold = (text: string | null | undefined) =>
			text ? <b>{text}</b> : null;

		const date = new Date(el.createdAt).toLocaleDateString();

		let text: JSX.Element;
		let icon: JSX.Element;

		switch (el.action) {
			case "TITLE_CHANGED":
				text = (
					<>
						<b>{userName}</b> changed task title from {bold(el.oldValue)} to{" "}
						{bold(el.newValue)}
					</>
				);
				icon = <Pencil className='w-4 h-4 text-blue-500' />;
				break;

			case "DESCRIPTION_CHANGED":
				text = (
					<>
						<b>{userName}</b> updated description
					</>
				);
				icon = <FileText className='w-4 h-4 text-purple-500' />;
				break;

			case "PRIORITY_CHANGED":
				text = (
					<>
						<b>{userName}</b> changed priority from {bold(el.oldValue)} to{" "}
						{bold(el.newValue)}
					</>
				);
				icon = <Flag className='w-4 h-4 text-red-500' />;
				break;

			case "DEADLINE_CHANGED":
				text = (
					<>
						<b>{userName}</b> changed deadline from {bold(el.oldValue)} to{" "}
						{bold(el.newValue)}
					</>
				);
				icon = <Calendar className='w-4 h-4 text-amber-500' />;
				break;

			case "STATUS_CHANGED":
				text = (
					<>
						<b>{userName}</b> changed status from {bold(el.oldValue)} to{" "}
						{bold(el.newValue)}
					</>
				);
				icon = <CheckCircle className='w-4 h-4 text-green-500' />;
				break;

			case "ASSIGNEE_CHANGED":
				text = (
					<>
						<b>{userName}</b> reassigned task from {bold(el.oldValue)} to{" "}
						{bold(el.newValue)}
					</>
				);
				icon = <User className='w-4 h-4 text-pink-500' />;
				break;

			default:
				text = (
					<>
						<b>{userName}</b> made changes
					</>
				);
				icon = <Edit3 className='w-4 h-4 text-gray-500' />;
		}

		return { date, text, icon };
	});
};

type Props = {
	params: {
		projectId: string;
		taskId: string;
	};
};

import { AddTaskCommentForm } from "@/components/forms/add-task-comment-form";

export default async function TaskDetailsPage({ params }: Props) {
	const { projectId, taskId } = await params;
	const taskResponse = await TasksService.getTask(projectId, taskId);
	const task = taskResponse.data;

	const historyStrings = formatActionTaskStrings(task.taskHistory ?? []);

	return (
		<div className='space-y-6'>
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* LEFT SIDE: Description + History */}
				<div className='lg:col-span-2 space-y-6'>
					{/* DESCRIPTION */}
					<div className='card bg-base-100 shadow border border-base-200 h-[200px]'>
						<div className='card-body space-y-3 overflow-y-auto'>
							<div className='flex items-center gap-2 card-title'>
								<FileText className='w-5 h-5 text-purple-500' />
								<span>Description</span>
							</div>
							<p className='text-base-content/70'>
								{task.description ?? "No description provided."}
							</p>
						</div>
					</div>

					{/* CHANGE HISTORY */}
					<div className='card bg-base-100 shadow border border-base-200'>
						<div className='card-body'>
							<h2 className='card-title'>Change history</h2>
							<div className='max-h-64 overflow-y-auto rounded-box border border-base-200'>
								<ul className='divide-y divide-base-200'>
									{historyStrings.map((line, i) => (
										<li
											key={i}
											className='flex items-start gap-3 p-3 hover:bg-base-200/50 transition'
										>
											{line.icon}
											<div className='text-sm text-base-content/60 w-24 shrink-0'>
												{line.date}
											</div>
											<div className='flex-1 text-base-content'>
												{line.text}
											</div>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>

				<AddTaskCommentForm task={task} projectId={projectId.toString()} />
			</div>
		</div>
	);
}
