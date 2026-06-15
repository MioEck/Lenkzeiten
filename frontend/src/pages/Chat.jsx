import { useState, useRef, useEffect } from 'react';
import ChatMessage from '../components/ChatMessage.jsx';

const PRESET_QUESTIONS = [
  'Was ist die maximale Tageslenkezeit?',
  'Wann muss ich eine Pause machen?',
  'Was ist die 12-Tage-Regel?',
  'Welche Strafen drohen bei Verstößen?',
  'Wie funktioniert die geteilte Tagesruhezeit?',
  'Was gilt bei der Doppelwoche?',
];

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hallo! Ich bin dein KI-Assistent für Lenk- und Ruhezeiten im Straßenverkehr. Ich beantworte Fragen basierend auf dem Fachbuch "Lenk- und Ruhezeiten im Straßenverkehr" von Bopp & Faßbender und der EU-Verordnung 561/2006.\n\nWas möchtest du wissen?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (text) => {
    const question = (text || input).trim();
    if (!question || isLoading) return;

    setInput('');
    setError(null);

    const userMessage = { role: 'user', content: question };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    // Build conversation history (exclude the initial greeting)
    const history = updatedMessages
      .slice(1) // skip greeting
      .slice(0, -1) // skip the message we just added
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, conversationHistory: history }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Netzwerkfehler' }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (err) {
      setError('Fehler: ' + err.message);
      setMessages((prev) => prev.slice(0, -1)); // remove user message on error
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Chat zurückgesetzt. Wie kann ich dir helfen?',
      },
    ]);
    setError(null);
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
        <div>
          <h1 className="font-bold text-slate-100">KI-Assistent</h1>
          <p className="text-xs text-slate-400">Lenk- &amp; Ruhezeiten nach EU-VO 561/2006</p>
        </div>
        <button onClick={clearChat} className="btn-secondary text-xs py-1.5 px-3">
          🗑 Neu
        </button>
      </div>

      {/* Preset questions */}
      <div className="px-4 py-3 border-b border-slate-800 overflow-x-auto">
        <div className="flex gap-2 flex-nowrap min-w-0">
          {PRESET_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q)}
              disabled={isLoading}
              className="flex-shrink-0 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} />
        ))}
        {isLoading && <ChatMessage isLoading />}
        {error && (
          <div className="bg-red-950/40 border border-red-800 rounded-xl px-4 py-3 text-red-300 text-sm">
            ⚠️ {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-slate-800 bg-slate-950/80 backdrop-blur-sm">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Frage zu Lenk- und Ruhezeiten..."
            rows={1}
            disabled={isLoading}
            className="input-field resize-none min-h-[44px] max-h-32 leading-relaxed"
            style={{ height: 'auto' }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
            className="btn-primary flex-shrink-0 h-11 w-11 flex items-center justify-center text-lg p-0"
          >
            {isLoading ? (
              <span className="animate-spin text-base">⏳</span>
            ) : (
              '↑'
            )}
          </button>
        </div>
        <p className="text-xs text-slate-600 mt-1.5 text-center">
          Enter senden • Shift+Enter neue Zeile
        </p>
      </div>
    </div>
  );
}
