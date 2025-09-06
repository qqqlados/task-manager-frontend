type Props = { params: Promise<{ projectId: string; taskId: string }> };

export default async function EditTaskPage({ params }: Props) {
	const { projectId, taskId } = await params;
	return (
		<div className='max-w-2xl mx-auto card bg-base-100 shadow border border-base-200'>
			<div className='card-body'>
				<h1 className='card-title'>Edit Task #{taskId}</h1>
				<form className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div className='md:col-span-2'>
						<label className='label'>
							<span className='label-text'>Title</span>
						</label>
						<input
							className='input input-bordered w-full'
							defaultValue={"Setup CI"}
						/>
					</div>
					<div className='md:col-span-2'>
						<label className='label'>
							<span className='label-text'>Description</span>
						</label>
						<textarea
							className='textarea textarea-bordered w-full'
							defaultValue={"Integrate CI pipeline"}
						/>
					</div>
					<div>
						<label className='label'>
							<span className='label-text'>Assignee</span>
						</label>
						<input
							className='input input-bordered w-full'
							defaultValue={"jane@example.com"}
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
							<span className='label-text'>Status</span>
						</label>
						<select className='select select-bordered w-full'>
							<option>Todo</option>
							<option selected>In progress</option>
							<option>Done</option>
						</select>
					</div>
					<div className='md:col-span-2 flex justify-end gap-2'>
						<a
							href={`/projects/${projectId}/tasks/${taskId}`}
							className='btn btn-ghost'
						>
							Cancel
						</a>
						<button className='btn btn-primary' type='submit'>
							Save
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
