from django.db import models
from cloudinary.models import CloudinaryField

class PartType(models.TextChoices):
    complete_the_sentence='complete_the_sentence'
    complete_the_paragraph='complete_the_paragraph'
    reading_comprehension='reading_comprehension'

class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True,null=True)
    updated_date = models.DateTimeField(auto_now=True,null=True)

    class Meta:
        abstract = True
        ordering = ['-updated_date']

class TagModel(BaseModel):
    name = models.CharField(max_length=100)

    class Meta:
        abstract = True
        ordering = ['-id']

    def __str__(self):
        return self.name

class Tag(TagModel):
    pass

class TagExam(TagModel):
    pass

class TagLevel(TagModel):
    pass

class TagPart(TagModel):
    pass
    
class Exam(BaseModel):
    name=models.CharField(max_length=100)
    time=models.IntegerField()
    description = models.TextField(blank=True, null=True)
    tag_exams = models.ManyToManyField(TagExam, blank=True)
    tag_levels = models.ManyToManyField(TagLevel, blank=True)

    def __str__(self):
        return self.name
    
class Part(BaseModel):
    name=models.CharField(max_length=100,null=True,blank=True)
    content = models.TextField(blank=True, null=True)
    image = CloudinaryField(null=True, blank=True)
    type_part=models.CharField(max_length=100,choices=PartType.choices,default=PartType.reading_comprehension)
    exam=models.ForeignKey(Exam,on_delete=models.CASCADE,null=True,blank=True)
    tag_parts = models.ForeignKey(TagPart,on_delete=models.CASCADE,null=True,blank=True)
    tag=models.ManyToManyField(Tag, blank=True)
    def __str__(self):
        return self.name


class Question(BaseModel):
    part = models.ForeignKey(Part, on_delete=models.CASCADE,null=True,blank=True)
    question_text = models.CharField(max_length=225)
    option_a = models.CharField(max_length=225)
    option_b = models.CharField(max_length=225)
    option_c = models.CharField(max_length=225)
    option_d = models.CharField(max_length=225)
    correct_answer = models.CharField(
        max_length=1,
        choices=[
            ('A','Lựa chọn A'),
            ('B','Lựa chọn B'),
            ('C','Lựa chọn C'),
            ('D','Lựa chọn D')
        ]
    )
    explanation = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.question_text
    
    # class Meta:
    #     unique_together = (('question_text', 'part'),)

class PartHistory(BaseModel):
    part = models.ForeignKey(Part, on_delete=models.CASCADE)
    user_id = models.IntegerField()
    total_answers = models.IntegerField()
    correct_answers = models.IntegerField()
    score = models.DecimalField(max_digits=5, decimal_places=2)
    time=models.IntegerField()
    
    def __str__(self):
        return str(self.score)

class UserAnswer(BaseModel):
    part_history = models.ForeignKey(PartHistory,on_delete=models.CASCADE,null=True,related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE,null=True)
    user_answer = models.CharField(max_length=1,null=True)
    is_correct = models.BooleanField()

    def __str__(self):
        return self.user_answer or ""
