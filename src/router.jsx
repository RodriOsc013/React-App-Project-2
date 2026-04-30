import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
	AppLayout,
	ExploreRoute,
	FavoritesRoute,
	HomeRoute,
	NotFoundRoute,
	PlannerRoute,
	RecipeDetailRoute,
	WeeklyPlanRoute,
} from './App';

function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<AppLayout />}>
					<Route index element={<HomeRoute />} />
					<Route path="explore" element={<ExploreRoute />} />
					<Route path="planner" element={<PlannerRoute />}>
						<Route path="weekly" element={<WeeklyPlanRoute />} />
					</Route>
					<Route path="recipe/:idMeal" element={<RecipeDetailRoute />} />
					<Route path="favorites" element={<FavoritesRoute />} />
					<Route path="*" element={<NotFoundRoute />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default AppRouter;
