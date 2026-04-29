import { useState } from "react";
import "./App.css";
function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [results, setResults] = useState([]);
  const [statusMessage, setStatusMessage] = useState(
    "Search for a recipe to begin."
  );
  const [showModal, setShowModal] = useState(false);
  const [mealDetails, setMealDetails] = useState(null);
  const handleSearch = () => {
    if (!search.trim() && !category) {
      setStatusMessage("Please enter a search or select a category.");
      return;
    }
    fetchMeals();
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };
  async function fetchMeals() {
    const query = search.trim();
    setResults([]);
    setMealDetails(null);
    setStatusMessage("Loading...");
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
      );
      const data = await response.json();
      let meals = data.meals;
      if (!meals) {
        setStatusMessage(
          "No recipes found. Showing popular chicken recipes instead."
        );
        const fallback = await fetch(
          "https://www.themealdb.com/api/json/v1/1/search.php?s=chicken"
        );
        const fallbackData = await fallback.json();
        meals = fallbackData.meals;
      } else {
        setStatusMessage("");
      }
      displayMeals(meals);
    } catch (error) {
      displayError();
    }
  }
  function displayMeals(meals) {
    if (!meals || meals.length === 0) {
      setStatusMessage(
        "No recipes found. Try 'chicken', 'beef', 'pasta', or 'dessert'."
      );
      return;
    }
    let filteredMeals = meals;
    if (category) {
      filteredMeals = meals.filter(
        (meal) =>
          meal.strCategory.toLowerCase() === category.toLowerCase()
      );
      if (!filteredMeals.length) filteredMeals = meals;
    }
    setResults(filteredMeals);
  }
  async function fetchMealDetails(id) {
    setShowModal(true);
    setMealDetails({ loading: true });
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      const data = await response.json();
      setMealDetails(data.meals[0]);
    } catch (error) {
      displayError();
    }
  }
  function displayError() {
    setStatusMessage("Something went wrong. Try again.");
  }
  const closeModal = () => {
    setShowModal(false);
    setMealDetails(null);
  };
  const renderIngredients = (meal) => {
    let items = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== "") {
        items.push(
          <li key={i}>
            {ingredient} - {measure}
          </li>
        );
      }
    }
    return items;
  };
  return (
    <>
      <main className="container">
        <section className="recipe-app">
          <h1>Recipe Finder</h1>
          <div className="search-box">
            <input type="text"placeholder="Search recipes..."value={search}onChange={(e) => setSearch(e.target.value)}onKeyDown={handleKeyPress}/>
            <select value={category}onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              <option value="Seafood">Seafood</option>
              <option value="Chicken">Chicken</option>
              <option value="Beef">Beef</option>
              <option value="Starter">Soup</option>
              <option value="Dessert">Dessert</option>
            </select>
            <button onClick={handleSearch}>Search</button>
          </div>
          <p>{statusMessage}</p>
          <div className="results">
            {results.map((meal) => (
              <div key={meal.idMeal}className="card"onClick={() => fetchMealDetails(meal.idMeal)}>
                <img src={meal.strMealThumb} alt={meal.strMeal} />
                <h3>{meal.strMeal}</h3>
                <p className="category">{meal.strCategory}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      {showModal && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content"onClick={(e) => e.stopPropagation()}>
            <span onClick={closeModal}>&times;</span>
            {!mealDetails || mealDetails.loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <h2>{mealDetails.strMeal}</h2>
                <img src={mealDetails.strMealThumb}alt={mealDetails.strMeal}/>
                <p>
                  <strong>Category:</strong>{" "}
                  {mealDetails.strCategory}
                </p>
                <div className="recipe-section">
                  <h3>Ingredients</h3>
                  <ul className="ingredients">
                    {renderIngredients(mealDetails)}
                  </ul>
                </div>
                <div className="recipe-section">
                  <h3>Instructions</h3>
                  <p className="instructions">
                    {mealDetails.strInstructions}
                  </p>
                </div>
                {mealDetails.strYoutube && (
                  <div className="recipe-section">
                    <h3>Video</h3>
                    <a href={mealDetails.strYoutube}target="_blank"rel="noreferrer">Watch on YouTube</a>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
export default App;