import 'dart:convert';
import 'package:http/http.dart' as http;

/// SGOBot service — talks to OpenRouter (free models, no billing required).
/// If no key is set or the API errors, falls back to a friendly rule-based
/// responder so the chatbot is always usable.
///
/// Get a free key at https://openrouter.ai → Keys → Create Key.
/// Run with: flutter run --dart-define=OPENROUTER_API_KEY=sk-or-v1-...
class GeminiService {
  static const String _apiKey = String.fromEnvironment(
    'OPENROUTER_API_KEY',
    defaultValue: '',
  );

  // Free models on OpenRouter, in priority order.
  // We automatically try the next one if the previous is rate-limited (429).
  // This avoids manual model-swapping when shared upstream pools are saturated.
  // See current list: https://openrouter.ai/models?max_price=0
  static const List<String> _models = [
    'poolside/laguna-xs.2:free',                                  // smallest, least demand
    'poolside/laguna-m.1:free',
    'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
    'google/gemma-4-26b-a4b-it:free',
    'google/gemma-4-31b-it:free',
  ];

  static const String _systemPrompt = '''
You are SGOBot, a friendly assistant for the Scholars and Grants Office (SGO).
You help scholar grantees with: scholarship FAQs, renewal requirements, document
checklists, and general guidance. Keep answers short, warm, and Filipino-context aware.
If asked about specific application status or personal records, tell the user to
check the Documents and Profile tabs in the app.
''';

  // Multi-turn chat history kept on-device.
  final List<Map<String, String>> _history = [
    {'role': 'system', 'content': _systemPrompt},
  ];

  bool get hasKey => _apiKey.isNotEmpty;

  Future<String> ask(String prompt) async {
    if (!hasKey) return _fallback(prompt);
    _history.add({'role': 'user', 'content': prompt});

    int? lastStatus;
    for (final model in _models) {
      try {
        final res = await http.post(
          Uri.parse('https://openrouter.ai/api/v1/chat/completions'),
          headers: {
            'Authorization': 'Bearer $_apiKey',
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://sgo-portal.app',
            'X-Title': 'SGO Scholar',
          },
          body: jsonEncode({'model': model, 'messages': _history}),
        );
        if (res.statusCode == 200) {
          final data = jsonDecode(res.body);
          final reply = data['choices']?[0]?['message']?['content'] as String?;
          if (reply != null && reply.isNotEmpty) {
            _history.add({'role': 'assistant', 'content': reply});
            return reply.trim();
          }
        }
        lastStatus = res.statusCode;
        // ignore: avoid_print
        print('OpenRouter $model -> ${res.statusCode}: ${res.body}');
        // 429 (rate-limited) or 404 (model gone) → try next; other errors → stop.
        if (res.statusCode != 429 && res.statusCode != 404) break;
      } catch (e) {
        // ignore: avoid_print
        print('OpenRouter $model -> exception: $e');
        // network error: try next model anyway
      }
    }
    return '${_fallback(prompt)}\n\n_(All free models busy${lastStatus != null ? ' — last: $lastStatus' : ''}.)_';
  }

  /// Rule-based fallback for the most common scholar questions.
  String _fallback(String prompt) {
    final q = prompt.toLowerCase();
    if (_match(q, ['hi', 'hello', 'hey', 'kumusta', 'kamusta'])) {
      return 'Hi! I\'m SGOBot 👋 Ask me about scholarship requirements, renewals, documents, or how to use this app.';
    }
    if (_match(q, ['requirement', 'document', 'papers', 'submit'])) {
      return 'For UniFAST – Tertiary Education Subsidy, you need to upload:\n\n'
          '• Enrollment Registration Certificate (ERC)\n'
          '• Certificate of Grades / Transcript\n'
          '• Birth Certificate\n'
          '• Income Tax Return or Certificate of Indigency\n'
          '• Valid Student ID\n\n'
          'You can upload these in the **Documents** tab.';
    }
    if (_match(q, ['renew', 'renewal'])) {
      return 'Scholarship renewal usually happens every semester. To renew, keep your grades up '
          '(no failing marks), submit your latest Certificate of Grades, and re-upload your ERC '
          'each enrollment period. The SGO will notify you when renewal is due.';
    }
    if (_match(q, ['eligib', 'qualify', 'qualified', 'who can apply'])) {
      return 'You\'re eligible if you\'re an enrolled tertiary student in good academic standing '
          'and meet the program-specific requirements (income for need-based, GWA for academic, etc.). '
          'Submit a pre-application via the SGO web portal to find out.';
    }
    if (_match(q, ['apply', 'application', 'how to apply'])) {
      return 'Visit the SGO web portal to fill out the UniFAST pre-application form. '
          'Once your application is approved by the SGO, you\'ll be able to track your scholarship '
          'right here in the app.';
    }
    if (_match(q, ['deadline', 'when'])) {
      return 'Application deadlines vary per scholarship type. Check announcements on the SGO web '
          'portal or visit the SGO office directly. We\'ll also send notifications in this app.';
    }
    if (_match(q, ['contact', 'office', 'address', 'phone', 'email'])) {
      return 'You can reach the Scholars and Grants Office at:\n\n'
          '📧 sgo@yourschool.edu.ph\n'
          '📞 (+63) 000-000-0000\n'
          '📍 SGO Office, Main Campus\n\n'
          'Office hours: Monday–Friday, 8:00 AM – 5:00 PM.';
    }
    if (_match(q, ['status', 'approved', 'rejected', 'pending'])) {
      return 'Check the **Home** tab for your active scholarship status, and the **Documents** tab '
          'to see verification status of each file you uploaded.';
    }
    if (_match(q, ['salamat', 'thanks', 'thank you', 'ty'])) {
      return 'You\'re welcome! Good luck with your scholarship 🎓';
    }
    return 'I\'m SGOBot — I can help with scholarship requirements, renewals, eligibility, '
        'document uploads, and contacting the SGO office. Try asking me about any of those!';
  }

  bool _match(String q, List<String> kws) => kws.any(q.contains);
}
