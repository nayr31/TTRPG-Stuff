---
cssclasses:
  - cards
  - cards-cols-4
---

# [[10 🧙 Player Campaigns/🧛 Thicc/Players/🧙📚 Player Database|🧙📚 Player Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	Race AS "Race",
	embed(Art) AS "Art"
from "10 🧙 Player Campaigns/🧛 Thicc/Players"
WHERE contains(NoteIcon, "Player")
SORT file.name
```

# [[10 🧙 Player Campaigns/🧛 Thicc/NPCs/👨‍🌾📚 NPC Database|👨‍🌾📚 NPC Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art",
	Notes AS "Notes"
from "10 🧙 Player Campaigns/🧛 Thicc/NPCs"
WHERE contains(NoteIcon, "NPC") AND !contains(Type, "Coven Leader")
SORT file.name
```

# [[10 🧙 Player Campaigns/🧛 Thicc/Groups/👪📚 Group Database|👑 Covens]]
```dataview
TABLE WITHOUT ID 
	link(file.path, Displayname) AS "Name",
	POI AS "Leader",
	Summary AS "Summary"
from "10 🧙 Player Campaigns/🧛 Thicc/Groups"
WHERE contains(NoteIcon, "Group") AND contains(Type, "Coven")
SORT Status DESC
```

# [[10 🧙 Player Campaigns/🧛 Thicc/NPCs/👨‍🌾📚 NPC Database|👨‍🌾📚 Coven Leaders]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art"
from "10 🧙 Player Campaigns/🧛 Thicc/NPCs"
WHERE contains(NoteIcon, "NPC") AND contains(Type, "Coven Leader")
SORT file.name
```

# [[10 🧙 Player Campaigns/🧛 Thicc/Groups/👪📚 Group Database|👥 Groups]]
```dataview
TABLE WITHOUT ID 
	link(file.path, Displayname) AS "Name",
	POI AS "Leader",
	Summary AS "Summary"
from "10 🧙 Player Campaigns/🧛 Thicc/Groups"
WHERE contains(NoteIcon, "Group") AND !contains(Type, "Coven")
SORT Status DESC
```

# [[10 🧙 Player Campaigns/🧛 Thicc/Quests/🎯 Quest Database|🎯 Quest Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name",
	Status AS "Status",
	Type AS "Type",
	Session_Complete AS "Session Complete",
	Summary AS "Summary"
from "10 🧙 Player Campaigns/🧛 Thicc/Quests"
WHERE contains(NoteIcon, "Quest")
SORT Status DESC
```

# [[10 🧙 Player Campaigns/🧛 Thicc/Sessions/🧻📚 Session Database|🧻📚 Session Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Date AS "Date",
	Summary AS "Summary"
from "10 🧙 Player Campaigns/🧛 Thicc/Sessions"
WHERE contains(NoteIcon, "Note")
SORT file.name DESC
```
