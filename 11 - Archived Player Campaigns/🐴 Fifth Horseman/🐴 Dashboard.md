---
cssclasses:
  - cards
  - cards-cols-5
---

# [[11 - Archived Player Campaigns/🐴 Fifth Horseman/Players/🧙📚 Player Database|🧙📚 Player Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	Class AS "Class",
	embed(Art) AS "Art"
from "10 🧙 Player Campaigns/🐴 Fifth Horseman/Players"
WHERE contains(NoteIcon, "Player")
SORT file.name
```

# [[11 🗄️ Archived Player Campaigns/🐴 Fifth Horseman/NPCs/👨‍🌾📚 NPC Database|👨‍🌾📚 NPC Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art",
	Notes AS "Notes"
from "10 🧙 Player Campaigns/🐴 Fifth Horseman/NPCs"
WHERE contains(NoteIcon, "NPC")
SORT file.name
```

# [[11 🗄️ Archived Player Campaigns/🐴 Fifth Horseman/Quests/🎯 Quest Database|🎯 Quest Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name",
	Status AS "Status",
	Type AS "Type",
	Session_Complete AS "Session Complete",
	Summary AS "Summary"
from "10 🧙 Player Campaigns/🐴 Fifth Horseman/Quests"
WHERE contains(NoteIcon, "Quest")
SORT Status DESC
```

# [[11 🗄️ Archived Player Campaigns/🐴 Fifth Horseman/Sessions/🧻📚 Session Database|🧻📚 Session Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Date AS "Date",
	Summary AS "Summary"
from "10 🧙 Player Campaigns/🐴 Fifth Horseman/Sessions"
WHERE contains(NoteIcon, "Note")
SORT file.name DESC
```
