"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ITask } from "@/types/task.type";
import Link from "next/link";

interface TaskCardProps {
	task: ITask;
	isDragging?: boolean;
}

export function TaskCard({ task, isDragging = false }: TaskCardProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging: isSortableDragging,
	} = useSortable({ id: task.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "URGENT":
				return "border-l-red-500";
			case "HIGH":
				return "border-l-orange-500";
			case "MEDIUM":
				return "border-l-yellow-500";
			case "LOW":
				return "border-l-green-500";
			default:
				return "border-l-gray-500";
		}
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className={`card bg-base-100 shadow border-l-4 ${getPriorityColor(
				task.priority
			)} ${isDragging || isSortableDragging ? "opacity-50" : ""} cursor-grab active:cursor-grabbing`}
		>
			<div className="card-body p-4">
				<Link href={`/projects/${task.projectId}/tasks/${task.id}`}>
					<h3 className="card-title text-sm font-medium hover:text-primary">
						{task.title}
					</h3>
				</Link>
				{task.description && (
					<p className="text-xs text-base-content/70 line-clamp-2">
						{task.description}
					</p>
				)}
				<div className="flex justify-between items-center mt-2">
					<div className="flex items-center gap-2">
						{task.assignee && (
							<div className="avatar placeholder">
								<div className="bg-neutral text-neutral-content rounded-full w-6 h-6">
									<span className="text-xs">
										{task.assignee.name?.charAt(0).toUpperCase()}
									</span>
								</div>
							</div>
						)}
						<span className="badge badge-outline badge-xs">
							{task.priority}
						</span>
					</div>
					{task.deadline && (
						<span className="text-xs text-base-content/60">
							{new Date(task.deadline).toLocaleDateString()}
						</span>
					)}
				</div>
			</div>
		</div>
	);
}
