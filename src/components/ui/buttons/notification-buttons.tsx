import {
	UserPlus,
	CheckCircle,
	CalendarClock,
	Users,
	MessageSquare,
	Bell,
} from "lucide-react";
import { JSX } from "react";

export const BellIcon = ({ isOpen }: { isOpen: boolean }) => {
	return (
		<button className='btn btn-ghost btn-circle'>
			<div className='indicator'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className={`h-6 w-6 transition-colors ${
						isOpen ? "fill-blue-500 text-blue-500" : "fill-none"
					}`}
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
				>
					{" "}
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
					/>{" "}
				</svg>
				<span className='badge badge-xs badge-primary indicator-item'></span>
			</div>
		</button>
	);
};

type NotificationType =
	| "TASK_ASSIGNED"
	| "TASK_STATUS_CHANGED"
	| "DEADLINE_APPROACHING"
	| "PROJECT_INVITATION"
	| "TASK_COMMENT";

export const notificationTypeToIcon: Record<NotificationType, JSX.Element> = {
	TASK_ASSIGNED: <UserPlus className='w-5 h-5 text-blue-500' />,
	TASK_STATUS_CHANGED: <CheckCircle className='w-5 h-5 text-green-500' />,
	DEADLINE_APPROACHING: <CalendarClock className='w-5 h-5 text-amber-500' />,
	PROJECT_INVITATION: <Users className='w-5 h-5 text-purple-500' />,
	TASK_COMMENT: <MessageSquare className='w-5 h-5 text-cyan-500' />,
};
