import Link from 'next/link'
import { signOut } from '@/app/actions'
export const metadata={robots:{index:false,follow:false}}
export default function AdminLayout({children}:{children:React.ReactNode}){
 return <div className="min-h-screen bg-ink text-paper">
  <header className="border-b border-paper/10 bg-coal">
   <div aria-hidden className="h-1 w-full bg-gradient-to-r from-signal via-gold to-mint"/>
   <div className="container flex min-h-16 flex-wrap items-center justify-between gap-4">
    <Link href="/admin" className="flex items-center gap-3">
     <span className="grid h-9 w-9 place-items-center border border-signal/70 font-display text-xs text-signal">100</span>
     <span className="leading-none"><strong className="block font-display text-base uppercase tracking-[.12em]">Le 💯</strong><span className="tag text-[.55rem] text-smoke">ESPACE STUDIO</span></span>
    </Link>
    <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
     <Link href="/admin" className="navlink tag text-paper/70 hover:text-signal">Accueil</Link>
     <Link href="/admin/services" className="navlink tag text-paper/70 hover:text-signal">Prestations</Link>
     <Link href="/admin/packages" className="navlink tag text-paper/70 hover:text-signal">Packs</Link>
     <Link href="/admin/reservations" className="navlink tag text-paper/70 hover:text-signal">Sessions</Link>
     <Link href="/admin/orders" className="navlink tag text-paper/70 hover:text-signal">Commandes</Link>
     <Link href="/admin/messages" className="navlink tag text-paper/70 hover:text-signal">Messages</Link>
     <Link href="/admin/users" className="navlink tag text-paper/70 hover:text-signal">Membres</Link>
     <form action={signOut} className="ml-3"><button className="notch focus-ring border border-paper/30 px-4 py-2 font-mono text-[.62rem] uppercase tracking-[.15em] transition hover:border-signal hover:bg-signal hover:text-ink">Déconnexion</button></form>
    </nav>
   </div>
  </header>
  <main className="container py-10">{children}</main>
 </div>
}