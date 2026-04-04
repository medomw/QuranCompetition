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
import certificateTemplate from '@/assets/certificate-template-new.png';

const RANK_OPTIONS = [
  'الأول','الثاني','الثالث','الرابع','الخامس','السادس','السابع','الثامن','التاسع','العاشر',
  'الحادي عشر','الثاني عشر','الثالث عشر','الرابع عشر','الخامس عشر','السادس عشر',
  'السابع عشر','الثامن عشر','التاسع عشر','العشرون',
];

const getLevelName = (parts: number) => {
  if (parts === 30) return 'القرآن الكريم كاملاً';
  if (parts === 20) return 'ثلثي القرآن الكريم';
  if (parts === 15) return 'نصف القرآن الكريم';
  if (parts === 10) return 'عشرة أجزاء';
  if (parts === 5)  return 'خمسة أجزاء';
  if (parts === 3)  return 'ثلاثة أجزاء';
  if (parts === 1)  return 'جزء واحد';
  return `${parts} جزء`;
};

const Certificate = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [rank, setRank] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate('/admin/login');
  }, [authLoading, user, navigate]);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!id) return;
      const { data, error } = await supabase.from('applications').select('*').eq('id', id).single();
      if (error) {
        toast.error('حدث خطأ في تحميل البيانات');
        navigate('/admin/dashboard');
      } else {
        setApplication(data);
        setRank(data.rank || '');
      }
      setLoading(false);
    };
    if (user) fetchApplication();
  }, [id, user, navigate]);

  const handleSaveRank = async () => {
    if (!application) return;
    const { error } = await supabase.from('applications').update({ rank }).eq('id', application.id);
    if (error) toast.error('حدث خطأ في حفظ المركز');
    else toast.success('تم حفظ المركز بنجاح');
  };

  if (authLoading || loading || !application) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-blue-800 text-xl font-bold">جاري التحميل...</div>
      </div>
    );
  }

  const levelName = getLevelName(application.parts_count);
  const hasRank = rank && rank !== 'none';

  return (
    <div dir="rtl">
      {/* ── Print Controls ── */}
      <div className="print:hidden bg-white border-b border-gray-200 shadow-sm py-3 px-6 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <Button onClick={() => navigate('/admin/dashboard')} variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm gap-2">
            <ArrowRight className="h-4 w-4" />
            العودة للوحة التحكم
          </Button>

          <div className="flex items-center gap-2">
            <Label className="text-gray-700 text-sm font-semibold">المركز:</Label>
            <Select value={rank} onValueChange={setRank}>
              <SelectTrigger className="w-44 border-gray-300 text-sm">
                <SelectValue placeholder="اختر المركز" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectItem value="none">بدون مركز</SelectItem>
                {RANK_OPTIONS.map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSaveRank} size="sm" variant="outline"
              className="border-blue-500 text-blue-700 hover:bg-blue-50 text-sm">
              حفظ
            </Button>
          </div>

          <Button onClick={() => window.print()}
            className="bg-blue-700 hover:bg-blue-800 text-white text-sm px-5 gap-2">
            <Printer className="h-4 w-4" />
            طباعة الشهادة
          </Button>
        </div>
      </div>

      {/* ── Certificate Preview ── */}
      <div className="min-h-screen bg-gray-200 print:bg-white flex items-center justify-center py-8 print:py-0">
        {/*
          A4 landscape = 297 × 210 mm
          Reference canvas: 1587 × 1122 px (approx)
        */}
        <div
          className="relative overflow-hidden print:shadow-none shadow-2xl"
          style={{
            width: '297mm',
            height: '210mm',
            maxWidth: '100%',
          }}
        >
          {/* ── TEMPLATE IMAGE (full background) ── */}
          <img
            src={certificateTemplate}
            alt="certificate background"
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: 'fill' }}
          />

          {/* ── DYNAMIC TEXT OVERLAY ── */}
          {/* All positions use percentage so they scale with the container */}

          {/* Participant name — on the dotted line after "إلى الطالب/ة:" */}
          {/* Image analysis: name area is roughly at 38% top, starting at 28% from right, width ~65% */}
          <div
            className="absolute"
            style={{
              top: '37%',
              right: '28%',
              width: '65%',
              direction: 'rtl',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                fontFamily: '"Noto Naskh Arabic", "Traditional Arabic", serif',
                fontSize: 'clamp(16px, 2.4vw, 30px)',
                fontWeight: '700',
                color: '#1a3a6b',
                letterSpacing: '1px',
              }}
            >
              {application.full_name}
            </span>
          </div>

          {/* Rank — on dotted line after "وحصوله على المركز:" */}
          {/* Rank line is at approx 59% from top */}
          <div
            className="absolute"
            style={{
              top: '58%',
              right: '28%',
              width: '65%',
              direction: 'rtl',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                fontFamily: '"Noto Naskh Arabic", "Traditional Arabic", serif',
                fontSize: 'clamp(13px, 1.9vw, 24px)',
                fontWeight: '700',
                color: '#c49a00',
              }}
            >
              {hasRank ? rank : ''}
            </span>
          </div>

          {/* Level — on dotted line after "في مستوي:" */}
          {/* Level line is at approx 68% from top */}
          <div
            className="absolute"
            style={{
              top: '67.5%',
              right: '28%',
              width: '65%',
              direction: 'rtl',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                fontFamily: '"Noto Naskh Arabic", "Traditional Arabic", serif',
                fontSize: 'clamp(13px, 1.9vw, 24px)',
                fontWeight: '700',
                color: '#c49a00',
              }}
            >
              {levelName}
            </span>
          </div>
        </div>
      </div>

      {/* ── Print Styles ── */}
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 0; }
          body { margin: 0; padding: 0; }
          .print\\:hidden { display: none !important; }
          .print\\:bg-white { background: white !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:py-0 { padding-top: 0 !important; padding-bottom: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default Certificate;
