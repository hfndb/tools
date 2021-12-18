# Notifications

Tiny application to show system notifications as a modal dialog or popups from the system tray:
- Birthdays, once a year
- Once a day notifications like alarm signals or reminders


## Installation

```bash
# Install notifications
$ cd /opt
$ git clone https://github.com/hfndb/tools
$ tools/notifications/install.sh

# Create project
$ cd /data
$ mkdir notifications
$ cp /opt/notifications/{env.sh,config.json,data.json} ./notifications/

# --- complete configuration in files copied to ./notifications/

# Add to cron: Run project every 10 minutes
$ sudo echo "*/10 * * * * user_name /opt/tools/notifications/run.sh /data/notifications" > /etc/cron.d/notifications
```
