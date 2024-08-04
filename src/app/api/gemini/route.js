
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(req) {
  try {
    const { imageBlob } = await req.json(); 
    console.log('Received imageBlob:', imageBlob); 

    const prompt = "ONLY state the name of the object in the photo with no other words in the output. Output example: Orange";
    const image = {
      inlineData: {
        data: imageBlob,
        mimeType: 'image/jpeg',
      },
    };

    const result = await model.generateContent([prompt, image]);
    console.log('API Response from model:', result); 

    return new Response(JSON.stringify({ description: result.response.text()}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error analyzing image:', error);
    return new Response(JSON.stringify({ error: 'Error analyzing image' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
