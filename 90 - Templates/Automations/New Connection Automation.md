<%*
// Prompt for two files, listed from all character folders from within the current campaign folder
const currentFolder = tp.file.folder(true)
const foldersToSearch = ["Players", "NPCs"]

const combinedFiles = app.vault.getMarkdownFiles().filter(file => {
    return foldersToSearch.some(subDir => 
        file.path.startsWith(`${currentFolder}/${subDir}`)
    )
})

// Prompt for the two file to connect
const file1 = await tp.system.suggester((f) => f.basename, combinedFiles, false, "Select the target file (to update metadata)");
const file2 = await tp.system.suggester((f) => f.basename, combinedFiles, false, "Select the related file");
const connection = await tp.system.prompt("What's the connection?")
const zipped = `[[${file2.basename}|` + connection + ` ${file2.basename}]]`

// Connect them
await app.fileManager.processFrontMatter(file1, (frontmatter) => {
	frontmatter["Connections"] = frontmatter["Connections"] || []
    frontmatter["Connections"].push(zipped)
});
-%>