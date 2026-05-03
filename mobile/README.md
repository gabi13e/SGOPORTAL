# SGO Scholar — Mobile App

Flutter mobile app for **approved scholar grantees**. Companion to the web portal at `../web/` — both share the same Firebase project (`portal-33351`).

## Features

- 🔐 **Firebase Auth** — sign in / sign up with the email registered with the SGO
- 🏠 **Home dashboard** — active scholarship status, quick stats, notifications
- 📁 **Documents** — upload PDFs/images to Firebase Storage, eligibility checklist with progress bar
- 🤖 **SGOBot AI Chatbot** — Gemini Flash for FAQs and scholarship guidance
- 👤 **Profile** — account info, settings, sign out

## Setup

### 1. Install Flutter dependencies

```powershell
cd E:\SGOPORTAL\mobile
flutter pub get
```

### 2. Configure Firebase for Android (one-time)

The `firebase_options.dart` file is pre-filled with the web app config. To register the Android app properly:

```powershell
# install the FlutterFire CLI if you don't have it
dart pub global activate flutterfire_cli

# generate platform options (this writes google-services.json + updates firebase_options.dart)
flutterfire configure --project=portal-33351
```

You also need to enable **Storage** in the Firebase console: https://console.firebase.google.com/project/portal-33351/storage

### 3. Add your Gemini API key

Get a free key from https://aistudio.google.com/app/apikey, then either:

**Option A** — pass via `--dart-define` (recommended):

```powershell
flutter run --dart-define=GEMINI_API_KEY=your_key_here
```

**Option B** — paste it into [`lib/services/gemini_service.dart`](lib/services/gemini_service.dart) (replace `PASTE_YOUR_GEMINI_API_KEY_HERE`).

### 4. Run

```powershell
flutter run                # picks an available device
flutter run -d chrome      # web preview
```

## Project structure

```
lib/
├── main.dart                  # entry — Firebase init + Provider setup
├── app.dart                   # MaterialApp + auth gate
├── firebase_options.dart      # Firebase config (regenerate via flutterfire configure)
├── theme.dart                 # Material 3 theme
├── services/
│   ├── auth_service.dart      # FirebaseAuth wrapper, Provider
│   └── gemini_service.dart    # Gemini chat session
└── screens/
    ├── login_screen.dart
    ├── signup_screen.dart
    ├── main_shell.dart        # bottom-nav scaffold
    ├── home_screen.dart       # dashboard
    ├── documents_screen.dart  # upload + eligibility checklist
    ├── chatbot_screen.dart    # SGOBot
    └── profile_screen.dart
```

## Firestore data shape

| Collection | Doc shape |
|---|---|
| `users/{uid}` | `{ fullName, email, studentId, role: 'scholar', createdAt }` |
| `users/{uid}/documents/{id}` | `{ docType, fileName, url, storagePath, status, uploadedAt }` |
| `scholars` | mirrors web — populated when admin approves an application |

## Build APK for distribution

```powershell
flutter build apk --release --dart-define=GEMINI_API_KEY=your_key_here
```

Output: `build\app\outputs\flutter-apk\app-release.apk`. Distribute to approved scholars and link from the web app's "Install App" dialog.
