from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsMnemonicAuthor(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.method in SAFE_METHODS
            or view.kwargs.get("pk") is None
            or request.user == view.get_object().expression.author
        )


class IsExpressionAuthor(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.method in SAFE_METHODS
            or view.kwargs.get("pk") is None
            or request.user == view.get_object().author
        )
