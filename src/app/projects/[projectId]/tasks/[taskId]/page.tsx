type Props = { params: Promise<{ projectId: string; taskId: string }> };

export default async function TaskDetailsPage({ params }: Props) {
	const { projectId, taskId } = await params;
	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h1 className='text-2xl font-bold'>Task #{taskId}</h1>
				<a className='btn' href={`/projects/${projectId}/tasks/${taskId}/edit`}>
					Edit
				</a>
			</div>
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				<div className='lg:col-span-2 card bg-base-100 shadow border border-base-200'>
					<div className='card-body'>
						<h2 className='card-title'>Description</h2>
						<p className='text-base-content/70'>
							Task description goes here...
						</p>
					</div>
				</div>
				<div className='card bg-base-100 shadow border border-base-200'>
					<div className='card-body'>
						<h2 className='card-title'>Meta</h2>
						<p>
							<b>Assignee:</b> Jane Doe
						</p>
						<p>
							<b>Due:</b> 2025-09-01
						</p>
						<div className='form-control'>
							<label className='label'>
								<span className='label-text'>Status</span>
							</label>
							<select className='select select-bordered'>
								<option>Todo</option>
								<option>In progress</option>
								<option>Done</option>
							</select>
						</div>
					</div>
				</div>
			</div>
			<div className='card bg-base-100 shadow border border-base-200'>
				<div className='card-body'>
					<h2 className='card-title'>Change history</h2>
					<ul className='menu'>
						<li>
							<a>2025-08-01 — Status changed to In progress</a>
						</li>
						<li>
							<a>2025-07-28 — Assignee updated to Jane</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
