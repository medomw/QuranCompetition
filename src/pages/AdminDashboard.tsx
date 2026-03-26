import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Application, Settings } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { LogOut, Printer, Users, BookOpen, RefreshCw, FileStack, Trash2, Lock, LockOpen, Award, ChevronDown, ChevronUp } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLevelDialogOpen, setDeleteLevelDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [expandedLevels, setExpandedLevels] = useState<{ [key: number]: boolean }>({
    30: true, 20: true, 15: true, 10: true, 5: true, 3: true, 1: true
  });

  const levels = [
    { 
      value: 30, 
      label: 'المستوى الأول - القرآن كاملاً (30 جزء)', 
      headerBg: 'bg-emerald-50',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      buttonBg: 'bg-emerald-600',
      buttonHover: 'hover:bg-emerald-700',
      border: 'border-emerald-500'
    },
    { 
      value: 20, 
      label: 'المستوى الثاني - ثلثي القرآن (20 جزء)', 
      headerBg: 'bg-blue-50',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-800',
      buttonBg: 'bg-blue-600',
      buttonHover: 'hover:bg-blue-700',
      border: 'border-blue-500'
    },
    { 
      value: 15, 
      label: 'المستوى الثالث - نصف القرآن (15 جزء)', 
      headerBg: 'bg-purple-50',
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-800',
      buttonBg: 'bg-purple-600',
      buttonHover: 'hover:bg-purple-700',
      border: 'border-purple-500'
    },
    { 
      value: 10, 
      label: 'المستوى الرابع - 10 أجزاء', 
      headerBg: 'bg-amber-50',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      buttonBg: 'bg-amber-600',
      buttonHover: 'hover:bg-amber-700',
      border: 'border-amber-500'
    },
    { 
      value: 5, 
      label: 'المستوى الخامس - 5 أجزاء', 
      headerBg: 'bg-orange-50',
      badgeBg: 'bg-orange-100',
      badgeText: 'text-orange-800',
      buttonBg: 'bg-orange-600',
      buttonHover: 'hover:bg-orange-700',
      border: 'border-orange-500'
    },
    { 
      value: 3, 
      label: 'المستوى السادس - 3 أجزاء', 
      headerBg: 'bg-rose-50',
      badgeBg: 'bg-rose-100',
      badgeText: 'text-rose-800',
      buttonBg: 'bg-rose-600',
      buttonHover: 'hover:bg-rose-700',
      border: 'border-rose-500'
    },
    { 
      value: 1, 
      label: 'المستوى السابع - 1 جزء', 
      headerBg: 'bg-cyan-50',
      badgeBg: 'bg-cyan-100',
      badgeText: 'text-cyan-800',
      buttonBg: 'bg-cyan-600',
      buttonHover: 'hover:bg-cyan-700',
      border: 'border-cyan-500'
    },
  ];

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login');
    }
  }, [authLoading, user, navigate]);

  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
      toast.error('حدث خطأ في تحميل البيانات');
    } else {
      setApplications(data || []);
    }
    setLoading(false);
  };

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching settings:', error);
    } else {
      setSettings(data);
    }
  };

  useEffect(() => {
    if (user) {
      fetchApplications();
      fetchSettings();
    }
  }, [user]);

  const getApplicationsByLevel = (level: number) => {
    return applications.filter(app => app.parts_count === level);
  };

  const handlePrint = (id: string) => {
    navigate(`/admin/print/${id}`);
  };

  const handlePrintLevel = (level: number) => {
    navigate(`/admin/print-level/${level}`);
  };

  const handleCertificate = (id: string) => {
    navigate(`/admin/certificate/${id}`);
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', selectedId);

    if (error) {
      console.error('Error deleting application:', error);
      toast.error('حدث خطأ في حذف الاستمارة');
    } else {
      toast.success('تم حذف الاستمارة بنجاح');
      fetchApplications();
    }

    setDeleteDialogOpen(false);
    setSelectedId(null);
  };

  const handleDeleteLevel = async () => {
    if (selectedLevel === null) return;

    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('parts_count', selectedLevel);

    if (error) {
      console.error('Error deleting level applications:', error);
      toast.error('حدث خطأ في حذف استمارات المستوى');
    } else {
      toast.success('تم حذف جميع استمارات المستوى بنجاح');
      fetchApplications();
    }

    setDeleteLevelDialogOpen(false);
    setSelectedLevel(null);
  };

  const toggleRegistration = async () => {
    if (!settings) {
      toast.error('لا توجد إعدادات متاحة');
      return;
    }

    const newStatus = !settings.registration_open;
    console.log('Updating registration status to:', newStatus);
    
    const { data, error } = await supabase
      .from('settings')
      .update({ registration_open: newStatus, updated_at: new Date().toISOString() })
      .eq('id', settings.id)
      .select();

    console.log('Update result:', { data, error });

    if (error) {
      console.error('Error updating registration status:', error);
      toast.error('حدث خطأ في تحديث حالة التسجيل: ' + error.message);
    } else {
      toast.success(newStatus ? 'تم فتح التسجيل بنجاح ✓' : 'تم إغلاق التسجيل بنجاح ✓');
      await fetchSettings();
    }
  };

  const toggleLevel = (level: number) => {
    setExpandedLevels(prev => ({
      ...prev,
      [level]: !prev[level]
    }));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-emerald-700 text-xl">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">لوحة تحكم المسؤولين</h1>
                <p className="text-emerald-100 text-sm">مسابقة القرآن الكريم - قرية الحاج حسن جودة</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {settings && (
                <Button
                  onClick={toggleRegistration}
                  variant="outline"
                  className={`${
                    settings.registration_open
                      ? 'bg-red-500 text-white border-red-400 hover:bg-red-600'
                      : 'bg-green-500 text-white border-green-400 hover:bg-green-600'
                  }`}
                >
                  {settings.registration_open ? (
                    <>
                      <Lock className="h-4 w-4 ml-2" />
                      إغلاق التسجيل
                    </>
                  ) : (
                    <>
                      <LockOpen className="h-4 w-4 ml-2" />
                      فتح التسجيل
                    </>
                  )}
                </Button>
              )}
              <Button
                onClick={fetchApplications}
                variant="outline"
                className="bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                <RefreshCw className="h-4 w-4 ml-2" />
                تحديث
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                <LogOut className="h-4 w-4 ml-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">إجمالي المتقدمين</p>
                <p className="text-3xl font-bold text-emerald-700">{applications.length}</p>
              </div>
              <Users className="h-12 w-12 text-emerald-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">تم الطباعة</p>
                <p className="text-3xl font-bold text-amber-700">
                  {applications.filter(app => app.printed).length}
                </p>
              </div>
              <Printer className="h-12 w-12 text-amber-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">حالة التسجيل</p>
                <p className="text-2xl font-bold text-blue-700">
                  {settings?.registration_open ? 'مفتوح' : 'مغلق'}
                </p>
              </div>
              <BookOpen className="h-12 w-12 text-blue-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Levels Sections */}
        {loading ? (
          <div className="p-8 text-center text-slate-600">
            جاري تحميل البيانات...
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-slate-600">
            لا توجد طلبات حتى الآن
          </div>
        ) : (
          <div className="space-y-6">
            {levels.map((level) => {
              const levelApplications = getApplicationsByLevel(level.value);
              const isExpanded = expandedLevels[level.value];
              
              if (levelApplications.length === 0) return null;

              return (
                <div key={level.value} className={`bg-white rounded-lg shadow-md overflow-hidden border-t-4 ${level.border}`}>
                  {/* Level Header */}
                  <div className={`${level.headerBg} px-6 py-4 border-b flex items-center justify-between`}>
                    <div className="flex items-center gap-4 flex-1">
                      <Button
                        onClick={() => toggleLevel(level.value)}
                        variant="ghost"
                        size="sm"
                        className="p-2"
                      >
                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </Button>
                      <h2 className="text-xl font-bold text-slate-800">{level.label}</h2>
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${level.badgeBg} ${level.badgeText}`}>
                        {levelApplications.length} متقدم
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handlePrintLevel(level.value)}
                        size="sm"
                        className={`${level.buttonBg} ${level.buttonHover}`}
                      >
                        <FileStack className="h-4 w-4 ml-1" />
                        طباعة الكل ({levelApplications.length})
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedLevel(level.value);
                          setDeleteLevelDialogOpen(true);
                        }}
                        size="sm"
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="h-4 w-4 ml-1" />
                        حذف الكل
                      </Button>
                    </div>
                  </div>

                  {/* Level Content */}
                  {isExpanded && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-100 border-b-2 border-slate-200">
                          <tr>
                            <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">#</th>
                            <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">الاسم</th>
                            <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">السن</th>
                            <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">تاريخ التسجيل</th>
                            <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">الحالة</th>
                            <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {levelApplications.map((app, index) => (
                            <tr key={app.id} className="hover:bg-slate-50">
                              <td className="px-6 py-4 text-sm text-slate-600">{index + 1}</td>
                              <td className="px-6 py-4 text-sm font-semibold text-slate-800">{app.full_name}</td>
                              <td className="px-6 py-4 text-sm text-slate-600">{app.age} سنة</td>
                              <td className="px-6 py-4 text-sm text-slate-600">
                                {new Date(app.created_at).toLocaleDateString('ar-EG', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </td>
                              <td className="px-6 py-4">
                                {app.printed ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    تم الطباعة
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    في الانتظار
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <Button
                                    onClick={() => handlePrint(app.id)}
                                    size="sm"
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                  >
                                    <Printer className="h-4 w-4 ml-1" />
                                    طباعة
                                  </Button>
                                  <Button
                                    onClick={() => handleCertificate(app.id)}
                                    size="sm"
                                    className="bg-amber-600 hover:bg-amber-700"
                                  >
                                    <Award className="h-4 w-4 ml-1" />
                                    شهادة
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setSelectedId(app.id);
                                      setDeleteDialogOpen(true);
                                    }}
                                    size="sm"
                                    variant="destructive"
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    <Trash2 className="h-4 w-4 ml-1" />
                                    حذف
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف هذه الاستمارة؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
            >
              نعم، احذف
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Level Confirmation Dialog */}
      <Dialog open={deleteLevelDialogOpen} onOpenChange={setDeleteLevelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تأكيد حذف المستوى</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف جميع استمارات هذا المستوى ({selectedLevel && getApplicationsByLevel(selectedLevel).length} استمارة)؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteLevel}
            >
              نعم، احذف الكل
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteLevelDialogOpen(false)}
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
