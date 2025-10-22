"use client";

import React, { useState, type ReactNode } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
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
  // Maintain tasks grouped by status for simpler reordering and cross-column moves
  const [columns, setColumns] = useState<Record<TaskStatus, ITask[]>>(() => {
    return groupTasksByStatus(initialTasks);
  });
  const [activeTask, setActiveTask] = useState<ITask | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = getTaskById(Number(active.id));
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = Number(active.id);
    const activeContainer = findContainerForId(activeId);
    const overContainer = findContainerForOver(over.id);

    if (!activeContainer || !overContainer) return;

    // Reorder within the same column
    if (activeContainer === overContainer) {
      const activeIndex = columns[activeContainer].findIndex(
        (t: ITask) => t.id === activeId
      );
      let overIndex: number = activeIndex;
      if (typeof over.id === "number") {
        overIndex = columns[overContainer].findIndex(
          (t: ITask) => t.id === over.id
        );
      } else if (typeof over.id === "string") {
        // Dropped into empty space of the same column; keep position
        overIndex = activeIndex;
      }

      if (activeIndex !== overIndex && activeIndex !== -1 && overIndex !== -1) {
        setColumns((prev: Record<TaskStatus, ITask[]>) => ({
          ...prev,
          [activeContainer]: arrayMove<ITask>(
            prev[activeContainer],
            activeIndex,
            overIndex
          ),
        }));
      }
      return;
    }

    // Move to a different column
    const sourceList = columns[activeContainer];
    const taskIndex = sourceList.findIndex((t: ITask) => t.id === activeId);
    if (taskIndex === -1) return;
    const movedTask = sourceList[taskIndex];

    let targetIndex = columns[overContainer].length; // default append
    if (typeof over.id === "number") {
      const idx = columns[overContainer].findIndex(
        (t: ITask) => t.id === over.id
      );
      if (idx !== -1) targetIndex = idx;
    }

    // Optimistic state update
    setColumns((prev: Record<TaskStatus, ITask[]>) => {
      const next: Record<TaskStatus, ITask[]> = {
        ...prev,
        [activeContainer]: prev[activeContainer].filter(
          (t: ITask) => t.id !== activeId
        ),
        [overContainer]: [
          ...prev[overContainer].slice(0, targetIndex),
          { ...movedTask, status: overContainer },
          ...prev[overContainer].slice(targetIndex),
        ],
      };
      return next;
    });

    try {
      await TasksService.changeStatus({
        projectId,
        taskId: String(activeId),
        newStatus: overContainer,
      });
      toast.success("Task status updated");
    } catch {
      // Revert on error
      setColumns((prev: Record<TaskStatus, ITask[]>) => {
        // Move it back
        const revertedTarget = prev[overContainer].filter(
          (t: ITask) => t.id !== activeId
        );
        const originalTask = { ...movedTask };
        return {
          ...prev,
          [overContainer]: revertedTarget,
          [activeContainer]: [
            ...prev[activeContainer].slice(0, taskIndex),
            originalTask,
            ...prev[activeContainer].slice(taskIndex),
          ],
        };
      });
      toast.error("Failed to update task status");
    }
  };

  const getTasksByStatus = (status: TaskStatus): ITask[] => {
    return columns[status] ?? [];
  };

  const getTaskById = (taskId: number) => {
    for (const status of Object.keys(columns) as TaskStatus[]) {
      const task = columns[status].find((t: ITask) => t.id === taskId);
      if (task) return task;
    }
    return undefined;
  };

  const findContainerForId = (id: number): TaskStatus | null => {
    for (const status of Object.keys(columns) as TaskStatus[]) {
      if (columns[status].some((t: ITask) => t.id === id)) return status;
    }
    return null;
  };

  const findContainerForOver = (overId: unknown): TaskStatus | null => {
    if (typeof overId === "string") {
      // over a column droppable
      if (isKnownStatus(overId)) return overId as TaskStatus;
    }
    if (typeof overId === "number") {
      return findContainerForId(overId);
    }
    return null;
  };

  function isKnownStatus(value: string): value is TaskStatus {
    return (
      value === "TODO" ||
      value === "IN_PROGRESS" ||
      value === "REVIEW" ||
      value === "DONE" ||
      value === "CANCELLED"
    );
  }

  function groupTasksByStatus(all: ITask[]): Record<TaskStatus, ITask[]> {
    const result: Record<TaskStatus, ITask[]> = {
      TODO: [],
      IN_PROGRESS: [],
      REVIEW: [],
      DONE: [],
      CANCELLED: [],
    };
    for (const task of all) {
      if (result[task.status]) {
        result[task.status].push(task);
      }
    }
    return result;
  }

  const KanbanColumn: React.FC<{
    id: TaskStatus;
    title: string;
    color: string;
    items: number[];
    children: ReactNode;
  }> = ({ id, title, color, items, children }) => {
    const { setNodeRef } = useDroppable({ id });
    return (
      <div className="space-y-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <h3 className="font-semibold text-center">
            {title} ({items.length})
          </h3>
        </div>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div ref={setNodeRef} className="space-y-3 min-h-[400px]">
            {children}
          </div>
        </SortableContext>
      </div>
    );
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
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              items={columnTasks.map((task) => task.id)}
            >
              {columnTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </KanbanColumn>
          );
        })}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}
