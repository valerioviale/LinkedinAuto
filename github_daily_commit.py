import os
import datetime
from git import Repo

repo_path = '/Users/valerio/Desktop/Courses/LinkedinAuto'
repo = Repo(repo_path)


def commit_changes():
    index = repo.index
    index.add('*')
    current_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    commit_message = f'Daily commit - {current_time}'
    index.commit(commit_message)
