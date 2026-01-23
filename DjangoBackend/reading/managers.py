from .models import PartHistory, UserAnswer, Part
from typing import List

def submit_part_history(*,data: dict,part:Part) -> PartHistory:
    part_history = PartHistory.objects.create(
        part=part,
        user_id=data['user_id'],
        total_answers=data['total_answers'],
        correct_answers=data['correct_answers'],
        score=data['score'],
        time=data['time'],
    )

    UserAnswer.objects.bulk_create([
        UserAnswer(part_history=part_history, **ans)
        for ans in data['answers']
    ])

    # for ans in data['answers']:
    # UserAnswer.objects.create(
    #     part_history=part_history,
    #     **ans
    # )

    return part_history