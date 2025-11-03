'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { AuthService } from '@/services/auth.service';
import { setCookie } from '@/lib/cookies';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login(data);
      if (response.success) {
        setCookie('accessToken', response.data.accessToken, {
          maxAge: 60 * 60,
        });
        setCookie('refreshToken', response.data.refreshToken);
        setCookie('user', JSON.stringify(response.data.user));

        console.log('user', JSON.stringify(response.data.user));

        // Store readable copy for client components
        try {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('user', JSON.stringify(response.data.user));
            // Also set a non-HTTPOnly cookie so the server can read it via getCookies('user')
            try {
              const encoded = encodeURIComponent(JSON.stringify(response.data.user));
              document.cookie = `user=${encoded}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
            } catch {}
          }
        } catch {}

        toast.success('Login successful!');
        router.push('/dashboard');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto card bg-base-100 shadow-md border border-base-200">
      <div className="card-body">
        <h1 className="card-title justify-center">Sign in</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="form-control gap-3">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input {...register('email')} type="email" placeholder="you@example.com" className={`input input-bordered w-full mb-3 ${errors.email ? 'input-error' : ''}`} />
          {errors.email && <span className="text-error text-sm">{errors.email.message}</span>}

          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input {...register('password')} type="password" placeholder="********" className={`input input-bordered w-full mb-3${errors.password ? 'input-error' : ''}`} />
          {errors.password && <span className="text-error text-sm">{errors.password.message}</span>}

          <button className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`} type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="flex justify-between text-sm">
          <a className="link link-hover" href="/auth/register">
            Create account
          </a>
          <a className="link link-hover" href="/auth/forgot-password">
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
}
