---
cssclasses:
  - cards
---

# [[10 🧙 Player Campaigns/🦌 DHS/Players/🧙📚 Player Database|🧙 Player Dashboard (🍅🍅)]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art"
from "10 🧙 Player Campaigns/🦌 DHS/Players"
WHERE contains(NoteIcon, "Player")
SORT file.name
```

# [[10 🧙 Player Campaigns/🦌 DHS/NPCs/👨‍🌾📚 NPC Database|👨‍🌾 NPC Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art",
	Notes AS "Notes"
from "10 🧙 Player Campaigns/🦌 DHS/NPCs"
WHERE contains(NoteIcon, "NPC")
SORT file.name
```

# [[10 🧙 Player Campaigns/🦌 DHS/Quests/🎯 Quest Database|🎯 Quest Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name",
	Status AS "Status",
	Summary AS "Summary"
from "10 🧙 Player Campaigns/🦌 DHS/Quests"
WHERE contains(NoteIcon, "Quest")
SORT Status DESC
```

# [[10 🧙 Player Campaigns/🦌 DHS/Sessions/🧻📚 Session Database|🧻 Session Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Date AS "Date",
	Summary AS "Summary"
from "10 🧙 Player Campaigns/🦌 DHS/Sessions"
WHERE contains(NoteIcon, "Note")
SORT file.name DESC
```
