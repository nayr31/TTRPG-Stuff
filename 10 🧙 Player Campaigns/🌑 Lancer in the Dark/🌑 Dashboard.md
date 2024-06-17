---
cssclasses:
  - cards
  - cards-cols-4
---

# [[10 🧙 Player Campaigns/🌑 Lancer in the Dark/Players/🧙📚 Player Database|🧙📚 Player Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name",
	Real_Name AS "Real Name",
	Pronouns AS "Pronouns",
	embed(Art) AS "Art",
	Frame AS "Frame"
from "10 🧙 Player Campaigns/🌑 Lancer in the Dark/Players"
WHERE contains(NoteIcon, "Player")
SORT file.name
```

# [[10 🧙 Player Campaigns/🌑 Lancer in the Dark/NPCs/👨‍🌾📚 NPC Database|👨‍🌾📚 NPC Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art",
	Notes AS "Notes"
from "10 🧙 Player Campaigns/🌑 Lancer in the Dark/NPCs"
WHERE contains(NoteIcon, "NPC")
SORT file.name
```

# [[10 🧙 Player Campaigns/🌑 Lancer in the Dark/Sessions/🧻📚 Session Database|🧻📚 Session Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Date AS "Date",
	Summary AS "Summary"
from "10 🧙 Player Campaigns/🌑 Lancer in the Dark/Sessions"
WHERE contains(NoteIcon, "Note")
SORT file.name DESC
```
