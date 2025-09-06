"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import toast from "react-hot-toast";

const passwordSchema = z
	.object({
		currentPassword: z.string().min(6, "Current password is required"),
		newPassword: z
			.string()
			.min(6, "New password must be at least 6 characters"),
		confirmPassword: z.string(),
	})
	.refine(data => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type PasswordFormData = z.infer<typeof passwordSchema>;

export function PasswordForm() {
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<PasswordFormData>({
		resolver: zodResolver(passwordSchema),
	});

	const onSubmit = async (data: PasswordFormData) => {
		setIsLoading(true);
		try {
			// TODO: викликати бекенд ендпоінт для зміни пароля
			toast.success("Password changed successfully!");
			reset();
		} catch (error) {
			toast.error("Failed to change password");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='card bg-base-100 shadow border border-base-200'>
			<div className='card-body'>
				<h2 className='card-title'>Security</h2>
				<form onSubmit={handleSubmit(onSubmit)} className='form-control gap-3'>
					<label className='label'>
						<span className='label-text'>Current password</span>
					</label>
					<input
						{...register("currentPassword")}
						type='password'
						className={`input input-bordered ${
							errors.currentPassword ? "input-error" : ""
						}`}
					/>
					{errors.currentPassword && (
						<span className='text-error text-sm'>
							{errors.currentPassword.message}
						</span>
					)}

					<label className='label'>
						<span className='label-text'>New password</span>
					</label>
					<input
						{...register("newPassword")}
						type='password'
						className={`input input-bordered ${
							errors.newPassword ? "input-error" : ""
						}`}
					/>
					{errors.newPassword && (
						<span className='text-error text-sm'>
							{errors.newPassword.message}
						</span>
					)}

					<label className='label'>
						<span className='label-text'>Confirm new password</span>
					</label>
					<input
						{...register("confirmPassword")}
						type='password'
						className={`input input-bordered ${
							errors.confirmPassword ? "input-error" : ""
						}`}
					/>
					{errors.confirmPassword && (
						<span className='text-error text-sm'>
							{errors.confirmPassword.message}
						</span>
					)}

					<button
						className={`btn ${isLoading ? "loading" : ""}`}
						type='submit'
						disabled={isLoading}
					>
						{isLoading ? "Changing..." : "Change password"}
					</button>
				</form>
			</div>
		</div>
	);
}
