#!/bin/bash

# --------------------------------------------
# Gather variables
# --------------------------------------------
DIR=`dirname $0`
DIR=`realpath $DIR`
CONFIG=$1
if [ "$CONFIG" == "" ]; then
	CONFIG="./"
fi
. $CONFIG/env.sh
DEBUG_LOG_FILE=$NOTIFICATIONS_TMP-debug.txt

# --------------------------------------------
# Functions
# --------------------------------------------
function debug_log {
	if [ $NOTIFICATIONS_DEBUG -eq 1 ]; then
		echo "$1" >> $DEBUG_LOG_FILE
	fi
}

function show_notification {
	METHOD=$1
	MSG=$2

	if [ "$MSG" == "" ]; then
		return
	fi

	debug_log "" # Blank line
	if [ "$METHOD" == "kde-dialog" ]; then
		debug_log $'Dialog:\n'"$MSG"
		kdialog --msgbox "$MSG"
	elif [ "$METHOD" == "kde-popup" ]; then
		debug_log $'KDE popup:\n'"$MSG"
		kdialog --passivepopup "$MSG" "Notifications" $NOTIFICATIONS_TIMEOUT
	elif [ "$METHOD" == "notify-send" ]; then
		# Requires package libnotify-bin
		debug_log $'notify-send:\n'"$MSG"
		notify-send -t $NOTIFICATIONS_TIMEOUT "Notifications" "$MSG"
	elif [ "$METHOD" == "zenity" ]; then
		#  Requires package zenity
		debug_log $'zenity:\n'"$MSG"
		zenity --notification --window-icon=info --text "$MSG"
	else
		debug_log $'No method:\n'"$MSG"
	fi
}

# --------------------------------------------
# Debug switched on? Write debug information
# --------------------------------------------
if [ $NOTIFICATIONS_DEBUG -eq 1 ]; then
	rm -f $DEBUG_LOG_FILE # Remove last log if any
	debug_log "Environment vars"
	env | egrep 'DBUS|NOTIFICATIONS|XDG'>> $DEBUG_LOG_FILE
fi

# --------------------------------------------
# Run Node.js application to generate notification(s)
# --------------------------------------------
cd $DIR
$NODE_BIN/node \
	--preserve-symlinks \
	$DIR/index.mjs

# --------------------------------------------
# Show notification(s)
# --------------------------------------------
MSG=`cat $NOTIFICATIONS_TMP`
show_notification $NOTIFICATIONS_METHOD "$MSG"
if [ $NOTIFICATIONS_METHOD == "kde-dialog" ]; then
	# In case accidentally clicked away
	show_notification "notify-send" "$MSG"
fi

# --------------------------------------------
# For testing purposes
# --------------------------------------------
# show_notification "kde-dialog" "Dialog: Test message"
# show_notification "kde-popup" "Popup: Test message"
# show_notification "notify-send" "Notify-send: Test message"
# show_notification "zenity" "Zenity: Test message"
# show_notification "" "Test message"
