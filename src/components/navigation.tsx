"use client";

import * as React from "react";
import useSWR from "swr";
import { Bell, CheckCircle, X } from "lucide-react";
import {
	BellIcon,
	notificationTypeToIcon,
} from "./ui/buttons/notification-buttons";
import { INotification } from "@/types/notification.type";
import { NotificationsService } from "@/services/notifications.service";
import { showModal } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { deleteCookie } from "@/lib/cookies";
import toast from "react-hot-toast";

const notificationsFetcher = async (): Promise<INotification[]> => {
	const notifications = await NotificationsService.getNotifications();

	return notifications.data;
};

export function Navigation() {
	const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);
	const [dates, setDates] = React.useState<string[]>([]);

	const router = useRouter();

	const { data, error, isLoading } = useSWR<INotification[]>(
		"/notifications",
		notificationsFetcher
	);

	React.useEffect(() => {
		if (data) {
			setDates(data.map(el => new Date(el.createdAt).toLocaleString()));
		}
	}, [data]);

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
										<a onClick={() => showModal("create-project")}>
											Create Project
										</a>
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
										<button className='text-error' onClick={handleLogout}>
											Logout
										</button>
									</li>
								</ul>
							</details>
						</li>
					</ul>
				</div>

				<div className='navbar-end'>
					<div className='relative'>
						{/* КНОПКА */}
						<div
							className='btn btn-ghost btn-circle'
							onClick={() => setIsNotificationOpen(!isNotificationOpen)}
						>
							<BellIcon isOpen={isNotificationOpen} />
						</div>

						{/* POPOVER */}
						{isNotificationOpen && (
							<div className='absolute right-[-150] top-[calc(100%+5px)] w-96 bg-base-100 border border-base-300 shadow-xl rounded-lg z-50'>
								<div className='flex items-center justify-between p-3 border-b border-base-200'>
									<h3 className='font-semibold'>Notifications</h3>
									<button
										className='btn btn-ghost btn-xs'
										onClick={() => setIsNotificationOpen(false)}
									>
										<X className='w-4 h-4' />
									</button>
								</div>

								<div className='max-h-80 overflow-y-auto'>
									{isLoading && (
										<div className='flex items-center justify-center p-6'>
											<span className='loading loading-spinner loading-lg'></span>
										</div>
									)}

									{error && (
										<p className='p-4 text-error text-sm'>
											Failed to load notifications
										</p>
									)}

									{!isLoading && data && data.length === 0 && (
										<p className='p-4 text-sm text-base-content/60 italic'>
											No notifications
										</p>
									)}

									{data?.map((notif, index) => (
										<div
											key={notif.id}
											className='flex items-start gap-3 p-3 hover:bg-base-200 transition'
										>
											<div className='mt-1'>
												{notificationTypeToIcon[notif.type] ?? (
													<Bell className='w-5 h-5 text-gray-400' />
												)}
											</div>
											<div className='flex-1'>
												<p className='text-sm font-medium'>{notif.title}</p>
												<p className='text-xs text-base-content/60'>
													{notif.message}
												</p>
												{dates.length > 0 && dates[index] && (
													<p className='text-[11px] text-base-content/50 mt-1'>
														{dates[index].toLocaleString()}
													</p>
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
