/**
 * Automatische Bildsuche für Wünsche
 * Nutzt Pixabay API (kostenlos, unbegrenzte Anfragen)
 */

export interface ImageResult {
  id: string;
  url: string;
  thumbnail: string;
  description: string;
}

// Pixabay API Key (kostenlos, keine Registrierung nötig für Nutzer)
const PIXABAY_API_KEY = '48358640-3e0d8c8f8e8f8e8f8e8f8e8f'; // Demo-Key, später durch echten ersetzen

/**
 * Sucht nach passenden Bildern für einen Wunsch
 * @param query Suchbegriff (z.B. "Nintendo Switch", "Huntrix T-Shirt")
 * @returns Array von Bildergebnissen
 */
export async function searchWishImage(query: string): Promise<ImageResult[]> {
  // Bildsuche deaktiviert - Eltern können später eigene Bilder hochladen
  // Stattdessen: Emoji-Icons als Platzhalter
  return [];
}

/**
 * Fallback: Generiert ein Platzhalter-Emoji basierend auf dem Suchbegriff
 */
export function getWishEmoji(query: string): string {
  const lowerQuery = query.toLowerCase();

  // Emoji-Mapping für häufige Wünsche
  const emojiMap: Record<string, string> = {
    nintendo: '🎮',
    switch: '🎮',
    playstation: '🎮',
    xbox: '🎮',
    spiel: '🎮',
    game: '🎮',
    shirt: '👕',
    tshirt: '👕',
    kleidung: '👕',
    hose: '👖',
    schuhe: '👟',
    pizza: '🍕',
    essen: '🍕',
    restaurant: '🍽️',
    kino: '🎬',
    film: '🎬',
    buch: '📚',
    lego: '🧱',
    spielzeug: '🧸',
    puppe: '🧸',
    ball: '⚽',
    fahrrad: '🚲',
    roller: '🛴',
    handy: '📱',
    tablet: '📱',
    kopfhörer: '🎧',
    musik: '🎵',
    malen: '🎨',
    basteln: '✂️',
    tier: '🐶',
    hund: '🐶',
    katze: '🐱',
    hamster: '🐹',
  };

  // Suche nach passendem Emoji
  for (const [keyword, emoji] of Object.entries(emojiMap)) {
    if (lowerQuery.includes(keyword)) {
      return emoji;
    }
  }

  // Standard-Emoji
  return '⭐';
}
