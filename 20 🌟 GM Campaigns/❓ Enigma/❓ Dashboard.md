---
cssclasses:
  - cards
  - cards-cols-5
---

# [[20 🌟 GM Campaigns/❓ Enigma/NPCs/👨‍🌾📚 NPC Database|👨‍🌾📚 NPC Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art",
	Notes AS "Notes"
from "20 🌟 GM Campaigns/❓ Enigma/NPCs"
WHERE contains(NoteIcon, "NPC")
SORT file.name
```

# [[20 🌟 GM Campaigns/❓ Enigma/Quests/🎯 Quest Database|🎯 Quest Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name",
	Status AS "Status",
	Type AS "Type",
	Session_Complete AS "Session Complete",
	Summary AS "Summary"
from "20 🌟 GM Campaigns/❓ Enigma/Quests"
WHERE contains(NoteIcon, "Quest")
SORT Status DESC
```

# [[20 🌟 GM Campaigns/❓ Enigma/Groups/👪📚 Group Database|👪 Groups]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name",
	Summary AS "Summary"
from "20 🌟 GM Campaigns/❓ Enigma/Groups"
WHERE contains(NoteIcon, "Group")
SORT file.name DESC
```

# [[20 🌟 GM Campaigns/❓ Enigma/Sessions/🧻📚 Session Database|🧻📚 Session Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Date AS "Date",
	Summary AS "Summary"
from "20 🌟 GM Campaigns/❓ Enigma/Sessions"
WHERE contains(NoteIcon, "Note")
SORT file.name DESC
```
