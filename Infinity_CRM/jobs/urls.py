from django.urls import path, include
from jobs.views import JobsListView, JobDetailView, JobUpdateView, JobDeleteView, JobCreateView, indexView, load_clients
app_name = "jobs"
urlpatterns = [
    path('', JobsListView.as_view(), name="job-list"),
    path('detail/<int:pk>', JobDetailView.as_view(), name="jobs-detail"),
    path('update/<int:pk>', JobUpdateView.as_view(), name="jobs-update"),
    path('delete/<int:pk>', JobDeleteView.as_view(), name="jobs-delete"),
    path('create/', JobCreateView.as_view(), name="job-create"),
    path('test/', indexView),
    path('ajax/load-clients/', load_clients, name='ajax_load_clients'),
]
