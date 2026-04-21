import { Link } from "react-router-dom";

function BrowseRecipes({ recipes, favorites, mealPlan, onToggleFavorite, onAddToPlan }) {
  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">Browse recipes</p>
          <h2>Explore meals from local data</h2>
          <p>Pick a recipe to view the full details or add it to your plan.</p>
        </div>
        <Link className="button secondary" to="/search">
          Search & filter
        </Link>
      </div>

      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <article key={recipe.id} className="recipe-card">
            <div>
              <h3>{recipe.name}</h3>
              <p className="meta">
                {recipe.time} min · {recipe.tags.join(" · ")}
              </p>
            </div>
            <div className="card-actions">
              <Link className="button" to={`/recipes/${recipe.id}`}>
                View details
              </Link>
              <button
                type="button"
                className={favorites.includes(recipe.id) ? "button filled" : "button"}
                onClick={() => onToggleFavorite(recipe.id)}
              >
                {favorites.includes(recipe.id) ? "Favorited" : "Save"}
              </button>
              <button
                type="button"
                className={mealPlan.includes(recipe.id) ? "button filled" : "button"}
                onClick={() => onAddToPlan(recipe.id)}
              >
                {mealPlan.includes(recipe.id) ? "In plan" : "Add to plan"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default BrowseRecipes;
