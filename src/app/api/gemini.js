import { GoogleGenerativeAI } from '@google/generative-ai';
import { Buffer } from 'buffer';


const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { imageBlob } = req.body; 

     
      const prompt = "Describe this image";
      const image = {
        inlineData: {
          data: imageBlob,
          mimeType: 'image/jpeg',
        },
      };

     
      const result = await model.generateContent([prompt, image]);

      res.status(200).json({ description: result.response.text });
    } catch (error) {
      console.error('Error analyzing image:', error);
      res.status(500).json({ error: 'Error analyzing image' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
