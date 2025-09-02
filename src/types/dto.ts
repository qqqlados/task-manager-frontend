type Pagination = {
	limit: number
	page: number
	total: number
	totalPages: number
}

export interface ApiResponse<Data> {
	success: boolean
	message: string
	data: Data
	timestamp: Date
}

export type PaginatedResponse<Data> = {
	pagination: Pagination
} & ApiResponse<Data>
