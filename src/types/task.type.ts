import { IProject } from './project.type'
import { IUser } from './user.type'

const TaskStatus = {
	TODO: 'TODO',
	IN_PROGRESS: 'IN_PROGRESS',
	REVIEW: 'REVIEW',
	DONE: 'DONE',
	CANCELLED: 'CANCELLED',
} as const

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus]

const TaskPriority = {
	LOW: 'LOW',
	MEDIUM: 'MEDIUM',
	HIGH: 'HIGH',
	URGENT: 'URGENT',
} as const

export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority]

export interface ITask {
	id: number
	title: string
	description?: string | null
	status: TaskStatus
	priority: TaskPriority
	deadline?: Date | null
	createdAt: Date
	updatedAt: Date
	projectId: Pick<IProject, 'id'>
	createdBy: number
	assignedTo?: number | null

	project?: IProject
	creator?: IUser
	assignee?: IUser | null
	comments?: Comment[]
	notifications?: Notification[]
}
