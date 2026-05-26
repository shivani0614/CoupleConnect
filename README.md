# 💍 CoupleConnect — React Native App

A full-featured mobile app for couples and married couples to stay connected, share tasks, plan dates, chat, and track their love story — including **real-time distance between partners**.

---

## 📱 Screens

| Tab | Features |
|-----|----------|
| 🏠 **Home** | Mood check-in, anniversary ring, days married counter, nightly question, send hug/kiss, countdown to next visit |
| ✅ **Tasks** | Shared to-do list (check off, delete, assign), progress bar, built-in activity launcher |
| 📅 **Dates** | Special date tracker, anniversary gift guide, date night ideas, big countdown |
| 💬 **Chat** | Real-time-style messaging, quick emoji strip, auto-reply simulation |
| ❤️ **Us** | Love note wall, distance card (km/mi/flight/timezone), streak bar, milestones, love story timeline |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac only) or Android Emulator, or the **Expo Go** app on your phone

### Install & Run

```bash
# 1. Clone / unzip the project
cd CoupleConnect

# 2. Install dependencies
npm install

# 3. Start the dev server
npx expo start

# 4. Scan the QR code with Expo Go (iOS/Android)
#    or press 'i' for iOS simulator, 'a' for Android emulator
```

---

## 🗂 Project Structure

```
CoupleConnect/
├── App.js                          # Root entry point
├── app.json                        # Expo config
├── babel.config.js
├── package.json
└── src/
    ├── context/
    │   └── CoupleContext.js        # Global state (tasks, messages, notes, mood)
    ├── data/
    │   └── index.js                # Seed data, questions, activities
    ├── navigation/
    │   └── RootNavigator.js        # Bottom tab navigator
    ├── screens/
    │   ├── HomeScreen.js           # Home tab
    │   ├── TasksScreen.js          # Tasks tab
    │   ├── DatesScreen.js          # Dates tab
    │   ├── ChatScreen.js           # Chat tab
    │   └── UsScreen.js             # Us tab
    ├── components/
    │   └── UI.js                   # Reusable components (Card, Button, Header, etc.)
    └── theme/
        └── index.js                # Colors, spacing, shadows, radius
```

---

## 🎨 Customising

### Change couple names & cities
Edit `src/data/index.js` → `COUPLE` object:

```js
export const COUPLE = {
  name1:        'Alex',         // ← Partner 1
  name2:        'Jordan',       // ← Partner 2
  city1:        'New York, NY', // ← Partner 1 city
  city2:        'Miami, FL',    // ← Partner 2 city
  marriedSince: new Date('2018-06-03'),
  distanceKm:   1247,
  distanceMi:   775,
  ...
};
```

### Change colours
Edit `src/theme/index.js` → `COLORS`:

```js
export const COLORS = {
  rose:    '#C0394B',  // Primary accent
  gold:    '#C8975A',  // Secondary accent
  bg:      '#FAF7F5',  // App background
  ...
};
```

### Add more questions
Edit `src/data/index.js` → `QUESTIONS` array.

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `expo` | Managed workflow |
| `@react-navigation/bottom-tabs` | Tab navigation |
| `expo-linear-gradient` | Gradient headers & buttons |
| `expo-haptics` | Tactile feedback |
| `expo-location` | GPS for live distance (optional) |
| `@react-native-async-storage/async-storage` | Persist data locally |
| `react-native-safe-area-context` | Safe area handling |
| `react-native-reanimated` | Smooth animations |

---

## 📲 Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to Expo
eas login

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

---

## 🔮 Roadmap / Next Features
- [ ] Firebase/Supabase backend for real shared data
- [ ] Push notifications (hug/kiss alerts)
- [ ] Live GPS distance calculation
- [ ] Shared photo album (camera roll)
- [ ] Couple goals & habit tracker
- [ ] Spotify / music sharing integration

---

Made with ❤️ for couples everywhere.
