from rest_framework import viewsets
from analytics.models import Event
from analytics.serializers import EventSerializer
from rest_framework import status
from rest_framework.response import Response


class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    queryset = Event.objects.all()
    http_method_names = ["post"]

    def create(self, request, *args, **kwargs):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )
