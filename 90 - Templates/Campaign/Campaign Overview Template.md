---
Status:
cssclasses:
  - pretty-inserts
---
> [!tip]- Actions
> ![[Campaign Actions]]

> [!players] 🤝 Players 
> ![[Campaign Note Display.base#Players]]

> [!npcs] 🎭 NPCs
> ![[Campaign Note Display.base#NPCs]]

> [!session] 📝 Session Notes
> ![[Campaign Note Display.base#Sessions]]

> [!world] ⏳ World
> ![[Campaign Note Display.base#The World]]
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
