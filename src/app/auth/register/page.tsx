"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { AuthService } from "@/services/auth.service";
import { setCookie } from "@/lib/cookies";

const registerSchema = z
	.object({
		name: z.string().min(2, "Name must be at least 2 characters"),
		email: z.string().email("Invalid email address"),
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string(),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterForm>({
		resolver: zodResolver(registerSchema),
	});

	const onSubmit = async (data: RegisterForm) => {
		setIsLoading(true);
		try {
			const response = await AuthService.register(data);
			if (response.success) {
				setCookie("accessToken", response.data.accessToken);
				setCookie("refreshToken", response.data.refreshToken);
				setCookie("user", JSON.stringify(response.data.user));

				toast.success("Registration successful!");
				router.push("/dashboard");
			}
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Registration failed"
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='max-w-md mx-auto card bg-base-100 shadow-md border border-base-200'>
			<div className='card-body'>
				<h1 className='card-title justify-center'>Create account</h1>
				<form onSubmit={handleSubmit(onSubmit)} className='form-control gap-3'>
					<label className='label'>
						<span className='label-text'>Name</span>
					</label>
					<input
						{...register("name")}
						type='text'
						placeholder='Your name'
						className={`input input-bordered w-full ${
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
						placeholder='you@example.com'
						className={`input input-bordered w-full ${
							errors.email ? "input-error" : ""
						}`}
					/>
					{errors.email && (
						<span className='text-error text-sm'>{errors.email.message}</span>
					)}

					<label className='label'>
						<span className='label-text'>Password</span>
					</label>
					<input
						{...register("password")}
						type='password'
						placeholder='********'
						className={`input input-bordered w-full ${
							errors.password ? "input-error" : ""
						}`}
					/>
					{errors.password && (
						<span className='text-error text-sm'>
							{errors.password.message}
						</span>
					)}

					<label className='label'>
						<span className='label-text'>Confirm password</span>
					</label>
					<input
						{...register("confirmPassword")}
						type='password'
						placeholder='********'
						className={`input input-bordered w-full ${
							errors.confirmPassword ? "input-error" : ""
						}`}
					/>
					{errors.confirmPassword && (
						<span className='text-error text-sm'>
							{errors.confirmPassword.message}
						</span>
					)}

					<button
						className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
						type='submit'
						disabled={isLoading}
					>
						{isLoading ? "Creating account..." : "Register"}
					</button>
				</form>
				<p className='text-xs text-base-content/70 text-center'>
					After successful registration you will be redirected to the dashboard.
				</p>
				<div className='flex justify-center text-sm'>
					<a className='link link-hover' href='/auth/login'>
						Back to login
					</a>
				</div>
			</div>
		</div>
	);
}
