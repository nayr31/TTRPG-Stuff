---
cssclasses:
  - cards
  - cards-cols-5
aliases: []
---

# [[10 - Player Campaigns/Gears of Exmoor/Players/🧙📚 Player Database|🧙📚 Player Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art",
	Class AS "Class"
from "10 - Player Campaigns/Gears of Exmoor/Players"
WHERE contains(NoteIcon, "Player")
SORT file.name
```

# [[10 - Player Campaigns/Gears of Exmoor/NPCs/👨‍🌾📚 NPC Database|👨‍🌾📚 NPC Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art",
	Notes AS "Notes"
from "10 - Player Campaigns/Gears of Exmoor/NPCs"
WHERE contains(NoteIcon, "NPC")
SORT file.name
```

# [[10 🧙 Player Campaigns/Gears of Exmoor/Quests/🎯 Quest Database|🎯 Quest Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name",
	Status AS "Status",
	Type AS "Type",
	Session_Complete AS "Session Complete",
	Summary AS "Summary"
from "10 🧙 Player Campaigns/☁️ Gears of Exmoor/Quests"
WHERE contains(NoteIcon, "Quest")
SORT Status DESC
```

# [[10 - Player Campaigns/Gears of Exmoor/Sessions/🧻📚 Session Database|🧻📚 Session Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Date AS "Date",
	Summary AS "Summary"
from "10 🧙 Player Campaigns/☁️ Gears of Exmoor/Sessions"
WHERE contains(NoteIcon, "Note")
SORT file.name DESC
```
