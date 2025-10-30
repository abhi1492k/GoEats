import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/images/logo.svg" alt="GoEats Logo" className="w-10 h-10" />
              <span className="font-bold text-xl text-blue-600">GoEats Chennai</span>
            </Link>
            <div className="space-x-6 font-medium">
              <Link to="/menu" className="hover:text-blue-600 transition-colors">Menu</Link>
              <Link to="/cart" className="hover:text-blue-600 transition-colors">Cart</Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>
    </div>
  )
}
