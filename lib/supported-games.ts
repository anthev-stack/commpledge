// Supported games that can run community servers
// Format: { name: "Display Name", type: "gamedig-type", defaultPort: number }

export const SUPPORTED_GAMES = [
  // Popular FPS Games
  { name: "Counter-Strike 2", type: "cs2", defaultPort: 27015 },
  { name: "Counter-Strike: Global Offensive", type: "csgo", defaultPort: 27015 },
  { name: "Counter-Strike: Source", type: "css", defaultPort: 27015 },
  { name: "Counter-Strike 1.6", type: "cs16", defaultPort: 27015 },
  { name: "Team Fortress 2", type: "tf2", defaultPort: 27015 },
  { name: "Left 4 Dead 2", type: "l4d2", defaultPort: 27015 },
  { name: "Insurgency: Sandstorm", type: "insurgency", defaultPort: 27102 },
  { name: "Squad", type: "squad", defaultPort: 27165 },
  { name: "Post Scriptum", type: "postscriptum", defaultPort: 10027 },
  { name: "Hell Let Loose", type: "hll", defaultPort: 27165 },
  { name: "Pavlov VR", type: "pavlov", defaultPort: 9100 },
  
  // Survival/Sandbox Games
  { name: "Minecraft: Java Edition", type: "minecraft", defaultPort: 25565 },
  { name: "Minecraft: Bedrock Edition", type: "minecraftbe", defaultPort: 19132 },
  { name: "Rust", type: "rust", defaultPort: 28015 },
  { name: "ARK: Survival Evolved", type: "arkse", defaultPort: 27015 },
  { name: "ARK: Survival Ascended", type: "asa", defaultPort: 7777 },
  { name: "7 Days to Die", type: "7d2d", defaultPort: 26900 },
  { name: "Valheim", type: "valheim", defaultPort: 2456 },
  { name: "V Rising", type: "vrising", defaultPort: 9876 },
  { name: "Conan Exiles", type: "conanexiles", defaultPort: 27015 },
  { name: "DayZ", type: "dayz", defaultPort: 2302 },
  { name: "SCUM", type: "scum", defaultPort: 7042 },
  { name: "The Forest", type: "theforest", defaultPort: 27015 },
  { name: "Terraria", type: "terraria", defaultPort: 7777 },
  { name: "Starbound", type: "starbound", defaultPort: 21025 },
  
  // Battle Royale
  { name: "Battlefield 4", type: "bf4", defaultPort: 25200 },
  { name: "Battlefield 1", type: "bf1", defaultPort: 25200 },
  { name: "Battlefield V", type: "bfv", defaultPort: 25200 },
  
  // Racing
  { name: "Assetto Corsa", type: "assettocorsa", defaultPort: 9600 },
  { name: "Assetto Corsa Competizione", type: "acc", defaultPort: 9232 },
  { name: "Project Cars 2", type: "projectcars2", defaultPort: 27015 },
  { name: "BeamMP (BeamNG.drive)", type: "beammp", defaultPort: 30814 },
  
  // RPG/MMO
  { name: "Garry's Mod", type: "garrysmod", defaultPort: 27015 },
  { name: "Unturned", type: "unturned", defaultPort: 27015 },
  { name: "Eco", type: "eco", defaultPort: 3000 },
  { name: "Project Zomboid", type: "projectzomboid", defaultPort: 16261 },
  
  // Tactical/Mil-Sim
  { name: "ArmA 3", type: "arma3", defaultPort: 2302 },
  { name: "ArmA 2", type: "arma2", defaultPort: 2302 },
  { name: "Rising Storm 2: Vietnam", type: "rs2vietnam", defaultPort: 27102 },
  
  // Space/Sci-Fi
  { name: "Space Engineers", type: "spaceengineers", defaultPort: 27016 },
  { name: "Empyrion", type: "empyrion", defaultPort: 30000 },
  { name: "Satisfactory", type: "satisfactory", defaultPort: 15777 },
  
  // Other Popular
  { name: "FiveM (GTA V)", type: "fivem", defaultPort: 30120 },
  { name: "Killing Floor 2", type: "killingfloor2", defaultPort: 7777 },
  { name: "Mordhau", type: "mordhau", defaultPort: 7777 },
  { name: "Chivalry 2", type: "chivalry2", defaultPort: 7777 },
  { name: "Sons of The Forest", type: "sotf", defaultPort: 8766 },
]

export function getGameByType(type: string) {
  return SUPPORTED_GAMES.find(game => game.type === type)
}

export function getGameByName(name: string) {
  return SUPPORTED_GAMES.find(game => game.name === name)
}
