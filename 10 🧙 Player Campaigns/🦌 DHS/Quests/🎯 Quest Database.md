---
database-plugin: basic
---

```yaml:dbfolder
name: new database
description: new description
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
    sortIndex: -1
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: true
      task_hide_completed: true
      footer_type: none
      persist_changes: false
  Status:
    input: select
    accessorKey: Status
    key: Status
    id: Status
    label: Status
    position: 2
    skipPersist: false
    isHidden: false
    sortIndex: -1
    width: 138
    options:
      - { label: "✔ Finished", value: "✔ Finished", color: "hsl(62, 95%, 90%)"}
      - { label: "❓ In Progress", value: "❓ In Progress", color: "hsl(101, 95%, 90%)"}
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
  NoteIcon:
    input: select
    accessorKey: NoteIcon
    key: NoteIcon
    id: NoteIcon
    label: NoteIcon
    position: 5
    skipPersist: false
    isHidden: false
    sortIndex: -1
    options:
      - { label: "Quest", value: "Quest", color: "hsl(267, 95%, 90%)"}
    config:
      enable_media_view: true
      link_alias_enabled: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
      footer_type: none
      persist_changes: false
  Type:
    input: select
    accessorKey: Type
    key: Type
    id: Type
    label: Type
    position: 4
    skipPersist: false
    isHidden: false
    sortIndex: -1
    options:
      - { label: "❗ Main ❗", value: "❗ Main ❗", color: "hsl(2, 95%, 90%)"}
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
  Summary:
    input: text
    accessorKey: Summary
    key: Summary
    id: Summary
    label: Summary
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
config:
  remove_field_when_delete_column: false
  cell_size: normal
  sticky_first_column: false
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
  current_row_template: 
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