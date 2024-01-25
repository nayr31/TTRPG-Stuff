---
cssclasses:
  - cards
  - cards-cols-5
banner: "[[Cover art.jpg]]"
banner_y: 0.653
banner_lock: true
---

# **Goals for this page:**
- [f] Get buttons to change some of these?
- [x] Group overview
	- [x] Crews
	- [x] Authorities
	- [x] Crowds?
	- [x] Sponsors
- [ ] NPCS
	- [x] Crews
	- [ ] Auths
	- [ ] Crowds
	- [ ] Sponsors
- [ ] Generator list
	- [x] Checkpoints
	- [x] Problems
	- [x] NPCs
	- [x] Monsters
	- [x] Loots
		- [x] Common
		- [x] Uncommon
		- [x] Rare
		- [x] Phone Charms (weighted)
	- [x] World
- [x] [[🏠 World Database|Worlds]] (blurb, locations, checkpoints, problems)
	- [x] Clickable map (leaflet)
	- [x] [[Calorium]]
	- [x] [[Desnine]]
	- [x] [[Empyrean]]
	- [x] [[Hillview]]
	- [x] [[Operaeblum]]
	- [x] [[Popularia]]
	- [x] [[Prismatia]]
	- [x] [[Quahalia]]
	- [x] [[The Golden Jungle]]
	- [x] [[The Waking Pits]]
	- [x] [[Thennis Spar]]
	- [x] [[Vastiche]]
- [x] Monsters
- [x] Items
	- [x] Signatures
		- [x] [[Signature Looks]]
	- [x] [[Stickers, Pins, Patches]]
	- [x] Gear

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

# [[20 🌟 GM Campaigns/🐌 Slugblaster/Groups/👪📚 Group Database|👮‍♂️ Authorities]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name",
	Summary AS "Summary"
from "20 🌟 GM Campaigns/🐌 Slugblaster/Groups"
WHERE contains(Type, "Authorities")
SORT file.name
```

# [[20 🌟 GM Campaigns/🐌 Slugblaster/Groups/👪📚 Group Database|🍦 Sponsors]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name",
	Summary AS "Summary"
from "20 🌟 GM Campaigns/🐌 Slugblaster/Groups"
WHERE contains(Type, "Sponsor")
SORT file.name
```

# [[20 🌟 GM Campaigns/🐌 Slugblaster/Groups/👪📚 Group Database|🧑‍🤝‍🧑 Crowds]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name",
	Summary AS "Summary"
from "20 🌟 GM Campaigns/🐌 Slugblaster/Groups"
WHERE contains(Type, "Crowd")
SORT file.name
```

# 🎲 Generators
```dataview
TABLE WITHOUT ID 
	link(file.path, displayname) AS "Name",
	gen1 AS "gen1",
	gen2 AS "gen2"
from "20 🌟 GM Campaigns/🐌 Slugblaster/Generators"
WHERE Show = True
SORT file.name
```


# 🗺️ Map

```leaflet
id: slugblaster-map
image: [[Multiverse map.png]]
height: 500px
lat: 50
long: 50
minZoom: 1
maxZoom: 3
defaultZoom: 1
unit: meters
scale: 1
darkMode: true
```

# [[🏠 World Database|🌎 Worlds]]
```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name",
	Pernounced AS "Pernounced",
	Notes AS "Notes"
from "20 🌟 GM Campaigns/🐌 Slugblaster/Worlds"
WHERE contains(NoteIcon, "World")
SORT file.name
```
