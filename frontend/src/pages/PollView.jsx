import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';
import { useEffect } from 'react';
import { useState } from 'react';

const PollView = () => {
    const { theme } = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();
    const [poll, setPoll] = useState(null);
    const [regNo, setRegNo] = useState(localStorage.getItem('regNo') || '');
    const [name, setName] = useState(localStorage.getItem('name') || '');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditingReg, setIsEditingReg] = useState(!regNo);
    const [isModifying, setIsModifying] = useState(false);

    useEffect(() => {
        fetchPoll();
    }, [id]);

    useEffect(() => {
        if (poll && regNo) {
            checkExistingVote();
        }
    }, [poll, regNo]);

    const checkExistingVote = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/vote/${id}/${regNo}`);
            const data = await res.json();
            if (data.voted) {
                setSelectedOptions(Array.isArray(data.selectedOptions) ? data.selectedOptions : [data.selectedOptions]);
                setIsModifying(true);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchPoll = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/polls/${id}`);
            const data = await res.json();
            if (res.ok) setPoll(data);
            else toast.error(data.error);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleOption = (opt) => {
        if (poll.isMultiple) {
            if (selectedOptions.includes(opt)) {
                setSelectedOptions(selectedOptions.filter(o => o !== opt));
            } else {
                setSelectedOptions([...selectedOptions, opt]);
            }
        } else {
            setSelectedOptions([opt]);
        }
    };

    const handleVote = async () => {
        if (!regNo) return toast.warn('Roll Number is required');
        if (selectedOptions.length === 0) return toast.warn('Please select at least one option');

        try {
            const res = await fetch('http://localhost:5000/api/vote', {
                method: isModifying ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pollId: id, regNo, selectedOptions: selectedOptions })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('regNo', regNo);
                toast.success(isModifying ? 'Response Updated Successfully!' : 'Response Recorded Successfully!');
                navigate(`/report/${id}`);
            } else {
                toast.error(data.error);
            }
        } catch (err) {
            toast.error('Error submitting response');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-secondary">Loading...</div>;
    if (!poll) return <div className="min-h-screen flex items-center justify-center text-danger">Poll not found.</div>;

    return (
        <div className="flex flex-col items-center relative px-4 pt-28 pb-12 transition-colors duration-500">
            <div className={`glass-card p-5 md:p-6 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl animate-slide-up relative z-10 shadow-2xl transition-all duration-500 ${theme === 'light' ? '!bg-white/80 !border-slate-200' : 'border-white/5'}`}>
                <header className={`mb-4 border-b pb-4 transition-colors ${theme === 'light' ? 'border-slate-100' : 'border-slate-800'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded bg-cyan-50 border border-cyan-100 transition-all ${theme === 'light' ? 'text-cyan-600' : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'}`}>
                            Active Poll #{id.slice(0, 6)}
                        </span>
                    </div>
                    <h1 className={`text-2xl font-black mb-1 leading-tight tracking-tight transition-colors ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                        {poll.title}
                    </h1>
                    <p className={`text-sm leading-relaxed font-medium transition-colors ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                        {poll.question}
                    </p>
                </header>

                {/* Identity Section */}
                <div className={`mb-4 p-4 rounded-2xl border transition-all ${theme === 'light' ? 'bg-slate-50 border-slate-200 shadow-sm' : 'bg-slate-950/40 border-slate-800/50 shadow-inner'}`}>
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <div className={`w-1 h-4 rounded-full transition-colors ${theme === 'light' ? 'bg-cyan-500 shadow-md' : 'bg-cyan-400'}`}></div>
                            <h3 className={`text-[10px] font-black uppercase tracking-widest transition-colors ${theme === 'light' ? 'text-slate-400' : 'text-slate-300'}`}>Voter Profile</h3>
                        </div>
                        {regNo && !isEditingReg && (
                            <button
                                onClick={() => setIsEditingReg(true)}
                                className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded border transition-all ${theme === 'light' ? 'bg-white border-slate-200 text-slate-500 hover:text-cyan-600' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-cyan-400'}`}
                            >
                                Switch
                            </button>
                        )}
                    </div>

                    {isEditingReg ? (
                        <div className="space-y-3 animate-fade-in">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter your Roll Number"
                                    className="input-field pl-10 h-10 text-sm"
                                    value={regNo}
                                    onChange={(e) => setRegNo(e.target.value)}
                                />
                                <svg className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${theme === 'light' ? 'text-slate-400' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            {regNo && (
                                <button
                                    onClick={() => {
                                        localStorage.setItem('regNo', regNo);
                                        setIsEditingReg(false);
                                    }}
                                    className={`w-full py-2.5 text-sm font-black rounded-xl border transition-all active:scale-[0.98] ${theme === 'light' ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500 hover:text-white'}`}
                                >
                                    Confirm Identity
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg font-black shadow-sm transition-all ${theme === 'light' ? 'bg-white border-slate-100 text-cyan-600' : 'bg-slate-900 border-slate-700 text-cyan-400'}`}>
                                    {regNo.slice(-2)}
                                </div>
                                <div>
                                    <p className={`text-base font-black tracking-tight transition-colors ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{regNo}</p>
                                    <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 transition-colors ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>{localStorage.getItem('name')}</p>
                                </div>
                            </div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${theme === 'light' ? 'bg-cyan-50 border-cyan-100' : 'bg-cyan-400/10 border-cyan-400/20'}`}>
                                <svg className={`w-4 h-4 transition-colors ${theme === 'light' ? 'text-cyan-600' : 'text-cyan-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>

                {/* Options List */}
                <div className="space-y-2 mb-5">
                    <div className="flex items-center justify-between mb-2 px-1">
                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>
                            Available Choices
                        </p>
                        <span className={`text-[9px] font-bold px-2 py-1 rounded border transition-all ${theme === 'light' ? 'text-indigo-600 bg-indigo-50 border-indigo-100' : 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'}`}>
                            {poll.isMultiple ? 'Multiple Selection ' : 'Single Selection'}
                        </span>
                    </div>
                    {poll.options.map((opt, idx) => (
                        <div
                            key={idx}
                            onClick={() => toggleOption(opt)}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 flex items-center justify-between group active:scale-[0.99] ${selectedOptions.includes(opt)
                                ? 'border-cyan-500 bg-cyan-500/5 shadow-[0_0_30px_rgba(6,182,212,0.15)]'
                                : theme === 'light'
                                    ? 'border-slate-100 bg-white hover:border-cyan-200 hover:bg-slate-50/50'
                                    : 'border-slate-800 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-900/60'
                                }`}
                        >
                            <span className={`text-sm font-bold transition-colors duration-300 ${selectedOptions.includes(opt)
                                ? theme === 'light' ? 'text-slate-900' : 'text-white'
                                : theme === 'light' ? 'text-slate-500 group-hover:text-slate-800' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                {opt}
                            </span>
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${selectedOptions.includes(opt) ? 'border-cyan-500 bg-cyan-500 shadow-md shadow-cyan-500/40' : 'border-slate-700 group-hover:border-slate-500'
                                }`}>
                                {selectedOptions.includes(opt) && (
                                    <svg className={`w-4 h-4 stroke-[3] transition-colors ${theme === 'light' ? 'text-white' : 'text-slate-950'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleVote}
                    disabled={selectedOptions.length === 0}
                    className={`btn-primary w-full text-base py-3 rounded-xl disabled:opacity-20 disabled:grayscale transition-all duration-500 shadow-lg ${isModifying ? 'shadow-amber-500/10' : 'shadow-cyan-500/10'}`}
                >
                    {isModifying ? 'Modify Response' : 'Submit Response'}
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isModifying ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        )}
                    </svg>
                </button>

                {isModifying && (
                    <p className={`text-center text-[9px] font-bold uppercase tracking-widest mt-3 animate-fade-in ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`}>
                        ✎ You have already responded — change your selection above
                    </p>
                )}
            </div>

            <footer className={`mt-6 mb-2 text-[9px] font-bold uppercase tracking-[0.3em] animate-fade-in transition-colors ${theme === 'light' ? 'text-slate-400' : 'text-slate-600'}`} style={{ animationDelay: '0.8s' }}>
                End-to-End Encrypted Selection
            </footer>
        </div>
    );
};

export default PollView;
