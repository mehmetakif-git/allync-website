// Demo Thumbnails
// ================

import whatsappThumb from './whatsapp.webp';
import instagramThumb from './instagram.webp';
import textToVideoThumb from './text-to-video.webp';
import textToImageThumb from './text-to-image.webp';
import voiceCloningThumb from './voice-cloning.webp';
import documentAiThumb from './document-ai.webp';
import imageToVideoThumb from './image-to-video.webp';
import videoToVideoThumb from './video-to-video.webp';
import dataAnalysisThumb from './data-analysis.webp';
import customAiThumb from './custom-ai.webp';

export const demoThumbnails: Record<string, string | null> = {
  'whatsapp': whatsappThumb,
  'instagram': instagramThumb,
  'text-to-video': textToVideoThumb,
  'text-to-image': textToImageThumb,
  'voice-cloning': voiceCloningThumb,
  'document-ai': documentAiThumb,
  'image-to-video': imageToVideoThumb,
  'video-to-video': videoToVideoThumb,
  'data-analysis': dataAnalysisThumb,
  'custom-ai': customAiThumb,
};

// Helper function to get thumbnail by demo type
export const getDemoThumbnail = (demoType: string): string | null => {
  return demoThumbnails[demoType] || null;
};
