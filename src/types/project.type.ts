import { ITask } from "./task.type";
import { IUser } from "./user.type";

export type Image = {
	src: string;
	alt: string;
};

const ProjectStatus = {
	ACTIVE: "ACTIVE",
	COMPLETED: "COMPLETED",
	ARCHIVED: "ARCHIVED",
	CANCELLED: "CANCELLED",
} as const;

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export type ProjectType =
	| "SOFTWARE_DEVELOPMENT"
	| "MOBILE_APP"
	| "WEBSITE_REDESIGN"
	| "MARKETING_CAMPAIGN"
	| "RESEARCH"
	| "INTERNAL_TOOL"
	| "MAINTENANCE";

export interface IProject {
	id: number;
	name: string;
	image: string;
	description?: string | null;
	type: ProjectType;
	status: ProjectStatus;
	deadline?: Date | null;
	createdAt: Date;
	updatedAt: Date;
	createdBy: number;

	lead: IUser;
	creator: IUser;
	members: IProjectMember[];
	tasks: ITask[];
	notifications: Notification[];
}

export interface IProjectMember extends IUser {}
