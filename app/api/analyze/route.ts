import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: { message: 'Missing OPENAI_API_KEY' } },
        { status: 500 }
      );
    }
    if (!code || typeof code !== 'string') {
      return Response.json(
        { error: { message: 'Missing or invalid "code" in request body' } },
        { status: 400 }
      );
    }

    // Choose a supported model. Ensure the ID exists for your account.
    const result = await streamText({
      model: openai('gpt-4o-mini'),
      messages: [
        { role: 'system', content: 'You are a security-focused code refactor assistant.' },
        { role: 'user', content: `Analyze and refactor the following ${language || 'code'} for post-quantum security concerns:\n\n${code}` },
      ],
    });

    // Stream back properly shaped response
    return result.toAIStreamResponse();
  } catch (err) {
    // If the provider returned HTML or an unexpected payload, surface it here
    const message =
      err instanceof Error ? err.message : 'Unknown error communicating with the model';
    return Response.json({ error: { message } }, { status: 500 });
  }
}
