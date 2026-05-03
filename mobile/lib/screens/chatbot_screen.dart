import 'package:flutter/material.dart';

import '../services/gemini_service.dart';

class ChatbotScreen extends StatefulWidget {
  const ChatbotScreen({super.key});
  @override
  State<ChatbotScreen> createState() => _ChatbotScreenState();
}

class _ChatMsg {
  final String text;
  final bool fromUser;
  _ChatMsg(this.text, this.fromUser);
}

class _ChatbotScreenState extends State<ChatbotScreen> {
  final _gemini = GeminiService();
  final _controller = TextEditingController();
  final _scroll = ScrollController();
  final List<_ChatMsg> _messages = [
    _ChatMsg(
      'Hi 👋 I\'m SGOBot. Ask me anything about your scholarship — requirements, renewals, deadlines, or how to use this app.',
      false,
    ),
  ];
  bool _busy = false;

  Future<void> _send() async {
    final text = _controller.text.trim();
    if (text.isEmpty || _busy) return;
    setState(() {
      _messages.add(_ChatMsg(text, true));
      _busy = true;
      _controller.clear();
    });
    _scrollDown();
    try {
      final reply = await _gemini.ask(text);
      setState(() => _messages.add(_ChatMsg(reply, false)));
    } catch (e) {
      setState(() => _messages.add(_ChatMsg('Sorry, I had trouble responding: $e', false)));
    } finally {
      if (mounted) setState(() => _busy = false);
      _scrollDown();
    }
  }

  void _scrollDown() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scroll.hasClients) {
        _scroll.animateTo(_scroll.position.maxScrollExtent + 80,
            duration: const Duration(milliseconds: 250), curve: Curves.easeOut);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('SGOBot'),
        titleTextStyle: const TextStyle(color: Color(0xFF0F172A), fontSize: 22, fontWeight: FontWeight.bold),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scroll,
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (_, i) => _MsgBubble(msg: _messages[i]),
            ),
          ),
          if (_busy) const Padding(
            padding: EdgeInsets.only(bottom: 8),
            child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
              SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2)),
              SizedBox(width: 8),
              Text('Thinking…', style: TextStyle(color: Color(0xFF64748B), fontSize: 12)),
            ]),
          ),
          SafeArea(
            top: false,
            child: Container(
              padding: const EdgeInsets.fromLTRB(12, 8, 12, 8),
              decoration: const BoxDecoration(
                color: Colors.white,
                border: Border(top: BorderSide(color: Color(0xFFE2E8F0))),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      minLines: 1,
                      maxLines: 4,
                      decoration: const InputDecoration(
                        hintText: 'Ask SGOBot…',
                        border: OutlineInputBorder(borderSide: BorderSide.none),
                        isDense: true,
                      ),
                      onSubmitted: (_) => _send(),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton.filled(
                    onPressed: _busy ? null : _send,
                    icon: const Icon(Icons.send),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _MsgBubble extends StatelessWidget {
  final _ChatMsg msg;
  const _MsgBubble({required this.msg});

  @override
  Widget build(BuildContext context) {
    final isUser = msg.fromUser;
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        mainAxisAlignment: isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (!isUser) const _BotAvatar(),
          if (!isUser) const SizedBox(width: 8),
          Flexible(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: isUser ? const Color(0xFF2563EB) : Colors.white,
                border: isUser ? null : Border.all(color: const Color(0xFFE2E8F0)),
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(16),
                  topRight: const Radius.circular(16),
                  bottomLeft: Radius.circular(isUser ? 16 : 4),
                  bottomRight: Radius.circular(isUser ? 4 : 16),
                ),
              ),
              child: Text(
                msg.text,
                style: TextStyle(color: isUser ? Colors.white : const Color(0xFF0F172A), height: 1.4),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _BotAvatar extends StatelessWidget {
  const _BotAvatar();
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 32, width: 32,
      decoration: BoxDecoration(
        gradient: const LinearGradient(colors: [Color(0xFF2563EB), Color(0xFF8B5CF6)]),
        borderRadius: BorderRadius.circular(10),
      ),
      child: const Icon(Icons.smart_toy_outlined, color: Colors.white, size: 18),
    );
  }
}
