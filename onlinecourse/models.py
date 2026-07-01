from django.db import models
from django.conf import settings

class Course(models.Model):
    name = models.CharField(max_length=200)

class Lesson(models.Model):
    title = models.CharField(max_length=200)

class Enrollment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

class Question(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    question_text = models.CharField(max_length=200)
    grade = models.IntegerField(default=5)
    
    def is_get_score(self, selected_ids):
        all_answers = self.choice_set.filter(is_correct=True).count()
        selected_correct = self.choice_set.filter(is_correct=True, id__in=selected_ids).count()
        if all_answers == selected_correct:
            return True
        else:
            return False

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    is_correct = models.BooleanField(default=False)

class Submission(models.Model):
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE)
    choices = models.ManyToManyField(Choice)
    
    def __str__(self):
        return f"Submission {self.id} for enrollment {self.enrollment.id}"

class Instructor(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    full_time = models.BooleanField(default=True)
    total_learners = models.IntegerField(default=0)

class Learner(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    occupation = models.CharField(choices=[('student', 'Student'), ('developer', 'Developer'), ('data_scientist', 'Data Scientist'), ('dba', 'Database Admin')], max_length=20)
    social_link = models.URLField(max_length=200)
