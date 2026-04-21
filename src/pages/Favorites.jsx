import { Link } from "react-router-dom";

function Favorites({ recipes, favorites, onToggleFavorite, onAddToPlan }) {
  const favoriteRecipes = recipes.filter((recipe) => favorites.includes(recipe.id));

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">Favorites</p>
          <h2>Saved recipes</h2>
          <p>Keep your go-to meals ready for the week.</p>
        </div>
        <Link className="button secondary" to="/recipes">
          Browse all
        </Link>
      </div>

      {favoriteRecipes.length === 0 ? (
        <p className="empty">No favorites yet. Save a recipe to see it here.</p>
      ) : (
        <div className="recipe-grid">
          {favoriteRecipes.map((recipe) => (
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
                  className="button"
                  onClick={() => onToggleFavorite(recipe.id)}
                >
                  Remove
                </button>
                <button
                  type="button"
                  className="button filled"
                  onClick={() => onAddToPlan(recipe.id)}
                >
                  Add to plan
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Favorites;
