import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Menu() {
  const [items, setItems] = useState([])
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'))
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/.netlify/functions/menu')
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setItems([]))
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  function addToCart(item) {
    setCart((c) => [...c, item])
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((it) => (
          <div key={it.id} className="bg-white p-4 rounded shadow">
            <div className="font-medium">{it.name}</div>
            <div className="text-sm text-gray-600">{it.category}</div>
            <div className="mt-2">₹{it.price}</div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => addToCart(it)} className="px-3 py-1 bg-green-600 text-white rounded">Add</button>
              <button onClick={() => navigate('/cart')} className="px-3 py-1 border rounded">Go to cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
