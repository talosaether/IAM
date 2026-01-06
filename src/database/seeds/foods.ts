export const FOODS_SEED = [
  // Fruits
  { name: 'Apple', category: 'fruits', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, servingSize: '1 medium (182g)' },
  { name: 'Banana', category: 'fruits', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, servingSize: '1 medium (118g)' },
  { name: 'Blueberries', category: 'fruits', calories: 84, protein: 1.1, carbs: 21, fat: 0.5, fiber: 3.6, servingSize: '1 cup (148g)' },
  { name: 'Strawberries', category: 'fruits', calories: 49, protein: 1, carbs: 12, fat: 0.5, fiber: 3, servingSize: '1 cup (152g)' },
  { name: 'Orange', category: 'fruits', calories: 62, protein: 1.2, carbs: 15, fat: 0.2, fiber: 3.1, servingSize: '1 medium (131g)' },
  { name: 'Avocado', category: 'fruits', calories: 234, protein: 2.9, carbs: 12, fat: 21, fiber: 10, servingSize: '1 medium (150g)' },

  // Vegetables
  { name: 'Broccoli', category: 'vegetables', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, fiber: 5.1, servingSize: '1 cup chopped (156g)' },
  { name: 'Spinach', category: 'vegetables', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, servingSize: '1 cup raw (30g)' },
  { name: 'Carrots', category: 'vegetables', calories: 52, protein: 1.2, carbs: 12, fat: 0.3, fiber: 3.6, servingSize: '1 cup chopped (128g)' },
  { name: 'Sweet Potato', category: 'vegetables', calories: 103, protein: 2.3, carbs: 24, fat: 0.1, fiber: 3.8, servingSize: '1 medium (114g)' },
  { name: 'Kale', category: 'vegetables', calories: 33, protein: 2.9, carbs: 6, fat: 0.6, fiber: 2.6, servingSize: '1 cup chopped (67g)' },
  { name: 'Bell Pepper', category: 'vegetables', calories: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 2.1, servingSize: '1 medium (119g)' },

  // Proteins
  { name: 'Chicken Breast', category: 'protein', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: null, servingSize: '100g cooked' },
  { name: 'Salmon', category: 'protein', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: null, servingSize: '100g cooked' },
  { name: 'Eggs', category: 'protein', calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: null, servingSize: '2 large eggs (100g)' },
  { name: 'Tofu', category: 'protein', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: null, servingSize: '100g' },
  { name: 'Lentils', category: 'protein', calories: 230, protein: 18, carbs: 40, fat: 0.8, fiber: 15.6, servingSize: '1 cup cooked (198g)' },
  { name: 'Black Beans', category: 'protein', calories: 227, protein: 15, carbs: 41, fat: 0.9, fiber: 15, servingSize: '1 cup cooked (172g)' },

  // Grains
  { name: 'Oatmeal', category: 'carbs', calories: 158, protein: 6, carbs: 27, fat: 3.2, fiber: 4, servingSize: '1 cup cooked (234g)' },
  { name: 'Brown Rice', category: 'carbs', calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5, servingSize: '1 cup cooked (195g)' },
  { name: 'Quinoa', category: 'carbs', calories: 222, protein: 8.1, carbs: 39, fat: 3.6, fiber: 5.2, servingSize: '1 cup cooked (185g)' },
  { name: 'Whole Wheat Bread', category: 'carbs', calories: 69, protein: 3.6, carbs: 12, fat: 1.1, fiber: 1.9, servingSize: '1 slice (28g)' },

  // Dairy
  { name: 'Greek Yogurt', category: 'dairy', calories: 100, protein: 17, carbs: 6, fat: 0.7, fiber: null, servingSize: '1 cup (170g)' },
  { name: 'Cottage Cheese', category: 'dairy', calories: 163, protein: 28, carbs: 6.1, fat: 2.3, fiber: null, servingSize: '1 cup (226g)' },
  { name: 'Milk (2%)', category: 'dairy', calories: 122, protein: 8.1, carbs: 12, fat: 4.8, fiber: null, servingSize: '1 cup (244ml)' },

  // Nuts & Seeds
  { name: 'Almonds', category: 'fats', calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5, servingSize: '1 oz (28g)' },
  { name: 'Walnuts', category: 'fats', calories: 185, protein: 4.3, carbs: 3.9, fat: 18, fiber: 1.9, servingSize: '1 oz (28g)' },
  { name: 'Chia Seeds', category: 'fats', calories: 138, protein: 4.7, carbs: 12, fat: 8.7, fiber: 9.8, servingSize: '1 oz (28g)' },
  { name: 'Peanut Butter', category: 'fats', calories: 188, protein: 8, carbs: 6, fat: 16, fiber: 1.9, servingSize: '2 tbsp (32g)' },

  // Beverages
  { name: 'Green Tea', category: 'other', calories: 2, protein: 0, carbs: 0, fat: 0, fiber: null, servingSize: '1 cup (240ml)' },
  { name: 'Black Coffee', category: 'other', calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: null, servingSize: '1 cup (240ml)' },
  { name: 'Coconut Water', category: 'other', calories: 46, protein: 1.7, carbs: 9, fat: 0.5, fiber: null, servingSize: '1 cup (240ml)' },
]

export const FOODS_INSERT_SQL = `
INSERT INTO foods (name, category, calories, protein, carbs, fat, fiber, serving_size, is_custom)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
`
