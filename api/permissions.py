from rest_framework import permissions

class IsStaffOrReadOnly(permissions.BasePermission) :
    def has_permission(self, request, view) :
        print('Has permission called')

        if request.method in permissions.SAFE_METHODS :
            return True
        
        return bool(request.user.is_staff)

class IsOwnerOrReadOnly(permissions.BasePermission) :
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return bool((obj.author == request.user) or request.user.is_superuser)