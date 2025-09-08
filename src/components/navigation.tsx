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
				<div className='flex-1'>
					<a className='btn btn-ghost text-lg font-semibold' href='/dashboard'>
						TaskManager
					</a>
				</div>
				<div className='flex-none'>
					<ul className='menu menu-horizontal px-1'>
						<li>
							<a href='/dashboard'>Dashboard</a>
						</li>
						<li>
							<details>
								<summary>Projects</summary>
								<ul className='p-2 bg-base-100 rounded-t-none'>
									<li>
										<a href='/projects'>All Projects</a>
									</li>
									<li>
										<a onClick={() => showModal("create-project")}>Create Project</a>
									</li>
								</ul>
							</details>
						</li>
						<li>
							<a href='/notifications'>Notifications</a>
						</li>
						<li>
							<details>
								<summary>Admin</summary>
								<ul className='p-2 bg-base-100 rounded-t-none'>
									<li>
										<a href='/admin/users'>Users</a>
									</li>
									<li>
										<a href='/admin/projects'>Projects</a>
									</li>
								</ul>
							</details>
						</li>
						<li>
							<a href='/analytics'>Analytics</a>
						</li>
						<li>
							<details>
								<summary>Account</summary>
								<ul className='p-2 bg-base-100 rounded-t-none'>
									<li>
										<a href='/profile'>Profile</a>
									</li>
									<li>
										<a className='text-error' onClick={handleLogout}>Logout</a>
									</li>
								</ul>
							</details>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
