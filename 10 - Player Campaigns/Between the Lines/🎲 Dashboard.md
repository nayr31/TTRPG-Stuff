---
cssclasses:
  - cards
  - cards-cols-4
---

# [[10 - Player Campaigns/Between the Lines/Players/🧙📚 Player Database|🧙📚 Player Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name",
	Real_Name AS "Real Name",
	Pronouns AS "Pronouns",
	Paragon AS "Paragon",
	embed(Art) AS "Art",
	embed(ParagonArt) AS "Paragon Art"
from "10 - Player Campaigns/Between the Lines/Players"
WHERE contains(NoteIcon, "Player")
SORT file.name
```

# [[10 - Player Campaigns/Between the Lines/NPCs/👨‍🌾📚 NPC Database|👨‍🌾📚 NPC Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art",
	Notes AS "Notes"
from "10 - Player Campaigns/Between the Lines/NPCs"
WHERE contains(NoteIcon, "NPC")
SORT file.name
```



![[Advancement map.png]]
