// =====================================================
// ⚙️ EASY SETTINGS - EDIT ONLY THIS SECTION
// =====================================================
const SITE_CONFIG = {
  name: "Shiv Yogi",
  subtitle: "Welcome to my digital space.",
  avatar: "SY",
  status: "Online",
  footer: "Created by Shiv Yogi",

  animationEnabled: true,
  animationIntensity: "ultra",   // "low" | "medium" | "high" | "ultra"

  wallpaperEnabled: true,
  wallpaperIntensity: "high",    // "low" | "medium" | "high"

  randomizeAnimations: true,
  soundEnabled: false,           // never autoplays; starts only after a tap

  messageIntervalSeconds: 7,

  // Colours (hex). Change freely.
  colors: { bg: "#07060f", violet: "#8b5cf6", cyan: "#22d3ee", rose: "#fb7185", text: "#eceaff" }
};

// All 15 slots exist. Empty "" = no URL yet.
const SOCIAL_LINKS = {
  spotify:   "https://open.spotify.com/user/31pib7qeklxtifb7svtcubjynsyq?si=cl33vsPNQKaAkmnEHM320w",
  instagram: "https://www.instagram.com/shiv_yogi.19/?utm_source=ig_web_button_share_sheet",
  facebook:  "https://www.facebook.com/share/1C7d4rEdBi/",
  snapchat:  "https://www.snapchat.com/@shiv-yogi?sender_web_id=4169369a-a953-40da-8ca7-f28dcde294a&device_type=android&is_copy_url=true",
  telegram:  "https://t.me/shiv_yogi_19",
  pinterest: "https://pin.it/RDPl1Zot4",
  line:      "https://tr.ee/wOESlBTCif",
  youtube: "", github: "", whatsapp: "", discord: "",
  linkedin: "", reddit: "", threads: "", website: ""
};

// Only platforms listed here AND having a URL appear. Add a name to show it, remove it to hide it.
const ACTIVE_BUTTONS = ["spotify","instagram","facebook","snapchat","telegram","pinterest","line"];

// Display details for the 15 slots (edit descriptions or colours here).
const PLATFORMS = {
  spotify:{label:"Spotify",desc:"Playlists & listening",c:"#1db954",g:"Sp"},
  instagram:{label:"Instagram",desc:"Photos & stories",c:"#e1306c",g:"Ig"},
  facebook:{label:"Facebook",desc:"Stay connected",c:"#1877f2",g:"Fb"},
  snapchat:{label:"Snapchat",desc:"Snap with me",c:"#fffc00",g:"Sc"},
  telegram:{label:"Telegram",desc:"Message me directly",c:"#29a9eb",g:"Tg"},
  pinterest:{label:"Pinterest",desc:"Ideas & inspiration",c:"#e60023",g:"Pn"},
  line:{label:"LINE",desc:"Chat on LINE",c:"#06c755",g:"Ln"},
  youtube:{label:"YouTube",desc:"Videos",c:"#ff0000",g:"Yt"},
  github:{label:"GitHub",desc:"Code & projects",c:"#a78bfa",g:"Gh"},
  whatsapp:{label:"WhatsApp",desc:"Chat on WhatsApp",c:"#25d366",g:"Wa"},
  discord:{label:"Discord",desc:"Join the server",c:"#5865f2",g:"Dc"},
  linkedin:{label:"LinkedIn",desc:"Professional profile",c:"#0a66c2",g:"In"},
  reddit:{label:"Reddit",desc:"Communities",c:"#ff4500",g:"Rd"},
  threads:{label:"Threads",desc:"Short thoughts",c:"#e5e5e5",g:"Th"},
  website:{label:"Website",desc:"More of my work",c:"#22d3ee",g:"Web"}
};
