`BUTTON[newPlayer]` `BUTTON[newNPC]` `BUTTON[newSesh]`
`BUTTON[newPlace]`  `BUTTON[newEvent]`
```meta-bind-button
style: default
tooltip: Adds a new connection between people.
label: 🤝 New Player
hidden: true
class: new-player
id: newPlayer
action:
  type: command
  command: templater-obsidian:create-90 - Templates/Campaign/Player Template.md
```
```meta-bind-button
style: default
tooltip: Adds a new connection between people.
label: 🎭 New NPC
hidden: true
class: new-npc
id: newNPC
action:
  type: command
  command: templater-obsidian:create-90 - Templates/Campaign/NPC Template.md
```
```meta-bind-button
style: default
tooltip: Adds a new connection between people.
label: 📝 New Session Note
hidden: true
class: new-sessionnote
id: newSesh
action:
  type: command
  command: templater-obsidian:create-90 - Templates/Campaign/Session Note Template.md
```
```meta-bind-button
style: default
tooltip: Adds a new connection between people.
label: 🏔️ New Place
hidden: true
class: new-place
id: newPlace
action:
  type: command
  command: templater-obsidian:create-90 - Templates/Campaign/Place Template.md
```
```meta-bind-button
style: default
tooltip: Adds a new connection between people.
label: ⏳ New Event
hidden: true
class: new-event
id: newEvent
action:
  type: command
  command: templater-obsidian:create-90 - Templates/Campaign/Event Template.md
```



