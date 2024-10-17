from email.policy import default
from pydoc import describe
from pyexpat import model
# from turtle import mode
from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username

# Regions model


class Region(models.Model):
    name = models.CharField(max_length=50)
    fullName = models.CharField(max_length=60)

    def __str__(self):
        return self.name

# Clients model


class Client(models.Model):
    name = models.CharField(max_length=50)
    code = models.CharField(max_length=50)
    type = models.ForeignKey(
        "ClientType", on_delete=models.SET_NULL, null=True)
    address = models.CharField(max_length=100)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    zipcode = models.IntegerField()
    regionID = models.ForeignKey(
        "Region", on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name


class Project(models.Model):
    name = models.CharField(max_length=50)
    code = models.CharField(max_length=50)
    clientID = models.ForeignKey("Client", on_delete=models.CASCADE, null=True)
    status = models.ForeignKey(
        "ProjectstatusList", on_delete=models.SET_NULL, null=True)
    #jobID = models.ForeignKey("Job", on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name

 # Point of Contact


class POC(models.Model):
    firstName = models.CharField(max_length=50)
    lastName = models.CharField(max_length=50)
    phoneNumber = models.IntegerField()
    email = models.EmailField()
    address = models.CharField(max_length=100)
    company = models.CharField(max_length=50)
    title = models.CharField(max_length=50)
    client = models.ForeignKey(
        "Client", on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        info = ""
        if self.company:
            info += f'{self.company}-'
        info += f'{self.firstName}{self.lastName}'
        return info


class Agent(models.Model):
    # firstName = models.CharField(max_length=50)
    # lastName = models.CharField(max_length=50)
    phoneNumber = models.IntegerField()
    # email = models.EmailField()
    fieldsOfExpertise = models.CharField(max_length=50, null=True, blank=True)
    title = models.CharField(max_length=50, null=True, blank=True)
    account = models.OneToOneField(
        UserProfile, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        # return f'{self.account.user.first_name} {self.account.user.last_name}'
        #  return str(self.phoneNumber)
        return str(self.title)


class Submittal (models.Model):
    jobID = models.ForeignKey("Job", on_delete=models.SET_NULL, null=True)
    submittalType = models.ForeignKey(
        "SubmittalType", on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return str(self.submittalType)


class SubmittalType(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class ClientType(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class JobType(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class ProjectStatusList(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class ClientStatusList(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class JobStatusList(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return str(self.id) + " " + str(self.name)


class FeeType(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name
        # return str(self.id) + " " + self.name


class JobCycleType(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class JobScopeOfReview(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class PlanReviewDiscipline(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return str(self.id) + " " + str(self.name)

# each job cycle has multiple planreviews


class JobCycle(models.Model):
    status = models.ForeignKey(
        "JobStatusList", on_delete=models.SET_NULL, blank=True, null=True)
    type = models.ForeignKey("JobCycleType", on_delete=models.SET_NULL,
                             related_name="Job_Cycle_Type", blank=True, null=True)
    dateReceived = models.DateField(blank=True, null=True)
    dueDate = models.DateField(blank=True, null=True)
    dateOut = models.DateField(blank=True, null=True)
    feeType = models.ForeignKey(
        "FeeType", related_name="Cycle_Fee_Type", on_delete=models.SET_NULL, blank=True, null=True)
    fee = models.IntegerField(blank=True, null=True)
    billingStatus = models.BooleanField(blank=True, null=True)
    completionStatus = models.BooleanField(blank=True, null=True)
    deliveredBy = models.CharField(max_length=50, blank=True, null=True)
    evaluation = models.FloatField(blank=True, null=True)
    # taskCode = models.CharField(max_length=50)
    jobID = models.ForeignKey(
        "Job", on_delete=models.SET_NULL, blank=True, null=True, related_name="JobInfo")

    def __str__(self):
        return "Job Cycle" + str(self.id)

    @property
    def Plan_reviews(self):
        return self.Plan_reviews_set.all()
        # plan reviews has 3 connection plan reviewer, status and discipline they are  connected to a job cycle which itself is connected to to a job


class PlanReview(models.Model):
    reviewer = models.ForeignKey(
        "Agent", on_delete=models.SET_NULL, null=True, related_name="Plan_reviewer")
    hours = models.IntegerField(default=0)
    discipline = models.ForeignKey(
        "PlanReviewDiscipline", on_delete=models.SET_NULL, null=True)
    status = models.ForeignKey(
        "JobStatusList", on_delete=models.SET_NULL, null=True)
    completionStatus = models.BooleanField(null=True, blank=True)

    jobcycleID = models.ForeignKey(
        "JobCycle", on_delete=models.CASCADE, related_name="Plan_reviews", blank=True, null=True)
    completed = models.BooleanField(blank=True, null=True, default=False)

    def __str__(self):
        return "planreview" + str(self.id)


# class Permit(models.Model):
#     permitNumber =  models.CharField(max_length=50, null=True)
#     #jobID = models.ForeignKey("Job", on_delete=models.SET_NULL, null=True)
#     finaledDate =models.DateField()
#     issuedDate =models.DateField()
#     issuedBy = models.ForeignKey("Agent", on_delete=models.SET_NULL, null=True,related_name="Issued_By",default="pn1")
#     issuedTo = models.ForeignKey("Agent", on_delete=models.SET_NULL, null=True,related_name="Issued_To")
#     designer = models.ForeignKey("Agent", on_delete=models.SET_NULL, null=True,related_name="Designer")
#     buildingOfficial = models.ForeignKey("Agent", on_delete=models.SET_NULL, null=True,related_name="Building_Official")
#     fireMarshal = models.ForeignKey("Agent", on_delete=models.SET_NULL, null=True,related_name="Fire_Marshal")
#     creationDate = models.DateField(auto_now_add=True)
#     updatedBy = models.ForeignKey("Agent", on_delete=models.SET_NULL, null=True,related_name="Updated_By")
#     def __str__(self):
#         return self.permitNumber

class Building(models.Model):
    jobID = models.ForeignKey("Job", on_delete=models.SET_NULL, null=True)
    area = models.FloatField()
    allowableArea = models.FloatField()
    height = models.FloatField()
    use = models.CharField(max_length=50)
    stories = models.CharField(max_length=50)
    highRise = models.BooleanField()
    autosprinkler = models.BooleanField()
    coverage = models.BooleanField()
    otherBuilding = models.CharField(max_length=50)
    data = models.CharField(max_length=50)

    def __str__(self):
        return str(self.pk)


class Job(models.Model):
    region = models.ForeignKey(
        "Region", on_delete=models.CASCADE, null=True, blank=True)
    client = models.ForeignKey(
        "Client", on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=50, blank=True)
    tags = models.CharField(max_length=50, blank=True)
    code = models.CharField(max_length=50)
    relatedProject = models.ManyToManyField(
        "Project", related_name="RelatedProject", blank=True)
    # CAAN = models.CharField(max_length=50,blank=True)
    projectID = models.ForeignKey(
        "Project", on_delete=models.CASCADE, null=True, blank=True)
    jobValuation = models.FloatField(blank=True, null=True)
    taskCode = models.CharField(max_length=50, blank=True, null=True)
    # permitNumber = models.OneToOneField("Permit", on_delete=models.SET_NULL, null=True)
    permitNumber = models.CharField(max_length=50, null=True, blank=True)
    # reviewers = models.ManyToManyField("Agent",related_name="Reviewers",blank=True)
    scopeofreview = models.ManyToManyField(
        "JobScopeOfReview", related_name="scopeofreview", blank=True)
    POC = models.ForeignKey(
        "POC", on_delete=models.SET_NULL, null=True, blank=True)
    JobType = models.ForeignKey(
        "JobType", on_delete=models.SET_NULL, null=True, blank=True)
    # submitDate = models.DateField(auto_now_add=True) # this line is commented becuase there is rescieved date in job cycle
    # submitBy = models.ForeignKey("Agent", on_delete=models.SET_NULL, null=True,related_name="Submitted_By")
    # acceptedBy = models.ForeignKey("Agent", on_delete=models.SET_NULL, null=True,related_name="Accepted_By")
    # AErecord = models.IntegerField(blank=True,null=True)
    # cycleID = models.ManyToManyField("JobCycle", related_name="JobInfo",blank=True,null=True)
    # TODO: a cycle should be created automatically once a job being created
    feeType = models.ForeignKey(
        "FeeType", related_name="Fee_Type", blank=True, null=True, on_delete=models.SET_NULL)
    BPRfee = models.CharField(max_length=50, blank=True, null=True)
    clientfee = models.CharField(max_length=50, blank=True, null=True)
    address = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    state = models.CharField(max_length=50, blank=True, null=True)
    zipcode = models.IntegerField(blank=True, null=True)
    expeditionStatus = models.BooleanField(
        blank=True, null=False, default=False)
    # RegionID = models.ForeignKey("region",on_delete=models.SET_NULL,blank=True,null=True)

    def __str__(self):
        return self.name


class SampleOption (models.Model):
    option_name = models.CharField(max_length=300)

    def __str__(self):
        return str(self.id) + " " + str(self.option_name)


class KidOption (models.Model):
    option_name = models.CharField(max_length=300)

    def __str__(self):
        return str(self.id) + " " + str(self.option_name)
