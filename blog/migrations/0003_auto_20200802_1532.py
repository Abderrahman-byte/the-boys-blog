# Generated by Django 3.0.8 on 2020-08-02 15:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0002_auto_20200802_1034'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comment',
            old_name='User',
            new_name='author',
        ),
    ]
