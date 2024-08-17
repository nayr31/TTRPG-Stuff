---
cssclasses:
  - cards
  - cards-cols-5
---

![[The Chart~.canvas]]
## [[Business Database]]

# [[10 🧙 Player Campaigns/Alstead Passage/Players/🧙📚 Player Database|🧙📚 Player Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	Class AS "Class",
	embed(Art) AS "Art"
from "10 🧙 Player Campaigns/🌄 Alstead Passage/Players"
WHERE contains(NoteIcon, "Player")
SORT file.name
```


# [[10 🧙 Player Campaigns/Alstead Passage/NPCs/👨‍🌾📚 NPC Database|👨‍🌾📚 NPC Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	Keys AS "Keys",
	embed(Art) AS "Art",
	Notes AS "Notes"
from "10 🧙 Player Campaigns/🌄 Alstead Passage/NPCs"
WHERE contains(NoteIcon, "NPC")
SORT file.name
```

# [[10 🧙 Player Campaigns/Alstead Passage/Quests/🎯 Quest Database|🎯 Quest Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name",
	Status AS "Status",
	Type AS "Type",
	Session_Complete AS "Session Complete",
	Summary AS "Summary"
from "10 🧙 Player Campaigns/🌄 Alstead Passage/Quests"
WHERE contains(NoteIcon, "Quest")
SORT Status DESC
```

# [[10 🧙 Player Campaigns/Alstead Passage/Sessions/🧻📚 Session Database|🧻📚 Session Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Date AS "Date",
	Summary AS "Summary"
from "10 🧙 Player Campaigns/🌄 Alstead Passage/Sessions"
WHERE contains(NoteIcon, "Note")
SORT file.name DESC
```
