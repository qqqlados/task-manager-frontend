import clsx from "clsx";
import { ReactNode } from "react";

export const Modal = ({
	id,
	title,
	children,
	className,
}: {
	children: ReactNode;
	id: string;
	title: string;
	className?: string;
}) => {
	return (
		<dialog id={id} className={clsx("modal", className)}>
			<div className='modal-box w-[500px]'>
				<h1 className='text-center font-bold'>{title}</h1>
				<form method='dialog'>
					<button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
						✕
					</button>
				</form>

				{children}
			</div>
			<form method='dialog' className='modal-backdrop'>
				<button>close</button>
			</form>
		</dialog>
	);
};
