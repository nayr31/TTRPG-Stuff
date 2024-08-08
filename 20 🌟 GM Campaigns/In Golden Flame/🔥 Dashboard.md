---
cssclasses:
  - cards
---


# [[20 🌟 GM Campaigns/In Golden Flame/NPCs/👨‍🌾📚 NPC Database|👨‍🌾📚 NPC Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art",
	Notes AS "Notes"
from "20 🌟 GM Campaigns/🔥 In Golden Flame/NPCs"
WHERE contains(NoteIcon, "NPC")
SORT file.name
```
