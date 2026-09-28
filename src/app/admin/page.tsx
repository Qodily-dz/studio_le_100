import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { requireAdmin } from '@/lib/admin'

type MsgRow={id:string;status:string;full_name:string;service_interest:string|null;created_at:string;message:string}
type ResRow={id:string;status:string;full_name:string;phone:string;service_interest:string;starts_at:string;ends_at:string;duration_minutes:number;message:string}
type OrdRow={id:string;status:string;pack_name:string;price_label:string;full_name:string;phone:string;created_at:string}

const msgChip:Record<string,string>={new:'border-signal text-signal',read:'border-cobalt text-cobalt',replied:'border-gold text-gold',archived:'border-paper/20 text-smoke'}
const resChip:Record<string,string>={pending:'border-gold text-gold',confirmed:'border-mint text-mint',declined:'border-paper/30 text-paper/60',cancelled:'border-paper/20 text-smoke'}
const ordChip:Record<string,string>={pending:'border-gold text-gold',confirmed:'border-mint text-mint',declined:'border-paper/30 text-paper/60',completed:'border-cobalt text-cobalt',cancelled:'border-paper/20 text-smoke'}
const msgLabel:Record<string,string>={new:'Nouveau',read:'Lu',replied:'Répondu',archived:'Archivé'}
const resLabel:Record<string,string>={pending:'À confirmer',confirmed:'Confirmée',declined:'Refusée',cancelled:'Annulée'}
const ordLabel:Record<string,string>={pending:'En attente',confirmed:'Confirmée',declined:'Refusée',completed:'Terminée',cancelled:'Annulée'}

function ago(d:string){const s=(Date.now()-new Date(d).getTime())/1e3;if(s<60)return 'à l’instant';if(s<3600)return `-${Math.floor(s/60)} min`;if(s<86400)return `-${Math.floor(s/3600)} h`;return `-${Math.floor(s/86400)} j`}

function Chip({status,map,labels}:{status:string;map:Record<string,string>;labels:Record<string,string>}){return <span className={`tag h-fit border px-2.5 py-1 ${map[status]||'border-paper/25 text-paper/70'}`}>{labels[status]||status}</span>}

function SplitBar({data,total}:{data:{label:string;value:number;cls:string}[];total:number}){
 const parts=data.filter(d=>d.value>0)
 return <div className="flex h-3 w-full overflow-hidden border border-paper/15 bg-ink">
  {parts.length?parts.map((p)=><span key={p.label} className={`h-full ${p.cls}`} style={{width:`${Math.max(2,(p.value/total)*100)}%`}}/>):<span className="h-full flex-1 bg-paper/5"/>}
 </div>
}

export default async function AdminHome(){
 const {supabase}=await requireAdmin()
 const [s,p,m,res,ord,prof]=await Promise.all([
  supabase.from('services').select('id,is_active'),
  supabase.from('packages').select('id,is_active,is_featured'),
  supabase.from('contact_messages').select('id,status,full_name,service_interest,created_at,message').order('created_at',{ascending:false}).limit(200),
  supabase.from('reservations').select('*').order('starts_at',{ascending:true}).limit(200),
  supabase.from('pack_orders').select('*').order('created_at',{ascending:false}).limit(200),
  supabase.from('profiles').select('user_id,full_name,email,role,is_active'),
 ])
 const services=(s.data||[]) as unknown as {id:string;is_active:boolean}[]
 const packages=(p.data||[]) as unknown as {id:string;is_active:boolean;is_featured:boolean}[]
 const messages=(m.data||[]) as unknown as MsgRow[]
 const reservations=(res.data||[]) as unknown as ResRow[]
 const orders=(ord.data||[]) as unknown as OrdRow[]
 const profiles=(prof.data||[]) as unknown as {user_id:string;full_name:string;email:string;role:string;is_active:boolean}[]

 const msgTotal=messages.length
 const msgBy={new:0,read:0,replied:0,archived:0} as Record<string,number>
 messages.forEach(x=>{msgBy[x.status]=(msgBy[x.status]||0)+1})
 const resBy={pending:0,confirmed:0,declined:0,cancelled:0} as Record<string,number>
 reservations.forEach(x=>{resBy[x.status]=(resBy[x.status]||0)+1})
 const ordBy={pending:0,confirmed:0,declined:0,completed:0,cancelled:0} as Record<string,number>
 orders.forEach(x=>{ordBy[x.status]=(ordBy[x.status]||0)+1})
 const now=new Date().getTime()
 const upcoming=reservations.filter(r=>new Date(r.starts_at).getTime()>now&&(r.status==='pending'||r.status==='confirmed')).slice(0,5)
 const recentMessages=messages.slice(0,4)
 const recentOrders=orders.slice(0,4)

 const kpis=[
  {label:'Prestations actives',value:`${services.filter(x=>x.is_active).length}/${services.length}`,sub:'CH.01 → 05 · catalogue',href:'/admin/services',bar:'bg-cobalt',text:'text-cobalt',hover:'hover:border-cobalt'},
  {label:'Messages non lus',value:msgBy.new||0,sub:`${msgTotal} au total`,href:'/admin/messages',bar:'bg-signal',text:'text-signal',hover:'hover:border-signal'},
  {label:'Sessions à confirmer',value:resBy.pending||0,sub:`${resBy.confirmed||0} confirmées`,href:'/admin/reservations',bar:'bg-gold',text:'text-gold',hover:'hover:border-gold'},
  {label:'Packs en attente',value:ordBy.pending||0,sub:`${ordBy.completed||0} terminées`,href:'/admin/orders',bar:'bg-orchid',text:'text-orchid',hover:'hover:border-orchid'},
 ]
 return <>
  <div className="flex flex-wrap items-end justify-between gap-4">
   <div>
    <p className="tag flex items-center gap-3 text-signal"><span className="blink inline-block h-2 w-2 rounded-full bg-signal"/>TABLEAU DE BORD</p>
    <h1 className="mt-3 font-display text-5xl uppercase leading-[.9] md:text-6xl">Le studio,<br/><span className="outline">en direct.</span></h1>
   </div>
   <p className="max-w-xs text-sm leading-6 text-smoke">Toutes les demandes qui arrivent au studio, d’un seul coup d’œil. {messages.length>200?'Aperçu des 200 dernières entrées.':''}</p>
  </div>

  <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
   {kpis.map((k,i)=><Link key={k.href} href={k.href} className={`group border border-paper/15 bg-coal p-6 transition hover:-translate-y-0.5 ${k.hover}`}>
    <div className="flex items-center justify-between">
     <span aria-hidden className={`block h-1.5 w-10 ${k.bar}`}/>
     <span aria-hidden className={`${k.text} font-mono text-xs`}>0{i+1}</span>
    </div>
    <p className="tag mt-4 text-smoke">{k.label}</p>
    <p className={`mt-3 font-display text-5xl leading-none ${k.text} transition`}>{k.value}</p>
    <p className="mt-3 font-mono text-[.62rem] uppercase tracking-[.15em] text-smoke">{k.sub}</p>
    <p className={`mt-4 flex items-center gap-2 font-mono text-[.62rem] uppercase tracking-[.2em] ${k.text}`}>Ouvrir <ArrowRight size={14} className="transition group-hover:translate-x-1"/></p>
   </Link>)}
  </div>

  <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
<section className="border border-paper/15 bg-coal p-6">
     <div className="flex items-center justify-between gap-3">
      <div><p className="tag flex items-center gap-2 text-signal"><span className="inline-block h-2 w-2 rounded-full bg-signal"/>CANAUX / PIPELINE</p>
      <h2 className="mt-2 font-display text-2xl uppercase leading-none">Ce qui afflue</h2></div>
      <div aria-hidden className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-signal"/><span className="inline-block h-2 w-2 rounded-full bg-gold"/><span className="inline-block h-2 w-2 rounded-full bg-mint"/></div>
     </div>
     <div className="mt-6 space-y-6">
      <div>
       <div className="flex items-baseline justify-between gap-3"><p className="tag flex items-center gap-2 text-paper/70"><span className="inline-block h-2 w-2 bg-signal"/>{msgBy.new||0} NOUVELLES · {msgTotal} entrées AU TOTAL</p><p className="font-mono text-xs text-smoke">MESSAGES</p></div>
       <div className="mt-2"><SplitBar total={msgTotal} data={[{label:'Nouveau',value:msgBy.new,cls:'bg-signal'},{label:'Lu',value:msgBy.read,cls:'bg-cobalt'},{label:'Répondu',value:msgBy.replied,cls:'bg-gold'},{label:'Archivé',value:msgBy.archived,cls:'bg-paper/25'}]}/></div>
       <div className="mt-2 flex flex-wrap gap-4">{[['Nouveau','bg-signal'],['Lu','bg-cobalt'],['Répondu','bg-gold'],['Archivé','bg-paper/25']].map(([l,c])=><span key={l as string} className="flex items-center gap-1.5 font-mono text-[.6rem] uppercase tracking-wider text-smoke"><span className={`inline-block h-2 w-2 ${c as string}`}/>{l as string}</span>)}</div>
      </div>
      <div>
       <div className="flex items-baseline justify-between gap-3"><p className="tag flex items-center gap-2 text-paper/70"><span className="inline-block h-2 w-2 bg-gold"/>{resBy.pending||0} À CONFIRMER · {resBy.confirmed||0} confirmées</p><p className="font-mono text-xs text-smoke">RÉSERVATIONS</p></div>
       <div className="mt-2"><SplitBar total={reservations.length} data={[{label:'À confirmer',value:resBy.pending,cls:'bg-gold'},{label:'Confirmées',value:resBy.confirmed,cls:'bg-mint'},{label:'Refusées',value:resBy.declined,cls:'bg-paper/60'},{label:'Annulées',value:resBy.cancelled,cls:'bg-paper/25'}]}/></div>
      </div>
      <div>
       <div className="flex items-baseline justify-between gap-3"><p className="tag flex items-center gap-2 text-paper/70"><span className="inline-block h-2 w-2 bg-orchid"/>{ordBy.pending||0} EN ATTENTE · {ordBy.completed||0} terminées</p><p className="font-mono text-xs text-smoke">PACKS / COMMANDES</p></div>
       <div className="mt-2"><SplitBar total={orders.length} data={[{label:'En attente',value:ordBy.pending,cls:'bg-gold'},{label:'Confirmées',value:ordBy.confirmed,cls:'bg-mint'},{label:'Refusées',value:ordBy.declined,cls:'bg-paper/60'},{label:'Terminées',value:ordBy.completed,cls:'bg-cobalt'},{label:'Annulées',value:ordBy.cancelled,cls:'bg-paper/25'}]}/></div>
      </div>
      <p className="flex items-center gap-2 border-t border-paper/10 pt-4 font-mono text-[.6rem] uppercase tracking-[.15em] text-smoke"><span className="blink inline-block h-2 w-2 rounded-full bg-mint"/>Live — les chiffres viennent de la base, pas d’une estimation.</p>
     </div>
    </section>

   <section className="border border-paper/15 bg-coal p-6">
    <div className="flex items-baseline justify-between gap-3">
     <div><p className="tag text-signal">PROCHAINES SESSIONS</p><h2 className="mt-2 font-display text-2xl uppercase leading-none">À l’agenda</h2></div>
     <Link href="/admin/reservations" className="font-mono text-[.6rem] uppercase tracking-[.15em] text-signal hover:text-paper">Tout voir</Link>
    </div>
<div className="mt-5 border-t border-paper/10">
    {upcoming.length?upcoming.map((r)=>{const st=new Date(r.starts_at);const edge=r.status==='confirmed'?'border-l-mint':'border-l-gold';return (
     <div key={r.id} className={`flex flex-wrap items-center gap-3 border-b border-paper/10 border-l-2 py-4 pl-3 ${edge}`}>
      <span className="tag w-16 shrink-0 text-paper">{st.toLocaleDateString('fr-FR',{day:'2-digit',month:'short'})}</span>
      <span className={`font-mono text-xs ${r.status==='confirmed'?'text-mint':'text-gold'}`}>{st.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</span>
      <div className="min-w-0 flex-1"><p className="truncate font-display text-sm uppercase leading-tight">{r.full_name}</p><p className="truncate font-mono text-[.6rem] uppercase tracking-wider text-smoke">{r.service_interest} · {r.duration_minutes} min</p></div>
      <Chip status={r.status} map={resChip} labels={resLabel}/>
     </div>
    )}):<p className="border-b border-paper/10 py-6 text-sm text-smoke">Aucune session à venir. Réservations au calme.</p>}
   </div>
   </section>
  </div>

  <div className="mt-6 grid gap-4 lg:grid-cols-2">
   <section className="border border-paper/15 bg-coal p-6">
    <div className="flex items-baseline justify-between gap-3"><div><p className="tag text-signal">DERNIERS MESSAGES</p><h2 className="mt-2 font-display text-2xl uppercase leading-none">La boîte</h2></div><Link href="/admin/messages" className="font-mono text-[.6rem] uppercase tracking-[.15em] text-signal hover:text-paper">Tout voir</Link></div>
    <div className="mt-5 space-y-3">
     {recentMessages.length?recentMessages.map(x=><div key={x.id} className="flex flex-wrap items-center gap-3 border-b border-paper/10 pb-3 last:border-0">
      <span aria-hidden className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${msgChip[x.status].split(' ')[0].replace('border-','bg-')||'bg-paper'}`}/>
      <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-paper">{x.full_name}</p><p className="truncate font-mono text-[.6rem] uppercase tracking-wider text-smoke">{x.service_interest||'Projet à définir'} · {ago(x.created_at)}</p></div>
      <Chip status={x.status} map={msgChip} labels={msgLabel}/>
     </div>):<p className="text-sm text-smoke">Pas encore de messages.</p>}
    </div>
   </section>

   <section className="border border-paper/15 bg-coal p-6">
    <div className="flex items-baseline justify-between gap-3"><div><p className="tag text-orchid">DERNIÈRES COMMANDES</p><h2 className="mt-2 font-display text-2xl uppercase leading-none">Packs</h2></div><Link href="/admin/orders" className="font-mono text-[.6rem] uppercase tracking-[.15em] text-orchid hover:text-paper">Tout voir</Link></div>
    <div className="mt-5 space-y-3">
     {recentOrders.length?recentOrders.map(x=><div key={x.id} className="flex flex-wrap items-center gap-3 border-b border-paper/10 pb-3 last:border-0">
      <span aria-hidden className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${ordChip[x.status].split(' ')[0].replace('border-','bg-')||'bg-paper'}`}/>
      <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-paper">{x.pack_name}</p><p className="truncate font-mono text-[.6rem] uppercase tracking-wider text-smoke">{x.full_name} · <span className="text-gold">{x.price_label}</span> · {ago(x.created_at)}</p></div>
      <Chip status={x.status} map={ordChip} labels={ordLabel}/>
     </div>):<p className="text-sm text-smoke">Pas encore de commandes de packs.</p>}
    </div>
   </section>
  </div>

  <div className="mt-6 flex flex-wrap items-center gap-4 border border-paper/15 bg-coal p-5">
   <p className="tag text-smoke">ACTIONS RAPIDES</p>
   {[['Ajouter une prestation','/admin/services#nouveau'],['Créer un pack','/admin/packages#nouveau'],['Créer un compte','/admin/users#nouveau'],['Voir les membres','/admin/users']].map(([label,href])=><a key={href} href={href} className="notch focus-ring border border-paper/25 px-4 py-2.5 font-mono text-[.6rem] uppercase tracking-[.15em] text-paper/80 transition hover:border-signal hover:bg-signal hover:text-ink">{label}</a>)}
   <p className="ml-auto font-mono text-[.62rem] uppercase tracking-[.15em] text-smoke">{packages.filter(x=>x.is_active).length}/{packages.length} packs · {profiles.length} membres · {profiles.filter(x=>x.role==='admin').length} admins</p>
  </div>
 </>
}