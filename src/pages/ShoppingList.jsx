function ShoppingList({ items }) {
  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">Shopping list</p>
          <h2>Ingredients to pick up</h2>
          <p>Generated automatically from the meals in your plan.</p>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="empty">Add recipes to your meal plan to build a list.</p>
      ) : (
        <ul className="shopping-list">
          {items.map((item) => (
            <li key={item.name}>
              <span>{item.name}</span>
              <span className="pill">{item.count}x</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ShoppingList;
