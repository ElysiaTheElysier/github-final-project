from django.shortcuts import render, get_object_or_404
from .models import Course, Lesson, Question, Choice, Submission

def submit(request, course_id):
    # submit implementation
    pass

def show_exam_result(request, course_id, submission_id):
    # show result implementation
    pass
