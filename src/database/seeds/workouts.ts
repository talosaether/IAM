// Workout programs seed data
// Full workout data is stored in this file and will be seeded to SQLite

export type SportType = 'general' | 'basketball' | 'soccer' | 'running' | 'swimming'
export type AgeGroup = 'teen' | 'adult'

export interface ExerciseData {
  name: string
  sets?: number
  reps?: string
  duration?: string
  notes?: string
}

export interface WorkoutBlockData {
  name: string
  type: 'strength' | 'cardio' | 'skill'
  exercises: ExerciseData[]
}

export interface DayPlanData {
  dayOfWeek: number
  name: string
  focusArea: string
  coachTip: string
  blocks: WorkoutBlockData[]
}

export interface ProgramData {
  name: string
  sportType: SportType
  ageGroup: AgeGroup
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  days: DayPlanData[]
}

// All 14 workout programs (7 sport types × 2 age groups)
export const WORKOUT_PROGRAMS: ProgramData[] = [
  // General Fitness - Adult
  {
    name: 'General Fitness',
    sportType: 'general',
    ageGroup: 'adult',
    description: 'Complete fitness program with push/pull/legs split and cardio',
    difficulty: 'intermediate',
    days: [
      { dayOfWeek: 0, name: 'Active Recovery', focusArea: 'Rest & Mobility', coachTip: 'Recovery is where gains are made.', blocks: [
        { name: 'Mobility Flow', type: 'skill', exercises: [
          { name: 'Foam Rolling', duration: '10 min' },
          { name: 'Full Body Stretch', duration: '15 min' },
          { name: 'Light Yoga Flow', duration: '20 min' },
        ]},
        { name: 'Light Movement', type: 'cardio', exercises: [
          { name: 'Easy Walk', duration: '20-30 min', notes: 'Zone 1-2' },
        ]},
      ]},
      { dayOfWeek: 1, name: 'Push Day', focusArea: 'Chest, Shoulders, Triceps', coachTip: 'Start the week strong.', blocks: [
        { name: 'Push Strength', type: 'strength', exercises: [
          { name: 'Bench Press', sets: 4, reps: '6-8' },
          { name: 'Overhead Press', sets: 3, reps: '8-10' },
          { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12' },
          { name: 'Lateral Raises', sets: 3, reps: '12-15' },
          { name: 'Tricep Pushdowns', sets: 3, reps: '12-15' },
          { name: 'Dips', sets: 3, reps: 'AMRAP' },
        ]},
        { name: 'Conditioning', type: 'cardio', exercises: [
          { name: 'Zone 2 Cardio', duration: '20 min' },
        ]},
      ]},
      { dayOfWeek: 2, name: 'Cardio & Core', focusArea: 'Endurance + Core', coachTip: 'Build that engine.', blocks: [
        { name: 'Cardio Session', type: 'cardio', exercises: [
          { name: 'Dynamic Warmup', duration: '5 min' },
          { name: 'Tempo Run / Bike', duration: '30-40 min' },
          { name: 'Cool Down Walk', duration: '5 min' },
        ]},
        { name: 'Core Work', type: 'skill', exercises: [
          { name: 'Plank Hold', sets: 3, duration: '45-60 sec' },
          { name: 'Dead Bugs', sets: 3, reps: '10 each side' },
          { name: 'Russian Twists', sets: 3, reps: '20' },
        ]},
      ]},
      { dayOfWeek: 3, name: 'Pull Day', focusArea: 'Back, Biceps', coachTip: 'A strong back prevents injury.', blocks: [
        { name: 'Pull Strength', type: 'strength', exercises: [
          { name: 'Deadlift', sets: 4, reps: '5' },
          { name: 'Pull-ups', sets: 4, reps: '6-10' },
          { name: 'Barbell Rows', sets: 3, reps: '8-10' },
          { name: 'Face Pulls', sets: 3, reps: '15' },
          { name: 'Bicep Curls', sets: 3, reps: '10-12' },
        ]},
      ]},
      { dayOfWeek: 4, name: 'HIIT Day', focusArea: 'High Intensity Intervals', coachTip: 'Short and intense.', blocks: [
        { name: 'HIIT Circuit', type: 'cardio', exercises: [
          { name: 'Dynamic Warmup', duration: '5 min' },
          { name: 'Burpees', sets: 4, reps: '10' },
          { name: 'Jump Squats', sets: 4, reps: '15' },
          { name: 'Mountain Climbers', sets: 4, duration: '30 sec' },
          { name: 'Box Jumps', sets: 4, reps: '10' },
        ]},
      ]},
      { dayOfWeek: 5, name: 'Legs Day', focusArea: 'Lower Body Strength', coachTip: 'Never skip leg day.', blocks: [
        { name: 'Leg Strength', type: 'strength', exercises: [
          { name: 'Barbell Squats', sets: 4, reps: '6-8' },
          { name: 'Romanian Deadlift', sets: 3, reps: '10' },
          { name: 'Walking Lunges', sets: 3, reps: '12 each leg' },
          { name: 'Leg Press', sets: 3, reps: '12' },
          { name: 'Calf Raises', sets: 4, reps: '15' },
        ]},
      ]},
      { dayOfWeek: 6, name: 'Long Cardio', focusArea: 'Endurance Building', coachTip: 'Build mental and physical endurance.', blocks: [
        { name: 'Endurance Session', type: 'cardio', exercises: [
          { name: 'Easy Warmup', duration: '10 min' },
          { name: 'Long Run / Bike / Swim', duration: '45-60 min' },
          { name: 'Cool Down', duration: '5 min' },
        ]},
      ]},
    ],
  },

  // General Fitness - Teen
  {
    name: 'General Fitness',
    sportType: 'general',
    ageGroup: 'teen',
    description: 'Foundational fitness program for teens with bodyweight focus',
    difficulty: 'beginner',
    days: [
      { dayOfWeek: 0, name: 'Active Recovery', focusArea: 'Rest & Mobility', coachTip: 'Recovery is when your body gets stronger.', blocks: [
        { name: 'Mobility Flow', type: 'skill', exercises: [
          { name: 'Foam Rolling', duration: '10 min' },
          { name: 'Full Body Stretch', duration: '15 min' },
        ]},
      ]},
      { dayOfWeek: 1, name: 'Upper Push', focusArea: 'Chest, Shoulders, Triceps', coachTip: 'Focus on form over weight.', blocks: [
        { name: 'Push Strength', type: 'strength', exercises: [
          { name: 'Push-ups', sets: 3, reps: '12-15' },
          { name: 'Dumbbell Press', sets: 3, reps: '10-12' },
          { name: 'Pike Push-ups', sets: 3, reps: '8-10' },
          { name: 'Lateral Raises', sets: 3, reps: '12' },
        ]},
      ]},
      { dayOfWeek: 2, name: 'Speed & Agility', focusArea: 'Quickness, Footwork', coachTip: 'Quick feet make great athletes.', blocks: [
        { name: 'Agility Training', type: 'cardio', exercises: [
          { name: 'Dynamic Warmup', duration: '5 min' },
          { name: 'Ladder Drills', duration: '10 min' },
          { name: 'Cone Drills', sets: 4, reps: '4 each' },
          { name: 'Short Sprints', sets: 6, reps: '30 yards' },
        ]},
      ]},
      { dayOfWeek: 3, name: 'Upper Pull', focusArea: 'Back, Biceps', coachTip: 'A strong back helps everything.', blocks: [
        { name: 'Pull Strength', type: 'strength', exercises: [
          { name: 'Pull-ups or Assisted', sets: 3, reps: '6-10' },
          { name: 'Dumbbell Rows', sets: 3, reps: '10-12 each arm' },
          { name: 'Band Face Pulls', sets: 3, reps: '15' },
          { name: 'Dumbbell Curls', sets: 3, reps: '12' },
        ]},
      ]},
      { dayOfWeek: 4, name: 'Plyometrics', focusArea: 'Power & Explosiveness', coachTip: 'Explode on every rep, land soft.', blocks: [
        { name: 'Plyometrics', type: 'cardio', exercises: [
          { name: 'Squat Jumps', sets: 3, reps: '8' },
          { name: 'Box Jumps', sets: 3, reps: '6' },
          { name: 'Broad Jumps', sets: 3, reps: '5' },
          { name: 'Lunge Jumps', sets: 3, reps: '8 total' },
        ]},
      ]},
      { dayOfWeek: 5, name: 'Legs', focusArea: 'Lower Body Strength', coachTip: 'Strong legs are the foundation.', blocks: [
        { name: 'Leg Strength', type: 'strength', exercises: [
          { name: 'Goblet Squats', sets: 3, reps: '12' },
          { name: 'Dumbbell RDL', sets: 3, reps: '10' },
          { name: 'Split Squats', sets: 3, reps: '10 each leg' },
          { name: 'Calf Raises', sets: 3, reps: '15' },
        ]},
      ]},
      { dayOfWeek: 6, name: 'Endurance', focusArea: 'Cardio & Mobility', coachTip: 'Build your engine.', blocks: [
        { name: 'Endurance Session', type: 'cardio', exercises: [
          { name: 'Run / Bike / Swim', duration: '30-40 min' },
        ]},
      ]},
    ],
  },

  // Basketball - Teen
  {
    name: 'Basketball Training',
    sportType: 'basketball',
    ageGroup: 'teen',
    description: 'Basketball-specific training with skills and strength',
    difficulty: 'intermediate',
    days: [
      { dayOfWeek: 0, name: 'Active Recovery', focusArea: 'Rest & Mobility', coachTip: 'Take care of it so you can ball out tomorrow.', blocks: [
        { name: 'Mobility Flow', type: 'skill', exercises: [
          { name: 'Foam Rolling', duration: '10 min' },
          { name: 'Hip Flexor Stretches', duration: '5 min' },
          { name: 'Ankle Mobility Work', duration: '5 min' },
        ]},
      ]},
      { dayOfWeek: 1, name: 'Upper Push + Handles', focusArea: 'Chest, Shoulders + Ball Handling', coachTip: 'Strong upper body = stronger finishes.', blocks: [
        { name: 'Push Strength', type: 'strength', exercises: [
          { name: 'Push-ups', sets: 3, reps: '12-15' },
          { name: 'Dumbbell Press', sets: 3, reps: '10-12' },
          { name: 'Lateral Raises', sets: 3, reps: '12' },
        ]},
        { name: 'Ball Handling', type: 'skill', exercises: [
          { name: 'Stationary Dribble Series', duration: '5 min' },
          { name: 'Combo Moves', duration: '10 min' },
          { name: 'Weak Hand Only', duration: '5 min' },
        ]},
      ]},
      { dayOfWeek: 2, name: 'Speed & Agility', focusArea: 'Quickness, Footwork', coachTip: 'Quick feet = open shots.', blocks: [
        { name: 'Agility Training', type: 'cardio', exercises: [
          { name: 'Ladder Drills', duration: '10 min' },
          { name: 'Defensive Slides', sets: 4, duration: '30 sec' },
          { name: 'Court Sprints', sets: 6 },
        ]},
      ]},
      { dayOfWeek: 3, name: 'Upper Pull + Shooting', focusArea: 'Back, Biceps + Shot Work', coachTip: 'A strong back helps your shot.', blocks: [
        { name: 'Pull Strength', type: 'strength', exercises: [
          { name: 'Pull-ups or Assisted', sets: 3, reps: '6-10' },
          { name: 'Dumbbell Rows', sets: 3, reps: '10-12 each arm' },
        ]},
        { name: 'Shooting Drills', type: 'skill', exercises: [
          { name: 'Form Shooting', reps: '30 makes' },
          { name: 'Elbow Shots', reps: '20 makes each side' },
          { name: 'Free Throws', reps: '20 makes' },
        ]},
      ]},
      { dayOfWeek: 4, name: 'Explosiveness', focusArea: 'Vertical Jump, Power', coachTip: 'This is how you get above the rim.', blocks: [
        { name: 'Plyometrics', type: 'cardio', exercises: [
          { name: 'Squat Jumps', sets: 3, reps: '8' },
          { name: 'Box Jumps', sets: 3, reps: '6' },
          { name: 'Rim Touches', sets: 3, reps: '6' },
        ]},
      ]},
      { dayOfWeek: 5, name: 'Legs + Conditioning', focusArea: 'Lower Body + Basketball Cardio', coachTip: 'Strong legs dominate the paint.', blocks: [
        { name: 'Leg Strength', type: 'strength', exercises: [
          { name: 'Goblet Squats', sets: 3, reps: '12' },
          { name: 'Bulgarian Split Squats', sets: 3, reps: '8 each leg' },
        ]},
        { name: 'Basketball Conditioning', type: 'cardio', exercises: [
          { name: 'Suicides', sets: 4 },
          { name: '17s', sets: 2 },
        ]},
      ]},
      { dayOfWeek: 6, name: 'Full Court Work', focusArea: 'Scrimmage, 1v1', coachTip: 'Put it all together.', blocks: [
        { name: 'Game Work', type: 'skill', exercises: [
          { name: '1v1 from Different Spots', duration: '15 min' },
          { name: 'Pick-up Games / Scrimmage', duration: '30-45 min' },
        ]},
      ]},
    ],
  },

  // Basketball - Adult
  {
    name: 'Basketball Training',
    sportType: 'basketball',
    ageGroup: 'adult',
    description: 'Advanced basketball training with strength and skills',
    difficulty: 'advanced',
    days: [
      { dayOfWeek: 0, name: 'Active Recovery', focusArea: 'Rest & Mobility', coachTip: 'Recovery is crucial.', blocks: [
        { name: 'Mobility Flow', type: 'skill', exercises: [
          { name: 'Foam Rolling', duration: '15 min' },
          { name: 'Hip Mobility', duration: '10 min' },
        ]},
      ]},
      { dayOfWeek: 1, name: 'Upper Push + Skills', focusArea: 'Chest, Shoulders + Ball Handling', coachTip: 'Build strength for contact at the rim.', blocks: [
        { name: 'Push Strength', type: 'strength', exercises: [
          { name: 'Bench Press', sets: 4, reps: '6-8' },
          { name: 'Overhead Press', sets: 3, reps: '8-10' },
        ]},
        { name: 'Ball Handling', type: 'skill', exercises: [
          { name: 'Dribble Series', duration: '15 min' },
        ]},
      ]},
      { dayOfWeek: 2, name: 'Speed & Agility', focusArea: 'Court Quickness', coachTip: 'First step quickness wins games.', blocks: [
        { name: 'Agility Training', type: 'cardio', exercises: [
          { name: 'Ladder Drills', duration: '10 min' },
          { name: 'Defensive Slides', sets: 5, duration: '30 sec' },
          { name: 'Full Court Sprints', sets: 8 },
        ]},
      ]},
      { dayOfWeek: 3, name: 'Upper Pull + Shooting', focusArea: 'Back, Biceps + Shot Work', coachTip: 'Strong back = better shot stability.', blocks: [
        { name: 'Pull Strength', type: 'strength', exercises: [
          { name: 'Deadlift', sets: 4, reps: '5' },
          { name: 'Pull-ups', sets: 4, reps: '8-10' },
        ]},
        { name: 'Shooting Drills', type: 'skill', exercises: [
          { name: 'Form Shooting', reps: '50 makes' },
          { name: '3-Pointers', reps: '25 makes' },
        ]},
      ]},
      { dayOfWeek: 4, name: 'Explosiveness', focusArea: 'Vertical, Power', coachTip: 'Elevate your game.', blocks: [
        { name: 'Plyometrics', type: 'cardio', exercises: [
          { name: 'Depth Jumps', sets: 4, reps: '6' },
          { name: 'Box Jumps', sets: 4, reps: '8' },
        ]},
      ]},
      { dayOfWeek: 5, name: 'Legs + Conditioning', focusArea: 'Lower Body Power', coachTip: 'Dominate in the paint.', blocks: [
        { name: 'Leg Strength', type: 'strength', exercises: [
          { name: 'Barbell Squats', sets: 4, reps: '6' },
          { name: 'Romanian Deadlift', sets: 3, reps: '10' },
        ]},
        { name: 'Court Conditioning', type: 'cardio', exercises: [
          { name: 'Suicides', sets: 5 },
        ]},
      ]},
      { dayOfWeek: 6, name: 'Game Day', focusArea: 'Scrimmage & Competition', coachTip: 'Compete.', blocks: [
        { name: 'Game Work', type: 'skill', exercises: [
          { name: '1v1 Work', duration: '20 min' },
          { name: 'Full Court Runs', duration: '45-60 min' },
        ]},
      ]},
    ],
  },

  // Soccer - Teen
  {
    name: 'Soccer Training',
    sportType: 'soccer',
    ageGroup: 'teen',
    description: 'Soccer-focused training with technical skills',
    difficulty: 'intermediate',
    days: [
      { dayOfWeek: 0, name: 'Active Recovery', focusArea: 'Rest & Mobility', coachTip: 'Rest up for the week ahead.', blocks: [
        { name: 'Mobility', type: 'skill', exercises: [
          { name: 'Foam Rolling', duration: '10 min' },
          { name: 'Full Body Stretch', duration: '10 min' },
        ]},
      ]},
      { dayOfWeek: 1, name: 'Upper Body + Ball Work', focusArea: 'Core, Upper Strength + Technical', coachTip: 'A strong core helps with balance.', blocks: [
        { name: 'Upper Strength', type: 'strength', exercises: [
          { name: 'Push-ups', sets: 3, reps: '15' },
          { name: 'Plank Hold', sets: 3, duration: '45 sec' },
        ]},
        { name: 'Ball Mastery', type: 'skill', exercises: [
          { name: 'Juggling', duration: '10 min' },
          { name: 'Cone Dribbling', duration: '10 min' },
        ]},
      ]},
      { dayOfWeek: 2, name: 'Speed & Agility', focusArea: 'Quickness, Change of Direction', coachTip: 'First step speed beats defenders.', blocks: [
        { name: 'Agility', type: 'cardio', exercises: [
          { name: 'Ladder Drills', duration: '10 min' },
          { name: 'Sprint Intervals', sets: 8, reps: '30 yards' },
        ]},
      ]},
      { dayOfWeek: 3, name: 'Legs + Shooting', focusArea: 'Lower Body + Finishing', coachTip: 'Strong legs = powerful shots.', blocks: [
        { name: 'Leg Strength', type: 'strength', exercises: [
          { name: 'Goblet Squats', sets: 3, reps: '12' },
          { name: 'Walking Lunges', sets: 3, reps: '10 each' },
        ]},
        { name: 'Shooting Practice', type: 'skill', exercises: [
          { name: 'Close Range Finishing', reps: '20' },
          { name: 'Long Shots', reps: '15' },
        ]},
      ]},
      { dayOfWeek: 4, name: 'Plyometrics', focusArea: 'Explosiveness', coachTip: 'Jump higher, sprint faster.', blocks: [
        { name: 'Plyometrics', type: 'cardio', exercises: [
          { name: 'Squat Jumps', sets: 3, reps: '8' },
          { name: 'Lateral Bounds', sets: 3, reps: '8 each' },
        ]},
      ]},
      { dayOfWeek: 5, name: 'Endurance + Skills', focusArea: 'Cardio + Technical', coachTip: 'Last the full 90.', blocks: [
        { name: 'Endurance', type: 'cardio', exercises: [
          { name: 'Tempo Run', duration: '25 min' },
        ]},
        { name: 'Technical Work', type: 'skill', exercises: [
          { name: 'Dribbling Drills', duration: '10 min' },
        ]},
      ]},
      { dayOfWeek: 6, name: 'Match Day', focusArea: 'Small-Sided Games', coachTip: 'Apply your training.', blocks: [
        { name: 'Game Work', type: 'skill', exercises: [
          { name: 'Small-Sided Games', duration: '30-45 min' },
        ]},
      ]},
    ],
  },

  // Soccer - Adult
  {
    name: 'Soccer Training',
    sportType: 'soccer',
    ageGroup: 'adult',
    description: 'Complete soccer training with strength and match prep',
    difficulty: 'advanced',
    days: [
      { dayOfWeek: 0, name: 'Active Recovery', focusArea: 'Rest & Mobility', coachTip: 'Recovery is key.', blocks: [
        { name: 'Mobility', type: 'skill', exercises: [
          { name: 'Foam Rolling', duration: '15 min' },
          { name: 'Hip Mobility', duration: '10 min' },
        ]},
      ]},
      { dayOfWeek: 1, name: 'Strength + Technical', focusArea: 'Upper Body + Ball Work', coachTip: 'Build strength for 50/50 battles.', blocks: [
        { name: 'Upper Strength', type: 'strength', exercises: [
          { name: 'Bench Press', sets: 3, reps: '10' },
          { name: 'Rows', sets: 3, reps: '10' },
        ]},
        { name: 'Technical Work', type: 'skill', exercises: [
          { name: 'Passing Patterns', duration: '15 min' },
        ]},
      ]},
      { dayOfWeek: 2, name: 'Speed & Agility', focusArea: 'Explosiveness', coachTip: 'Win those 1v1 battles.', blocks: [
        { name: 'Agility', type: 'cardio', exercises: [
          { name: 'Ladder Drills', duration: '10 min' },
          { name: 'Sprint Intervals', sets: 10, reps: '40 yards' },
        ]},
      ]},
      { dayOfWeek: 3, name: 'Legs + Shooting', focusArea: 'Lower Body Power', coachTip: 'Strong legs = powerful shots.', blocks: [
        { name: 'Leg Strength', type: 'strength', exercises: [
          { name: 'Barbell Squats', sets: 4, reps: '8' },
          { name: 'Romanian Deadlift', sets: 3, reps: '10' },
        ]},
        { name: 'Finishing', type: 'skill', exercises: [
          { name: 'Close Range Finishing', reps: '25' },
        ]},
      ]},
      { dayOfWeek: 4, name: 'Plyometrics + Endurance', focusArea: 'Power + Cardio', coachTip: 'Explosive power and lasting the 90.', blocks: [
        { name: 'Plyometrics', type: 'cardio', exercises: [
          { name: 'Box Jumps', sets: 4, reps: '8' },
        ]},
        { name: 'Endurance', type: 'cardio', exercises: [
          { name: 'Tempo Run', duration: '25 min' },
        ]},
      ]},
      { dayOfWeek: 5, name: 'Light Training', focusArea: 'Recovery + Skills', coachTip: 'Save energy for match day.', blocks: [
        { name: 'Light Skills', type: 'skill', exercises: [
          { name: 'Rondo', duration: '15 min' },
        ]},
      ]},
      { dayOfWeek: 6, name: 'Match Day', focusArea: 'Competition', coachTip: 'Leave it all on the pitch.', blocks: [
        { name: 'Match', type: 'skill', exercises: [
          { name: 'Full Match or Scrimmage', duration: '60-90 min' },
        ]},
      ]},
    ],
  },

  // Running - Teen
  {
    name: 'Running Training',
    sportType: 'running',
    ageGroup: 'teen',
    description: 'Youth running program with base building',
    difficulty: 'beginner',
    days: [
      { dayOfWeek: 0, name: 'Rest Day', focusArea: 'Recovery', coachTip: 'Rest is when you get stronger.', blocks: [
        { name: 'Recovery', type: 'skill', exercises: [
          { name: 'Foam Rolling', duration: '10 min' },
          { name: 'Stretching', duration: '10 min' },
        ]},
      ]},
      { dayOfWeek: 1, name: 'Easy Run + Drills', focusArea: 'Base Building', coachTip: 'Keep it easy.', blocks: [
        { name: 'Easy Run', type: 'cardio', exercises: [
          { name: 'Dynamic Warmup', duration: '5 min' },
          { name: 'Easy Run', duration: '25-30 min' },
          { name: 'Running Drills', duration: '10 min' },
        ]},
      ]},
      { dayOfWeek: 2, name: 'Speed Work', focusArea: 'Getting Faster', coachTip: 'Run fast, rest fully.', blocks: [
        { name: 'Speed Session', type: 'cardio', exercises: [
          { name: 'Easy Jog Warmup', duration: '10 min' },
          { name: 'Strides', reps: '4 x 80m' },
          { name: '200m Repeats', sets: 6 },
        ]},
      ]},
      { dayOfWeek: 3, name: 'Easy Day', focusArea: 'Recovery + Strength', coachTip: 'Easy running, focus on building strength.', blocks: [
        { name: 'Easy Run', type: 'cardio', exercises: [
          { name: 'Easy Run or Walk', duration: '20 min' },
        ]},
        { name: 'Runner Strength', type: 'strength', exercises: [
          { name: 'Bodyweight Squats', sets: 3, reps: '15' },
          { name: 'Lunges', sets: 3, reps: '10 each' },
          { name: 'Plank', sets: 3, duration: '30 sec' },
        ]},
      ]},
      { dayOfWeek: 4, name: 'Tempo Run', focusArea: 'Building Speed Endurance', coachTip: 'Comfortably hard.', blocks: [
        { name: 'Tempo Session', type: 'cardio', exercises: [
          { name: 'Easy Warmup', duration: '10 min' },
          { name: 'Tempo Run', duration: '15 min' },
          { name: 'Easy Cooldown', duration: '10 min' },
        ]},
      ]},
      { dayOfWeek: 5, name: 'Easy Run', focusArea: 'Recovery', coachTip: 'Keep it easy. Save legs for tomorrow.', blocks: [
        { name: 'Easy Run', type: 'cardio', exercises: [
          { name: 'Easy Run', duration: '20-25 min' },
        ]},
      ]},
      { dayOfWeek: 6, name: 'Long Run', focusArea: 'Endurance', coachTip: 'The key workout.', blocks: [
        { name: 'Long Run', type: 'cardio', exercises: [
          { name: 'Long Run', duration: '40-50 min', notes: 'Easy pace' },
        ]},
      ]},
    ],
  },

  // Running - Adult
  {
    name: 'Running Training',
    sportType: 'running',
    ageGroup: 'adult',
    description: 'Complete running program for adults',
    difficulty: 'intermediate',
    days: [
      { dayOfWeek: 0, name: 'Rest Day', focusArea: 'Recovery', coachTip: 'Complete rest or very light activity.', blocks: [
        { name: 'Recovery', type: 'skill', exercises: [
          { name: 'Foam Rolling', duration: '15 min' },
          { name: 'Static Stretching', duration: '15 min' },
        ]},
      ]},
      { dayOfWeek: 1, name: 'Easy Run + Strength', focusArea: 'Base Building + Core', coachTip: 'Easy pace. Conversational.', blocks: [
        { name: 'Easy Run', type: 'cardio', exercises: [
          { name: 'Dynamic Warmup', duration: '5 min' },
          { name: 'Easy Run', duration: '35-45 min' },
        ]},
        { name: 'Runner Strength', type: 'strength', exercises: [
          { name: 'Squats', sets: 3, reps: '12' },
          { name: 'Lunges', sets: 3, reps: '10 each' },
          { name: 'Plank', sets: 3, duration: '45 sec' },
        ]},
      ]},
      { dayOfWeek: 2, name: 'Speed Work', focusArea: 'Intervals', coachTip: 'Push hard on the intervals.', blocks: [
        { name: 'Speed Session', type: 'cardio', exercises: [
          { name: 'Easy Jog Warmup', duration: '10 min' },
          { name: 'Strides', reps: '4 x 100m' },
          { name: '400m Repeats', sets: 6, notes: '90 sec rest between' },
        ]},
      ]},
      { dayOfWeek: 3, name: 'Recovery Run', focusArea: 'Active Recovery', coachTip: 'Very easy. Flush out yesterday\'s effort.', blocks: [
        { name: 'Recovery', type: 'cardio', exercises: [
          { name: 'Very Easy Run', duration: '25-30 min' },
        ]},
      ]},
      { dayOfWeek: 4, name: 'Tempo Run', focusArea: 'Lactate Threshold', coachTip: 'Comfortably hard.', blocks: [
        { name: 'Tempo Session', type: 'cardio', exercises: [
          { name: 'Easy Warmup', duration: '10 min' },
          { name: 'Tempo Run', duration: '20-25 min' },
          { name: 'Easy Cooldown', duration: '10 min' },
        ]},
      ]},
      { dayOfWeek: 5, name: 'Easy Run + Strength', focusArea: 'Base + Strength', coachTip: 'Easy effort.', blocks: [
        { name: 'Easy Run', type: 'cardio', exercises: [
          { name: 'Easy Run', duration: '30 min' },
        ]},
        { name: 'Strength', type: 'strength', exercises: [
          { name: 'Step Ups', sets: 3, reps: '10 each' },
          { name: 'Single Leg Deadlift', sets: 3, reps: '8 each' },
        ]},
      ]},
      { dayOfWeek: 6, name: 'Long Run', focusArea: 'Endurance', coachTip: 'The most important run of the week.', blocks: [
        { name: 'Long Run', type: 'cardio', exercises: [
          { name: 'Long Run', duration: '60-90 min', notes: 'Easy pace, Zone 2' },
        ]},
      ]},
    ],
  },

  // Swimming - Teen
  {
    name: 'Swimming Training',
    sportType: 'swimming',
    ageGroup: 'teen',
    description: 'Youth swimming program with technique focus',
    difficulty: 'beginner',
    days: [
      { dayOfWeek: 0, name: 'Rest Day', focusArea: 'Recovery', coachTip: 'Rest up.', blocks: [
        { name: 'Recovery', type: 'skill', exercises: [
          { name: 'Stretching', duration: '15 min' },
        ]},
      ]},
      { dayOfWeek: 1, name: 'Technique Day', focusArea: 'Form Work', coachTip: 'Perfect practice makes perfect.', blocks: [
        { name: 'Technique Swim', type: 'cardio', exercises: [
          { name: 'Easy Swim Warmup', duration: '200m' },
          { name: 'Drill Work', duration: '400m' },
          { name: 'Technique Swim', duration: '600m' },
        ]},
        { name: 'Dryland', type: 'strength', exercises: [
          { name: 'Push-ups', sets: 3, reps: '12' },
          { name: 'Plank', sets: 3, duration: '30 sec' },
        ]},
      ]},
      { dayOfWeek: 2, name: 'Speed Day', focusArea: 'Fast Swimming', coachTip: 'Go fast!', blocks: [
        { name: 'Speed Session', type: 'cardio', exercises: [
          { name: 'Warmup', duration: '300m' },
          { name: '25m Sprints', sets: 8 },
        ]},
      ]},
      { dayOfWeek: 3, name: 'Endurance', focusArea: 'Building Base', coachTip: 'Steady swimming.', blocks: [
        { name: 'Endurance Swim', type: 'cardio', exercises: [
          { name: 'Warmup', duration: '200m' },
          { name: 'Main Set', duration: '1000-1200m' },
        ]},
      ]},
      { dayOfWeek: 4, name: 'Mixed Strokes', focusArea: 'All Strokes', coachTip: 'Work on all your strokes.', blocks: [
        { name: 'Mixed Swim', type: 'cardio', exercises: [
          { name: 'Warmup', duration: '200m' },
          { name: 'IM Sets', duration: '4 x 50m IM' },
          { name: 'Stroke Work', duration: '400m' },
        ]},
      ]},
      { dayOfWeek: 5, name: 'Easy Day', focusArea: 'Recovery', coachTip: 'Easy swimming. Have fun.', blocks: [
        { name: 'Easy Swim', type: 'cardio', exercises: [
          { name: 'Easy Swim', duration: '800m' },
        ]},
      ]},
      { dayOfWeek: 6, name: 'Long Swim', focusArea: 'Endurance', coachTip: 'Your big swim.', blocks: [
        { name: 'Long Swim', type: 'cardio', exercises: [
          { name: 'Warmup', duration: '200m' },
          { name: 'Main Swim', duration: '1500-2000m' },
        ]},
      ]},
    ],
  },

  // Swimming - Adult
  {
    name: 'Swimming Training',
    sportType: 'swimming',
    ageGroup: 'adult',
    description: 'Complete swimming program with dryland training',
    difficulty: 'intermediate',
    days: [
      { dayOfWeek: 0, name: 'Rest Day', focusArea: 'Recovery', coachTip: 'Let your body recover.', blocks: [
        { name: 'Recovery', type: 'skill', exercises: [
          { name: 'Full Body Stretch', duration: '20 min' },
        ]},
      ]},
      { dayOfWeek: 1, name: 'Technique + Dryland', focusArea: 'Form Work + Strength', coachTip: 'Focus on technique.', blocks: [
        { name: 'Technique Swim', type: 'cardio', exercises: [
          { name: 'Easy Swim Warmup', duration: '400m' },
          { name: 'Drill Work', duration: '600m' },
          { name: 'Technique Focus Swim', duration: '800m' },
        ]},
        { name: 'Dryland Training', type: 'strength', exercises: [
          { name: 'Pull-ups', sets: 3, reps: '8' },
          { name: 'Push-ups', sets: 3, reps: '15' },
          { name: 'Plank', sets: 3, duration: '45 sec' },
        ]},
      ]},
      { dayOfWeek: 2, name: 'Speed Day', focusArea: 'Fast Swimming', coachTip: 'Sprint hard, rest fully.', blocks: [
        { name: 'Speed Session', type: 'cardio', exercises: [
          { name: 'Warmup', duration: '400m' },
          { name: '50m Sprints', sets: 8 },
        ]},
      ]},
      { dayOfWeek: 3, name: 'Endurance', focusArea: 'Distance Swimming', coachTip: 'Build your aerobic base.', blocks: [
        { name: 'Endurance Swim', type: 'cardio', exercises: [
          { name: 'Warmup', duration: '300m' },
          { name: 'Main Set', duration: '1500-2000m' },
        ]},
      ]},
      { dayOfWeek: 4, name: 'Mixed + Dryland', focusArea: 'Variety + Strength', coachTip: 'Work all strokes.', blocks: [
        { name: 'Mixed Swim', type: 'cardio', exercises: [
          { name: 'Warmup', duration: '400m' },
          { name: 'IM Sets', duration: '4 x 100m IM' },
        ]},
        { name: 'Dryland', type: 'strength', exercises: [
          { name: 'Lat Pulldowns', sets: 3, reps: '12' },
          { name: 'Core Circuit', duration: '10 min' },
        ]},
      ]},
      { dayOfWeek: 5, name: 'Easy Day', focusArea: 'Recovery Swim', coachTip: 'Easy effort.', blocks: [
        { name: 'Easy Swim', type: 'cardio', exercises: [
          { name: 'Easy Swim', duration: '1000-1500m' },
        ]},
      ]},
      { dayOfWeek: 6, name: 'Long Swim', focusArea: 'Endurance', coachTip: 'Your big swim of the week.', blocks: [
        { name: 'Long Swim', type: 'cardio', exercises: [
          { name: 'Warmup', duration: '400m' },
          { name: 'Main Swim', duration: '2500-3000m' },
        ]},
      ]},
    ],
  },
]

// Helper function to get program key
export const getProgramKey = (sport: SportType, age: AgeGroup): string => {
  return `${sport}-${age}`
}

// Get the appropriate program based on settings
export const getWorkoutProgram = (sport: SportType, age: AgeGroup): ProgramData | undefined => {
  return WORKOUT_PROGRAMS.find(p => p.sportType === sport && p.ageGroup === age)
}
