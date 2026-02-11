---
Status:
---
```meta-bind-button
style: default
label: 🔗 New Connection
action:
  type: command
  command: templater-obsidian:90 - Templates/Automations/New Connection Automation.md
```
# Players 
![[Campaign Note Display.base#Players]]

# NPCs
![[Campaign Note Display.base#NPCs]]

# Sessions
![[Campaign Note Display.base#Sessions]]

# World
![[Campaign Note Display.base#The World]]
<%*
const campaignName = await tp.system.prompt("What is the name of the Campaign?")
await tp.file.move(tp.file.folder(true) + "/" + campaignName + "/⭐ " + campaignName)

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
