`BUTTON[addCon]` `BUTTON[rmCon]` 
```meta-bind-button
style: default
label: ⛓️‍💥 Remove Connection
hidden: true
class: remove-connection
id: rmCon
tooltip: Removes a connection.
action:
  type: command
  command: templater-obsidian:90 - Templates/Automations/Remove Connection Automation.md
```
```meta-bind-button
style: default
tooltip: Adds a new connection between people.
label: 🔗 New Connection
hidden: true
class: new-connection
id: addCon
action:
  type: command
  command: templater-obsidian:90 - Templates/Automations/New Connection Automation.md
```
