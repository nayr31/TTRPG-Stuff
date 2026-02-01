# Players 
![[Campaign Note Display.base#Players]]

# NPCs
![[Campaign Note Display.base#NPCs]]

# Sessions
![[Campaign Note Display.base#Sessions]]

<%*
const campaignName = await tp.system.prompt("What is the name of the Campaign?")
await tp.file.move(tp.file.folder(true) + "/" + campaignName + "/⭐ " + campaignName)

const currentFolder = tp.file.folder(true)
const newFileName = "Pitch.md"
const fullPath = `${currentFolder}/${newFileName}`

if (!app.vault.getAbstractFileByPath(fullPath)) {
    await app.vault.create(fullPath, `Put the campaign pitch here!`)
}
-%>