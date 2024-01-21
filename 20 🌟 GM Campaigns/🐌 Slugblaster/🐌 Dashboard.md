---
cssclasses:
  - cards
  - cards-cols-5
banner: "[[Cover art.jpg]]"
banner_y: 0.673
banner_lock: true
---

# **Goals for this page:**
- [?] Get buttons to change some of these?
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
	- [x] Loots
		- [x] Common
		- [x] Uncommon
		- [x] Rare
		- [x] Phone Charms (weighted)
	- [x] World
- [ ] Worlds (blurb, locations, checkpoints, problems)
	- [x] Clickable map (leaflet)
	- [ ] [[Calorium]]
	- [ ] [[Desnine]]
	- [ ] [[Empyrean]]
	- [ ] [[Hillview]]
	- [ ] [[Operaeblum]]
	- [ ] [[Popularia]]
	- [ ] [[Prismatia]]
	- [ ] [[Quahalia]]
	- [ ] [[The Golden Jungle]]
	- [ ] [[The Waking Pits]]
	- [x] [[Thennis Spar]]
	- [x] [[Vastiche]]
- [x] Monsters


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
