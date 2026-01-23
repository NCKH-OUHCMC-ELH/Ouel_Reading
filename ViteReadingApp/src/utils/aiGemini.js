// import { GoogleGenAI } from "@google/genai";
// const genAI = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

// export async function getHighlightFromGemini(passage,question) {

//     if (!passage || !question) {
//         console.error("Data gửi gemini bị rỗng.");
//     }

//     const prompt = `
//        You are a reading comprehension text extraction expert. Your task is to find the consecutive and complete text range in the provided Passage that suggests the answer to the Question.

//         Passage:
//         "${passage}"

//         Question:
//         "${question}"

//         Your task:
//         1. Identify the most accurate consecutive text range that suggests the correct answer in the passage.
//         2. Calculate the start and end index based on the characters of the extracted text compared to the provided Passage above.
//         3. Output only one JSON object.

//         The JSON format must be strictly followed:
//         {
//         "answerText": "exact suggested text range copied from the Passage",
//         "startIndex": number,
//         "endIndex": number
//         }

//         Rules:
//         - Do not add, delete or change any characters in "answerText". The text in "answerText" must exactly match the Paragraph section and have at least 2 sentences.
//         - Do not return additional text outside of JSON.
//     `;
//     try{ 
//          const response = await genAI.models.generateContent({
//             model: "gemini-2.5-flash",
//             contents: [{ role: "user", parts: [{ text: prompt }] }],
//             config: {
//                 responseMimeType: "application/json",
//             }
//         });
//         const text=response.text.trim().replace(/```json/g, '').replace(/```/g, '').trim();
//         const highlightObject = JSON.parse(text);
//         return highlightObject
//     } catch (err) {
//         console.error("Lỗi khi gọi Gemini:", err);
//         return [];
//     }
// }