"""Views"""
import json

from math import log2

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.db import IntegrityError
from django.http import JsonResponse, HttpResponseRedirect
from django.urls import reverse

from .models import User, Game

# Index --------------------------------------------------------


def index(request):
    """Index Page"""
    if request.method != "GET":
        return JsonResponse({"error": "GET request required"}, status=405)

    # view
    return render(request, "index.html")

# Game ---------------------------------------------------------


@login_required(login_url="game:loginUser")
def play(request):
    """Play Page"""
    if request.method != "GET":
        return JsonResponse({"error": "GET request required"}, status=405)

    # view
    return render(request, "game/play.html", {"nav": "play"})


@csrf_exempt
@login_required(login_url="game:loginUser")
def leaderboard(request):
    """LeaderBoard Page"""
    if request.method != "POST" and request.method != "GET":
        return JsonResponse({"error": "POST or GET request required"}, status=405)

    if request.method == "POST":
        content = json.loads(request.body)
        value = content.get("value")
        time = content.get("time")

        value = round(log2(value) - 10)

        # Check if caule is valid
        if value > 6 or value < 1:
            return JsonResponse({"error": "Invalid Value"}, status=400)

        # Add to DB
        game = Game()
        game.user = request.user
        game.max_value = value
        game.time = time
        game.save()
        return JsonResponse({"saved": True}, status=201)

    # view
    return render(request, "game/leaderboard.html", {
        "nav": "leaderboard",
        "content": [content.serialize() for content in Game.objects.order_by("-max_value", "time")]
    })

# Users --------------------------------------------------------


def create(request):
    """Create Account"""
    if request.method != "POST" and request.method != "GET":
        return JsonResponse({"error": "POST or GET request required"}, status=405)

    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "users/create.html", {
                "nav": "create",
                "message": "Passwords must match"
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "users/create.html", {
                "nav": "create",
                "message": "Username already taken"
            })

        # Login the user and redirect
        login(request, user)
        return HttpResponseRedirect(reverse("game:index"))

    # view
    return render(request, "users/create.html", {"nav": "create"})


def login_view(request):
    """Login View"""
    if request.method != "POST" and request.method != "GET":
        return JsonResponse({"error": "POST or GET request required"}, status=405)

    if request.method == "POST":
        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("game:index"))

        return render(request, "users/login.html", {
            "nav": "login",
            "message": "Invalid username and/or password."
        })

    # view
    return render(request, "users/login.html", {"nav": "login"})


def logout_view(request):
    """LogOut"""
    if request.method != "GET":
        return JsonResponse({"error": "GET request required"}, status=405)

    logout(request)
    return HttpResponseRedirect(reverse("game:index"))
