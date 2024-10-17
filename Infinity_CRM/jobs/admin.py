from django.contrib import admin
from .models import FeeType, Job,Project,Region,Client,POC,Agent,Submittal,SubmittalType,ClientType,JobType,ProjectStatusList,ClientStatusList,JobStatusList,Building,JobCycle,JobCycleType,PlanReview, UserProfile,JobScopeOfReview,PlanReviewDiscipline
# Register your models here.

class AgentAsmin(admin.ModelAdmin):
    list_display = ("title", "phoneNumber","fieldsOfExpertise","account")



admin.site.register(Job)
admin.site.register(Project)
admin.site.register(Region) 
admin.site.register(Client)
admin.site.register(POC)
admin.site.register(Agent,AgentAsmin)
admin.site.register(Submittal)
admin.site.register(SubmittalType)
admin.site.register(ClientType)
admin.site.register(JobType)
admin.site.register(ProjectStatusList)
admin.site.register(ClientStatusList)
admin.site.register(JobStatusList)
# admin.site.register(Permit)
admin.site.register(Building)
admin.site.register(JobCycle)
admin.site.register(FeeType)
admin.site.register(JobCycleType)
admin.site.register(PlanReview)
admin.site.register(UserProfile)
admin.site.register(JobScopeOfReview)
admin.site.register(PlanReviewDiscipline)


