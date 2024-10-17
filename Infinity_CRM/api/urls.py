from django.urls import path, include
from .views import GETPOSTSampleAPI, GetUsersJobsAll,\
    JobCycleAPI, KidAPI, GETPOSTKidAPI, PutSampleCombinedAPI, JobStatusListAPI, KidOptionAPI, JobCycleListAPI, FeeTypeListAPI, ReviewersListAPI, ReviewStatusListAPI, DisciplinesListAPI

urlpatterns = [
    path("Getusersjobs/<int:pk>", GetUsersJobsAll.as_view()),
    path("GetSampleCombinedData/<int:pk>", PutSampleCombinedAPI.as_view()),
    path("JobCycle/<int:pk>", JobCycleAPI.as_view()),
    path("Sample/", GETPOSTSampleAPI.as_view()),
    path("Kid/<int:pk>", KidAPI.as_view()),
    path("Kid/", GETPOSTKidAPI.as_view()),
    path("KidOption/", KidOptionAPI.as_view()),
    path("jobStatusList/", JobStatusListAPI.as_view()),
    path("jobCycleList/", JobCycleListAPI.as_view()),
    path("feeTypeList/", FeeTypeListAPI.as_view()),
    path("ReviewersList/", ReviewersListAPI.as_view()),
    # path("ReviewStatusList/", ReviewStatusListAPI.as_view()),
    path("DisciplinesList/", DisciplinesListAPI.as_view()),
]
