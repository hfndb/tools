#!/bin/bash

# Script to recursively search for a string using grep
#
# Usage: /absolute/path/to/search.sh [<directory>]  [<editor command>]
# Paramater defaults to ./src. If using wildcards, surround it with quotes
#
# Will prompt for search string
#
# In ~/.bashrc you could add the alias:
# alias s="/abosolute/path/to/search.sh"
#    (s abbreviation for search)

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
	echo "Usage: /absolute/path/to/search.sh [<directory>]  [<editor command>]"
	exit 1
fi

COLOR=never # never, always or auto

if [ "$EDITOR" = "" ]
then
	grep -inr --color=$COLOR "$SEARCH" $DIR*
	# Options:
	# - i case insensitive
	# - r recursive
	# - n line number
else
	RESULT=( $( grep -r -H "$SEARCH" $DIR* | sort -t: -u -k1,1 | cut -d: -f1 ) ) # Results to array
	# Grep:
	# - resursive (-r),
	# - get file names (-H)
	# Sort:
	# - use : as the delimiter (-t:),
	# - sort based on the first field only (-k1,1 - ),
	# - remove duplicates (-u)
	# Cut:
	# - delimiter (-d:),
	# - get first field, filename only (-f1)
	$EDITOR "${RESULT[@]/#/}" # Spread array to parameters
fi
