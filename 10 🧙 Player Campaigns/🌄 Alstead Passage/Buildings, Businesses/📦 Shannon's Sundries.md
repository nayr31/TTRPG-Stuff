Owned by [[Shannon Silverhammer|Shannon]], this general store stocks tools, gadgets, basic crafting materials, and anything in between. To help out, he hired [[Earl]].

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
