from django.db import models

# Create your models here.


class Sample(models.Model):
    status = models.BooleanField()
    options = models.CharField(max_length=300)
    name1 = models.CharField(max_length=300)
    name2 = models.CharField(max_length=300)
    name3 = models.CharField(max_length=300)
    name4 = models.CharField(max_length=300)

    def __str__(self):
        return "Sample" + str(self.id)

    @property
    def kids(self):
        return self.kids_set.all()


class Kid(models.Model):
    status = models.BooleanField()
    options = models.CharField(max_length=300)
    name1 = models.CharField(max_length=300)
    name2 = models.CharField(max_length=300)
    name3 = models.CharField(max_length=300)
    name4 = models.CharField(max_length=300)
    sample = models.ForeignKey(
        Sample, blank=False, on_delete=models.CASCADE, related_name="kids")

    def __str__(self):
        return "Kid" + str(self.id)
class SampleOption (models.Model):
    option_name = models.CharField(max_length=300)

    def __str__(self):
        return str(self.id) + " " + self.option_name


class KidOption (models.Model):
    option_name = models.CharField(max_length=300)

    def __str__(self):
        return str(self.id) + " " + self.option_name