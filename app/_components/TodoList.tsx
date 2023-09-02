'use client';

import React, { useState } from 'react';
import { trpc } from '../_trpc/client';
import { serverClient } from '../_trpc/serverClient';

export default function TodoList({
	initialTodos,
}: {
	initialTodos: Awaited<ReturnType<(typeof serverClient)['getTodos']>>;
}) {
	const getTodos = trpc.getTodos.useQuery(undefined, {
		initialData: initialTodos,
		refetchOnMount: false,
		refetchOnReconnect: false,
	});

	const addTodo = trpc.addTodo.useMutation({
		onSettled: () => {
			getTodos.refetch();
		},
	});

	const toggleTodo = trpc.toggleTodo.useMutation({
		onSettled: () => {
			getTodos.refetch();
		},
	});

	const [content, setContent] = useState('');

	function flipValue(value: number) {
		// if a todo item is "done" the value of done: 1
		// if a todo item is not "done" the value of done: 0
		// this function will flip the value of "done" (1) to (0) and vise versa
		return value === 1 ? 0 : 1;
	}

	return (
		<div>
			<h1 className='mb-10 text-3xl'>My Todo List</h1>
			{getTodos.data?.map((todo) => (
				<div key={todo.id} className='text-lg font-medium my-2'>
					<input
						id={`check-${todo.id}`}
						type='checkbox'
						className='mr-4 rounded text-pink-500'
						checked={todo.done === 1 ? true : false}
						onChange={async () => {
							toggleTodo.mutate({
								id: todo.id,
								done: flipValue(todo.done || 0),
							});
						}}
					/>
					<h3
						className={`inline align-middle ${
							todo.done === 1 && 'line-through'
						}`}
					>
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
