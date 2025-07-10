import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Cart() {
  const { state, updateQuantity, removeItem, applyCoupon, getSubtotal, getDiscount, getShipping, getGrandTotal } = useCart();
  const { darkMode } = useTheme();
  const [couponInput, setCouponInput] = useState('');

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleApplyCoupon = () => {
    applyCoupon(couponInput);
    setCouponInput('');
  };

  const handleProceedToCheckout = () => {
    alert('Proceeding to checkout...');
  };

  if (state.items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>
              Your Cart is Empty
            </h1>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
              Add some products to your cart to get started.
            </p>
            <a
              href="/products"
              className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Shop Now
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8`}>
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}>
              {/* Table Header */}
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} px-6 py-4 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <div className="grid grid-cols-12 gap-4 text-sm font-medium">
                  <div className={`col-span-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>S. No.</div>
                  <div className={`col-span-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Product Image</div>
                  <div className={`col-span-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Product Name</div>
                  <div className={`col-span-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Unit Price</div>
                  <div className={`col-span-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Quantity</div>
                  <div className={`col-span-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total</div>
                  <div className={`col-span-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Remove</div>
                </div>
              </div>

              {/* Cart Items */}
              <div className="divide-y divide-gray-200">
                {state.items.map((item, index) => {
                  const itemPrice = item.product.discount 
                    ? item.product.price * (1 - item.product.discount)
                    : item.product.price;
                  const itemTotal = itemPrice * item.quantity;

                  return (
                    <div key={item.product.productId} className="px-6 py-4">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Serial Number */}
                        <div className={`col-span-1 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                          {index + 1}
                        </div>

                        {/* Product Image */}
                        <div className="col-span-2">
                          <img
                            src={`/${item.product.imgName}`}
                            alt={item.product.name}
                            className="w-16 h-16 object-contain rounded-lg bg-gray-100"
                          />
                        </div>

                        {/* Product Name */}
                        <div className={`col-span-3 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                          <h3 className="font-medium">{item.product.name}</h3>
                          {item.product.discount && (
                            <span className="text-sm text-primary">
                              {Math.round(item.product.discount * 100)}% OFF
                            </span>
                          )}
                        </div>

                        {/* Unit Price */}
                        <div className={`col-span-2 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                          {item.product.discount ? (
                            <div>
                              <span className="line-through text-gray-500 text-sm">${item.product.price}</span>
                              <span className="text-primary font-medium ml-2">${itemPrice.toFixed(2)}</span>
                            </div>
                          ) : (
                            <span className="text-primary font-medium">${itemPrice.toFixed(2)}</span>
                          )}
                        </div>

                        {/* Quantity */}
                        <div className="col-span-2">
                          <div className={`flex items-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-1 w-fit`}>
                            <button
                              onClick={() => handleQuantityChange(item.product.productId, item.quantity - 1)}
                              className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors`}
                            >
                              -
                            </button>
                            <span className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center`}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.product.productId, item.quantity + 1)}
                              className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors`}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Total */}
                        <div className={`col-span-1 ${darkMode ? 'text-light' : 'text-gray-800'} font-medium`}>
                          ${itemTotal.toFixed(2)}
                        </div>

                        {/* Remove */}
                        <div className="col-span-1">
                          <button
                            onClick={() => removeItem(item.product.productId)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coupon Code Section */}
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} px-6 py-4 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className={`flex-1 px-4 py-2 ${darkMode ? 'bg-gray-800 text-light border-gray-600' : 'bg-white text-gray-800 border-gray-300'} rounded-lg border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors`}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-primary hover:bg-accent text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Apply Coupon
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className={`${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'} text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors`}
                  >
                    Update Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6`}>
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className={`flex justify-between ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                  <span>Subtotal</span>
                  <span>${getSubtotal().toFixed(2)}</span>
                </div>

                {state.couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount({Math.round(state.couponDiscount * 100)}%)</span>
                    <span>-${getDiscount().toFixed(2)}</span>
                  </div>
                )}

                <div className={`flex justify-between ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                  <span>Shipping</span>
                  <span>${getShipping().toFixed(2)}</span>
                </div>

                <div className={`border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'} pt-4`}>
                  <div className={`flex justify-between text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                    <span>Grand Total</span>
                    <span>${getGrandTotal().toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-primary hover:bg-accent text-white py-3 rounded-lg font-medium transition-colors mt-6"
                >
                  Proceed To Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}