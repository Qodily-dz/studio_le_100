import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowRight, AudioLines, Check, Headphones, Mic2, Music2, Play, Sparkles } from 'lucide-react'
import ContactForm from './contact-form'
import ReservationForm from './reservation-form'
import PackOrderForm from './pack-order-form'
import FormModal from './form-modal'
import { createClient } from '@/lib/supabase/server'
import { services as fallbackServices, packages as fallbackPackages } from '@/lib/content'

export const revalidate=60
type ServiceCard={slug:string;title:string;eyebrow?:string|null;short_description?:string|null;description?:string|null;price_label:string;price_unit?:string|null;features?:string[]}
type PackageCard={slug:string;name:string;tagline?:string|null;price_label:string;compare_at_price?:number|null;items?:string[];badge?:string|null}

const tickerItems=['Enregistrement vocal','Mixage & mastering','Beatmaking','Topline & écriture','Clip vidéo','Raï · Rap · Trap · RnB','Afro · Drill · Zan9aoui','Sessions live']

function Ticker({variant='signal'}:{variant?:'signal'|'paper'}){
 const bg=variant==='signal'?'bg-signal text-ink':'bg-paper text-ink'
 return <div className={`overflow-hidden border-y border-ink/20 py-3 ${bg}`} aria-hidden>
  <div className="ticker-track">
   {[0,1].map((dup)=>(
    <div key={dup} className="flex shrink-0 items-center">
     {tickerItems.map((item,i)=>(
      <span key={`${dup}-${i}`} className="flex items-center gap-10 px-5 font-display text-lg uppercase tracking-wide">
       {item}<span className="text-sm text-ink/60">✦</span>
      </span>
     ))}
    </div>
   ))}
  </div>
 </div>
}

function RegMark({className,color='text-signal'}:{className?:string;color?:string}){
 return <span aria-hidden className={`regmark ${color} ${className??''}`}><i/></span>
}

function Frame({children,className=''}:{children:React.ReactNode;className?:string}){
 return <div className={`relative ${className}`}>
  {children}
  <RegMark className="-left-3 -top-3"/>
  <RegMark className="-right-3 -top-3"/>
  <RegMark className="-left-3 -bottom-3"/>
  <RegMark className="-right-3 -bottom-3"/>
 </div>
}

export default async function Home(){
 const supabase=await createClient()
 const [serviceResult,packageResult]=await Promise.all([supabase.from('services').select('*').eq('is_active',true).order('sort_order'),supabase.from('packages').select('*').eq('is_active',true).order('sort_order')])
 const services=(serviceResult.data?.length?serviceResult.data:fallbackServices) as unknown as ServiceCard[]
 const packages=(packageResult.data?.length?packageResult.data:fallbackPackages) as unknown as PackageCard[]
 const iconSet=[Mic2,AudioLines,Music2,Sparkles,Play]
 return <main>
  {/* ─────────── HEADER ─────────── */}
  <header className="absolute inset-x-0 top-0 z-30 text-paper">
   <div className="container flex h-20 items-center justify-between">
    <Link href="#accueil" aria-label="Le 100, accueil" className="flex items-center gap-3">
     <Image src="/studio/logo-neon.png" alt="Le 100 Pub & Prod" width={110} height={60} className="h-12 w-[88px] object-contain"/>
     <span className="leading-none">
      <strong className="block font-display text-lg uppercase tracking-[.12em]">Le 💯</strong>
      <span className="tag text-[.55rem] text-smoke">PUB & PROD</span>
     </span>
    </Link>
    <nav className="hidden items-center gap-8 lg:flex">
     {[['#studio','01','Le lieu'],['#services','02','Prestations'],['#packs','03','Packs'],['#contact','04','Contact']].map(([href,idx,label])=>(
      <a key={href} className="navlink flex items-baseline gap-2 font-mono text-[.66rem] uppercase tracking-[.22em] text-paper/75 hover:text-signal" href={href}><span className="text-signal">{idx}</span>{label}</a>
     ))}
    </nav>
    <a className="notch focus-ring hidden border border-paper/40 px-5 py-3 font-mono text-[.66rem] uppercase tracking-[.2em] transition hover:bg-paper hover:text-ink sm:block" href="#contact">Parlons projet</a>
   </div>
  </header>

  {/* ─────────── HERO ─────────── */}
  <section id="accueil" className="relative flex min-h-[820px] items-end overflow-hidden pt-32 md:min-h-screen">
   <div className="absolute inset-0">
    <Image src="/studio/studio-wide.jpg" alt="" fill priority sizes="100vw" className="object-cover"/>
    <div className="absolute inset-0 bg-ink/70"/>
    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-ink/65"/>
   </div>
   <div aria-hidden className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 select-none font-display text-[40vw] leading-none text-paper/[.045] md:text-[26rem]">100</div>
   <div className="container relative z-10 grid gap-14 pb-24 md:grid-cols-[1.2fr_.8fr] md:items-end">
    <div>
     <p className="tag flex items-center gap-3 text-signal"><span className="blink inline-block h-2.5 w-2.5 rounded-full bg-signal"/>STUDIO 100% — ALLUME LE ROUGE</p>
     <h1 className="mt-6 font-display text-[15vw] uppercase leading-[.88] tracking-[-.01em] sm:text-8xl md:text-[7rem] lg:text-[8rem]">
      Faites<br/>du <span className="outline">bruit.</span><br/><span className="text-signal">À votre manière.</span>
     </h1>
     <p className="mt-7 max-w-md text-sm leading-6 text-smoke md:text-base">De la première prise au dernier master, on construit votre morceau ensemble. Bienvenue chez Le 💯 — la table est allumée, le micro est chaud.</p>
     <div className="mt-10 flex flex-wrap gap-4">
      <a className="notch focus-ring bg-signal px-8 py-4 font-display text-sm uppercase tracking-wide text-ink transition hover:bg-paper" href="#contact">Réserver une session <ArrowRight className="ml-2 inline" size={16}/></a>
      <a className="notch focus-ring border border-paper/40 px-8 py-4 font-display text-sm uppercase tracking-wide transition hover:bg-paper/10" href="#services">Voir les prestations <ArrowDown className="ml-2 inline" size={15}/></a>
     </div>
    </div>
    <div className="relative hidden md:block">
     <aside className="relative ml-auto w-[340px] border border-paper/25 bg-ink/70 p-7 backdrop-blur-md">
      <RegMark className="-left-3 -top-3"/>
      <RegMark className="-right-3 -bottom-3"/>
      <div className="flex items-start justify-between gap-4">
       <div>
        <p className="tag text-paper/60">SESSION.001 // RÉGIE</p>
        <p className="mt-3 font-display text-2xl uppercase leading-[.92]">Voix.<br/>Idées.<br/><span className="text-signal">Lumière rouge.</span></p>
       </div>
       <div aria-hidden className="flex flex-col-reverse gap-[3px] pt-1">
        {Array.from({length:10},(_,i)=>(
         <span key={i} className={`h-[5px] w-[14px] ${i===9?'bg-signal':i>=6?'bg-ember/80':'bg-paper/25'}`}/>
        ))}
       </div>
      </div>
      <div className="mt-6 border-t border-paper/20 pt-4">
       <div className="flex justify-between tag text-smoke"><span>FADER 01 · VOIX</span><span>-3.2 dB</span></div>
       <div className="mt-3 flex h-6 items-end gap-[3px]" aria-hidden>
        {Array.from({length:24},(_,i)=>{
         const h=4+Math.round(Math.abs(Math.sin(i*1.7))*40)
         return <span key={i} className="flex-1 rounded-t-[1px] bg-signal/70" style={{height:`${h}%`}}/>
        })}
       </div>
       <div className="mt-2 flex justify-between tag text-smoke"><span>MASTER</span><span>OK · READY</span></div>
      </div>
      <p className="mt-6 text-xs leading-5 text-smoke">La table est branchée. Il ne manque que votre première idée sur le micro.</p>
     </aside>
     <p className="tag absolute -bottom-5 left-4 rotate-[-3deg] bg-signal px-3 py-2 text-ink">PLUG IN · PRESS REC · 100%</p>
    </div>
   </div>
  </section>

  <Ticker/>

  {/* ─────────── STUDIO ─────────── */}
  <section id="studio" className="border-t border-paper/10 py-24 md:py-32">
   <div className="container grid gap-14 lg:grid-cols-2 lg:items-center">
    <Frame className="lg:pr-6">
     <div className="border border-paper/15">
      <Image src="/studio/control-room.jpg" alt="Régie du studio Le 100, éclairage chaud et espace de production" width={810} height={1080} className="h-[420px] w-full object-cover md:h-[560px]"/>
      <div className="flex items-center justify-between border-t border-paper/15 bg-coal px-4 py-3">
       <span className="tag text-paper/70">TAPE 01 / RÉGIE</span>
       <span className="tag text-signal">CHAUFFÉ & PROCHE</span>
      </div>
     </div>
    </Frame>
    <div>
     <p className="tag text-signal">01 / LE LIEU</p>
     <h2 className="mt-5 font-display text-5xl uppercase leading-[.9] md:text-7xl">Un studio à <span className="outline">taille humaine</span>. Un son qui vous <span className="text-signal">ressemble</span>.</h2>
     <p className="mt-7 max-w-md text-sm leading-7 text-smoke md:text-base">Un espace chaleureux, du temps pour chercher la bonne prise et une équipe qui connaît les codes du studio. On travaille votre morceau avec soin, sans vous presser.</p>
     <p className="mt-4 max-w-md text-sm leading-7 text-smoke md:text-base">Voix, mixage, composition ou clip : tout commence par votre idée. Installez-vous, on lance la session.</p>
     <div className="mt-10 grid grid-cols-3 divide-x divide-paper/15 border-y border-paper/15">
      {([  
        [Mic2,'Cabine traitée','Acoustique soignée pour la voix.'],
        [AudioLines,'Chaîne directe','Micro, préamp, écoute : tout est en place.'],
        [Headphones,'Direction artistique','Une vraie écoute sur chaque prise.']
       ] as [React.ComponentType<{size?:number|string;className?:string}>,string,string][]).map(([SpecIcon,title,desc])=>(
       <div key={title} className="p-4 first:pl-0">
        <SpecIcon size={19} className="text-signal"/>
        <p className="mt-3 font-display text-sm uppercase leading-tight">{title}</p>
        <p className="mt-1 text-xs leading-5 text-smoke">{desc}</p>
      </div>))}
     </div>
     <a href="#contact" className="group mt-9 inline-flex items-center gap-3 border-b border-signal pb-2 font-mono text-xs uppercase tracking-[.22em] text-paper transition hover:text-signal">Découvrir le studio <ArrowRight size={15} className="transition group-hover:translate-x-1"/></a>
    </div>
   </div>
  </section>

  {/* ─────────── GALLERY ─────────── */}
  <section className="border-t border-paper/10 bg-coal py-24">
   <div className="container">
    <div className="flex flex-wrap items-end justify-between gap-6">
     <div>
      <p className="tag text-signal">À L’INTÉRIEUR</p>
      <h2 className="mt-4 font-display text-5xl uppercase leading-[.9] md:text-6xl">La pièce est <span className="outline">à vous</span>.</h2>
     </div>
     <p className="max-w-sm text-sm leading-6 text-smoke">Une cabine pour les prises, une régie pour sculpter le son, un coin pour souffler entre deux morceaux. Tout est branché, il ne manque que vous.</p>
    </div>
    <div className="mt-12 grid auto-rows-[130px] grid-cols-2 gap-3 md:auto-rows-[170px] md:grid-cols-4">
     {[['/studio/studio-wide.jpg','Vue d’ensemble du studio Le 100 avec régie et espace détente','TAPE 00 / OVERVIEW','col-span-2 row-span-2'],['/studio/booth.jpg','Microphone et cabine acoustique du studio','TAPE 01 / BOOTH',''],['/studio/acoustics.jpg','Traitement acoustique des murs du studio','TAPE 02 / ACOUSTIQUE',''],['/studio/lounge.jpg','Espace détente du studio Le 100','TAPE 03 / LOUNGE',''],['/studio/control-room.jpg','Équipement de production audio en régie','TAPE 04 / RÉGIE','']].map(([src,alt,label,span])=>(
      <figure key={src as string} className={`group relative overflow-hidden border border-paper/10 ${span as string}`}>
       <Image src={src as string} alt={alt as string} width={810} height={1080} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"/>
       <figcaption className="tag absolute bottom-2 left-2 bg-ink/70 px-2 py-1 text-[.56rem] text-paper/85">{label as string}</figcaption>
      </figure>
     ))}
    </div>
   </div>
  </section>

  <Ticker variant="paper"/>

  {/* ─────────── SERVICES ─────────── */}
  <section id="services" className="py-24 md:py-32">
   <div className="container">
    <div className="flex flex-wrap items-end justify-between gap-6">
     <div>
      <p className="tag text-signal">02 / PRESTATIONS</p>
      <h2 className="mt-4 font-display text-5xl uppercase leading-[.9] md:text-6xl">On fait quoi<br/><span className="outline">ensemble&nbsp;?</span></h2>
     </div>
     <p className="max-w-sm text-sm leading-6 text-smoke">Des prestations claires, réalisées avec vous, du premier essai au rendu final. Choisissez un canal :</p>
    </div>
    <div className="mt-12 border-t border-paper/15">
     {services.map((service,i)=>{
      const Icon=iconSet[i%iconSet.length]
      return (
       <article key={service.slug} className="group grid gap-4 border-b border-paper/15 py-7 transition hover:bg-coal md:grid-cols-[70px_1fr_auto_auto] md:items-center md:gap-8 md:px-4">
        <span className="tag text-smoke transition group-hover:text-signal">CH.{String(i+1).padStart(2,'0')}</span>
        <div className="flex items-start gap-4">
         <span className="grid h-11 w-11 shrink-0 place-items-center border border-paper/20 text-signal"><Icon size={18}/></span>
         <div>
          <p className="tag text-signal">{service.eyebrow||'LE STUDIO'}</p>
          <h3 className="mt-1 font-display text-2xl uppercase leading-none md:text-3xl">{service.title}</h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-smoke">{service.short_description||service.description}</p>
          {service.description&&service.short_description&&(
           <details className="mt-3 text-sm text-smoke">
            <summary className="tag cursor-pointer text-paper/70 transition hover:text-signal">VOIR LE DÉTAIL</summary>
            <p className="mt-2 max-w-xl leading-6">{service.description}</p>
            {service.features?.length?(
             <ul className="mt-3 flex flex-wrap gap-2">{service.features.map((feature)=><li key={feature} className="tag border border-paper/20 px-2 py-1 text-[.58rem] text-smoke">{feature}</li>)}</ul>
            ):null}
           </details>
          )}
         </div>
        </div>
        <p className="font-mono text-sm text-paper/80 md:text-right"><span className="font-display text-2xl tracking-wide text-paper">{service.price_label}</span> <span className="text-[.62rem] text-smoke">{service.price_unit||''}</span></p>
        <a className="focus-ring grid h-11 w-11 place-items-center border border-paper/20 text-paper transition hover:border-signal hover:bg-signal hover:text-ink" aria-label={`Demander ${service.title}`} href="#contact"><ArrowRight size={18}/></a>
       </article>
      )
     })}
    </div>
    <p className="tag mt-6 text-smoke">5 CHANNELS BRANCHÉS — À VOUS DE JOUER.</p>
   </div>
  </section>

  {/* ─────────── PACKS ─────────── */}
  <section id="packs" className="border-t border-paper/10 bg-coal py-24 md:py-32">
   <div className="container">
    <div className="flex flex-wrap items-end justify-between gap-6">
     <div>
      <p className="tag text-signal">03 / FORMULES</p>
      <h2 className="mt-4 font-display text-5xl uppercase leading-[.9] md:text-6xl">Un morceau.<br/><span className="outline">Une formule.</span></h2>
     </div>
     <p className="max-w-md text-sm leading-7 text-smoke">Enregistrement, production et finition réunis dans des packs faits pour avancer simplement.</p>
    </div>
    <div className="mt-12 grid gap-5 lg:grid-cols-3">
     {packages.map((pack,i)=>{
      const featured=i===1
      return (
       <article key={pack.slug} className={`relative flex flex-col border p-7 ${featured?'border-signal bg-paper text-ink lg:-translate-y-2':'border-paper/20 bg-ink'}`}>
        {pack.badge&&(
         <p className={`tag mb-6 flex items-center gap-3 ${featured?'text-ink/70':'text-paper/70'}`}>
          <span className="blink inline-block h-2 w-2 rounded-full bg-signal"/>{featured?'PACK.0'+(i+1)+' · ':''}{pack.badge}
         </p>
        )}
        <div className="flex items-start justify-between gap-4">
         <h3 className="font-display text-3xl uppercase leading-none">{pack.name}</h3>
         <span className={`tag shrink-0 ${featured?'text-ink/60':'text-smoke'}`}>0{i+1}</span>
        </div>
        <p className={`mt-3 text-sm ${featured?'text-ink/65':'text-smoke'}`}>{pack.tagline}</p>
        <p className="mt-7 font-display text-4xl leading-none">{featured?<span>{pack.price_label}</span>:<span className="text-paper">{pack.price_label}</span>}</p>
        {pack.compare_at_price&&<p className={`mt-1 text-xs line-through ${featured?'text-ink/45':'text-smoke'}`}>Au lieu de {pack.compare_at_price.toLocaleString('fr-FR')} DA</p>}
        <div className={`my-7 border-t border-dashed ${featured?'border-ink/30':'border-paper/25'}`}>
         <span className={`absolute -left-3 mt-[-0.65rem] h-5 w-5 rounded-full border border-transparent bg-coal`}/>
         <span className={`absolute -right-3 mt-[-0.65rem] h-5 w-5 rounded-full border border-transparent bg-coal`}/>
        </div>
        <ul className="flex-1 space-y-3">
         {(Array.isArray(pack.items)?pack.items:[]).map((item)=>(
          <li key={item} className={`flex gap-3 text-sm ${featured?'text-ink/85':'text-paper/80'}`}><Check size={16} className={`mt-0.5 shrink-0 ${featured?'text-ink':'text-signal'}`}/>{item}</li>
         ))}
        </ul>
        <FormModal title={`Commander · ${pack.name}`} buttonLabel="Commander cette formule ↗" buttonClassName={`focus-ring mt-8 w-full border px-5 py-4 text-left font-display text-xs uppercase tracking-[.14em] transition ${featured?'border-ink hover:bg-ink hover:text-paper':'border-paper/30 hover:border-signal hover:bg-signal hover:text-ink'}`}><p className="mb-5 text-sm text-smoke">Confirmez votre intérêt. Le studio vous recontacte pour la réservation et le paiement hors plateforme.</p><PackOrderForm slug={pack.slug}/></FormModal>
       </article>
      )
     })}
    </div>
   </div>
  </section>

  {/* ─────────── STEPS ─────────── */}
  <section className="py-24 md:py-32">
   <div className="container grid gap-14 lg:grid-cols-2 lg:items-center">
    <div>
     <p className="tag text-signal">LE DÉROULÉ</p>
     <h2 className="mt-4 font-display text-5xl uppercase leading-[.9] md:text-6xl">Une prise<br/><span className="outline">à la fois.</span></h2>
     <p className="mt-6 max-w-lg text-sm leading-7 text-smoke md:text-base">Posez vos idées, on s’occupe du reste ensemble. Une session au calme, une vraie écoute et le temps de trouver la bonne couleur pour votre titre.</p>
     <div className="mt-10">
      {[['01','On échange','Ton idée, ton style, tes références. On cale la direction ensemble.'],['02','On enregistre','Cabine ouverte, régie allumée. Les prises défilent, on garde le meilleur.'],['03','On finalise','Mixage, mastering : un son prêt à partir dans le monde.']].map(([num,title,desc])=>(
       <div key={num} className="grid grid-cols-[34px_1fr] gap-4 border-t border-paper/15 py-6 last:border-b">
        <span className="tag pt-1 text-signal">{num}</span>
        <div className="flex items-center gap-4">
         <div aria-hidden className="eq h-7 w-14 text-signal"><span/><span/><span/><span/><span/><span/><span/></div>
         <div>
          <h3 className="font-display text-xl uppercase leading-none">{title as string}</h3>
          <p className="mt-2 text-sm leading-6 text-smoke">{desc as string}</p>
         </div>
        </div>
       </div>
      ))}
     </div>
    </div>
    <Frame>
     <div className="border border-paper/15">
      <Image src="/studio/booth.jpg" alt="Micro prêt pour une session d’enregistrement vocal" width={810} height={1080} className="h-[430px] w-full object-cover md:h-[520px]"/>
      <div className="flex items-center justify-between border-t border-paper/15 bg-coal px-4 py-3">
       <span className="tag text-paper/70">CABINE · MIC PRÉPARÉ</span>
       <span className="tag text-signal">ENREGISTRER ▼</span>
      </div>
     </div>
     <p className="tag absolute -bottom-5 right-4 rotate-[3deg] bg-signal px-3 py-2 text-ink">PAS DE FORMULE TOUTE FAITE</p>
    </Frame>
   </div>
  </section>

  {/* ─────────── CONTACT ─────────── */}
  <section id="contact" className="border-t border-paper/10 bg-coal py-24 md:py-32">
   <div className="container grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
    <div>
     <p className="tag text-signal">DERNIER CHANNEL</p>
     <h2 className="mt-5 font-display text-5xl uppercase leading-[.9] md:text-7xl">Racontez-nous<br/>votre <span className="outline">projet</span></h2>
     <p className="mt-7 max-w-sm text-sm leading-7 text-smoke md:text-base">Dites-nous ce que vous préparez : style, morceau, envie. On vous répond vite pour caler la session et la formule qui va bien.</p>
     <dl className="mt-10">
      {[['RÉPONSE','Direct au studio, sous 24h. Promis, on lit tout.'],['PAIEMENT','Tarifs en DA. Devis clair posé avant de lancer.'],['ADRESSE','On vous la donne au premier rendez-vous.']].map(([dt,dd])=>(
       <div key={dt as string} className="flex gap-5 border-t border-paper/15 py-5 last:border-b">
        <dt className="tag w-24 shrink-0 pt-0.5 text-signal">{dt as string}</dt>
        <dd className="text-sm leading-6 text-paper/85">{dd as string}</dd>
       </div>
      ))}
     </dl>
    </div>
    <div className="grid gap-8 lg:pt-4">
     <div className="border border-paper/15 bg-ink p-6 md:p-8"><p className="tag text-signal">RÉSERVER UN CRÉNEAU</p><h3 className="mt-3 font-display text-2xl uppercase text-paper">Votre session, à votre heure.</h3><p className="mb-6 mt-2 text-sm text-smoke">Proposez une date et une durée. L’équipe confirme le créneau avant qu’il soit réservé.</p><FormModal title="Demander une session" buttonLabel="Choisir date & heure ↗" buttonClassName="notch focus-ring bg-signal px-6 py-4 font-display text-sm uppercase tracking-wide text-ink transition hover:bg-paper"><ReservationForm/></FormModal></div>
     <div className="border border-paper/15 bg-ink p-6 md:p-8"><p className="tag mb-5 text-signal">UNE QUESTION ?</p><ContactForm/></div>
    </div>
   </div>
  </section>

  {/* ─────────── FOOTER ─────────── */}
  <footer className="relative overflow-hidden border-t border-paper/10 py-12">
   <div aria-hidden className="pointer-events-none absolute -bottom-10 right-[-2%] select-none font-display text-[22vw] leading-none text-paper/[.04] md:text-[16rem]">100</div>
   <div className="container relative z-10 flex flex-wrap items-center justify-between gap-6">
    <div className="flex items-center gap-3">
     <Image src="/studio/logo-neon.png" alt="Le 100 Pub & Prod" width={120} height={70} className="h-12 w-24 object-contain"/>
     <span className="tag text-[.55rem] text-smoke">STUDIO D’ENREGISTREMENT</span>
    </div>
    <p className="font-mono text-xs text-smoke">Fait pour la musique. © {new Date().getFullYear()} Le 100.</p>
    <div className="flex items-center gap-6">
     <Link href="/account/login" className="tag text-smoke transition hover:text-paper">Mon espace</Link>
     <Link href="/admin/login" className="tag text-smoke transition hover:text-paper">Espace studio</Link>
     <a href="#accueil" className="tag text-signal transition hover:text-paper">↑ Haut</a>
    </div>
   </div>
   <p className="container relative z-10 mt-8 border-t border-paper/10 pt-5 text-center font-mono text-[.65rem] uppercase tracking-[.16em] text-smoke">© 2026 Qodily Dev Solutions. Tous droits réservés.</p>
   <div aria-hidden className="container relative z-10 mt-6 flex items-end gap-[3px] border-t border-paper/10 pt-5 opacity-35">
    {[2,1,3,1,2,4,1,2,1,3,2,1,4,2,1,1,3,2,1,2,3,1,2,4,1,3,1,2].map((w,idx)=><span key={idx} className="inline-block h-6 bg-paper/60" style={{width:`${w}px`}}/>)}
   </div>
  </footer>
 </main>
}
