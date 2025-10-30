import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { signup } = useAuth()
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    const res = await signup(name, email, password)
    if (res.ok) navigate('/')
    else setError(res.error || 'Signup failed')
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Create an account</h2>
      <form onSubmit={onSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        {error && <div className="text-red-600 font-medium">{error}</div>}
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Full name" className="w-full p-3 border-2 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 border-2 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
        <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-3 border-2 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
        <div className="flex justify-between items-center">
          <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold">Create account</button>
          <Link to="/login" className="text-primary font-medium">Already have an account?</Link>
        </div>
      </form>
    </div>
  )
}
