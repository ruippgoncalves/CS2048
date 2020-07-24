"""URLS Definition"""
from django.urls import path

from . import views

app_name = "game"

urlpatterns = [
    path("", views.index, name="index"),

    path("game/play", views.play, name="playGame"),
    path("game/leaderboard", views.leaderboard, name="leaderboardGame"),

    path("users/create", views.create, name="createUser"),
    path("users/login", views.login_view, name="loginUser"),
    path("users/logout", views.logout_view, name="logoutUser")
]
