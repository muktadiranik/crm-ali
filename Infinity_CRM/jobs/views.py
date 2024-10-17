from django.shortcuts import render, redirect, reverse
from django.http import HttpResponse
from django.views.generic import ListView, DeleteView, CreateView, DetailView, UpdateView
from jobs.models import Job, Project, Client, JobCycle, PlanReview, Agent
from django.contrib.auth.mixins import LoginRequiredMixin
from .forms import JobModelForm, JobModelCreateForm
from django.contrib.auth.decorators import login_required
from .filters import JobFilter
from datetime import date


# Test
def indexView(request, *args, **kwargs):
    # notice the template used here
    return render(request, "jobs/index.html", context={"sampleid": 1})

# Project


class ProjectsListView (LoginRequiredMixin, ListView):
    queryset = Project.objects.all()
    extra_context = {'tag': "projects"}


class ProjectsDetailView (LoginRequiredMixin, DetailView):
    template_name = "jobs/project_detail.html"
    model = Project
    fields = '__all__'

    def get_success_url(self):
        return reverse("projects-list")


class ProjectsCreateView(LoginRequiredMixin, CreateView):
    template_name = "jobs/form_create.html"
    queryset = Project.objects.none()
    model = Project
    fields = '__all__'

    def get_success_url(self):
        return reverse("projects-list")


class ProjectsUpdateView(LoginRequiredMixin, UpdateView):
    template_name = "jobs/form_create.html"
    model = Project
    fields = '__all__'

    def get_success_url(self):
        return reverse("projects-list")


class ProjectsDeleteView(LoginRequiredMixin, DeleteView):
    template_name = "jobs/form_delete.html"
    # model = Project
    # fields = '__all__'
    queryset = Project.objects.all()

    def get_success_url(self):
        return reverse("projects-list")


# Client
class ClientsListView (LoginRequiredMixin, ListView):
    queryset = Client.objects.all()
    extra_context = {'tag': "clients"}


class ClientsDetailView (LoginRequiredMixin, DetailView):
    queryset = Client.objects.all()
    extra_context = {'tag': "clients"}


class ClientsCreateView(LoginRequiredMixin, CreateView):
    template_name = "jobs/form_create.html"
    queryset = Client.objects.none()
    model = Client
    fields = '__all__'

    def get_success_url(self):
        return reverse("clients-list")


class ClientsUpdateView(LoginRequiredMixin, UpdateView):
    template_name = "jobs/form_create.html"
    model = Client
    fields = '__all__'

    def get_success_url(self):
        return reverse("clients-list")


class ClientsDeleteView(LoginRequiredMixin, DeleteView):
    template_name = "jobs/form_delete.html"
    # model = Client
    # fields = '__all__'
    queryset = Client.objects.all()

    def get_success_url(self):
        return reverse("clients-list")


class ClientsListView (LoginRequiredMixin, ListView):
    queryset = Client.objects.all()
    extra_context = {'tag': "clients"}


# Job Views
class JobsListView (LoginRequiredMixin, ListView):
    queryset = Job.objects.all()  # .select_related('project')
    extra_context = {'tag': "jobs"}
    context_object_name = "Job"

# Plan Review Views


class WorkloadListView (LoginRequiredMixin, ListView):
    queryset = JobCycle.objects.all()  # .select_related('project')


class JobDetailView(LoginRequiredMixin, DetailView):
    template_name = "jobs/job_detail.html"
    job = Job.objects.all()

    def get_context_data(self, **kwargs):
        context = super(JobDetailView, self).get_context_data(
            **kwargs)  # get the default context data
        context['sampleid'] = 1  # add extra field to the context
        return context

    def get_success_url(self):
        return reverse("jobs:job-list")

    # return render(request, "jobs/index.html",context)  # notice the template used here


class JobCreateView(LoginRequiredMixin, CreateView):
    template_name = "jobs/job_create.html"
    queryset = Job.objects.none()
    model = Job
    # fields = '__all__'
    form_class = JobModelForm
    # def form_valid(self, form):
    #     #objects
    #     if self.object.checked == True:
    #         object_id = self.object.id
    #         return HttpResponseRedirect(self.archive_calc(object_id)) # you never return a `HttpResponse`
    #     #save  -- If this is where you are saving... you can store the value from archive and return it after saving

    def get_success_url(self):
        return reverse('jobs:jobs-update', kwargs={'pk': self.object.pk})

    def get_form_kwargs(self, *args, **kwargs):
        kwargs = super(JobCreateView, self).get_form_kwargs(
            *args, **kwargs)
        return kwargs


class JobUpdateView(LoginRequiredMixin, UpdateView):
    template_name = "jobs/job_update.html"
    queryset = Job.objects.all()
    model = Job
    # fields = '__all__'
    form_class = JobModelForm
    # sampleId = request.user
    # print(sampleId)

    def get_context_data(self, **kwargs):
        context = super(JobUpdateView, self).get_context_data(
            **kwargs)  # get the default context data
        # print(context["object"].id)
        # add extra field to the context
        context['sampleid'] = context["object"].id
        return context

    def get_success_url(self):
        return reverse("jobs:job-list")


class JobDeleteView(LoginRequiredMixin, DeleteView):
    template_name = "jobs/form_delete.html"
    queryset = Job.objects.all()

    def get_success_url(self):
        return reverse("jobs:job-list")


def Report(request):
    jobs = Job.objects.all()
    # projects = jobs.Project_set.all()
    # clients = jobs.Client_set.all()
    myFilter = JobFilter(request.GET, queryset=jobs)
    jobs = myFilter.qs
    context = {'jobs': jobs, 'myFilter': myFilter}
    return render(request, 'jobs/report.html', context)


@login_required
def load_clients(request):
    region_id = request.GET.get('region')
    clients = Client.objects.filter(regionID=region_id).order_by('name')
    return render(request, 'jobs/clients_dropdown.html', {'Clients': clients})


@login_required
def create_job_code(request):
    clientID = request.GET.get('client')
    clients = Client.objects.filter(id=clientID)
    clientsCount = Job.objects.filter(client=clientID).count()
    print(clientsCount)
    taskCode = str(clients.first().code) + "-" + \
        str(date.today().year)[-2:] + "-" + str(clientsCount+1).zfill(4)
    return render(request, 'jobs/jobcode_input.html', {'code': taskCode})


@login_required
def Dashboard(request):
    try:
        agentObj = Agent.objects.get(account__user__pk=request.user.id)
    except:
        agentObj = None
    jobCycleList = JobCycle.objects.filter(Plan_reviews__reviewer=agentObj).filter(
        Plan_reviews__completionStatus=False)
    # obj = a.JobInfo.first()
    context = {
        "object_list": jobCycleList
    }
    if request.user.is_authenticated:
        return render(request, "jobs/home.html", context=context)
    else:
        return render(request, "registration/login.html")
