import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';
import { useEffect } from 'react';

const PendingPolls = () => {
    const { theme } = useTheme();
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const regNo = localStorage.getItem('regNo');

    useEffect(() => {
        if (regNo) {
            fetchPendingPolls();
        } else {
            setLoading(false);
        }
    }, [regNo]);

    const fetchPendingPolls = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/polls/pending/${regNo}`);
            const data = await res.json();
            if (res.ok) setPolls(data);
        } catch (err) {
            console.error('Error fetching pending polls');
        } finally {
            setLoading(false);
        }
    };

    if (!regNo) {
        return (
            <div className={`min-h-[60vh] flex flex-col items-center justify-center text-center px-4 transition-colors duration-500`}>
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 border shadow-2xl transition-all ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                    <svg className={`w-10 h-10 transition-colors ${theme === 'light' ? 'text-slate-400' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h2 className={`text-2xl font-black mb-2 tracking-tight transition-colors ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Access Restricted</h2>
                <p className="text-slate-500 max-w-xs mx-auto mb-8 font-medium">Please register or login with your Roll Number to see your pending polls.</p>
                <Link to="/" className="btn-primary py-3 px-8 rounded-xl text-sm">Go to Registration</Link>
            </div>
        );
    }

    return (
        <div className="animate-fade-in max-w-5xl mx-auto py-8 px-4">
            <header className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-8 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.3)]"></div>
                    <h1 className={`text-3xl md:text-5xl font-black tracking-tighter transition-colors ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Pending Sessions</h1>
                </div>
                <p className={`text-lg font-medium transition-colors ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Polls awaiting your response. Your input matters.</p>
            </header>

            {loading ? (
                <div className="py-32 text-center animate-pulse">
                    <p className={`font-black uppercase tracking-[0.3em] text-sm transition-colors ${theme === 'light' ? 'text-slate-400' : 'text-slate-600'}`}>Syncing with Registry...</p>
                </div>
            ) : polls.length === 0 ? (
                <div className="py-32 text-center glass-card border-dashed">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-2xl">
                        <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className={`text-2xl font-black mb-2 tracking-tight transition-colors ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>All Caught Up!</h3>
                    <p className={`font-medium transition-colors ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>No pending polls for <b>{regNo}</b> at this time.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {polls.map((p) => (
                        <Link
                            key={p._id}
                            to={`/poll/${p.pollId}`}
                            className={`glass-card p-8 group hover:border-amber-500/40 transition-all duration-500 flex flex-col items-start text-left shadow-xl ${theme === 'light' ? 'hover:bg-amber-50/30' : 'hover:bg-slate-900/40'}`}
                        >
                            <div className="flex justify-between w-full mb-6">
                                <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">Awaiting Action</span>
                                <span className={`text-[10px] font-bold uppercase transition-colors ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>{new Date(p.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h3 className={`text-2xl font-black mb-3 group-hover:text-amber-500 transition-colors leading-tight line-clamp-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{p.title}</h3>
                            <p className={`mb-8 line-clamp-2 font-medium transition-colors ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>{p.question}</p>
                            <div className={`mt-auto w-full flex items-center justify-between pt-6 border-t transition-colors ${theme === 'light' ? 'border-slate-100' : 'border-slate-800/50'}`}>
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${theme === 'light' ? 'text-slate-400 group-hover:text-slate-900' : 'text-slate-500 group-hover:text-white'}`}>Open Session</span>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${theme === 'light' ? 'bg-slate-100 group-hover:bg-amber-500' : 'bg-slate-950 group-hover:bg-amber-500'}`}>
                                    <svg className={`w-4 h-4 transition-colors ${theme === 'light' ? 'text-slate-400 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-950'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PendingPolls;
