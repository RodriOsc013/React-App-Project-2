import { useEffect, useState } from 'react';

function useMealDetails(idMeal) {
	const [meal, setMeal] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		if (!idMeal) {
			setMeal(null);
			setLoading(false);
			setError('');
			return;
		}

		const controller = new AbortController();

		async function loadMeal() {
			setLoading(true);
			setError('');

			try {
				const response = await fetch(
					`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(idMeal)}`,
					{ signal: controller.signal },
				);

				if (!response.ok) {
					throw new Error(`Request failed with status ${response.status}`);
				}

				const data = await response.json();
				setMeal(data.meals?.[0] || null);
			} catch (err) {
				if (err.name !== 'AbortError') {
					setError('Unable to load the recipe details right now.');
					setMeal(null);
				}
			} finally {
				if (!controller.signal.aborted) {
					setLoading(false);
				}
			}
		}

		loadMeal();

		return () => controller.abort();
	}, [idMeal]);

	return { meal, loading, error };
}

export default useMealDetails;
