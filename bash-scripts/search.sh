#!/bin/bash

# Script to recursively search for a string using grep
#
# Usage: /absolute/path/to/search.sh [<directory>]
# Paramater defaults to ./src. If using wildcards, surround it with quotes
#
# Will prompt for search string
#
# In ~/.bashrc you could add the alias:
# alias s="/abosolute/path/to/search.sh"
#    (s abbreviation for search)

echo "Input string to search for:"
read SEARCH

if [ "$SEARCH" = "" ]
then
	echo "Usage: /absolute/path/to/search.sh [<directory>]"
	exit 1
fi

if [ "$1" = "" ]
then
	PAR="./src"
else
	PAR=$1
fi

grep -inr --color "$SEARCH" $PAR

# Options:
# - i case insensitive
# - r recursive
# - n line number
