# AidAtlas Mobile App (Expo)

React Native + Expo application implementing the AidAtlas humanitarian donation experience.

## Key Libraries
- Expo Router for file-based navigation
- React Native Paper for UI components and theming
- TanStack Query for data fetching and caching
- Zustand for lightweight client-side state

## Available Scripts

```bash
npm run start     # launch Expo dev server
npm run android   # start Android emulator build
npm run ios       # start iOS simulator build
npm run web       # launch web preview
npm run lint      # run ESLint over TypeScript files
```

## Project Structure
```
app/
  _layout.tsx           # Root providers & theme
  index.tsx             # Recommendation feed screen
  onboarding.tsx        # Preference quiz prototype
  components/           # Reusable UI pieces
  hooks/                # Data fetching & logic
  stores/               # Zustand stores (client state)
  config/               # Theme + Query client
assets/                 # App icons and splash artwork placeholders
```

## Next Steps
- Integrate authentication flow (Firebase Auth UI or custom screens)
- Connect feed to real API endpoints once available
- Implement swipeable card interactions (e.g., `react-native-deck-swiper`)
- Add donation checkout screens and receipt modal

> Install dependencies with `npm install` from the repo root, then run `npm run start --workspace apps/mobile` to boot Expo.
