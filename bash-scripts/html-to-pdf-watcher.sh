#!/bin/bash

# -------------------------------------------------------------------------
# Script to watch a directory with .html files and auto-generate .pdf files
#
# Pre-condition:
# - inotify-tools installed
#     apt get install inotify-tools
# - wkhtmltopdf installed. Don't use the repository version, but
#     patched version of downloaded from https://wkhtmltopdf.org/downloads.html
#
# Usage: /absolute/path/to/watcher-html-to-pdf.sh <directory path>
# -------------------------------------------------------------------------

DIR_TO_WATCH=$1
PDF_PATH="" # return value of function set_pdf_path

function set_pdf_path {
	FILE_IN=$1
	PDF_DIR=`dirname $FILE_IN`
	PDF_STEM=`basename $FILE_IN | cut -d'.' -f1`
	PDF_PATH=$PDF_DIR/$PDF_STEM.pdf
}

# ------------
# Code from
# https://github.com/hfndb/tools/blob/master/bash-scripts/pdf-from-source.sh
# though a little reconstructed and encapsulated in a function
# ------------
function create_pdf {
	FILE_IN=$1
	MARGIN="10mm"

	set_pdf_path $FILE_IN

	echo "Creating PDF file $PDF_PATH..."
		wkhtmltopdf -q \
		-s A4 \
		--encoding UTF-8 \
		-B $MARGIN -T $MARGIN \
		-L $MARGIN -R $MARGIN \
		$FILE_IN $PDF_PATH
}


# inotify detects changes, but which file exactly?
function check_for_changes {
	find $DIR_TO_WATCH -maxdepth 1 -mindepth 1 -type f -iname "*.html" | while read HTML_PATH; do
		set_pdf_path $HTML_PATH
		if [ $HTML_PATH -nt $PDF_PATH ];
		then
			echo "$HTML_PATH is changed, generating fresh .pdf file"
 			create_pdf $HTML_PATH
		fi
	done
}

echo "Start watching dir $DIR_TO_WATCH"
while inotifywait -qr -e modify \
	--format 'Changed: %w%f' \
	$DIR_TO_WATCH; do
	# inotifywait will also log changed swap files,
	# but function check_for_changes will ignore that
	check_for_changes
done
