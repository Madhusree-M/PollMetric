import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

const ReportView = () => {
    const { theme } = useTheme();
    const { id } = useParams();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedOption, setExpandedOption] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/reports/${id}`);
                const data = await res.json();
                if (res.ok) setReport(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [id]);

    const handleExport = () => {
        window.open(`http://localhost:5000/api/export/${id}`, '_blank');
    };

    const handleCopy = () => {
        let text = `Poll: ${report.pollTitle}\n`;
        text += `Question: ${report.question}\n`;
        if (report.groupName) text += `Group: ${report.groupName}\n`;
        text += "-----------------------------------\n\n";

        report.options.forEach((opt) => {
            const voters = report.responses
                .filter(r => Array.isArray(r.selectedOption) ? r.selectedOption.includes(opt) : r.selectedOption === opt)
                .sort((a, b) => a.regNo.localeCompare(b.regNo, undefined, { numeric: true }));

            text += `Responded for ${opt} (${voters.length})\n`;
            if (voters.length > 0) {
                voters.forEach(v => text += `${v.regNo} - ${v.name}\n`);
            } else {
                text += "(None)\n";
            }
            text += "\n";
        });

        const sortedNotVoted = [...report.notVoted].sort((a, b) => a.regNo.localeCompare(b.regNo, undefined, { numeric: true }));
        text += `Not responded (${sortedNotVoted.length})\n`;
        if (sortedNotVoted.length > 0) {
            sortedNotVoted.forEach(v => text += `${v.regNo} - ${v.name}\n`);
        } else {
            text += "(None)\n";
        }

        navigator.clipboard.writeText(text);
        toast.success('Report summary copied to clipboard!');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-secondary">Loading Report...</div>;
    if (!report) return <div className="min-h-screen flex items-center justify-center text-danger">Report not found.</div>;

    // Calculate option counts
    const optionStats = report.options.map(opt => {
        const count = report.responses.reduce((acc, curr) => {
            if (Array.isArray(curr.selectedOption)) {
                return acc + (curr.selectedOption.includes(opt) ? 1 : 0);
            }
            return acc + (curr.selectedOption === opt ? 1 : 0);
        }, 0);
        return {
            option: opt,
            count,
            percentage: report.votedCount > 0 ? ((count / report.votedCount) * 100).toFixed(1) : 0
        };
    });

    return (
        <div className="min-h-screen px-4 md:px-6 pb-20 animate-fade-in max-w-7xl mx-auto overflow-x-hidden">
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6 md:mb-8 pt-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`w-1 md:w-1.5 h-6 rounded-full transition-colors ${theme === 'light' ? 'bg-cyan-600' : 'bg-cyan-400'}`}></div>
                        <h1 className={`text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight transition-colors ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                            {report.pollTitle}
                        </h1>
                    </div>
                    <p className={`text-xs md:text-sm flex items-center gap-2 font-medium transition-colors ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse transition-colors ${theme === 'light' ? 'bg-cyan-600' : 'bg-cyan-400'}`}></span>
                        Analytics Report Engine
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                    <button
                        onClick={handleCopy}
                        className={`py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all duration-300 border active:scale-95 shadow-lg flex-1 lg:flex-none ${theme === 'light' ? 'bg-cyan-50 hover:bg-cyan-500 text-cyan-600 hover:text-white border-cyan-100' : 'bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-white border-cyan-500/20'}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copy Info
                    </button>
                    <button
                        onClick={handleExport}
                        className={`py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all duration-300 border active:scale-95 shadow-lg flex-1 lg:flex-none ${theme === 'light' ? 'bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white border-emerald-100' : 'bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border-emerald-500/20'}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Excel
                    </button>
                    <Link to="/admin" className={`py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all duration-300 border active:scale-95 shadow-lg flex-1 lg:flex-none ${theme === 'light' ? 'bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-900 border-slate-200' : 'bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white border-slate-800'}`}>
                        Portal
                    </Link>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="glass-card p-4 md:p-6 animate-slide-up group" style={{ animationDelay: '0.1s' }}>
                    <h3 className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-2 md:mb-3 transition-colors ${theme === 'light' ? 'text-slate-400 group-hover:text-cyan-600' : 'text-slate-500 group-hover:text-cyan-400'}`}>Participation</h3>
                    <p className={`text-2xl md:text-4xl font-black transition-colors ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{report.participationPercentage}%</p>
                    <div className={`w-full h-1 rounded-full mt-3 md:mt-4 overflow-hidden transition-colors ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`}>
                        <div className="h-full bg-cyan-400 transition-all duration-1000 shadow-[0_0_10px_rgba(34,211,238,0.5)]" style={{ width: `${report.participationPercentage}%` }}></div>
                    </div>
                </div>
                <div className="glass-card p-4 md:p-6 animate-slide-up group" style={{ animationDelay: '0.2s' }}>
                    <h3 className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-2 md:mb-3 transition-colors ${theme === 'light' ? 'text-slate-400 group-hover:text-cyan-600' : 'text-slate-500 group-hover:text-cyan-400'}`}>Total Votes</h3>
                    <p className={`text-2xl md:text-4xl font-black transition-colors ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{report.votedCount}</p>
                    <p className={`text-[8px] md:text-[10px] font-bold mt-1 uppercase tracking-widest truncate transition-colors ${theme === 'light' ? 'text-slate-300' : 'text-slate-600'}`}>out of {report.totalStudents}</p>
                </div>
                <div className="glass-card p-4 md:p-6 animate-slide-up group" style={{ animationDelay: '0.3s' }}>
                    <h3 className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-2 md:mb-3 transition-colors ${theme === 'light' ? 'text-slate-400 group-hover:text-rose-600' : 'text-slate-500 group-hover:text-rose-400'}`}>Pending</h3>
                    <p className="text-2xl md:text-4xl font-black text-rose-500">{report.notVoted.length}</p>
                    <p className={`text-[8px] md:text-[10px] font-bold mt-1 uppercase tracking-widest transition-colors ${theme === 'light' ? 'text-slate-300' : 'text-slate-600'}`}>Awaiting</p>
                </div>
                <div className="glass-card p-4 md:p-6 animate-slide-up group" style={{ animationDelay: '0.4s' }}>
                    <h3 className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-2 md:mb-3 transition-colors ${theme === 'light' ? 'text-slate-400 group-hover:text-amber-600' : 'text-slate-500 group-hover:text-amber-400'}`}>Target Group</h3>
                    <p className={`text-sm md:text-xl font-black truncate transition-colors ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                        {report.groupName || 'All Students'}
                    </p>
                    <span className={`inline-block mt-1 text-[7px] md:text-[9px] font-bold py-0.5 px-2 rounded border uppercase tracking-tighter transition-all ${theme === 'light' ? 'bg-slate-50 text-slate-400 border-slate-100' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
                        {report.isMultiple ? 'Multi' : 'Single'} • {report.showResults ? 'Public' : 'Hidden'}
                    </span>
                </div>
            </div>


            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Result Visualization */}
                <div className="xl:col-span-8 space-y-6">
                    <div className={`glass-card p-8 h-full transition-colors ${theme === 'light' ? 'border-slate-100' : 'border-slate-800/50'}`}>
                        <div className="flex justify-between items-center mb-8">
                            <h3 className={`text-xl font-black transition-colors ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Results Distribution</h3>
                            {!report.showResults && (
                                <span className="bg-rose-500/10 text-rose-500 text-[9px] px-2.5 py-1 rounded-lg border border-rose-500/20 uppercase font-black tracking-widest">
                                    Privacy Protected
                                </span>
                            )}
                        </div>

                        <div className="space-y-6 md:space-y-8">
                            {optionStats.map((stat, idx) => {
                                const isExpanded = expandedOption === idx;
                                const voters = report.responses
                                    .filter(r => Array.isArray(r.selectedOption) ? r.selectedOption.includes(stat.option) : r.selectedOption === stat.option)
                                    .sort((a, b) => a.regNo.localeCompare(b.regNo, undefined, { numeric: true }));

                                return (
                                    <div key={idx} className="group">
                                        <div
                                            className="cursor-pointer"
                                            onClick={() => setExpandedOption(isExpanded ? null : idx)}
                                        >
                                            <div className="flex justify-between items-end mb-2 md:mb-3">
                                                <div className="flex items-center gap-2">
                                                    <svg className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''} ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                    <div className="flex flex-col">
                                                        <span className={`text-base md:text-lg font-bold transition-colors tracking-tight truncate max-w-[150px] md:max-w-none ${theme === 'light' ? 'text-slate-700 group-hover:text-cyan-600' : 'text-slate-100 group-hover:text-cyan-400'}`}>{stat.option}</span>
                                                        <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-colors ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>{stat.count} Votes</span>
                                                    </div>
                                                </div>
                                                <span className={`text-lg md:text-xl font-black transition-colors ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{stat.percentage}%</span>
                                            </div>

                                            <div className={`w-full h-3 rounded-full p-0.5 border shadow-inner overflow-hidden transition-colors ${theme === 'light' ? 'bg-slate-100 border-slate-100' : 'bg-slate-950 border-slate-900'}`}>
                                                <div
                                                    className="h-full bg-cyan-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                                                    style={{ width: `${stat.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Expanded voter list */}
                                        {isExpanded && (
                                            <div className={`mt-3 p-4 rounded-xl border animate-fade-in transition-colors ${theme === 'light' ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/60 border-slate-800'}`}>
                                                {voters.length === 0 ? (
                                                    <p className={`text-xs font-bold uppercase tracking-widest text-center py-3 ${theme === 'light' ? 'text-slate-400' : 'text-slate-600'}`}>No respondents</p>
                                                ) : (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {voters.map((v, vi) => (
                                                            <div key={vi} className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-all ${theme === 'light' ? 'bg-white border-slate-100 hover:border-cyan-200' : 'bg-slate-900/50 border-slate-800/50 hover:border-slate-700'}`}>
                                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.4)]"></div>
                                                                <div className="truncate">
                                                                    <span className={`text-xs font-bold tracking-tight ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>{v.regNo}</span>
                                                                    <span className={`text-xs ml-2 ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>{v.name}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Voter Insights */}
                <div className="xl:col-span-4 space-y-10">
                    <div className={`glass-card p-8 overflow-hidden flex flex-col h-[700px] transition-colors ${theme === 'light' ? 'border-slate-100' : 'border-slate-800/50'}`}>
                        <h3 className={`text-2xl font-black mb-8 px-2 transition-colors ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Voter Ledger</h3>
                        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                            {report.responses.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors ${theme === 'light' ? 'bg-slate-50' : 'bg-slate-900'}`}>
                                        <svg className={`w-8 h-8 transition-colors ${theme === 'light' ? 'text-slate-300' : 'text-slate-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className={`font-bold uppercase tracking-widest text-xs transition-colors ${theme === 'light' ? 'text-slate-300' : 'text-slate-600'}`}>No activity logged</p>
                                </div>
                            ) : (
                                report.responses.map((resp, idx) => (
                                    <div key={idx} className={`p-5 rounded-2xl border transition-all duration-300 group/item ${theme === 'light' ? 'bg-slate-50/50 border-slate-100 hover:border-cyan-200' : 'bg-slate-950/40 border-slate-800/50 hover:border-slate-700'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className={`font-extrabold transition-colors ${theme === 'light' ? 'text-slate-900 group-hover/item:text-cyan-600' : 'text-white group-hover/item:text-cyan-400'}`}>{resp.name}</p>
                                                <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-0.5 transition-colors ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>{resp.regNo}</p>
                                            </div>
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {(Array.isArray(resp.selectedOption) ? resp.selectedOption : [resp.selectedOption]).map((opt, i) => (
                                                <span key={i} className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md border transition-all ${theme === 'light' ? 'bg-cyan-50 text-cyan-600 border-cyan-100' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'}`}>
                                                    {opt}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Pending List Section */}
            <div className={`glass-card p-8 mt-10 overflow-hidden relative transition-colors ${theme === 'light' ? 'border-slate-100' : 'border-slate-800/50'}`}>
                <div className={`absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 blur-3xl transition-all ${theme === 'light' ? 'bg-rose-500/[0.03]' : 'bg-rose-500/5'}`}></div>
                <h3 className={`text-xl font-black mb-8 flex items-center gap-4 transition-colors ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                    Non-Respondents
                    <span className="bg-rose-500/10 text-rose-500 text-[10px] px-4 py-1.5 rounded-full border border-rose-500/20 font-black">
                        {report.notVoted.length} Awaiting
                    </span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {report.notVoted.map((stu, idx) => (
                        <div key={idx} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${theme === 'light' ? 'bg-white border-slate-100 hover:bg-slate-50 hover:border-rose-100' : 'bg-slate-950/20 border-slate-800/30 hover:bg-slate-900'}`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500/50 shadow-[0_0_8px_rgba(244,63,94,0.3)]"></div>
                            <div className="truncate">
                                <p className={`text-xs font-black truncate tracking-tight transition-colors ${theme === 'light' ? 'text-slate-500' : 'text-slate-300'}`}>{stu.name}</p>
                                <p className={`text-[9px] font-bold uppercase tracking-tighter transition-colors ${theme === 'light' ? 'text-slate-300' : 'text-slate-600'}`}>{stu.regNo}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportView;
