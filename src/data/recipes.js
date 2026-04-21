export const recipes = [
  {
    id: "sunny-citrus-salad",
    name: "Sunny Citrus Salad",
    time: 15,
    tags: ["vegetarian", "light"],
    ingredients: [
      "2 oranges",
      "1 grapefruit",
      "2 cups arugula",
      "1/4 cup feta",
      "2 tbsp olive oil",
      "1 tsp honey",
    ],
    steps: [
      "Segment the citrus and reserve the juice.",
      "Whisk olive oil, honey, and citrus juice for dressing.",
      "Toss arugula with dressing, top with citrus and feta.",
    ],
  },
  {
    id: "weeknight-taco-bowls",
    name: "Weeknight Taco Bowls",
    time: 25,
    tags: ["gluten-free", "family"],
    ingredients: [
      "1 lb ground turkey",
      "1 cup black beans",
      "1 cup corn",
      "1 tsp taco seasoning",
      "2 cups cooked rice",
      "1 avocado",
    ],
    steps: [
      "Brown turkey with taco seasoning.",
      "Warm beans and corn together.",
      "Assemble bowls with rice, turkey, veggies, and avocado.",
    ],
  },
  {
    id: "creamy-pesto-pasta",
    name: "Creamy Pesto Pasta",
    time: 20,
    tags: ["comfort", "vegetarian"],
    ingredients: [
      "8 oz pasta",
      "1/2 cup pesto",
      "1/3 cup Greek yogurt",
      "1 cup cherry tomatoes",
      "1/4 cup parmesan",
    ],
    steps: [
      "Cook pasta until al dente.",
      "Stir pesto and yogurt together for a creamy sauce.",
      "Combine with pasta and tomatoes, finish with parmesan.",
    ],
  },
  {
    id: "ginger-salmon-bowl",
    name: "Ginger Salmon Bowl",
    time: 30,
    tags: ["high-protein", "seafood"],
    ingredients: [
      "2 salmon fillets",
      "1 tbsp soy sauce",
      "1 tsp grated ginger",
      "2 cups steamed rice",
      "1 cup snap peas",
      "1 tbsp sesame seeds",
    ],
    steps: [
      "Marinate salmon with soy sauce and ginger.",
      "Bake salmon at 400°F for 12 minutes.",
      "Serve over rice with snap peas and sesame seeds.",
    ],
  },
  {
    id: "hearty-veggie-chili",
    name: "Hearty Veggie Chili",
    time: 40,
    tags: ["vegan", "meal-prep"],
    ingredients: [
      "1 onion",
      "1 bell pepper",
      "2 cups kidney beans",
      "1 can diced tomatoes",
      "1 tbsp chili powder",
      "1 cup vegetable broth",
    ],
    steps: [
      "Sauté onion and pepper until soft.",
      "Add beans, tomatoes, broth, and spices.",
      "Simmer for 20 minutes and serve warm.",
    ],
  },
];

export const recipeTags = Array.from(
  new Set(recipes.flatMap((recipe) => recipe.tags))
);
