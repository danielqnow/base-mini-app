export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

type AnalysisResult = {
  refactoredCode: string;
  summary: string;
  unitTests: string;
};

export async function POST(request: Request) {
  try {
    const { code, language } = await request.json();

    if (!code || !language) {
      return NextResponse.json({ error: 'Missing code or language' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    const prompt = `
Actúa como un desarrollador experto en criptografía post-cuántica, seguridad informática y compiladores. Tu tarea es refactorizar el siguiente código para que sea resistente a ataques cuánticos.

Análisis del Código:
- Lenguaje: ${language}
- Código Fuente:
\`\`\`${String(language || '').toLowerCase()}
${code}
\`\`\`

Instrucciones:
1. Analiza el código y detecta algoritmos criptográficos clásicos vulnerables (RSA, ECC/ECDSA, AES, SHA-256, etc).
2. Selecciona alternativas PQC NIST:
   - KEM: CRYSTALS-Kyber.
   - Firmas: CRYSTALS-Dilithium o Falcon (menciona SPHINCS+ si aplica).
3. Refactoriza el código para usar librerías PQC (p. ej., liboqs), con imports necesarios. El resultado debe ser ejecutable y sintácticamente válido.
4. Genera un resumen claro en Markdown con mapeo clásico → PQC y justificación.
5. Crea pruebas unitarias para la nueva lógica PQC (generación de claves, encapsulación/decapsulación o firma/verificación).

Devuelve tu respuesta exclusivamente en formato JSON con el siguiente esquema:
{
  "refactoredCode": "string con el código completo",
  "summary": "string en Markdown",
  "unitTests": "string con pruebas unitarias"
}
No incluyas nada fuera del JSON.
    `.trim();

    const resp = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + encodeURIComponent(apiKey), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }]}],
        generationConfig: {
          response_mime_type: 'application/json',
        },
      }),
    });

    if (!resp.ok) {
      const err = await resp.text().catch(() => '');
      return NextResponse.json({ error: err || 'Gemini API error' }, { status: 502 });
    }

    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    let parsed: AnalysisResult | null = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      // Try to recover if the model wrapped JSON in code fences
      const match = String(text).match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      if (match) {
        parsed = JSON.parse(match[1]);
      }
    }

    if (!parsed?.refactoredCode || !parsed?.summary || !parsed?.unitTests) {
      return NextResponse.json({ error: 'Invalid response shape from model' }, { status: 500 });
    }

    return NextResponse.json(parsed, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 });
  }
}
