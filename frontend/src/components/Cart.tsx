import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, getSubtotal, getDiscountAmount, getShipping, getGrandTotal } = useCart();
  const { darkMode } = useTheme();
  const [couponCode, setCouponCode] = useState('');

  const handleQuantityChange = (productId: number, change: number) => {
    const item = items.find(i => i.productId === productId);
    if (item) {
      const newQuantity = item.quantity + change;
      updateQuantity(productId, newQuantity);
    }
  };

  const handleApplyCoupon = () => {
    // Placeholder for coupon functionality
    alert('Coupon functionality not implemented yet');
  };

  const handleUpdateCart = () => {
    // Placeholder for update cart functionality
    alert('Cart updated successfully');
  };

  const handleCheckout = () => {
    // Placeholder for checkout functionality
    alert('Checkout functionality not implemented yet');
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>Your Cart is Empty</h1>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-8`}>Add some products to your cart to get started</p>
            <Link
              to="/products"
              className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg transition-colors inline-block"
            >
              Shop Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6`}>Shopping Cart</h1>
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <table className="w-full">
                  <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b`}>
                    <tr>
                      <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-700'} uppercase tracking-wider`}>S. No.</th>
                      <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-700'} uppercase tracking-wider`}>Product Image</th>
                      <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-700'} uppercase tracking-wider`}>Product Name</th>
                      <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-700'} uppercase tracking-wider`}>Unit Price</th>
                      <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-700'} uppercase tracking-wider`}>Quantity</th>
                      <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-700'} uppercase tracking-wider`}>Total</th>
                      <th className={`px-6 py-4 text-left text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-700'} uppercase tracking-wider`}>Remove</th>
                    </tr>
                  </thead>
                  <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {items.map((item, index) => {
                      const itemPrice = item.discount ? item.price * (1 - item.discount) : item.price;
                      const itemTotal = itemPrice * item.quantity;
                      return (
                        <tr key={item.productId}>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <img
                              src={`/${item.imgName}`}
                              alt={item.name}
                              className="w-16 h-16 object-contain rounded-lg"
                            />
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                            {item.name}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                            ${itemPrice.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`flex items-center space-x-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-1 w-fit`}>
                              <button
                                onClick={() => handleQuantityChange(item.productId, -1)}
                                className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors`}
                              >
                                -
                              </button>
                              <span className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center`}>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.productId, 1)}
                                className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors`}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                            ${itemTotal.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden">
                {items.map((item, index) => {
                  const itemPrice = item.discount ? item.price * (1 - item.discount) : item.price;
                  const itemTotal = itemPrice * item.quantity;
                  return (
                    <div key={item.productId} className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} last:border-b-0`}>
                      <div className="flex items-center space-x-4">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>#{index + 1}</span>
                        <img
                          src={`/${item.imgName}`}
                          alt={item.name}
                          className="w-16 h-16 object-contain rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className={`font-medium ${darkMode ? 'text-light' : 'text-gray-900'}`}>{item.name}</h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>${itemPrice.toFixed(2)} each</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className={`flex items-center space-x-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-1`}>
                          <button
                            onClick={() => handleQuantityChange(item.productId, -1)}
                            className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors`}
                          >
                            -
                          </button>
                          <span className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.productId, 1)}
                            className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors`}
                          >
                            +
                          </button>
                        </div>
                        <span className={`font-bold ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                          ${itemTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Coupon and Update Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <div className="flex-1">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className={`flex-1 px-4 py-2 ${darkMode ? 'bg-gray-800 text-light border-gray-700' : 'bg-white text-gray-800 border-gray-300'} rounded-l-lg border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none`}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-primary hover:bg-accent text-white px-6 py-2 rounded-r-lg transition-colors"
                  >
                    Apply Coupon
                  </button>
                </div>
              </div>
              <button
                onClick={handleUpdateCart}
                className="bg-primary hover:bg-accent text-white px-6 py-2 rounded-lg transition-colors"
              >
                Update Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6`}>Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Subtotal</span>
                  <span className={`font-medium ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                    ${getSubtotal().toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Discount(5%)</span>
                  <span className={`font-medium text-red-500`}>
                    -${getDiscountAmount().toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Shipping</span>
                  <span className={`font-medium ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                    ${getShipping().toFixed(2)}
                  </span>
                </div>
                
                <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-4`}>
                  <div className="flex justify-between">
                    <span className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-900'}`}>Grand Total</span>
                    <span className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                      ${getGrandTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full bg-primary hover:bg-accent text-white py-3 rounded-lg mt-6 transition-colors font-medium"
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}