---
cssclasses:
  - cards
  - cards-cols-5
---
Goal(s) for this page:
- Create a series of quick linked targets to roll for things
- Display hotlinks to  crew, auths



# [[20 🌟 GM Campaigns/🐌 Slugblaster/Groups/👪📚 Group Database|🛹 Crews]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name",
	embed(Logo) AS "Logo"
from "20 🌟 GM Campaigns/🐌 Slugblaster/Groups"
WHERE contains(Type, "Crew")
SORT file.name
```

