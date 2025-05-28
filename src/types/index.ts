export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  categorySlug: string;
  images: string[];
  seller_id: string;
  sellerName: string;
  sellerAvatar: string;
  sellerRating: number;
  sellerTotalRatings: number;
  sellerBio?: string;
  rating: number;
  reviewCount: number;
  reviews?: ProductReview[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount?: number;
}

export interface Profile {
  id: string;
  name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
  avg_rating?: number;
  total_ratings?: number;
}

export interface Order {
  id: string;
  buyer_id: string;
  product_id: string;
  seller_id: string;
  status: 'pending' | 'completed' | 'cancelled';
  total_amount: number;
  created_at: string;
  completed_at: string | null;
  product: {
    title: string;
    images: string[];
  };
  seller: {
    name: string | null;
    avatar_url: string | null;
  };
  seller_rating?: SellerRating[];
  product_review?: ProductReview[];
}

export interface SellerRating {
  id: string;
  order_id: string;
  seller_id: string;
  buyer_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface ProductReview {
  id: string;
  rating: number;
  review?: string;
  created_at: string;
  buyer?: {
    name: string | null;
    avatar_url: string | null;
  };
}