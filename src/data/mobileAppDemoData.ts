// Mobile App Demo Data
// =====================

import {
  ShoppingCart,
  MessageCircle,
  Activity,
  Utensils,
  User,
  CreditCard,
  Bell,
  Map,
  Camera,
  Share2,
  WifiOff,
  BarChart3,
  Sparkles,
  LucideIcon
} from 'lucide-react';

// App Types
export interface AppType {
  id: string;
  name: { tr: string; en: string };
  icon: LucideIcon;
  color: string;
  defaultFeatures: string[];
}

export const appTypes: AppType[] = [
  {
    id: 'ecommerce',
    name: { tr: 'E-Ticaret', en: 'E-Commerce' },
    icon: ShoppingCart,
    color: 'from-green-500 to-emerald-600',
    defaultFeatures: ['user-auth', 'payment', 'push', 'offline']
  },
  {
    id: 'social',
    name: { tr: 'Sosyal', en: 'Social' },
    icon: MessageCircle,
    color: 'from-blue-500 to-cyan-600',
    defaultFeatures: ['user-auth', 'chat', 'camera', 'push']
  },
  {
    id: 'fitness',
    name: { tr: 'Fitness', en: 'Fitness' },
    icon: Activity,
    color: 'from-orange-500 to-red-600',
    defaultFeatures: ['user-auth', 'analytics', 'push', 'offline']
  },
  {
    id: 'food',
    name: { tr: 'Yemek', en: 'Food Delivery' },
    icon: Utensils,
    color: 'from-amber-500 to-orange-600',
    defaultFeatures: ['user-auth', 'payment', 'map', 'push']
  }
];

// Features
export interface Feature {
  id: string;
  name: { tr: string; en: string };
  icon: LucideIcon;
  description: { tr: string; en: string };
  price: number; // Additional price for this feature
}

export const features: Feature[] = [
  {
    id: 'user-auth',
    name: { tr: 'Kullanıcı Girişi', en: 'User Login' },
    icon: User,
    description: { tr: 'Güvenli giriş ve kayıt sistemi', en: 'Secure login and registration' },
    price: 3000
  },
  {
    id: 'payment',
    name: { tr: 'Ödeme Sistemi', en: 'Payment System' },
    icon: CreditCard,
    description: { tr: 'Güvenli ödeme entegrasyonu', en: 'Secure payment integration' },
    price: 8000
  },
  {
    id: 'chat',
    name: { tr: 'Chat/Mesajlaşma', en: 'Chat/Messaging' },
    icon: MessageCircle,
    description: { tr: 'Gerçek zamanlı mesajlaşma', en: 'Real-time messaging' },
    price: 6000
  },
  {
    id: 'push',
    name: { tr: 'Push Bildirimler', en: 'Push Notifications' },
    icon: Bell,
    description: { tr: 'Anlık bildirim sistemi', en: 'Instant notification system' },
    price: 2500
  },
  {
    id: 'map',
    name: { tr: 'Harita', en: 'Maps' },
    icon: Map,
    description: { tr: 'Konum ve harita servisleri', en: 'Location and map services' },
    price: 4000
  },
  {
    id: 'camera',
    name: { tr: 'Kamera/Galeri', en: 'Camera/Gallery' },
    icon: Camera,
    description: { tr: 'Fotoğraf ve video özellikleri', en: 'Photo and video features' },
    price: 3500
  },
  {
    id: 'social',
    name: { tr: 'Sosyal Paylaşım', en: 'Social Sharing' },
    icon: Share2,
    description: { tr: 'Sosyal medya entegrasyonu', en: 'Social media integration' },
    price: 2000
  },
  {
    id: 'offline',
    name: { tr: 'Çevrimdışı Mod', en: 'Offline Mode' },
    icon: WifiOff,
    description: { tr: 'İnternet olmadan kullanım', en: 'Use without internet' },
    price: 5000
  },
  {
    id: 'analytics',
    name: { tr: 'Analytics', en: 'Analytics' },
    icon: BarChart3,
    description: { tr: 'Kullanıcı davranış analizi', en: 'User behavior analytics' },
    price: 4500
  },
  {
    id: 'ar',
    name: { tr: 'AR/VR', en: 'AR/VR' },
    icon: Sparkles,
    description: { tr: 'Artırılmış gerçeklik', en: 'Augmented reality' },
    price: 12000
  }
];

// Price calculation
export const calculatePrice = (selectedFeatures: string[]): { min: number; max: number } => {
  const basePrice = 25000;
  const featureTotal = selectedFeatures.reduce((total, featureId) => {
    const feature = features.find(f => f.id === featureId);
    return total + (feature?.price || 0);
  }, 0);

  const min = basePrice + featureTotal;
  const max = Math.round(min * 1.4);

  return { min, max };
};

// Time estimation
export const calculateTime = (featureCount: number): { tr: string; en: string } => {
  if (featureCount <= 3) return { tr: '3-4 hafta', en: '3-4 weeks' };
  if (featureCount <= 5) return { tr: '5-6 hafta', en: '5-6 weeks' };
  if (featureCount <= 7) return { tr: '7-8 hafta', en: '7-8 weeks' };
  return { tr: '9-12 hafta', en: '9-12 weeks' };
};

// Platform options
export const platforms = [
  { id: 'ios', name: 'iOS', multiplier: 1 },
  { id: 'android', name: 'Android', multiplier: 1 },
  { id: 'both', name: { tr: 'Her İkisi', en: 'Both' }, multiplier: 1.6 }
];

// Get feature by ID
export const getFeatureById = (id: string): Feature | undefined => {
  return features.find(f => f.id === id);
};

// Get app type by ID
export const getAppTypeById = (id: string): AppType | undefined => {
  return appTypes.find(t => t.id === id);
};
