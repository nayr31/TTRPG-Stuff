---
Status:
cssclasses:
  - pretty-inserts
---
`BUTTON[newInfo]`
![[Campaign Actions]]
# `BUTTON[newPlayer]` Players 
![[Campaign Note Display.base#Players]]

# `BUTTON[newNPC]` NPCs
![[Campaign Note Display.base#NPCs]]

# `BUTTON[newSesh]` Sessions
![[Campaign Note Display.base#Sessions]]

# `BUTTON[newPlace]` `BUTTON[newEvent]` World
![[Campaign Note Display.base#The World]]
<%*
const campaignName = await tp.system.prompt("What is the name of the Campaign?")
await tp.file.move("10 - Player Campaigns" + "/" + campaignName + "/⭐ " + campaignName)

const currentFolder = tp.file.folder(true)

// Create the pitch file
await app.vault.create(`${currentFolder}/` + "Pitch.md", `Put the campaign pitch here!`)

// Create the folders for storing world data
await app.vault.createFolder(`${currentFolder}/` + "World")
await app.vault.createFolder(`${currentFolder}/World/` + "Places")
await app.vault.createFolder(`${currentFolder}/World/` + "Events")
await app.vault.createFolder(`${currentFolder}/` + "Players")
await app.vault.createFolder(`${currentFolder}/` + "NPCs")
await app.vault.createFolder(`${currentFolder}/` + "Session Notes")

// Pitch link
const pitch = `${currentFolder}/` + "Pitch.md"
-%>

> [!info] Pitch
> ![[<% pitch %>]]


> [!danger]- Button data
> 
>```meta-bind-button
style: default
tooltip: Adds a new connection between people.
label: ✨ New Info
hidden: false
class: new-info
id: newInfo
action:
  type: command
  command: templater-obsidian:create-90 - Templates/Campaign/Event Template.md
>```
>```meta-bind-button
style: default
tooltip: Adds a new connection between people.
label: 🤝
hidden: false
class: new-player
id: newPlayer
action:
  type: command
  command: templater-obsidian:create-90 - Templates/Campaign/Player Template.md
>```
>```meta-bind-button
style: default
tooltip: Adds a new connection between people.
label: 🎭
hidden: false
class: new-npc
id: newNPC
action:
  type: command
  command: templater-obsidian:create-90 - Templates/Campaign/NPC Template.md
>```
>```meta-bind-button
style: default
tooltip: Adds a new connection between people.
label: 📝
hidden: false
class: new-sessionnote
id: newSesh
action:
  type: command
  command: templater-obsidian:create-90 - Templates/Campaign/Session Note Template.md
>```
>```meta-bind-button
style: default
tooltip: Adds a new connection between people.
label: 🏔️
hidden: false
class: new-place
id: newPlace
action:
  type: command
  command: templater-obsidian:create-90 - Templates/Campaign/Place Template.md
>```
>```meta-bind-button
style: default
tooltip: Adds a new connection between people.
label: ⏳
hidden: false
class: new-event
id: newEvent
action:
  type: command
  command: templater-obsidian:create-90 - Templates/Campaign/Event Template.md
>```
