import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Cart() {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'))
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const total = cart.reduce((s, it) => s + (it.price || 0), 0)

  function removeAt(idx) {
    setCart((c) => c.filter((_, i) => i !== idx))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Your Cart</h2>
      {cart.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-lg">
          <p className="text-xl font-medium mb-4">Your cart is empty</p>
          <Link 
            to="/menu" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors"
          >
            Browse Our Menu
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="space-y-4 mb-8">
            {cart.map((it, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-bold text-lg">{it.name}</div>
                  <div className="text-blue-600 font-medium">₹{it.price}</div>
                </div>
                <button 
                  onClick={() => removeAt(idx)} 
                  className="text-red-600 font-bold hover:text-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="text-right text-2xl font-bold mb-6">
              Total: ₹{total}
            </div>
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => navigate('/menu')} 
                className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors"
              >
                Continue Shopping
              </button>
              <button 
                onClick={() => navigate('/checkout')} 
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
