import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    const res = await login(email, password)
    if (res.ok) navigate('/')
    else setError(res.error || 'Login failed')
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={onSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        {error && <div className="text-red-600 font-medium">{error}</div>}
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 border-2 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
        <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-3 border-2 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
        <div className="flex justify-between items-center">
          <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold">Login</button>
          <Link to="/signup" className="text-primary font-medium">Create account</Link>
        </div>
      </form>
    </div>
  )
}
