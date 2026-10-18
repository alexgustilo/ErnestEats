function CustomerAbout() {
  return (
    <main className="mx-auto min-h-[60vh] max-w-5xl px-5 py-10 sm:px-8">
      <section className="rounded-3xl border border-[#E8D8BE] bg-white p-7 sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#A54A26]">About us</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-[#29241E]">Ernest Kitchen &amp; Streetfood</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[#746B60]">Freshly prepared meals and streetfood favorites, ready for pickup. Order ahead and we’ll prepare your food at the kitchen.</p>
        <div className="mt-9 grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-[#E8D8BE] bg-[#FBF8F2] p-5"><h2 className="font-bold text-[#29241E]">Pickup</h2><p className="mt-2 text-sm leading-6 text-[#746B60]">Main branch · Pickup only · Pay at the counter.</p></article>
          <article className="rounded-2xl border border-[#E8D8BE] bg-[#FBF8F2] p-5"><h2 className="font-bold text-[#29241E]">Store hours</h2><p className="mt-2 text-sm leading-6 text-[#746B60]">10:00 AM – 9:00 PM daily</p></article>
        </div>
      </section>
    </main>
  )
}
export default CustomerAbout
