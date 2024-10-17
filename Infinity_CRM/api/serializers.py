from random import sample
from rest_framework import serializers
from jobs.models import JobCycle, PlanReview, JobStatusList, JobCycleType, FeeType, PlanReviewDiscipline
from .models import KidOption

class JobStatusListSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobStatusList
        fields = "__all__"


class KidOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = KidOption
        fields = "__all__"


class JobCycleSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobCycle
        fields = "__all__"
class JobCycleTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobCycleType
        fields = "__all__"

        order_by = (
                    ('id',) 
                    )

class FeeTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeType
        fields = "__all__"


class DisciplinesListSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanReviewDiscipline
        fields = "__all__"


class AgentSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='__str__')

    class Meta:
        model = FeeType
        fields = "__all__"


class PlanReviewSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    reviewer = serializers.CharField(source='reviewer.__str__')
    status = serializers.CharField(source='status.name')
    discipline = serializers.CharField(source='discipline.name')

    class Meta:
        model = PlanReview
        fields = '__all__'
        read_only_fields = ('jobcycleID',)

    def to_representation(self, instance):
        self.fields['jobcycleID'] = JobCycleSerializer(read_only=True)
        return super(PlanReviewSerializer, self).to_representation(instance)


class PlanReviewCombinedSerializer(serializers.ModelSerializer):
    reviewer = serializers.CharField(source='reviewer.__str__')
    status = serializers.CharField(source='status.name')

    class Meta:
        model = PlanReview
        fields = "__all__"


class JobCycleCombinedSerializer(serializers.ModelSerializer):
    Plan_reviews = PlanReviewSerializer(many=True, required=False)
    status = serializers.CharField(source='status.name')
    type = serializers.CharField(source='type.name')
    typeId = serializers.CharField(source='type.id')
    # feeType = serializers.CharField(source='feeType.__str__')

    class Meta:
        model = JobCycle
        fields = "__all__"


class JobCyclePostSerializer(serializers.ModelSerializer):
    Plan_reviews = PlanReviewSerializer(many=True, required=False)

    class Meta:
        model = JobCycle
        fields = "__all__"

    def create(self, validated_data):
        sample = JobCycle.objects.create(**validated_data)
        if 'planreview' in validated_data:
            kids = validated_data.pop('planreview')
            for kid in kids:
                PlanReview.objects.create(**kid, sample=sample)
        return sample

    def update(self, instance, validated_data):
        planreviews = validated_data.pop('planreview')
        instance.status = validated_data.get("status", instance.status)
        instance.type = validated_data.get("type", instance.type)
        instance.dateReceived = validated_data.get(
            "dateReceived", instance.dateReceived)
        instance.dueDate = validated_data.get("dueDate", instance.dueDate)
        instance.dateOut = validated_data.get("dateOut", instance.dateOut)
        instance.feeType = validated_data.get("feeType", instance.feeType)
        instance.billingStatus = validated_data.get(
            "billingStatus", instance.billingStatus)
        instance.completionStatus = validated_data.get(
            "completionStatus", instance.completionStatus)
        instance.evaluation = validated_data.get(
            "evaluation", instance.evaluation)
        instance.taskCode = validated_data.get("taskCode", instance.taskCode)
        instance.save()
        keep_PlanReviews = []
        for kid in planreviews:
            if "id" in kid.keys():
                if PlanReview.objects.filter(id=PlanReview["id"]).exists():
                    k = PlanReview.objects.get(id=PlanReview["id"])
                    k.status = PlanReview.get("status", k.status)
                    k.reviewer = PlanReview.get("reviewer", k.reviewer)
                    k.discipline = PlanReview.get("discipline", k.discipline)
                    k.hours = PlanReview.get("hours", k.hours)
                    k.save()
                    keep_PlanReviews.append(k.id)
                else:
                    continue
            else:
                k = PlanReview.objects.create(**kid, sample=instance)
                keep_PlanReviews.append(k.id)

        for kid in instance.kids.all():
            if kid.id not in keep_PlanReviews:
                kid.delete()

        return instance


class PlanReviewPostSerializer(serializers.ModelSerializer):
    Plan_reviews = PlanReviewSerializer(many=True, required=False)

    class Meta:
        model = PlanReview
        fields = "__all__"

    def create(self, validated_data):
        sample = PlanReview.objects.create(**validated_data)
        return sample

    def update(self, instance, validated_data):
        instance.status = validated_data.get("status", instance.status)
        instance.reviewer = validated_data.get("reviewer", instance.reviewer)
        instance.discipline = validated_data.get(
            "discipline", instance.discipline)
        instance.completionStatus = validated_data.get(
            "completionStatus", instance.completionStatus)
        instance.hours = validated_data.get(
            "hours", instance.hours)
        instance.save()
        return instance
