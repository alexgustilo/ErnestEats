import { useState } from 'react'
import { useAuth } from '../../features/auth/useAuth'

function AuthPage() {
  const { login, register, loading, error } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ email: '', password: '', fullName: '', contactNumber: '' })
  const [result, setResult] = useState(null)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const data = isLogin ? await login(form) : await register(form)
      setResult(data)
    } catch (err) {
      // error na naka-store na sa hook (useAuth)
    }
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">

      {/* Top logo */}
      <div className="flex items-center justify-center gap-2.5 pt-7 pb-4 flex-none">
        <svg width="30" height="30" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="31" fill="#E8531D" />
          <path d="M17 40c2-2 3-16 0-22" stroke="#FBF1DE" strokeWidth="3.4" strokeLinecap="round" fill="none" transform="rotate(-10 32 32)" />
          <g transform="rotate(-10 32 32)">
            <circle cx="16.5" cy="16" r="6.4" fill="#F3A93B" />
            <circle cx="19.5" cy="27" r="6.4" fill="#FBF1DE" />
            <circle cx="22.5" cy="38" r="6.4" fill="#F3A93B" />
          </g>
        </svg>
        <div className="text-base font-bold text-[#241A12]">Ernest Kitchen &amp; Streetfood</div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Left art panel - hidden on small screens, fixed height, never resizes */}
        <div className="hidden md:flex flex-1 relative overflow-hidden flex-col justify-center px-16 bg-gradient-to-br from-[#2B2721] to-[#1D1B16]">
          <div className="absolute top-1/2 left-[52%] -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-[radial-gradient(circle,rgba(232,83,29,0.28)_0%,transparent_70%)] pointer-events-none" />

          <div className="relative self-start bg-[#F3A93B] text-[#241A12] text-[11px] font-extrabold px-3.5 py-1.5 rounded-full mb-6">
            Pickup only · Pay at counter
          </div>
          <h2 className="relative text-3xl font-extrabold text-white leading-snug max-w-[380px] mb-3.5">
            Craving something good?
          </h2>
          <p className="relative text-sm text-[#C9C2AC] leading-relaxed max-w-[360px] mb-8">
            Sign in to browse the full menu, order ahead, and skip the line at Ernest Kitchen and Streetfood.
          </p>

          <div className="relative flex gap-3.5 mb-8">
            <div className="rounded-2xl flex items-center justify-center text-2xl shadow-lg" style={{ background: '#F3A93B', width: 60, height: 60 }}>🥡</div>
            <div className="rounded-2xl flex items-center justify-center text-3xl shadow-lg -translate-y-3" style={{ background: '#E8531D', width: 70, height: 70 }}>🍔</div>
            <div className="rounded-2xl flex items-center justify-center text-2xl shadow-lg" style={{ background: '#FBF1DE', width: 60, height: 60 }}>🍥</div>
          </div>

          <div className="relative flex flex-col gap-3 mb-8">
            {['Order ahead, pick up fresh', 'Track your order live', 'Save your details for next time'].map((perk) => (
              <div key={perk} className="flex items-center gap-2.5 text-[13px] text-[#E7DFCB] font-semibold">
                <div className="w-5 h-5 rounded-full bg-[rgba(243,169,59,0.18)] text-[#F3A93B] flex items-center justify-center text-[11px] font-black">✓</div>
                {perk}
              </div>
            ))}
          </div>

          <div className="relative border-t border-[#3A2E22] pt-4 text-xs text-[#8F8570] leading-relaxed max-w-[400px]">
            "<b className="text-[#C9C2AC]">Ordering here is so fast!</b>" — a regular customer
          </div>
        </div>

        {/* Right form panel - scrolls internally if content grows, never affects left panel */}
        <div className="w-full md:w-[460px] flex-none p-8 md:p-16 flex flex-col justify-center overflow-y-auto">

          {/* Tabs */}
          <div className="flex gap-1 bg-[#FBF1DE] rounded-[11px] p-1 mb-6 flex-none">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 text-center text-[12.5px] font-bold py-2.5 rounded-lg transition ${
                isLogin ? 'bg-[#241A12] text-white' : 'text-[#8A7A61]'
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 text-center text-[12.5px] font-bold py-2.5 rounded-lg transition ${
                !isLogin ? 'bg-[#241A12] text-white' : 'text-[#8A7A61]'
              }`}
            >
              Create account
            </button>
          </div>

          <h2 className="text-2xl font-black text-[#241A12] mb-1.5">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-[12.5px] text-[#8A7A61] mb-6 leading-relaxed">
            {isLogin
              ? "Log in to your account. Whether you're a customer or an admin, we'll take you to the right place."
              : 'Sign up to start ordering from Ernest Kitchen and Streetfood.'}
          </p>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-4">
                <label className="text-[11px] font-bold text-[#8A7A61] uppercase tracking-wide block mb-1.5">Full name</label>
                <input
                  name="fullName"
                  placeholder="Alex Gustilo"
                  onChange={handleChange}
                  className="w-full px-3.5 py-3 rounded-lg border border-[#EAD9BC] text-[13px] text-[#241A12] focus:outline-none focus:border-[#E8531D]"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="text-[11px] font-bold text-[#8A7A61] uppercase tracking-wide block mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                placeholder="you@gmail.com"
                onChange={handleChange}
                className="w-full px-3.5 py-3 rounded-lg border border-[#EAD9BC] text-[13px] text-[#241A12] focus:outline-none focus:border-[#E8531D]"
              />
            </div>

            {!isLogin && (
              <div className="mb-4">
                <label className="text-[11px] font-bold text-[#8A7A61] uppercase tracking-wide block mb-1.5">Contact number</label>
                <input
                  name="contactNumber"
                  placeholder="0917 000 0000"
                  onChange={handleChange}
                  className="w-full px-3.5 py-3 rounded-lg border border-[#EAD9BC] text-[13px] text-[#241A12] focus:outline-none focus:border-[#E8531D]"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="text-[11px] font-bold text-[#8A7A61] uppercase tracking-wide block mb-1.5">Password</label>
              <input
                name="password"
                type="password"
                placeholder={isLogin ? 'Enter your password' : 'Create password'}
                onChange={handleChange}
                className="w-full px-3.5 py-3 rounded-lg border border-[#EAD9BC] text-[13px] text-[#241A12] focus:outline-none focus:border-[#E8531D]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="block w-full text-center bg-[#E8531D] text-white font-extrabold text-sm py-3.5 rounded-[11px] hover:bg-[#B23F14] transition disabled:opacity-50"
            >
              {loading ? 'Please wait...' : isLogin ? 'Log in' : 'Create account'}
            </button>
          </form>

          {error && <p className="text-[#C13A2E] text-sm mt-3">{error}</p>}
          {result && (
            <pre className="text-xs bg-[#FBF1DE] p-2 mt-3 rounded overflow-x-auto max-h-32">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}

          <div className="flex items-center gap-3 my-5 text-[11px] text-[#8A7A61] flex-none">
            <div className="flex-1 h-px bg-[#EAD9BC]" />
            or
            <div className="flex-1 h-px bg-[#EAD9BC]" />
          </div>

          <p className="text-center text-[12.5px] text-[#8A7A61]">
            {isLogin ? (
              <>New to Ernest Kitchen? <span onClick={() => setIsLogin(false)} className="text-[#B23F14] font-extrabold cursor-pointer">Create an account</span></>
            ) : (
              <>Already have an account? <span onClick={() => setIsLogin(true)} className="text-[#B23F14] font-extrabold cursor-pointer">Log in</span></>
            )}
          </p>

          {isLogin && (
            <p className="text-[10.5px] text-[#8A7A61] text-center mt-4 leading-relaxed">
              One login for everyone — customers land on the menu, admins land on the dashboard.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthPage