"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from "react-hot-toast";
import { setCookie } from "@/lib/cookies";

const profileSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
	user: {
		id: number;
		name: string;
		email: string;
		role: string;
	};
}

export function ProfileForm({ user }: ProfileFormProps) {
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<ProfileFormData>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: user.name || "",
			email: user.email || "",
		},
	});

	const onSubmit = async (data: ProfileFormData) => {
		setIsLoading(true);
		try {
			// TODO: викликати бекенд ендпоінт для оновлення профілю
			const updatedUser = { ...user, ...data };
			setCookie("user", JSON.stringify(updatedUser));

			toast.success("Profile updated successfully!");
			reset(data);
		} catch (error) {
			toast.error("Failed to update profile");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='card bg-base-100 shadow border border-base-200'>
			<div className='card-body'>
				<h2 className='card-title'>Profile Information</h2>
				<form onSubmit={handleSubmit(onSubmit)} className='form-control gap-3'>
					<label className='label'>
						<span className='label-text'>Name</span>
					</label>
					<input
						{...register("name")}
						className={`input input-bordered ${
							errors.name ? "input-error" : ""
						}`}
					/>
					{errors.name && (
						<span className='text-error text-sm'>{errors.name.message}</span>
					)}

					<label className='label'>
						<span className='label-text'>Email</span>
					</label>
					<input
						{...register("email")}
						type='email'
						className={`input input-bordered ${
							errors.email ? "input-error" : ""
						}`}
					/>
					{errors.email && (
						<span className='text-error text-sm'>{errors.email.message}</span>
					)}

					<label className='label'>
						<span className='label-text'>Role</span>
					</label>
					<input
						value={user.role}
						disabled
						className='input input-bordered bg-base-200'
					/>

					<button
						type='submit'
						className={`btn mt-3 ${isLoading ? "loading" : ""}`}
						disabled={isLoading}
					>
						{isLoading ? "Saving..." : "Save changes"}
					</button>
				</form>
			</div>
		</div>
	);
}
