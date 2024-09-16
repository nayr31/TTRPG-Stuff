---
cssclasses:
  - cards
  - cards-cols-4
---

# [[10 - Player Campaigns/Starlit Fangs/Players/🧙📚 Player Database|🧙📚 Player Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art"
from "10 - Player Campaigns/Starlit Fangs/Players"
WHERE contains(NoteIcon, "Player")
SORT file.name
```
