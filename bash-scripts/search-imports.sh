#!/bin/bash

# Script to recursively search for imports using grep
#
# Usage: /absolute/path/to/search-imports.sh [<directory>]  [<editor command>]
# Paramater defaults to ./src. If using wildcards, surround it with quotes
#
# Will prompt for search string
#
# In ~/.bashrc you could add the alias:
# alias si="/abosolute/path/to/search-imports.sh"
#    (si abbreviation for search imports)

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
	echo "Usage: /absolute/path/to/search-imports.sh [<directory>]  [<editor command>]"
	exit 1
fi

COLOR=never # never, always or auto

if [ "$EDITOR" = "" ]
then
	grep -inr import $DIR* | grep -i --color=$COLOR "$SEARCH"
	# Options:
	# - i case insensitive
	# - r recursive
	# - n line number
else
	RESULT=( $( grep -inr -H import $DIR* | grep -i "$SEARCH" | cut -d: -f1 | sort -u ) ) # Results to array
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

	if [ ${#RESULT[*]} -gt 0 ]; then
		$EDITOR "${RESULT[@]/#/}" # Spread array to parameters
	else
		echo "Import '$SEARCH' not found in $DIR"
	fi
fi
