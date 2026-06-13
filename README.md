<div align="center">

# 📱 RUET CSE Archive — Mobile App

**The official community platform for the CSE Department of RUET**

A React Native mobile application where students and alumni connect, share academic resources, and stay informed — built exclusively for the CSE family of Rajshahi University of Engineering & Technology.

![Status](https://img.shields.io/badge/Status-Active%20Development-yellow)
![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-blue)
![Framework](https://img.shields.io/badge/Framework-Expo%20React%20Native-black)

</div>

---

## What is RUET CSE Archive?

**RUET CSE Archive** is a dedicated social and academic platform built for the CSE department of RUET. It solves a real problem: valuable study materials get lost in WhatsApp threads, seniors and juniors rarely connect, and department announcements are scattered across multiple channels.

This app brings everything — and everyone — into one place:

- 🔍 **Find classmates & alumni** — Search and connect with students across every batch and graduation year, and grow your professional network within the RUET CSE family
- 📢 **Post announcements & updates** — Share academic notices, personal milestones, opportunities, and department news with the whole community
- 📚 **Share notes & study resources** — Upload and access lecture notes, past exam papers, assignments, and references contributed by seniors and peers

> 🚧 **This project is under active development.** Core features are being built and refined. Contributions are welcome.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Tech Stack](#tech-stack)
- [Prerequisites & Requirements](#prerequisites--requirements)
- [Installation](#installation)
- [Running on a Physical Android Device](#running-on-a-physical-android-device)
- [Usage Examples](#usage-examples)
- [Project Structure](#project-structure)
- [Styling with NativeWind](#styling-with-nativewind)
- [Authentication](#authentication)
- [Backend & Database](#backend--database)
- [Available Scripts](#available-scripts)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## Quick Start

If you have Node.js, ADB, and a connected Android device ready to go:

```bash
git clone https://github.com/your-org/ruet-cse-archive.git
cd ruet-cse-archive/native
npm install
npx expo start
# Press 'a' to open on your connected Android device
```

---

## Tech Stack

| Layer          | Technology                                  | Purpose                                      |
| -------------- | ------------------------------------------- | -------------------------------------------- |
| Framework      | [Expo](https://expo.dev) (managed workflow) | Cross-platform React Native app scaffold     |
| Language       | TypeScript                                  | Type-safe development                        |
| Styling        | [NativeWind v4](https://www.nativewind.dev) | Tailwind CSS utility classes in React Native |
| Auth           | Email + Password (via Next.js API)          | Manual user registration and login           |
| Database       | [Firebase](https://firebase.google.com)     | Realtime data, file storage                  |
| API            | Next.js API Routes                          | Backend logic and Firebase communication     |
| Device Testing | ADB, Expo Go                                | Physical Android device development          |

---

## Prerequisites & Requirements

Ensure the following are installed and configured before proceeding:

| Requirement    | Version      | Notes                                            |
| -------------- | ------------ | ------------------------------------------------ |
| Node.js        | ≥ 18.x       | [nodejs.org](https://nodejs.org)                 |
| npm            | ≥ 9.x        | Comes with Node.js                               |
| Expo CLI       | Latest       | Installed via `npx` — no global install needed   |
| Android Studio | Latest       | Required for ADB and Android SDK                 |
| ADB            | Any          | Must be accessible in your system `PATH`         |
| Java JDK       | ≥ 17         | Required for `expo run:android` native builds    |
| Android Device | Android 8.0+ | With Developer Options and USB Debugging enabled |

Verify your environment:

```bash
node -v          # should be v18+
adb version      # should print ADB version info
java -version    # should be 17+
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-org/ruet-cse-archive.git
cd ruet-cse-archive/native
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the required values:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api   # URL of the Next.js backend
EXPO_PUBLIC_FIREBASE_API_KEY=your_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> **Note:** Variables prefixed with `EXPO_PUBLIC_` are bundled into the client. Never put secret keys here — keep those in the Next.js backend's `.env.local`.

### 4. Start the development server

```bash
npx expo start
```

---

## Running on a Physical Android Device

### Option A — Expo Go (Recommended for daily development)

1. Install **[Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)** on your Android device from the Play Store.
2. Enable **USB Debugging** on your device:
   - Go to **Settings → About Phone** → tap **Build Number** 7 times to unlock Developer Options
   - Go to **Settings → Developer Options** → enable **USB Debugging**
3. Connect your device via USB and verify ADB detects it:
   ```bash
   adb devices
   # Expected output:
   # List of devices attached
   # XXXXXXXX    device
   ```
4. Start the Expo server and push to device:
   ```bash
   npx expo start
   # Then press 'a' in the terminal
   ```

### Option B — Full Native Build

Use this for native module testing or when preparing a release:

```bash
# Ensure ANDROID_HOME is set
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Build and install
npx expo run:android
```

### ADB Quick Reference

```bash
adb devices                    # List connected devices
adb kill-server                # Restart ADB server if device not detected
adb start-server               # Start ADB server
adb reverse tcp:8081 tcp:8081  # Forward Metro bundler port manually if needed
adb logcat                     # Stream device logs for debugging
```

---

## Usage Examples

### Register a new account

On first launch, tap **Sign Up**, enter your name, RUET email, and a password. After registration you are taken to the main feed.

### Browse the community feed

```
Home Tab → Feed
```

Scroll through announcements and updates posted by students and alumni. Tap any post to view details and comments.

### Upload a study resource

```
Resources Tab → (+) Upload
```

```ts
// Example: uploading a resource via the API
const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/resources`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userToken}`,
  },
  body: JSON.stringify({
    title: "Data Structures — Lecture Notes",
    subject: "CSE 2101",
    semester: 3,
    fileUrl: uploadedFileUrl,
  }),
});
```

### Search for classmates

```
People Tab → Search bar
```

Type a name, batch year, or graduation year to find students and alumni. Tap a profile to view their shared resources and contact info.

---

## Project Structure

```
native/
├── app/                        # Expo Router — file-based routing
│   ├── (tabs)/
│   │   ├── feed.tsx            # Announcements & community updates
│   │   ├── resources.tsx       # Notes & study material browser
│   │   └── people.tsx          # Classmates & alumni directory
│   ├── auth/
│   │   ├── login.tsx           # Login screen
│   │   └── register.tsx        # Registration screen
│   ├── _layout.tsx             # Root layout & navigation config
│   └── index.tsx               # Entry screen
├── components/                 # Reusable UI components
│   ├── cards/                  # PostCard, ResourceCard, UserCard
│   ├── layout/                 # Header, BottomTabBar
│   └── ui/                     # Button, Input, Badge, Modal
├── hooks/                      # Custom React hooks (useAuth, useResources)
├── lib/                        # Firebase config, API client, utilities
├── constants/                  # Colors, routes, config constants
├── assets/                     # Fonts, images, icons
├── tailwind.config.js          # NativeWind / Tailwind configuration
├── babel.config.js             # Babel config (NativeWind preset)
├── app.json                    # Expo app config (name, icon, splash)
└── package.json
```

---

## Styling with NativeWind

This project uses **NativeWind** to write Tailwind CSS utility classes directly in React Native components. Standard Tailwind CSS cannot run in React Native (no browser DOM or CSS engine) — NativeWind bridges this by converting class strings into React Native `StyleSheet` objects at build time.

### Example component

```tsx
import { View, Text, TouchableOpacity } from "react-native";

export default function ResourceCard({ title, subject, author }: Props) {
  return (
    <View className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
          {subject}
        </Text>
      </View>
      <Text className="text-base font-semibold text-gray-900 mt-2">
        {title}
      </Text>
      <Text className="text-sm text-gray-500 mt-1">Shared by {author}</Text>
      <TouchableOpacity className="mt-3 bg-blue-600 rounded-xl py-2 items-center">
        <Text className="text-white text-sm font-medium">Download</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Required configuration

`babel.config.js`:

```js
module.exports = {
  presets: [
    ["babel-preset-expo", { jsxImportSource: "nativewind" }],
    "nativewind/babel",
  ],
};
```

`tailwind.config.js`:

```js
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: { extend: {} },
  plugins: [],
};
```

> Not all Tailwind utilities work in React Native. CSS Grid, hover states, and browser-specific utilities are unsupported. Use React Native's `StyleSheet` API as a fallback when needed.

---

## Authentication

The app uses **email and password** based authentication managed through the **Next.js backend API**. Firebase is used as the underlying auth and database provider.

**Flow:**

1. User registers with name, email, and password via the `/api/auth/register` endpoint
2. The backend validates the input, creates a Firebase Auth user, and stores the profile in Firestore
3. A session token is returned and stored securely on the device
4. All subsequent API requests are authenticated via `Authorization: Bearer <token>` headers

---

## Backend & Database

This mobile app communicates with a **Next.js backend** (see the `/web` directory) which exposes API routes for all data operations. Firebase is used for:

- **Firestore** — storing user profiles, posts, and resource metadata
- **Firebase Storage** — storing uploaded files (PDFs, images)
- **Firebase Auth** — user identity management

Ensure the Next.js backend is running locally before starting the mobile app in development:

```bash
cd ../web
npm run dev   # starts on http://localhost:3000
```

---

## Available Scripts

| Command                  | Description                                      |
| ------------------------ | ------------------------------------------------ |
| `npx expo start`         | Start Expo dev server                            |
| `npx expo start --clear` | Start with cleared Metro bundler cache           |
| `npx expo run:android`   | Build and install native APK on connected device |
| `npx expo run:ios`       | Build for iOS (macOS + Xcode required)           |
| `npm run lint`           | Run ESLint                                       |
| `npm run typecheck`      | Run TypeScript compiler check                    |

---

## Troubleshooting

**Device not detected by ADB**

```bash
adb kill-server && adb start-server
adb devices
```

Ensure USB Debugging is on and you tapped **Allow** on the device trust prompt.

**NativeWind classes not applying**

- Confirm `nativewind/babel` is in `babel.config.js`
- Clear Metro cache: `npx expo start --clear`
- Verify `content` paths in `tailwind.config.js` match your file structure

**Metro bundler port conflict**

```bash
npx expo start --port 8082
```

**`expo run:android` fails — SDK not found**

```bash
# Add to ~/.bashrc or ~/.zshrc and restart terminal
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/build-tools
```

**Firebase connection errors**

- Double-check all `EXPO_PUBLIC_FIREBASE_*` values in `.env.local`
- Ensure the Firebase project has Authentication and Firestore enabled in the Firebase console

---

## Contributing

RUET CSE students and alumni are warmly welcome to contribute.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit with a clear message: `git commit -m 'feat: describe your change'`
4. Push the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request with a description of what was changed and why
