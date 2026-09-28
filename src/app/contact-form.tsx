'use client'
import { useActionState } from 'react'
import { sendContact, type FormState } from './actions'
const initial:FormState={}
const field='w-full border-b border-paper/25 bg-transparent px-0 py-3 text-paper caret-signal placeholder:text-smoke focus:border-signal focus:outline-none'
export default function ContactForm(){
 const [state,action,pending]=useActionState(sendContact,initial)
 if(state.ok)return (
  <div className="border border-paper/20 bg-ink p-8">
   <p className="tag text-signal">MESSAGE ENVOYÉ ✓</p>
   <h3 className="mt-4 font-display text-4xl uppercase leading-[.9]">Merci, on vous<br/>répond vite.</h3>
   <p className="mt-3 text-sm text-smoke">Votre demande est bien arrivée au studio.</p>
  </div>
 )
 return (
  <form action={action} className="border border-paper/20 bg-ink p-6 md:p-9">
   <p className="tag flex items-center gap-3 text-signal"><span className="blink inline-block h-2 w-2 rounded-full bg-signal"/>FORMULAIRE EN LIGNE</p>
   <div className="mt-6 grid gap-6 sm:grid-cols-2">
    {[['full_name','Votre nom','text'],['artist_name','Nom d’artiste (facultatif)','text'],['phone','Téléphone','tel'],['email','E-mail (facultatif)','email']].map(([name,label,type])=>(
     <label key={name} className="grid gap-1">
      <span className="tag text-smoke">{`// ${label}`}</span>
      <input className={field} name={name} type={type} required={name==='full_name'||name==='phone'}/>
     </label>
    ))}
   </div>
   <label className="mt-6 grid gap-1">
    <span className="tag text-smoke">{`// Prestation souhaitée`}</span>
    <select name="service_interest" className={field}>
     <option className="bg-ink" value="">À définir ensemble</option>
     <option className="bg-ink">Enregistrement vocal</option>
     <option className="bg-ink">Mixage & mastering</option>
     <option className="bg-ink">Beatmaking & composition</option>
     <option className="bg-ink">Topline & écriture</option>
     <option className="bg-ink">Réalisation clip vidéo</option>
     <option className="bg-ink">Pack combo</option>
    </select>
   </label>
   <label className="mt-6 grid gap-1">
    <span className="tag text-smoke">{`// Parlez-nous de votre projet`}</span>
    <textarea name="message" required minLength={10} rows={4} className={field} placeholder="Le morceau, le style, vos disponibilités…"/>
   </label>
   {state.error&&<p role="alert" className="mt-4 font-mono text-sm text-signal">{state.error}</p>}
   <button disabled={pending} className="notch focus-ring mt-8 w-full bg-paper px-7 py-4 font-display text-sm uppercase tracking-[.15em] text-ink hover:bg-signal disabled:opacity-50">{pending?'ENVOI…':'ENVOYER MA DEMANDE ↗'}</button>
  </form>
 )
}