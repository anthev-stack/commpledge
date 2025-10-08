# 🎮 Live Server Stats Feature

## Overview

Community Pledges now queries **real game servers** to display live statistics! Using the industry-standard `gamedig` library, we support 50+ popular games that run community servers.

---

## 🌟 Features

### What's Displayed:

**All Games:**
- ✅ Online/Offline status
- ✅ Current player count / Max players
- ✅ Server ping (latency)

**Game-Specific Info:**

| Game Type | Additional Stats |
|-----------|------------------|
| **Minecraft** | Version, MOTD/Description |
| **Counter-Strike (all)** | Current map, Password protected status |
| **Team Fortress 2** | Current map, Password protected status |
| **Rust** | Server version, Description, Connect URL |
| **ARK** | Server time, Day number |
| **Garry's Mod** | Current map, Password protected status |

---

## 🎯 Supported Games (50+)

### FPS Games
- Counter-Strike 2
- Counter-Strike: Global Offensive
- Counter-Strike: Source
- Counter-Strike 1.6
- Team Fortress 2
- Left 4 Dead 2
- Insurgency: Sandstorm
- Squad
- Hell Let Loose
- Pavlov VR

### Survival/Sandbox
- Minecraft (Java & Bedrock)
- Rust
- ARK: Survival Evolved
- ARK: Survival Ascended
- 7 Days to Die
- Valheim
- V Rising
- Conan Exiles
- DayZ
- SCUM
- The Forest
- Sons of The Forest
- Terraria
- Project Zomboid

### Racing
- Assetto Corsa
- Assetto Corsa Competizione
- BeamMP (BeamNG.drive)

### Tactical/Mil-Sim
- ArmA 3
- Rising Storm 2: Vietnam

### Other
- Garry's Mod
- Unturned
- Space Engineers
- FiveM (GTA V)
- Killing Floor 2
- Mordhau
- Chivalry 2

---

## 🔧 How It Works

### 1. Server Creation
When creating a server, owners:
- Select game from dropdown (50+ options)
- Enter server IP address
- Format: `IP:PORT` or just `IP` (uses default port)
- Example: `play.example.com:25565`

### 2. Live Querying
Every 30 seconds (client-side):
- Frontend calls `/api/servers/[id]/query`
- Backend uses `gamedig` to query the real game server
- Returns live stats (players, map, status, etc.)
- Updates database with current player count

### 3. Display
On `/servers/[id]` page:
- Green badge = Online
- Red badge = Offline
- Shows live player count, map, version (game-dependent)
- Auto-refreshes every 30 seconds
- Manual refresh button available

---

## 📊 Technical Details

### API Endpoint
```
GET /api/servers/[id]/query
```

**Response (Online):**
```json
{
  "online": true,
  "name": "Cameron's Awesome Minecraft Server",
  "map": "world",
  "players": {
    "current": 12,
    "max": 20
  },
  "version": "1.20.1",
  "ping": 45
}
```

**Response (Offline):**
```json
{
  "online": false,
  "error": "Server is offline or unreachable"
}
```

### Component
`<ServerStats serverId={string} gameType={string} />`

**Features:**
- Auto-refreshes every 30 seconds
- Loading skeleton
- Manual refresh button
- Color-coded status (green/red)
- Responsive design

---

## 🎨 UI Display

### Online Server
```
┌─────────────────────────────────────┐
│ Live Server Status       🟢 Online  │
├─────────────────────────────────────┤
│ 👥 Players:           12 / 20       │
│ 🗺️  Map:              de_dust2       │
│ 🏷️  Version:          1.20.1        │
│ ⚡ Ping:              45ms           │
├─────────────────────────────────────┤
│ Updates every 30s    [Refresh Now]  │
└─────────────────────────────────────┘
```

### Offline Server
```
┌─────────────────────────────────────┐
│ Live Server Status       🔴 Offline │
├─────────────────────────────────────┤
│ Server is offline or unreachable    │
├─────────────────────────────────────┤
│ Updates every 30s    [Refresh Now]  │
└─────────────────────────────────────┘
```

---

## 💡 Benefits

### For Server Owners:
- Proves server is online and active
- Shows real player count (not fake)
- Builds trust with potential pledgers
- Automatic updates

### For Pledgers:
- See if server is worth supporting
- Check current player count
- Verify server details
- Make informed pledge decisions

---

## 🚀 Usage

### 1. Create a Server
```
Dashboard → Create Server
↓
Select Game: "Minecraft: Java Edition"
Enter IP: "play.myserver.com:25565"
```

### 2. Server Page
```
/servers/[id]
↓
Live stats appear in sidebar
↓
Auto-refreshes every 30 seconds
```

### 3. Manual Refresh
Click "Refresh Now" button to query immediately

---

## 🔍 Default Ports

| Game | Default Port |
|------|--------------|
| Minecraft Java | 25565 |
| Minecraft Bedrock | 19132 |
| Counter-Strike | 27015 |
| Rust | 28015 |
| ARK | 27015 |
| Garry's Mod | 27015 |
| Valheim | 2456 |
| FiveM | 30120 |

If your server uses a custom port, include it in the IP: `IP:PORT`

---

## 🛠️ Implementation Files

**Key Files:**
- `lib/supported-games.ts` - Game database (50+ games)
- `app/api/servers/[id]/query/route.ts` - Query endpoint
- `components/ServerStats.tsx` - Display component
- `app/dashboard/server/create/page.tsx` - Game dropdown

**Dependencies:**
- `gamedig` - Server query library (supports 200+ games)

---

## 🎯 Future Enhancements

Potential additions:
- Server history graphs (player count over time)
- Uptime percentage tracking
- Server performance metrics
- Map rotation tracking
- Mod/plugin list display
- Server rules display

---

## 📝 Notes

**Important:**
- Server IP must be publicly accessible
- Firewall must allow query port
- Some games require specific query ports (different from game port)
- Offline servers don't affect pledges
- Stats update automatically

**Limitations:**
- Query timeout: 5 seconds
- Refresh interval: 30 seconds
- Requires valid server IP
- Game must be in supported list

---

## 🎉 Impact

**This feature makes Community Pledges the first crowdfunding platform with:**
- ✅ Real-time server verification
- ✅ Live player counts
- ✅ Actual online/offline status
- ✅ Game-specific statistics

**No more fake servers!** All stats are pulled directly from the real game servers. 🚀
