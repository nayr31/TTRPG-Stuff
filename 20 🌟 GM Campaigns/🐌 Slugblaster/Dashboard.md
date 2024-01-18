---
cssclasses:
  - cards
  - cards-cols-5
---
Goals for this page:
- [ ] Group overview
	- [x] Crews
	- [ ] Authorities
	- [ ] Crowds?
	- [ ] Sponsors
- [ ] Generator list
	- [x] Checkpoints
	- [x] Problems
	- [x] NPCs
	- [x] Monsters
	- [ ] ???
- [ ] Place list (Clickable map?)

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
	link(file.path, displayname) AS "Name",
	gen1 AS "gen1",
	gen2 AS "gen2"
from "20 🌟 GM Campaigns/🐌 Slugblaster/Generators"
SORT file.name
```
