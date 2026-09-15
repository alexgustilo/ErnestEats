import { useState } from 'react'
import { replace, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth'

function AuthPage() {
  const { login, register, loading, error } = useAuth()
  const navigate = useNavigate()

  const [isLogin, setIsLogin] = useState(true)

  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    contactNumber: '',
  })

  const [result, setResult] = useState(null)

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  function switchMode(loginMode) {
    setIsLogin(loginMode)
    setResult(null)
  }

  async function handleSubmit(e){
    e.preventDefault();

    try{
      if (isLogin){
        const data = await login(form)
        const role = data?.profile?.role

        if(role === 'customer'){
          navigate('/customer', {replace:true})
          return
        }
        if(role === 'admin'){
          navigate('/admin', {replace:true})
          return
        }

        return
      }

      //Register
      await register(form)

      //Rehister Successful
      setIsLogin(true)

      //Clear Form
      setForm({
        email: '',
        password: '',
        fullName: '',
        contactNumber: '',

      })

    }catch(err){
      //Error already handle in useAuth page
    }
  }
  return (
    <div className="min-h-screen bg-[#F8F7F5] flex flex-col">

      {/* HEADER */}
      <header className="bg-white border-b border-[#EFE8DD] flex-none">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-[82px] flex items-center justify-center">
          <div className="flex items-center gap-3">

            <img
              src="/logo/logo1.png"
              alt="Ernest Kitchen & Streetfood"
              className="h-12 md:h-14 w-auto object-contain"
            />

            <div className="hidden sm:block w-px h-8 bg-[#E7DED1]" />

            <div className="hidden sm:block">
              <h1 className="text-base md:text-lg font-bold text-[#241A12] leading-tight">
                Ernest Kitchen
              </h1>

              <p className="text-[11px] text-[#9A8D7B] font-medium tracking-wide">
                KITCHEN & STREETFOOD
              </p>
            </div>

          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex flex-1 min-h-0">

        {/* LEFT PANEL */}
        <section className="hidden lg:flex relative flex-1 overflow-hidden bg-[#25211C]">

          <div className="absolute inset-0 pointer-events-none">

            <div className="absolute top-[15%] right-[10%] w-[420px] h-[420px] rounded-full bg-[#E8531D]/10 blur-[100px]" />

            <div className="absolute bottom-[-120px] left-[15%] w-[350px] h-[350px] rounded-full bg-[#F3A93B]/10 blur-[100px]" />

          </div>

          <div className="absolute top-10 right-10 w-32 h-32 border border-white/5 rounded-full" />

          <div className="absolute bottom-12 right-24 w-20 h-20 border border-white/5 rounded-full" />

          <div className="relative z-10 w-full max-w-[650px] mx-auto px-10 xl:px-20 flex flex-col justify-center">

            <div className="inline-flex self-start items-center gap-2 bg-[#F3A93B] text-[#241A12] text-[11px] font-extrabold px-4 py-2 rounded-full mb-7 shadow-lg">

              <span className="w-1.5 h-1.5 rounded-full bg-[#E8531D]" />

              Pickup only · Pay at counter

            </div>

            <h2 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] tracking-tight max-w-[480px]">
              Craving something
              <span className="text-[#F3A93B]"> good?</span>
            </h2>

            <p className="mt-5 text-[15px] text-[#BFB5A5] leading-relaxed max-w-[440px]">
              Browse your favorite meals, order ahead, and skip the line.
              Fresh food from Ernest Kitchen & Streetfood is just a few clicks away.
            </p>

            <div className="flex items-end gap-4 mt-10 mb-10">

              <div className="w-[68px] h-[68px] rounded-2xl bg-[#F3A93B] flex items-center justify-center text-3xl shadow-xl transition-transform hover:-translate-y-1">
                🥡
              </div>

              <div className="w-[82px] h-[82px] rounded-2xl bg-[#E8531D] flex items-center justify-center text-4xl shadow-2xl -translate-y-3 transition-transform hover:-translate-y-5">
                🍔
              </div>

              <div className="w-[68px] h-[68px] rounded-2xl bg-[#F6EEDF] flex items-center justify-center text-3xl shadow-xl transition-transform hover:-translate-y-1">
                🍜
              </div>

            </div>

            <div className="space-y-4">

              {[
                {
                  title: 'Order ahead',
                  description: 'Skip the wait and pick up fresh.',
                },
                {
                  title: 'Track your order',
                  description: 'Stay updated from kitchen to pickup.',
                },
                {
                  title: 'Save your details',
                  description: 'Make your next order even faster.',
                },
              ].map((perk) => (

                <div
                  key={perk.title}
                  className="flex items-start gap-3"
                >

                  <div className="mt-0.5 w-6 h-6 rounded-full bg-[#F3A93B]/10 border border-[#F3A93B]/20 flex items-center justify-center text-[#F3A93B] text-xs font-bold">
                    ✓
                  </div>

                  <div>

                    <p className="text-sm font-bold text-[#EDE6DB]">
                      {perk.title}
                    </p>

                    <p className="text-xs text-[#938879] mt-0.5">
                      {perk.description}
                    </p>

                  </div>

                </div>

              ))}

            </div>

            <div className="border-t border-white/10 mt-10 pt-5">

              <p className="text-xs text-[#817769] italic">
                “Ordering here is so fast!”{' '}
                <span className="not-italic text-[#C8BFAF]">
                  — A happy customer
                </span>
              </p>

            </div>

          </div>

        </section>

        {/* RIGHT PANEL */}
        <section className="w-full lg:w-[520px] xl:w-[560px] bg-white flex justify-center overflow-y-auto">

          <div className="w-full max-w-[420px] px-6 sm:px-10 py-10 lg:py-12 flex flex-col justify-center min-h-full">

            {/* TABS */}
            <div className="grid grid-cols-2 gap-1 bg-[#F7F1E7] p-1 rounded-xl mb-8">

              <button
                type="button"
                onClick={() => switchMode(true)}
                className={`
                  py-3 rounded-lg text-sm font-bold transition-all duration-200
                  ${
                    isLogin
                      ? 'bg-[#29221B] text-white shadow-md'
                      : 'text-[#8A7A61] hover:text-[#241A12]'
                  }
                `}
              >
                Log in
              </button>

              <button
                type="button"
                onClick={() => switchMode(false)}
                className={`
                  py-3 rounded-lg text-sm font-bold transition-all duration-200
                  ${
                    !isLogin
                      ? 'bg-[#29221B] text-white shadow-md'
                      : 'text-[#8A7A61] hover:text-[#241A12]'
                  }
                `}
              >
                Create account
              </button>

            </div>

            {/* TITLE */}
            <div className="mb-8">

              <p className="text-xs font-bold tracking-[0.15em] text-[#E8531D] uppercase mb-3">
                {isLogin ? 'Welcome back' : 'Join Ernest Eats'}
              </p>

              <h2 className="text-3xl font-black text-[#241A12] tracking-tight">
                {isLogin
                  ? 'Good to see you again.'
                  : 'Create your account.'}
              </h2>

              <p className="text-sm text-[#8A7A61] mt-3 leading-relaxed">
                {isLogin
                  ? 'Log in to continue ordering your favorite meals.'
                  : 'Sign up and start ordering from Ernest Kitchen & Streetfood.'}
              </p>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* FULL NAME */}
              {!isLogin && (
                <div>

                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#756957] mb-2">
                    Full name
                  </label>

                  <input
                    name="fullName"
                    value={form.fullName}
                    placeholder="Enter your full name"
                    onChange={handleChange}
                    required
                    className="
                      w-full px-4 py-3.5
                      rounded-xl
                      border border-[#E6DCCF]
                      bg-[#FFFEFC]
                      text-sm text-[#241A12]
                      placeholder:text-[#B4A999]
                      outline-none
                      transition
                      focus:border-[#E8531D]
                      focus:ring-4 focus:ring-[#E8531D]/10
                    "
                  />

                </div>
              )}

              {/* EMAIL */}
              <div>

                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#756957] mb-2">
                  Email address
                </label>

                <input
                  name="email"
                  type="email"
                  value={form.email}
                  placeholder="you@gmail.com"
                  onChange={handleChange}
                  required
                  className="
                    w-full px-4 py-3.5
                    rounded-xl
                    border border-[#E6DCCF]
                    bg-[#FFFEFC]
                    text-sm text-[#241A12]
                    placeholder:text-[#B4A999]
                    outline-none
                    transition
                    focus:border-[#E8531D]
                    focus:ring-4 focus:ring-[#E8531D]/10
                  "
                />

              </div>

              {/* CONTACT */}
              {!isLogin && (
                <div>

                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#756957] mb-2">
                    Contact number
                  </label>

                  <input
                    name="contactNumber"
                    type="tel"
                    value={form.contactNumber}
                    placeholder="0917 000 0000"
                    onChange={handleChange}
                    required
                    className="
                      w-full px-4 py-3.5
                      rounded-xl
                      border border-[#E6DCCF]
                      bg-[#FFFEFC]
                      text-sm text-[#241A12]
                      placeholder:text-[#B4A999]
                      outline-none
                      transition
                      focus:border-[#E8531D]
                      focus:ring-4 focus:ring-[#E8531D]/10
                    "
                  />

                </div>
              )}

              {/* PASSWORD */}
              <div>

                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#756957] mb-2">
                  Password
                </label>

                <input
                  name="password"
                  type="password"
                  value={form.password}
                  placeholder={
                    isLogin
                      ? 'Enter your password'
                      : 'Create a password'
                  }
                  onChange={handleChange}
                  required
                  className="
                    w-full px-4 py-3.5
                    rounded-xl
                    border border-[#E6DCCF]
                    bg-[#FFFEFC]
                    text-sm text-[#241A12]
                    placeholder:text-[#B4A999]
                    outline-none
                    transition
                    focus:border-[#E8531D]
                    focus:ring-4 focus:ring-[#E8531D]/10
                  "
                />

              </div>

              {/* ERROR */}
              {error && (
                <div className="bg-red-50 border border-red-100 text-[#C13A2E] text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full mt-2
                  bg-[#E8531D]
                  hover:bg-[#C94316]
                  active:scale-[0.99]
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  text-white
                  font-bold
                  text-sm
                  py-4
                  rounded-xl
                  shadow-lg shadow-[#E8531D]/20
                  transition-all duration-200
                "
              >
                {loading
                  ? 'Please wait...'
                  : isLogin
                    ? 'Log in to your account'
                    : 'Create my account'}
              </button>

            </form>

            {/* RESULT */}
            {result && (
              <pre className="text-xs bg-[#F7F1E7] text-[#5F5548] p-3 mt-4 rounded-xl overflow-x-auto max-h-32">
                {JSON.stringify(result, null, 2)}
              </pre>
            )}

            {/* DIVIDER */}
            <div className="flex items-center gap-4 my-7">

              <div className="flex-1 h-px bg-[#EEE6DB]" />

              <span className="text-xs text-[#A39889]">
                or
              </span>

              <div className="flex-1 h-px bg-[#EEE6DB]" />

            </div>

            {/* SWITCH ACCOUNT */}
            <p className="text-center text-sm text-[#8A7A61]">

              {isLogin ? (
                <>
                  New to Ernest Eats?{' '}

                  <button
                    type="button"
                    onClick={() => switchMode(false)}
                    className="text-[#C94316] font-bold hover:underline"
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}

                  <button
                    type="button"
                    onClick={() => switchMode(true)}
                    className="text-[#C94316] font-bold hover:underline"
                  >
                    Log in
                  </button>
                </>
              )}

            </p>

            {/* LOGIN INFO */}
            {isLogin && (
              <p className="text-[11px] text-[#A39889] text-center mt-6 leading-relaxed">
                One account for everyone. Customers go to the menu,
                while administrators access the dashboard.
              </p>
            )}

          </div>

        </section>

      </main>

    </div>
  )
}

export default AuthPage;