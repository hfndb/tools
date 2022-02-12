# Email

A tiny system to organize the flow of writing, checking and sending email. Not in the composer window of an email client but in an openly technical way, thus providing better insight and control.

In a way, this tiny project represents some forced labour. Neutralising problems created by others as a counteroffensive. You don't want to know why I created this tiny project 😀 😎


## Why?

Some ingredients: I like to write in pure HTML and to view the result in a web browser. From there it can be copied or inserted into an email client. In this way each program does what it can best, typical Linux philosophy:
+ Text editor to write, using code folding for optimal overview and Zen coding for optimal speed.
+ Web browser to view formatted result.
+ Spell checker in 'full glory' from the command line.
+ Email client to send.


## Installation

In ~/.basrc I have added aliasses:

```bash
# mi to initialize writing
alias mi=/absolute/path/to/tools/programs/email/init-writing.sh
# Resulting temp file is bookmarked in web browser

# mr to resume writing
alias mi=/absolute/path/to/tools/programs/email/resume-writing.sh

# mp to prepare email for sending
alias mp=/absolute/path/to/tools/programs/email/prepare.sh
# Usage: mp <language code, default en>

# ms to strip <br> from sent emails, for the purpose of archiving
alias ms=/absolute/path/to/tools/programs/email/strip-br.mjs
```


## Educational

From here some text for educational purposes. How does philosophy and psychology translate to language, technique?


### Languages

In this tiny project I used some languages. Compare this to one language you use about how you feel, another language about what you want and why etc. Which can be mingled into one 'project', speaking with others about whatever situation. You use one or more languages best fit for your purposes in a specific situations.

This document is written in the Markdown (.md) language, translated to HTML markup by github.com. Initializing writing an email, and preparing for sending, in bash script (.sh). The email template (.html) is written in HTML for structure, CSS for 'cosmetics' of styling, JavaScript for some 'intelligence'. After the email is sent using an arbitrary email client, it is stripped of newline tags by JavaScript (.mjs) run as en ES module by a Node.js.

How many languages were used in this tiny project? 5 languages used in 3 situations - browser as a 'face' in sight, interacting with what's inside a computer, not in sight, and publishing this project to github.


### Structure

Looking at the HTML template or any HTML page in general, imagine you as an independent with one or more activities. Intelligence, structure, style come from the inside outwards though ingredients are often acquired from the outside. You are structuring, shaping your thinking and activities. The HTML language inverts that process, since you put all that into a page or template.

One page or template is like a 'first time' for any kind of activity. Next time, you could use the same intelligence and style for other activity. Perhaps even structure such as with HTML templating. Compare that with separating CSS for styling and JavaScript for intelligence from HTML for structure, moving intelligence and style from project specific to a matter of generic memory.

Here you can see the risk of integrating standardized intelligence and styling from external servers. As an introduced risk, you make your activity dependent of whimps of others. Think of socalled 'breaking changes' which will coerce you into maintenance to neutralise 'special effects' caused by others.

Therefore... it's always better to organize all intelligence, structure, styling yourself without creating an overdose dependencies towards others like (convenience or drug) addicts do. A robust way of thinking will hurt you (attention, energy, efforts needed by you) but also prevent the unnecessary pain of neutralising 'special effects' caused by others who you didn't even meet and who are perhaps controlled in a way you don't even know.
