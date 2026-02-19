
import React, { useState } from 'react';
import { MaintenanceRecord } from '../types.ts';

interface MaintenanceDashboardProps {
  records: MaintenanceRecord[];
  isAdmin: boolean;
  onEdit: (record: MaintenanceRecord) => void;
  onBack: () => void;
  onAddNew: () => void;
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'يعتمد': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    case 'مرفوض': return 'bg-red-50 text-red-600 border-red-100';
    case 'معتمد': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    default: return 'bg-slate-50 text-slate-400 border-slate-100';
  }
};

const MaintenanceDashboard: React.FC<MaintenanceDashboardProps> = ({ records, isAdmin, onEdit, onBack, onAddNew }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = records.filter(r => 
    (r.المسجد || '').toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.created_at || b.التاريخ || 0).getTime() - new Date(a.created_at || a.التاريخ || 0).getTime());

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div>
            <h2 className="text-3xl font-black text-[#003366]">لوحة الصيانة والنظافة</h2>
            <p className="text-slate-400 text-sm font-bold">متابعة وإدارة تقارير الصيانة الدورية</p>
          </div>
        </div>
        <button onClick={onAddNew} className="bg-[#0054A6] text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-[#003366] transition-all flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
            تقرير جديد
        </button>
      </div>

      <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="border-b-2 border-slate-100">
              <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-4 py-5">المسجد</th>
                <th className="px-4 py-5">أعمال صيانة</th>
                <th className="px-4 py-5">أعمال نظافة</th>
                <th className="px-4 py-5">الحالة</th>
                <th className="px-4 py-5 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((r, i) => (
                <tr key={r.record_id || i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-5 font-bold text-[#003366]">{r.المسجد || 'غير محدد'}</td>
                  <td className="px-4 py-5 font-black text-slate-600 tabular-nums">{r.أعمال_الصيانة_عدد || 0}</td>
                  <td className="px-4 py-5 font-black text-slate-600 tabular-nums">{r.أعمال_النظافة_عدد || 0}</td>
                  <td className="px-4 py-5">
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full border ${getStatusStyle(r.الاعتماد || '')}`}>
                      {r.الاعتماد || 'قيد المراجعة'}
                    </span>

                  </td>
                  <td className="px-4 py-5 text-center">
                    <button onClick={() => onEdit(r)} className="text-[#0054A6] text-xs font-black bg-[#0054A6]/10 px-4 py-2 rounded-lg hover:bg-[#0054A6]/20 transition-colors">
                      {isAdmin ? 'مراجعة واعتماد' : 'تعديل'}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-slate-400 font-bold">
                     <div className="text-3xl mb-2">🤷‍♂️</div>
                     لا توجد سجلات صيانة لعرضها حالياً.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDashboard;