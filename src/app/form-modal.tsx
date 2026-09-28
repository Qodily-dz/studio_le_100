'use client'
import {useId,useRef,type ReactNode} from 'react'
import {X} from 'lucide-react'

export default function FormModal({title,buttonLabel,buttonClassName,children}:{title:string;buttonLabel:string;buttonClassName:string;children:ReactNode}){
 const dialogRef=useRef<HTMLDialogElement>(null),titleId=useId()
 return <>
  <button type="button" className={buttonClassName} onClick={()=>dialogRef.current?.showModal()}>{buttonLabel}</button>
  <dialog ref={dialogRef} aria-labelledby={titleId} className="form-modal" onClick={event=>{if(event.target===dialogRef.current)dialogRef.current?.close()}}>
   <div className="relative max-h-[calc(100dvh-2rem)] overflow-y-auto border border-paper/20 bg-ink p-6 text-paper shadow-2xl shadow-black/60 md:p-9">
    <button type="button" aria-label="Fermer" onClick={()=>dialogRef.current?.close()} className="focus-ring absolute right-4 top-4 grid h-10 w-10 place-items-center border border-paper/20 text-paper transition hover:border-signal hover:bg-signal hover:text-ink"><X size={18}/></button>
    <p className="tag pr-12 text-signal">LE 💯 · STUDIO</p><h2 id={titleId} className="mt-3 pr-12 font-display text-3xl uppercase md:text-4xl">{title}</h2>
    <div className="mt-6">{children}</div>
   </div>
  </dialog>
 </>
}
