type Props = { params: Promise<{ projectId: string }> };

export default async function ProjectMembersPage({ params }: Props) {
	const { projectId } = await params;
	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h1 className='text-2xl font-bold'>Members — Project #{projectId}</h1>
				<button className='btn btn-primary'>Add member</button>
			</div>
			<div className='overflow-x-auto border border-base-200 rounded-box'>
				<table className='table'>
					<thead>
						<tr>
							<th>User</th>
							<th>Email</th>
							<th>Role</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Jane Doe</td>
							<td>jane@example.com</td>
							<td>
								<select className='select select-bordered select-sm'>
									<option>admin</option>
									<option selected>user</option>
								</select>
							</td>
							<td>
								<button className='btn btn-ghost btn-sm'>Remove</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}
