// File generated manually for the SGO Portal Firebase project (portal-33351).
// Replace by running `flutterfire configure --project=portal-33351` to
// auto-generate platform-specific options for iOS / macOS / Windows.
//
// The values below come from the web app config the user shared on
// 2026-05-02 and are sufficient to run on Android + Web.
import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart' show defaultTargetPlatform, kIsWeb, TargetPlatform;

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) return web;
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not configured for this platform yet. '
          'Run `flutterfire configure` to generate them.',
        );
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyDKQM0NJeBcbaZFrUnZEpHX0KkxIhrt_cY',
    appId: '1:1007416501570:web:da2bc39372565e3c6294db',
    messagingSenderId: '1007416501570',
    projectId: 'portal-33351',
    authDomain: 'portal-33351.firebaseapp.com',
    storageBucket: 'portal-33351.firebasestorage.app',
    measurementId: 'G-N73VT62P9Z',
  );

  // For Android, run `flutterfire configure` to register an Android app

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyAC-qkcG33XtuDZCp-vs__RLiB1snnvYdc',
    appId: '1:1007416501570:android:4376e4e1f3e6e6f46294db',
    messagingSenderId: '1007416501570',
    projectId: 'portal-33351',
    storageBucket: 'portal-33351.firebasestorage.app',
  );

  // in the Firebase console and replace the appId below with the generated one.
}