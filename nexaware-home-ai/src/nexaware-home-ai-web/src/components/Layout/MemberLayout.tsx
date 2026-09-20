import { Outlet } from 'react-router-dom';

export function MemberLayout() {
    return (
        <div className="flex h-[100dvh] bg-background overflow-hidden selection:bg-primary/30 selection:text-primary-hover w-full relative">
            {/* Background Glow Effects to match the theme */}
            <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-primary/10 blur-[80px] md:blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none z-0" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] md:w-[500px] md:h-[500px] bg-indigo-900/5 blur-[100px] md:blur-[120px] rounded-full translate-y-1/4 -translate-x-1/4 pointer-events-none z-0" />

            {/* Main Container - Full Screen with padding, without admin sidebar */}
            <main className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-hidden relative z-10 p-2 sm:p-4">
                <Outlet />
            </main>
        </div>
    );
}
