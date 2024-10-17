from atexit import register
from django.contrib import admin

from .models import Kid, KidOption, Sample, SampleOption

# Register your models here.

admin.site.register(Sample)
admin.site.register(Kid)
admin.site.register(SampleOption)
admin.site.register(KidOption)