// Corporate Demo Team Images
// ===========================
//
// Yönetim ekibi görselleri:
// - team-1.webp (CEO - Ahmet Yılmaz)
// - team-2.webp (CFO - Elif Demir)
// - team-3.webp (CTO - Mehmet Kaya)
//
// Önerilen boyut: 200x200px (1:1 kare, yuvarlak görünecek)

import team1 from './team-1.webp';
import team2 from './team-2.webp';
import team3 from './team-3.webp';

export const teamImages: Record<string, string> = {
  'team-1': team1,
  'team-2': team2,
  'team-3': team3,
};

export const getTeamImage = (teamId: string): string | null => {
  return teamImages[teamId] || null;
};
