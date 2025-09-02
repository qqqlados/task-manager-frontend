"use client";

import * as React from "react";
import Link from "next/link";

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function Navigation() {
	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Projects</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className='grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
							<li className='row-span-3'>
								<NavigationMenuLink asChild>
									<a
										className='from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md'
										href='/projects'
									>
										<div className='mt-4 mb-2 text-lg font-medium'>
											Manage your projects
										</div>
										<p className='text-muted-foreground text-sm leading-tight'>
											View all projects, create a new one, or jump back into
											your recent work.
										</p>
									</a>
								</NavigationMenuLink>
							</li>
							<ListItem href='/projects' title='All Projects'>
								Browse and manage all projects in one place.
							</ListItem>
							<ListItem href='/projects/new' title='Create Project'>
								Start a new project and invite collaborators.
							</ListItem>
							<ListItem href='#' title='Recently Viewed'>
								Quick access to projects you opened recently.
							</ListItem>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Filters</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className='grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]'>
							<ListItem href='#' title='All'>
								Show all items without filtering.
							</ListItem>
							<ListItem href='#' title='Active'>
								Tasks and projects that are in progress.
							</ListItem>
							<ListItem href='#' title='Completed'>
								Only completed tasks and finished projects.
							</ListItem>
							<ListItem href='#' title='By Assignee'>
								Filter by team member responsible.
							</ListItem>
							<ListItem href='#' title='By Priority'>
								Narrow down by priority levels.
							</ListItem>
							<ListItem href='#' title='By Due Date'>
								Focus on upcoming or overdue items.
							</ListItem>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
						<Link href='/'>Home</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}

function ListItem({
	title,
	children,
	href,
	...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
	return (
		<li {...props}>
			<NavigationMenuLink asChild>
				<Link href={href}>
					<div className='text-sm leading-none font-medium'>{title}</div>
					<p className='text-muted-foreground line-clamp-2 text-sm leading-snug'>
						{children}
					</p>
				</Link>
			</NavigationMenuLink>
		</li>
	);
}
