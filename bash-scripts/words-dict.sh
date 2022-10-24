#!/bin/bash

# ------------------------------------------------------------------
# Script to search an aspell dictionary in another way than aspell
#
# Usage: words-dict.sh <language code <search for>
# ------------------------------------------------------------------


# ------------------------------
# Environment variables
# ------------------------------
# tmp dir for dictionaries, doesn't need backup
if [ -d /data ]; then
	DICT_DIR=/data/words-dict
else
	DICT_DIR=/opt/words-dict
fi

LANG=$1
DICT=words.$LANG.txt
LOG=/tmp/words.txt
SEARCH_FOR=$2
SEARCH_FOR_LOWER=${SEARCH_FOR,,} # Search string in lower case
SEARCH_FOR_UPPER=${SEARCH_FOR^^} # Search string in upper case

# ------------------------------
# Check parameters
# ------------------------------
if [ "$LANG" == "" ] || [ "$SEARCH_FOR" == "" ]; then
	echo "Usage: words-dict.sh <language code <search for>"
	exit 1
fi

# ------------------------------
# Check for and possibly create dictionary
# ------------------------------
if [ ! -d $DICT_DIR ]; then
	mkdir $DICT_DIR
fi

if [ ! -f $DICT_DIR/$DICT ]; then
	aspell -d $LANG dump master | aspell -l $LANG expand > $DICT_DIR/$DICT
fi

# ------------------------------
# Functions
# ------------------------------
press_enter() {
  echo ""
  echo "Results also written to $LOG"
  echo ""
  echo -n "	Press Enter to continue "
  read
  clear
}

search_simple() {
	grep -i $1 $DICT_DIR/$DICT | sort | tee $LOG
}

search_containing() {
	grep -E "^[$SEARCH_FOR_LOWER$SEARCH_FOR_UPPER]+$" $DICT_DIR/$DICT | sort | tee $LOG
}

until [ "$SELECTION" = "0" ]; do
  clear
  echo ""
  echo -e "  Search dictionary $LANG for $SEARCH_FOR"
  echo ""
  echo    "    1  -  Word contains"
  echo    "    2  -  Word begins with"
  echo    "    3  -  Word ends with"
  echo    "    4  -  Word is exact match (= occurs in dictionary)"
  echo    "    5  -  Words only containing characters as in search string"
  echo ""
  echo    "      Exit: Press ctrl-c or enter"
  echo ""
  echo -n "  Enter selection: "
  read SELECTION
  echo ""
  case $SELECTION in
    1  ) clear ; search_simple "$SEARCH_FOR";   press_enter ;;
    2  ) clear ; search_simple "^$SEARCH_FOR";  press_enter ;;
    3  ) clear ; search_simple "$SEARCH_FOR$";  press_enter ;;
    4  ) clear ; search_simple "^$SEARCH_FOR$"; press_enter ;;
    5  ) clear ; search_containing;             press_enter ;;
    *  ) exit ;;
  esac
done


# ------------------------------
# Notes
# ------------------------------

# Language codes: cs de en_GB en_US nl

# Check one word
#   aspell --ignore-case --lang=en_US -a

# Output sound like words
#   aspell soundslike
