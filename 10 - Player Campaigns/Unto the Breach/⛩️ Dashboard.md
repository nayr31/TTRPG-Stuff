---
cssclasses:
  - cards
  - cards-cols-5
aliases: []
---

# [[10 - Player Campaigns/Unto the Breach/Players/🧙📚 Player Database|🧙📚 Player Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art",
	Class AS "Class"
from "10 - Player Campaigns/Unto the Breach/Players"
WHERE contains(NoteIcon, "Player")
SORT file.name
```
