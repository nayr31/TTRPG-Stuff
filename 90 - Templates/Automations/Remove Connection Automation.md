<%*
// Prompt for two files, listed from all character folders from within the current campaign folder
const currentFolder = tp.file.folder(true)
const foldersToSearch = ["Players", "NPCs"]

const combinedFiles = app.vault.getMarkdownFiles().filter(file => {
    return foldersToSearch.some(subDir => 
        file.path.startsWith(`${currentFolder}/${subDir}`)
    )
})

// Prompt for the file to remove
const currentFile = await tp.system.suggester((f) => f.basename, combinedFiles, false, "Select the target file")

const metadata = app.metadataCache.getFileCache(currentFile)?.frontmatter

// Safeguard just in case no connections
if (!metadata || !metadata.Connections || metadata.Connections.length === 0) {
    new Notice("No connections found in this file.")
    console.log("No connections found in this file.")
    return
}

// Prompt for which connection to remove
const options = metadata.Connections
const indexToRemove = await tp.system.suggester(options, [...Array(options.length).keys()], false, "Select connection to REMOVE from BOTH files:")
if (indexToRemove === null) return

// Get the other file
const otherFileLink = metadata.Connections[indexToRemove]
const otherFileName = otherFileLink.split("|")[0].replace(/[[\]]/g, "")
const otherFile = app.vault.getMarkdownFiles().find(f => f.basename === otherFileName)

// Remove connections
if (otherFile){
	// Remove from this file
	await app.fileManager.processFrontMatter(currentFile, (fm) => {
		console.log("Removing connection from file origin...")
	    fm.Connections.splice(indexToRemove, 1)
	})
	
	//Remove from the connected file
	await app.fileManager.processFrontMatter(otherFile, (fm) => {
        // Find the entry that points back to the current file
        const backLink = `[[${currentFile.basename}|` + otherFileLink.split("|")[1]
        const backIndex = fm.Connections.indexOf(backLink)
        
        if (backIndex !== -1) {
            console.log("Removing connection from back file...")
            fm.Connections.splice(backIndex, 1)
        } else {
	        console.log("Failed to find back file.")
        }
    });
} else {
	new Notice("Couldn't find other file.")
	console.log("Couldn't find other file.")
}

new Notice(`Removed Connection → ${file1.basename} and ${file2.basename}`)
-%>