import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';

class AuthService extends ChangeNotifier {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  User? _user;
  User? get user => _user;
  bool get isLoggedIn => _user != null;

  AuthService() {
    _auth.authStateChanges().listen((u) {
      _user = u;
      notifyListeners();
    });
  }

  Future<void> signIn(String email, String password) async {
    await _auth.signInWithEmailAndPassword(email: email, password: password);
  }

  Future<void> signUp({
    required String email,
    required String password,
    required String fullName,
    required String studentId,
  }) async {
    final cred = await _auth.createUserWithEmailAndPassword(email: email, password: password);
    final uid = cred.user!.uid;
    await cred.user!.updateDisplayName(fullName);

    // 1. Write the user profile.
    await _db.collection('users').doc(uid).set({
      'fullName': fullName,
      'email': email,
      'studentId': studentId,
      'role': 'scholar',
      'createdAt': FieldValue.serverTimestamp(),
    });

    // 2. Auto-link any existing pre-application that matches this Student ID.
    //    Pre-applications submitted via the web have uid == null until linked.
    final pending = await _db
        .collection('applications')
        .where('studentId', isEqualTo: studentId)
        .where('uid', isNull: true)
        .limit(1)
        .get();
    for (final doc in pending.docs) {
      await doc.reference.update({
        'uid': uid,
        'userEmail': email,
        'linkedAt': FieldValue.serverTimestamp(),
      });
    }
  }

  Future<void> signOut() async => _auth.signOut();
}
