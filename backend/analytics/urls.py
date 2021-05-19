from django.conf.urls import url, include
from rest_framework import routers

from analytics.views import EventViewSet

app_name = "analytics"

router = routers.DefaultRouter(trailing_slash=False)
router.register(r"event", EventViewSet, basename="events")

urlpatterns = [
    url(r"", include(router.urls)),
]
