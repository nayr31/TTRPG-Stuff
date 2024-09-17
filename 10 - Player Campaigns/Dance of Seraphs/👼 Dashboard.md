---
cssclasses:
  - cards
  - cards-cols-5
---

# [[10 - Player Campaigns/Dance of Seraphs/Players/🧙📚 Player Database|🧙📚 Player Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art"
from "10 - Player Campaigns/Dance of Seraphs/Players"
WHERE contains(NoteIcon, "Player")
SORT file.name
```
