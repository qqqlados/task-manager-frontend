import { IComment } from "./comment.type";
import { IProject } from "./project.type";
import { ITask } from "./task.type";
import { IUser } from "./user.type";

const NotificationType = {
	TASK_ASSIGNED: "TASK_ASSIGNED",
	TASK_STATUS_CHANGED: "TASK_STATUS_CHANGED",
	DEADLINE_APPROACHING: "DEADLINE_APPROACHING",
	PROJECT_INVITATION: "PROJECT_INVITATION",
	TASK_COMMENT: "TASK_COMMENT",
} as const;

export type NotificationType =
	(typeof NotificationType)[keyof typeof NotificationType];

export interface INotification {
	id: number;
	type: NotificationType;
	title: string;
	message: string;
	createdAt: Date;
	taskId?: Pick<ITask, "id"> | null;
	projectId?: Pick<IProject, "id"> | null;
	commentId?: Pick<IComment, "id"> | null;

	userNotifications?: IUserNotification[];
	project?: IProject | null;
	task?: ITask | null;
	comment?: Comment | null;
}

export interface IUserNotification {
	id: number;
	userId: Pick<IUser, "id">;
	notificationId: Pick<INotification, "id">;
	isRead: boolean;
	createdAt: Date;

	user?: IUser;
	notification?: INotification;
}
