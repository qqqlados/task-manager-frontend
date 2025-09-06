"use client";

import { useState, useEffect } from "react";
import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskCard } from "./task-card";
import { ITask, TaskStatus } from "@/types/task.type";
import { TasksService } from "@/services/tasks.service";
import toast from "react-hot-toast";

interface KanbanBoardProps {
	projectId: string;
	initialTasks: ITask[];
}

const statusColumns: { id: TaskStatus; title: string; color: string }[] = [
	{ id: "TODO", title: "To Do", color: "bg-gray-100" },
	{ id: "IN_PROGRESS", title: "In Progress", color: "bg-blue-100" },
	{ id: "REVIEW", title: "Review", color: "bg-yellow-100" },
	{ id: "DONE", title: "Done", color: "bg-green-100" },
];

export function KanbanBoard({ projectId, initialTasks }: KanbanBoardProps) {
	const [tasks, setTasks] = useState<ITask[]>(initialTasks);
	const [activeTask, setActiveTask] = useState<ITask | null>(null);
	const [loading, setLoading] = useState(false);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		})
	);

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		const task = tasks.find((t) => t.id === active.id);
		setActiveTask(task || null);
	};

	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveTask(null);

		if (!over) return;

		const taskId = active.id as number;
		const newStatus = over.id as TaskStatus;
		const task = tasks.find((t) => t.id === taskId);

		if (!task || task.status === newStatus) return;

		// Optimistic update
		setTasks((prevTasks) =>
			prevTasks.map((t) =>
				t.id === taskId ? { ...t, status: newStatus } : t
			)
		);

		try {
			await TasksService.changeStatus(projectId, taskId.toString(), newStatus);
			toast.success("Task status updated");
		} catch (error) {
			// Revert on error
			setTasks((prevTasks) =>
				prevTasks.map((t) =>
					t.id === taskId ? { ...t, status: task.status } : t
				)
			);
			toast.error("Failed to update task status");
		}
	};

	const getTasksByStatus = (status: TaskStatus) => {
		return tasks.filter((task) => task.status === status);
	};

	return (
		<DndContext
			sensors={sensors}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{statusColumns.map((column) => {
					const columnTasks = getTasksByStatus(column.id);
					return (
						<div key={column.id} className="space-y-4">
							<div className={`p-3 rounded-lg ${column.color}`}>
								<h3 className="font-semibold text-center">
									{column.title} ({columnTasks.length})
								</h3>
							</div>
							<SortableContext
								items={columnTasks.map((task) => task.id)}
								strategy={verticalListSortingStrategy}
							>
								<div className="space-y-3 min-h-[400px]">
									{columnTasks.map((task) => (
										<TaskCard key={task.id} task={task} />
									))}
								</div>
							</SortableContext>
						</div>
					);
				})}
			</div>
			<DragOverlay>
				{activeTask ? <TaskCard task={activeTask} isDragging /> : null}
			</DragOverlay>
		</DndContext>
	);
}
