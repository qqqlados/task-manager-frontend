import { IComment } from "./comment.type";
import { INotification } from "./notification.type";
import { IProject } from "./project.type";
import { IUser } from "./user.type";

const TaskStatus = {
	TODO: "TODO",
	IN_PROGRESS: "IN_PROGRESS",
	REVIEW: "REVIEW",
	DONE: "DONE",
	CANCELLED: "CANCELLED",
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

const TaskPriority = {
	LOW: "LOW",
	MEDIUM: "MEDIUM",
	HIGH: "HIGH",
	URGENT: "URGENT",
} as const;

export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];

const TaskAction = {
	CREATED: "CREATED",
	TITLE_CHANGED: "TITLE_CHANGED",
	DESCRIPTION_CHANGED: "DESCRIPTION_CHANGED",
	STATUS_CHANGED: "STATUS_CHANGED",
	PRIORITY_CHANGED: "PRIORITY_CHANGED",
	ASSIGNEE_CHANGED: "ASSIGNEE_CHANGED",
	DEADLINE_CHANGED: "DEADLINE_CHANGED",
	COMMENT_ADDED: "COMMENT_ADDED",
	COMMENT_DELETED: "COMMENT_DELETED",
} as const;

export type TaskAction = (typeof TaskAction)[keyof typeof TaskAction];

export interface ITaskHistory {
	id: number;
	taskId: number;
	userId: number;
	action: TaskAction;
	oldValue?: string | null;
	newValue?: string | null;
	createdAt: Date;
	user: {
		id: number;
		name?: string | null;
		email: string;
	};
}

export interface ITask {
	id: number;
	title: string;
	description?: string | null;
	status: TaskStatus;
	priority: TaskPriority;
	deadline?: Date | null;
	createdAt: Date;
	updatedAt: Date;
	projectId: number;
	createdBy: number;
	assignedTo?: number | null;

	project?: IProject;
	creator?: IUser;
	assignee?: IUser | null;
	comments?: IComment[];
	notifications?: INotification[];
	taskHistory?: ITaskHistory[];
}

export interface IUpdateTask {
	title: string;
	description: string | null;
	priority: TaskPriority;
	deadline: Date | null;
	assignedTo: number;
}
