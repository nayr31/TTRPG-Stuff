---
cssclasses:
  - cards
---
90 - Templates/✏ Campaign/
# [[90 - Templates/✏ Campaign/Players/🧙📚 Player Database|🧙📚 Player Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art"
from "90 - Templates/✏ Campaign/Players"
WHERE contains(NoteIcon, "Player")
SORT file.name
```

# [[90 - Templates/✏ Campaign/NPCs/👨‍🌾📚 NPC Database|👨‍🌾📚 NPC Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art",
	Notes AS "Notes"
from "90 - Templates/✏ Campaign/NPCs"
WHERE contains(NoteIcon, "NPC")
SORT file.name
```

# [[90 - Templates/✏ Campaign/Sessions/🧻📚 Session Database|🧻📚 Session Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Date AS "Date",
	Summary AS "Summary"
from "90 - Templates/✏ Campaign/Sessions"
WHERE contains(NoteIcon, "Note")
SORT file.name DESC
```
