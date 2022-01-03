#!/bin/bash

# Script a recursive, case insensitive search for a file with a certain name using wildcards
#
# Usage: /absolute/path/to/search-file.sh [<directory>] [<editor command>]
# Paramater defaults to ./src. If using wildcards, surround it with quotes
#
# Will prompt for search string
#
# In ~/.bashrc you could add the alias:
# alias sf="/abosolute/path/to/search-file.sh"
#    (sf abbreviation for search file, not science fiction)

if [ "$1" = "" ]
then
	DIR="./src/"
else
	DIR=$1
fi
EDITOR=$2

echo "Input string to search for:"
read SEARCH

if [ "$SEARCH" = "" ]
then
	echo "Usage: /absolute/path/to/search-file.sh [<directory>] [<editor command>]"
	exit 1
fi


if [ "$EDITOR" = "" ]
then
	find $DIR -iname "*$SEARCH*" -type f
else
	RESULT=( $( find $DIR -iname "*$SEARCH*" -type f ) ) # Results to array
	$EDITOR "${RESULT[@]/#/}" # Spread array to parameters
fi
