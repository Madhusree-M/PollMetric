import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';
import { useEffect } from 'react';

const Register = () => {
    const [regNo, setRegNo] = useState('');
    const [name, setName] = useState('');
    const { theme } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        const storedRegNo = localStorage.getItem('regNo');
        const storedName = localStorage.getItem('name');
        if (storedRegNo) setRegNo(storedRegNo);
        if (storedName) setName(storedName);
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ regNo, name })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('regNo', regNo);
                localStorage.setItem('name', name);
                toast.success('Login Successful!');
                navigate('/pending');
            } else {
                toast.error(data.error);
            }
        } catch (err) {
            toast.error('Error logging in');
        }
    };

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center px-6 overflow-hidden transition-colors duration-500 pt-[80px]">
            <div className="relative w-full max-w-lg flex flex-col items-center justify-center">
                <div className={`absolute -top-20 -left-20 w-72 h-72 rounded-full blur-[100px] animate-pulse transition-all duration-700 ${theme === 'light' ? 'bg-cyan-500/10' : 'bg-cyan-500/20'}`}></div>
                <div className={`absolute -bottom-20 -right-20 w-72 h-72 rounded-full blur-[100px] animate-pulse delay-700 transition-all duration-700 ${theme === 'light' ? 'bg-indigo-500/10' : 'bg-indigo-500/20'}`}></div>

                {/* Content Card */}
                <div className={`glass-card p-6 md:p-10 w-full z-10 animate-slide-up transition-all duration-500 ${theme === 'light' ? '!bg-white/80 !border-slate-200 shadow-xl' : ''}`}>
                    <header className="text-center mb-6">
                        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 border transition-all duration-500 shadow-inner ${theme === 'light' ? 'bg-cyan-50 border-cyan-100' : 'bg-cyan-500/10 border-cyan-500/20'}`}>
                            <svg className={`w-8 h-8 stroke-[2] ${theme === 'light' ? 'text-cyan-600' : 'text-cyan-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h1 className={`text-3xl font-black tracking-tighter mb-1 transition-colors duration-500 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Poll Metric</h1>
                        <p className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-colors duration-500 ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>Student Access Terminal</p>
                    </header>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ml-1 transition-colors duration-500 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Roll Number</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="e.g. 24CS127"
                                    className={`input-field pl-12 h-14 transition-all duration-500 ${theme === 'light' ? '!bg-slate-50 !border-slate-200 !text-slate-900 placeholder-slate-400 focus:!bg-white focus:!border-cyan-500' : ''}`}
                                    value={regNo}
                                    onChange={(e) => setRegNo(e.target.value)}
                                    required
                                />
                                <svg className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-500 ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ml-1 transition-colors duration-500 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Verification Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className={`input-field pl-12 h-14 transition-all duration-500 ${theme === 'light' ? '!bg-slate-50 !border-slate-200 !text-slate-900 placeholder-slate-400 focus:!bg-white focus:!border-cyan-500' : ''}`}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                                <svg className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-500 ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className={`btn-primary w-full text-base font-black py-4 mt-2 rounded-xl shadow-2xl transition-all duration-500 active:scale-95 ${theme === 'light' ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/20' : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'}`}
                        >
                            Authorize & Login
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </form>
                </div>

                <p className={`mt-6 text-[10px] font-black uppercase tracking-[0.4em] animate-fade-in transition-colors duration-500 ${theme === 'light' ? 'text-slate-400' : 'text-slate-600'}`} style={{ animationDelay: '0.5s' }}>
                    Secure • Encrypted • Instant
                </p>
            </div>
        </div>
    );
};

export default Register;
