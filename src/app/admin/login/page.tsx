import { signIn } from '@/app/actions'
import Link from 'next/link'
import Image from 'next/image'
export const metadata={robots:{index:false,follow:false}}
function RegMark({className}:{className:string}){return <span aria-hidden className={`regmark ${className}`}><i/></span>}
export default async function Login({searchParams}:{searchParams:Promise<{error?:string}>}){
 const {error}=await searchParams
 const field='w-full border-b border-paper/25 bg-transparent px-0 py-3 text-paper caret-signal placeholder:text-smoke focus:border-signal focus:outline-none'
 return <main className="grid min-h-screen place-items-center bg-ink px-5 text-paper">
  <div className="relative w-full max-w-md border border-paper/20 bg-coal p-8">
   <RegMark className="-left-3 -top-3 text-signal"/>
   <RegMark className="-right-3 -bottom-3 text-signal"/>
   <form action={signIn}>
    <Link href="/" className="tag text-smoke transition hover:text-signal">← Retour au site</Link>
    <div className="mt-6 border border-paper/15 p-3"><Image src="/studio/logo-neon.png" alt="Le 100 Pub & Prod" width={240} height={130} className="mx-auto h-28 w-56 object-contain"/></div>
    <p className="tag mt-7 flex items-center gap-3 text-signal"><span className="blink inline-block h-2 w-2 rounded-full bg-signal"/>ACCÈS RÉSERVÉ</p>
    <h1 className="mt-3 font-display text-4xl uppercase leading-[.9]">Connexion<br/>studio</h1>
    <p className="mt-3 text-sm text-smoke">Accès réservé à l’administration de Le 💯.</p>
    {error&&<p role="alert" className="mt-5 border border-signal/40 bg-signal/10 p-3 font-mono text-xs text-signal">{error==='unauthorized'?'Ce compte n’a pas accès à l’administration.':'E-mail ou mot de passe incorrect.'}</p>}
    <label className="mt-7 grid gap-1">
     <span className="tag text-paper/55">{`// E-mail`}</span>
     <input className={field} required type="email" name="email" autoComplete="username"/>
    </label>
    <label className="mt-5 grid gap-1">
     <span className="tag text-paper/55">{`// Mot de passe`}</span>
     <input className={field} required type="password" name="password" autoComplete="current-password"/>
    </label>
    <button className="notch focus-ring mt-8 w-full bg-paper px-6 py-4 font-display text-sm uppercase tracking-[.15em] text-ink transition hover:bg-signal">Se connecter</button>
   </form>
  </div>
 </main>
}