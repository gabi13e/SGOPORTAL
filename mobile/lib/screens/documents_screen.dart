import 'dart:io';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:file_picker/file_picker.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

const _requiredDocs = [
  'Enrollment Registration Certificate (ERC)',
  'Certificate of Grades / Transcript',
  'Birth Certificate',
  'Income Tax Return / Certificate of Indigency',
  'Valid Student ID',
];

class DocumentsScreen extends StatelessWidget {
  const DocumentsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final uid = FirebaseAuth.instance.currentUser?.uid;
    return Scaffold(
      appBar: AppBar(
        title: const Text('Documents'),
        titleTextStyle: const TextStyle(
          color: Color(0xFF0F172A),
          fontSize: 22,
          fontWeight: FontWeight.bold,
        ),
      ),
      body: uid == null
          ? const Center(child: Text('Sign in required'))
          : Column(
              children: [
                _ChecklistHeader(uid: uid),
                Expanded(
                  child: StreamBuilder<QuerySnapshot>(
                    stream: FirebaseFirestore.instance
                        .collection('users')
                        .doc(uid)
                        .collection('documents')
                        .orderBy('uploadedAt', descending: true)
                        .snapshots(),
                    builder: (context, snap) {
                      if (snap.connectionState == ConnectionState.waiting) {
                        return const Center(child: CircularProgressIndicator());
                      }
                      final docs = snap.data?.docs ?? [];
                      if (docs.isEmpty) {
                        return const _EmptyState();
                      }
                      return ListView.separated(
                        padding: const EdgeInsets.all(16),
                        itemCount: docs.length,
                        separatorBuilder: (_, _) => const SizedBox(height: 8),
                        itemBuilder: (_, i) => _DocCard(doc: docs[i]),
                      );
                    },
                  ),
                ),
              ],
            ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _pickAndUpload(context),
        icon: const Icon(Icons.upload_file),
        label: const Text('Upload'),
      ),
    );
  }

  Future<void> _pickAndUpload(BuildContext context) async {
    final result = await FilePicker.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
    );
    if (result == null || result.files.single.path == null) return;
    final selected = await _askDocType(context);
    if (selected == null) return;

    final uid = FirebaseAuth.instance.currentUser!.uid;
    final file = File(result.files.single.path!);
    final fileName =
        '${DateTime.now().millisecondsSinceEpoch}_${result.files.single.name}';
    final ref = FirebaseStorage.instance.ref('user_documents/$uid/$fileName');

    try {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Uploading…')));
      await ref.putFile(file);
      final url = await ref.getDownloadURL();
      await FirebaseFirestore.instance
          .collection('users')
          .doc(uid)
          .collection('documents')
          .add({
            'docType': selected,
            'fileName': result.files.single.name,
            'url': url,
            'storagePath': ref.fullPath,
            'status': 'pending',
            'uploadedAt': FieldValue.serverTimestamp(),
          });
      if (context.mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('Uploaded.')));
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Upload failed: $e')));
      }
    }
  }

  Future<String?> _askDocType(BuildContext context) async {
    return showModalBottomSheet<String>(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => SafeArea(
        child: ListView(
          shrinkWrap: true,
          children: [
            const Padding(
              padding: EdgeInsets.all(16),
              child: Text(
                'Select document type',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
            ..._requiredDocs.map(
              (d) => ListTile(
                leading: const Icon(Icons.description_outlined),
                title: Text(d),
                onTap: () => Navigator.pop(context, d),
              ),
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }
}

class _ChecklistHeader extends StatelessWidget {
  final String uid;
  const _ChecklistHeader({required this.uid});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<QuerySnapshot>(
      stream: FirebaseFirestore.instance
          .collection('users')
          .doc(uid)
          .collection('documents')
          .snapshots(),
      builder: (context, snap) {
        final uploaded = (snap.data?.docs ?? [])
            .map((d) => (d.data() as Map)['docType'])
            .toSet();
        final pct = (uploaded.length / _requiredDocs.length).clamp(0.0, 1.0);
        return Container(
          margin: const EdgeInsets.fromLTRB(16, 8, 16, 0),
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFE2E8F0)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Text(
                    'Eligibility Checklist',
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                  ),
                  const Spacer(),
                  Text(
                    '${uploaded.length}/${_requiredDocs.length}',
                    style: const TextStyle(
                      color: Color(0xFF64748B),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: LinearProgressIndicator(
                  value: pct,
                  minHeight: 8,
                  backgroundColor: const Color(0xFFE2E8F0),
                  valueColor: const AlwaysStoppedAnimation(Color(0xFF2563EB)),
                ),
              ),
              const SizedBox(height: 6),
              Text(
                pct == 1.0
                    ? '✓ All required documents submitted'
                    : 'Submit all required documents to be eligible.',
                style: TextStyle(
                  fontSize: 12,
                  color: pct == 1.0
                      ? const Color(0xFF059669)
                      : const Color(0xFF64748B),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _DocCard extends StatelessWidget {
  final QueryDocumentSnapshot doc;
  const _DocCard({required this.doc});

  @override
  Widget build(BuildContext context) {
    final data = doc.data() as Map<String, dynamic>;
    final status = data['status'] ?? 'pending';
    final ts = data['uploadedAt'];
    final dt = ts is Timestamp ? ts.toDate() : null;
    return Card(
      child: ListTile(
        leading: Container(
          height: 40,
          width: 40,
          decoration: BoxDecoration(
            color: const Color(0xFFEFF6FF),
            borderRadius: BorderRadius.circular(10),
          ),
          child: const Icon(Icons.description, color: Color(0xFF2563EB)),
        ),
        title: Text(
          data['docType'] ?? '-',
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        subtitle: Text(
          dt != null
              ? DateFormat.yMMMd().add_jm().format(dt)
              : data['fileName'] ?? '',
          style: const TextStyle(fontSize: 12),
        ),
        trailing: _StatusChip(status: status),
      ),
    );
  }
}

class _StatusChip extends StatelessWidget {
  final String status;
  const _StatusChip({required this.status});

  @override
  Widget build(BuildContext context) {
    final map = {
      'pending': (Color(0xFFFEF3C7), Color(0xFFB45309), 'Pending'),
      'approved': (Color(0xFFD1FAE5), Color(0xFF065F46), 'Verified'),
      'rejected': (Color(0xFFFEE2E2), Color(0xFFB91C1C), 'Rejected'),
    };
    final m =
        map[status] ??
        (const Color(0xFFE2E8F0), const Color(0xFF334155), status);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: m.$1,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        m.$3,
        style: TextStyle(
          color: m.$2,
          fontSize: 11,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState();
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              height: 64,
              width: 64,
              decoration: BoxDecoration(
                color: const Color(0xFFEFF6FF),
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Icon(
                Icons.cloud_upload_outlined,
                color: Color(0xFF2563EB),
                size: 32,
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'No documents yet',
              style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            const Text(
              'Upload your scholarship documents to begin eligibility verification.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Color(0xFF64748B)),
            ),
          ],
        ),
      ),
    );
  }
}
