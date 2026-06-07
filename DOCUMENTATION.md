# ZenSpace — Complete Project Documentation

**Course:** IBM React Native Capstone | UVW Code Labs  
**App Name:** ZenSpace  
**Framework:** React Native + Expo + TypeScript  
**Version:** 1.0.0

---

## Executive Summary

ZenSpace is a cross-platform mindfulness and meditation mobile application that delivers a complete, production-quality. The app is built using React Native with Expo, TypeScript throughout, file-based routing via Expo Router, AsyncStorage for local persistence, a live external REST API integration, and expo-notifications for local push notifications.

---

## Phase 1 — Product Vision

### Problem Statement
Modern users face increasing levels of stress and anxiety, yet lack easily accessible, guided tools for daily mindfulness practice. Existing solutions are either too complex, subscription-heavy, or poorly designed.

### Solution Statement
ZenSpace provides a clean, calming mobile experience that delivers daily meditation sessions, motivational content fetched from a live API, persistent favorites, and configurable daily reminders — all without requiring a backend server.

### Target Audience
- Adults aged 18–45 experiencing daily work or life stress
- Beginners to meditation seeking structured guidance
- Existing practitioners wanting a lightweight session library

### User Personas

**Persona 1 — "Stressed Sarah"**  
Age: 28 | Occupation: Software developer  
Goal: 10 minutes of calm before work each morning  
Pain point: Forgets to meditate without a prompt

**Persona 2 — "Curious Carlos"**  
Age: 35 | Occupation: Teacher  
Goal: Try different meditation styles to find what works  
Pain point: Overwhelmed by large apps with paywalls

---

## Phase 2 — Design System

### Color Palette

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `primary` | `#6c63ff` | `#a29bfe` | Buttons, icons, accents |
| `background` | `#f8f7ff` | `#1a1a2e` | Page background |
| `surface` | `#ffffff` | `#16213e` | Cards, inputs |
| `text` | `#1a1a2e` | `#f8f7ff` | Body copy |
| `textSecondary` | `#4a4770` | `#d6d0ff` | Labels, subtitles |
| `error` | `#d63031` | `#e17055` | Validation errors |
| `success` | `#00b894` | `#00cec9` | Confirmation states |
| `accent` | `#f6c90e` | `#fddb3a` | Highlights |

**Rationale:** Deep indigo conveys calm and trust; soft lavender reads as approachable. Gold accent adds warmth without aggression. The palette passes WCAG AA contrast ratios in both modes.

### Typography Scale

| Size Token | px | Usage |
|---|---|---|
| `xs` | 11 | Labels, badges, captions |
| `sm` | 13 | Secondary body, error messages |
| `base` | 15 | Primary body text |
| `md` | 16 | Input text, button labels |
| `lg` | 18 | Section titles |
| `xl` | 20 | Card headings |
| `2xl` | 24 | Screen headings |
| `3xl` | 28 | Page titles |
| `4xl` | 32 | App name / hero text |

### Spacing System (4pt grid)

`4 · 8 · 12 · 16 · 20 · 24 · 28 · 32 · 40 · 48 · 64`

### Border Radius

| Token | px | Usage |
|---|---|---|
| `sm` | 6 | Small chips |
| `md` | 10 | Inputs, small cards |
| `lg` | 16 | Cards, sections |
| `xl` | 24 | Large cards, modals |
| `2xl` | 32 | Hero sections |
| `full` | 9999 | Pills, avatars, badges |

### Component Library

| Component | File | Description |
|---|---|---|
| `Button` | `components/ui/Button.tsx` | 5 variants (primary, secondary, outline, ghost, danger), 3 sizes, loading state |
| `Input` | `components/ui/Input.tsx` | Label, error, left/right icon, password toggle |
| `ScreenHeaderBtn` | `components/ui/ScreenHeaderBtn.tsx` | Icon button for app header navigation |
| `MeditationCard` | `components/home/MeditationCard.tsx` | Grid card + horizontal list variant |
| `DailyQuoteCard` | `components/home/DailyQuoteCard.tsx` | API-driven quote display with loading state |

---

## Phase 3 — Technical Architecture

### Technology Decisions

| Technology | Version | Reason |
|---|---|---|
| React Native | 0.74 | Cross-platform iOS + Android from one codebase |
| Expo | ~51 | Managed workflow eliminates native build complexity |
| TypeScript | ^5.1 | Type safety, IDE autocomplete, fewer runtime errors |
| Expo Router | ~3.5 | File-based routing — modern pattern, no boilerplate nav config |
| AsyncStorage | 1.23.1 | Simple, battle-tested local key-value persistence |
| expo-notifications | ~0.28 | Local notification scheduling without a push server |
| @expo/vector-icons | ^14 | 1000+ icons via Ionicons, zero config |

**Why Expo Router over React Navigation directly?**  
Expo Router brings Next.js-style file-based routing to React Native. Routes are defined by the file system (`app/(auth)/login.tsx` → `/auth/login`). This eliminates manual route registration, makes deep linking automatic, and aligns with the capstone requirement for "modern Expo Router patterns."

**Why AsyncStorage over SQLite?**  
The capstone data model is simple key-value: user session, favorites array, reminders array, settings object. AsyncStorage handles all of these with zero schema definition. SQLite would add unnecessary complexity for this data shape.

**Why Context API over Redux?**  
The app has two global state concerns: auth state and theme state. Both are low-frequency updates. Context API + `useState` is the idiomatic React solution for this scale. Redux would be over-engineering.

### State Management Strategy

```
Global State (Context API)
├── AuthContext     — user session, login/signup/logout functions
└── ThemeContext    — light/dark mode, color tokens, toggle function

Local State (useState per screen)
├── Home            — selectedCategory, favorites set, quote, refreshing
├── Detail          — favorited boolean, sessionStarted
├── Favorites       — favorites array (loaded via useFocusEffect)
├── Notifications   — reminders array, form fields, permissionsGranted
└── Auth screens    — form field values, validation errors, loading
```

### API Architecture

**External API:** ZenQuotes (`https://zenquotes.io/api/random`)
- Method: `GET`
- Response: `[{ q: "quote text", a: "author", c: "category" }]`
- Caching: Result is cached to AsyncStorage with a date key; same-day re-fetches return the cache
- Timeout: 8-second AbortController timeout
- Fallback: 4 hard-coded quotes used if network fails

### File-Based Routing Map

```
app/
├── _layout.tsx              →  Root (providers + auth guard)
├── (auth)/
│   ├── _layout.tsx          →  Auth stack group
│   ├── login.tsx            →  /login
│   └── signup.tsx           →  /signup
├── (tabs)/
│   ├── _layout.tsx          →  Bottom tab navigator
│   ├── index.tsx            →  / (Home)
│   └── favorites.tsx        →  /favorites
├── meditation/
│   └── [id].tsx             →  /meditation/:id (dynamic)
└── settings/
    ├── _layout.tsx          →  Settings stack group
    ├── index.tsx            →  /settings
    ├── theme.tsx            →  /settings/theme
    └── notifications.tsx    →  /settings/notifications
```

### Authentication Flow

```
App Launch
    │
    ▼
AsyncStorage.getItem('@zenspace_user')
    │
    ├── Found → RootNavigator → router.replace('/(tabs)')
    │
    └── Not Found → router.replace('/(auth)/login')
                         │
              ┌──────────┴──────────┐
              │                     │
           Login                 Sign Up
              │                     │
         Validate              Validate
              │                     │
    Check all_users list      Check email unique
              │                     │
         Match found?          Create user
              │                     │
        Save session          Save session
              │                     │
              └──────────┬──────────┘
                         │
                 router.replace('/(tabs)')
```

### Data Persistence Map

| Data | Storage Key | Type | When Written |
|---|---|---|---|
| Current user session | `@zenspace_user` | `User` JSON | Login / Signup |
| All registered users | `@zenspace_all_users` | `User[]` JSON | Signup |
| Theme preference | `@zenspace_theme` | `"light"` or `"dark"` | Theme toggle |
| Favorites list | `@zenspace_favorites` | `MeditationSession[]` JSON | Heart tap |
| Daily reminders | `@zenspace_reminders` | `Reminder[]` JSON | Add/delete reminder |
| App settings | `@zenspace_settings` | `AppSettings` JSON | Settings change |
| Cached daily quote | `@zenspace_daily_quote` | `DailyQuote` JSON | API fetch |
| Quote cache date | `@zenspace_quote_date` | Date string | API fetch |

---

## Phase 4 — Screen-by-Screen Design Rationale

### Login Screen
**Purpose:** Re-authenticate returning users  
**Layout:** Centered scroll view, brand section top, form card below  
**Rationale:** Brand placed above fold to reinforce identity; single card groups form fields visually; error banner appears above fields for prominence without inline noise

### Sign Up Screen
**Purpose:** Register new users  
**Layout:** Identical structure to login for consistency; adds username field  
**Rationale:** Three required fields match the grading rubric exactly; progressive validation on blur reduces friction

### Home Screen
**Purpose:** App hub — daily quote, session discovery, navigation  
**Layout:** Fixed header (logo + menu icon), scrollable content area  
**Rationale:** Logo in fixed header satisfies Task 12; pull-to-refresh is standard UX for content that can change; category chips use horizontal scroll to avoid vertical space waste; 2-column card grid maximises content density

### Detail Screen
**Purpose:** Show full session information before starting  
**Layout:** Custom top bar (back + title + favorite), hero band, scrollable detail sections  
**Rationale:** Back navigation icon satisfies Task 14 requirement; info chips provide scannable metadata; "What to expect" steps set user expectations and reduce drop-off

### Favorites Screen
**Purpose:** Persistent saved sessions, demonstrates AsyncStorage  
**Layout:** Header, persistence info card, list of horizontal cards  
**Rationale:** `useFocusEffect` ensures data is always fresh when tab is focused; the persistence info card explicitly shows the storage count (supports Task 17/18 screenshot evidence)

### Settings Menu
**Purpose:** Navigation hub + account management  
**Layout:** Profile card (brand color), section labels, grouped menu rows, logout button  
**Rationale:** Profile card immediately orients the user; icon-per-item aids scannability; destructive logout is separated visually with red styling + confirmation dialog

### Theme Settings
**Purpose:** Light/dark mode toggle  
**Layout:** Preview card showing current state, toggle section with both explicit options  
**Rationale:** Live preview card gives immediate visual feedback before the user commits; checkmark on active selection provides clear state indication

### Notifications Screen
**Purpose:** Configure daily reminders + test notification  
**Layout:** Permission status, master toggle, add-reminder form, reminder list, test button  
**Rationale:** Permission status card at top catches denied state immediately; split hour/minute inputs are more reliable than a string time picker on all platforms; test button at bottom is a deliberate call-to-action for Task 28
