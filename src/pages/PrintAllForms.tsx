import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Application } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Printer, ArrowRight } from 'lucide-react';

const PrintAllForms = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login');
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    const fetchApplications = async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching applications:', error);
        toast.error('حدث خطأ في تحميل البيانات');
        navigate('/admin/dashboard');
      } else {
        setApplications(data || []);
      }
      setLoading(false);
    };

    if (user) {
      fetchApplications();
    }
  }, [user, navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-emerald-700 text-xl">جاري التحميل...</div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-emerald-700 text-xl mb-4">لا توجد استمارات للطباعة</p>
          <Button onClick={() => navigate('/admin/dashboard')} className="bg-emerald-600 hover:bg-emerald-700">
            العودة للوحة التحكم
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Print Controls - Hidden when printing */}
      <div className="print:hidden bg-slate-100 border-b border-slate-300 py-4 px-6 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            onClick={() => navigate('/admin/dashboard')}
            variant="outline"
            className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
          >
            <ArrowRight className="h-4 w-4 ml-2" />
            العودة للوحة التحكم
          </Button>
          <div className="text-center">
            <p className="text-lg font-bold text-emerald-800">
              إجمالي الاستمارات: {applications.length}
            </p>
          </div>
          <Button
            onClick={handlePrint}
            className="bg-emerald-600 hover:bg-emerald-700 text-lg px-6"
          >
            <Printer className="h-5 w-5 ml-2" />
            طباعة الكل ({applications.length} استمارة)
          </Button>
        </div>
      </div>

      {/* All Applications Forms */}
      <div className="min-h-screen bg-slate-100 print:bg-white py-8 print:py-0">
        {applications.map((application, index) => (
          <div 
            key={application.id} 
            className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none mb-8 print:mb-0" 
            style={{ width: '210mm', height: '297mm', pageBreakAfter: index < applications.length - 1 ? 'always' : 'auto' }}
          >
            <div className="p-8 print:p-12 h-full flex flex-col justify-between">
              {/* Header with Islamic Border */}
              <div className="border-4 border-emerald-700 rounded-lg p-4 mb-6 relative bg-gradient-to-br from-emerald-50 to-white">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-4">
                  <span className="text-emerald-700 text-3xl">﷽</span>
                </div>
                
                <div className="text-center space-y-1 mt-1">
                  <h1 className="text-2xl font-bold text-emerald-800">مسابقة القرآن الكريم</h1>
                  <p className="text-lg text-emerald-700">قرية الحاج حسن جودة</p>
                  <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-2"></div>
                </div>
                
                {/* Decorative corners */}
                <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-400"></div>
                <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-400"></div>
                <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-400"></div>
                <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-400"></div>
              </div>

              {/* Applicant Information */}
              <div className="bg-gradient-to-r from-emerald-50 to-amber-50 border-2 border-emerald-300 rounded-lg p-4 mb-5" dir="rtl">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white rounded-md p-2 border border-emerald-200">
                    <p className="text-xs text-emerald-700 mb-1 font-semibold">الاسم</p>
                    <p className="text-lg font-bold text-emerald-900">{application.full_name}</p>
                  </div>
                  <div className="bg-white rounded-md p-2 border border-emerald-200">
                    <p className="text-xs text-emerald-700 mb-1 font-semibold">السن</p>
                    <p className="text-lg font-bold text-emerald-900">{application.age} سنة</p>
                  </div>
                  <div className="bg-white rounded-md p-2 border border-emerald-200">
                    <p className="text-xs text-emerald-700 mb-1 font-semibold">المستوى</p>
                    <p className="text-lg font-bold text-emerald-900">
                      {application.parts_count} {application.parts_count === 1 ? 'جزء' : application.parts_count === 2 ? 'جزءان' : 'جزء'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Questions Section */}
              <div className="space-y-3 mb-5" dir="rtl">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="border-2 border-emerald-200 rounded-lg p-3 bg-white">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-emerald-800 mb-2 text-right">
                          السؤال {num === 1 ? 'الأول' : num === 2 ? 'الثاني' : num === 3 ? 'الثالث' : num === 4 ? 'الرابع' : 'الخامس'}:
                        </h3>
                        <div className="space-y-2">
                          <div className="border-b-2 border-dotted border-slate-300 h-6"></div>
                          <div className="border-b-2 border-dotted border-slate-300 h-6"></div>
                        </div>
                      </div>
                      <div className="w-20 text-center">
                        <p className="text-xs text-slate-600 mb-1">الدرجة</p>
                        <div className="border-2 border-emerald-400 rounded h-14 flex items-center justify-center bg-emerald-50">
                          <span className="text-xl text-emerald-400 font-bold">/</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Section */}
              <div className="border-t-4 border-amber-500 pt-4" dir="rtl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <p className="text-xs text-slate-600 mb-2 font-semibold">إجمالي الدرجة</p>
                    <div className="border-4 border-emerald-600 rounded-lg h-16 flex items-center justify-center bg-gradient-to-r from-emerald-50 to-amber-50">
                      <span className="text-2xl font-bold text-emerald-800">______ / 100</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-600 mb-2 font-semibold">توقيع لجنة الاختبار</p>
                    <div className="border-2 border-slate-400 rounded-lg h-16 bg-slate-50"></div>
                  </div>
                </div>

                <div className="text-center text-emerald-700 text-sm border-t-2 border-emerald-200 pt-3 mt-4">
                  <p className="font-semibold">"إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ"</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrintAllForms;
