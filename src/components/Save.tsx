import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';

type SaveProps = {
	email: string;
	count: number;
	listingId: number;
};



export const SaveBtn: Component<SaveProps> = (props: SaveProps) => {

	const [count, setCount] = createSignal(props.count);


	const handleSave = async () => {
		console.log('handleSave', props.listingId);
		if (props.listingId === 0) return;
		try {

			const res = await fetch('http://localhost:4321/api/actions', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: props.email,
					listingId: props.listingId,
					action: 'save',
					values: count(),
				}),
			});
			const data = await res.json();
			if (data.message === 'saved') {
				setCount(count() + 1);
			} else if (data.message === 'removed save') {
				setCount(count() - 1);
			}

		} catch (err) {
			console.log(err);
		}
	};


	return (
		<button class='btn btn-ghost' onClick={handleSave}>
			Saves: {count()}
		</button>
	);
}
