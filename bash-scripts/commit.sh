#!/bin/bash

# Git commit script. Mofify as you please
# In this example, temp code is resetted followed by an autocommit of all changes and a push

git checkout src/dev/playground.ts
git commit -a
git push
