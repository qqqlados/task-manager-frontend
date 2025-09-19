"use client";

import { CommentsService } from "@/services/comments.service";
import { TasksService } from "@/services/tasks.service";
import { ITask } from "@/types/task.type";
import { MessageSquare, X } from "lucide-react";
import { useState } from "react";

export const AddTaskCommentForm = ({
	task,
	projectId,
}: {
	task: ITask;
	projectId: string;
}) => {
	const [taskState, setTaskState] = useState(task);
	const [isCommentOpen, setIsCommentOpen] = useState(false);
	const [commentText, setCommentText] = useState("");
	const [loading, setLoading] = useState(false);

	const handleAddComment = async (content: string) => {
		setLoading(true);
		if (!commentText.trim()) return;
		await CommentsService.addComment(projectId, task.id.toString(), {
			content,
		});

		setTimeout(async () => {
			const revalidatedTask = await TasksService.getTask(projectId, task.id);
			setTaskState(revalidatedTask.data);

			setCommentText("");
			setIsCommentOpen(false);
		}, 2000);
	};

	return (
		<>
			{/* COMMENTS */}
			<div className='card bg-base-100 shadow border border-base-200 max-h-[500px] overflow-auto'>
				<div className='card-body space-y-2 bg-white z-20 oveflow-hidden'>
					<div className='flex items-center justify-between card-title gap-2 sticky top-6 left-0 bg-base-100 z-10'>
						<div className='flex items-center gap-2'>
							<MessageSquare className='w-5 h-5 text-blue-500' />
							<span>Comments</span>
						</div>
						<button
							className='btn btn-sm btn-primary flex items-center gap-1'
							onClick={() => setIsCommentOpen(true)}
						>
							<MessageSquare className='w-4 h-4' />
							Add commentary
						</button>
					</div>

					{taskState.comments?.length ? (
						<div className='space-y-3'>
							{taskState.comments.map((comment, i) => (
								<div
									key={i}
									className='flex items-start gap-3 p-3 rounded-lg bg-base-200'
								>
									<div className='w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold'>
										{comment?.user?.name?.[0] ?? "U"}
									</div>
									<div className='flex-1'>
										<p className='font-semibold'>{comment?.user?.name}</p>
										<p className='text-sm text-base-content/80'>
											{comment.content}
										</p>
									</div>
								</div>
							))}
						</div>
					) : (
						<p className='text-base-content/60 italic'>No comments yet.</p>
					)}
				</div>
			</div>

			{/* MODAL COMMENT INPUT */}
			{isCommentOpen && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
					<div className='bg-base-100 rounded-lg shadow-lg p-6 w-full max-w-md relative'>
						<button
							className='absolute top-2 right-2 btn btn-ghost btn-sm'
							onClick={() => setIsCommentOpen(false)}
						>
							<X className='w-4 h-4' />
						</button>

						{loading ? (
							<div className='flex items-center justify-center h-40'>
								<span className='loading loading-spinner loading-lg'></span>
							</div>
						) : (
							<>
								<h3 className='text-lg font-bold mb-4'>Add a comment</h3>
								<textarea
									className='textarea textarea-bordered w-full mb-4'
									rows={4}
									value={commentText}
									onChange={e => setCommentText(e.target.value)}
									placeholder='Write your comment...'
								/>
								<div className='flex justify-end gap-2'>
									<button
										className='btn btn-ghost'
										onClick={() => setIsCommentOpen(false)}
									>
										Cancel
									</button>
									<button
										className='btn btn-primary'
										onClick={() => handleAddComment(commentText)}
										disabled={loading}
									>
										{loading ? "Submitting..." : "Submit"}
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			)}
		</>
	);
};
