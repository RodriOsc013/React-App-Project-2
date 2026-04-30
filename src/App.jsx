import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const REGION_SECTIONS = [
	{
		key: 'asia',
		label: 'Asia',
		accent: '#f2a65a',
		areas: ['Chinese', 'Indian', 'Japanese', 'Malaysian', 'Thai', 'Vietnamese'],
		description: 'Bright spices, noodles, rice bowls, and shared plates.',
	},
	{
		key: 'americas',
		label: 'The Americas',
		accent: '#f06b6b',
		areas: ['American', 'Canadian', 'Mexican'],
		description: 'Comfort dishes, grilled favorites, and bold street food.',
	},
	{
		key: 'europe',
		label: 'Europe',
		accent: '#6d9dfc',
		areas: ['British', 'Croatian', 'Dutch', 'French', 'Greek', 'Irish', 'Italian', 'Polish', 'Portuguese', 'Spanish'],
		description: 'Bakes, sauces, rustic dinners, and classic table fare.',
	},
	{
		key: 'caribbean',
		label: 'Caribbean',
		accent: '#ff9b54',
		areas: ['Jamaican'],
		description: 'Sun-kissed flavors, spice, citrus, and slow-cooked depth.',
	},
	{
		key: 'africa',
		label: 'Africa',
		accent: '#7abf7a',
		areas: ['Egyptian', 'Kenyan', 'Moroccan', 'Tunisian'],
		description: 'Stews, braises, spice blends, and nourishing staples.',
	},
];

const QUICK_SWAPS = {
	butter: ['olive oil', 'ghee', 'coconut oil'],
	chicken: ['tofu', 'mushrooms', 'chickpeas'],
	beef: ['lentils', 'mushrooms', 'jackfruit'],
	milk: ['oat milk', 'almond milk', 'soy milk'],
	sugar: ['honey', 'maple syrup', 'date paste'],
	flour: ['almond flour', 'oat flour', 'gluten-free flour'],
	egg: ['flax egg', 'applesauce', 'chia gel'],
	rice: ['quinoa', 'cauliflower rice', 'couscous'],
};

const BACKDROP_WORDS = ['flowers', 'fruits', 'vegetables', 'meats', 'poultry'];
const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const FOOD_TABLE_GROUPS = [
	{
		key: 'fruits',
		title: 'Fruits',
		description: 'Bright, sweet, and colorful picks for a fresh table spread.',
		items: [
			{
				name: 'Berries',
				image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=900&q=80',
			},
			{
				name: 'Citrus',
				image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=900&q=80',
			},
			{
				name: 'Tropical fruit',
				image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=900&q=80',
			},
		],
	},
	{
		key: 'meats',
		title: 'Meats',
		description: 'Hearty proteins for the center of the table.',
		items: [
			{
				name: 'Steak',
				image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
			},
			{
				name: 'Roast chicken',
				image: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=900&q=80',
			},
			{
				name: 'Grilled pork',
				image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
			},
		],
	},
	{
		key: 'seafoods',
		title: 'Seafoods',
		description: 'Ocean-inspired plates with fresh color and texture.',
		items: [
			{
				name: 'Salmon',
				image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80',
			},
			{
				name: 'Shrimp',
				image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80',
			},
			{
				name: 'Shellfish',
				image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80',
			},
		],
	},
	{
		key: 'vegetables',
		title: 'Vegetables',
		description: 'Fresh greens and garden produce to balance the spread.',
		items: [
			{
				name: 'Leafy greens',
				image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80',
			},
			{
				name: 'Root vegetables',
				image: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=900&q=80',
			},
			{
				name: 'Mixed vegetables',
				image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80',
			},
		],
	},
];

function normalizeText(value) {
	return String(value || '').trim();
}

function titleCase(value) {
	return normalizeText(value)
		.split(/\s+/)
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');
}

function sortMeals(meals) {
	return [...meals].sort((left, right) => left.strMeal.localeCompare(right.strMeal));
}

function extractIngredients(meal, substitutions = {}) {
	if (!meal) return [];

	const items = [];

	for (let index = 1; index <= 20; index += 1) {
		const ingredient = normalizeText(meal[`strIngredient${index}`]);
		if (!ingredient) continue;

		const measure = normalizeText(meal[`strMeasure${index}`]);
		const replacement = substitutions[ingredient.toLowerCase()] || '';

		items.push({
			ingredient,
			measure,
			displayIngredient: replacement || ingredient,
			substituted: Boolean(replacement),
		});
	}

	return items;
}

function extractSteps(meal) {
	const instructionText = normalizeText(meal?.strInstructions);
	if (!instructionText) return [];

	return instructionText
		.split(/\r?\n|[.?!]\s+/)
		.map((step) => step.trim())
		.filter((step) => step.length > 18)
		.slice(0, 8);
}

function estimatePrepTime(meal) {
	const ingredientCount = extractIngredients(meal).length;
	const stepCount = extractSteps(meal).length;
	const minutes = 10 + ingredientCount * 2 + stepCount * 3;
	return Math.max(15, Math.min(90, minutes));
}

async function fetchJson(url, signal) {
	const response = await fetch(url, { signal });
	if (!response.ok) {
		throw new Error(`Request failed with status ${response.status}`);
	}

	return response.json();
}

async function fetchMealList(url, signal) {
	const data = await fetchJson(url, signal);
	return sortMeals(data.meals || []);
}

function getRegionMeta(regionKey) {
	return REGION_SECTIONS.find((section) => section.key === regionKey) || REGION_SECTIONS[0];
}

function getRegionLabel(areaName) {
	const name = normalizeText(areaName);
	if (!name) return 'World Kitchen';

	const africaAreas = ['Egyptian', 'Kenyan', 'Moroccan', 'Tunisian'];
	const caribbeanAreas = ['Jamaican'];
	const asiaAreas = ['Chinese', 'Indian', 'Japanese', 'Malaysian', 'Thai', 'Vietnamese'];
	const europeAreas = ['British', 'Croatian', 'Dutch', 'French', 'Greek', 'Irish', 'Italian', 'Polish', 'Portuguese', 'Spanish'];
	const americasAreas = ['American', 'Canadian', 'Mexican'];

	if (africaAreas.includes(name)) return 'Africa';
	if (caribbeanAreas.includes(name)) return 'Caribbean';
	if (asiaAreas.includes(name)) return 'Asia';
	if (europeAreas.includes(name)) return 'Europe';
	if (americasAreas.includes(name)) return 'The Americas';
	return titleCase(name);
}

function AppHeader({ selectedMealTitle }) {
	return (
		<header className="app-header">
			<div>
				<p className="eyebrow">Meal planner + recipe explorer</p>
				<h1>Fresh meals from A to Z, ready to browse and swap.</h1>
			</div>
			<nav className="app-nav" aria-label="Primary">
				<NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}>
					Home
				</NavLink>
				<NavLink to="/explore" className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}>
					Explore
				</NavLink>
				<NavLink to="/planner" className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}>
					Planner
				</NavLink>
			</nav>
			<div className="app-header-meta">
				<span>Live MealDB data</span>
				<span>{selectedMealTitle || 'Pick a meal to personalize'}</span>
			</div>
		</header>
	);
}

function HomePage({ showcaseMeals, onOpenMeal, onGoExplore, onGoPlanner }) {
	return (
		<>
			<section className="hero-panel home-hero">
				<div className="hero-copy">
					<p className="hero-tag">Three-page experience</p>
					<h2>Browse, explore, and plan meals with live recipes.</h2>
					<p className="hero-text">
						Use the explore page to search meals, then move to the planner page to swap ingredients and keep the version you prefer.
						The app is responsive for both mobile and desktop.
					</p>
					<div className="hero-actions">
						<button type="button" className="primary-button" onClick={onGoExplore}>Start exploring</button>
						<button type="button" className="text-button" onClick={onGoPlanner}>Open planner</button>
					</div>
				</div>
				<div className="backdrop-orbit" aria-hidden="true">
					{BACKDROP_WORDS.map((word, index) => (
						<span key={word} className={`orbit-badge orbit-${index + 1}`}>
							{word}
						</span>
					))}
					<div className="orbit-center">
						<span>Fresh</span>
						<span>Smart</span>
						<span>Friendly</span>
					</div>
				</div>
			</section>

			<section className="food-table-panel">
				<div className="control-head">
					<p className="eyebrow">Big table display</p>
					<h2>Fruits, meats, seafoods, and vegetables laid out together.</h2>
					<p>Swipe through the spread below to see the food groups displayed like a large shared table.</p>
				</div>
				<div className="food-table-stage">
					<div className="food-table-center">
						<span>Big table</span>
						<strong>Fresh, colorful, and ready to share</strong>
					</div>
					<div className="food-table-grid">
						{FOOD_TABLE_GROUPS.map((group) => (
							<article key={group.key} className="food-table-group">
								<div className="food-table-group-copy">
									<p className="food-table-kicker">{group.title}</p>
									<span>{group.description}</span>
								</div>
								<div className="food-table-images">
									{group.items.map((item) => (
										<figure key={item.name} className="food-table-card">
											<img src={item.image} alt={item.name} loading="lazy" />
											<figcaption>{item.name}</figcaption>
										</figure>
									))}
								</div>
							</article>
						))}
					</div>
				</div>
			</section>

			<section className="control-panel">
				<div className="control-head">
					<h2>Recipe postcards</h2>
					<p>Tap a meal and jump straight into the planner page.</p>
				</div>
				<div className="postcard-row">
					{showcaseMeals.map((meal) => (
						<button
							key={meal.idMeal}
							type="button"
							className="postcard"
							style={{ '--accent': meal.accent }}
							onClick={() => onOpenMeal(meal)}
						>
							<img src={meal.strMealThumb} alt={meal.strMeal} loading="lazy" />
							<div>
								<span className="postcard-kicker">{meal.regionLabel}</span>
								<strong>{meal.strMeal}</strong>
							</div>
						</button>
					))}
				</div>
			</section>
		</>
	);
}

function ExplorePage({
	searchTerm,
	setSearchTerm,
	browseMode,
	setBrowseMode,
	selectedLetter,
	setSelectedLetter,
	selectedRegionKey,
	setSelectedRegionKey,
	selectedRegion,
	currentBrowseLabel,
	loadingMeals,
	mealError,
	meals,
	activeMeal,
	selectedMealTitle,
	prepTime,
	ingredientList,
	steps,
	loadingDetails,
	detailError,
	onSelectMeal,
	onOpenPlanner,
}) {
	return (
		<section className="main-grid explore-grid">
			<div className="results-panel">
				<div className="search-field search-field-compact">
					<span>Search meals, ingredients, or recipe names</span>
					<input
						type="search"
						value={searchTerm}
						onChange={(event) => setSearchTerm(event.target.value)}
						placeholder="Search tacos, curry, soup, pasta, salad..."
					/>
				</div>

				<div className="control-row">
					<div className="control-group">
						<div className="control-head">
							<h2>A to Z</h2>
							<p>Browse by the first letter of a meal.</p>
						</div>
						<div className="chip-row" role="list" aria-label="Alphabet filter">
							{LETTERS.map((letter) => (
								<button
									key={letter}
									type="button"
									className={`chip ${selectedLetter === letter && browseMode === 'letter' ? 'chip-active' : ''}`}
									onClick={() => {
										setSearchTerm('');
										setBrowseMode('letter');
										setSelectedLetter(letter);
									}}
								>
									{letter}
								</button>
							))}
						</div>
					</div>

					<div className="control-group">
						<div className="control-head">
							<h2>World cuisine</h2>
							<p>Tap a region to explore its recipes.</p>
						</div>
						<div className="region-row">
							{REGION_SECTIONS.map((region) => (
								<button
									key={region.key}
									type="button"
									className={`region-card ${selectedRegionKey === region.key && browseMode === 'region' ? 'region-card-active' : ''}`}
									style={{ '--accent': region.accent }}
									onClick={() => {
										setSearchTerm('');
										setBrowseMode('region');
										setSelectedRegionKey(region.key);
									}}
								>
									<strong>{region.label}</strong>
									<span>{region.description}</span>
								</button>
							))}
						</div>
					</div>
				</div>

				<div className="panel-head">
					<div>
						<p className="eyebrow">Browse recipes</p>
						<h2>{currentBrowseLabel}</h2>
					</div>
					<span className="result-count">{loadingMeals ? 'Loading...' : `${meals.length} found`}</span>
				</div>

				{mealError ? <div className="message-card error">{mealError}</div> : null}

				<div className="meal-grid">
					{meals.map((meal) => (
						<button
							key={meal.idMeal}
							type="button"
							className="meal-card"
							onClick={() => onSelectMeal(meal)}
						>
							<img src={meal.strMealThumb} alt={meal.strMeal} loading="lazy" />
							<div className="meal-card-copy">
								<span className="meal-tag">{getRegionLabel(meal.strArea)}</span>
								<strong>{meal.strMeal}</strong>
								<span>{meal.strCategory || 'Recipe'}{meal.strArea ? ` · ${meal.strArea}` : ''}</span>
							</div>
						</button>
					))}
				</div>

				{!loadingMeals && !mealError && !meals.length ? (
					<div className="message-card">No meals matched that search. Try a different letter, region, or ingredient.</div>
				) : null}
			</div>

			<aside className="detail-panel mini-panel recipe-output-panel">
				<div className="control-head">
					<h2>Recipe output</h2>
					<p>{selectedMealTitle || selectedRegion.label}</p>
				</div>
				{loadingDetails ? <div className="message-card">Loading recipe details from MealDB...</div> : null}
				{detailError ? <div className="message-card subtle">{detailError}</div> : null}
				{activeMeal ? (
					<div className="recipe-output-card">
						<div className="recipe-output-hero">
							<img src={activeMeal.strMealThumb} alt={activeMeal.strMeal} loading="lazy" />
							<div>
								<span className="meal-tag">{getRegionLabel(activeMeal.strArea)}</span>
								<strong>{activeMeal.strMeal}</strong>
								<p>{activeMeal.strCategory || 'MealDB recipe'}</p>
							</div>
						</div>
						<div className="info-row recipe-info-row">
							<span>Prep: {prepTime} min</span>
							<span>{ingredientList.length} ingredients</span>
							<span>{steps.length || 'Instruction summary'} steps</span>
						</div>
						<div className="recipe-output-section">
							<h3>Ingredients</h3>
							<ul className="ingredient-list ingredient-list-preview">
								{ingredientList.slice(0, 6).map((item, index) => (
									<li key={`${activeMeal.idMeal}-${item.ingredient}-${index}`} className="ingredient-item ingredient-item-compact">
										<div>
											<strong>{item.measure ? `${item.measure} ` : ''}{item.displayIngredient}</strong>
											<span>{item.substituted ? `Original: ${item.ingredient}` : item.ingredient}</span>
										</div>
									</li>
								))}
							</ul>
						</div>
						<div className="recipe-output-section">
							<h3>Preparation</h3>
							{steps.length ? (
								<ol className="steps-list steps-list-preview">
									{steps.slice(0, 3).map((step) => (
										<li key={step}>{step}</li>
									))}
								</ol>
							) : (
								<p className="muted-copy">This recipe does not include a detailed instruction list in the API preview.</p>
							)}
						</div>
						<Link to="/planner" className="primary-button planner-link" onClick={onOpenPlanner}>
							Open planner
						</Link>
					</div>
				) : (
					<>
						<p className="muted-copy">{selectedRegion.description}</p>
						<Link to="/planner" className="primary-button planner-link" onClick={onOpenPlanner}>
							Open planner
						</Link>
					</>
				)}
			</aside>
		</section>
	);
}

function PlannerPage({
	activeMeal,
	selectedMealTitle,
	prepTime,
	ingredientList,
	steps,
	loadingDetails,
	detailError,
	applyQuickSubstitution,
	clearMealSubstitutions,
	clearAllSubstitutions,
	swapIngredient,
	setSwapIngredient,
	swapReplacement,
	setSwapReplacement,
	applySubstitution,
	swapNote,
	meals,
	weeklyPlan,
	generatingWeeklyPlan,
	weeklyPlanError,
	onGenerateWeeklyPlan,
	onOpenMeal,
}) {
	return (
		<section className="main-grid planner-grid">
			<div className="results-panel">
				<div className="panel-head">
					<div>
						<p className="eyebrow">Recipe details</p>
						<h2>{activeMeal ? activeMeal.strMeal : 'Pick a meal'}</h2>
					</div>
					{activeMeal ? <span className="prep-pill">Prep: {prepTime} min</span> : null}
				</div>

				{loadingDetails ? <div className="message-card">Loading recipe details from MealDB...</div> : null}
				{detailError ? <div className="message-card subtle">{detailError}</div> : null}

				{activeMeal ? (
					<>
						<div className="detail-hero">
							<img src={activeMeal.strMealThumb} alt={activeMeal.strMeal} loading="lazy" />
							<div className="detail-meta">
								<span>{getRegionLabel(activeMeal.strArea)}</span>
								<strong>{activeMeal.strCategory || 'MealDB recipe'}</strong>
								<p>{activeMeal.strArea ? `Cooked in the style of ${activeMeal.strArea}.` : 'Browse and customize this recipe.'}</p>
							</div>
						</div>

						<div className="info-row">
							<span>{ingredientList.length} ingredients</span>
							<span>{steps.length || 'Instruction summary'} steps</span>
							<span>{activeMeal.strTags || 'Fresh and customizable'}</span>
						</div>

						<div className="section-block">
							<div className="section-head">
								<h3>Ingredients</h3>
								<button type="button" className="text-button" onClick={clearMealSubstitutions}>
									Reset this recipe
								</button>
							</div>
							<ul className="ingredient-list">
								{ingredientList.map((item, index) => (
									<li key={`${activeMeal.idMeal}-${item.ingredient}-${index}`} className={item.substituted ? 'ingredient-item substituted' : 'ingredient-item'}>
										<div>
											<strong>{item.measure ? `${item.measure} ` : ''}{item.displayIngredient}</strong>
											{item.substituted ? <span>Original: {item.ingredient}</span> : <span>{item.ingredient}</span>}
										</div>
										<button
											type="button"
											className="text-button"
											onClick={() => applyQuickSubstitution(item.ingredient, QUICK_SWAPS[item.ingredient.toLowerCase()]?.[0] || 'tofu')}
										>
											Swap
										</button>
									</li>
								))}
							</ul>
						</div>

						<div className="section-block">
							<div className="section-head">
								<h3>Ingredient swapper</h3>
								<button type="button" className="text-button" onClick={clearAllSubstitutions}>
									Clear all saved swaps
								</button>
							</div>

							<form className="swap-form" onSubmit={applySubstitution}>
								<label>
									Ingredient
									<input
										list="ingredient-suggestions"
										value={swapIngredient}
										onChange={(event) => setSwapIngredient(event.target.value)}
										placeholder="for example, chicken"
									/>
								</label>
								<label>
									Substitute with
									<input
										value={swapReplacement}
										onChange={(event) => setSwapReplacement(event.target.value)}
										placeholder="for example, tofu"
									/>
								</label>
								<button type="submit" className="primary-button">
									Save substitution
								</button>
							</form>
							<datalist id="ingredient-suggestions">
								{ingredientList.map((item) => (
									<option key={item.ingredient} value={item.ingredient} />
								))}
							</datalist>

							<div className="swap-suggestions">
								{Object.entries(QUICK_SWAPS).map(([ingredient, options]) => (
									<div key={ingredient} className="swap-chip-group">
										<span>{titleCase(ingredient)}</span>
										<div>
											{options.map((option) => (
												<button
													key={`${ingredient}-${option}`}
													type="button"
													className="swap-chip"
													onClick={() => applyQuickSubstitution(ingredient, option)}
												>
													{option}
												</button>
											))}
										</div>
									</div>
								))}
							</div>

							{swapNote ? <p className="swap-note">{swapNote}</p> : null}
						</div>

						<div className="section-block">
							<h3>Preparation steps</h3>
							{steps.length ? (
								<ol className="steps-list">
									{steps.map((step) => (
										<li key={step}>{step}</li>
									))}
								</ol>
							) : (
								<p className="muted-copy">This recipe does not include a detailed instruction list in the API preview.</p>
							)}
						</div>
					</>
				) : (
					<div className="empty-state">
						<strong>Choose a recipe to see the ingredients and personalize the substitutions.</strong>
						<p>The detail pane will show ingredient counts, prep time, and cooking steps once you pick a meal.</p>
					</div>
				)}
			</div>

			<aside className="detail-panel mini-panel">
				<div className="control-head">
					<h2>Quick links</h2>
					<p>{selectedMealTitle || 'No recipe selected'}</p>
				</div>
				<div className="planner-tile-list">
					{meals.slice(0, 4).map((meal) => (
						<button key={meal.idMeal} type="button" className="planner-tile" onClick={() => onOpenMeal(meal)}>
							<img src={meal.strMealThumb} alt={meal.strMeal} loading="lazy" />
							<span>{meal.strMeal}</span>
						</button>
					))}
				</div>

				<div className="weekly-plan-block">
					<div className="control-head">
						<h2>Weekly plan</h2>
						<p>7 days</p>
					</div>
					<button type="button" className="primary-button" onClick={onGenerateWeeklyPlan} disabled={generatingWeeklyPlan}>
						{generatingWeeklyPlan ? 'Generating...' : 'Generate 7-day plan'}
					</button>
					{weeklyPlanError ? <div className="message-card error">{weeklyPlanError}</div> : null}
					{weeklyPlan.length ? (
						<div className="weekly-plan-list">
							{weeklyPlan.map((item) => (
								<button
									key={`${item.day}-${item.meal.idMeal}`}
									type="button"
									className="weekly-plan-item"
									onClick={() => onOpenMeal(item.meal)}
								>
									<img src={item.meal.strMealThumb} alt={item.meal.strMeal} loading="lazy" />
									<div>
										<strong>{item.day}</strong>
										<span>{item.regionLabel} · {item.prepTime} min</span>
										<p>{item.meal.strMeal}</p>
									</div>
								</button>
							))}
						</div>
					) : null}
				</div>
			</aside>
		</section>
	);
}

function App() {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState('');
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
	const [browseMode, setBrowseMode] = useState('letter');
	const [selectedLetter, setSelectedLetter] = useState('A');
	const [selectedRegionKey, setSelectedRegionKey] = useState('asia');
	const [meals, setMeals] = useState([]);
	const [showcaseMeals, setShowcaseMeals] = useState([]);
	const [loadingMeals, setLoadingMeals] = useState(false);
	const [mealError, setMealError] = useState('');
	const [selectedMealSummary, setSelectedMealSummary] = useState(null);
	const [selectedMealDetails, setSelectedMealDetails] = useState(null);
	const [loadingDetails, setLoadingDetails] = useState(false);
	const [detailError, setDetailError] = useState('');
	const [substitutions, setSubstitutions] = useState(() => {
		try {
			const raw = window.localStorage.getItem('meal-planner-substitutions');
			return raw ? JSON.parse(raw) : {};
		} catch {
			return {};
		}
	});
	const [swapIngredient, setSwapIngredient] = useState('');
	const [swapReplacement, setSwapReplacement] = useState('');
	const [swapNote, setSwapNote] = useState('');
	const [weeklyPlan, setWeeklyPlan] = useState([]);
	const [generatingWeeklyPlan, setGeneratingWeeklyPlan] = useState(false);
	const [weeklyPlanError, setWeeklyPlanError] = useState('');
	const mealListCacheRef = useRef(new Map());
	const mealDetailsCacheRef = useRef(new Map());

	const selectedRegion = useMemo(() => getRegionMeta(selectedRegionKey), [selectedRegionKey]);
	const activeMeal = selectedMealDetails || selectedMealSummary;
	const ingredientList = useMemo(() => {
		const mealSubstitutions = activeMeal?.idMeal ? substitutions[activeMeal.idMeal] || {} : {};
		return extractIngredients(activeMeal, mealSubstitutions);
	}, [activeMeal, substitutions]);
	const prepTime = useMemo(() => (activeMeal ? estimatePrepTime(activeMeal) : 0), [activeMeal]);
	const steps = useMemo(() => extractSteps(activeMeal), [activeMeal]);
	const selectedMealTitle = activeMeal?.strMeal || '';
	const currentBrowseLabel = searchTerm.trim()
		? `Search results for "${searchTerm.trim()}"`
		: browseMode === 'region'
			? `${selectedRegion.label} recipes`
			: `Meals starting with ${selectedLetter}`;

	useEffect(() => {
		window.localStorage.setItem('meal-planner-substitutions', JSON.stringify(substitutions));
	}, [substitutions]);

	useEffect(() => {
		if (!normalizeText(searchTerm)) {
			setDebouncedSearchTerm('');
			return;
		}

		const timeoutId = window.setTimeout(() => {
			setDebouncedSearchTerm(searchTerm);
		}, 260);

		return () => window.clearTimeout(timeoutId);
	}, [searchTerm]);

	useEffect(() => {
		const controller = new AbortController();

		async function loadMeals() {
			const normalizedSearch = normalizeText(debouncedSearchTerm);
			let requestUrl = '';

			if (normalizedSearch) {
				requestUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(normalizedSearch)}`;
			} else if (browseMode === 'region') {
				const area = selectedRegion.areas[0];
				requestUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(area)}`;
			} else {
				requestUrl = `https://www.themealdb.com/api/json/v1/1/search.php?f=${selectedLetter.toLowerCase()}`;
			}

			const cachedMeals = mealListCacheRef.current.get(requestUrl);
			setLoadingMeals(!cachedMeals);
			setMealError('');

			try {
				let nextMeals = cachedMeals || [];

				if (!cachedMeals) {
					nextMeals = await fetchMealList(requestUrl, controller.signal);
					mealListCacheRef.current.set(requestUrl, nextMeals);
				}

				setMeals(nextMeals);
				setSelectedMealSummary((current) => {
					if (current && nextMeals.some((meal) => meal.idMeal === current.idMeal)) {
						return current;
					}

					return nextMeals[0] || null;
				});

				if (!nextMeals.length) {
					setSelectedMealSummary(null);
					setSelectedMealDetails(null);
				}
			} catch (error) {
				if (error.name !== 'AbortError') {
					setMeals([]);
					setSelectedMealSummary(null);
					setSelectedMealDetails(null);
					setMealError('We could not load meals right now. Please try again in a moment.');
				}
			} finally {
				if (!controller.signal.aborted) {
					setLoadingMeals(false);
				}
			}
		}

		loadMeals();

		return () => controller.abort();
	}, [browseMode, debouncedSearchTerm, selectedLetter, selectedRegion]);

	useEffect(() => {
		const controller = new AbortController();

		async function loadMealDetails() {
			if (!selectedMealSummary) {
				setSelectedMealDetails(null);
				setDetailError('');
				return;
			}

			if (selectedMealSummary.strInstructions && selectedMealSummary.strIngredient1) {
				setSelectedMealDetails(selectedMealSummary);
				setDetailError('');
				return;
			}

			const cachedDetail = mealDetailsCacheRef.current.get(selectedMealSummary.idMeal);
			if (cachedDetail) {
				setSelectedMealDetails(cachedDetail);
				setDetailError('');
				return;
			}

			setLoadingDetails(true);
			setDetailError('');

			try {
				const data = await fetchJson(
					`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(selectedMealSummary.idMeal)}`,
					controller.signal,
				);

				const detailedMeal = data.meals?.[0] || selectedMealSummary;
				mealDetailsCacheRef.current.set(selectedMealSummary.idMeal, detailedMeal);
				setSelectedMealDetails(detailedMeal);
			} catch (error) {
				if (error.name !== 'AbortError') {
					setSelectedMealDetails(selectedMealSummary);
					setDetailError('Recipe details are still loading from the API. The summary is available below.');
				}
			} finally {
				if (!controller.signal.aborted) {
					setLoadingDetails(false);
				}
			}
		}

		loadMealDetails();

		return () => controller.abort();
	}, [selectedMealSummary]);

	useEffect(() => {
		const controller = new AbortController();

		async function loadShowcaseMeals() {
			try {
				const cards = await Promise.all(
					REGION_SECTIONS.map(async (section) => {
						const area = section.areas[0];
						const data = await fetchJson(
							`https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(area)}`,
							controller.signal,
						);

						const meal = data.meals?.[0];
						return meal ? { ...meal, regionLabel: section.label, accent: section.accent } : null;
					}),
				);

				if (!controller.signal.aborted) {
					setShowcaseMeals(cards.filter(Boolean));
				}
			} catch {
				if (!controller.signal.aborted) {
					setShowcaseMeals([]);
				}
			}
		}

		loadShowcaseMeals();

		return () => controller.abort();
	}, []);

	function selectMeal(meal) {
		setSelectedMealSummary(meal);
		setSelectedMealDetails(null);
		setDetailError('');
		navigate('/planner');
	}

	function applySubstitution(event) {
		event.preventDefault();
		const ingredientKey = normalizeText(swapIngredient).toLowerCase();
		const replacement = normalizeText(swapReplacement);

		if (!activeMeal || !ingredientKey || !replacement) {
			setSwapNote('Choose an ingredient and a replacement to save the swap.');
			return;
		}

		setSubstitutions((current) => ({
			...current,
			[activeMeal.idMeal]: {
				...(current[activeMeal.idMeal] || {}),
				[ingredientKey]: replacement,
			},
		}));

		setSwapNote(`Swapped ${swapIngredient} for ${replacement} in this recipe.`);
		setSwapReplacement('');
	}

	function applyQuickSubstitution(ingredient, replacement) {
		const ingredientKey = normalizeText(ingredient).toLowerCase();
		const chosenReplacement = normalizeText(replacement);

		if (!activeMeal || !ingredientKey || !chosenReplacement) {
			setSwapNote('Pick a meal first, then choose a swap option.');
			return;
		}

		setSubstitutions((current) => ({
			...current,
			[activeMeal.idMeal]: {
				...(current[activeMeal.idMeal] || {}),
				[ingredientKey]: chosenReplacement,
			},
		}));

		setSwapIngredient(titleCase(ingredient));
		setSwapReplacement(chosenReplacement);
		setSwapNote(`Applied ${chosenReplacement} as the substitute for ${titleCase(ingredient)}.`);
	}

	function clearMealSubstitutions() {
		if (!activeMeal) return;

		setSubstitutions((current) => {
			const next = { ...current };
			delete next[activeMeal.idMeal];
			return next;
		});

		setSwapNote('This recipe is back to its original ingredients.');
	}

	function clearAllSubstitutions() {
		setSubstitutions({});
		setSwapNote('All saved substitutions were cleared.');
	}

	async function loadMealDetailsForPlan(meal) {
		if (!meal?.idMeal) return meal;

		if (meal.strInstructions && meal.strIngredient1) {
			mealDetailsCacheRef.current.set(meal.idMeal, meal);
			return meal;
		}

		const cachedDetail = mealDetailsCacheRef.current.get(meal.idMeal);
		if (cachedDetail) return cachedDetail;

		try {
			const data = await fetchJson(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(meal.idMeal)}`);
			const detailedMeal = data.meals?.[0] || meal;
			mealDetailsCacheRef.current.set(meal.idMeal, detailedMeal);
			return detailedMeal;
		} catch {
			return meal;
		}
	}

	async function generateWeeklyPlan() {
		setGeneratingWeeklyPlan(true);
		setWeeklyPlanError('');

		try {
			const startIndex = Math.max(0, REGION_SECTIONS.findIndex((region) => region.key === selectedRegionKey));

			const planItems = await Promise.all(
				WEEK_DAYS.map(async (day, dayIndex) => {
					const region = REGION_SECTIONS[(startIndex + dayIndex) % REGION_SECTIONS.length];
					const area = region.areas[dayIndex % region.areas.length];
					const areaUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(area)}`;

					let candidates = mealListCacheRef.current.get(areaUrl) || [];
					if (!candidates.length) {
						try {
							candidates = await fetchMealList(areaUrl);
							mealListCacheRef.current.set(areaUrl, candidates);
						} catch {
							candidates = [];
						}
					}

					if (!candidates.length) {
						candidates = meals;
					}

					if (!candidates.length) return null;

					const selectedMeal = candidates[Math.floor(Math.random() * candidates.length)];
					const detailedMeal = await loadMealDetailsForPlan(selectedMeal);

					return {
						day,
						regionLabel: region.label,
						meal: detailedMeal,
						prepTime: estimatePrepTime(detailedMeal),
					};
				}),
			);

			const nextPlan = planItems.filter(Boolean);
			if (!nextPlan.length) {
				setWeeklyPlan([]);
				setWeeklyPlanError('No meals were available to build a weekly plan right now.');
				return;
			}

			setWeeklyPlan(nextPlan);
		} catch {
			setWeeklyPlan([]);
			setWeeklyPlanError('Could not generate a weekly plan right now. Please try again.');
		} finally {
			setGeneratingWeeklyPlan(false);
		}
	}

	function goExplore() {
		navigate('/explore');
	}

	function goPlanner() {
		navigate('/planner');
	}

	function openMeal(meal) {
		selectMeal(meal);
		setBrowseMode('region');
	}

	function selectMealInPlace(meal) {
		setSelectedMealSummary(meal);
		setSelectedMealDetails(null);
		setDetailError('');
	}

	function renderHome() {
		return <HomePage showcaseMeals={showcaseMeals} onOpenMeal={openMeal} onGoExplore={goExplore} onGoPlanner={goPlanner} />;
	}

	function renderExplore() {
		return (
			<ExplorePage
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				browseMode={browseMode}
				setBrowseMode={setBrowseMode}
				selectedLetter={selectedLetter}
				setSelectedLetter={setSelectedLetter}
				selectedRegionKey={selectedRegionKey}
				setSelectedRegionKey={setSelectedRegionKey}
				selectedRegion={selectedRegion}
				currentBrowseLabel={currentBrowseLabel}
				loadingMeals={loadingMeals}
				mealError={mealError}
				meals={meals}
				activeMeal={activeMeal}
				selectedMealTitle={selectedMealTitle}
				prepTime={prepTime}
				ingredientList={ingredientList}
				steps={steps}
				loadingDetails={loadingDetails}
				detailError={detailError}
				onSelectMeal={selectMealInPlace}
				onOpenPlanner={goPlanner}
			/>
		);
	}

	function renderPlanner() {
		return (
			<PlannerPage
				activeMeal={activeMeal}
				selectedMealTitle={selectedMealTitle}
				prepTime={prepTime}
				ingredientList={ingredientList}
				steps={steps}
				loadingDetails={loadingDetails}
				detailError={detailError}
				applyQuickSubstitution={applyQuickSubstitution}
				clearMealSubstitutions={clearMealSubstitutions}
				clearAllSubstitutions={clearAllSubstitutions}
				swapIngredient={swapIngredient}
				setSwapIngredient={setSwapIngredient}
				swapReplacement={swapReplacement}
				setSwapReplacement={setSwapReplacement}
				applySubstitution={applySubstitution}
				swapNote={swapNote}
				meals={meals}
				weeklyPlan={weeklyPlan}
				generatingWeeklyPlan={generatingWeeklyPlan}
				weeklyPlanError={weeklyPlanError}
				onGenerateWeeklyPlan={generateWeeklyPlan}
				onOpenMeal={openMeal}
			/>
		);
	}

	return (
		<div className="app-shell">
			<AppHeader selectedMealTitle={selectedMealTitle} />
			<Routes>
				<Route path="/" element={renderHome()} />
				<Route path="/explore" element={renderExplore()} />
				<Route
					path="/planner"
					element={renderPlanner()}
				/>
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</div>
	);
}

export default App;

