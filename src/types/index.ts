/**
 * User Types
 */
export type UserTypes = {
  id: string;
  firstName: string;
  lastName: string;
  phone: number;
  email: string;
  role: RoleTypes;
  createdAt: string;
};

/**
 * Product Types
 */
export type ProductTypes = {
  productId: string;
  name: string;
  categoryId: string;
  price: number;
  image: string;
  quantity: number;
  createdAt: string;
  description: string;
};

/**
 * Category Types
 */
export type CategoryTypes = {
  categoryId: string;
  name: string;
  createdAt: string;
};

/**
 * Role Types
 */
export type RoleTypes = keyof typeof Role;

export const Role = {
  Admin: "Admin",
  Customer: "Customer",
} as const;

/**
 * Order Types
 */
export type OrderStatus = "Pending" | "Processing" | "Completed" | "Cancelled";

export type OrderItemTypes = {
  productId: string;
  quantity: number;
  productName: string;
  unitPrice: number;
};

export type OrderTypes = {
  orderId?: string;
  orderDate?: string;
  status: OrderStatus;
  items: OrderItemTypes[];
  totalPrice: number;
};

export type OrderResponse = {
  orderId: string;
  userId: string; // ⬅️ backend sends this
  orderDate: string;
  status: OrderStatus;
  totalPrice: number;
  items: OrderItemTypes[];
};

/**
 * Reservation Types (for Coffee Shop Reservation feature)
 */
export type ReservationTypes = {
  reservationId?: string;
  userId: string;
  reservationDate: string;
  reservationTime: string;
  numberOfPeople: number;
  specialRequests?: string;
  createdAt?: string;
};

/**
 * Authentication Types
 */
export type LoginCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: number;
};

export type AuthResponse = {
  token: string;
  user: UserTypes;
};

/**
 * Cart Types (for Global State)
 */
export type CartItem = ProductTypes;

export type GlobalStateTypes = {
  cart: CartItem[];
};

export type GlobalContextTypes = {
  state: GlobalStateTypes;
  handleAddToCart: (products: ProductTypes) => void;
  handleDeleteFromCart: (id: string) => void;
  handleRemoveFromCart: () => void;
  searchBy: string;
  setSearchBy: (value: string) => void;
};
