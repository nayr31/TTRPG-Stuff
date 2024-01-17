---
cssclasses:
  - cards
---
[[10 🧙 Player Campaigns/☁ Steamy/Players/🧙📚 Player Database|🧙📚 Player Database]]

```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art",
	Class AS "Class",
	Notes AS "Notes"
from "Steamy/Players"
WHERE contains(NoteIcon, "Player")
SORT file.name
```

