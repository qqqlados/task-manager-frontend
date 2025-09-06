"use client";

import { FC, useState } from "react";
import Form from "next/form";
import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/select";

// type SearchInputProps = {
// 	action: string
// }

const statusOptions = ["ACTIVE", "COMPLETED"];

export const SearchInput: FC = () => {
	const [search, setSearch] = useState("");
	const router = useRouter();
	const searchParams = useSearchParams();

	const status = searchParams.get("status") ?? "ACTIVE";

	const handleStatusChange = (status: string) => {
		const params = new URLSearchParams(searchParams);
		params.set("status", status);
		params.set("page", "1");
		router.push(`/projects?${params.toString()}`);
	};

	return (
		<Form action={`/projects`} className='flex gap-3 w-150 mx-auto'>
			<input
				name='name'
				type='text'
				placeholder={"Enter the project name"}
				value={search}
				onChange={e => setSearch(e.target.value)}
				className='input input-bordered w-full max-w-md'
			/>

			<input name='status' type='hidden' value={status} />
			<input name='page' type='hidden' value={"1"} />

			<Select
				value={status}
				options={statusOptions}
				label={"Status"}
				onChange={handleStatusChange}
			/>

			<button
				type='submit'
				className='btn btn-primary'
				disabled={search.length < 2}
			>
				Search
			</button>
		</Form>
	);
};
