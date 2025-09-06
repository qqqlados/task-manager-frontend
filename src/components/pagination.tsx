"use client";

import { useSearchParams } from "next/navigation";

type PaginationComponentProps = {
	page: number;
	totalPages: number;
};

export const PaginationComponent = ({
	page,
	totalPages,
}: PaginationComponentProps) => {
	const searchParams = useSearchParams();

	const nextPage = searchParams.get("page")
		? Number(searchParams.get("page")) + 1
		: 2;
	const prevPage = searchParams.get("page")
		? Number(searchParams.get("page")) - 1
		: 1;

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", page.toString());
		return `/projects?${params.toString()}`;
	};

	if (totalPages <= 1) return null;

	return (
		<div className='fixed bottom-5 right-5 flex justify-center w-full'>
			<div className='join'>
				<a
					className='join-item btn'
					href={handlePageChange(Math.max(1, prevPage))}
				>
					«
				</a>
				{Array.from({ length: totalPages }).map((_, index) => {
					const pageNumber = index + 1;
					const isActive =
						pageNumber === Number(searchParams.get("page") ?? page);
					return (
						<a
							key={pageNumber}
							href={handlePageChange(pageNumber)}
							className={`join-item btn ${isActive ? "btn-active" : ""}`}
						>
							{pageNumber}
						</a>
					);
				})}
				<a
					className='join-item btn'
					href={handlePageChange(Math.min(totalPages, nextPage))}
				>
					»
				</a>
			</div>
		</div>
	);
};
