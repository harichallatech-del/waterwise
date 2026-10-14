import type {Metadata} from 'next'; import './globals.css';
export const metadata:Metadata={title:'WaterWise — Every Drop, Intelligently Used',description:'Interactive rainwater harvesting and greywater recovery planner.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}