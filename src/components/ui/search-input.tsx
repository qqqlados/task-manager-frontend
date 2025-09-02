'use client'

import { FC, useState } from 'react'
import Form from 'next/form'
import { ProjectsService } from '@/services/projects.service'
import { Input } from './input'
import { Button } from './button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from './dropdown-menu'

// type SearchInputProps = {
// 	action: string
// }

export const SearchInput: FC = () => {
	const [search, setSearch] = useState('')

	return (
		<Form action={''} className='flex gap-2 grow-0 shrink-0'>
			<Input name='query' type='text' placeholder={'Enter the project name'} value={search} onChange={e => setSearch(e.target.value)} />

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant='outline'>Open</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className='w-56' align='start'>
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuGroup>
						<DropdownMenuItem>
							Profile
							<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuItem>
							Billing
							<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuItem>
							Settings
							<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>

			<Button type='submit'>Search</Button>
		</Form>
	)
}
