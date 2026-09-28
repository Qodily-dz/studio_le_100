import { requireAdmin } from '@/lib/admin'
import { updateOrder } from '@/app/actions'
type OrdRow={id:string;pack_slug:string;pack_name:string;price_label:string;full_name:string;phone:string;email:string|null;status:string;payment_note:string;created_at:string}
const label:Record<string,string>={pending:'En attente',confirmed:'Confirmée',declined:'Refusée',completed:'Terminée',cancelled:'Annulée'}
const chip:Record<string,string>={pending:'border-ember text-ember',confirmed:'border-signal text-signal',declined:'border-paper/30 text-paper/60',completed:'border-paper text-paper',cancelled:'border-paper/20 text-smoke'}
const actions:Record<string,string>={pending:'En attente',confirmed:'Confirmer',declined:'Refuser',completed:'Terminer',cancelled:'Annuler'}
export default async function OrdersAdmin(){
 const {supabase}=await requireAdmin()
 const {data}=await supabase.from('pack_orders').select('*').order('created_at',{ascending:false})
 const rows=(data||[]) as unknown as OrdRow[]
 return <>
  <div className="flex flex-wrap items-end justify-between gap-4">
   <div>
    <p className="tag text-signal">VENTES / PACKS</p>
    <h1 className="mt-3 font-display text-4xl uppercase leading-none">Commandes</h1>
   </div>
   <p className="font-mono text-[.62rem] uppercase tracking-[.15em] text-smoke">{rows.length} demandes · {rows.filter(r=>r.status==='pending').length} en attente</p>
  </div>
  <div className="mt-7 grid gap-4">
   {rows.length?rows.map(r=>(
    <article key={r.id} className="border border-paper/15 bg-coal p-5">
     <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
       <p className="tag text-smoke">{new Date(r.created_at).toLocaleString('fr-FR')} · {r.pack_slug}</p>
       <h2 className="mt-3 font-display text-2xl uppercase leading-none">{r.pack_name} <span className="text-signal">{r.price_label}</span></h2>
       <p className="mt-1 font-mono text-sm text-smoke">{r.full_name}{r.phone&&` · ${r.phone}`}{r.email&&` · ${r.email}`}</p>
      </div>
      <span className={`tag h-fit border px-3 py-1.5 ${chip[r.status]||'border-paper/25 text-paper/70'}`}>{label[r.status]||r.status}</span>
     </div>
     <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-paper/10 pt-4">
      <div className="flex flex-wrap gap-2">{Object.entries(actions).filter(([s])=>r.status!==s||s==='pending').map(([status,text])=><form action={updateOrder} key={status}><input type="hidden" name="id" value={r.id}/><input type="hidden" name="status" value={status}/><button className={`focus-ring border px-3 py-2 font-mono text-[.62rem] uppercase tracking-[.12em] ${status===r.status?'border-signal bg-signal text-ink':'border-paper/25 text-paper/70 hover:border-signal hover:text-signal'}`}>{text}</button></form>)}</div>
      <p className="max-w-xs text-right font-mono text-[.58rem] uppercase tracking-[.12em] leading-4 text-smoke">{r.payment_note}</p>
     </div>
    </article>
   )):<div className="border border-paper/15 bg-coal p-10 text-center"><p className="font-display text-2xl uppercase leading-none text-paper/70">Aucune commande</p><p className="mt-2 text-sm text-smoke">Les demandes de packs apparaîtront ici.</p></div>}
  </div>
 </>
}