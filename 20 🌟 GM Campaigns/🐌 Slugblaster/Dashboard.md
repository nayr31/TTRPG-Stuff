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
	embed(Logo) AS "Logo",
	Summary AS "Summary"
from "20 🌟 GM Campaigns/🐌 Slugblaster/Groups"
WHERE contains(Type, "Crew")
SORT file.name
```

# 🎲 Generators

```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name",
	gen1 AS "gen1",
	gen2 AS "gen2"
from "20 🌟 GM Campaigns/🐌 Slugblaster/Generators"
SORT file.name
```

*TODO:// Checkpoints/Problems generator*