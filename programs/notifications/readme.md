# Notifications

Tiny program to show system notifications as a modal dialog or popups from the system tray:
- Birthdays, once a year
- Once a day notifications like alarm signals or reminders


## Installation

```bash
# Create project
$ cd /data
$ mkdir notifications
$ cp /absolute/path/to/tools/programs/notifications/{env.sh,config.json,data.json} ./notifications/

# --- complete configuration in files copied to ./notifications/

# Add to cron: Run project every 10 minutes
$ sudo echo "*/10 * * * * user_name /absolute/path/to/tools/programs/notifications/run.sh /data/notifications" > /etc/cron.d/notifications
```
