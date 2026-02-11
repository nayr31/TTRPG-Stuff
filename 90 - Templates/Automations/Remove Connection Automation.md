<%*
const currentFile = tp.config.target_file
const metadata = app.metadataCache.getFileCache(currentFile)?.frontmatter

// Safeguard just in case no connections
if (!metadata || !metadata.Connections || metadata.Connections.length === 0) {
    new Notice("No connections found in this file.")
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
		console.log("Ready to remove (1)")
	    //fm.Connections.splice(indexToRemove, 1)
	})
	
	//Remove from the connected file
	await app.fileManager.processFrontMatter(otherFile, (fm) => {
        // Find the entry that points back to the current file
        const backLink = `[[${currentFile.basename}|` + otherFileLink.split("|")[1]
        const backIndex = fm.Connections.indexOf(backLink)
        
        if (backIndex !== -1) {
            console.log("Ready to remove (2)")
            //fm.Connections.splice(backIndex, 1)
        }
    });
} else {
	new Notice("Couldn't find other file.")
	console.log("Couldn't find other file.")
}
-%>