<%*
const templates = [
	{ name: "🧙‍♂️ Player", path: "90 - Templates/Campaign/Player Template" },
	{ name: "👷 NPC", path: "90 - Templates/Campaign/NPC Template" },
	{ name: "📝 Session Note", path: "90 - Templates/Campaign/Session Note Template" }
]

const selected = await tp.system.suggester( (t) => t.name, templates ) // prompt
if (selected) {
    const templateFile = tp.file.find_tfile(selected.path) // grab the template
    if (templateFile) {
        await tp.file.include(templateFile) // apply it
    }
}
%>
