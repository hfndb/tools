# Email

A little system to organize the flow of writing, checking and sending email.

## Why?

I like to write in pure HTML and to view the result in a web browser. From there it can be copied or inserted into an email client. In this way each program does what it can best, typical Linux philosophy:
+ Text editor to write
+ Web browser to view formatted result
+ Spell checker in 'full glory' from the command line
+ Email client to send

## Procedure

In ~/.basrc I have added aliasses:

```bash
# mi to initialize writing
alias mi=/data/projects/github/tools/email/init-writing.sh
# Resulting temp file is bookmarked in web browser

# mp to prepare email for sending
alias mp=/data/projects/github/tools/email/prepare.sh
# Usage: mp <language code, default en>
```
