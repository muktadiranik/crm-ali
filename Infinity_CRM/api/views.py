from random import sample
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import KidOptionSerializer, JobCycleSerializer, JobCycleCombinedSerializer, JobCyclePostSerializer,\
    JobStatusListSerializer, PlanReviewSerializer, FeeTypeSerializer, JobCycleTypeSerializer, AgentSerializer, PlanReviewPostSerializer, PlanReviewCombinedSerializer, DisciplinesListSerializer
from .models import Sample, Kid, KidOption
from rest_framework import permissions
from rest_framework import status
from jobs.models import JobStatusList, JobCycleType, FeeType, JobCycle, Agent, PlanReview
from jobs.models import PlanReviewDiscipline


class JobStatusListAPI(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        options = JobStatusList.objects.all()
        serialized_data = JobStatusListSerializer(options, many=True)
        return Response(serialized_data.data)


class JobCycleListAPI(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        options = JobCycleType.objects.all()
        serialized_data = JobCycleTypeSerializer(options, many=True)
        return Response(serialized_data.data)


class FeeTypeListAPI(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        options = FeeType.objects.all()
        serialized_data = FeeTypeSerializer(options, many=True)
        return Response(serialized_data.data)


class ReviewersListAPI(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        options = Agent.objects.all()
        serialized_data = AgentSerializer(options, many=True)
        return Response(serialized_data.data)


class ReviewStatusListAPI(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        options = JobStatusList.objects.all()
        serialized_data = FeeTypeSerializer(options, many=True)
        return Response(serialized_data.data)


class DisciplinesListAPI(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # options = FeeType.objects.all()
        options = PlanReviewDiscipline.objects.all()
        serialized_data = FeeTypeSerializer(options, many=True)
        return Response(serialized_data.data)


class KidOptionAPI(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        options = KidOption.objects.all()
        serialized_data = KidOptionSerializer(options, many=True)
        return Response(serialized_data.data)


class GetUsersJobsAll(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        sample = JobCycle.objects.filter(jobID=pk)
        serialized_data = JobCycleCombinedSerializer(sample, many=True)
        return Response(serialized_data.data)

    def post(self, request):
        serializer = JobCycleCombinedSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        serializer = JobCycleCombinedSerializer(request.data)


class PutSampleCombinedAPI(APIView):
    permissions = [permissions.AllowAny]

    def get_object(self, pk):
        objs = Sample.objects.all().filter(pk=pk)
        return objs

    def put(self, request, pk):
        obj = self.get_object(pk).first()

        serializer = JobCyclePostSerializer(obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GETPOSTSampleAPI(APIView):

    permission_classes = [
        permissions.AllowAny
    ]

    def get(self, request):

        obj = JobCycle.objects.all()
        serializer = JobCycleSerializer(obj, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = JobCyclePostSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JobCycleAPI(APIView):
    permission_classes = [permissions.AllowAny]

    def get_object(self, pk):
        objs = JobCycle.objects.all().filter(pk=pk)
        return objs

    def get(self, request, pk):
        objs = self.get_object(pk)
        serializer = JobCycleSerializer(objs, many=True)
        return Response(serializer.data)

    def put(self, request, pk):
        obj = self.get_object(pk).first()
        serializer = JobCycleSerializer(obj, request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
            # sample = JobCycle.objects.filter(jobID=request.data['jobID'])
            # serialized_data = PlanReviewCombinedSerializer(sample, many=True)
            # return Response(serialized_data.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        obj = self.get_object(pk)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class GETPOSTKidAPI(APIView):

    permission_classes = [
        permissions.AllowAny
    ]

    def get(self, request):
        obj = PlanReview.objects.all()
        serializer = PlanReviewSerializer(obj, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PlanReviewPostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):

        obj = self.get_object(pk).first()
        serializer = PlanReviewSerializer(obj, request.data)
        if serializer.is_valid():
            serializer.save()
            # return Response(serializer.data)
            sample = JobCycle.objects.filter(jobID=request.data['jobcycleID'])
            serialized_data = PlanReviewSerializer(sample, many=True)
            return Response(serialized_data.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class KidAPI(APIView):
    permission_classes = [permissions.AllowAny]

    def get_object(self, pk):
        objs = PlanReview.objects.all().filter(pk=pk)
        return objs

    def get(self, request, pk):
        objs = self.get_object(pk)
        serializer = PlanReviewSerializer(objs, many=True)
        return Response(serializer.data)

    def put(self, request, pk):
        obj = self.get_object(pk).first()

        serializer = PlanReviewPostSerializer(obj, request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        obj = self.get_object(pk)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
