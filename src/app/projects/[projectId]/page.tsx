type Props = { params: Promise<{ projectId: string }> };

export default async function ProjectDetailsPage({ params }: Props) {
	const { projectId } = await params;
	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h1 className='text-2xl font-bold'>Project #{projectId}</h1>
				<div className='flex gap-2'>
					<a href={`/projects/${projectId}/edit`} className='btn'>
						Edit
					</a>
					<button className='btn btn-error'>Delete</button>
				</div>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				<div className='lg:col-span-2 card bg-base-100 shadow border border-base-200'>
					<div className='card-body'>
						<h2 className='card-title'>Description</h2>
						<p className='text-base-content/70'>
							Project description goes here...
						</p>
					</div>
				</div>
				<div className='card bg-base-100 shadow border border-base-200'>
					<div className='card-body'>
						<h2 className='card-title'>Meta</h2>
						<p>
							<b>Deadline:</b> 2025-12-31
						</p>
						<p>
							<b>Status:</b> <span className='badge badge-outline'>Active</span>
						</p>
						<p>
							<b>Members:</b> 5
						</p>
					</div>
				</div>
			</div>

			<div className='card bg-base-100 shadow border border-base-200'>
				<div className='card-body'>
					<h2 className='card-title'>Task Progress</h2>
					<progress
						className='progress progress-primary w-full'
						value={60}
						max='100'
					></progress>
				</div>
			</div>
		</div>
	);
}
