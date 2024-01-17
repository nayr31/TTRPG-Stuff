# Staff

> [!cards|dataview 4] Staff
> ```dataview
> TABLE WITHOUT ID 
> 	link(file.path, name) AS "Name", 
> 	Pronouns AS "Pronouns",
> 	embed(Art) AS "Art",
> 	Notes AS "Role"
> from "Gubat Banwa/NPCS"
> WHERE contains(NoteIcon, "NPC")
> SORT file.name
> ```
