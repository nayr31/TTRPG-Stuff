**Monsters here:**
```dataview
LIST
from "Monster"
WHERE contains(Habitat, link(this.file.name))
SORT file.name
```
