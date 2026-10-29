import { useCallback, useEffect, useState } from 'react'
import { getMyProfile, updateMyProfile } from '../../features/profile/profileApi'

function CustomerProfile() {
  const [form, setForm] = useState({ full_name: '', contact_number: '' })
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadProfile = useCallback(async () => {
    try {
      const profile = await getMyProfile()
      setForm({ full_name: profile.full_name || '', contact_number: profile.contact_number || '' })
      let savedUser = null
      try { savedUser = JSON.parse(sessionStorage.getItem('user') || 'null') } catch { /* ignore invalid user cache */ }
      setEmail(profile.email || savedUser?.email || '')
      sessionStorage.setItem('profile', JSON.stringify(profile))
      window.dispatchEvent(new Event('ernesteats-profile-updated'))
    } catch (err) {
      setError(err.message || 'Failed to load your profile.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    Promise.resolve().then(loadProfile)
  }, [loadProfile])

  function retryLoad() {
    setLoading(true)
    setError('')
    loadProfile()
  }

  function change(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setSuccess('')
  }

  async function submit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const profile = await updateMyProfile(form)
      setForm({ full_name: profile.full_name || '', contact_number: profile.contact_number || '' })
      sessionStorage.setItem('profile', JSON.stringify(profile))
      window.dispatchEvent(new Event('ernesteats-profile-updated'))
      setSuccess('Your profile has been saved.')
    } catch (err) {
      setError(err.message || 'Could not save your profile.')
    } finally {
      setSaving(false)
    }
  }

  const initials = (form.full_name || email || 'A')
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')

  return (
    <main className="min-h-[60vh] px-5 py-10 sm:px-8">
      <div style={{ maxWidth: 760, marginInline: 'auto' }}>
        <header className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#A54A26]">Account</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">My profile</h1>
          <p className="mt-2 text-sm text-[#817565]">Update the details we use for your pickup orders.</p>
        </header>

        {loading ? (
          <div className="h-[460px] animate-pulse rounded-2xl bg-[#ECE8DF]" />
        ) : error && !form.full_name ? (
          <section className="rounded-2xl bg-white p-7 shadow-sm">
            <p role="alert" className="text-sm text-red-700">{error}</p>
            <button type="button" onClick={retryLoad} className="mt-5 rounded-lg bg-[#29241E] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#453A30]">Try again</button>
          </section>
        ) : (
          <form onSubmit={submit} className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_rgba(38,32,24,.06)]">
            <div className="flex items-center gap-4 border-b border-[#EEEAE2] px-5 py-5 sm:px-7">
              <div style={{ width: 56, height: 56, flex: '0 0 56px' }} className="flex items-center justify-center rounded-full bg-[#E8D5B7] text-base font-extrabold text-[#292722]">{initials}</div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-base font-bold text-[#29241E]">{form.full_name || 'Your profile'}</h2>
                <p className="mt-1 truncate text-sm text-[#817565]">{email || 'Email address not available'}</p>
              </div>
              <span className="hidden rounded-full bg-[#F5F3EE] px-3 py-1.5 text-xs font-semibold text-[#756957] sm:inline-flex">Customer</span>
            </div>

            <div className="px-5 py-6 sm:px-7">
              <h3 className="text-sm font-bold text-[#29241E]">Personal information</h3>
              <p className="mt-1 text-sm text-[#817565]">Keep your contact details current.</p>

              <div className="mt-6 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#4E4941]">Full name</span>
                  <input name="full_name" value={form.full_name} onChange={change} required autoComplete="name" className="w-full rounded-xl border border-[#E6E1D8] px-4 py-3 text-sm outline-none transition focus:border-[#B94E2B] focus:ring-2 focus:ring-[#B94E2B]/10" placeholder="Enter your full name" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#4E4941]">Email address</span>
                  <input type="email" value={email} readOnly aria-describedby="email-note" className="w-full cursor-not-allowed rounded-xl border border-[#E6E1D8] bg-[#F7F6F2] px-4 py-3 text-sm text-[#77736C]" />
                  <span id="email-note" className="mt-1.5 block text-xs text-[#8A8177]">Your sign-in email can’t be changed here.</span>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#4E4941]">Contact number</span>
                  <input name="contact_number" type="tel" inputMode="tel" autoComplete="tel" value={form.contact_number} onChange={change} className="w-full rounded-xl border border-[#E6E1D8] px-4 py-3 text-sm outline-none transition focus:border-[#B94E2B] focus:ring-2 focus:ring-[#B94E2B]/10" placeholder="Enter a contact number" />
                  <span className="mt-1.5 block text-xs text-[#8A8177]">We’ll use this if we need to contact you about your pickup.</span>
                </label>
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-xl bg-[#FBF7EF] px-4 py-3">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-[#A54A26]" fill="none" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>
                <p className="text-xs leading-5 text-[#756957]"><span className="font-bold text-[#39352F]">Pickup at Main branch.</span> Pay at the counter when you collect your order.</p>
              </div>

              {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
              {success && <p role="status" className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{success}</p>}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#EEEAE2] pt-5">
                <p className="text-xs text-[#817565]">Changes apply to your next order.</p>
                <button disabled={saving} className="rounded-xl bg-[#29241E] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#453A30] disabled:cursor-wait disabled:opacity-60">{saving ? 'Saving…' : 'Save changes'}</button>
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}

export default CustomerProfile
