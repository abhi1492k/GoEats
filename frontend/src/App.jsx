import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { AuthProvider, useAuth } from './auth/AuthProvider'

function NavRight() {
  const { user, logout } = useAuth()
  const [open, setOpen] = React.useState(false)
  const initials = user ? (user.name ? user.name.split(' ').map(s=>s[0]).slice(0,2).join('') : user.email?.[0]?.toUpperCase()||'U') : ''

  return (
    <div className="relative font-medium flex items-center space-x-4">
      <Link to="/menu" className="hover:text-primary transition-colors">Menu</Link>
      <Link to="/cart" className="hover:text-primary transition-colors">Cart</Link>

      {user ? (
        <div className="relative">
          <button onClick={()=>setOpen(o=>!o)} className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md">
            {initials}
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg ring-1 ring-black/5">
              <div className="p-3 border-b text-sm text-gray-700">Signed in as <div className="font-bold">{user.name || user.email}</div></div>
              <div className="flex flex-col p-2">
                <Link to="/" onClick={()=>setOpen(false)} className="px-3 py-2 text-sm rounded hover:bg-gray-50">Profile</Link>
                <button onClick={()=>{ setOpen(false); logout() }} className="px-3 py-2 text-sm text-left rounded hover:bg-gray-50">Logout</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-primary font-medium">Login</Link>
          <Link to="/signup" className="px-3 py-1 bg-primary text-white rounded-md font-medium">Sign up</Link>
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <img src="/images/logo.svg" alt="GoEats Logo" className="w-10 h-10" />
                <span className="font-bold text-xl text-primary">GoEats Chennai</span>
              </Link>
              <NavRight />
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}
