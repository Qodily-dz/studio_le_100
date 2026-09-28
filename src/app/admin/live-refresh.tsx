'use client'
import {useEffect} from 'react'
import {useRouter} from 'next/navigation'
import {createClient} from '@/lib/supabase/client'
export default function LiveRefresh({tables}:{tables:string[]}){const router=useRouter();useEffect(()=>{const supabase=createClient();const channel=supabase.channel(`admin-live-${tables.join('-')}`);for(const table of tables)channel.on('postgres_changes',{event:'*',schema:'studio-music',table},()=>router.refresh());channel.subscribe();return()=>{void supabase.removeChannel(channel)}},[router,tables]);return <p className="tag mt-3 text-[#88734f]">● MISE À JOUR EN DIRECT</p>}
