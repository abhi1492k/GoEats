import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Welcome to GoEats — Chennai Cloud Kitchen</h1>
      <p>Fresh food delivered within Chennai. Try our menu!</p>
      <Link to="/menu" className="inline-block bg-blue-600 text-white px-4 py-2 rounded">See Menu</Link>
    </div>
  )
}
