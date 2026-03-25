import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Application } from '@/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Printer, ArrowRight } from 'lucide-react';
import certificateTemplate from '@/assets/certificate-template.png';

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
          className="bg-white shadow-2xl print:shadow-none relative" 
          style={{ 
            width: '297mm',
            height: '210mm',
            maxWidth: '100%'
          }}
        >
          {/* Certificate Background Template */}
          <img 
            src={certificateTemplate} 
            alt="Certificate Template" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Certificate Content Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center" dir="rtl">
            {/* Student Name */}
            <div className="absolute" style={{ 
              top: '55%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '70%',
              textAlign: 'center'
            }}>
              <h2 className="font-bold" style={{ 
                fontSize: '38px',
                fontFamily: 'Cairo, sans-serif',
                color: '#B8860B',
                textShadow: '0 2px 4px rgba(0,0,0,0.15)',
                letterSpacing: '1px',
                marginBottom: '10px'
              }}>
                {application.full_name}
              </h2>
            </div>

            {/* Level */}
            <div className="absolute" style={{ 
              top: '67%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '70%',
              textAlign: 'center'
            }}>
              <p className="font-semibold" style={{ 
                fontSize: '28px',
                fontFamily: 'Cairo, sans-serif',
                color: '#8B7355',
                textShadow: '0 1px 3px rgba(0,0,0,0.1)',
                letterSpacing: '0.5px'
              }}>
                {getLevelName(application.parts_count)}
              </p>
            </div>

            {/* Rank */}
            {rank && (
              <div className="absolute" style={{ 
                top: '78%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60%',
                textAlign: 'center'
              }}>
                <p className="font-bold" style={{ 
                  fontSize: '32px',
                  fontFamily: 'Cairo, sans-serif',
                  color: '#B8860B',
                  textShadow: '0 2px 4px rgba(0,0,0,0.15)',
                  letterSpacing: '1px'
                }}>
                  المركز {rank}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
