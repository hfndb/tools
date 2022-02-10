#!/bin/bash

# Script using vim to create syntax highlighted PDF from source file.
#
# Pre-condition:
# - function ExportToHtml in .vimrc, see ../vim/vimrc
# - wkhtmltopdf installed
#
# Usage: /absolute/path/to/pdf-from-source.sh <file?
#

FILE_IN=$1
FILE_OUT=/tmp/output.pdf
vim -c 'call ExportToHtml()' $FILE_IN

echo "Creating PDF file $FILE_OUT..."
wkhtmltopdf -q \
	-s A4 \
	--encoding UTF-8 \
	-L 10mm -R 10mm  \
	/tmp/exported.html $FILE_OUT
