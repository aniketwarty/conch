import { NextRequest, NextResponse } from 'next/server';
import { model } from '../../lib/gemini/gemini';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
    const prompt = headers().get("prompt") ?? "Say 'no prompt given'";
    const result = (await model.generateContent(prompt)).response.text();

    return NextResponse.json({data: result}, {status: 200});
}