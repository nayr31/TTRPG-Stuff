# Staff

> [!cards|dataview 4] Staff
> ```dataview
> TABLE WITHOUT ID 
> 	link(file.path, name) AS "Name", 
> 	Pronouns AS "Pronouns",
> 	embed(Art) AS "Art",
> 	Notes AS "Role"
> from "RWBY/NPCS"
> WHERE contains(NoteIcon, "NPC") AND contains(Role, "Staff")
> SORT file.name
> ```

# Students

> [!cards|dataview 4] Students
> ```dataview
> TABLE WITHOUT ID 
> 	link(file.path, name) AS "Name", 
> 	Pronouns AS "Pronouns",
> 	embed(Art) AS "Art",
> 	Role AS "Role"
> from "RWBY/NPCS"
> WHERE contains(NoteIcon, "NPC") AND contains(Role, "Student")
> SORT file.name
> ```
