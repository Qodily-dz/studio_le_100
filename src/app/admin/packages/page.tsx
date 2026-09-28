import { requireAdmin } from '@/lib/admin'
import { deleteRecord, saveRecord } from '@/app/actions'
type PackageRow={id:string;name:string;slug:string;price_label:string;price_amount:number|null;compare_at_price:number|null;sort_order:number;tagline:string|null;badge:string|null;description:string|null;items:string[];is_active:boolean;is_featured:boolean}
const input='w-full border border-paper/20 bg-ink px-3 py-2.5 text-sm text-paper placeholder:text-smoke focus:border-signal focus:outline-none'
function Field({label,name,value='',type='text'}:{label:string;name:string;value?:string|number|null;type?:string}){return <label className="grid gap-1.5"><span className="tag text-[.6rem] text-paper/55">{label}</span><input name={name} type={type} defaultValue={value??""} required={name==='slug'||name==='name'||name==='price_label'} className={input}/></label>}
function Text({label,name,value='',rows=2}:{label:string;name:string;value?:string|null;rows?:number}){return <label className="grid gap-1.5 sm:col-span-2"><span className="tag text-[.6rem] text-paper/55">{label}</span><textarea name={name} defaultValue={value??""} rows={rows} className={input}/></label>}
export default async function PackagesAdmin(){
 const {supabase}=await requireAdmin()
 const {data}=await supabase.from('packages').select('*').order('sort_order')
 return <>
  <p className="tag text-signal">FORMULES COMBINÉES</p>
  <h1 className="mt-3 font-display text-4xl uppercase leading-none">Packs</h1>
  <div className="mt-7 grid gap-5">{((data||[]) as unknown as PackageRow[]).map((item)=><PackageEditor key={item.id} item={item}/>)}</div>
  <PackageEditor/>
 </>
}
function PackageEditor({item}:{item?:PackageRow}){
 return <form action={saveRecord} className="mt-5 border border-paper/15 bg-coal p-5">
  <input type="hidden" name="table" value="packages"/>
  {item&&<input type="hidden" name="id" value={item.id}/>}
  <p className="tag mb-5 text-signal">{item?`PACK · ${item.name}`:'NOUVEAU PACK'}</p>
  <div className="grid gap-4 sm:grid-cols-2">
   <Field label="Nom" name="name" value={item?.name}/>
   <Field label="Slug" name="slug" value={item?.slug}/>
   <Field label="Prix affiché" name="price_label" value={item?.price_label}/>
   <Field label="Prix (nombre)" name="price_amount" value={item?.price_amount??''} type="number"/>
   <Field label="Ancien prix" name="compare_at_price" value={item?.compare_at_price??''} type="number"/>
   <Field label="Ordre" name="sort_order" value={item?.sort_order??0} type="number"/>
   <Field label="Accroche" name="tagline" value={item?.tagline}/>
   <Field label="Badge" name="badge" value={item?.badge}/>
   <Text label="Description" name="description" value={item?.description}/>
   <Text label="Éléments (un par ligne)" name="items" value={(item?.items||[]).join('\n')} rows={4}/>
   <label className="flex items-center gap-2 text-sm text-paper/80"><input type="checkbox" name="is_active" defaultChecked={item?.is_active??true} className="h-4 w-4 accent-signal"/> Publié</label>
   <label className="flex items-center gap-2 text-sm text-paper/80"><input type="checkbox" name="is_featured" defaultChecked={item?.is_featured} className="h-4 w-4 accent-signal"/> Mis en avant</label>
  </div>
  <div className="mt-5 flex gap-3 border-t border-paper/10 pt-4 sm:justify-end">
   <button className="notch focus-ring bg-paper px-5 py-3 font-display text-xs uppercase tracking-[.15em] text-ink transition hover:bg-signal">{item?'Enregistrer':'Créer le pack'}</button>
   {item&&<button formAction={deleteRecord} formNoValidate className="notch focus-ring border border-signal/50 px-4 py-3 font-mono text-[.62rem] uppercase tracking-[.12em] text-signal transition hover:bg-signal hover:text-ink">Supprimer</button>}
  </div>
 </form>
}