from .models import Part, Question, PartHistory
from django.shortcuts import get_object_or_404

def get_random_part() -> Part:
    part= Part.objects.order_by('?').first()
    if part:
        return part
    return ValueError({'error': 'Không có part nào'}, status=404)

from django.shortcuts import get_object_or_404


def get_part_by_id(part_id: int) -> Part:
    return Part.objects.get(id=part_id)

def get_questions_by_part(part: Part) -> Question:
    return Question.objects.filter(part=part)