import { createContext, useContext, useReducer, ReactNode } from 'react';

// Product interface based on existing structure
interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  imgName: string;
  sku: string;
  unit: string;
  supplierId: number;
  discount?: number;
}

// Cart item interface
interface CartItem {
  product: Product;
  quantity: number;
}

// Cart state interface
interface CartState {
  items: CartItem[];
  couponCode: string;
  couponDiscount: number;
}

// Cart actions
type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: number } }
  | { type: 'APPLY_COUPON'; payload: { code: string; discount: number } }
  | { type: 'CLEAR_CART' };

// Cart context interface
interface CartContextType {
  state: CartState;
  addItem: (product: Product, quantity: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  applyCoupon: (code: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getShipping: () => number;
  getGrandTotal: () => number;
}

// Initial cart state
const initialState: CartState = {
  items: [],
  couponCode: '',
  couponDiscount: 0,
};

// Cart reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        item => item.product.productId === action.payload.product.productId
      );
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.product.productId === action.payload.product.productId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      
      return {
        ...state,
        items: [...state.items, { product: action.payload.product, quantity: action.payload.quantity }],
      };
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.product.productId !== action.payload.productId),
        };
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.product.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }
    
    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(item => item.product.productId !== action.payload.productId),
      };
    }
    
    case 'APPLY_COUPON': {
      return {
        ...state,
        couponCode: action.payload.code,
        couponDiscount: action.payload.discount,
      };
    }
    
    case 'CLEAR_CART': {
      return initialState;
    }
    
    default:
      return state;
  }
}

// Cart context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart provider
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (product: Product, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const removeItem = (productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };

  const applyCoupon = (code: string) => {
    // Simple coupon validation - in real app this would be API call
    const discount = code.toLowerCase() === 'save5' ? 0.05 : 0;
    dispatch({ type: 'APPLY_COUPON', payload: { code, discount } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return state.items.reduce((total, item) => {
      const price = item.product.discount 
        ? item.product.price * (1 - item.product.discount)
        : item.product.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getDiscount = () => {
    return getSubtotal() * state.couponDiscount;
  };

  const getShipping = () => {
    return getSubtotal() > 0 ? 10 : 0; // $10 shipping
  };

  const getGrandTotal = () => {
    return getSubtotal() - getDiscount() + getShipping();
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        updateQuantity,
        removeItem,
        applyCoupon,
        clearCart,
        getItemCount,
        getSubtotal,
        getDiscount,
        getShipping,
        getGrandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Export types for use in other components
export type { Product, CartItem };