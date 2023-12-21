import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import { eq } from 'drizzle-orm';

type UpvoteProps = {
	email: string;
	count: number;
	listingId: number;
};



export const UpvoteBtn: Component<UpvoteProps> = (props: UpvoteProps) => {

	const [count, setCount] = createSignal(props.count);


	const handleUpvote = async () => {
		console.log('handleUpvote', props.listingId);
		if (props.listingId === 0) return;
		try {

			const res = await fetch('http://localhost:4321/api/actions', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: props.email,
					listingId: props.listingId,
					action: 'upvote',
					values: count(),
				}),
			});
			const data = await res.json();
			if (data.message === 'upvoted') {
				setCount(count() + 1);
			} else if (data.message === 'removed upvote') {
				setCount(count() - 1);
			}

		} catch (err) {
			console.log(err);
		}
	};


	return (
		<button class='btn btn-ghost' onClick={handleUpvote}>
			Upvotes: {count()}
		</button>
	);
}
