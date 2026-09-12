# Cloud sync setup (Firebase)

Physingo can save progress (XP, streak, lesson stars, hearts) to the cloud so it
follows you across devices and app reinstalls, instead of only living in local
storage on one device. This is powered by Firebase Authentication (email/password
+ Google) and Firestore. Until you complete this setup, the app works exactly as
before - progress just stays local to the device.

## 1. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and click **Add project**.
2. Name it anything (e.g. "Physingo"). Google Analytics is optional - you can skip it.

## 2. Register a Web app

Firebase Auth's web config is what this app uses on every platform (iOS, Android, and web
all share the same Firebase JS SDK config).

1. In your new project, click the **</>** (Web) icon to add a web app.
2. Give it a nickname (e.g. "Physingo"). You don't need Firebase Hosting.
3. Copy the `firebaseConfig` object it shows you - you'll need these values in step 5.

## 3. Enable sign-in methods

1. In the Firebase Console, go to **Build -> Authentication -> Get started**.
2. Under **Sign-in method**, enable:
   - **Email/Password**
   - **Google** - when you enable this, Firebase auto-creates a Web OAuth client
     for you. After enabling, click into the Google provider and copy the
     **Web client ID** shown there (also visible later in Google Cloud Console
     under APIs & Services -> Credentials). This is your `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`.
3. Under **Settings -> Authorized domains**, add any domain you'll test the web
   build from (localhost is included by default).

## 4. Create a Firestore database

1. Go to **Build -> Firestore Database -> Create database**.
2. Choose **Start in production mode** (the app relies on the security rules below,
   not the insecure "test mode" default).
3. Pick a location close to your users.
4. Once created, go to the **Rules** tab and replace the contents with the rules
   from [`firestore.rules`](../firestore.rules) in this repo, then click **Publish**.
   This restricts every user to reading/writing only their own progress document.

## 5. Add your config to the app

1. Copy `.env.example` to `.env` in the project root.
2. Fill in the `EXPO_PUBLIC_FIREBASE_*` values from step 2's `firebaseConfig`.
3. Fill in `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` from step 3.
4. Restart the dev server (`npx expo start -c` to clear the bundler cache) so the
   new env vars are picked up.

At this point email/password sign-in works everywhere, and Google sign-in works
on web (tap **Continue with Google** on the Sign In screen).

## 6. (Optional) Native Google Sign-In on iOS/Android

Google's "Web" OAuth client type (from step 3) only accepts `http(s)://` redirect
URIs, so it can't complete the native-app OAuth redirect on a real iOS/Android
build. To support "Continue with Google" in a native build too:

1. Set `expo.ios.bundleIdentifier` and `expo.android.package` in `app.json` (e.g.
   `com.yourname.physingo`) - required before creating platform-specific OAuth clients.
2. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   (same project Firebase created for you), create:
   - An **iOS** OAuth client ID, using your bundle identifier.
   - An **Android** OAuth client ID, using your package name and your build's
     SHA-1 certificate fingerprint (`eas credentials` can show this for an EAS
     build, or use your debug keystore's SHA-1 for local testing).
3. Add those as `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` / `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` in `.env`.

Note: this app uses `expo-auth-session` for the native Google flow, which works in
Expo Go and dev builds without extra native modules. Expo's own current guidance
increasingly favors `@react-native-google-signin/google-signin` (a native module
requiring a custom EAS dev client, not Expo Go) for the most reliable native
experience - worth migrating to later if native Google sign-in proves flaky in
practice, but out of scope for the current managed-workflow setup.

## How syncing works

- Email/password and Google sign-in both create/sign in a Firebase Auth user.
- On first sign-in on a device, if the account has no saved cloud progress yet,
  the app pushes your current local progress up (so guest progress before signing
  in isn't lost). If the account already has cloud progress (e.g. you're signing
  in on a new device), that cloud progress replaces what's stored locally.
- While signed in, local progress changes (XP, streak, hearts, lesson stars) are
  pushed to Firestore automatically, debounced by about 1.5 seconds.
- Signing out stops syncing but leaves your local device data alone; local
  progress persists via `AsyncStorage` regardless of sign-in state, same as
  before this feature existed.
