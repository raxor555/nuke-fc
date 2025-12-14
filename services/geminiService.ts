import { GoogleGenAI } from "@google/genai";
import { AppState, ROSTER_PLAYERS, FORMATION_CONFIG, ScorecardState, MatchDayState } from "../types";

// Strict Face Preservation Rule
const FACE_PRESERVATION_RULE = `
FACE PRESERVATION — NON-NEGOTIABLE
Do NOT alter, enhance, beautify, stylize, morph, regenerate, relight, or reinterpret any player’s face.
Faces must remain 100% identical to the input image, same structure, expression, skin texture, age, and identity.
No AI face correction, no symmetry fixes, no sharpening, no smoothing, no reconstruction.
Treat faces as locked photographic truth. Only global lighting and environment may change around them.
Any deviation from the original face is unacceptable.
`;

// Helper to check API Key
const getAiClient = async () => {
  const win = window as any;
  if (win.aistudio) {
    const hasKey = await win.aistudio.hasSelectedApiKey();
    if (!hasKey) {
       await win.aistudio.openSelectKey();
    }
  }
  
  // Access VITE_API_KEY safely for Vite/Vercel environment
  // Using (import.meta as any) to avoid TypeScript errors if vite-env types aren't loaded
  const apiKey = (import.meta as any).env?.VITE_API_KEY;
  
  if (!apiKey) {
      throw new Error("API Key missing. Please ensure VITE_API_KEY is set in your Vercel Environment Variables.");
  }
  
  return new GoogleGenAI({ apiKey });
}

export const generateLineupImage = async (state: AppState): Promise<string> => {
  const ai = await getAiClient();

  // Construct the Prompt
  const romanNumeral = state.mode === '5v5' ? 'V' : 'VI';
  
  let playersListString = "";
  
  // Map slots to actual strings with roles
  state.slots.forEach((slot, index) => {
    let pName = "";
    let pNum = "";

    if (slot.playerType === 'roster' && slot.rosterId) {
      const p = ROSTER_PLAYERS.find(rp => rp.id === slot.rosterId);
      if (p) {
        pName = p.name.toUpperCase();
        pNum = p.number;
      }
    } else if (slot.playerType === 'custom') {
      pName = (slot.customName || "PLAYER").toUpperCase();
      pNum = slot.customNumber || "00";
    }

    // Determine Role
    let role = "Player";
    if (index === 0) {
      role = "Goalkeeper";
    } else {
      const outfieldRoles = FORMATION_CONFIG[state.formation];
      if (outfieldRoles && outfieldRoles[index - 1]) {
        role = outfieldRoles[index - 1];
      }
    }

    if (pName) {
        playersListString += `Position: ${role} - Name: ${pName} [${pNum}]\n`;
    }
  });

  const venueText = `${state.venue.toUpperCase()} • NUKE FC 2025`;
  
  const imagesToBESent: string[] = [];
  let imageInstructions = "";
  let imgCount = 0;
  
  if (state.logoBase64) {
    imgCount++;
    imagesToBESent.push(state.logoBase64);
    imageInstructions += `IMAGE ${imgCount}: This is the Team Logo. Use it as the central crest or emblem on the jerseys and graphic. `;
  }
  
  if (state.referenceImageBase64) {
    imgCount++;
    imagesToBESent.push(state.referenceImageBase64);
    imageInstructions += `IMAGE ${imgCount}: This is a STYLE REFERENCE. Strictly mimic this image's lighting, color grading, texture, and overall mood. Do not copy the specific content/people, but apply its aesthetic style to the generated lineup. `;
  }
  
  const logoDescription = state.logoBase64 
    ? "The attached team logo integrated realistically." 
    : "A stylized, golden fire-breathing dragon emblem or motif subtly integrated into the background or as a central crest.";

  const prompt = `
    Create a hyper-realistic, luxury football editorial graphic (poster format, aspect ratio 3:4).

    INPUT IMAGES CONTEXT:
    ${imageInstructions}

    BRAND IDENTITY:
    Team Name: Nuke FC.
    Colors: Deep Emerald Green (#046A38), Metallic Gold (#D4AF37), Charcoal Black (#0F172A), Pure White.
    Vibe: EA Sports FC Ultimate Team card meets Vogue Magazine. High fashion, dramatic lighting, premium textures.
    Central visual element: ${logoDescription}

    COMPOSITION:

    HEADER:
    A professional, high-end typographic layout at the top.
    It must read: "STARTING ${romanNumeral}" (e.g. STARTING V or STARTING VI).
    Style: The word "STARTING" should be in a sleek, condensed sans-serif font (like Oswald), tracked wide (spaced out). 
    The Roman Numeral "${romanNumeral}" should be larger, bold, and Metallic Gold (serif or block style), positioned prominently next to or below "STARTING".
    The header must look like an official broadcast or Instagram editorial graphic title.

    MAIN CONTENT: 
    A realistic football pitch viewed from a top-down or slight isometric perspective with jerseys arranged in a ${state.formation} formation.
    Jersey Design: Premium white home jerseys with emerald green accents and gold trim.
    Jersey Details: Each jersey displays the player's name and number on the back in the exact typography style of professional football kits.
    Formation: The jerseys must be positioned according to a ${state.formation} tactical formation on a photorealistic pitch.
    
    PLAYER ROLES & POSITIONS: 
    ${playersListString}
    Ensure the player jerseys are arranged logically on the pitch according to their defined roles (Goalkeeper in goal, Defenders at back, etc.).

    Visual Effects: Subtle shadows beneath each jersey, realistic fabric texture, and proper depth perspective.
    
    FOOTER: 
    Small, elegant text at the very bottom saying: "${venueText}".

    ATMOSPHERE:
    Dark, moody stadium atmosphere with dramatic lighting focused on the pitch.
    Emerald green smoke or mist rising from the pitch edges.
    Gold particles floating in the air above the jerseys.
    The jerseys and text must be legible, sharp, and look like professional graphic design elements.
    Focus on creating a premium, editorial "Lineup Reveal" graphic that showcases the team formation through realistic kit visualization.

    ${FACE_PRESERVATION_RULE}
  `;

  return await callGemini(ai, prompt, imagesToBESent);
};

export const generateScorecardImage = async (state: ScorecardState): Promise<string> => {
  const ai = await getAiClient();

  // Basic Match Context
  const nScore = parseInt(state.nukeScore) || 0;
  const oScore = parseInt(state.opponentScore) || 0;
  
  let matchResult = "DRAW";
  if (nScore > oScore) matchResult = "VICTORY";
  else if (oScore > nScore) matchResult = "DEFEAT";

  // Build Vertical Lists for Scorers
  const nukeScorersList = state.nukeGoalDetails
    .map(d => {
        const p = ROSTER_PLAYERS.find(rp => rp.id === d.playerId);
        return p ? `${p.name} ${d.minute}'` : null;
    })
    .filter(Boolean)
    .join('\n');

  // Parse opponent scorers
  const opponentScorersList = state.opponentScorers.split(',').map(s => s.trim()).filter(Boolean).join('\n');

  // Image Handling Logic
  const imagesToSend: string[] = [];
  let imageContextInstructions = "";
  let imgIndex = 0;

  // 1. Match Photo (Required)
  if (state.matchPhotoBase64) {
    imgIndex++;
    imagesToSend.push(state.matchPhotoBase64);
    imageContextInstructions += `IMAGE ${imgIndex}: MAIN MATCH PHOTO (Landscape). DO NOT CROP SIDES. Fit width to canvas, fill vertical space with design.\n`;
  }

  // 2. Nuke Logo
  let nukeLogoInstruction = "Use a stylized Golden Dragon emblem for Nuke FC.";
  if (state.nukeLogoBase64) {
    imgIndex++;
    imagesToSend.push(state.nukeLogoBase64);
    imageContextInstructions += `IMAGE ${imgIndex}: NUKE FC TEAM LOGO. Place this near the Nuke FC score.\n`;
    nukeLogoInstruction = `Use Input Image ${imgIndex} as the Nuke FC Logo.`;
  }

  // 3. Opponent Logo
  let opponentLogoInstruction = "Generate a GENERIC, modern football club crest for the opponent (e.g., a shield with stripes).";
  if (state.opponentLogoBase64) {
    imgIndex++;
    imagesToSend.push(state.opponentLogoBase64);
    imageContextInstructions += `IMAGE ${imgIndex}: OPPONENT TEAM LOGO. Place this near the Opponent score.\n`;
    opponentLogoInstruction = `Use Input Image ${imgIndex} as the Opponent Logo.`;
  }

  // 4. Reference Style
  if (state.referenceImageBase64) {
    imgIndex++;
    imagesToSend.push(state.referenceImageBase64);
    imageContextInstructions += `IMAGE ${imgIndex}: STYLE REFERENCE. Mimic the lighting, overlay style, and mood of this image.\n`;
  }

  const prompt = `
   Hyper-realistic luxury Premier League broadcast-style "FULL TIME" vertical social media graphic, 1080x1350, 3:4 aspect ratio, 8K cinematic detail, perfect composition.

INPUT IMAGE HANDLING:
Use the supplied landscape match photo (Image 1) as the hero image. Seamlessly outpaint/extend the top and bottom with deep emerald green #046A38 and charcoal textured smoke, subtle carbon-fibre mesh and volumetric light rays to perfectly fill the 3:4 canvas. Zero visible seams or empty space.

BRAND & LIGHTINGNuke FC official colours: Deep Emerald Green (#046A38), Metallic Gold (#D4AF37), Matte Black, Pure White.
If ${matchResult} = VICTORY → warm golden flares, lens streaks and subtle fire particles.
If ${matchResult} = DEFEAT or DRAW → cold dramatic emerald rim lighting and high-contrast mood.

TYPOGRAPHY (exact fonts only)
- "FULL TIME" and scores: Teko Bold, metallic gold with chrome bevel and inner glow
- All names and subtext: Oswald Medium/Bold

LAYOUT — TOP TO BOTTOM

1. TOP EXTENSION (dark emerald-to-black gradient with smoke)
   • Massive centred "FULL TIME" in molten metallic gold Teko, extreme wide tracking
   • Below in white Oswald: "${state.matchType || "MATCH DAY"}"

2. HERO MATCH PHOTO
   • Full-width landscape action photo, perfectly blended into the extended areas
   • Subtle dark vignette drawing eye to centre

3. CENTRED GLASS-MORPHISM SCOREBOARD PANEL
   • Semi-transparent dark panel with soft blur and thin gold border floating over the image
   • Left: Nuke FC golden dragon logo → ${nukeLogoInstruction}
   • Right: Opponent crest → ${opponentLogoInstruction}
   • Centre: huge metallic-gold Teko numbers ${nScore} – ${oScore} with real chrome reflections and 3D extrusion

4. SCORERS (clean vertical lists directly under each logo, Oswald white)
   Nuke FC:
   ${nukeScorersList || "-"}
   
   ${state.opponentName || "OPPONENT"}:
   ${opponentScorersList || "-"}

5. BOTTOM EXTENSION (deep emerald-to-black with subtle dragon-scale texture)
   • Centred footer in small metallic-gold: "NUKE FC 2025"
 
${FACE_PRESERVATION_RULE}

FINISHING
- Photorealistic logo integration and lighting
- Luxury broadcast lens flares, anamorphic streaks, subtle film grain
- Perfect alignment, hierarchy and breathing room
- Zero cartoon or cheap effects — pure high-end editorial sports aesthetic
  `;

  return await callGemini(ai, prompt, imagesToSend);
};

export const generateMatchDayImage = async (state: MatchDayState): Promise<string> => {
  const ai = await getAiClient();

  const imagesToSend: string[] = [];
  let imgContext = "";
  let index = 0;

  // Add 3 Players
  const players = [
      { img: state.player1Image, id: state.player1Id }, 
      { img: state.player2Image, id: state.player2Id }, 
      { img: state.player3Image, id: state.player3Id }
  ];
  
  players.forEach((p, i) => {
    if (p.img) {
      index++;
      imagesToSend.push(p.img);
      const rosterPlayer = ROSTER_PLAYERS.find(rp => rp.id === p.id);
      const name = rosterPlayer ? rosterPlayer.name.toUpperCase() : `PLAYER ${i + 1}`;
      imgContext += `IMAGE ${index}: Source photo for ${name}. CRITICAL: You MUST use this exact face. Perform a high-fidelity face swap. Do not alter their facial features. Preserve identity 100%.\n`;
    }
  });

  // Handle Kit Image
  let kitInstruction = "They MUST be wearing Nuke FC Kits: White/Gold Home Jersey with GREEN SHORTS.";
  if (state.kitImageBase64) {
    index++;
    imagesToSend.push(state.kitImageBase64);
    imgContext += `IMAGE ${index}: TEAM KIT REFERENCE. This is the exact jersey design. \n`;
    kitInstruction = `They MUST be wearing the jersey shown in IMAGE ${index}. Replicate its pattern, colors, and logos exactly. IMPORTANT: Regardless of the image, ensure they are wearing GREEN SHORTS.`;
  }

  const prompt = `
    Create a gritty, high-energy "MATCH DAY" poster (vertical 1080x1350) for Nuke FC.
    
    STYLE REFERENCE:
    Aesthetics: Urban collage, mixed media, ripped paper textures, tape overlays, and grunge aesthetics. Think "Nike Write the Future" meets underground punk zine.
    Palette: Deep Emerald Green (#046A38), Black, White, and splashes of Metallic Gold.
    
    INPUT IMAGES:
    ${imgContext}
    
    COMPOSITION:
    
    1. THE PLAYERS / TEAM GEAR (Left/Center focus):

    If player source images are provided in INPUT IMAGES above: 
    - Create a vertical stack or dynamic cluster of 3 players based on the Input Images provided.
    - IDENTITY: Strictly preserve the faces of the uploaded players. This is a face-swap request.
    - ATTIRE: ${kitInstruction}
    - Style: Present them as cut-out figures or "polaroid" snapshots taped onto the background.
    - Poses: Arms crossed, pointing, or shouting - aggressive & passionate match day energy.

    If NO player source images are provided:
    - Depict a realistic locker room scene. A Nuke FC jersey (deep emerald green with gold accents, matching the specified kit style) is folded over a wooden bench, next to a pair of worn football boots and a duffel bag. The items are draped with ripped tape and paper textures.
    
    2. TYPOGRAPHY (Right/Top focus):
    - Massive, distressed, texture-heavy text reading "GAME DAY".
    - Font style: Heavy condensed sans-serif (like Oswald/Teko) with a spray-paint or stencil effect.
    - Color: White or Gold with grunge overlay.
    - Overlap the text slightly with the player images for depth.
    
    3. MATCH DETAILS (Bottom or Corners):
    - "VS ${state.opponentName.toUpperCase()}" (Use a bold, aggressive font).
    - Venue: "${state.venue.toUpperCase()}" written in smaller technical text (like a ticket stub).
    - Time: "${state.time}" prominently displayed (e.g. inside a circle or box).
    - Date: "${state.date.toUpperCase()}" handwritten effect.
    
    4. LOGOS:
    - Integrate the Nuke FC Golden Dragon logo.
    - Integrate a generic crest for the opponent "${state.opponentName}".
    - Place them centrally or fighting each other in the layout.
    
    BACKGROUND:
    - Dark, textured surface (concrete or locker room wall).
    - Ripped green paper layers revealing gold foil underneath.
    - Tape strips holding the composition together.
    
    FINAL POLISH:
    - Add noise, film grain, and scratches.
    - High contrast lighting.
    - The image should feel raw, intense, and handmade but professional.

    ${FACE_PRESERVATION_RULE}
  `;

  return await callGemini(ai, prompt, imagesToSend);
}

// Shared helper to call the API
async function callGemini(ai: any, prompt: string, images: string[]): Promise<string> {
  try {
    const parts: any[] = [];
    
    // Add all images to parts
    for (const base64Str of images) {
        if (!base64Str) continue;
        const base64Data = base64Str.split(',')[1];
        const mimeMatch = base64Str.match(/:(.*?);/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
        parts.push({ inlineData: { mimeType: mimeType, data: base64Data } });
    }

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: parts },
      config: {
        imageConfig: {
          aspectRatio: "3:4",
          imageSize: "1K"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data found in response");

  } catch (err: any) {
    console.error("Gemini Image Gen Error:", err);
    throw new Error(err.message || "Failed to generate image");
  }
}