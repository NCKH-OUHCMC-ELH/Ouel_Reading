from .models import Part, Question, PartHistory,PartType
from django.shortcuts import get_object_or_404
from django.db.models import Count

def get_random_part_type(type:str) -> Part:
    if type in PartType.values:
        part= Part.objects.filter(type_part=type).order_by('?').first()
    if part:
        return part
    raise ValueError({'error': 'Không có part nào'})

def get_random_part() -> Part:
    part= Part.objects.order_by('?').first()
    if part:
        return part
    raise ValueError({'error': 'Không có part nào'})

def get_part_by_id(part_id: int) -> Part:
    return Part.objects.get(id=part_id)

def get_type_parts(type:str)->Part:
    if type not in PartType.values:
        raise ValueError({"error": "Type không hợp lệ"})
    parts = Part.objects.filter(type_part=type).annotate(question_count=Count("question"))
    if parts:
        return parts
    # raise ValueError({'error': 'Không có part nào'})
    return None

def get_questions_by_part(part: Part) -> Question:
    return Question.objects.filter(part=part)