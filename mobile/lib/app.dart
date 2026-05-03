import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'screens/login_screen.dart';
import 'screens/main_shell.dart';
import 'services/auth_service.dart';
import 'theme.dart';

class SgoScholarApp extends StatelessWidget {
  const SgoScholarApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SGO Scholar',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light(),
      home: Consumer<AuthService>(
        builder: (_, auth, _) {
          if (auth.isLoggedIn) return const MainShell();
          return const LoginScreen();
        },
      ),
    );
  }
}
