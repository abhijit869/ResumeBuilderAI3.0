import { Shell } from '@/components/layout/Shell';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-full relative font-sans">
      {/* Background ambient light */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[30%] w-[30%] h-[30%] bg-emerald-500/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="text-center p-12 border border-white/10 bg-black/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-3xl">
        <h1 className="text-6xl font-bold text-primary drop-shadow-[0_0_15px_rgba(0,229,255,0.4)] mb-4">404</h1>
        <p className="text-xl text-white drop-shadow-md">View not found</p>
      </div>
    </div>
  );
}
