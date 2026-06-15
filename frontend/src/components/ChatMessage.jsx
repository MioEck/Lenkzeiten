export default function ChatMessage({ role, content, isLoading }) {
  const isUser = role === 'user';

  if (isLoading) {
    return (
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 text-sm">
          🤖
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3">
          <div className="flex gap-1 items-center h-5">
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex items-start gap-3 flex-row-reverse">
        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 text-sm font-bold text-white">
          Du
        </div>
        <div className="bg-orange-600/20 border border-orange-600/30 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%]">
          <p className="text-slate-100 text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    );
  }

  // Format AI response: handle **bold**, newlines, bullet points
  const formatContent = (text) => {
    return text
      .split('\n')
      .map((line, i) => {
        // Bold text
        const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-orange-300 font-semibold">$1</strong>');
        // Bullet points
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return `<li class="ml-4 list-disc text-slate-300">${formatted.substring(2)}</li>`;
        }
        if (line.startsWith('### ')) {
          return `<h4 class="font-bold text-orange-400 mt-3 mb-1">${formatted.substring(4)}</h4>`;
        }
        if (line.startsWith('## ')) {
          return `<h3 class="font-bold text-orange-300 text-base mt-4 mb-1">${formatted.substring(3)}</h3>`;
        }
        if (line.trim() === '') return '<br />';
        return `<p class="text-slate-200">${formatted}</p>`;
      })
      .join('');
  };

  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 text-sm">
        🤖
      </div>
      <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[90%]">
        <div
          className="text-sm leading-relaxed space-y-0.5"
          dangerouslySetInnerHTML={{ __html: formatContent(content) }}
        />
      </div>
    </div>
  );
}
