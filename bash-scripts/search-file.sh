#!/bin/bash

# Script a recursive, case insensitive search for a file with a certain name using wildcards
#
# Usage: /absolute/path/to/search-file.sh [<directory>]
# Paramater defaults to ./src. If using wildcards, surround it with quotes
#
# Will prompt for search string
#
# In ~/.bashrc you could add the alias:
# alias sf="/abosolute/path/to/search-file.sh"
#    (s abbreviation for search file, not sciencd fiction)

echo "Input string to search for:"
read SEARCH

if [ "$SEARCH" = "" ]
then
	echo "Usage: /absolute/path/to/search-file.sh [<directory>]"
	exit 1
fi

if [ "$1" = "" ]
then
	DIR="./src/*"
else
	DIR=$1
fi

find ./src -iname "$SEARCH"
