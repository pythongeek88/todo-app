from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from .models import CustomUser

class CustomUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = CustomUser
        fields = ('email',)  # only use email field

class CustomUserCreationForm(UserCreationForm):

    class Meta(UserCreationForm.Meta):
        model = CustomUser
        fields = ('email',)  # only use email field

    def clean_username(self):
        return self.cleaned_data['email'] 

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    fieldsets = UserAdmin.fieldsets
    list_display = ['email', 'is_staff']
    ordering=['email']