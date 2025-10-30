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
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Our Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it) => (
          <div key={it.id} className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
            <div className="font-bold text-xl mb-2">{it.name}</div>
            <div className="text-blue-600 font-medium mb-3">{it.category}</div>
            <div className="text-2xl font-bold mb-4">₹{it.price}</div>
            <div className="flex gap-3">
              <button 
                onClick={() => addToCart(it)} 
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                Add to Cart
              </button>
              <button 
                onClick={() => navigate('/cart')} 
                className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors"
              >
                View Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
