import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI, { ClientOptions } from 'openai'; // Import ClientOptions from 'openai'
import { openAIApiKey } from '../lib/openai/config';

// export async function POST(request: NextApiRequest, response: NextApiResponse) {
//     const openai = new OpenAI({ apiKey: openAIApiKey } as ClientOptions); // Pass the apiKey as an object
//     const prompt = request.body.prompt;

//     return response.json({ completion: completion.data.choices[0].text });
// }