
import React, { useState } from 'react';
import { MosqueRecord } from '../types.ts';

interface RecordListProps {
  records: MosqueRecord[];
  isAdmin: boolean;
  onEdit: (record: MosqueRecord) => void;
  onAddNew: () => void;
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'يعتمد': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'مرفوض': return 'bg-red-100 text-red-700 border-red-200';
    case 'معتمد': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'يعاد التقرير': return 'bg-orange-100 text-orange-700 border-orange-200';
    default: return 'bg-slate-100 text-slate-500 border-slate-200';
  }
};

const RecordList: React.FC<RecordListProps> = ({ records, isAdmin, onEdit, onAddNew }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = records.filter(r => 
    r.المسجد?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.label_day?.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6 text-right" dir="rtl">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
             <h1 className="text-2xl font-black text-[#003366]">سجلات الأنشطة الميدانية</h1>
             {isAdmin && <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest mt-1 block">وضع المسؤول مفعل 🔐</span>}
          </div>
          <button onClick={onAddNew} className="p-4 bg-[#0054A6] text-white rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-black text-sm hidden sm:inline">إضافة تقرير</span>
          </button>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن مسجد أو ليلة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-14 pl-4 py-5 bg-white border-2 border-slate-100 rounded-[1.5rem] shadow-sm outline-none focus:border-[#0054A6] transition-all font-bold text-[#003366]"
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-6 text-right">المسجد</th>
                <th className="px-8 py-6 text-right">اليوم / الليلة</th>
                <th className="px-8 py-6 text-center">إجمالي المصلين</th>
                <th className="px-8 py-6 text-center">الحالة</th>
                <th className="px-8 py-6 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredRecords.length > 0 ? filteredRecords.map((record) => (
                <tr key={record.record_id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="font-black text-[#003366] text-lg">{record.المسجد}</div>
                    <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight">{record.mosque_code}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-black text-[#0054A6] bg-[#0054A6]/10 px-4 py-2 rounded-xl">
                      {record.label_day || record.code_day}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="font-black text-slate-700 text-lg tabular-nums">
                      {(Number(record.عدد_المصلين_رجال || 0) + Number(record.عدد_المصلين_نساء || 0)).toLocaleString('ar-SA')}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`text-[10px] font-black px-4 py-1.5 rounded-full border shadow-sm ${getStatusStyle(record.الاعتماد || '')}`}>
                      {record.الاعتماد || 'قيد المراجعة'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button 
                      onClick={() => onEdit(record)} 
                      className={`text-xs font-black px-6 py-2.5 rounded-xl transition-all shadow-sm ${
                        isAdmin ? 'bg-[#003366] text-white hover:bg-[#0054A6]' : 'text-[#0054A6] bg-[#0054A6]/5 hover:bg-[#0054A6]/10 border border-[#0054A6]/10'
                      }`}
                    >
                      {isAdmin ? 'مراجعة واعتماد' : 'تعديل التقرير'}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold">لا توجد سجلات مطابقة للبحث...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecordList;
