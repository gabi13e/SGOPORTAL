import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final uid = FirebaseAuth.instance.currentUser?.uid;
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _Header(uid: uid),
              const SizedBox(height: 20),
              _StatusCard(),
              const SizedBox(height: 16),
              const Text('Quick Stats', style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold)),
              const SizedBox(height: 10),
              GridView.count(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisCount: 2,
                mainAxisSpacing: 10,
                crossAxisSpacing: 10,
                childAspectRatio: 1.3,
                children: const [
                  _StatTile(label: 'Documents', value: '0', icon: Icons.folder_outlined, color: Color(0xFF3B82F6)),
                  _StatTile(label: 'Verified', value: '0', icon: Icons.verified_outlined, color: Color(0xFF10B981)),
                  _StatTile(label: 'Pending', value: '0', icon: Icons.access_time, color: Color(0xFFF59E0B)),
                  _StatTile(label: 'Renewals', value: '—', icon: Icons.refresh, color: Color(0xFF8B5CF6)),
                ],
              ),
              const SizedBox(height: 16),
              const Text('Notifications', style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold)),
              const SizedBox(height: 10),
              _Empty(text: 'No notifications yet. We\'ll alert you when your documents are reviewed or when a renewal is due.'),
            ],
          ),
        ),
      ),
    );
  }
}

class _Header extends StatelessWidget {
  final String? uid;
  const _Header({this.uid});

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;
    return Row(
      children: [
        CircleAvatar(
          radius: 24,
          backgroundColor: const Color(0xFF2563EB),
          child: Text(
            (user?.displayName?.isNotEmpty ?? false) ? user!.displayName![0].toUpperCase() : 'S',
            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Welcome back 👋', style: TextStyle(color: Color(0xFF64748B), fontSize: 13)),
              Text(user?.displayName ?? 'Scholar',
                  style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
        IconButton(icon: const Icon(Icons.notifications_outlined), onPressed: () {}),
      ],
    );
  }
}

class _StatusCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final uid = FirebaseAuth.instance.currentUser?.uid;
    return StreamBuilder<QuerySnapshot>(
      stream: uid == null
          ? const Stream.empty()
          : FirebaseFirestore.instance
              .collection('applications')
              .where('uid', isEqualTo: uid)
              .limit(1)
              .snapshots(),
      builder: (context, snap) {
        final hasApp = snap.hasData && snap.data!.docs.isNotEmpty;
        final data = hasApp ? snap.data!.docs.first.data() as Map<String, dynamic> : null;
        final status = (data?['status'] ?? '') as String;

        // Visual variant per status
        late final List<Color> grad;
        late final String tag;
        late final String title;
        late final String subtitle;
        late final IconData icon;

        if (!hasApp) {
          grad = const [Color(0xFF64748B), Color(0xFF334155)];
          tag = 'NO APPLICATION YET';
          title = 'Apply via the web portal';
          subtitle = 'Submit your UniFAST pre-application to get started';
          icon = Icons.assignment_outlined;
        } else if (status == 'approved') {
          grad = const [Color(0xFF10B981), Color(0xFF0D9488)];
          tag = 'APPROVED ✨';
          title = data?['scholarshipType'] ?? 'Scholarship';
          subtitle = '${data?['program'] ?? ''} · ${data?['yearLevel'] ?? ''}';
          icon = Icons.workspace_premium;
        } else if (status == 'rejected') {
          grad = const [Color(0xFFEF4444), Color(0xFFB91C1C)];
          tag = 'NOT APPROVED';
          title = 'Visit the SGO office';
          subtitle = 'Discuss next steps with the Scholars and Grants Office';
          icon = Icons.info_outline;
        } else if (status == 'under-review') {
          grad = const [Color(0xFF3B82F6), Color(0xFF6366F1)];
          tag = 'UNDER REVIEW';
          title = 'Your application is being reviewed';
          subtitle = '${data?['scholarshipType'] ?? 'Scholarship'} · ${data?['program'] ?? ''}';
          icon = Icons.hourglass_top;
        } else {
          grad = const [Color(0xFFF59E0B), Color(0xFFEA580C)];
          tag = 'PENDING REVIEW';
          title = 'Application submitted';
          subtitle = 'The SGO will forward your pre-application to CHED';
          icon = Icons.schedule;
        }

        return Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: LinearGradient(colors: grad, begin: Alignment.topLeft, end: Alignment.bottomRight),
            borderRadius: BorderRadius.circular(20),
            boxShadow: [BoxShadow(color: grad.first.withValues(alpha: 0.25), blurRadius: 16, offset: const Offset(0, 6))],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(icon, color: Colors.white, size: 18),
                  const SizedBox(width: 6),
                  Text(tag,
                      style: const TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1)),
                ],
              ),
              const SizedBox(height: 10),
              Text(title,
                  style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              Text(subtitle, style: const TextStyle(color: Colors.white70, fontSize: 13)),
            ],
          ),
        );
      },
    );
  }
}

class _StatTile extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;
  const _StatTile({required this.label, required this.value, required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(color: color.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(10)),
              child: Icon(icon, color: color, size: 20),
            ),
            const Spacer(),
            Text(value, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
            Text(label, style: const TextStyle(color: Color(0xFF64748B), fontSize: 12)),
          ],
        ),
      ),
    );
  }
}

class _Empty extends StatelessWidget {
  final String text;
  const _Empty({required this.text});
  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            const Icon(Icons.info_outline, color: Color(0xFF94A3B8)),
            const SizedBox(width: 10),
            Expanded(child: Text(text, style: const TextStyle(color: Color(0xFF64748B), fontSize: 13))),
          ],
        ),
      ),
    );
  }
}
