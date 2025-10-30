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
    <div>
      <h2 className="text-xl font-semibold mb-4">Cart</h2>
      {cart.length === 0 ? (
        <div>
          <p>Your cart is empty.</p>
          <Link to="/menu" className="text-blue-600">Browse menu</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {cart.map((it, idx) => (
            <div key={idx} className="p-3 bg-white rounded shadow flex justify-between">
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-gray-600">₹{it.price}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => removeAt(idx)} className="text-sm text-red-600">Remove</button>
              </div>
            </div>
          ))}

          <div className="text-right">Total: <strong>₹{total}</strong></div>
          <div className="flex justify-end gap-2">
            <button onClick={() => navigate('/menu')} className="px-3 py-1 border rounded">Continue</button>
            <button onClick={() => navigate('/checkout')} className="px-3 py-1 bg-blue-600 text-white rounded">Checkout</button>
          </div>
        </div>
      )}
    </div>
  )
}
