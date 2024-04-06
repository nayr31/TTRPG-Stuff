Both tavern and bake shop, [[Cindzi Catriona|Cindzi]] and [[Havok Jheraal|Havok]] co-own the place with each managing their respective sides of the business.

**Workers:**

```dataview
TABLE WITHOUT ID
	link(file.path, name) AS "Name", 
	Pronouns AS "Pronouns",
	embed(Art) AS "Art",
	Job AS "Job"
from "10 🧙 Player Campaigns/🌄 Alstead Passage/NPCs"
WHERE contains(Affiliation, link(this.file.name))
SORT file.name
```
