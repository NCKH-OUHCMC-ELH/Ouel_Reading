import json
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from reading.models import Passage, Question, UserAnswer,QuizAttempt
from reading import serializers
from google import genai
import os
from rest_framework.decorators import api_view
from rest_framework import status

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

class PassageViewSet(viewsets.ModelViewSet, generics.ListAPIView):
    queryset = Passage.objects.all()
    serializer_class = serializers.PassageSerializer
    @action(methods=['get'], url_name='questions', detail=True)
    def questions(self,request,pk):
        questions=self.get_object().question_set.all()
        return Response(serializers.QuestionSerializer(questions,many=True,context={'request':request}).data, status=status.HTTP_200_OK)

    @action(methods=['get'],detail=False)
    def random(self, request):
        passage = Passage.objects.order_by('?').first()
        if not passage:
            return Response({'error': 'Không có passage nào'}, status=404)
        return Response(serializers.PassageSerializer(passage).data)

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = serializers.QuestionSerializer


@api_view(["POST"])
def highlight_view(request):
    data = request.data
    passage = data.get("passage")
    question = data.get("question")

    if not passage or not question:
        return Response({"error": "passage or question missing"}, status=status.HTTP_400_BAD_REQUEST)

    prompt = f"""
    You are an AI powered answer suggestion system. Your task is to find the consecutive and complete text range in the provided Passage that suggests the answer to the Question.

    Passage:
    "{passage}"

    Question:
    "{question}"

    Your task:
    1. Identify the most accurate consecutive text range that suggests the correct answer in the passage.
    2. Calculate the start and end index based on the characters of the extracted text compared to the provided Passage above.
    3. Output only one JSON object.

    The JSON format must be strictly followed:
    {{
        "answerText": "exact suggested text range copied from the Passage",
        "startIndex": number,
        "endIndex": number
    }}

    Role:
    - Do not add, delete or change any characters in "answerText". The text in "answerText" must exactly match the Paragraph section and have at least 2 sentences.
    - Do not return additional text outside of JSON.
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash", 
            contents=prompt
        )
        text = response.text.strip().replace("```json", "").replace("```", "").strip()
        highlight_object = json.loads(text)
        return Response(highlight_object)
    except Exception as e:
        print("Lỗi khi gọi Gemini:", e)
        return Response({"error": "Gemini API error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)