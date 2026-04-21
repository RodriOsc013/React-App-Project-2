import { Link } from "react-router-dom";

function MealPlans({ planRecipes, onRemoveFromPlan }) {
  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">Meal plans</p>
          <h2>Your weekly lineup</h2>
          <p>Drag meals here by adding them from browse or favorites.</p>
        </div>
        <Link className="button secondary" to="/recipes">
          Add more recipes
        </Link>
      </div>

      {planRecipes.length === 0 ? (
        <p className="empty">No meals in the plan yet. Add some recipes.</p>
      ) : (
        <div className="recipe-grid">
          {planRecipes.map((recipe) => (
            <article key={recipe.id} className="recipe-card">
              <div>
                <h3>{recipe.name}</h3>
                <p className="meta">
                  {recipe.time} min · {recipe.tags.join(" · ")}
                </p>
              </div>
              <div className="card-actions">
                <Link className="button" to={`/recipes/${recipe.id}`}>
                  Details
                </Link>
                <button
                  type="button"
                  className="button"
                  onClick={() => onRemoveFromPlan(recipe.id)}
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MealPlans;
