---
cssclasses:
  - cards
---

# [[20 🌟 GM Campaigns/🔥 In Golden Flame/Players/🧙📚 Player Database|🧙📚 Player Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art"
from "20 🌟 GM Campaigns/🔥 In Golden Flame/Players"
WHERE contains(NoteIcon, "Player")
SORT file.name
```

# [[20 🌟 GM Campaigns/🔥 In Golden Flame/NPCs/👨‍🌾📚 NPC Database|👨‍🌾📚 NPC Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art",
	Notes AS "Notes"
from "20 🌟 GM Campaigns/🔥 In Golden Flame/NPCs"
WHERE contains(NoteIcon, "NPC")
SORT file.name
```

# [[20 🌟 GM Campaigns/🔥 In Golden Flame/Quests/🎯 Quest Database|🎯 Quest Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name",
	Status AS "Status",
	Type AS "Type",
	Session_Complete AS "Session Complete",
	Summary AS "Summary"
from "20 🌟 GM Campaigns/🔥 In Golden Flame/Quests"
WHERE contains(NoteIcon, "Quest")
SORT Status DESC
```

# [[20 🌟 GM Campaigns/🔥 In Golden Flame/Sessions/🧻📚 Session Database|🧻📚 Session Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Date AS "Date",
	Summary AS "Summary"
from "20 🌟 GM Campaigns/🔥 In Golden Flame/Sessions"
WHERE contains(NoteIcon, "Note")
SORT file.name DESC
```
