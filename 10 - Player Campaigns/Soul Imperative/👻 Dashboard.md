---
cssclasses:
  - cards
  - cards-cols-4
---

# [[10 - Player Campaigns/Soul Imperative/Players/🧙📚 Player Database|🧙📚 Player Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art"
from "10 - Player Campaigns/Soul Imperative/Players"
WHERE contains(NoteIcon, "Player")
SORT file.name
```

# [[10 - Player Campaigns/Soul Imperative/NPCs/👨‍🌾📚 NPC Database|👨‍🌾📚 NPC Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art",
	Notes AS "Notes"
from "10 - Player Campaigns/Soul Imperative/NPCs"
WHERE contains(NoteIcon, "NPC")
SORT file.name
```

# [[10 - Player Campaigns/Soul Imperative/Sessions/🧻📚 Session Database|🧻📚 Session Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Date AS "Date",
	Summary AS "Summary"
from "10 - Player Campaigns/Soul Imperative/Sessions"
WHERE contains(NoteIcon, "Note")
SORT file.name DESC
```
