---
layout: default
title: File / Sample Manager
nav_order: 1
parent: WebUI
grand_parent: tbd 16 groovebox
---

# File / Sample Manager

The **File / Sample Manager** is where you browse, upload, and organize all audio content on the **tbd 16**: samples, drum kits, and any other files stored on the device. Reach it from the WebUI top navigation → **Data** tab.

## Layout

The tool is split into two panels:

| Panel | Contents |
|:------|:---------|
| **File Manager** *(left)* | Hierarchical file browser with breadcrumb navigation, upload controls, and a PSRAM memory usage bar. |
| **Kit Editor** *(right)* | Dropdown to pick the active kit, plus Save, New, Delete actions. Toggles between **Banks view** and **JSON editor**. |
{: .dada-minimal-table }

## Uploading files

- **Drag & drop** audio files or folders directly onto the left panel.
- Or click **Upload** → choose files / folders.
- Supported formats: **WAV, MP3, AIFF, OGG, FLAC**.
- The memory usage bar shows PSRAM capacity used by currently loaded samples — color-coded by kit.

## Organizing files

- **Create folders** for your own structure.
- **Sort** by name, duration, or size.
- **Select mode** enables batch operations (move, delete).
- **Breadcrumbs** at the top let you jump back up the tree quickly.

## Viewing and editing

- **Double-click a sample** to open the **File Viewer** — a JSON editor with syntax highlighting for any metadata.
- **Double-click a kit** to open either the **Kit Editor** or the **Track Setup Editor** for detailed configuration.

## Kit management

From the right-hand panel:

- Pick a kit from the dropdown to make it active.
- **Save** the current kit, **New** to create an empty kit, or **Delete** the selected kit.
- Switch between **Banks view** (visual per-bank layout) and the raw **JSON editor**.
- **Export / Import** kit backups as `.json` files.

{: .note }
> The File / Sample Manager edits content on the device's SD card. For safe removal, always power off the **tbd 16** before ejecting the card.
