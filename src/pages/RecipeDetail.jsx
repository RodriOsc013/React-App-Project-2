import { Link, useParams } from "react-router-dom";

function RecipeDetail({ recipes, favorites, mealPlan, onToggleFavorite, onAddToPlan }) {
  const { recipeId } = useParams();
  const recipe = recipes.find((item) => item.id === recipeId);

  if (!recipe) {
    return (
      <section>
        <h2>Recipe not found</h2>
        <p>Try another recipe from the browse list.</p>
        <Link className="button" to="/recipes">
          Back to browse
        </Link>
      </section>
    );
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">Recipe detail</p>
          <h2>{recipe.name}</h2>
          <p className="meta">
            {recipe.time} min · {recipe.tags.join(" · ")}
          </p>
        </div>
        <div className="card-actions">
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
          <Link className="button secondary" to="/recipes">
            Back to browse
          </Link>
        </div>
      </div>

      <div className="detail-grid">
        <div>
          <h3>Ingredients</h3>
          <ul>
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Steps</h3>
          <ol>
            {recipe.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default RecipeDetail;
