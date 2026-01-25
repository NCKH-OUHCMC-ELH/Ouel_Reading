# from .admin import admin_site
import json
from django.contrib import admin
from .models import Tag,TagExam,TagLevel,TagPart,Exam,Part,Question,PartHistory,UserAnswer
admin.site.register(Tag)
admin.site.register(TagExam)
admin.site.register(TagLevel)
admin.site.register(TagPart)
admin.site.register(Exam)
admin.site.register(Part)
admin.site.register(Question)
admin.site.register(PartHistory)
admin.site.register(UserAnswer)



