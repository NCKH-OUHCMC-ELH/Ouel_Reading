import json
from rest_framework import viewsets, status, generics,permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Part, Question, UserAnswer,PartHistory
from . import serializers, selectors, managers
from google import genai
import os
from rest_framework import status

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

class PartViewSet(viewsets.ModelViewSet):
    queryset = Part.objects.all()
    serializer_class = serializers.PartSerializer

    @action(methods=['get'], url_name='questions', detail=True)
    def questions(self, request, pk):
        part = selectors.get_part_by_id(pk)
        questions = selectors.get_questions_by_part(part)
        return Response(serializers.QuestionSerializer(questions, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['get'], url_name='random', detail=False)
    def random(self, request):
        part = selectors.get_random_part()
        return Response(serializers.PartSerializer(part).data, status=status.HTTP_200_OK)
    

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = serializers.QuestionSerializer


class GeminiViewSet(viewsets.ViewSet):
    @action(methods=['post'],url_name='highlight', detail=False)
    def highlight(self, request): 
        passage = request.data.get("passage")
        question = request.data.get("question")

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

        Rule:
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
    

class PartHistoryViewSet(viewsets.ViewSet):
    queryset = Part.objects.all()
    serializer_class = serializers.PartHistorySerializer

    @action(methods=['post'], detail=False, url_path='submit')
    def submit(self, request):
        serializer = serializers.PartHistorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        print(request.data)
        part = selectors.get_part_by_id(data['part'].id)
        part_history = managers.submit_part_history(
            part=part,
            data=data
        )
        return Response(serializers.PartHistorySerializer(part_history).data,status=status.HTTP_201_CREATED)