#!/bin/bash

# Script to recursively search for a string using grep and open found files in gvim
#
# Usage: /absolute/path/to/search-open.sh [<directory>]
# Paramater defaults to ./src. If using wildcards, surround it with quotes
#
# Will prompt for search string
#
# In ~/.bashrc you could add the alias:
# alias so="/abosolute/path/to/search-open.sh"
#    (so abbreviation for search open)

echo "Input string to search for:"
read SEARCH

if [ "$SEARCH" = "" ]
then
	echo "Usage: /absolute/path/to/search-open.sh [<directory>]"
	exit 1
fi

if [ "$1" = "" ]
then
	PAR="./src"
else
	PAR=$1
fi

TARGETS=$(grep -iHrl "$SEARCH" $PAR)

# Copy of gvim-tabs.sh
gvim --remote-silent $TARGETS
