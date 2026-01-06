export const MEALS_SEED = [
  // Breakfast
  { name: 'Overnight Oats', mealType: 'breakfast', description: 'Oats, Greek yogurt, Chia seeds, Honey, Berries', prepTime: 5, calories: 350 },
  { name: 'Avocado Toast with Eggs', mealType: 'breakfast', description: 'Whole wheat bread, Avocado, Eggs, Cherry tomatoes, Everything seasoning', prepTime: 10, calories: 420 },
  { name: 'Protein Smoothie Bowl', mealType: 'breakfast', description: 'Frozen banana, Berries, Protein powder, Almond milk, Granola, Nut butter', prepTime: 5, calories: 380 },
  { name: 'Veggie Omelette', mealType: 'breakfast', description: 'Eggs, Spinach, Bell peppers, Onion, Feta cheese', prepTime: 15, calories: 310 },
  { name: 'Greek Yogurt Parfait', mealType: 'breakfast', description: 'Greek yogurt, Granola, Mixed berries, Honey, Almonds', prepTime: 5, calories: 320 },
  { name: 'Banana Oat Pancakes', mealType: 'breakfast', description: 'Banana, Oats, Eggs, Cinnamon, Maple syrup', prepTime: 20, calories: 380 },

  // Lunch
  { name: 'Grilled Chicken Salad', mealType: 'lunch', description: 'Chicken breast, Mixed greens, Cherry tomatoes, Cucumber, Olive oil, Lemon', prepTime: 20, calories: 420 },
  { name: 'Mediterranean Quinoa Bowl', mealType: 'lunch', description: 'Quinoa, Chickpeas, Cucumber, Tomatoes, Feta, Olives, Hummus', prepTime: 25, calories: 480 },
  { name: 'Turkey Avocado Wrap', mealType: 'lunch', description: 'Whole wheat wrap, Turkey breast, Avocado, Lettuce, Tomato, Mustard', prepTime: 10, calories: 390 },
  { name: 'Tuna Salad Sandwich', mealType: 'lunch', description: 'Whole wheat bread, Tuna, Greek yogurt, Celery, Lettuce, Lemon', prepTime: 10, calories: 360 },
  { name: 'Buddha Bowl', mealType: 'lunch', description: 'Brown rice, Roasted chickpeas, Sweet potato, Kale, Tahini dressing', prepTime: 30, calories: 520 },
  { name: 'Lentil Soup & Side Salad', mealType: 'lunch', description: 'Lentils, Carrots, Celery, Onion, Mixed greens, Balsamic vinegar', prepTime: 35, calories: 380 },

  // Dinner
  { name: 'Baked Salmon with Veggies', mealType: 'dinner', description: 'Salmon fillet, Asparagus, Lemon, Garlic, Olive oil, Dill', prepTime: 25, calories: 450 },
  { name: 'Chicken Veggie Stir Fry', mealType: 'dinner', description: 'Chicken breast, Broccoli, Bell peppers, Snap peas, Soy sauce, Ginger, Brown rice', prepTime: 25, calories: 480 },
  { name: 'Turkey Meatballs & Zucchini Noodles', mealType: 'dinner', description: 'Ground turkey, Zucchini, Marinara sauce, Garlic, Italian herbs, Parmesan', prepTime: 30, calories: 420 },
  { name: 'Shrimp Tacos', mealType: 'dinner', description: 'Shrimp, Corn tortillas, Cabbage slaw, Avocado, Lime, Cilantro', prepTime: 20, calories: 380 },
  { name: 'Stuffed Bell Peppers', mealType: 'dinner', description: 'Bell peppers, Ground beef or turkey, Brown rice, Black beans, Tomatoes, Cheese', prepTime: 45, calories: 440 },
  { name: 'Tofu Coconut Curry', mealType: 'dinner', description: 'Tofu, Coconut milk, Curry paste, Bell peppers, Spinach, Jasmine rice', prepTime: 30, calories: 460 },
  { name: 'Grilled Chicken & Sweet Potato', mealType: 'dinner', description: 'Chicken breast, Sweet potato, Broccoli, Olive oil, Herbs', prepTime: 35, calories: 490 },

  // Snacks
  { name: 'Apple with Peanut Butter', mealType: 'snack', description: 'Apple, Peanut butter', prepTime: 2, calories: 200 },
  { name: 'Hummus & Veggie Sticks', mealType: 'snack', description: 'Hummus, Carrots, Celery, Bell peppers, Cucumber', prepTime: 5, calories: 150 },
  { name: 'Greek Yogurt & Berries', mealType: 'snack', description: 'Greek yogurt, Mixed berries, Honey', prepTime: 2, calories: 180 },
  { name: 'Homemade Trail Mix', mealType: 'snack', description: 'Almonds, Walnuts, Dark chocolate chips, Dried cranberries', prepTime: 2, calories: 220 },
  { name: 'Cheese & Whole Grain Crackers', mealType: 'snack', description: 'Cheddar cheese, Whole grain crackers', prepTime: 2, calories: 180 },
  { name: 'No-Bake Protein Balls', mealType: 'snack', description: 'Oats, Peanut butter, Honey, Protein powder, Dark chocolate chips', prepTime: 15, calories: 150 },
  { name: 'Cottage Cheese & Fruit', mealType: 'snack', description: 'Cottage cheese, Pineapple, Walnuts', prepTime: 2, calories: 190 },
  { name: 'Steamed Edamame', mealType: 'snack', description: 'Edamame, Sea salt', prepTime: 5, calories: 120 },
]

export const MEALS_INSERT_SQL = `
INSERT INTO meal_ideas (name, meal_type, description, prep_time, is_favorite)
VALUES (?, ?, ?, ?, 0)
`
