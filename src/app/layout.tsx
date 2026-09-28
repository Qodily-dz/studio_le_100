import type { Metadata } from 'next'
import { Anton, Archivo, Space_Mono } from 'next/font/google'
import './globals.css'

const anton = Anton({ subsets: ['latin'], weight: '400', variable: '--font-anton' })
const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo' })
const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-spacemono' })

export const metadata: Metadata = { title: 'Le 💯 | Studio d’enregistrement & Production Musicale', description: 'Enregistrement vocal, mixage, mastering, beatmaking, composition et réalisation de clips chez Le 💯.', openGraph: { title: 'Le 💯 | Studio d’enregistrement & Production Musicale', description: 'De la première prise au dernier master, construisons votre morceau ensemble.' }, icons: { icon: '/studio/logo-neon.png' } }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${anton.variable} ${archivo.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}