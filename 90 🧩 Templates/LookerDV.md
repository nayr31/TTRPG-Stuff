```dataview
TABLE WITHOUT ID 
	link(file.path, name) AS "Name",
	embed(Art) AS "Art"
from "Folder"
WHERE contains(NoteIcon, "XXXXX")
SORT file.name
```