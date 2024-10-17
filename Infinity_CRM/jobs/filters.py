import django_filters
from .models import *
from crispy_forms.bootstrap import Field
from crispy_forms.layout import Layout,Submit
from crispy_forms.helper import FormHelper
class JobFilter(django_filters.FilterSet):
    # region = ModelChoiceFilter(queryset=Region.objects.all())
    # client = ModelChoiceFilter(queryset=Client.objects.all())
    # project = ModelChoiceFilter(queryset=Project.objects.all())

    class Meta:
        model =  Job
        fields =  '__all__'
        