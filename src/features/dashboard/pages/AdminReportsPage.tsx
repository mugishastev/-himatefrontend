import React from 'react';

export const AdminReportsPage: React.FC = () => {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-white mb-2">System Reports</h1>
            <p className="text-slate-400 text-sm mb-8">Generate and export system-wide activity and moderation reports</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'User Growth Report', desc: 'Export detailed CSV of new signups over time.', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
                    { title: 'Message Activity', desc: 'Daily breakdown of messages sent across platform.', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
                    { title: 'Moderation Logs', desc: 'Deleted content and banned user audits.', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
                ].map(report => (
                    <div key={report.title} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors group flex flex-col items-start relative overflow-hidden">
                        <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-5">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={report.icon} />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-white mb-2">{report.title}</h2>
                        <p className="text-sm text-slate-400 mb-8 flex-1">{report.desc}</p>

                        <button className="text-brand font-medium text-sm flex items-center gap-1.5 group-hover:underline">
                            Generate Report
                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-12 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-6">Recent Exports</h2>
                <div className="text-center py-10">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <p className="text-slate-400 font-medium">No recent reports generated</p>
                    <p className="text-sm text-slate-500 mt-1">Generated reports will appear here for 7 days</p>
                </div>
            </div>
        </div>
    );
};
