#!/bin/bash

# Script replace strings in a file recursively
#
# Usage: /absolute/path/to/replace.sh [<directory>]
# DIRamater defaults to ./src. If using wildcards, surround it with quotes
#
# Will prompt for search and replace string
#
# In ~/.bashrc you could add the alias:
# alias r="/abosolute/path/to/replace.sh"
#    (r abbreviation for replace)

echo "Input string to search for:"
read SEARCH

if [ "$SEARCH" = "" ]
then
	echo "Usage: /absolute/path/to/replace.sh [<directory>]"
	exit 1
fi

if [ "$1" = "" ]
then
	DIR="./src"
else
	DIR=$1 # Wildcards will be expanded by shell, assume usage of wildcards
fi

grep -inr --color "$SEARCH" $DIR/*

echo "Replace $SEARCH with:"
read REPLACE

if [ "$REPLACE" = "" ]
then
	exit 1
fi

grep -ilr "$SEARCH" $DIR/* | xargs sed -i "s/$SEARCH/$REPLACE/g"
