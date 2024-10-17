
from dataclasses import field
from pyexpat import model
from django import forms
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm, UsernameField
from .models import Job, Agent, Project, Client
from crispy_forms.bootstrap import Field
from crispy_forms.layout import Layout,Submit
from crispy_forms.helper import FormHelper
User = get_user_model()

class JobModelCreateForm(forms.ModelForm):
   class Meta:
      model=Job
      fields = '__all__'
   def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['client'].widget.attrs['disabled'] = 'disabled'  
class JobModelForm(forms.ModelForm):
      class Meta:
         model = Job
         fields = ["region",
        "client",
        "name",
        "description",
        "tags",
        "code",
        "relatedProject",
        "projectID",
        "permitNumber",
        "POC",
        "JobType",
      #   "submitBy",
      #   "acceptedBy",
        "feeType",
        "address",
        "city",
        "state",
        "zipcode",
        "expeditionStatus",
        "clientfee",
        "BPRfee",
        "jobValuation",
        "taskCode",
        "scopeofreview"
        ]

      def __init__(self, *args, **kwargs):
         super().__init__(*args, **kwargs)
         manually_rendered_fields = ['code', 'client','region']
         all_other_fields = [f.name for f in Job._meta.get_fields() if f.name not in manually_rendered_fields]
         # self.fields['client'].queryset = Client.objects.none()
         codeField = ""

         if 'region' in self.data:
            try:
                Region_id = int(self.data.get('region'))
                self.fields['client'].queryset = Client.objects.filter(regionID=Region_id).order_by('name')
                codeField = Field('code',id="id_code")
            except (ValueError, TypeError):
                print(ValueError)  # invalid input from the client; ignore and fallback to empty client queryset
         else:
            self.fields['client'].queryset = Client.objects.all()
            self.fields['code'].initial = 'Will be generated automatically'
            codeField = Field('code',id="id_code",readonly=True)
            print("bye")
         self.fields['expeditionStatus'].label = "Expedited?"
         self.fields['code'].label = " Job Number"
         self.fields['name'].label = " Job Name"
         self.fields['name'].label = " Job Name"
         self.fields['clientfee'].label = "Client Plan Check Fee"
         self.fields['BPRfee'].label = "BPR Fee"
         self.fields['jobValuation'].label = "Valuation"
         self.fields['taskCode'].label = "Task Code"
         self.fields['scopeofreview'].label = "Scope of Review"
         self.fields['description'].widget = forms.Textarea(attrs={'rows':2,'cols':20})
         self.helper = FormHelper()
         self.helper.layout = Layout(Field('region',id="id_region"), Field('client',id="id_client"),codeField,*all_other_fields,Submit('submit', u'Submit', css_class='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'))
         self.helper.use_custom_control = True



   # name = forms.CharField(max_length=30)
#     def clean_first_name(self):
#         data = self.cleaned_data["first_name"]
#         # if data != "Joe":
#         #     raise ValidationError("Your name is not Joe")
#         return data

#     def clean(self):
#         pass
#         # first_name = self.cleaned_data["first_name"]
#         # last_name = self.cleaned_data["last_name"]
#         # if first_name + last_name != "Joe Soap":
#         #     raise ValidationError("Your name is not Joe Soap")



# class LeadForm(forms.Form):
#     first_name = forms.CharField()
#     last_name = forms.CharField()
#     age = forms.IntegerField(min_value=0)


# class CustomUserCreationForm(UserCreationForm):
#     class Meta:
#         model = User
#         fields = ("username",)
#         field_classes = {'username': UsernameField}


# class AssignAgentForm(forms.Form):
#     agent = forms.ModelChoiceField(queryset=Agent.objects.none())

#     def __init__(self, *args, **kwargs):
#         request = kwargs.pop("request")
#         agents = Agent.objects.filter(organisation=request.user.userprofile)
#         super(AssignAgentForm, self).__init__(*args, **kwargs)
#         self.fields["agent"].queryset = agents


# class LeadCategoryUpdateForm(forms.ModelForm):
#     class Meta:
#         model = Lead
#         fields = (
#             'category',
#         )


# class CategoryModelForm(forms.ModelForm):
#     class Meta:
#         model = Category
#         fields = (
#             'name',
#         )


# class FollowUpModelForm(forms.ModelForm):
#     class Meta:
#         model = FollowUp
#         fields = (
#             'notes',
#             'file'
#         )
