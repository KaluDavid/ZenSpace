# ZenSpace 🧘

> **A mindfulness and meditation mobile app built with React Native + Expo**  
> IBM React Native Capstone Project — UVW Code Labs

---

## Project Overview

ZenSpace is a cross-platform mobile application that helps users build a daily mindfulness practice through guided meditation sessions, daily inspirational quotes from an external API, a favorites system backed by local storage, and configurable push notification reminders.

**Tech Stack:** React Native · Expo · TypeScript · Expo Router · AsyncStorage · expo-notifications

---

## User Stories

> Format: _As a [user type], I want [goal], so that [benefit]._  
> Each story includes acceptance criteria.

---

### Story 1 — Account Registration

**As a new user,**  
I want to register with a username, email address, and password,  
so that I can create a personal account and access the app's features.

**Acceptance Criteria:**

- [ ] Registration screen displays three fields: username, email, and password
- [ ] All fields are validated before submission (non-empty, valid email format, password ≥ 6 chars)
- [ ] If a field is invalid, an inline error message appears beneath that field
- [ ] If the email is already registered, an error banner shows "An account with this email already exists"
- [ ] On successful registration, the user is automatically logged in and redirected to the Home screen
- [ ] A "Log in" link is visible for users who already have an account

---

### Story 2 — User Login

**As a returning user,**  
I want to log in with my email and password,  
so that I can securely access my saved preferences and meditation history.

**Acceptance Criteria:**

- [ ] Login screen displays two fields: email and password
- [ ] Password field masks input by default, with a toggle to reveal
- [ ] Submitting incorrect credentials shows the error: "Incorrect email or password. Please try again."
- [ ] On successful login, user is redirected to the Home screen
- [ ] A "Sign up" link navigates to the registration screen
- [ ] User session persists across app restarts (via AsyncStorage)

---

### Story 3 — Home Screen & Daily Quote

**As a logged-in user,**  
I want to see a personalised home screen with a daily inspirational quote,  
so that I begin each session feeling motivated and calm.

**Acceptance Criteria:**

- [ ] Home screen displays the app logo and name in the header
- [ ] A personalised greeting uses the logged-in user's username
- [ ] A "Daily Wisdom" card fetches and displays a quote from the ZenQuotes external API
- [ ] The card shows a loading indicator while the quote is being fetched
- [ ] If the API fails, a fallback quote is displayed
- [ ] A pull-to-refresh gesture re-fetches the quote
- [ ] Quick stats show the number of saved sessions and total available sessions

---

### Story 4 — Browse & Filter Sessions

**As a user,**  
I want to browse meditation sessions filtered by category,  
so that I can quickly find the type of session that suits my current need.

**Acceptance Criteria:**

- [ ] Home screen displays all available meditation sessions in a card grid
- [ ] A horizontal category filter bar shows categories: All, Morning, Sleep, Anxiety, Focus, Breathing, Stress, Mindful
- [ ] Selecting a category filters the session grid in real time
- [ ] Each card displays the session title, category badge, duration, and emoji icon
- [ ] Each card has a heart icon for adding to favorites
- [ ] Tapping a card navigates to the Session Detail screen

---

### Story 5 — Session Detail Screen

**As a user,**  
I want to view full details about a meditation session,  
so that I understand what the session involves before starting it.

**Acceptance Criteria:**

- [ ] Detail screen shows the session title, category, duration, and instructor name
- [ ] A description paragraph explains the session's purpose and technique
- [ ] A "What to expect" section lists preparation steps
- [ ] Session tags are displayed as chips
- [ ] A "Begin Session" button starts the session (with a confirmation alert)
- [ ] A back navigation button returns to the Home screen
- [ ] An "Add to Favorites" / "Remove from Favorites" button is present and updates in real time

---

### Story 6 — Favorites & Local Persistence

**As a user,**  
I want to save meditation sessions to a favorites list that persists between sessions,  
so that I can quickly access the sessions I enjoy most.

**Acceptance Criteria:**

- [ ] Tapping the heart icon on any card toggles the favorite status
- [ ] Favorites are stored in AsyncStorage and survive app restarts
- [ ] The Favorites tab displays all saved sessions in a list view
- [ ] A counter shows the number of items stored in local storage
- [ ] Removing a favorite on the Favorites tab updates the list immediately
- [ ] An empty state message is shown when no favorites have been saved

---

### Story 7 — Settings Menu

**As a user,**  
I want to access a settings menu from the home screen,  
so that I can navigate to app configuration options and manage my account.

**Acceptance Criteria:**

- [ ] A menu icon (hamburger) in the top-right of the Home screen header opens the Settings screen
- [ ] The Settings menu displays the user's name and email in a profile card
- [ ] Menu items include: Appearance, My Favorites, Daily Reminders, and Sign Out
- [ ] Each menu item navigates to its corresponding screen
- [ ] "Sign Out" triggers a confirmation dialog before logging the user out
- [ ] Logging out clears the session from AsyncStorage and redirects to the Login screen

---

### Story 8 — Theme / Appearance Settings

**As a user,**  
I want to switch between light and dark mode,  
so that I can use the app comfortably in any lighting condition.

**Acceptance Criteria:**

- [ ] The Appearance settings screen shows a live preview of the current theme
- [ ] A toggle switch toggles between light and dark mode immediately across the whole app
- [ ] Light and dark options are selectable with a checkmark indicator
- [ ] The selected theme is stored in AsyncStorage and restored on next launch
- [ ] All screens and components correctly respond to the theme change via ThemeContext

---

### Story 9 — Notification Reminders

**As a user,**  
I want to configure daily reminder notifications,  
so that I receive a prompt to meditate at my chosen time each day.

**Acceptance Criteria:**

- [ ] The Notifications screen shows the current permission status
- [ ] A master toggle enables or disables all notifications
- [ ] A form allows the user to name a reminder and set a time (hour and minute)
- [ ] Submitting the form schedules a repeating daily local notification via expo-notifications
- [ ] Scheduled reminders are listed and can be individually deleted
- [ ] Deleting a reminder also cancels its scheduled notification
- [ ] A "Send Test Notification" button triggers an immediate notification for verification
- [ ] All reminder data is persisted in AsyncStorage

---

## Screens Summary

| Screen          | Route                     | Description                                |
| --------------- | ------------------------- | ------------------------------------------ |
| Login           | `/(auth)/login`           | Email + password login                     |
| Sign Up         | `/(auth)/signup`          | Username + email + password registration   |
| Home            | `/(tabs)/index`           | Session grid, daily quote, category filter |
| Favorites       | `/(tabs)/favorites`       | AsyncStorage-persisted favorites list      |
| Session Detail  | `/meditation/[id]`        | Full session information                   |
| Settings Menu   | `/settings`               | Navigation hub + logout                    |
| Appearance      | `/settings/theme`         | Light/dark theme toggle                    |
| Daily Reminders | `/settings/notifications` | Notification configuration                 |

---

## Folder Structure

```
ZenSpace/
├── app/
│   ├── _layout.tsx              # Root layout — providers + auth redirect
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx            # Task 8 — login implementation
│   │   └── signup.tsx           # Task 5 — signup implementation
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Bottom tab navigator
│   │   ├── index.tsx            # Task 11 — home screen
│   │   └── favorites.tsx        # Task 16 — local storage / favorites
│   ├── meditation/
│   │   └── [id].tsx             # Task 13 — detail screen
│   └── settings/
│       ├── _layout.tsx
│       ├── index.tsx            # Task 21 — settings menu
│       ├── theme.tsx            # Task 24 — settings screen
│       └── notifications.tsx    # Task 26 — notifications
├── components/
│   ├── home/
│   │   ├── MeditationCard.tsx
│   │   └── DailyQuoteCard.tsx   # Task 19/20 — API display
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── ScreenHeaderBtn.tsx  # Task 22 — menu icon
├── constants/
│   ├── Colors.ts                # Design system colors
│   ├── Theme.ts                 # Typography + spacing
│   └── MeditationData.ts        # Static session data
├── context/
│   ├── AuthContext.tsx           # Auth state + AsyncStorage session
│   └── ThemeContext.tsx          # Light/dark theme via Context API
├── hooks/
│   └── index.ts                 # useQuote, useFavorites
├── types/
│   └── index.ts                 # TypeScript interfaces
└── utils/
    ├── api.ts                   # Task 19 — external API integration
    ├── storage.ts               # Task 16 — AsyncStorage utilities
    └── notifications.ts         # Task 26 — expo-notifications
```

---

## Installation & Running

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/zenspace.git
cd zenspace

# Install dependencies
npm install

# Start the Expo development server
npx expo start

# Run on a device
# Press 'a' for Android emulator
# Press 'i' for iOS simulator
# Scan QR code with Expo Go app on a physical device
```

---

## Submission Checklist (28 Tasks)

| #   | Task                              | Points | File / Screenshot                          |
| --- | --------------------------------- | ------ | ------------------------------------------ |
| 1   | GitHub repo (public)              | 2      | Repository URL                             |
| 2   | User stories markdown             | 9      | `README.md`                                |
| 3   | Figma screens 1–5                 | 5      | `figma-evidence1.png`                      |
| 4   | Figma screens 6–9                 | 4      | `figma-evidence2.png`                      |
| 5   | Signup implementation             | 4      | `app/(auth)/signup.tsx`                    |
| 6   | Signup screen screenshot          | 6      | `signup_screen_evidence.png`               |
| 7   | Signup error screenshot           | 2      | `signup_error.png`                         |
| 8   | Login implementation              | 4      | `app/(auth)/login.tsx`                     |
| 9   | Login screen screenshot           | 5      | `login_screen_evidence.png`                |
| 10  | Login error screenshot            | 2      | `login_error.png`                          |
| 11  | Home screen implementation        | 4      | `app/(tabs)/index.tsx`                     |
| 12  | Home screen screenshot            | 4      | `home-screen-evidence.png`                 |
| 13  | Detail screen implementation      | 4      | `app/meditation/[id].tsx`                  |
| 14  | Detail navigation screenshot      | 2      | `evidence-detail-navigation.png`           |
| 15  | Detail screen screenshot          | 2      | `evidence-detail-screen.png`               |
| 16  | Local storage implementation      | 4      | `utils/storage.ts`                         |
| 17  | Persistence screenshot            | 2      | `evidence-persistence.png`                 |
| 18  | Integrated persistence screenshot | 2      | `evidence-integrateScreen-persistence.png` |
| 19  | API integration implementation    | 4      | `utils/api.ts`                             |
| 20  | API UX screenshot                 | 2      | `evidence-api-ux.png`                      |
| 21  | Settings menu implementation      | 4      | `app/settings/index.tsx`                   |
| 22  | Menu icon screenshot              | 2      | `evidence-menu-icon.png`                   |
| 23  | Menu items screenshot             | 5      | `evidence-menu-items.png`                  |
| 24  | Settings screen implementation    | 4      | `app/settings/theme.tsx`                   |
| 25  | Settings screen screenshot        | 2      | `evidence-settings-screen.png`             |
| 26  | Notifications implementation      | 4      | `app/settings/notifications.tsx`           |
| 27  | Notification configure screenshot | 2      | `evidence-notification-configure.png`      |
| 28  | Notification alert screenshot     | 4      | `evidence-notification-alert.png`          |

---

## License

MIT — UVW Code Labs Capstone Project
