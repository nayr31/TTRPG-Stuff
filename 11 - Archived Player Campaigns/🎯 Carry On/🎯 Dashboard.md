---
cssclasses:
  - cards
  - cards-cols-5
---

![[Josh Playbook.png]]
![[Josh Playbook 2.png]]

[[Nico]]: we're old friends, our meeting was, odd
[[11 - Archived Player Campaigns/🎯 Carry On/Players/Esther|Esther]]: went through hell together on my first mission
[[Ashlyn]]: they're connected to it all, i've been keeping on eye on them for a while now
[[Dayna]]: know 'em from the forums

# [[11 - Archived Player Campaigns/🎯 Carry On/Players/🧙📚 Player Database|🧙📚 Player Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	Playbook AS "Playbook",
	embed(Art) AS "Art"
from "10 🧙 Player Campaigns/🎯 Carry On/Players"
WHERE contains(NoteIcon, "Player")
SORT file.name
```

# [[11 🗄️ Archived Player Campaigns/🎯 Carry On/NPCs/👨‍🌾📚 NPC Database|👨‍🌾📚 NPC Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art",
	Notes AS "Notes"
from "10 🧙 Player Campaigns/🎯 Carry On/NPCs"
WHERE contains(NoteIcon, "NPC")
SORT file.name
```

# [[11 🗄️ Archived Player Campaigns/🎯 Carry On/Quests/🎯 Quest Database|🎯 Quest Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name",
	Status AS "Status",
	Type AS "Type",
	Session_Complete AS "Session Complete",
	Summary AS "Summary"
from "10 🧙 Player Campaigns/🎯 Carry On/Quests"
WHERE contains(NoteIcon, "Quest")
SORT Status DESC
```

# [[11 🗄️ Archived Player Campaigns/🎯 Carry On/Sessions/🧻📚 Session Database|🧻📚 Session Dashboard]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name",
	Complete AS "Complete",
	Summary AS "Summary"
from "10 🧙 Player Campaigns/🎯 Carry On/Sessions"
WHERE contains(NoteIcon, "Note")
SORT file.name DESC
```
