---
cssclasses:
  - cards
---

# [[10 🧙 Player Campaigns/☁ Steamy/Players/🧙📚 Player Database|🧙📚 Player Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art"
from "10 🧙 Player Campaigns/☁ Steamy/Players"
WHERE contains(NoteIcon, "Player")
SORT file.name
```

# [[10 🧙 Player Campaigns/☁ Steamy/NPCs/👨‍🌾📚 NPC Database|👨‍🌾📚 NPC Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art",
	Notes AS "Notes"
from "10 🧙 Player Campaigns/☁ Steamy/NPCs"
WHERE contains(NoteIcon, "NPC")
SORT file.name
```

# [[10 🧙 Player Campaigns/☁ Steamy/Quests/🎯 Quest Database|🎯 Quest Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name",
	Status AS "Status",
	Type AS "Type",
	Session_Complete AS "Session Complete",
	Summary AS "Summary"
from "10 🧙 Player Campaigns/☁ Steamy/Quests"
WHERE contains(NoteIcon, "Quest")
SORT Status DESC
```

# [[10 🧙 Player Campaigns/☁ Steamy/Sessions/🧻📚 Session Database|🧻📚 Session Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Date AS "Date",
	Summary AS "Summary"
from "10 🧙 Player Campaigns/☁ Steamy/Sessions"
WHERE contains(NoteIcon, "Note")
SORT file.name DESC
```
