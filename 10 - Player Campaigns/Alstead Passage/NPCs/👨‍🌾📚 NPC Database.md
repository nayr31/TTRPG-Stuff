---

database-plugin: basic

---

```yaml:dbfolder
name: NPC Database
description: 
columns:
  __file__:
    key: __file__
    id: __file__
    input: markdown
    label: File
    accessorKey: __file__
    isMetadata: true
    skipPersist: false
    isDragDisabled: false
    csvCandidate: true
    position: 1
    isHidden: false
    sortIndex: 0
    isSorted: true
    isSortedDesc: false
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: true
      task_hide_completed: true
      footer_type: none
      persist_changes: false
  NoteIcon:
    input: select
    accessorKey: NoteIcon
    key: NoteIcon
    id: NoteIcon
    label: NoteIcon
    position: 8
    skipPersist: false
    isHidden: true
    sortIndex: -1
    isSorted: false
    isSortedDesc: true
    options:
      - { label: "NPC", value: "NPC", color: "hsl(350, 95%, 90%)"}
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
  Art:
    input: text
    accessorKey: Art
    key: Art
    id: Art
    label: Art
    position: 3
    skipPersist: false
    isHidden: false
    sortIndex: -1
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
  Pronouns:
    input: select
    accessorKey: Pronouns
    key: Pronouns
    id: Pronouns
    label: Pronouns
    position: 2
    skipPersist: false
    isHidden: false
    sortIndex: -1
    options:
      - { label: "He/Him", value: "He/Him", color: "hsl(278, 95%, 90%)"}
      - { label: "She/Her", value: "She/Her", color: "hsl(217, 95%, 90%)"}
      - { label: "N/A", value: "N/A", color: "hsl(96, 95%, 90%)"}
      - { label: "They/He", value: "They/He", color: "hsl(50, 95%, 90%)"}
      - { label: "They/Them", value: "They/Them", color: "hsl(301, 95%, 90%)"}
      - { label: "He/They", value: "He/They", color: "hsl(34, 95%, 90%)"}
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
  Notes:
    input: text
    accessorKey: Notes
    key: Notes
    id: Notes
    label: Notes
    position: 6
    skipPersist: false
    isHidden: false
    sortIndex: -1
    width: 175
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
      wrap_content: true
  Keys:
    input: text
    accessorKey: Keys
    key: Keys
    id: Keys
    label: Keys
    position: 4
    skipPersist: false
    isHidden: false
    sortIndex: -1
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
  Romancable?:
    input: checkbox
    accessorKey: Romancable?
    key: Romancable?
    id: Romancable?
    label: Romancable?
    position: 5
    skipPersist: false
    isHidden: false
    sortIndex: -1
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
  Affiliation:
    input: select
    accessorKey: Affiliation
    key: Affiliation
    id: Affiliation
    label: Affiliation
    position: 7
    skipPersist: false
    isHidden: false
    sortIndex: -1
    options:
      - { label: "[[🍻 The Vulgar Nun]]", value: "[[🍻 The Vulgar Nun]]", color: "hsl(20, 95%, 90%)"}
      - { label: "[[10 🧙 Player Campaigns/🌄 Alstead Passage/Buildings, Businesses/🍻 The Vulgar Nun.md|🍻 The Vulgar Nun]]", value: "[[10 🧙 Player Campaigns/🌄 Alstead Passage/Buildings, Businesses/🍻 The Vulgar Nun.md|🍻 The Vulgar Nun]]", color: "hsl(102, 95%, 90%)"}
      - { label: "[[📦 Shannon's Sundries]]", value: "[[📦 Shannon's Sundries]]", color: "hsl(20, 95%, 90%)"}
      - { label: "[[10 🧙 Player Campaigns/🌄 Alstead Passage/Buildings, Businesses/📦 Shannon's Sundries.md|📦 Shannon's Sundries]]", value: "[[10 🧙 Player Campaigns/🌄 Alstead Passage/Buildings, Businesses/📦 Shannon's Sundries.md|📦 Shannon's Sundries]]", color: "hsl(167, 95%, 90%)"}
      - { label: "[[🐮 Trysta's Tannery]]", value: "[[🐮 Trysta's Tannery]]", color: "hsl(245, 95%, 90%)"}
      - { label: "[[🥩 A Cut Above]]", value: "[[🥩 A Cut Above]]", color: "hsl(22, 95%, 90%)"}
      - { label: "[[10 🧙 Player Campaigns/🌄 Alstead Passage/Buildings, Businesses/🥩 A Cut Above.md|🥩 A Cut Above]]", value: "[[10 🧙 Player Campaigns/🌄 Alstead Passage/Buildings, Businesses/🥩 A Cut Above.md|🥩 A Cut Above]]", color: "hsl(4, 95%, 90%)"}
      - { label: "[[10 🧙 Player Campaigns/🌄 Alstead Passage/Buildings, Businesses/🐮 Trysta's Tannery.md|🐮 Trysta's Tannery]]", value: "[[10 🧙 Player Campaigns/🌄 Alstead Passage/Buildings, Businesses/🐮 Trysta's Tannery.md|🐮 Trysta's Tannery]]", color: "hsl(205, 95%, 90%)"}
      - { label: "[[💎 Seams and Gleams]]", value: "[[💎 Seams and Gleams]]", color: "hsl(81, 95%, 90%)"}
      - { label: "[[10 🧙 Player Campaigns/🌄 Alstead Passage/Buildings, Businesses/💎 Seams and Gleams.md|💎 Seams and Gleams]]", value: "[[10 🧙 Player Campaigns/🌄 Alstead Passage/Buildings, Businesses/💎 Seams and Gleams.md|💎 Seams and Gleams]]", color: "hsl(81, 95%, 90%)"}
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
      option_source: manual
  Job:
    input: text
    accessorKey: Job
    key: Job
    id: Job
    label: Job
    position: 100
    skipPersist: false
    isHidden: false
    sortIndex: -1
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
config:
  remove_field_when_delete_column: false
  cell_size: normal
  sticky_first_column: true
  group_folder_column: 
  remove_empty_folders: false
  automatically_group_files: false
  hoist_files_with_empty_attributes: true
  show_metadata_created: false
  show_metadata_modified: false
  show_metadata_tasks: false
  show_metadata_inlinks: false
  show_metadata_outlinks: false
  show_metadata_tags: false
  source_data: current_folder
  source_form_result: 
  source_destination_path: /
  row_templates_folder: z_Templates
  current_row_template: 90 🧩 Templates/NPC Template.md
  pagination_size: 30
  font_size: 16
  enable_js_formulas: false
  formula_folder_path: /
  inline_default: false
  inline_new_position: last_field
  date_format: yyyy-MM-dd
  datetime_format: "yyyy-MM-dd HH:mm:ss"
  metadata_date_format: "yyyy-MM-dd HH:mm:ss"
  enable_footer: false
  implementation: default
filters:
  enabled: false
  conditions:
```