---
cssclasses:
  - cards
  - cards-cols-5
---

# [[10 🧙 Player Campaigns/Diwata's Glory/Players/🧙📚 Player Database|🧙📚 Player Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	Discipline AS "Discipline",
	embed(Art) AS "Art"
from "10 🧙 Player Campaigns/🎏 Diwata's Glory/Players"
WHERE contains(NoteIcon, "Player")
SORT file.name
```

> [!NOTE]- Google Sheet
> <iframe src="https://docs.google.com/spreadsheets/d/1WYsZ_Wyt3K7EbyOsEdAccYfFJcDiY3VYS8cTsC51vY4/edit?usp=sharing" width=900 height=700></iframe>

# [[10 🧙 Player Campaigns/Diwata's Glory/NPCs/👨‍🌾📚 NPC Database|👨‍🌾📚 NPC Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art",
	Notes AS "Notes"
from "10 🧙 Player Campaigns/🎏 Diwata's Glory/NPCs"
WHERE contains(NoteIcon, "NPC")
SORT file.name
```

# [[10 🧙 Player Campaigns/Diwata's Glory/Quests/🎯 Quest Database|🎯 Quest Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name",
	Status AS "Status",
	Type AS "Type",
	Session_Complete AS "Session Complete",
	Summary AS "Summary"
from "10 🧙 Player Campaigns/🎏 Diwata's Glory/Quests"
WHERE contains(NoteIcon, "Quest")
SORT Status DESC
```

# [[10 🧙 Player Campaigns/Diwata's Glory/Sessions/🧻📚 Session Database|🧻📚 Session Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Date AS "Date",
	Summary AS "Summary"
from "10 🧙 Player Campaigns/🎏 Diwata's Glory/Sessions"
WHERE contains(NoteIcon, "Note")
SORT file.name DESC
```
