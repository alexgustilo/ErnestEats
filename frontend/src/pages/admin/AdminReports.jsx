import { useEffect, useMemo, useState } from 'react'
import { useSales } from '../../features/sales/useSales'

const pad = (n) => String(n).padStart(2, '0')
const dateKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
const monthKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}`
function mondayOf(date) {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  result.setDate(result.getDate() - ((result.getDay() + 6) % 7))
  return result
}
function peso(value) {
  return `₱${(Number(value) || 0).toLocaleString('en-PH', { maximumFractionDigits: 2 })}`
}

function AdminReports() {
  const { sales, fetchSales, loading, error } = useSales()
  const [range, setRange] = useState('daily')
  useEffect(() => { fetchSales().catch(() => {}) }, [])

  const chart = useMemo(() => {
    const today = new Date()
    const bins = []
    if (range === 'daily') {
      for (let offset = 6; offset >= 0; offset -= 1) {
        const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset)
        bins.push({ key: dateKey(date), label: date.toLocaleDateString('en', { weekday: 'short' }), value: 0, count: 0 })
      }
    } else if (range === 'weekly') {
      const thisMonday = mondayOf(today)
      for (let offset = 6; offset >= 0; offset -= 1) {
        const date = new Date(thisMonday)
        date.setDate(date.getDate() - offset * 7)
        bins.push({ key: dateKey(date), label: date.toLocaleDateString('en', { month: 'short', day: 'numeric' }), value: 0, count: 0 })
      }
    } else {
      for (let offset = 5; offset >= 0; offset -= 1) {
        const date = new Date(today.getFullYear(), today.getMonth() - offset, 1)
        bins.push({ key: monthKey(date), label: date.toLocaleDateString('en', { month: 'short' }), value: 0, count: 0 })
      }
    }

    const bucketByKey = new Map(bins.map((bin) => [bin.key, bin]))
    for (const sale of sales) {
      if (!sale.sold_at) continue
      const date = new Date(sale.sold_at)
      if (Number.isNaN(date.getTime())) continue
      const key = range === 'daily' ? dateKey(date) : range === 'weekly' ? dateKey(mondayOf(date)) : monthKey(date)
      const bin = bucketByKey.get(key)
      if (bin) {
        bin.value += Number(sale.total_amount) || 0
        bin.count += 1
      }
    }
    return bins
  }, [sales, range])

  const total = chart.reduce((sum, bin) => sum + bin.value, 0)
  const max = Math.max(1, ...chart.map((bin) => bin.value))
  const filteredCount = chart.reduce((sum, bin) => sum + bin.count, 0)
  const recentSales = [...sales].sort((a, b) => new Date(b.sold_at) - new Date(a.sold_at)).slice(0, 6)

  return <section>
    <header className="mb-6"><h1 className="text-2xl font-extrabold">Sales / Reports</h1><p className="mt-1 text-sm text-[#8A7A61]">Recorded revenue from completed and paid orders</p></header>
    {error && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    <div className="mb-5 flex flex-wrap gap-2">{['daily', 'weekly', 'monthly'].map((item) => <button key={item} type="button" aria-pressed={range === item} onClick={() => setRange(item)} className={`rounded-lg border px-4 py-2 text-sm font-bold capitalize transition ${range === item ? 'border-[#241A12] bg-[#241A12] text-white' : 'border-[#D8BD8F] bg-white text-[#8A7A61] hover:text-[#241A12]'}`}>{item}</button>)}</div>
    <div className="mb-5 grid gap-4 sm:grid-cols-3">
      {[['Revenue in period', loading ? '…' : peso(total)], ['Sales records', loading ? '…' : String(filteredCount)], ['Average sale', loading ? '…' : peso(filteredCount ? total / filteredCount : 0)]].map(([label, value]) => <article key={label} className="rounded-2xl border border-[#EAD9BC] bg-white p-5"><p className="text-sm text-[#8A7A61]">{label}</p><strong className="mt-2 block text-2xl font-extrabold">{value}</strong></article>)}
    </div>
    <div className="grid gap-5 xl:grid-cols-2">
      <section className="rounded-2xl border border-[#EAD9BC] bg-white p-5 sm:p-6"><h2 className="mb-5 font-extrabold">Revenue · {range === 'daily' ? 'last 7 days' : range === 'weekly' ? 'last 7 weeks' : 'last 6 months'}</h2><div className="flex h-48 items-end gap-2 border-b border-[#EAD9BC] pb-0 sm:gap-3">{chart.map((bin) => <div key={bin.key} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"><span className="mb-1 truncate text-[10px] text-[#8A7A61]">{bin.value ? peso(bin.value) : ''}</span><div className="w-full rounded-t-md bg-[#E8531D]" style={{ height: `${bin.value ? Math.max(7, (bin.value / max) * 72) : 0}%` }} title={`${bin.label}: ${peso(bin.value)}`} /><span className="mt-2 text-[10px] font-semibold text-[#8A7A61]">{bin.label}</span></div>)}</div>{!loading && sales.length === 0 && <p className="mt-4 text-sm text-[#8A7A61]">No sales recorded yet.</p>}</section>
      <section className="overflow-hidden rounded-2xl border border-[#EAD9BC] bg-white"><div className="px-5 py-5 sm:px-6"><h2 className="font-extrabold">Recent sales</h2><p className="mt-1 text-sm text-[#8A7A61]">Latest sales returned by the backend</p></div><div className="overflow-x-auto"><table className="w-full min-w-[420px] border-collapse text-left text-sm"><thead className="bg-[#F0ECDD] text-[#8A7A61]"><tr><th className="px-4 py-3 font-semibold">Order</th><th className="px-4 py-3 font-semibold">Date</th><th className="px-4 py-3 font-semibold">Revenue</th></tr></thead><tbody>{recentSales.map((sale) => <tr key={sale.id} className="border-t border-[#EAD9BC]"><td className="px-4 py-3">#{String(sale.order_id || sale.id).slice(0, 8)}</td><td className="px-4 py-3">{sale.sold_at ? new Date(sale.sold_at).toLocaleDateString('en-PH') : '—'}</td><td className="px-4 py-3 font-semibold">{peso(sale.total_amount)}</td></tr>)}{!loading && recentSales.length === 0 && <tr><td colSpan="3" className="px-4 py-8 text-center text-[#8A7A61]">No sales recorded yet.</td></tr>}</tbody></table></div>{loading && <p className="border-t border-[#EAD9BC] px-4 py-3 text-sm text-[#8A7A61]">Loading sales…</p>}</section>
    </div>
  </section>
}

export default AdminReports
