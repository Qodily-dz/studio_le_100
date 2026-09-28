import { requireAdmin } from '@/lib/admin'
import { createManagedUser, manageUser } from '@/app/actions'
type ProfileRow={user_id:string;full_name:string;email:string;phone:string;role:string;is_active:boolean;created_at:string}
const input='w-full border border-paper/20 bg-ink px-3 py-2.5 text-sm text-paper placeholder:text-smoke focus:border-signal focus:outline-none'
const errorText:Record<string,string>={invalid:'Champs invalides ou mot de passe trop court (10 caractères minimum).',service_key:'Configuration serveur manquante (clé de service).',create:'La création du compte a échoué côté Supabase.'}
export default async function UsersAdmin({searchParams}:{searchParams:Promise<{error?:string;created?:string}>}){
 const sp=await searchParams
 const {supabase,user}=await requireAdmin()
 const {data}=await supabase.from('profiles').select('*').order('created_at',{ascending:false})
 const rows=(data||[]) as unknown as ProfileRow[]
 return <>
  <div className="flex flex-wrap items-end justify-between gap-4">
   <div>
    <p className="tag text-signal">MEMBRES / PROFILS</p>
    <h1 className="mt-3 font-display text-4xl uppercase leading-none">Utilisateurs</h1>
   </div>
   <p className="font-mono text-[.62rem] uppercase tracking-[.15em] text-smoke">{rows.length} membres · {rows.filter(r=>r.role==='admin').length} admins</p>
  </div>
  {sp.created&&<p role="status" className="mt-6 border border-paper/40 bg-paper p-4 font-mono text-xs text-ink">Compte créé. L’utilisateur peut se connecter immédiatement.</p>}
  {sp.error&&errorText[sp.error]&&<p role="alert" className="mt-6 border border-signal/40 bg-signal/10 p-4 font-mono text-xs text-signal">{errorText[sp.error]}</p>}
  <div className="mt-7 grid gap-4">
   {rows.length?rows.map(p=>{
    const me=p.user_id===user.id
    return <article key={p.user_id} className={`border border-paper/15 bg-coal p-5 ${!p.is_active?'opacity-60':''}`}>
     <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-4">
       <span className={`grid h-11 w-11 shrink-0 place-items-center border font-display text-sm uppercase ${p.role==='admin'?'border-signal text-signal':'border-paper/25 text-paper/70'}`}>{(p.full_name||'?').slice(0,2)}</span>
       <div>
        <h2 className="flex flex-wrap items-center gap-2 font-display text-xl uppercase leading-none">{p.full_name||'Sans nom'}{me&&<span className="tag border border-paper/30 px-2 py-1 text-[.56rem] text-paper/70">VOUS</span>}</h2>
        <p className="mt-1 font-mono text-sm text-smoke">{p.email||'—'}{p.phone&&` · ${p.phone}`}</p>
        <p className="mt-1 font-mono text-[.6rem] uppercase tracking-[.15em] text-smoke">Membre depuis le {new Date(p.created_at).toLocaleDateString('fr-FR')}</p>
       </div>
      </div>
      <div className="flex items-center gap-2">
       <span className={`tag h-fit border px-3 py-1.5 ${p.role==='admin'?'border-signal text-signal':'border-paper/30 text-paper/70'}`}>{p.role==='admin'?'Admin':'Membre'}</span>
       <span className={`tag h-fit border px-3 py-1.5 ${p.is_active?'border-paper text-paper':'border-paper/20 text-smoke'}`}>{p.is_active?'Actif':'Désactivé'}</span>
      </div>
     </div>
     <form action={manageUser} className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-paper/10 pt-4">
      <input type="hidden" name="user_id" value={p.user_id}/>
      <div className="flex flex-wrap items-end gap-4">
       <label className="grid gap-1.5"><span className="tag text-[.6rem] text-paper/55">RÔLE</span><select name="role" defaultValue={p.role} disabled={me} className={`${input} disabled:cursor-not-allowed disabled:opacity-50 ${me?'':'cursor-pointer'}`}><option value="user">Membre</option><option value="admin">Admin</option></select></label>
       <label className="grid gap-1.5"><span className="tag text-[.6rem] text-paper/55">STATUT</span><span className="flex items-center gap-2 text-sm text-paper/85"><input type="checkbox" name="is_active" defaultChecked={p.is_active} disabled={me} className="h-4 w-4 accent-signal disabled:opacity-50"/> Actif</span></label>
       <button disabled={me} className="notch focus-ring border border-paper/25 px-4 py-2.5 font-mono text-[.62rem] uppercase tracking-[.15em] text-paper/80 transition hover:border-signal hover:bg-signal hover:text-ink disabled:cursor-not-allowed disabled:opacity-40">Enregistrer</button>
      </div>
      {me&&<p className="font-mono text-[.58rem] uppercase tracking-[.12em] text-smoke">On ne peut pas modifier son propre compte ici.</p>}
     </form>
    </article>
   }):<div className="border border-paper/15 bg-coal p-10 text-center"><p className="font-display text-2xl uppercase leading-none text-paper/70">Aucun membre</p></div>}
  </div>
  <form id="nouveau" action={createManagedUser} className="mt-8 border border-signal/40 bg-coal p-6">
   <p className="tag text-signal">NOUVEAU MEMBRE</p>
   <div className="mt-5 grid gap-4 sm:grid-cols-2">
    <label className="grid gap-1.5"><span className="tag text-[.6rem] text-paper/55">Nom complet</span><input className={input} required name="full_name" minLength={2}/></label>
    <label className="grid gap-1.5"><span className="tag text-[.6rem] text-paper/55">Téléphone</span><input className={input} required name="phone" minLength={6}/></label>
    <label className="grid gap-1.5"><span className="tag text-[.6rem] text-paper/55">E-mail</span><input className={input} required type="email" name="email"/></label>
    <label className="grid gap-1.5"><span className="tag text-[.6rem] text-paper/55">Mot de passe (10+ caractères)</span><input className={input} required type="password" name="password" minLength={10}/></label>
    <label className="grid gap-1.5"><span className="tag text-[.6rem] text-paper/55">Rôle</span><select className={`${input} cursor-pointer`} name="role" defaultValue="user"><option value="user">Membre</option><option value="admin">Admin</option></select></label>
   </div>
   <button className="notch focus-ring mt-6 bg-paper px-6 py-3 font-display text-xs uppercase tracking-[.15em] text-ink transition hover:bg-signal">Créer le compte</button>
  </form>
 </>
}