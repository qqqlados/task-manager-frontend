type Props = { params: Promise<{ projectId: string }> };

export default async function EditProjectPage({ params }: Props) {
	const { projectId } = await params;
	return (
		<div className='max-w-2xl mx-auto card bg-base-100 shadow border border-base-200'>
			<div className='card-body'>
				<h1 className='card-title'>Edit Project #{projectId}</h1>
				<form className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div className='md:col-span-2'>
						<label className='label'>
							<span className='label-text'>Name</span>
						</label>
						<input
							className='input input-bordered w-full'
							defaultValue={"Current name"}
						/>
					</div>
					<div className='md:col-span-2'>
						<label className='label'>
							<span className='label-text'>Description</span>
						</label>
						<textarea
							className='textarea textarea-bordered w-full'
							defaultValue={"Current description"}
						/>
					</div>
					<div>
						<label className='label'>
							<span className='label-text'>Deadline</span>
						</label>
						<input type='date' className='input input-bordered w-full' />
					</div>
					<div>
						<label className='label'>
							<span className='label-text'>Members</span>
						</label>
						<input
							className='input input-bordered w-full'
							placeholder='Comma-separated emails'
						/>
					</div>
					<div className='md:col-span-2 flex justify-end gap-2'>
						<a href={`/projects/${projectId}`} className='btn btn-ghost'>
							Cancel
						</a>
						<button className='btn btn-primary' type='submit'>
							Save changes
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
