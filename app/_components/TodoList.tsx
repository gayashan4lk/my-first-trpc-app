'use client';

import React, { useState } from 'react';
import { trpc } from '../_trpc/client';

export default function TodoList() {
	const getTodos = trpc.getTodos.useQuery();
	const addTodo = trpc.addTodo.useMutation({
		onSettled: () => {
			getTodos.refetch();
		},
	});

	const [content, setContent] = useState('');

	return (
		<div>
			<h1 className='mb-10 text-3xl'>My Todo List</h1>
			{getTodos.data?.map((todo) => (
				<div key={todo.id} className='text-lg font-medium my-2'>
					<input
						id={`check-${todo.id}`}
						type='checkbox'
						className='mr-4 rounded text-pink-500'
						checked={!!todo.done}
					/>
					<h3 className={`inline align-middle ${todo.done && 'line-through'}`}>
						{todo.content}
					</h3>
				</div>
			))}

			<div className='mt-5'>
				<input
					type='text'
					id='content'
					value={content}
					onChange={(e) => setContent(e.target.value)}
					className='px-2 py-2 rounded-full border border-gray-400'
				/>

				<button
					className='mx-4 p-2 w-10 h-10 rounded-full bg-blue-500'
					onClick={async () => {
						if (content.length) {
							addTodo.mutate(content);
							setContent('');
						}
					}}
				>
					<span className='text-white font-bold text-2xl align-middle'>+</span>
				</button>
			</div>
		</div>
	);
}
