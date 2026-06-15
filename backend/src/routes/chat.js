import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import https from 'https';
import http from 'http';

const router = express.Router();

const FILE_ID = '1krPQwQ-SR-U-YFuNuQM2FKEJPfYQlUQf';

// PDF wird einmal beim Start geladen und gecacht
let pdfBase64 = null;
let pdfLoaded = false;

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Redirect folgen
        return downloadFile(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

export async function loadPDF() {
  if (pdfLoaded) return;
  try {
    console.log('PDF wird von Google Drive geladen...');
    const url = `https://drive.google.com/uc?export=download&id=${FILE_ID}&confirm=t`;
    const buffer = await downloadFile(url);
    pdfBase64 = buffer.toString('base64');
    pdfLoaded = true;
    console.log(`PDF geladen: ${(buffer.length / 1024 / 1024).toFixed(1)} MB`);
  } catch (err) {
    console.error('PDF konnte nicht geladen werden:', err.message);
  }
}

const SYSTEM_PROMPT = `Du bist ein rechtssicherer Experte für Lenk- und Ruhezeiten im Straßenverkehr.

Dir liegt das vollständige Fachbuch "Lenk- und Ruhezeiten im Straßenverkehr" von Götz Bopp und Frank Faßbender (Verlag Heinrich Vogel, 2022) als Dokument vor.

WICHTIGE REGELN FÜR DEINE ANTWORTEN:
1. Beantworte Fragen AUSSCHLIESSLICH auf Basis des beigefügten Buchinhalts
2. Zitiere immer die relevante EU-Verordnung (z.B. Art. 4 VO (EG) 561/2006) oder die Buchseite
3. Bei Unsicherheit: Schreibe explizit "Bitte prüfe dies mit einem Fachexperten oder direkt in der Verordnung"
4. Erfinde NIEMALS Regeln oder Zahlen — nur was im Buch steht
5. Antworte immer auf Deutsch
6. Erkläre verständlich, als ob du einem Berufsfahrer erklärst der die Regeln noch nicht kennt`;

router.get('/topics', (_req, res) => {
  res.json([
    { id: 'tageslenk', title: 'Tageslenkezeit', emoji: '🕐', summary: 'Max. 9h pro Tag, 2x/Woche bis 10h', color: 'orange' },
    { id: 'wochenlenk', title: 'Wochenlenkezeit', emoji: '📅', summary: 'Max. 56h/Woche, 90h in 2 Wochen', color: 'blue' },
    { id: 'ruhezeiten', title: 'Ruhezeiten', emoji: '😴', summary: 'Mind. 11h täglich, 45h wöchentlich', color: 'green' },
    { id: 'chat', title: 'Fragen stellen', emoji: '💬', summary: 'KI-Assistent auf Basis des Fachbuchs', color: 'purple', link: '/chat' },
    { id: 'sonder', title: 'Sonderregelungen', emoji: '⚡', summary: '12-Tage-Regel, Bus-Ausnahmen', color: 'red' },
    { id: 'bussgelder', title: 'Bußgelder', emoji: '💶', summary: 'Sanktionen und Strafen', color: 'gray' },
  ]);
});

router.get('/pdf-status', (_req, res) => {
  res.json({ loaded: pdfLoaded });
});

router.post('/chat', async (req, res) => {
  const { question, conversationHistory = [] } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Frage fehlt oder ungültig.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API-Schlüssel nicht konfiguriert.' });
  }

  const client = new Anthropic({ apiKey });

  // Erste Nachricht enthält das PDF-Dokument
  let messages;
  if (pdfBase64 && conversationHistory.length === 0) {
    // Neues Gespräch: PDF als erstes Dokument mitschicken
    messages = [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: pdfBase64,
            },
            title: 'Lenk- und Ruhezeiten im Straßenverkehr (Bopp/Faßbender, 2022)',
            cache_control: { type: 'ephemeral' },
          },
          {
            type: 'text',
            text: question,
          },
        ],
      },
    ];
  } else if (pdfBase64 && conversationHistory.length > 0) {
    // Folgenachrichten: History + neue Frage (PDF ist schon im Kontext)
    messages = [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: pdfBase64,
            },
            title: 'Lenk- und Ruhezeiten im Straßenverkehr (Bopp/Faßbender, 2022)',
            cache_control: { type: 'ephemeral' },
          },
          {
            type: 'text',
            text: conversationHistory.map(m => `${m.role === 'user' ? 'Frage' : 'Antwort'}: ${m.content}`).join('\n\n') + '\n\nNeue Frage: ' + question,
          },
        ],
      },
    ];
  } else {
    // Fallback: Kein PDF verfügbar
    messages = [
      ...conversationHistory.map((msg) => ({ role: msg.role, content: msg.content })),
      { role: 'user', content: question + '\n\n(Hinweis: Das Referenzdokument konnte nicht geladen werden. Bitte wichtige Angaben selbst in der EU-VO 561/2006 prüfen.)' },
    ];
  }

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages,
      betas: pdfBase64 ? ['pdfs-2024-09-25'] : [],
    });

    const answer = response.content[0]?.text || 'Keine Antwort erhalten.';
    res.json({ answer, pdfLoaded, usage: response.usage });
  } catch (err) {
    console.error('Anthropic API Fehler:', err);
    res.status(500).json({ error: 'Fehler bei der KI-Anfrage: ' + (err.message || 'Unbekannter Fehler') });
  }
});

export default router;
