import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Application } from '@/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Printer, ArrowRight, Award, Star } from 'lucide-react';

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
                <SelectItem value="الرابع">الرابع</SelectItem>
                <SelectItem value="الخامس">الخامس</SelectItem>
                <SelectItem value="السادس">السادس</SelectItem>
                <SelectItem value="السابع">السابع</SelectItem>
                <SelectItem value="الثامن">الثامن</SelectItem>
                <SelectItem value="التاسع">التاسع</SelectItem>
                <SelectItem value="العاشر">العاشر</SelectItem>
                <SelectItem value="الحادي عشر">الحادي عشر</SelectItem>
                <SelectItem value="الثاني عشر">الثاني عشر</SelectItem>
                <SelectItem value="الثالث عشر">الثالث عشر</SelectItem>
                <SelectItem value="الرابع عشر">الرابع عشر</SelectItem>
                <SelectItem value="الخامس عشر">الخامس عشر</SelectItem>
                <SelectItem value="السادس عشر">السادس عشر</SelectItem>
                <SelectItem value="السابع عشر">السابع عشر</SelectItem>
                <SelectItem value="الثامن عشر">الثامن عشر</SelectItem>
                <SelectItem value="التاسع عشر">التاسع عشر</SelectItem>
                <SelectItem value="العشرون">العشرون</SelectItem>
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

      {/* Certificate - A4 Landscape */}
      <div className="min-h-screen bg-slate-100 print:bg-white py-8 print:py-0 flex items-center justify-center">
        <div 
          className="bg-white shadow-2xl print:shadow-none relative overflow-hidden" 
          style={{ 
            width: '297mm',
            height: '210mm',
            maxWidth: '100%'
          }}
          dir="rtl"
        >
          {/* Decorative Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-emerald-50"></div>
          
          {/* Corner Decorations */}
          <div className="absolute top-0 right-0 w-48 h-48 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-amber-600 rounded-bl-full"></div>
          </div>
          <div className="absolute bottom-0 left-0 w-48 h-48 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-amber-600 rounded-tr-full"></div>
          </div>
          
          {/* Border Frame */}
          <div className="absolute inset-8 border-4 border-double" style={{ borderColor: '#B8860B' }}>
            <div className="absolute inset-4 border-2" style={{ borderColor: '#2F855A' }}></div>
          </div>

          {/* Top Decoration */}
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 flex items-center gap-3">
            <Star className="h-8 w-8 text-amber-600" fill="#D4AF37" />
            <Award className="h-12 w-12 text-emerald-700" />
            <Star className="h-8 w-8 text-amber-600" fill="#D4AF37" />
          </div>

          {/* Main Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-20">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2" style={{ 
                background: 'linear-gradient(to right, #2F855A, #38A169, #2F855A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: 'Cairo, sans-serif'
              }}>
                شهادة تقدير
              </h1>
              <div className="w-32 h-1 mx-auto rounded-full" style={{ background: 'linear-gradient(to right, #B8860B, #FFD700, #B8860B)' }}></div>
            </div>

            {/* Body Text */}
            <div className="text-center mb-6 space-y-4">
              <p className="text-xl text-slate-700" style={{ fontFamily: 'Cairo, sans-serif' }}>
                تُقدَّم هذه الشهادة إلى
              </p>
              
              {/* Student Name */}
              <div className="my-8">
                <h2 className="text-5xl font-bold mb-3" style={{ 
                  fontFamily: 'Cairo, sans-serif',
                  background: 'linear-gradient(135deg, #B8860B 0%, #FFD700 50%, #B8860B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 4px 8px rgba(184, 134, 11, 0.3)',
                  letterSpacing: '2px'
                }}>
                  {application.full_name}
                </h2>
                <div className="w-96 mx-auto" style={{ 
                  borderBottom: '3px dotted #B8860B',
                  opacity: 0.5
                }}></div>
              </div>

              <p className="text-lg text-slate-700" style={{ fontFamily: 'Cairo, sans-serif' }}>
                وذلك لاجتيازه اختبار حفظ
              </p>

              {/* Level */}
              <div className="my-6">
                <h3 className="text-3xl font-bold" style={{ 
                  fontFamily: 'Cairo, sans-serif',
                  color: '#2F855A',
                  textShadow: '0 2px 4px rgba(47, 133, 90, 0.2)'
                }}>
                  {getLevelName(application.parts_count)}
                </h3>
                <div className="w-64 mx-auto mt-2" style={{ 
                  borderBottom: '2px dotted #2F855A',
                  opacity: 0.4
                }}></div>
              </div>

              <p className="text-lg text-slate-700" style={{ fontFamily: 'Cairo, sans-serif' }}>
                في مسابقة القرآن الكريم - قرية الحاج حسن جودة
              </p>

              {/* Rank */}
              {rank && (
                <div className="my-6">
                  <div className="inline-block px-8 py-3 rounded-lg" style={{ 
                    background: 'linear-gradient(135deg, #B8860B, #FFD700, #B8860B)',
                    boxShadow: '0 4px 12px rgba(184, 134, 11, 0.3)'
                  }}>
                    <p className="text-3xl font-bold text-white" style={{ 
                      fontFamily: 'Cairo, sans-serif',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                      المركز {rank}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-600" style={{ fontFamily: 'Cairo, sans-serif' }}>
                تاريخ الإصدار: {new Date().toLocaleDateString('ar-EG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Bottom Decoration */}
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-600"></div>
            <Star className="h-6 w-6 text-emerald-600" fill="#2F855A" />
            <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
