import { useEffect, useState } from 'react'
import { getMyProfile, updateMyProfile } from '../../features/profile/profileApi'

function CustomerProfile() {
  const [form, setForm] = useState({ full_name: '', contact_number: '' })
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')


  
  useEffect(() => {
    let active = true
    getMyProfile().then((profile) => {
      if (!active) return
      setForm({ full_name: profile.full_name || '', contact_number: profile.contact_number || '' })
      let savedUser = null
      try { savedUser = JSON.parse(localStorage.getItem('user') || 'null') } catch { /* ignore invalid user cache */ }
      setEmail(profile.email || savedUser?.email || '')
      localStorage.setItem('profile', JSON.stringify(profile))
      window.dispatchEvent(new Event('ernesteats-profile-updated'))
    }).catch((err) => active && setError(err.message)).finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])
  function change(event) { setForm((current) => ({ ...current, [event.target.name]: event.target.value })) }
  async function submit(event) {
    event.preventDefault(); setSaving(true); setError(''); setSuccess('')
    try {
      const profile = await updateMyProfile(form)
      setForm({ full_name: profile.full_name || '', contact_number: profile.contact_number || '' })
      localStorage.setItem('profile', JSON.stringify(profile))
      window.dispatchEvent(new Event('ernesteats-profile-updated'))
      setSuccess('Na-save na ang profile mo.')
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }
  return (
    <main className="mx-auto min-h-[60vh] max-w-4xl px-5 py-9 sm:px-8"><p className="text-xs font-bold uppercase tracking-widest text-[#B23F14]">Account</p><h1 className="mt-2 text-3xl font-extrabold">My profile</h1><p className="mt-2 text-sm text-[#8A7A61]">Keep your contact details up to date.</p>
      {loading ? <p className="py-12 text-[#8A7A61]">Loading profile…</p> : <form onSubmit={submit} className="mt-7 max-w-2xl space-y-5 rounded-2xl border border-[#EAD9BC] bg-white p-6">
        <label className="block"><span className="mb-2 block text-xs font-bold uppercase text-[#756957]">Full name</span><input name="full_name" value={form.full_name} onChange={change} required className="w-full rounded-xl border border-[#EAD9BC] px-4 py-3 outline-none focus:border-[#E8531D]" /></label>
        <label className="block"><span className="mb-2 block text-xs font-bold uppercase text-[#756957]">Email address</span><input value={email} readOnly className="w-full rounded-xl border border-[#EAD9BC] bg-[#FBF8F2] px-4 py-3 text-[#8A7A61]" /></label>
        <label className="block"><span className="mb-2 block text-xs font-bold uppercase text-[#756957]">Contact number</span><input name="contact_number" type="tel" value={form.contact_number} onChange={change} className="w-full rounded-xl border border-[#EAD9BC] px-4 py-3 outline-none focus:border-[#E8531D]" /></label>
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}{success && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{success}</p>}
        <button disabled={saving} className="rounded-xl bg-[#E8531D] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save changes'}</button>
      </form>}
    </main>
  )
}
export default CustomerProfile
