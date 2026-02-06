<%*
const templates = [
	{ name: "🧙‍♂️ Player", path: "90 - Templates/Campaign/Player Template" },
	{ name: "👷 NPC", path: "90 - Templates/Campaign/NPC Template" },
	{ name: "📝 Session Note", path: "90 - Templates/Campaign/Session Note Template" },
	{ name: "⛰️ Place", path: "90 - Templates/Campaign/Place Template" },
	{ name: "🎫 Event", path: "90 - Templates/Campaign/Event Template" }
]

// Ask which type of new data file it is
const selected = await tp.system.suggester( (t) => t.name, templates )
if (selected) {
	// Grab the required template and run it inside this note
    const templateFile = tp.file.find_tfile(selected.path)
    if (templateFile) { await tp.file.include(templateFile) }
}
%>
