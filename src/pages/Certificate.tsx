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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-amber-400 text-xl">جاري التحميل...</div>
      </div>
    );
  }

  const levelName = getLevelName(application.parts_count);

  return (
    <div dir="rtl">
      {/* ── Print Controls ── */}
      <div className="print:hidden bg-slate-800 border-b border-slate-700 py-3 px-6 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <Button onClick={() => navigate('/admin/dashboard')} variant="outline"
            className="border-slate-500 text-slate-200 hover:bg-slate-700 text-sm">
            <ArrowRight className="h-4 w-4 ml-2" />
            العودة للوحة التحكم
          </Button>

          <div className="flex items-center gap-2">
            <Label className="text-slate-300 text-sm font-semibold">المركز:</Label>
            <Select value={rank} onValueChange={setRank}>
              <SelectTrigger className="w-44 bg-slate-700 border-slate-600 text-white text-sm">
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
              className="border-amber-500 text-amber-400 hover:bg-amber-500/10 text-sm">
              حفظ
            </Button>
          </div>

          <Button onClick={() => window.print()}
            className="bg-amber-600 hover:bg-amber-700 text-white text-sm px-5">
            <Printer className="h-4 w-4 ml-2" />
            طباعة الشهادة
          </Button>
        </div>
      </div>

      {/* ── Certificate preview wrapper ── */}
      <div className="min-h-screen bg-slate-900 print:bg-white flex items-center justify-center py-8 print:py-0">
        {/*
          A4 landscape = 297 × 210 mm
          At 96dpi: 297mm ≈ 1122px, 210mm ≈ 794px
        */}
        <div
          className="relative overflow-hidden print:shadow-none shadow-2xl"
          style={{
            width: '297mm',
            height: '210mm',
            maxWidth: '100%',
            /* fallback aspect ratio for screens narrower than 297mm */
            aspectRatio: '297/210',
          }}
        >
          {/* ── BLACK BACKGROUND ── */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg,#080808 0%,#111 50%,#080808 100%)' }} />

          {/* ── OUTER GOLD BORDER ── */}
          <div className="absolute inset-[10px] border-[6px] border-[#C9A84C] pointer-events-none" />
          {/* ── INNER THIN BORDER ── */}
          <div className="absolute inset-[20px] border border-[#E8C96B] pointer-events-none" />
          <div className="absolute inset-[26px] border border-[#C9A84C] opacity-50 pointer-events-none" />

          {/* ── CORNER ORNAMENTS ── */}
          {[
            { top:'12px', right:'12px' },
            { top:'12px', left:'12px' },
            { bottom:'12px', right:'12px' },
            { bottom:'12px', left:'12px' },
          ].map((pos, i) => (
            <div key={i} className="absolute text-[40px] leading-none pointer-events-none"
              style={{ ...pos, color:'#C9A84C', opacity: 0.9, fontFamily:'serif' }}>
              ❧
            </div>
          ))}

          {/* ── SIDE FAINT STARS ── */}
          <div className="absolute text-[80px] leading-none pointer-events-none"
            style={{ top:'50%', right:'26px', transform:'translateY(-50%)', color:'#C9A84C', opacity:0.08, fontFamily:'serif' }}>✦</div>
          <div className="absolute text-[80px] leading-none pointer-events-none"
            style={{ top:'50%', left:'26px', transform:'translateY(-50%)', color:'#C9A84C', opacity:0.08, fontFamily:'serif' }}>✦</div>

          {/* ── TOP BANNER (Bismillah) ── */}
          <div className="absolute left-[32px] right-[32px]"
            style={{ top:'30px', background:'linear-gradient(90deg,#1a1200,#3d2900,#3d2900,#1a1200)', border:'1px solid #C9A84C', padding:'8px 0' }}>
            <p className="text-center font-bold" style={{ fontSize:'28px', color:'#FFD700', fontFamily:'serif', letterSpacing:'2px' }}>
              ﷽
            </p>
          </div>

          {/* ── HORIZONTAL DIVIDER LINE 1 ── */}
          <div className="absolute left-[50px] right-[50px]"
            style={{ top:'90px', height:'1px', background:'linear-gradient(90deg,transparent,#C9A84C,#FFD700,#C9A84C,transparent)' }} />

          {/* ── ORG TITLE ── */}
          <p className="absolute w-full text-center font-bold"
            style={{ top:'100px', fontSize:'18px', color:'#FFD700', fontFamily:'serif', letterSpacing:'1px',
              textShadow:'0 0 8px rgba(255,215,0,0.4)' }}>
            مسابقة القرآن الكريم &mdash; قرية الحاج حسن جودة
          </p>

          {/* ── CENTRAL GOLD ROSETTE ── */}
          <div className="absolute"
            style={{ top:'126px', left:'50%', transform:'translateX(-50%)', width:'60px', height:'60px' }}>
            <div style={{
              width:'60px', height:'60px', borderRadius:'50%',
              background:'radial-gradient(circle,#FFD700 0%,#C9A84C 50%,rgba(180,120,0,0) 100%)',
              border:'2px solid #FFD700',
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 0 16px rgba(255,215,0,0.5)',
            }}>
              <div style={{ width:'42px', height:'42px', borderRadius:'50%', background:'#080808',
                display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ color:'#FFD700', fontSize:'24px', fontFamily:'serif' }}>★</span>
              </div>
            </div>
          </div>

          {/* ── CERTIFICATE TITLE ── */}
          <p className="absolute w-full text-center font-bold"
            style={{ top:'202px', fontSize:'34px', letterSpacing:'6px',
              background:'linear-gradient(90deg,#C9A84C,#FFFFFF,#C9A84C)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              fontFamily:'serif', textShadow:'0 0 20px rgba(255,215,0,0.3)' }}>
            شهادة تقدير
          </p>

          {/* ── DIVIDER 2 ── */}
          <div className="absolute left-[80px] right-[80px]"
            style={{ top:'246px', height:'1px', background:'linear-gradient(90deg,transparent,#C9A84C,#FFD700,#C9A84C,transparent)' }} />

          {/* ── PRESENTED TO ── */}
          <p className="absolute w-full text-center"
            style={{ top:'256px', fontSize:'14px', color:'#aaaaaa', fontFamily:'serif' }}>
            تُقدَّم هذه الشهادة إلى
          </p>

          {/* ── PARTICIPANT NAME ── */}
          <div className="absolute left-[50px] right-[50px]" style={{ top:'276px' }}>
            {/* dotted underline line */}
            <div style={{ borderBottom:'2px dotted #C9A84C', paddingBottom:'4px' }}>
              <p className="text-center font-bold"
                style={{ fontSize:'32px', fontFamily:'serif', letterSpacing:'3px',
                  background:'linear-gradient(90deg,#C9A84C,#FFD700,#C9A84C)',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                  textShadow:'0 0 12px rgba(255,215,0,0.3)' }}>
                {application.full_name}
              </p>
            </div>
          </div>

          {/* ── PARTICIPATION LINE ── */}
          <p className="absolute w-full text-center"
            style={{ top:'332px', fontSize:'14px', color:'#cccccc', fontFamily:'serif' }}>
            لمشاركته في مسابقة القرآن الكريم المباركة — مستوى:
          </p>

          {/* ── LEVEL ── */}
          <div className="absolute left-[80px] right-[80px]" style={{ top:'352px' }}>
            <div style={{ borderBottom:'2px dotted #C9A84C', paddingBottom:'3px' }}>
              <p className="text-center font-bold"
                style={{ fontSize:'22px', fontFamily:'serif', letterSpacing:'2px',
                  background:'linear-gradient(90deg,#C9A84C,#FFD700,#C9A84C)',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                {levelName}
              </p>
            </div>
          </div>

          {/* ── RANK (if set) ── */}
          {rank && rank !== 'none' && (
            <>
              <p className="absolute w-full text-center"
                style={{ top:'390px', fontSize:'13px', color:'#aaaaaa', fontFamily:'serif' }}>
                وحصوله على المركز:
              </p>
              <div className="absolute" style={{ top:'406px', left:'50%', transform:'translateX(-50%)', minWidth:'160px' }}>
                <div style={{ borderBottom:'2px dotted #C9A84C', paddingBottom:'3px' }}>
                  <p className="text-center font-bold"
                    style={{ fontSize:'22px', fontFamily:'serif', letterSpacing:'2px',
                      background:'linear-gradient(90deg,#C9A84C,#FFD700,#C9A84C)',
                      WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                    {rank}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* ── DIVIDER 3 ── */}
          <div className="absolute left-[50px] right-[50px]"
            style={{ top: rank && rank !== 'none' ? '442px' : '400px',
              height:'1px', background:'linear-gradient(90deg,transparent,#C9A84C,#FFD700,#C9A84C,transparent)' }} />

          {/* ── BOTTOM BANNER ── */}
          <div className="absolute left-[32px] right-[32px] bottom-[30px]"
            style={{ background:'linear-gradient(90deg,#1a1200,#3d2900,#3d2900,#1a1200)', border:'1px solid #C9A84C', padding:'8px 16px' }}>
            <p className="text-center font-bold"
              style={{ fontSize:'16px', color:'#FFD700', fontFamily:'serif', letterSpacing:'1px' }}>
              "وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا" — سورة المزمل
            </p>
            <p className="text-center mt-1" style={{ fontSize:'11px', color:'#888', fontFamily:'serif' }}>
              إدارة مسابقة قرية الحاج حسن جودة
            </p>
          </div>
        </div>
      </div>

      {/* ── Print styles ── */}
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 0; }
          body { margin: 0; padding: 0; }
        }
      `}</style>
    </div>
  );
};

export default Certificate;
