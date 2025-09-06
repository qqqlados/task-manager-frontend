import { IUserNotification } from "./notification.type";
import { IProject, IProjectMember } from "./project.type";
import { IRefreshToken } from "./refreshToken.type";
import { ITask } from "./task.type";

const UserRole = {
	USER: "USER",
	ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface IUser {
	id: number;
	email: string;
	password: string;
	name?: string;
	role: UserRole;
	isActive: boolean;
	emailVerified: boolean;
	createdAt: Date;
	updatedAt: Date;

	createdProjects?: IProject[];
	projectMembers?: IProjectMember[];
	assignedTasks?: ITask[];
	createdTasks?: ITask[];
	comments?: Comment[];
	userNotifications?: IUserNotification[];
	refreshTokens?: IRefreshToken[];
}
