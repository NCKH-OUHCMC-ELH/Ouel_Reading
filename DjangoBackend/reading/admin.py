# from .admin import admin_site
import json
from django.contrib import admin
from .models import Part,Question
admin.site.register(Part)
admin.site.register(Question)
