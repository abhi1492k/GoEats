import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ge_user') || 'null')
    } catch (e) {
      return null
    }
  })

  useEffect(() => {
    if (user) localStorage.setItem('ge_user', JSON.stringify(user))
    else localStorage.removeItem('ge_user')
  }, [user])

  async function login(email, password) {
    const res = await fetch('/.netlify/functions/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (res.ok) {
      // store token in localStorage (simple demo)
      localStorage.setItem('ge_token', data.token)
      setUser(data.user)
      return { ok: true }
    }
    return { ok: false, error: data.error }
  }

  async function signup(name, email, password) {
    const res = await fetch('/.netlify/functions/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await res.json()
    if (res.ok || res.status === 201) {
      localStorage.setItem('ge_token', data.token)
      setUser(data.user)
      return { ok: true }
    }
    return { ok: false, error: data.error }
  }

  function logout() {
    localStorage.removeItem('ge_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
