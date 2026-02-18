
import React, { useState, useEffect } from 'react';
import { mosqueApi } from './services/api.ts';
import { MosqueRecord, MaintenanceRecord, PhotoRecord, MosqueInfo, DayInfo } from './types.ts';
import RecordList from './components/RecordList.tsx';
import RecordForm from './components/RecordForm.tsx';
import MaintenanceForm from './components/MaintenanceForm.tsx';
import MaintenanceDashboard from './components/MaintenanceDashboard.tsx';
import Dashboard from './components/Dashboard.tsx';
import WelcomePage from './components/WelcomePage.tsx';

type ViewState = 'dashboard' | 'list' | 'form' | 'maintenance' | 'maintenance_list';

const App: React.FC = () => {
  const [isPlatformEntered, setIsPlatformEntered] = useState(false);
  const [view, setView] = useState<ViewState>('dashboard');
  const [records, setRecords] = useState<MosqueRecord[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [photosList, setPhotosList] = useState<PhotoRecord[]>([]);
  const [mosquesList, setMosquesList] = useState<MosqueInfo[]>([]);
  const [daysList, setDaysList] = useState<DayInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState('');
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await mosqueApi.getAll();
      if (response && response.success && response.sheets) {
        setRecords(response.sheets.daily_mosque_report || []);
        setMaintenanceRecords(response.sheets.Maintenance_Report || []);
        setPhotosList(response.sheets.photo || []);
        setMosquesList(response.sheets.mosque || []);
        setDaysList(response.sheets.Dayd || []);
      }
    } catch (error) {
      showNotification('خطأ في تحميل البيانات', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPlatformEntered) {
      fetchData();
    }
  }, [isPlatformEntered]);

  const handleAdminLogin = () => {
    if (adminPassInput === 'admin123') {
      setIsAdmin(true);
      setShowAdminModal(false);
      setAdminPassInput('');
      showNotification('تم تسجيل دخول المسؤول بنجاح', 'success');
    } else {
      showNotification('كلمة المرور غير صحيحة', 'error');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSave = async (data: any) => {
    setLoading(true);
    try {
      const payload = isAdmin ? data : { ...data, الاعتماد: 'قيد المراجعة' };
      const result = await mosqueApi.save(payload);
      if (result.success) {
        showNotification('تم المزامنة بنجاح', 'success');
        setView('dashboard');
        setEditingRecord(null);
        setTimeout(async () => { await fetchData(); }, 1500);
      } else {
        throw new Error('API return success: false');
      }
    } catch (error) {
      showNotification('فشل في الاتصال بالقاعدة أو تحديث الحالة', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    setView('dashboard');
    setEditingRecord(null);
  };

  const approvedRecords = records.filter(r => r.الاعتماد === 'معتمد');

  if (!isPlatformEntered) {
    return <WelcomePage onEnter={() => setIsPlatformEntered(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-['Tajawal'] text-right" dir="rtl">
      {showAdminModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#003366]/60 backdrop-blur-sm" onClick={() => setShowAdminModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-in">
            <div className="text-center space-y-4 mb-8">
              <div className="w-16 h-16 bg-[#C5A059]/10 text-[#C5A059] rounded-2xl flex items-center justify-center text-3xl mx-auto">🔐</div>
              <h2 className="text-2xl font-black text-[#003366]">دخول المسؤول</h2>
              <p className="text-slate-500 text-sm font-bold">يرجى إدخال كلمة المرور للوصول لصلاحيات الاعتماد</p>
            </div>
            <input 
              type="password" 
              value={adminPassInput}
              onChange={(e) => setAdminPassInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              placeholder="كلمة المرور"
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl mb-6 outline-none focus:border-[#0054A6] text-center font-black tracking-widest"
              autoFocus
            />
            <div className="flex gap-4">
              <button onClick={handleAdminLogin} className="flex-1 bg-[#0054A6] text-white py-4 rounded-2xl font-black shadow-lg hover:bg-[#003366] transition-all">دخول</button>
              <button onClick={() => setShowAdminModal(false)} className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-[#003366] text-white shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="bg-white p-2 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
              <img src="https://next.rajhifoundation.org/files/52c533df-1.png" alt="شعار الراجحي" className="h-12" />
            </div>
            <div>
              <h1 className="font-black text-xl leading-none">رمضان 1447هـ</h1>
              <p className="text-[10px] text-[#C5A059] uppercase tracking-[0.2em] font-black mt-1">مؤسسة عبدالله بن عبدالعزيز الراجحي الخيرية</p>
            </div>
          </div>
          <nav className="flex items-center bg-white/10 rounded-2xl p-1 gap-1 border border-white/5">
            <button onClick={() => setView('dashboard')} className={`px-4 sm:px-6 py-2 rounded-xl text-sm font-bold transition-all ${view === 'dashboard' ? 'bg-[#0054A6] text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>الرئيسية</button>
            <button onClick={() => setView('list')} className={`px-4 sm:px-6 py-2 rounded-xl text-sm font-bold transition-all ${view === 'list' ? 'bg-[#0054A6] text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>السجلات</button>
            {!isAdmin ? (
               <button onClick={() => setShowAdminModal(true)} className="px-4 py-2 text-xs font-black bg-[#C5A059] text-[#003366] rounded-xl hover:scale-105 transition-all mr-2">دخول المسؤول</button>
            ) : (
               <button onClick={() => setIsAdmin(false)} className="px-4 py-2 text-xs font-black bg-red-500 text-white rounded-xl hover:scale-105 transition-all mr-2">خروج المسؤول</button>
            )}
          </nav>
        </div>
      </header>

      {notification && (
        <div className={`fixed top-28 left-1/2 transform -translate-x-1/2 z-[60] px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-3 animate-in ${notification.type === 'success' ? 'bg-[#0054A6] text-white' : 'bg-red-600 text-white'}`}>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            {notification.type === 'success' ? '✓' : '!'}
          </div>
          <span className="font-bold">{notification.message}</span>
        </div>
      )}

      {loading && isPlatformEntered && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-xl z-[90] flex flex-col items-center justify-center text-center">
          <div className="relative bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-100 mb-4">
             <div className="w-16 h-16 border-4 border-[#C5A059] border-t-[#0054A6] rounded-full animate-spin"></div>
          </div>
          <p className="text-[#003366] text-xl font-black">جاري المعالجة...</p>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8 animate-in">
        {view === 'dashboard' && (
          <Dashboard 
            records={approvedRecords} 
            mosques={mosquesList} 
            days={daysList} 
            photos={photosList}
            onNavigateToRecords={() => setView('list')} 
            onNavigateToAdd={() => setView('form')}
            onNavigateToMaintenance={() => setView('maintenance_list')}
          />
        )}
        {view === 'list' && (
          <RecordList 
            records={records} 
            isAdmin={isAdmin}
            onEdit={(r) => {setEditingRecord(r); setView('form');}} 
            onAddNew={() => {setEditingRecord(null); setView('form');}} 
          />
        )}
        {view === 'form' && (
          <RecordForm 
            initialData={editingRecord} 
            mosques={mosquesList} 
            days={daysList} 
            isAdmin={isAdmin}
            onSave={handleSave} 
            onCancel={handleCancel} 
          />
        )}
        {view === 'maintenance' && (
          <MaintenanceForm 
            initialData={editingRecord}
            mosques={mosquesList} 
            days={daysList} 
            isAdmin={isAdmin}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
        {view === 'maintenance_list' && (
          <MaintenanceDashboard 
            records={maintenanceRecords}
            isAdmin={isAdmin}
            onEdit={(r) => {setEditingRecord(r); setView('maintenance');}}
            onBack={() => setView('dashboard')}
            onAddNew={() => {setEditingRecord(null); setView('maintenance');}}
          />
        )}
      </main>
    </div>
  );
};

export default App;
