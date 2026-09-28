import {redirect} from 'next/navigation'
import {createClient} from '@/lib/supabase/server'
import {saveProfile,userSignOut} from '@/app/actions'
export const metadata={robots:{index:false,follow:false}}
type Reservation={id:string;service_interest:string;starts_at:string;duration_minutes:number;status:string}
type PackOrder={id:string;pack_name:string;price_label:string;status:string}
const reservationStatus:Record<string,string>={pending:'En attente',confirmed:'Confirmée',declined:'Refusée',cancelled:'Annulée'}
const orderStatus:Record<string,string>={pending:'En attente',confirmed:'Confirmée',declined:'Refusée',completed:'Terminée',cancelled:'Annulée'}
export default async function Account({searchParams}:{searchParams:Promise<{saved?:string;email?:string;error?:string}>}){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)redirect('/account/login')
 const [{data:profile},{data:reservations},{data:orders},{saved,email,error}]=await Promise.all([
  supabase.from('profiles').select('*').eq('user_id',user.id).maybeSingle(),
  supabase.from('reservations').select('*').eq('user_id',user.id).order('starts_at',{ascending:false}),
  supabase.from('pack_orders').select('*').eq('user_id',user.id).order('created_at',{ascending:false}),searchParams,
 ])
 if(profile?.is_active===false)redirect('/account/login?error=disabled')
 const reservationRows=(reservations||[]) as unknown as Reservation[],orderRows=(orders||[]) as unknown as PackOrder[]
 return <main className="min-h-screen bg-[#f4efe6]"><div className="container py-10">
  <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="eyebrow">Espace artiste</p><h1 className="serif mt-2 text-4xl">Mon compte</h1></div><form action={userSignOut}><button className="focus-ring rounded-full border px-5 py-3 text-sm">Déconnexion</button></form></div>
  <div className="mt-8 grid gap-7 lg:grid-cols-2"><section className="card p-6"><h2 className="serif text-2xl">Mes coordonnées</h2>
   {saved&&<p className="mt-3 text-sm text-green-800">Profil enregistré.</p>}{email&&<p className="mt-3 text-sm text-green-800">Un lien de confirmation pour le nouvel e-mail vous a été envoyé.</p>}{error&&<p className="mt-3 text-sm text-red-800">{error==='email'?'Impossible de demander le changement d’e-mail.':'Vérifiez vos informations.'}</p>}
   <form action={saveProfile} className="mt-5 grid gap-4"><label className="grid gap-2 text-sm">Nom complet<input name="full_name" defaultValue={profile?.full_name||user.user_metadata?.full_name||''} required minLength={2} className="focus-ring rounded border bg-white px-4 py-3"/></label><label className="grid gap-2 text-sm">Téléphone<input name="phone" defaultValue={profile?.phone||user.user_metadata?.phone||''} required minLength={6} className="focus-ring rounded border bg-white px-4 py-3"/></label><label className="grid gap-2 text-sm">E-mail<input name="email" type="email" defaultValue={user.email||''} required className="focus-ring rounded border bg-white px-4 py-3"/><span className="text-xs text-[#777166]">Un e-mail de confirmation sera envoyé si vous le changez.</span></label><button className="focus-ring rounded-full bg-[#191c19] px-5 py-3 text-sm text-white">Enregistrer</button></form>
  </section><section className="card p-6"><h2 className="serif text-2xl">Mes réservations</h2>{reservationRows.length?<div className="mt-4 grid gap-3">{reservationRows.map(r=><article key={r.id} className="border-t pt-3 text-sm"><p className="font-semibold">{r.service_interest} · {new Date(r.starts_at).toLocaleString('fr-FR',{dateStyle:'medium',timeStyle:'short',timeZone:'Africa/Algiers'})}</p><p className="mt-1 text-[#625e56]">{r.duration_minutes} min · {reservationStatus[r.status]||r.status}</p></article>)}</div>:<p className="mt-4 text-sm text-[#625e56]">Aucune réservation pour le moment.</p>}</section>
  <section className="card p-6 lg:col-span-2"><h2 className="serif text-2xl">Mes demandes de pack</h2>{orderRows.length?<div className="mt-4 grid gap-3 md:grid-cols-2">{orderRows.map(o=><article key={o.id} className="border-t pt-3 text-sm"><p className="font-semibold">{o.pack_name} · {o.price_label}</p><p className="mt-1 text-[#625e56]">{orderStatus[o.status]||o.status} — paiement directement avec le studio, hors plateforme.</p></article>)}</div>:<p className="mt-4 text-sm text-[#625e56]">Aucune demande de pack pour le moment.</p>}</section></div>
 </div></main>
}
