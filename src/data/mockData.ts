import { Product, User, Review, Category, Message, Conversation } from '../types';

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Электроника',
    icon: 'smartphone',
    productCount: 124
  },
  {
    id: '2',
    name: 'Одежда',
    icon: 'shirt',
    productCount: 86
  },
  {
    id: '3',
    name: 'Сад',
    icon: 'home',
    productCount: 65
  },
  {
    id: '4',
    name: 'Спорт',
    icon: 'dumbbell',
    productCount: 42
  },
  {
    id: '5',
    name: 'Книги',
    icon: 'book-open',
    productCount: 78
  },
  {
    id: '6',
    name: 'Игры',
    icon: 'game-controller',
    productCount: 53
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Wireless Noise Cancelling Headphones',
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and high-quality audio performance.',
    price: 249.99,
    category: 'Electronics',
    images: [
      'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    sellerId: '1',
    sellerName: 'John Doe',
    sellerAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.8,
    reviewCount: 127,
    createdAt: '2023-11-15T09:24:00Z'
  },
  {
    id: '2',
    title: 'Vintage Leather Jacket',
    description: 'Genuine leather jacket in vintage style, perfectly worn-in with a classic cut and exceptional craftsmanship.',
    price: 189.95,
    category: 'Clothing',
    images: [
      'https://images.pexels.com/photos/16170/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/3598254/pexels-photo-3598254.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    sellerId: '2',
    sellerName: 'Emma Wilson',
    sellerAvatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.5,
    reviewCount: 84,
    createdAt: '2023-12-03T11:42:00Z'
  },
  {
    id: '3',
    title: 'Modern Coffee Table',
    description: 'Sleek mid-century modern coffee table with solid wood legs and tempered glass top, perfect for any living room.',
    price: 159.00,
    category: 'Home & Garden',
    images: [
      'https://images.pexels.com/photos/4846461/pexels-photo-4846461.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1248583/pexels-photo-1248583.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    sellerId: '3',
    sellerName: 'Michael Brown',
    sellerAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.7,
    reviewCount: 62,
    createdAt: '2024-01-08T14:15:00Z'
  },
  {
    id: '4',
    title: 'Mountain Bike',
    description: 'High-performance mountain bike with lightweight aluminum frame, 21 speeds, and front suspension for smooth trail riding.',
    price: 429.99,
    category: 'Sports',
    images: [
      'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/2158963/pexels-photo-2158963.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    sellerId: '4',
    sellerName: 'Sarah Johnson',
    sellerAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.9,
    reviewCount: 41,
    createdAt: '2024-02-12T16:30:00Z'
  },
  {
    id: '5',
    title: 'Classic Novel Collection',
    description: 'Set of 5 hardcover classic novels including works by Jane Austen, Charles Dickens, and F. Scott Fitzgerald.',
    price: 69.95,
    category: 'Books',
    images: [
      'https://images.pexels.com/photos/1148399/pexels-photo-1148399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    sellerId: '5',
    sellerName: 'David Garcia',
    sellerAvatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.6,
    reviewCount: 29,
    createdAt: '2024-03-05T10:18:00Z'
  },
  {
    id: '6',
    title: 'LEGO Architecture Set',
    description: 'Detailed LEGO architecture set featuring famous landmarks, 1,200+ pieces, suitable for ages 14 and up.',
    price: 99.99,
    category: 'Toys',
    images: [
      'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/207891/pexels-photo-207891.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    sellerId: '6',
    sellerName: 'Linda Martinez',
    sellerAvatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.9,
    reviewCount: 57,
    createdAt: '2024-03-18T09:45:00Z'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    isAdmin: false,
    bio: 'Tech enthusiast and collector of vintage electronics.',
    joinedDate: '2022-08-12T00:00:00Z',
    location: 'San Francisco, CA',
    salesCount: 47,
    rating: 4.8
  },
  {
    id: '2',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    isAdmin: false,
    bio: 'Fashion design graduate with a passion for vintage clothing.',
    joinedDate: '2022-10-24T00:00:00Z',
    location: 'New York, NY',
    salesCount: 84,
    rating: 4.9
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    avatar: 'https://images.pexels.com/photos/5792641/pexels-photo-5792641.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    isAdmin: true,
    joinedDate: '2022-01-01T00:00:00Z',
    location: 'Seattle, WA',
    salesCount: 0,
    rating: 5.0
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    userId: '2',
    userName: 'Emma Wilson',
    userAvatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    productId: '1',
    rating: 5,
    comment: 'Excellent sound quality and the noise cancellation is phenomenal. Battery life exceeds expectations.',
    createdAt: '2023-12-15T14:30:00Z'
  },
  {
    id: '2',
    userId: '3',
    userName: 'Michael Brown',
    userAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    productId: '1',
    rating: 4,
    comment: 'Great headphones overall. The comfort could be improved for long listening sessions, but sound quality is top-notch.',
    createdAt: '2024-01-03T11:24:00Z'
  },
  {
    id: '3',
    userId: '1',
    userName: 'John Doe',
    userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    productId: '2',
    rating: 5,
    comment: 'This jacket is exactly as described. The leather is high quality and it fits perfectly. Very satisfied with my purchase.',
    createdAt: '2024-01-10T16:42:00Z'
  }
];

export const mockConversations: Conversation[] = [
  {
    id: '1',
    participantIds: ['1', '2'],
    lastMessage: 'Is the item still available?',
    lastMessageTime: '2024-03-28T14:22:00Z',
    unreadCount: 1
  },
  {
    id: '2',
    participantIds: ['1', '3'],
    lastMessage: 'I can meet tomorrow for the exchange.',
    lastMessageTime: '2024-03-26T09:15:00Z',
    unreadCount: 0
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '2',
    receiverId: '1',
    content: 'Hi there! Is the wireless headphone still available?',
    timestamp: '2024-03-28T13:48:00Z',
    isRead: true
  },
  {
    id: '2',
    senderId: '1',
    receiverId: '2',
    content: 'Yes, it\'s still available. Are you interested?',
    timestamp: '2024-03-28T14:02:00Z',
    isRead: true
  },
  {
    id: '3',
    senderId: '2',
    receiverId: '1',
    content: 'Great! I\'m definitely interested. Is the price negotiable?',
    timestamp: '2024-03-28T14:15:00Z',
    isRead: true
  },
  {
    id: '4',
    senderId: '2',
    receiverId: '1',
    content: 'Is the item still available?',
    timestamp: '2024-03-28T14:22:00Z',
    isRead: false
  }
];