import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    // Prevent scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    const handleSignOut = () => {
        localStorage.removeItem('regNo');
        localStorage.removeItem('name');
        setIsMenuOpen(false);
    };

    return (
        <>
            {/* Desktop & Mobile Main Nav Container */}
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-3rem)] max-w-7xl">
                <div className={`glass-card !rounded-[2rem] px-6 md:px-10 py-3 flex justify-between items-center border shadow-2xl backdrop-blur-3xl transition-all duration-500 relative z-50 ${theme === 'light' ? 'bg-white/80 border-slate-200' : 'border-white/5'}`}>
                    <div className="flex items-center gap-10">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 shadow-xl group-hover:rotate-12 ${theme === 'light' ? 'bg-cyan-600 border-cyan-500/50 shadow-cyan-600/20' : 'bg-cyan-500 border-white/20 shadow-cyan-500/20'}`}>
                                <svg className={`w-7 h-7 stroke-[2.5] ${theme === 'light' ? 'text-white' : 'text-slate-950'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <span className={`text-2xl font-black tracking-tighter uppercase transition-colors ${theme === 'light' ? 'text-slate-900 group-hover:text-cyan-600' : 'text-white group-hover:text-cyan-400'}`}>
                                Poll<span className={theme === 'light' ? 'text-slate-400 font-medium' : 'text-slate-500 font-medium'}>Metric</span>
                            </span>
                        </Link>

                        <div className="hidden lg:flex items-center gap-8">
                            <Link to="/pending" className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${theme === 'light' ? 'text-slate-500 hover:text-slate-900' : 'text-slate-500 hover:text-white'}`}>Pending</Link>
                            <Link to="/responded" className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${theme === 'light' ? 'text-slate-500 hover:text-slate-900' : 'text-slate-500 hover:text-white'}`}>Responded</Link>
                            <Link to="/admin" className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${theme === 'light' ? 'text-slate-500 hover:text-slate-900' : 'text-slate-500 hover:text-white'}`}>Polls</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            onClick={toggleTheme}
                            className={`hidden lg:flex w-12 h-12 rounded-xl border items-center justify-center transition-all duration-300 active:scale-95 ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'}`}
                        >
                            {theme === 'dark' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>

                        <Link
                            to="/"
                            onClick={handleSignOut}
                            className={`hidden md:flex w-12 h-12 rounded-xl border items-center justify-center transition-all duration-300 active:scale-95 ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-rose-600 hover:bg-rose-50' : 'bg-slate-950 border-slate-800 text-rose-500 hover:bg-rose-950/30'}`}
                            title="Sign Out"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </Link>

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`lg:hidden w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-300 active:scale-95 relative z-[110] ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay - Refined Sample Style */}
            <div className={`lg:hidden fixed inset-0 z-[110] transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {/* Background Blur */}
                <div className={`absolute inset-0 backdrop-blur-3xl ${theme === 'light' ? 'bg-slate-50/98' : 'bg-slate-950/98'}`}></div>

                {/* Content Container */}
                <div className="relative h-full flex flex-col overflow-y-auto">
                    {/* Header Section */}
                    <div className={`mx-6 px-5 mt-4 glass-card !rounded-[2rem] px-6 md:px-10 py-3 flex justify-between items-center border shadow-2xl backdrop-blur-3xl transition-all duration-500 relative z-50 ${theme === 'light' ? 'bg-white/80 border-slate-200' : 'border-white/5'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 shadow-xl group-hover:rotate-12 ${theme === 'light' ? 'bg-cyan-600 border-cyan-500/50 shadow-cyan-600/20' : 'bg-cyan-500 border-white/20 shadow-cyan-500/20'}`}>
                                <svg className={`w-7 h-7 stroke-[2.5] ${theme === 'light' ? 'text-white' : 'text-slate-950'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <span className={`text-2xl font-black tracking-tighter uppercase transition-colors ${theme === 'light' ? 'text-slate-900 group-hover:text-cyan-600' : 'text-white group-hover:text-cyan-400'}`}>
                                Poll<span className={theme === 'light' ? 'text-slate-400 font-medium' : 'text-slate-500 font-medium'}>Metric</span>
                            </span>
                        </div>
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className={`w-12 h-12 rounded-xl transition-all flex items-center justify-center active:scale-95 ${theme === 'light' ? 'bg-white border border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-900 text-white'}`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Quick Action Grid */}
                    <div className="px-8 py-6 grid grid-cols-3 gap-4">
                        <Link
                            to="/pending"
                            className={`p-6 rounded-[2rem] flex flex-col items-center gap-3 transition-all active:scale-95 border ${theme === 'light' ? 'bg-white border-slate-200 shadow-sm shadow-slate-200/50' : 'bg-slate-900/50 border-slate-800 shadow-xl'}`}
                        >
                            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                                <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'light' ? 'text-slate-900' : 'text-slate-300'}`}>Pending</span>
                        </Link>
                        <Link
                            to="/responded"
                            className={`p-6 rounded-[2rem] flex flex-col items-center gap-3 transition-all active:scale-95 border ${theme === 'light' ? 'bg-white border-slate-200 shadow-sm shadow-slate-200/50' : 'bg-slate-900/50 border-slate-800 shadow-xl'}`}
                        >
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'light' ? 'text-slate-900' : 'text-slate-300'}`}>Responded</span>
                        </Link>
                        <Link
                            to="/admin"
                            className={`p-6 rounded-[2rem] flex flex-col items-center gap-3 transition-all active:scale-95 border ${theme === 'light' ? 'bg-white border-slate-200 shadow-sm shadow-slate-200/50' : 'bg-slate-900/50 border-slate-800 shadow-xl'}`}
                        >
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'light' ? 'text-slate-900' : 'text-slate-300'}`}>All Polls</span>
                        </Link>
                    </div>

                    {/* Navigation List */}
                    <div className="flex-1 px-8 space-y-2">
                        <div className={`h-px w-full my-4 ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`}></div>

                        <div className={`h-px w-full my-4 ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`}></div>


                        <button
                            onClick={toggleTheme}
                            className={`w-full flex justify-between items-center p-4 rounded-2xl transition-all active:scale-95 ${theme === 'light' ? 'hover:bg-slate-100 text-slate-900' : 'hover:bg-slate-900 text-slate-400'}`}
                        >
                            <div className="flex items-center gap-5">
                                {theme === 'dark' ? (
                                    <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )}
                                <span className={`text-sm font-bold uppercase tracking-widest ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Appearance</span>
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>
                                {theme === 'dark' ? 'Dark' : 'Light'}
                            </span>
                        </button>

                        <Link
                            to="/"
                            className={`flex justify-between items-center p-4 rounded-2xl transition-all active:scale-95 ${theme === 'light' ? 'hover:bg-rose-50 text-rose-600' : 'hover:bg-rose-950/20 text-rose-400'}`}
                            onClick={handleSignOut}
                        >
                            <div className="flex items-center gap-5 text-rose-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="text-sm font-bold uppercase tracking-widest">Sign Out</span>
                            </div>
                        </Link>

                    </div>

                    {/* Bottom Action Section */}
                    <div className="p-8">
                        <Link
                            to="/admin"
                            className={`btn-primary !w-full !py-6 !px-10 !rounded-[2.5rem] !text-lg font-black uppercase tracking-[0.2em] shadow-2xl transition-transform active:scale-95 flex items-center justify-center gap-4 ${theme === 'light' ? 'bg-cyan-600 text-white shadow-cyan-600/30' : 'shadow-cyan-500/30'}`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Administration
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navbar
