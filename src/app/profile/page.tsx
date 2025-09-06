import { ProfileForm, PasswordForm } from "@/components/forms";
import { getCookies } from "@/lib/cookies";

export default async function ProfilePage() {
	const user = await getCookies("user");

	if (!user) {
		return (
			<div className='flex items-center justify-center h-64'>
				<span className='loading loading-spinner loading-lg'></span>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<h1 className='text-2xl font-bold'>Profile</h1>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				<ProfileForm user={JSON.parse(user)} />
				<PasswordForm />
			</div>
		</div>
	);
}
