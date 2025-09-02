import { IUser } from './user.type'

export interface IRefreshToken {
	id: number
	token: string
	userId: Pick<IUser, 'id'>
	expiresAt: Date
	createdAt: Date

	user?: IUser
}
