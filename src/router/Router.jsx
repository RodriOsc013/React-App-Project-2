import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, NavLink, Route, Routes, Navigate } from "react-router-dom";
import "../App.css";
import BrowseRecipes from "../pages/BrowseRecipes";
import Favorites from "../pages/Favorites";
import MealPlans from "../pages/MealPlans";
import RecipeDetail from "../pages/RecipeDetail";
import SearchRecipes from "../pages/SearchRecipes";
import ShoppingList from "../pages/ShoppingList";
import { recipeTags, recipes as recipeData } from "../data/recipes";

const FAVORITES_KEY = "mealPlanner.favorites";
const PLAN_KEY = "mealPlanner.plan";

function Router() {
  const [favorites, setFavorites] = useState(() =>
    JSON.parse(window.localStorage.getItem(FAVORITES_KEY) || "[]")
  );
  const [mealPlan, setMealPlan] = useState(() =>
    JSON.parse(window.localStorage.getItem(PLAN_KEY) || "[]")
  );

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    window.localStorage.setItem(PLAN_KEY, JSON.stringify(mealPlan));
  }, [mealPlan]);

  const toggleFavorite = (recipeId) => {
    setFavorites((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const addToPlan = (recipeId) => {
    setMealPlan((prev) =>
      prev.includes(recipeId) ? prev : [...prev, recipeId]
    );
  };

  const removeFromPlan = (recipeId) => {
    setMealPlan((prev) => prev.filter((id) => id !== recipeId));
  };

  const planRecipes = useMemo(
    () => recipeData.filter((recipe) => mealPlan.includes(recipe.id)),
    [mealPlan]
  );

  const shoppingItems = useMemo(() => {
    const counts = new Map();
    planRecipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        counts.set(ingredient, (counts.get(ingredient) || 0) + 1);
      });
    });

    return Array.from(counts.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }, [planRecipes]);

  return (
    <BrowserRouter>
      <div className="router-shell">
        <header className="router-header">
          <div>
            <p className="eyebrow">Meal Planner</p>
            <h1>Plan meals, recipes, and shopping</h1>
            <p>Create a weekly menu with favorites and auto-generated lists.</p>
          </div>
          <nav className="router-nav">
            <NavLink to="/recipes">Browse recipes</NavLink>
            <NavLink to="/search">Search & filter</NavLink>
            <NavLink to="/favorites">Favorites</NavLink>
            <NavLink to="/meal-plans">Meal plans</NavLink>
            <NavLink to="/shopping-list">Shopping list</NavLink>
          </nav>
        </header>

        <main className="router-main">
          <Routes>
            <Route path="/" element={<Navigate to="/recipes" replace />} />
            <Route
              path="/recipes"
              element={
                <BrowseRecipes
                  recipes={recipeData}
                  favorites={favorites}
                  mealPlan={mealPlan}
                  onToggleFavorite={toggleFavorite}
                  onAddToPlan={addToPlan}
                />
              }
            />
            <Route
              path="/recipes/:recipeId"
              element={
                <RecipeDetail
                  recipes={recipeData}
                  favorites={favorites}
                  mealPlan={mealPlan}
                  onToggleFavorite={toggleFavorite}
                  onAddToPlan={addToPlan}
                />
              }
            />
            <Route
              path="/search"
              element={
                <SearchRecipes
                  recipes={recipeData}
                  tags={recipeTags}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              }
            />
            <Route
              path="/favorites"
              element={
                <Favorites
                  recipes={recipeData}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onAddToPlan={addToPlan}
                />
              }
            />
            <Route
              path="/meal-plans"
              element={
                <MealPlans
                  planRecipes={planRecipes}
                  onRemoveFromPlan={removeFromPlan}
                />
              }
            />
            <Route
              path="/shopping-list"
              element={<ShoppingList items={shoppingItems} />}
            />
            <Route path="*" element={<Navigate to="/recipes" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default Router;
