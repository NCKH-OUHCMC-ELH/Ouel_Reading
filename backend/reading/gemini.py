import google.generativeai as genai
import os
import json

GEMINI_API_KEY='AIzaSyCe_htygb68zsHoW8My5kwlx36VFrX_qtc'

class GeminiService:
    def __init__(self):
        api_key=GEMINI_API_KEY
        if not api_key:
            raise ValueError ("Vấn đề ờ khóa gemini")
        
        genai.configure(api_key=api_key)

        self.model=genai.GenerativeModel('gemini-pro') 
        
    def generate_similar_questions(self, passage, questions):
        questionData = ""
        for idx, q in enumerate(questions, 1):
            questionData += f"""
            Câu {idx}: {q['question']}
            A. {q['optionA']}
            B. {q['optionB']}
            C. {q['optionC']}
            D. {q['optionD']}
            Đáp án: {q['correctAnswer']}
            """
        
        prompt = f"""
        """
        
        try:
            return json.loads(self.model.generate_content(prompt))
        except Exception as e:
            return {"error": f"Không thể tạo câu hỏi mới: {str(e)}"}