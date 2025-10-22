import { TasksService } from "@/services/tasks.service";
import {
  Pencil,
  FileText,
  Flag,
  Calendar,
  CheckCircle,
  User,
  MessageSquare,
} from "lucide-react";
import { JSX } from "react";

import { ITaskHistory } from "@/types/task.type";

export interface IFormattedHistory {
  date: string;
  text: JSX.Element;
  icon: JSX.Element;
}

type Props = {
  params: {
    projectId: string;
    taskId: string;
  };
};

import { AddTaskCommentForm } from "@/components/forms/add-task-comment-form";
import { formatTaskHistory } from "@/lib/formatTaskHistory";
import { EditDescriptionModal } from "@/components/edit-description-modal";
import { EditDescriptionButton } from "@/components/edit-description-button";

export default async function TaskDetailsPage({ params }: Props) {
  const { projectId, taskId } = await params;
  const taskResponse = await TasksService.getTask(projectId, taskId);
  const task = taskResponse.data;

  const historyStrings = await formatTaskHistory(task.taskHistory ?? []);

  console.log(task.taskHistory);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE: Description + History */}
        <div className="lg:col-span-2 space-y-6">
          {/* DESCRIPTION */}
          <div className="card bg-base-100 shadow border border-base-200 h-[200px]">
            <div className="card-body space-y-3 overflow-y-auto">
              <div className="flex items-center justify-between card-title">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  <span>Description</span>
                </div>
                <EditDescriptionButton />
              </div>
              <p className="text-base-content/70">
                {task.description ?? "No description provided."}
              </p>
            </div>
          </div>

          {/* CHANGE HISTORY */}
          <div className="card bg-base-100 shadow border border-base-200">
            <div className="card-body">
              <h2 className="card-title">Change history</h2>
              <div className="max-h-64 overflow-y-auto rounded-box border border-base-200">
                <ul className="divide-y divide-base-200">
                  {historyStrings.map((line, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 p-3 hover:bg-base-200/50 transition"
                    >
                      {line.icon}
                      <div className="text-sm text-base-content/60 w-24 shrink-0">
                        {line.date}
                      </div>
                      <div className="flex-1 text-base-content">
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

      <EditDescriptionModal
        taskId={taskId}
        projectId={projectId}
        initialDescription={task.description ?? ""}
      />
    </div>
  );
}
