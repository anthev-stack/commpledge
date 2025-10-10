// Game-specific tags for server categorization

export const REGIONS = [
  "North America",
  "Europe",
  "Asia",
  "Oceania",
  "South America",
  "Africa",
  "Middle East",
]

export const GAME_TAGS: Record<string, string[]> = {
  // Minecraft
  "Minecraft: Java Edition": [
    "Survival",
    "Creative",
    "Adventure",
    "Minigames",
    "Skyblock",
    "Prison",
    "Factions",
    "Towny",
    "Economy",
    "PvP",
    "PvE",
    "Hardcore",
    "Modded",
    "Vanilla",
    "RPG",
    "Parkour",
    "Roleplay",
  ],
  "Minecraft: Bedrock Edition": [
    "Survival",
    "Creative",
    "Adventure",
    "Minigames",
    "Skyblock",
    "Prison",
    "Economy",
    "PvP",
    "PvE",
    "Roleplay",
  ],
  
  // Counter-Strike
  "Counter-Strike 2": [
    "Competitive",
    "Casual",
    "Deathmatch",
    "1v1",
    "Surf",
    "Bhop",
    "Jailbreak",
    "Zombie Escape",
    "Retake",
    "Arena",
    "Community",
  ],
  "Counter-Strike: Global Offensive": [
    "Competitive",
    "Casual",
    "Deathmatch",
    "1v1",
    "Surf",
    "Bhop",
    "Jailbreak",
    "Zombie Escape",
    "Retake",
    "Arena",
    "Community",
  ],
  "Counter-Strike: Source": [
    "Deathmatch",
    "Surf",
    "Bhop",
    "Jailbreak",
    "Zombie Mod",
    "GunGame",
  ],
  
  // Other FPS
  "Team Fortress 2": [
    "Casual",
    "Competitive",
    "MvM",
    "Trading",
    "Surf",
    "Jump",
    "Randomizer",
    "x10",
  ],
  "Left 4 Dead 2": [
    "Campaign",
    "Versus",
    "Survival",
    "Scavenge",
    "Modded",
  ],
  
  // Survival Games
  "Rust": [
    "Vanilla",
    "Modded",
    "PvP",
    "PvE",
    "Solo/Duo/Trio",
    "No BP Wipe",
    "High Pop",
    "Low Pop",
    "Roleplay",
    "Battlefield",
  ],
  "ARK: Survival Evolved": [
    "PvP",
    "PvE",
    "Modded",
    "Vanilla",
    "Boosted Rates",
    "Cluster",
    "Roleplay",
  ],
  "ARK: Survival Ascended": [
    "PvP",
    "PvE",
    "Modded",
    "Vanilla",
    "Boosted Rates",
    "Cluster",
    "Roleplay",
  ],
  "7 Days to Die": [
    "PvP",
    "PvE",
    "Modded",
    "Vanilla",
    "Hardcore",
  ],
  "Valheim": [
    "PvP",
    "PvE",
    "Modded",
    "Vanilla",
    "Casual",
  ],
  "V Rising": [
    "PvP",
    "PvE",
    "Full Loot",
    "Casual",
    "Hardcore",
  ],
  "Conan Exiles": [
    "PvP",
    "PvE",
    "PvE-C",
    "Modded",
    "Roleplay",
  ],
  "DayZ": [
    "PvP",
    "PvE",
    "Roleplay",
    "Modded",
    "Vanilla",
    "High Loot",
  ],
  "SCUM": [
    "PvP",
    "PvE",
    "Roleplay",
    "High Loot",
  ],
  "The Forest": [
    "Co-op",
    "PvP",
    "Survival",
  ],
  "Sons of The Forest": [
    "Co-op",
    "PvP",
    "Survival",
  ],
  
  // Tactical/Mil-Sim
  "Squad": [
    "Infantry",
    "Combined Arms",
    "Hardcore",
    "New Player Friendly",
  ],
  "Hell Let Loose": [
    "Tactical",
    "Hardcore",
    "New Player Friendly",
  ],
  "ArmA 3": [
    "Milsim",
    "Roleplay",
    "Zeus",
    "King of the Hill",
    "Exile",
  ],
  "Rising Storm 2: Vietnam": [
    "Campaign",
    "Skirmish",
    "Territories",
  ],
  
  // Other
  "Garry's Mod": [
    "DarkRP",
    "TTT",
    "Prop Hunt",
    "Murder",
    "Sandbox",
    "Roleplay",
  ],
  "Unturned": [
    "PvP",
    "PvE",
    "Roleplay",
    "Vanilla",
    "Modded",
  ],
  "Project Zomboid": [
    "PvP",
    "PvE",
    "Roleplay",
    "Hardcore",
  ],
  "Terraria": [
    "Normal",
    "Expert",
    "Master",
    "Modded",
    "PvP",
  ],
  "FiveM (GTA V)": [
    "Roleplay",
    "Racing",
    "Deathmatch",
    "Cops and Robbers",
    "Serious RP",
    "Casual RP",
  ],
  "Space Engineers": [
    "PvP",
    "PvE",
    "Creative",
    "Survival",
  ],
  "Killing Floor 2": [
    "Survival",
    "Endless",
    "Weekly",
  ],
  "Mordhau": [
    "Deathmatch",
    "Team Deathmatch",
    "Frontline",
    "Invasion",
  ],
  "Chivalry 2": [
    "Team Objective",
    "Free for All",
    "Team Deathmatch",
  ],
  
  // Racing
  "Assetto Corsa": [
    "Racing",
    "Drift",
    "Track Day",
    "Touge",
  ],
  "Assetto Corsa Competizione": [
    "GT Racing",
    "Endurance",
    "Sprint",
  ],
  "BeamMP (BeamNG.drive)": [
    "Freeroam",
    "Racing",
    "Roleplay",
  ],
}

export function getTagsForGame(gameType: string): string[] {
  return GAME_TAGS[gameType] || [
    "PvP",
    "PvE",
    "Casual",
    "Hardcore",
    "Modded",
    "Vanilla",
  ]
}

export function getAllGameTypes(): string[] {
  return Object.keys(GAME_TAGS)
}


