import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const SHIPPING_COST = 10;

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [pendingQuantities, setPendingQuantities] = useState<Record<number, number>>({});

  const effectiveQuantity = (productId: number, fallback: number) =>
    pendingQuantities[productId] !== undefined ? pendingQuantities[productId] : fallback;

  const handleQuantityInput = (productId: number, value: string) => {
    const qty = parseInt(value, 10);
    if (!isNaN(qty)) {
      setPendingQuantities(prev => ({ ...prev, [productId]: qty }));
    }
  };

  const handleUpdateCart = () => {
    Object.entries(pendingQuantities).forEach(([id, qty]) => {
      updateQuantity(Number(id), qty);
    });
    setPendingQuantities({});
  };

  const handleApplyCoupon = () => {
    setAppliedCoupon(couponCode.trim().toUpperCase());
  };

  // Calculate per-item discount amounts
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + item.price * effectiveQuantity(item.productId, item.quantity);
  }, 0);

  const discountAmount = cartItems.reduce((sum, item) => {
    const qty = effectiveQuantity(item.productId, item.quantity);
    return sum + item.price * (item.discount ?? 0) * qty;
  }, 0);

  const discountPercent = subtotal > 0 ? (discountAmount / subtotal) * 100 : 0;
  const grandTotal = subtotal - discountAmount + (cartItems.length > 0 ? SHIPPING_COST : 0);

  const cell = `px-4 py-4 text-center ${darkMode ? 'text-light' : 'text-gray-800'}`;
  const headerCell = `px-4 py-3 text-center text-sm font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className={`text-center py-20 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <svg className="mx-auto h-16 w-16 mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-xl font-medium mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-primary hover:bg-accent text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Table */}
            <div className="flex-1">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}>
                <table className="w-full">
                  <thead>
                    <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <th className={headerCell}>S. No.</th>
                      <th className={headerCell}>Product Image</th>
                      <th className={headerCell}>Product Name</th>
                      <th className={headerCell}>Unit Price</th>
                      <th className={headerCell}>Quantity</th>
                      <th className={headerCell}>Total</th>
                      <th className={headerCell}>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item, index) => {
                      const qty = effectiveQuantity(item.productId, item.quantity);
                      const unitPrice = item.price;
                      const lineTotal = unitPrice * qty;
                      return (
                        <tr
                          key={item.productId}
                          className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors`}
                        >
                          <td className={cell}>{index + 1}</td>
                          <td className={`${cell} flex justify-center`}>
                            <img
                              src={`/${item.imgName}`}
                              alt={item.name}
                              className="h-16 w-16 object-contain"
                            />
                          </td>
                          <td className={`${cell} font-semibold`}>{item.name}</td>
                          <td className={cell}>${unitPrice.toFixed(2)}</td>
                          <td className={cell}>
                            <input
                              type="number"
                              min={1}
                              value={qty}
                              onChange={e => handleQuantityInput(item.productId, e.target.value)}
                              className={`w-16 text-center rounded-lg border px-2 py-1 ${
                                darkMode
                                  ? 'bg-gray-700 border-gray-600 text-light'
                                  : 'bg-white border-gray-300 text-gray-800'
                              } focus:outline-none focus:border-primary`}
                              aria-label={`Quantity for ${item.name}`}
                            />
                          </td>
                          <td className={cell}>${lineTotal.toFixed(2)}</td>
                          <td className={cell}>
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="text-primary hover:text-accent transition-colors"
                              aria-label={`Remove ${item.name} from cart`}
                            >
                              <svg className="h-5 w-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Coupon + Update Cart */}
                <div className={`flex items-center justify-between px-4 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      className={`px-4 py-2 rounded-lg border ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-light placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                      } focus:outline-none focus:border-primary`}
                      aria-label="Coupon code"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="bg-primary hover:bg-accent text-white px-5 py-2 rounded-lg font-medium transition-colors"
                    >
                      Apply Coupon
                    </button>
                  </div>
                  <button
                    onClick={handleUpdateCart}
                    className="bg-primary hover:bg-accent text-white px-5 py-2 rounded-lg font-medium transition-colors"
                  >
                    Update Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-72 xl:w-80">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}>
                <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h2 className={`text-xl font-bold text-center ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                    Order Summary
                  </h2>
                </div>
                <div className="px-6 py-4 space-y-3">
                  <div className="flex justify-between">
                    <span className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-700'}`}>Subtotal</span>
                    <span className={darkMode ? 'text-light' : 'text-gray-800'}>${subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between">
                      <span className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-700'}`}>
                        Discount ({discountPercent.toFixed(0)}%)
                      </span>
                      <span className="text-red-400">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {appliedCoupon && (
                    <div className="flex justify-between">
                      <span className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-700'}`}>
                        Coupon ({appliedCoupon})
                      </span>
                      <span className="text-green-400">Applied</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-700'}`}>Shipping</span>
                    <span className={darkMode ? 'text-light' : 'text-gray-800'}>${SHIPPING_COST.toFixed(2)}</span>
                  </div>
                  <div className={`flex justify-between pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <span className={`font-bold text-lg ${darkMode ? 'text-light' : 'text-gray-800'}`}>Grand Total</span>
                    <span className={`font-bold text-lg ${darkMode ? 'text-light' : 'text-gray-800'}`}>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <button
                    className="w-full bg-primary hover:bg-accent text-white py-3 rounded-lg font-semibold transition-colors"
                    onClick={() => alert('Proceeding to checkout...')}
                  >
                    Proceed To Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
