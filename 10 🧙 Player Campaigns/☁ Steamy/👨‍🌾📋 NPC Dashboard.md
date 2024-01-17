[[10 🧙 Player Campaigns/☁ Steamy/NPCs/👨‍🌾📚 NPC Database]]
> [!cards|dataview 3] Players
> ```dataview
> TABLE WITHOUT ID 
> 	link(file.path, name) AS "Name", 
> 	Pronouns AS "Pronouns",
> 	embed(Art) AS "Art",
> 	Notes AS "Notes"
> from "Steamy/NPCs"
> WHERE contains(NoteIcon, "NPC")
> SORT file.name
> ```

