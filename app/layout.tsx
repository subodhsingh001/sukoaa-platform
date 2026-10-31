import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'Sukoaa — A little less friction. A lot more possibility.',description:'Discover a thoughtful home for everyday tools, the Sukoaa browser, extensions, and coding playgrounds.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
