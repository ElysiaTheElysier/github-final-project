from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from .models import Course, Lesson, Question, Choice, Submission, Enrollment

def submit(request, course_id):
    course = get_object_or_404(Course, pk=course_id)
    # Get or create an enrollment for this request to satisfy models
    enrollment, created = Enrollment.objects.get_or_create(course=course)
        
    submission = Submission.objects.create(enrollment=enrollment)
    for key, value in request.POST.items():
        if key.startswith('choice_'):
            choice_id = value
            choice = Choice.objects.get(pk=choice_id)
            submission.choices.add(choice)
    submission.save()
    return redirect(reverse('onlinecourse:show_exam_result', args=(course.id, submission.id)))

def show_exam_result(request, course_id, submission_id):
    course = get_object_or_404(Course, pk=course_id)
    submission = get_object_or_404(Submission, pk=submission_id)
    score = 0
    for question in course.question_set.all():
        selected_ids = [choice.id for choice in submission.choices.all() if choice.question == question]
        if question.is_get_score(selected_ids):
            score += question.grade
    
    context = {
        'course': course,
        'submission': submission,
        'score': score
    }
    return render(request, 'onlinecourse/exam_result_bootstrap.html', context)
