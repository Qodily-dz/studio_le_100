import { requireAdmin } from '@/lib/admin'
import { deleteRecord, saveRecord } from '@/app/actions'
type ServiceRow={id:string;title:string;slug:string;price_label:string;price_unit:string|null;price_amount:number|null;sort_order:number;eyebrow:string|null;short_description:string|null;description:string|null;features:string[];is_active:boolean}
const input='w-full border border-paper/20 bg-ink px-3 py-2.5 text-sm text-paper placeholder:text-smoke focus:border-signal focus:outline-none'
function Field({label,name,value='',type='text',span=false}:{label:string;name:string;value?:string|number|null;type?:string;span?:boolean}){return <label className={`grid gap-1.5 ${span?'sm:col-span-2':''}`}><span className="tag text-[.6rem] text-paper/55">{label}</span><input name={name} type={type} defaultValue={value??""} required={name==='slug'||name==='title'||name==='price_label'} className={input}/></label>}
function Text({label,name,value=''}:{label:string;name:string;value?:string|null}){return <label className="grid gap-1.5 sm:col-span-2"><span className="tag text-[.6rem] text-paper/55">{label}</span><textarea name={name} defaultValue={value??""} rows={3} className={input}/></label>}
function Actions({submit,item}:{submit:string;item?:boolean}){return <div className="mt-5 flex gap-3 border-t border-paper/10 pt-4 sm:justify-end"><button className="notch focus-ring bg-paper px-5 py-3 font-display text-xs uppercase tracking-[.15em] text-ink transition hover:bg-signal">{submit}</button>{item&&<button formAction={deleteRecord} formNoValidate className="notch focus-ring border border-signal/50 px-4 py-3 font-mono text-[.62rem] uppercase tracking-[.12em] text-signal transition hover:bg-signal hover:text-ink">Supprimer</button>}</div>}
export default async function ServicesAdmin(){
 const {supabase}=await requireAdmin()
 const {data}=await supabase.from('services').select('*').order('sort_order')
 return <>
  <div className="flex items-end justify-between gap-4">
   <div>
    <p className="tag text-signal">CATALOGUE PUBLIC</p>
    <h1 className="mt-3 font-display text-4xl uppercase leading-none">Prestations</h1>
   </div>
   <a href="#nouveau" className="notch focus-ring bg-paper px-5 py-3 font-display text-xs uppercase tracking-[.15em] text-ink transition hover:bg-signal">+ Ajouter</a>
  </div>
  <div className="mt-7 grid gap-5">
   {((data||[]) as unknown as ServiceRow[]).map((item,i)=><form action={saveRecord} key={item.id} className="border border-paper/15 bg-coal p-5">
    <input type="hidden" name="table" value="services"/>
    <input type="hidden" name="id" value={item.id}/>
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
     <p className="tag text-signal">CH.{String(i+1).padStart(2,'0')} · {item.title}</p>
     <p className="tag text-[.56rem] text-smoke">ID {item.id.slice(0,6)}</p>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
     <Field label="Titre" name="title" value={item.title}/>
     <Field label="Slug" name="slug" value={item.slug}/>
     <Field label="Prix affiché" name="price_label" value={item.price_label}/>
     <Field label="Unité" name="price_unit" value={item.price_unit}/>
     <Field label="Prix (nombre)" name="price_amount" value={item.price_amount??''} type="number"/>
     <Field label="Ordre" name="sort_order" value={item.sort_order} type="number"/>
     <Field label="Eyebrow" name="eyebrow" value={item.eyebrow}/>
     <Field label="Description courte" name="short_description" value={item.short_description}/>
     <Text label="Description" name="description" value={item.description}/>
     <Text label="Caractéristiques (une par ligne)" name="features" value={(item.features||[]).join('\n')}/>
     <label className="flex items-center gap-2 text-sm text-paper/80"><input type="checkbox" name="is_active" defaultChecked={item.is_active} className="h-4 w-4 accent-signal"/> Publié</label>
    </div>
    <Actions submit="Enregistrer" item/>
   </form>)}
  </div>
  <form id="nouveau" action={saveRecord} className="mt-8 border border-signal/40 bg-coal p-5">
   <input type="hidden" name="table" value="services"/>
   <p className="tag mb-5 text-signal">NOUVELLE PRESTATION</p>
   <div className="grid gap-4 sm:grid-cols-2">
    <Field label="Titre" name="title"/>
    <Field label="Slug" name="slug"/>
    <Field label="Prix affiché" name="price_label"/>
    <Field label="Unité" name="price_unit"/>
    <Field label="Prix (nombre)" name="price_amount" type="number"/>
    <Field label="Ordre" name="sort_order" type="number"/>
    <Field label="Eyebrow" name="eyebrow"/>
    <Field label="Description courte" name="short_description"/>
    <Text label="Description" name="description"/>
    <Text label="Caractéristiques (une par ligne)" name="features"/>
    <label className="flex items-center gap-2 text-sm text-paper/80"><input type="checkbox" name="is_active" defaultChecked className="h-4 w-4 accent-signal"/> Publié</label>
   </div>
   <Actions submit="Créer la prestation"/>
  </form>
 </>
}