import { INotification } from './notification.type'
import { ITask } from './task.type'
import { IUser } from './user.type'

export interface IComment {
	id: number
	content: string
	createdAt: Date
	updatedAt: Date
	taskId: Pick<ITask, 'id'>
	userId: Pick<IUser, 'id'>

	task?: ITask
	user?: IUser
	notifications?: INotification[]
}
