import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart, CartItem } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const SHIPPING_COST = 10;

const COUPONS: Record<string, number> = {
  SAVE5: 0.05,
  SAVE10: 0.1,
  SAVE15: 0.15,
};

export default function Cart() {
  const { items, removeFromCart, updateQuantity } = useCart();
  const { darkMode } = useTheme();

  const [pendingQuantities, setPendingQuantities] = useState<Record<number, number>>({});
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  const getQuantity = (productId: number) =>
    pendingQuantities[productId] !== undefined
      ? pendingQuantities[productId]
      : items.find((i: CartItem) => i.product.productId === productId)?.quantity ?? 0;

  const handleQuantityChange = (productId: number, value: string) => {
    const qty = parseInt(value, 10);
    if (!isNaN(qty)) {
      setPendingQuantities(prev => ({ ...prev, [productId]: Math.max(1, qty) }));
    }
  };

  const handleUpdateCart = () => {
    Object.entries(pendingQuantities).forEach(([id, qty]) => {
      updateQuantity(Number(id), qty);
    });
    setPendingQuantities({});
  };

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon({ code, discount: COUPONS[code] });
      setCouponError('');
    } else {
      setAppliedCoupon(null);
      setCouponError('Invalid coupon code');
    }
  };

  const subtotal = items.reduce((sum: number, item: CartItem) => sum + item.product.price * item.quantity, 0);
  const discountAmount = appliedCoupon ? subtotal * appliedCoupon.discount : 0;
  const grandTotal = subtotal - discountAmount + SHIPPING_COST;

  const cellClass = `px-4 py-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`;
  const headerClass = `px-4 py-3 text-left font-bold ${darkMode ? 'text-light bg-gray-800' : 'text-gray-800 bg-gray-100'}`;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-light' : 'text-gray-800'}`}>Shopping Cart</h1>

        {items.length === 0 ? (
          <div className={`text-center py-20 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <svg className="mx-auto h-16 w-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M7 13L5.4 5M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            <p className="text-xl mb-4">Your cart is empty</p>
            <Link to="/products" className="bg-primary hover:bg-accent text-white px-6 py-2 rounded-lg transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Table */}
            <div className="flex-1">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-x-auto`}>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className={headerClass}>S. No.</th>
                      <th className={headerClass}>Product Image</th>
                      <th className={headerClass}>Product Name</th>
                      <th className={headerClass}>Unit Price</th>
                      <th className={headerClass}>Quantity</th>
                      <th className={headerClass}>Total</th>
                      <th className={headerClass}>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item: CartItem, index: number) => (
                      <tr key={item.product.productId}>
                        <td className={`${cellClass} text-center ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                          {index + 1}
                        </td>
                        <td className={`${cellClass} text-center`}>
                          <img
                            src={`/${item.product.imgName}`}
                            alt={item.product.name}
                            className="h-16 w-16 object-contain mx-auto"
                          />
                        </td>
                        <td className={`${cellClass} font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                          {item.product.name}
                        </td>
                        <td className={`${cellClass} ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                          ${item.product.price.toFixed(2)}
                        </td>
                        <td className={`${cellClass} text-center`}>
                          <input
                            type="number"
                            min="1"
                            value={getQuantity(item.product.productId)}
                            onChange={e => handleQuantityChange(item.product.productId, e.target.value)}
                            className={`w-16 text-center border rounded-md px-2 py-1 ${darkMode ? 'bg-gray-700 border-gray-600 text-light' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:border-primary`}
                            aria-label={`Quantity for ${item.product.name}`}
                          />
                        </td>
                        <td className={`${cellClass} ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                          ${(item.product.price * getQuantity(item.product.productId)).toFixed(2)}
                        </td>
                        <td className={`${cellClass} text-center`}>
                          <button
                            onClick={() => removeFromCart(item.product.productId)}
                            className="text-primary hover:text-accent transition-colors"
                            aria-label={`Remove ${item.product.name} from cart`}
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Coupon + Update Cart row */}
                <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Coupon Code"
                        value={couponInput}
                        onChange={e => setCouponInput(e.target.value)}
                        className={`px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-light placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-800'} focus:outline-none focus:border-primary`}
                        aria-label="Coupon code"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="bg-primary hover:bg-accent text-white px-5 py-2 rounded-lg font-medium transition-colors"
                      >
                        Apply Coupon
                      </button>
                    </div>
                    {couponError && <p className="text-red-500 text-sm">{couponError}</p>}
                    {appliedCoupon && (
                      <p className="text-primary text-sm">
                        Coupon <strong>{appliedCoupon.code}</strong> applied ({Math.round(appliedCoupon.discount * 100)}% off)
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleUpdateCart}
                    className="bg-primary hover:bg-accent text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Update Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-72 flex-shrink-0">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
                <h2 className={`text-xl font-bold text-center mb-6 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                  Order Summary
                </h2>
                <div className="space-y-4">
                  <div className={`flex justify-between ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                    <span className="font-semibold">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className={`flex justify-between ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                      <span className="font-semibold">Discount({Math.round(appliedCoupon.discount * 100)}%)</span>
                      <span className="text-red-400">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className={`flex justify-between ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                    <span className="font-semibold">Shipping</span>
                    <span>${SHIPPING_COST.toFixed(2)}</span>
                  </div>
                  <div className={`flex justify-between border-t pt-4 ${darkMode ? 'border-gray-700 text-light' : 'border-gray-200 text-gray-800'}`}>
                    <span className="font-bold text-lg">Grand Total</span>
                    <span className="font-bold text-lg">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
                <button className="w-full mt-6 bg-primary hover:bg-accent text-white py-3 rounded-lg font-semibold transition-colors">
                  Proceed To Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
