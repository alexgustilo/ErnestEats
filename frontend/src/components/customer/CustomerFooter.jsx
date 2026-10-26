import { Link } from 'react-router-dom'

function CustomerFooter() {
  return (
    <footer className="border-t border-[#E8D8BE] bg-[#29241E] text-[#FBF1DE]">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div><h2 className="text-xl font-extrabold">Ernest Kitchen &amp; Streetfood</h2><p className="mt-3 text-sm text-[#BFB5A5]">Fresh streetfood, made to order.</p></div>
        <section><h3 className="text-xs font-extrabold uppercase">Explore</h3><div className="mt-3 grid gap-2 text-sm text-[#BFB5A5]"><Link to="/customer">Home</Link><Link to="/customer/menu">Menu</Link><Link to="/customer/orders">My orders</Link></div></section>
        <section><h3 className="text-xs font-extrabold uppercase">Visit us</h3><p className="mt-3 text-sm leading-6 text-[#BFB5A5]">Main branch, pickup only<br />10:00 AM – 9:00 PM daily</p></section>
        <section><h3 className="text-xs font-extrabold uppercase">Get in touch</h3><p className="mt-3 text-sm leading-6 text-[#BFB5A5]">09124152485<br />ernestEats@gmail.com</p></section>
      </div>
      <div className="border-t border-white/10 px-5 py-4 text-center text-xs text-[#A79A87]">© {new Date().getFullYear()} ErnestEats</div>
    </footer>
  )
}

export default CustomerFooter
