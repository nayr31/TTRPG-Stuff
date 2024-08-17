---
cssclasses:
  - cards
  - cards-cols-5
---

# [[10 🧙 Player Campaigns/Sleeping Days/Players/🧙📚 Player Database|🧙📚 Player Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art",
	Notes AS "Notes"
from "10 🧙 Player Campaigns/💤 Sleeping Days/Players"
WHERE contains(NoteIcon, "Player")
SORT file.name
```

# [[10 🧙 Player Campaigns/Sleeping Days/NPCs/👨‍🌾📚 NPC Database|👨‍🌾📚 NPC Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art",
	Notes AS "Notes"
from "10 🧙 Player Campaigns/💤 Sleeping Days/NPCs"
WHERE contains(NoteIcon, "NPC") AND contains(Relevant, True)
SORT file.name
```

# [[10 🧙 Player Campaigns/Sleeping Days/Quests/🎯 Quest Database|🎯 Quest Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name",
	Status AS "Status",
	Type AS "Type",
	Session_Complete AS "Session Complete",
	Summary AS "Summary"
from "10 🧙 Player Campaigns/💤 Sleeping Days/Quests"
WHERE contains(NoteIcon, "Quest")
SORT Status DESC
```

# [[10 🧙 Player Campaigns/Sleeping Days/Session Notes/🧻📚 Session Database|🧻📚 Session Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Date AS "Date",
	Summary AS "Summary"
from "10 🧙 Player Campaigns/💤 Sleeping Days/Session Notes"
WHERE contains(NoteIcon, "Note")
SORT file.name DESC
```
