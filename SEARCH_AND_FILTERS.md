# 🔍 Search & Filter System

## Overview

Comprehensive search and filtering system for the `/servers` page with game-specific tags, region filtering, and smart search.

---

## ✨ Features

### 1. **Search Bar**
- Search servers by name
- Real-time filtering as you type
- Case-insensitive search

### 2. **Game Type Filter**
- Dropdown with 50+ supported games
- Organized by categories (FPS, Survival, Racing, etc.)
- Shows only selected game type

### 3. **Region Filter**
- 7 global regions:
  - North America
  - Europe
  - Asia
  - Oceania
  - South America
  - Africa
  - Middle East

### 4. **Dynamic Tag System**
- **Game-specific tags** appear based on filtered servers
- Multi-select tag buttons
- Tags update dynamically based on current filters

---

## 🎮 Game-Specific Tags

Each game has unique, relevant tags:

### Minecraft
- Survival, Creative, Adventure, Minigames
- Skyblock, Prison, Factions, Towny
- Economy, PvP, PvE, Hardcore
- Modded, Vanilla, RPG, Parkour, Roleplay

### Counter-Strike 2
- Competitive, Casual, Deathmatch
- 1v1, Surf, Bhop
- Jailbreak, Zombie Escape, Retake
- Arena, Community

### Rust
- Vanilla, Modded, PvP, PvE
- Solo/Duo/Trio, No BP Wipe
- High Pop, Low Pop
- Roleplay, Battlefield

### Garry's Mod
- DarkRP, TTT, Prop Hunt
- Murder, Sandbox, Roleplay

### FiveM (GTA V)
- Roleplay, Racing, Deathmatch
- Cops and Robbers
- Serious RP, Casual RP

...and 45+ more games with custom tags!

---

## 🎨 Server Creation

### New Fields:

**Region Selector:**
```
Server Region
[Dropdown: North America]
```
- Required for better filtering
- Helps players find low-latency servers

**Game-Specific Tags:**
```
Server Tags (Select all that apply)
┌─────────────┬─────────────┬─────────────┐
│  Survival   │  Creative   │  Minigames  │
│  [Selected] │  [  Not  ]  │  [Selected] │
└─────────────┴─────────────┴─────────────┘
```
- Tags change based on selected game type
- Multi-select with visual feedback
- Shows selected tags summary

---

## 🔧 How It Works

### Server Owner Flow:

1. **Create Server**
   - Select game type
   - Tags dynamically load for that game
   - Select region
   - Choose relevant tags

2. **Tags Saved**
   - Server appears in search results
   - Tags shown on server card
   - Filterable by all selected tags

### Player Flow:

1. **Browse Servers** (`/servers`)
   - See all servers by default

2. **Search**
   - Type server name → instant results

3. **Filter by Game**
   - Select game → see only that game

4. **Filter by Region**
   - Select region → servers in that area

5. **Filter by Tags**
   - Click tags → servers with ALL selected tags
   - Tags update based on current results

6. **Clear Filters**
   - One-click reset to see all servers

---

## 📊 Database Schema

```prisma
model Server {
  // ... existing fields
  region  String?  // Server region
  tags    String[] @default([]) // Array of tags
  
  @@index([gameType])
  @@index([region])
}
```

**Migration Required:**
- Adds `region` column (nullable string)
- Adds `tags` column (array of strings, default empty)
- Creates indexes for fast filtering

---

## 🎯 Filter Logic

### Search Priority:
1. Server name match
2. Case-insensitive
3. Partial matches allowed

### Multiple Filters (AND logic):
```
Search: "Survival"
Game: "Minecraft: Java Edition"
Region: "North America"
Tags: ["PvP", "Modded"]

Result: Minecraft servers in NA with PvP AND Modded tags, 
        with "Survival" in the name
```

### Tag Filtering:
- **Selected tags = AND condition**
- Must have ALL selected tags
- Not OR (any tag) logic

---

## 🚀 Performance

### Optimizations:
- **Client-side filtering** for instant results
- **Database indexes** on gameType and region
- **Array operations** for tag matching
- **Dynamic tag list** only shows relevant tags

### Benefits:
- No page reloads
- Instant filter updates
- Smooth user experience
- Scales with many servers

---

## 💡 Examples

### Example 1: Find Modded Minecraft Servers
```
1. Select Game: "Minecraft: Java Edition"
2. Click Tags: "Modded", "Survival"
3. Select Region: "North America"

Result: Only modded survival servers in NA
```

### Example 2: Find Competitive FPS
```
1. Select Game: "Counter-Strike 2"
2. Click Tag: "Competitive"
3. Search: "Dust"

Result: CS2 competitive servers with "Dust" in name
```

### Example 3: Browse Roleplay Servers
```
1. Click Tag: "Roleplay"
   (Shows all games with roleplay servers)
2. Review different game types
3. Select one to narrow down
```

---

## 📈 Stats Display

Each server card shows:
- **Game Type** & **Region**
- **Up to 3 tags** (+ count if more)
- **Player count** (if live stats enabled)
- **Pledger count**
- **Funding progress**
- **Optimization savings**

---

## 🎨 UI Components

### Filter Bar (Top of Page):
- Clean white card
- Search input
- Two dropdown filters
- Dynamic tag pills
- Clear filters button
- Results count

### Server Cards:
- Game/region badges
- Tag pills (color-coded)
- Progress bars
- Owner info
- Hover effects

---

## 🔮 Future Enhancements

Potential additions:
- **Sort options** (Most funded, Most recent, Most players)
- **Save filters** (User preferences)
- **Tag categories** (Gameplay, Difficulty, Style)
- **Advanced search** (Cost range, pledge count)
- **Map/location view** (Visual region selection)
- **Recommended servers** (Based on preferences)

---

## 🎉 Complete!

Your server browser now has:
- ✅ Smart search
- ✅ Game type filtering
- ✅ Region filtering  
- ✅ 17+ game-specific tag sets
- ✅ Multi-tag filtering
- ✅ Dynamic tag updates
- ✅ Clean UI
- ✅ Instant results

Players can now easily find exactly the servers they want! 🎮

