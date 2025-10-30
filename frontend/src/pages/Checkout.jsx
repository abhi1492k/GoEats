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
    <div>
      <h2 className="text-xl font-semibold mb-4">Checkout</h2>
      <div className="space-y-3 max-w-md">
        <div>Items: {cart.length}</div>
        <div>Total: ₹{total}</div>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full p-2 border rounded" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="w-full p-2 border rounded" />
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="w-full p-2 border rounded" />
        <div className="flex gap-2">
          <button onClick={() => navigate('/cart')} className="px-3 py-1 border rounded">Back to cart</button>
          <button onClick={placeOrder} className="px-3 py-1 bg-green-600 text-white rounded">Place Order</button>
        </div>
        {status && <div className="mt-2 p-2 bg-gray-100 rounded">{status}</div>}
      </div>
    </div>
  )
}
