# Generated by Django 3.1.1 on 2020-10-12 11:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_auto_20201002_2357'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='AppUsers',
            new_name='AppUser',
        ),
    ]
