---
cssclasses:
  - cards
  - cards-cols-3
---

[[10 🧙 Player Campaigns/🎏 Gubat Banwa/Players/🧙📚 Player Database|🧙📚 Player Database]]


```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art",
	Homeland AS "Homeland",
	Discipline AS "Discipline"
from "Gubat Banwa/Players"
WHERE contains(NoteIcon, "Player")
SORT file.name
```

