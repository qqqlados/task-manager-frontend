"use client";

import * as React from "react";
import { showModal } from "@/lib/utils";
import { deleteCookie } from "@/lib/cookies";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function Navigation() {
	const router = useRouter();

	const handleLogout = () => {
		deleteCookie("accessToken");
		deleteCookie("refreshToken");
		deleteCookie("user");
		toast.success("Logged out successfully");
		router.push("/auth/login");
	};

	return (
		<div className='relative z-50 h-14 flex items-center justify-center mb-5'>
			<div className='navbar bg-base-100 rounded-box shadow-sm border border-base-200 w-full max-w-3xl'>
				<div className='navbar-start'>
					<a className='btn btn-ghost text-lg font-semibold' href='/dashboard'>
						Dashboard
					</a>
					<a className='btn btn-ghost' href='/projects'>
						Projects
					</a>
					<a className='btn btn-ghost' href='/notifications'>
						Notifications
					</a>
					<a className='btn btn-ghost' href='/analytics'>
						Analytics
					</a>
				</div>
				<div className='navbar-end'>
					<div className='dropdown dropdown-end'>
						<div tabIndex={0} role='button' className='btn btn-outline'>
							Menu
						</div>
						<ul
							tabIndex={0}
							className='dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow'
						>
							<li>
								<a href='/profile'>Profile</a>
							</li>
							<li>
								<a onClick={() => showModal("create-project")}>
									Create Project
								</a>
							</li>
							<li>
								<a href='/admin/users'>Admin Users</a>
							</li>
							<li>
								<a href='/admin/projects'>Admin Projects</a>
							</li>
							<div className='divider'></div>
							<li>
								<a onClick={handleLogout} className='text-error'>
									Logout
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
