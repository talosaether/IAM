# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IAM is a self-improvement mobile app built with Vue.js, Vite, SQLite, and Capacitor. Features include habit tracking with streaks, checklists, meal planning with nutrition info, sport-specific workout programs, and theme customization.

## Tech Stack

- Vue 3 (Composition API) + TypeScript
- Vite (build tool)
- Pinia (state management)
- Vue Router (tab navigation)
- Tailwind CSS (styling)
- SQLite via @capacitor-community/sqlite (database)
- Capacitor (iOS/Android deployment)
- Lucide Vue (icons)

## Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Add mobile platforms
npx cap add ios
npx cap add android

# Sync web build to native
npx cap sync

# Open in Xcode/Android Studio
npx cap open ios
npx cap open android
```

## Architecture

```
src/
├── main.ts                 # App entry point
├── App.vue                 # Root component with theme + tab layout
├── router/index.ts         # Vue Router with 6 tab routes
├── stores/                 # Pinia stores
│   └── settings.ts         # Theme, user profile, workout preferences
├── database/
│   ├── index.ts            # SQLite initialization
│   ├── migrations/         # Database schema
│   └── seeds/              # Pre-loaded meals, foods, workouts
├── components/
│   └── common/TabBar.vue   # Bottom navigation
├── views/                  # 6 main screens
│   ├── HomeView.vue        # Dashboard with greeting, quotes, stats
│   ├── HabitsView.vue      # Habit tracking with streaks
│   ├── ChecklistsView.vue  # To-do lists
│   ├── MealsView.vue       # Meal ideas + nutrition
│   ├── ExerciseView.vue    # Workout programs
│   └── SettingsView.vue    # Profile, theme, preferences
├── composables/            # Reusable composition functions
├── types/index.ts          # TypeScript interfaces
└── assets/styles/main.css  # Tailwind + CSS variables
```

## Theme System

Uses Tailwind CSS `darkMode: 'class'` with CSS custom properties. Theme colors:
- Primary: `#10b981` (emerald green)
- Dark background: `#0f172a`
- Dark surface: `#1e293b`

Theme is controlled via `useSettingsStore` and applied as `.dark` class on root element.

## Database

SQLite is used on native platforms (iOS/Android). On web, falls back to localStorage. Schema includes tables for habits, habit_completions, checklists, foods, meals, workout_programs, etc.

## Seed Data

Pre-loaded data from the original app:
- 33 foods with nutrition info
- 24 meal ideas across breakfast/lunch/dinner/snack
- 14 workout programs (7 sports × 2 age groups)
