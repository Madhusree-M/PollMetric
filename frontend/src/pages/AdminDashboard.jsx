import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';
import { useEffect } from 'react';

const AdminDashboard = () => {
    const { theme } = useTheme();
    const [polls, setPolls] = useState([]);
    const [groups, setGroups] = useState([]);
    const [title, setTitle] = useState('');
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [isMultiple, setIsMultiple] = useState(false);
    const [showResults, setShowResults] = useState(true);
    const [selectedGroupId, setSelectedGroupId] = useState('');
    const [showGroupManager, setShowGroupManager] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [groupInput, setGroupInput] = useState('');
    const [loading, setLoading] = useState(true);

    const creatorId = localStorage.getItem('regNo') || 'Admin';

    useEffect(() => {
        fetchPolls();
        fetchGroups();
    }, []);

    const fetchPolls = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/polls?creator=${creatorId}`);
            const data = await res.json();
            if (res.ok) {
                setPolls(data);
            }
        } catch (err) {
            console.error('Error fetching polls');
        } finally {
            setLoading(false);
        }
    };

    const fetchGroups = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/groups?creatorId=${creatorId}`);
            const data = await res.json();
            if (res.ok) setGroups(data);
        } catch (err) {
            console.error('Error fetching groups');
        }
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => setOptions([...options, '']);
    const removeOption = (index) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const handleCreatePoll = async (e) => {
        e.preventDefault();
        const filteredOptions = options.filter(o => o.trim());
        if (filteredOptions.length < 2) {
            toast.warn('Please add at least 2 options');
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/polls', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    question,
                    options: filteredOptions,
                    isMultiple,
                    showResults,
                    creator: creatorId,
                    groupId: selectedGroupId || null
                })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Poll Created Successfully!');
                setTitle(''); setQuestion(''); setOptions(['', '']);
                setIsMultiple(false); setShowResults(true);
                setSelectedGroupId('');
                fetchPolls();
            } else {
                toast.error(data.error);
            }
        } catch (err) {
            toast.error('Error creating poll');
        }
    };

    const handleCreateGroup = async () => {
        if (!newGroupName || !groupInput) return toast.warn('Name and list are required');

        // Parse group input (RollNo Name)
        const students = groupInput.split('\n').map(line => {
            const parts = line.trim().split(/\s+/);
            if (parts.length >= 2) {
                const regNo = parts[0];
                const name = parts.slice(1).join(' ');
                return { regNo, name };
            }
            return null;
        }).filter(Boolean);

        if (students.length === 0) return toast.warn('Invalid student list format. Use: RollNo Name');

        try {
            const res = await fetch('http://localhost:5000/api/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newGroupName,
                    students,
                    creatorId
                })
            });
            if (res.ok) {
                toast.success('Group created successfully!');
                setNewGroupName('');
                setGroupInput('');
                setShowGroupManager(false);
                fetchGroups();
            } else {
                const data = await res.json();
                toast.error(data.error || 'Error creating group');
            }
        } catch (err) {
            toast.error('Error creating group');
        }
    };

    const copyLink = (pollId) => {
        const url = `${window.location.origin}/poll/${pollId}`;
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
    };

    return (
        <div className="min-h-screen px-4 md:px-12 pb-20 animate-fade-in max-w-7xl mx-auto overflow-x-hidden">
            <header className="mb-12 relative pt-8">
                <div className={`absolute -top-32 -left-32 w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full blur-[80px] md:blur-[140px] pointer-events-none transition-all duration-700 ${theme === 'light' ? 'bg-cyan-500/5' : 'bg-cyan-500/10'}`}></div>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-1.5 h-8 rounded-full transition-colors ${theme === 'light' ? 'bg-cyan-600 shadow-[0_0_15px_rgba(8,145,178,0.3)]' : 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]'}`}></div>
                            <h1 className={`text-4xl md:text-6xl font-black tracking-tighter leading-tight transition-colors ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                                Polls <span className={theme === 'light' ? 'text-slate-400 font-medium' : 'text-slate-500 font-medium'}>Administration</span>
                            </h1>
                        </div>
                        <p className={`text-lg max-w-2xl font-medium leading-relaxed transition-colors ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                            Architect and monitor your real-time engagement sessions.
                        </p>
                    </div>
                    <div className={`flex items-center gap-4 p-2 rounded-2xl border backdrop-blur-xl transition-all ${theme === 'light' ? 'bg-white/50 border-slate-200' : 'bg-slate-950/50 border-slate-800/50'}`}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${theme === 'light' ? 'bg-cyan-50 border-cyan-100' : 'bg-cyan-500/10 border-cyan-500/20'}`}>
                            <svg className={`w-6 h-6 transition-colors ${theme === 'light' ? 'text-cyan-600' : 'text-cyan-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div className="pr-4">
                            <p className={`text-[10px] font-black uppercase tracking-widest transition-colors ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>Active Operator</p>
                            <p className={`text-sm font-bold uppercase transition-colors ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{creatorId}</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Create Poll Section */}
                <div className="xl:col-span-5">
                    <div className={`glass-card p-8 md:p-10 sticky top-32 shadow-[0_0_50px_rgba(0,0,0,0.3)] ${theme === 'light' ? 'border-slate-200' : 'border-white/5'}`}>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 rounded-2xl bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                <svg className="w-6 h-6 text-slate-950 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div>
                                <h2 className={`text-2xl font-black tracking-tight transition-colors ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Launch Session</h2>
                                <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 transition-colors ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>Initialize New Poll Registry</p>
                            </div>
                        </div>

                        <form onSubmit={handleCreatePoll} className="space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 ml-1 uppercase tracking-widest">Session Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Design Systems Feedback"
                                        className={`input-field ${theme === 'light' ? 'bg-slate-50 border-slate-200 focus:border-cyan-500' : '!bg-slate-950 !border-slate-800 focus:!border-cyan-500/50'}`}
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 ml-1 uppercase tracking-widest">Enquiry Statement</label>
                                    <textarea
                                        placeholder="Formulate your question..."
                                        className={`input-field min-h-[140px] resize-none ${theme === 'light' ? 'bg-slate-50 border-slate-200 focus:border-cyan-500' : '!bg-slate-950 !border-slate-800 focus:!border-cyan-500/50'}`}
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-800/50 space-y-6">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Response Options</label>
                                    <button
                                        type="button"
                                        onClick={addOption}
                                        className="text-[10px] font-black text-cyan-400 hover:text-white transition-colors uppercase tracking-widest"
                                    >
                                        + Add Option
                                    </button>
                                </div>
                                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {options.map((opt, idx) => (
                                        <div key={idx} className="flex gap-4 group animate-fade-in">
                                            <input
                                                type="text"
                                                placeholder={`Option ${idx + 1}`}
                                                className={`input-field flex-1 transition-all ${theme === 'light' ? 'bg-slate-50 border-slate-200 hover:border-slate-300' : '!bg-slate-950/40 !border-slate-800 group-hover:!border-slate-700'}`}
                                                value={opt}
                                                onChange={(e) => handleOptionChange(idx, e.target.value)}
                                                required
                                            />
                                            {options.length > 2 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeOption(idx)}
                                                    className={`p-4 rounded-2xl transition-all border ${theme === 'light' ? 'text-slate-400 hover:text-rose-500 bg-slate-50 border-slate-200 hover:bg-rose-50 hover:border-rose-200' : 'text-slate-600 hover:text-rose-500 bg-slate-900/30 border-slate-800/50 hover:bg-rose-500/5 hover:border-rose-500/20'}`}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={`pt-8 border-t space-y-6 transition-colors ${theme === 'light' ? 'border-slate-100' : 'border-slate-800/50'}`}>
                                <div className="flex justify-between items-center">
                                    <label className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>Target Audience</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowGroupManager(!showGroupManager)}
                                        className={`text-[10px] font-black px-4 py-2 rounded-xl transition-all border ${showGroupManager ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : (theme === 'light' ? 'bg-cyan-50 text-cyan-600 border-cyan-100 shadow-sm shadow-cyan-600/5' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20')}`}
                                    >
                                        {showGroupManager ? 'Close Registry' : 'Manage Groups'}
                                    </button>
                                </div>

                                {showGroupManager && (
                                    <div className={`p-6 rounded-3xl border mb-6 animate-slide-up space-y-5 ${theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-950/60 border-slate-800'}`}>
                                        <input
                                            type="text"
                                            placeholder="Group Identifier (e.g. B24 CSE-B)"
                                            className={`input-field !py-4 ${theme === 'light' ? 'bg-slate-50 border-slate-200' : '!bg-slate-900'}`}
                                            value={newGroupName}
                                            onChange={(e) => setNewGroupName(e.target.value)}
                                        />
                                        <textarea
                                            placeholder="Member Directory (Format: RollNo Name)"
                                            rows="5"
                                            className={`input-field !text-xs !rounded-2xl font-mono ${theme === 'light' ? 'bg-slate-50 border-slate-200' : '!bg-slate-900'}`}
                                            value={groupInput}
                                            onChange={(e) => setGroupInput(e.target.value)}
                                        ></textarea>
                                        <button
                                            type="button"
                                            onClick={handleCreateGroup}
                                            className="w-full py-4 bg-cyan-500 text-slate-950 rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:bg-cyan-400 active:scale-95 shadow-lg shadow-cyan-500/20"
                                        >
                                            Commit to Database
                                        </button>
                                    </div>
                                )}

                                <select
                                    className={`input-field !py-5 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMUw2IDZMMTIgMSIgc3Ryb2tlPSIjNjQ3NDhCIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:12px_8px] bg-[right_1.5rem_center] bg-no-repeat ${theme === 'light' ? 'bg-slate-50 border-slate-200' : '!bg-slate-950 !border-slate-800'}`}
                                    value={selectedGroupId}
                                    onChange={(e) => setSelectedGroupId(e.target.value)}
                                >
                                    <option value="">Global Broadcast (All Members)</option>
                                    {groups.map(g => (
                                        <option key={g._id} value={g._id}>{g.name} — {g.students.length} Members</option>
                                    ))}
                                </select>
                            </div>

                            <div className={`flex flex-col gap-5 p-6 rounded-3xl border transition-all ${theme === 'light' ? 'bg-slate-50/50 border-slate-200' : 'bg-slate-950/40 border-slate-800/50'}`}>
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <div className="flex flex-col">
                                        <span className={`text-sm font-black transition ${theme === 'light' ? 'text-slate-700 group-hover:text-cyan-600' : 'text-slate-200 group-hover:text-cyan-400'}`}>Multi-Response</span>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 transition ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>Allow multiple selections</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="peer sr-only"
                                            checked={isMultiple}
                                            onChange={(e) => setIsMultiple(e.target.checked)}
                                        />
                                        <div className={`w-12 h-7 rounded-full transition-all relative after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 shadow-inner ${isMultiple ? 'bg-cyan-500' : (theme === 'light' ? 'bg-slate-200' : 'bg-slate-800')}`}></div>
                                    </div>
                                </label>
                                <label className={`flex items-center justify-between cursor-pointer group pt-5 border-t transition-colors ${theme === 'light' ? 'border-slate-200/50' : 'border-slate-800/30'}`}>
                                    <div className="flex flex-col">
                                        <span className={`text-sm font-black transition ${theme === 'light' ? 'text-slate-700 group-hover:text-cyan-600' : 'text-slate-200 group-hover:text-cyan-400'}`}>Live Analytics</span>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 transition ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>Real-time data visualization</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="peer sr-only"
                                            checked={showResults}
                                            onChange={(e) => setShowResults(e.target.checked)}
                                        />
                                        <div className={`w-12 h-7 rounded-full transition-all relative after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 shadow-inner ${showResults ? 'bg-cyan-500' : (theme === 'light' ? 'bg-slate-200' : 'bg-slate-800')}`}></div>
                                    </div>
                                </label>
                            </div>

                            <button type="submit" className={`btn-primary w-full text-xl py-6 rounded-3xl shadow-2xl active:scale-95 transition-all ${theme === 'light' ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/20' : 'text-slate-950 shadow-cyan-500/20'}`}>
                                Deploy Session
                                <svg className="w-6 h-6 ml-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>

                {/* My Polls Section */}
                <div className="xl:col-span-7 space-y-10">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                            <h2 className={`text-2xl font-black tracking-tight transition-colors ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Deployment History</h2>
                        </div>
                        <span className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${theme === 'light' ? 'bg-white border-slate-200 text-slate-400 shadow-sm' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                            {polls.length} Verified Records
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-1 gap-8 pb-32">
                        {loading ? (
                            <div className="py-48 text-center animate-pulse">
                                <p className="text-slate-600 font-black tracking-[0.4em] uppercase text-sm">Synchronizing Master Log...</p>
                            </div>
                        ) : polls.length === 0 ? (
                            <div className="py-40 text-center glass-card border-dashed">
                                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 border shadow-2xl transition-all ${theme === 'light' ? 'bg-cyan-50 border-cyan-100' : 'bg-slate-950 border-slate-800'}`}>
                                    <svg className={`w-12 h-12 transition-colors ${theme === 'light' ? 'text-cyan-400' : 'text-slate-800'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <p className={`text-2xl font-black tracking-tight mb-3 transition-colors ${theme === 'light' ? 'text-slate-700' : 'text-slate-500'}`}>Void Registry</p>
                                <p className={`font-medium max-w-xs mx-auto transition-colors ${theme === 'light' ? 'text-slate-400' : 'text-slate-600'}`}>No active sessions detected under your credentials.</p>
                            </div>
                        ) : (
                            polls.map((p) => (
                                <div key={p._id} className={`glass-card p-10 flex flex-col group animate-slide-up relative overflow-hidden transition-all duration-700 shadow-2xl ${theme === 'light' ? 'border-slate-200 hover:border-cyan-500/30 hover:bg-slate-50/50' : 'border-slate-800/50 hover:border-cyan-500/30 hover:bg-slate-900/40'}`}>
                                    <div className={`absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 blur-[80px] transition-all duration-1000 ${theme === 'light' ? 'bg-cyan-500/[0.03] group-hover:bg-cyan-500/10' : 'bg-cyan-500/5 group-hover:bg-cyan-500/10'}`}></div>
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="flex items-center gap-4">
                                                <span className={`text-[10px] font-black tracking-widest px-4 py-1.5 rounded-xl border transition-all ${theme === 'light' ? 'text-cyan-600 bg-cyan-50 border-cyan-100' : 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20'}`}>SESSION ID #{p.pollId}</span>
                                            </div>
                                            <span className={`text-[10px] font-extrabold uppercase tracking-widest transition-colors ${theme === 'light' ? 'text-slate-400' : 'text-slate-600'}`}>{new Date(p.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                        <h3 className={`text-3xl font-black mb-4 transition-colors duration-500 leading-tight ${theme === 'light' ? 'text-slate-900 group-hover:text-cyan-600' : 'text-white group-hover:text-cyan-400'}`}>{p.title}</h3>
                                        <p className={`text-lg mb-10 line-clamp-2 leading-relaxed font-medium transition-colors ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>{p.question}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-5 mt-auto relative z-10">
                                        <button
                                            onClick={() => copyLink(p.pollId)}
                                            className={`flex-1 min-w-[140px] py-4 rounded-[1.5rem] flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest transition-all duration-300 border group/btn active:scale-95 shadow-xl ${theme === 'light' ? 'bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-900 border-slate-200' : 'bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white border-slate-800/50'}`}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                            </svg>
                                            Share Link
                                        </button>
                                        <Link
                                            to={`/report/${p.pollId}`}
                                            className={`flex-1 min-w-[140px] py-4 rounded-[1.5rem] flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95 shadow-xl ${theme === 'light' ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/20' : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/20'}`}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            Analytics Report
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
