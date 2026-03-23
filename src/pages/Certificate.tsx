import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Application } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Printer, ArrowRight, Award, Star, Sparkles } from 'lucide-react';

const Certificate = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [rank, setRank] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login');
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching application:', error);
        toast.error('حدث خطأ في تحميل البيانات');
        navigate('/admin/dashboard');
      } else {
        setApplication(data);
        setRank(data.rank || '');
      }
      setLoading(false);
    };

    if (user) {
      fetchApplication();
    }
  }, [id, user, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveRank = async () => {
    if (!application) return;

    const { error } = await supabase
      .from('applications')
      .update({ rank })
      .eq('id', application.id);

    if (error) {
      console.error('Error saving rank:', error);
      toast.error('حدث خطأ في حفظ المركز');
    } else {
      toast.success('تم حفظ المركز بنجاح');
    }
  };

  if (authLoading || loading || !application) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-emerald-700 text-xl">جاري التحميل...</div>
      </div>
    );
  }

  const getLevelName = (parts: number) => {
    if (parts === 30) return 'القرآن كاملاً';
    if (parts === 20) return 'ثلثي القرآن';
    if (parts === 15) return 'نصف القرآن';
    if (parts === 10) return '10 أجزاء';
    if (parts === 5) return '5 أجزاء';
    if (parts === 3) return '3 أجزاء';
    if (parts === 1) return '1 جزء';
    return `${parts} جزء`;
  };

  return (
    <div>
      {/* Print Controls - Hidden when printing */}
      <div className="print:hidden bg-slate-100 border-b border-slate-300 py-4 px-6 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <Button
            onClick={() => navigate('/admin/dashboard')}
            variant="outline"
            className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
          >
            <ArrowRight className="h-4 w-4 ml-2" />
            العودة للوحة التحكم
          </Button>
          
          <div className="flex items-center gap-3">
            <Label htmlFor="rank">المركز:</Label>
            <Select value={rank} onValueChange={setRank}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="اختر المركز" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="الأول">الأول</SelectItem>
                <SelectItem value="الثاني">الثاني</SelectItem>
                <SelectItem value="الثالث">الثالث</SelectItem>
                <SelectItem value="المشاركة">المشاركة</SelectItem>
                <SelectItem value="التميز">التميز</SelectItem>
                <SelectItem value="الإتقان">الإتقان</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSaveRank} variant="outline">
              حفظ المركز
            </Button>
          </div>

          <Button
            onClick={handlePrint}
            className="bg-emerald-600 hover:bg-emerald-700 text-lg px-6"
          >
            <Printer className="h-5 w-5 ml-2" />
            طباعة الشهادة
          </Button>
        </div>
      </div>

      {/* Certificate A4 */}
      <div className="min-h-screen bg-slate-100 print:bg-white py-8 print:py-0">
        <div 
          className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none relative overflow-hidden" 
          style={{ width: '210mm', height: '297mm' }}
        >
          {/* Decorative Border */}
          <div className="absolute inset-4 border-8 border-double border-emerald-700 rounded-3xl"></div>
          <div className="absolute inset-8 border-4 border-amber-500 rounded-2xl"></div>
          
          {/* Islamic Pattern Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23047857' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          {/* Corner Decorations */}
          <div className="absolute top-12 right-12">
            <Star className="h-16 w-16 text-amber-500" />
          </div>
          <div className="absolute top-12 left-12">
            <Star className="h-16 w-16 text-amber-500" />
          </div>
          <div className="absolute bottom-12 right-12">
            <Sparkles className="h-16 w-16 text-emerald-600" />
          </div>
          <div className="absolute bottom-12 left-12">
            <Sparkles className="h-16 w-16 text-emerald-600" />
          </div>

          <div className="relative h-full flex flex-col items-center justify-center p-16 text-center">
            {/* Bismillah */}
            <div className="mb-6">
              <p className="text-6xl text-emerald-700">﷽</p>
            </div>

            {/* Award Icon */}
            <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-6 rounded-full mb-8 shadow-2xl">
              <Award className="h-24 w-24 text-white" />
            </div>

            {/* Title */}
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-emerald-800 mb-4">شهادة تقدير</h1>
              <div className="w-64 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-4"></div>
              <p className="text-2xl text-emerald-700 font-semibold">مسابقة القرآن الكريم</p>
              <p className="text-xl text-emerald-600">قرية الحاج حسن جودة</p>
            </div>

            {/* Content */}
            <div className="bg-gradient-to-br from-emerald-50 to-amber-50 rounded-2xl p-8 mb-8 border-4 border-emerald-300 shadow-xl max-w-2xl">
              <p className="text-2xl text-slate-700 mb-6 leading-relaxed">
                نشهد بأن المتسابق
              </p>
              
              <div className="bg-white rounded-xl p-6 mb-6 border-2 border-emerald-400 shadow-lg">
                <p className="text-4xl font-bold text-emerald-800">{application.full_name}</p>
              </div>

              <p className="text-xl text-slate-700 mb-4">
                قد شارك في مسابقة حفظ القرآن الكريم
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border-2 border-amber-300">
                  <p className="text-sm text-slate-600 mb-1">المستوى</p>
                  <p className="text-lg font-bold text-emerald-700">{getLevelName(application.parts_count)}</p>
                </div>
                {rank && (
                  <div className="bg-white rounded-lg p-4 border-2 border-amber-300">
                    <p className="text-sm text-slate-600 mb-1">المركز</p>
                    <p className="text-lg font-bold text-amber-600">{rank}</p>
                  </div>
                )}
              </div>

              <p className="text-xl text-slate-700">
                نسأل الله أن يتقبل منه وأن يجعله من حفظة كتابه الكريم
              </p>
            </div>

            {/* Quranic Verse */}
            <div className="bg-emerald-700 rounded-xl p-6 mb-8 max-w-2xl shadow-xl">
              <p className="text-2xl text-amber-200 font-semibold leading-relaxed mb-2">
                "إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ"
              </p>
              <p className="text-emerald-200">سورة الإسراء - آية 9</p>
            </div>

            {/* Footer */}
            <div className="grid grid-cols-2 gap-16 w-full max-w-2xl">
              <div className="text-center">
                <div className="border-t-2 border-slate-400 pt-2 mb-2">
                  <p className="text-slate-700 font-semibold">التاريخ</p>
                </div>
                <p className="text-slate-600">
                  {new Date().toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="text-center">
                <div className="border-t-2 border-slate-400 pt-2 mb-2">
                  <p className="text-slate-700 font-semibold">لجنة المسابقة</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
