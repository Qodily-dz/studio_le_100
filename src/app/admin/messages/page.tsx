import { requireAdmin } from '@/lib/admin'
import { removeMessage, updateMessage } from '@/app/actions'
type MessageRow={id:string;created_at:string;service_interest:string|null;full_name:string;artist_name:string|null;phone:string;email:string|null;status:string;message:string}
const statusLabel:Record<string,string>={new:'Nouveau',read:'Lu',replied:'Répondu',archived:'Archivé'}
const statusStyle:Record<string,string>={new:'border-signal text-signal',read:'border-paper/30 text-paper/70',replied:'border-ember text-ember',archived:'border-paper/20 text-smoke'}
export default async function MessagesAdmin(){
 const {supabase}=await requireAdmin()
 const {data}=await supabase.from('contact_messages').select('*').order('created_at',{ascending:false})
 return <>
  <p className="tag text-signal">DEMANDES ENTRANTES</p>
  <h1 className="mt-3 font-display text-4xl uppercase leading-none">Messages <span className="font-mono text-lg text-smoke">({data?.length||0})</span></h1>
  <div className="mt-7 grid gap-4">
   {(data as unknown as MessageRow[]|null)?.map((m)=><article key={m.id} className="border border-paper/15 bg-coal p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
     <div>
      <p className="tag text-smoke">{new Date(m.created_at).toLocaleString('fr-FR')} · {m.service_interest||'Projet à définir'}</p>
      <h2 className="mt-3 font-display text-2xl uppercase leading-none">{m.full_name}{m.artist_name&&<span className="font-body text-base normal-case text-smoke"> « {m.artist_name} »</span>}</h2>
      <p className="mt-2 font-mono text-sm text-smoke">{m.phone}{m.email&&` · ${m.email}`}</p>
     </div>
     <span className={`tag h-fit border px-3 py-1.5 ${statusStyle[m.status]||statusStyle.new}`}>{statusLabel[m.status]||m.status}</span>
    </div>
    <p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-paper/85">{m.message}</p>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-paper/10 pt-4">
     <div className="flex flex-wrap gap-2">{['new','read','replied','archived'].map(status=><form action={updateMessage} key={status}><input type="hidden" name="id" value={m.id}/><input type="hidden" name="status" value={status}/><button className={`focus-ring border px-3 py-2 font-mono text-[.62rem] uppercase tracking-[.12em] ${status===m.status?'border-signal bg-signal text-ink':'border-paper/25 text-paper/70 hover:border-signal hover:text-signal'}`}>{statusLabel[status]}</button></form>)}</div>
     <form action={removeMessage}><input type="hidden" name="id" value={m.id}/><button className="focus-ring font-mono text-[.62rem] uppercase tracking-[.15em] text-signal transition underline-offset-4 hover:underline">Supprimer</button></form>
    </div>
   </article>)}
  </div>
  {!data?.length&&<p className="mt-6 text-sm text-smoke">Aucun message pour le moment.</p>}
 </>
}