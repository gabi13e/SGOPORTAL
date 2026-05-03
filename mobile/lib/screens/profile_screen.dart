import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../services/auth_service.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;
    final uid = user?.uid;
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        titleTextStyle: const TextStyle(color: Color(0xFF0F172A), fontSize: 22, fontWeight: FontWeight.bold),
      ),
      body: uid == null
          ? const Center(child: Text('Not signed in'))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _ProfileHeader(user: user!),
                  const SizedBox(height: 20),
                  StreamBuilder<DocumentSnapshot>(
                    stream: FirebaseFirestore.instance.collection('users').doc(uid).snapshots(),
                    builder: (context, snap) {
                      final data = snap.data?.data() as Map<String, dynamic>?;
                      return Card(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Account Info', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                              const SizedBox(height: 12),
                              _Row(label: 'Full Name', value: data?['fullName'] ?? user.displayName ?? '—'),
                              _Row(label: 'Email', value: user.email ?? '—'),
                              _Row(label: 'Student ID', value: data?['studentId'] ?? '—'),
                              _Row(label: 'Role', value: data?['role'] ?? 'scholar'),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 12),
                  Card(
                    child: Column(
                      children: [
                        ListTile(
                          leading: const Icon(Icons.notifications_outlined),
                          title: const Text('Notifications'),
                          trailing: const Icon(Icons.chevron_right),
                          onTap: () {},
                        ),
                        const Divider(height: 1),
                        ListTile(
                          leading: const Icon(Icons.help_outline),
                          title: const Text('Help & Support'),
                          trailing: const Icon(Icons.chevron_right),
                          onTap: () {},
                        ),
                        const Divider(height: 1),
                        ListTile(
                          leading: const Icon(Icons.logout, color: Colors.red),
                          title: const Text('Sign Out', style: TextStyle(color: Colors.red)),
                          onTap: () => context.read<AuthService>().signOut(),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Center(
                    child: Text('SGO Scholar v1.0.0', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12)),
                  ),
                ],
              ),
            ),
    );
  }
}

class _ProfileHeader extends StatelessWidget {
  final User user;
  const _ProfileHeader({required this.user});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(colors: [Color(0xFF2563EB), Color(0xFF4F46E5)]),
        borderRadius: BorderRadius.circular(18),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 32,
            backgroundColor: Colors.white,
            child: Text(
              (user.displayName?.isNotEmpty ?? false) ? user.displayName![0].toUpperCase() : 'S',
              style: const TextStyle(color: Color(0xFF2563EB), fontWeight: FontWeight.bold, fontSize: 24),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(user.displayName ?? 'Scholar',
                    style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(user.email ?? '',
                    style: const TextStyle(color: Colors.white70, fontSize: 13)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Row extends StatelessWidget {
  final String label, value;
  const _Row({required this.label, required this.value});
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          SizedBox(width: 100, child: Text(label, style: const TextStyle(color: Color(0xFF64748B), fontSize: 13))),
          Expanded(child: Text(value, style: const TextStyle(fontWeight: FontWeight.w500))),
        ],
      ),
    );
  }
}
