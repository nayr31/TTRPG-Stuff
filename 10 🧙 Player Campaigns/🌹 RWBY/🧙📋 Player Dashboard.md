[[10 🧙 Player Campaigns/🌹 RWBY/Players/🧙📚 Player Database]]

> [!cards|dataview 4] Players
> ```dataview
> TABLE WITHOUT ID 
> 	link(file.path, name) AS "Name", 
> 	Pronouns AS "Pronouns",
> 	embed(Art) AS "Art",
> 	Notes AS "Role"
> from "RWBY/Players"
> WHERE contains(NoteIcon, "Player")
> SORT file.name
> ```

