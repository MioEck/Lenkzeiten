import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import https from 'https';
import http from 'http';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

const router = express.Router();

const FILE_ID = '1krPQwQ-SR-U-YFuNuQM2FKEJPfYQlUQf';

let pdfText = null;
let pdfLoaded = false;

function downloadFile(url, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) return reject(new Error('Zu viele Redirects'));
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, redirectCount + 1).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
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
    console.log(`PDF heruntergeladen: ${(buffer.length / 1024 / 1024).toFixed(1)} MB — Text wird extrahiert...`);
    const data = await pdfParse(buffer);
    pdfText = data.text;
    pdfLoaded = true;
    console.log(`PDF-Text extrahiert: ${pdfText.length} Zeichen (~${Math.round(pdfText.length / 4)} Tokens)`);
  } catch (err) {
    console.error('PDF konnte nicht geladen werden:', err.message);
  }
}

const SYSTEM_PROMPT = `Du bist ein rechtssicherer Experte für Lenk- und Ruhezeiten im Straßenverkehr.

Dir liegt der vollständige Textinhalt des Fachbuchs "Lenk- und Ruhezeiten im Straßenverkehr" von Götz Bopp und Frank Faßbender (Verlag Heinrich Vogel, 2022) vor.

REGELN FÜR DEINE ANTWORTEN:
1. Beantworte Fragen AUSSCHLIESSLICH auf Basis des beigefügten Buchtexts
2. Nenne immer den relevanten Artikel der EU-Verordnung (z.B. Art. 8 VO (EG) 561/2006)
3. Bei Unsicherheit: Schreibe "Bitte prüfe dies direkt in der Verordnung oder beim Fachexperten"
4. Erfinde NIEMALS Regeln oder Zahlen
5. Antworte auf Deutsch, verständlich für Berufsfahrer ohne Vorkenntnisse`;

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
  res.json({ loaded: pdfLoaded, chars: pdfText?.length || 0 });
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

  // System-Prompt: Anweisungen + gecachter Buchtext
  const systemPrompt = pdfText
    ? [
        { type: 'text', text: SYSTEM_PROMPT },
        {
          type: 'text',
          text: `Hier ist der vollständige Inhalt des Fachbuchs als Referenz:\n\n<buchtext>\n${pdfText}\n</buchtext>`,
          cache_control: { type: 'ephemeral' },
        },
      ]
    : SYSTEM_PROMPT;

  const messages = [
    ...conversationHistory.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: question },
  ];

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: systemPrompt,
      messages,
    });

    const answer = response.content[0]?.text || 'Keine Antwort erhalten.';
    res.json({ answer, pdfLoaded, usage: response.usage });
  } catch (err) {
    console.error('Anthropic API Fehler:', err);
    res.status(500).json({ error: 'Fehler bei der KI-Anfrage: ' + (err.message || 'Unbekannter Fehler') });
  }
});

export default router;
