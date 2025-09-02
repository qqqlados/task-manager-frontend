'use client'

import { FC } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IProject } from '@/types/project.type'

type ProjectsTableProps = {
	projects: IProject[]
}

export const ProjectsTable: FC<ProjectsTableProps> = ({ projects }) => {
	const router = useRouter()

	const handleOpenProject = (id: string) => {
		router.push(`projects/${id}`)
	}

	const renderProjectsList = () => {
		return (
			<>
				{projects?.map(project => (
					<TableRow className='cursor-pointer' key={project.id} onClick={() => handleOpenProject(project?.id?.toString())}>
						<TableCell className='font-medium'>
							<div className='flex items-center gap-3'>
								<div className='w-[50px] h-[50px] rounded overflow-hidden'>
									<img className='w-full h-full object-cover' src={project?.image} alt='Project logo' width={50} height={50} />
								</div>
								<span>{project?.name}</span>
							</div>
						</TableCell>
						<TableCell>{project?.type}</TableCell>
						<TableCell>{project?.status}</TableCell>
						<TableCell className='text-right'>{project?.lead?.name}</TableCell>
					</TableRow>
				))}
			</>
		)
	}

	return (
		<div>
			<Table>
				<TableCaption>A list of your recent invoices.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className='w-[100px]'>Name</TableHead>
						<TableHead>Type</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className='text-right'>Lead</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>{renderProjectsList()}</TableBody>
			</Table>
		</div>
	)
}
