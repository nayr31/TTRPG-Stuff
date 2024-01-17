---
cssclasses:
  - cards
---

# [[90 🧩 Templates/✏ Campaign/Players/🧙📚 Player Database|🧙📚 Player Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art"
from "Players"
WHERE contains(NoteIcon, "Player")
SORT file.name
```

# [[90 🧩 Templates/✏ Campaign/NPCs/👨‍🌾📚 NPC Database|👨‍🌾📚 NPC Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art",
	Notes AS "Notes"
from "NPCs"
WHERE contains(NoteIcon, "NPC")
SORT file.name
```

# [[90 🧩 Templates/✏ Campaign/Quests/🎯 Quest Database|🎯 Quest Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name",
	Status AS "Status",
	Summary AS "Summary"
from "Quests"
WHERE contains(NoteIcon, "Quest")
SORT Status DESC
```

# [[90 🧩 Templates/✏ Campaign/Sessions/🧻📚 Session Database|🧻📚 Session Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Date AS "Date",
	Summary AS "Summary"
from "Sessions"
WHERE contains(NoteIcon, "Note")
SORT file.name DESC
```
