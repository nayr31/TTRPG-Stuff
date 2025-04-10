---

database-plugin: basic

---

```yaml:dbfolder
name: RWBY NPC Database
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
    sortIndex: 1
    isSorted: true
    isSortedDesc: false
    width: 105
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
    position: 7
    skipPersist: false
    isHidden: false
    sortIndex: -1
    options:
      - { label: "NPC", value: "NPC", color: "hsl(350, 95%, 90%)"}
      - { label: "Player", value: "Player", color: "hsl(59, 95%, 90%)"}
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
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
  Discipline:
    input: text
    accessorKey: Discipline
    key: Discipline
    id: Role
    label: Discipline
    position: 4
    skipPersist: false
    isHidden: false
    sortIndex: 2
    isSorted: true
    isSortedDesc: false
    width: 112
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
  Homeland:
    input: text
    accessorKey: Homeland
    key: Homeland
    id: Notes
    label: Homeland
    position: 5
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
  Style:
    input: select
    accessorKey: Style
    key: Style
    id: Style
    label: Style
    position: 6
    skipPersist: false
    isHidden: false
    sortIndex: -1
    options:
      - { label: "Medium", value: "Medium", color: "hsl(149,87%,69%)"}
      - { label: "Witch", value: "Witch", color: "hsl(262,96%,90%)"}
      - { label: "Raider", value: "Raider", color: "hsl(332, 95%, 90%)"}
      - { label: "Sharpshooter", value: "Sharpshooter", color: "hsl(58,76%,72%)"}
      - { label: "Sentinel", value: "Sentinel", color: "hsl(233, 95%, 90%)"}
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
  row_templates_folder: /
  current_row_template: 90 🧩 Templates/Player Template.md
  pagination_size: 10
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