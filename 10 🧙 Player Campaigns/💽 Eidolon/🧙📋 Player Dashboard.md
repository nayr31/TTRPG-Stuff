
> [!cards|dataview 4] Players
> ```dataview
> TABLE WITHOUT ID 
> 	link(file.path, name) AS "Name", 
> 	Pronouns AS "Pronouns",
> 	embed(Art) AS "Art",
> 	Class AS "Class"
> from "Eidolon/Players"
> WHERE contains(NoteIcon, "Player")
> SORT file.name
> ```

