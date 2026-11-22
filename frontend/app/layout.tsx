import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';

export const metadata: Metadata = {
  title: 'RideSphere | Intelligent Urban Mobility Platform',
  description: 'Enterprise-grade, distributed ride-hailing and real-time mobility platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070A10] text-slate-100 flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        
        {/* Footer */}
        <footer className="border-t border-white/[0.08] bg-[#05070C] py-8 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="font-semibold text-slate-300">RideSphere Platform v1.0.0</span>
              <span>•</span>
              <span>Enterprise Mobility Infrastructure</span>
            </div>
            <div className="flex items-center gap-6 text-slate-400">
              <a href="/swagger-ui.html" className="hover:text-cyan-400 transition-colors">API Docs</a>
              <a href="/admin" className="hover:text-cyan-400 transition-colors">Operations</a>
              <a href="https://github.com/Quantum-Fiend/urban_ride" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">GitHub Repository</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
