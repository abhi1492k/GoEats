import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="text-center space-y-8">
      <div className="relative h-[500px] bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-8">
          <img src="/images/logo.svg" alt="GoEats Logo" className="w-24 h-24 mb-6" />
          <h1 className="text-4xl font-bold mb-4">GoEats — Chennai Cloud Kitchen</h1>
          <p className="text-xl font-medium mb-8">Fresh homestyle food delivered within Chennai</p>
          <Link 
            to="/menu" 
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors"
          >
            Browse Our Menu
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Why Choose GoEats?</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="font-bold text-lg mb-2">Home-Style Cooking</h3>
            <p className="font-medium">Authentic Chennai flavors made with love</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="font-bold text-lg mb-2">Quick Delivery</h3>
            <p className="font-medium">Fresh and hot to your doorstep</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="font-bold text-lg mb-2">Pure Veg Options</h3>
            <p className="font-medium">Wide selection for everyone</p>
          </div>
        </div>
      </div>
    </div>
  )
}
