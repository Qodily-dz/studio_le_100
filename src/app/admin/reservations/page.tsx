import { requireAdmin } from '@/lib/admin'
import { updateReservation } from '@/app/actions'
type ResRow={id:string;full_name:string;phone:string;email:string|null;service_interest:string;starts_at:string;ends_at:string;duration_minutes:number;message:string;status:string;created_at:string}
const label:Record<string,string>={pending:'À confirmer',confirmed:'Confirmée',declined:'Refusée',cancelled:'Annulée'}
const chip:Record<string,string>={pending:'border-ember text-ember',confirmed:'border-signal text-signal',declined:'border-paper/30 text-paper/60',cancelled:'border-paper/20 text-smoke'}
const actions:Record<string,string>={confirmed:'Confirmer',declined:'Refuser',cancelled:'Annuler'}
const fmt=(d:Date)=>d.toLocaleDateString('fr-FR',{weekday:'short',day:'2-digit',month:'short',year:'2-digit'})
const tm=(d:Date)=>d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})
export default async function ReservationsAdmin({searchParams}:{searchParams:Promise<{error?:string}>}){
 const {error}=await searchParams
 const {supabase}=await requireAdmin()
 const {data}=await supabase.from('reservations').select('*').order('starts_at',{ascending:true})
 const rows=(data||[]) as unknown as ResRow[]
 return <>
  <div className="flex flex-wrap items-end justify-between gap-4">
   <div>
    <p className="tag text-signal">PLANNING / RÉSERVATIONS</p>
    <h1 className="mt-3 font-display text-4xl uppercase leading-none">Sessions</h1>
   </div>
   <p className="font-mono text-[.62rem] uppercase tracking-[.15em] text-smoke">{rows.length} demandes · {rows.filter(r=>r.status==='pending').length} à confirmer</p>
  </div>
  {error==='slot-conflict'&&<p role="alert" className="mt-6 border border-signal/40 bg-signal/10 p-4 font-mono text-xs text-signal">Créneau indisponible : une autre session confirmée chevauche cet horaire.</p>}
  <div className="mt-7 grid gap-4">
   {rows.length?rows.map(r=>{
    const start=new Date(r.starts_at),end=new Date(r.ends_at)
    return <article key={r.id} className="border border-paper/15 bg-coal p-5">
     <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
       <p className="tag text-smoke">{fmt(start)} · {tm(start)} → {tm(end)} · {r.duration_minutes} min</p>
       <h2 className="mt-3 font-display text-2xl uppercase leading-none">{r.full_name}</h2>
       <p className="mt-1 font-mono text-sm text-smoke">{r.phone}{r.email&&` · ${r.email}`}</p>
      </div>
      <div className="flex items-center gap-3">
       <span className={`tag h-fit border px-3 py-1.5 ${chip[r.status]||'border-paper/25 text-paper/70'}`}>{label[r.status]||r.status}</span>
      </div>
     </div>
     <p className="mt-4 border-l-2 border-signal/60 pl-3 text-sm text-paper/85">{r.service_interest}</p>
     {r.message&&<p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-smoke">{r.message}</p>}
     <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-paper/10 pt-4">
      <div className="flex flex-wrap gap-2">{Object.entries(actions).map(([status,text])=><form action={updateReservation} key={status}><input type="hidden" name="id" value={r.id}/><input type="hidden" name="status" value={status}/><button className={`focus-ring border px-3 py-2 font-mono text-[.62rem] uppercase tracking-[.12em] ${status===r.status?'border-signal bg-signal text-ink':'border-paper/25 text-paper/70 hover:border-signal hover:text-signal'}`}>{text}</button></form>)}</div>
      <p className="font-mono text-[.6rem] uppercase tracking-[.15em] text-smoke">Reçue {new Date(r.created_at).toLocaleString('fr-FR')}</p>
     </div>
    </article>
   }):<div className="border border-paper/15 bg-coal p-10 text-center"><p className="font-display text-2xl uppercase leading-none text-paper/70">Aucune session</p><p className="mt-2 text-sm text-smoke">Les demandes de réservation apparaîtront ici.</p></div>}
  </div>
 </>
}