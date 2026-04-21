import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

function SearchRecipes({ recipes, tags, favorites, onToggleFavorite }) {
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");

  const results = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesQuery = recipe.name
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesTag = selectedTag === "all" || recipe.tags.includes(selectedTag);
      return matchesQuery && matchesTag;
    });
  }, [recipes, query, selectedTag]);

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">Search & filter</p>
          <h2>Find recipes quickly</h2>
          <p>Filter by tag or search by recipe name.</p>
        </div>
        <Link className="button secondary" to="/recipes">
          Back to browse
        </Link>
      </div>

      <div className="filters">
        <label>
          Search
          <input
            type="text"
            placeholder="Try pesto or salmon..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label>
          Tag
          <select
            value={selectedTag}
            onChange={(event) => setSelectedTag(event.target.value)}
          >
            <option value="all">All tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="recipe-grid">
        {results.map((recipe) => (
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
                className={favorites.includes(recipe.id) ? "button filled" : "button"}
                onClick={() => onToggleFavorite(recipe.id)}
              >
                {favorites.includes(recipe.id) ? "Favorited" : "Save"}
              </button>
            </div>
          </article>
        ))}
        {results.length === 0 && (
          <p className="empty">No recipes match your search yet.</p>
        )}
      </div>
    </section>
  );
}

export default SearchRecipes;
