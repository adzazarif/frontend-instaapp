import Sidebar from './Sidebar';

export default function MainLayout({ children }) {
  return (
    <div className="bg-zinc-50 min-h-screen text-zinc-900 selection:bg-zinc-200">
      <div className="max-w-[950px] mx-auto flex justify-center md:justify-start relative min-h-screen">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-[600px] md:max-w-[700px] bg-white border-x border-gray-200 shadow-sm pb-20 md:pb-0 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
