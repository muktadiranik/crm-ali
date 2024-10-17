"""Infinity_CRM URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from jobs.views import Dashboard, ProjectsDeleteView, ProjectsListView, ClientsListView, ProjectsCreateView, ClientsCreateView, ProjectsUpdateView, ClientsUpdateView,\
    ProjectsDetailView, ClientsDetailView, ClientsDeleteView, Report, create_job_code
from django.contrib.auth.views import LoginView, LogoutView


admin.site.site_header = 'My admin'
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('djoser.urls')),
    path('api/v1/', include('djoser.urls.authtoken')),
    path("api/", include("api.urls")),
    path('jobs/', include('jobs.urls', namespace="jobs")),
    path('projects/', ProjectsListView.as_view(), name="projects-list"),
    path('projects/create', ProjectsCreateView.as_view(), name="projects-create"),
    path('projects/update/<int:pk>',
         ProjectsUpdateView.as_view(), name="projects-update"),
    path('projects/delete/<int:pk>',
         ProjectsDeleteView.as_view(), name="projects-delete"),
    path('projects/detail/<int:pk>',
         ProjectsDetailView.as_view(), name="projects-detail"),
    path('clients/', ClientsListView.as_view(), name="clients-list"),
    path('clients/create', ClientsCreateView.as_view(), name="clients-create"),
    path('clients/update/<int:pk>',
         ClientsUpdateView.as_view(), name="clients-update"),
    path('clients/delete/<int:pk>',
         ClientsDeleteView.as_view(), name="clients-delete"),
    path('clients/detail/<int:pk>',
         ClientsDetailView.as_view(), name="clients-detail"),
    # path('workload/', WorkloadListView.as_view(),name="workload-list"),
    path('report/', Report, name="report"),
    path('createjobcode/', create_job_code, name="createjobcode"),
    path('login/', LoginView.as_view(), name="login"),
    path('logout/', LogoutView.as_view(), name="logout"),
    path('dashboard', Dashboard),
    path('', Dashboard),
]
