import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Checkout() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  const total = cart.reduce((s, it) => s + (it.price || 0), 0)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('Chennai')
  const [status, setStatus] = useState(null)
  const navigate = useNavigate()

  async function placeOrder() {
    const payload = { items: cart, total, customer: { name, phone }, city }
    const res = await fetch('/.netlify/functions/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (res.ok) {
      setStatus('Order placed! ID: ' + data.id)
      localStorage.removeItem('cart')
      setTimeout(() => navigate('/'), 2000)
    } else {
      setStatus('Failed: ' + (data.error || 'Unknown'))
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Checkout</h2>
      
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="font-medium">Items: {cart.length}</div>
                <div className="text-2xl font-bold text-blue-600">Total: ₹{total}</div>
              </div>
              <div className="space-y-2">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="font-medium">{item.name}</span>
                    <span>₹{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div>
            <h3 className="text-xl font-bold mb-4">Delivery Details</h3>
            <div className="space-y-4">
              <input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Full Name" 
                className="w-full p-3 border-2 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-medium"
              />
              <input 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="Phone Number" 
                className="w-full p-3 border-2 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-medium"
              />
              <input 
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
                placeholder="City (Chennai only)" 
                className="w-full p-3 border-2 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-medium"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button 
            onClick={() => navigate('/cart')} 
            className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors"
          >
            Back to Cart
          </button>
          <button 
            onClick={placeOrder} 
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Place Order
          </button>
        </div>

        {status && (
          <div className={`mt-4 p-4 rounded-lg font-bold text-center ${
            status.startsWith('Order placed') 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {status}
          </div>
        )}
      </div>
    </div>
  )
}
}
