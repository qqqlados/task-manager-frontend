import { IFormattedHistory } from "@/app/projects/[projectId]/tasks/[taskId]/page";
import { ITaskHistory } from "@/types/task.type";
import {
  Calendar,
  CheckCircle,
  Edit3,
  FileText,
  Flag,
  Pencil,
  SpeakerIcon,
  User,
} from "lucide-react";
import { JSX } from "react";
import { getCookies } from "./cookies";

export const formatTaskHistory = async (
  history: ITaskHistory[]
): Promise<IFormattedHistory[]> => {
  const currentUsername = JSON.parse(localStorage.getItem("user")!).name;

  if (!history || history.length === 0) return [];

  return history.map((el) => {
    const userName = el.user?.name ?? el.user?.email ?? "Unknown user";

    const authorUsername = userName === currentUsername ? "Me" : userName;

    const bold = (text: string | null | undefined) =>
      text ? <b>{text}</b> : null;

    const date = new Date(el.createdAt).toLocaleDateString();

    let text: JSX.Element;
    let icon: JSX.Element;

    switch (el.action) {
      case "TITLE_CHANGED":
        text = (
          <>
            <b>{authorUsername}</b> changed task title from {bold(el.oldValue)}{" "}
            to {bold(el.newValue)}
          </>
        );
        icon = <Pencil className="w-4 h-4 text-blue-500" />;
        break;

      case "DESCRIPTION_CHANGED":
        text = (
          <>
            <b>{authorUsername}</b> updated description
          </>
        );
        icon = <FileText className="w-4 h-4 text-purple-500" />;
        break;

      case "PRIORITY_CHANGED":
        text = (
          <>
            <b>{authorUsername}</b> changed priority from {bold(el.oldValue)} to{" "}
            {bold(el.newValue)}
          </>
        );
        icon = <Flag className="w-4 h-4 text-red-500" />;
        break;

      case "DEADLINE_CHANGED":
        text = (
          <>
            <b>{authorUsername}</b> changed deadline from {bold(el.oldValue)} to{" "}
            {bold(el.newValue)}
          </>
        );
        icon = <Calendar className="w-4 h-4 text-amber-500" />;
        break;

      case "STATUS_CHANGED":
        text = (
          <>
            <b>{authorUsername}</b> changed status from {bold(el.oldValue)} to{" "}
            {bold(el.newValue)}
          </>
        );
        icon = <CheckCircle className="w-4 h-4 text-green-500" />;
        break;

      case "ASSIGNEE_CHANGED":
        text = (
          <>
            <b>{userName}</b> reassigned task from {bold(el.oldValue)} to{" "}
            {bold(el.newValue)}
          </>
        );
        icon = <User className="w-4 h-4 text-pink-500" />;
        break;
      case "COMMENT_ADDED":
        text = (
          <>
            <b>{authorUsername}</b> commented {`"${el.newValue}"`}
          </>
        );
        icon = <SpeakerIcon className="w-4 h-4" />;
        break;
      default:
        text = (
          <>
            <b>{authorUsername}</b> made changes
          </>
        );
        icon = <Edit3 className="w-4 h-4 text-gray-500" />;
    }

    return { date, text, icon };
  });
};
