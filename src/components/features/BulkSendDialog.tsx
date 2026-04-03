
import { useRef, useState, useEffect, useCallback } from 'react';
import { Application } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { MessageCircle, Send, ChevronRight, ChevronLeft, X, Users, Download } from 'lucide-react';

interface BulkSendDialogProps {
  applications: Application[];
  open: boolean;
  onClose: () => void;
  getLevelName: (parts: number) => string;
}

interface ParticipantGrade {
  id: string;
  score: string;
  rank: string;
  gender: 'male' | 'female';
}

const BulkSendDialog = ({ applications, open, onClose, getLevelName }: BulkSendDialogProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const withWhatsApp = applications.filter(a => a.whatsapp);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [grades, setGrades] = useState<Record<string, ParticipantGrade>>({});
  const [imageReady, setImageReady] = useState(false);

  const current = withWhatsApp[currentIdx];

  const getGrade = (id: string): ParticipantGrade => {
    return grades[id] || { id, score: '', rank: '', gender: 'male' };
  };

  const updateGrade = (field: keyof ParticipantGrade, value: string) => {
    if (!current) return;
    setGrades(prev => ({
      ...prev,
      [current.id]: { ...getGrade(current.id), [field]: value },
    }));
  };

  const drawCard = useCallback(() => {
    if (!current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 900;
    const H = 560;
    canvas.width = W;
    canvas.height = H;

    const g = getGrade(current.id);
    const levelName = getLevelName(current.parts_count);

    // Background
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#064e3b');
    bgGrad.addColorStop(0.45, '#065f46');
    bgGrad.addColorStop(1, '#1a3a2a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 6;
    ctx.strokeRect(18, 18, W - 36, H - 36);
    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, W - 60, H - 60);

    const star = (cx: number, cy: number, size: number) => {
      ctx.save();
      ctx.fillStyle = '#D4AF37';
      ctx.font = `${size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✦', cx, cy);
      ctx.restore();
    };
    star(50, 50, 28); star(W - 50, 50, 28); star(50, H - 50, 28); star(W - 50, H - 50, 28);

    ctx.save(); ctx.font = 'bold 28px serif'; ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('﷽', W / 2, 65); ctx.restore();

    const divGrad = ctx.createLinearGradient(80, 0, W - 80, 0);
    divGrad.addColorStop(0, 'transparent'); divGrad.addColorStop(0.5, '#D4AF37'); divGrad.addColorStop(1, 'transparent');
    ctx.strokeStyle = divGrad; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(80, 90); ctx.lineTo(W - 80, 90); ctx.stroke();

    ctx.save(); ctx.font = 'bold 22px serif'; ctx.fillStyle = '#86efac';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('مسابقة القرآن الكريم - قرية الحاج حسن جودة', W / 2, 120); ctx.restore();

    ctx.save(); ctx.font = 'bold 26px serif'; ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('نتيجة المسابقة', W / 2, 158); ctx.restore();

    ctx.strokeStyle = divGrad; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(120, 178); ctx.lineTo(W - 120, 178); ctx.stroke();

    const drawRow = (icon: string, label: string, value: string, y: number, vc = '#FFD700') => {
      ctx.save(); ctx.font = '20px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(icon, W - 80, y); ctx.restore();
      ctx.save(); ctx.font = 'bold 18px serif'; ctx.fillStyle = '#86efac';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillText(label + ':', W - 108, y); ctx.restore();
      ctx.save(); ctx.font = 'bold 22px serif'; ctx.fillStyle = vc;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(value, W / 2 - 60, y); ctx.restore();
    };

    const nameLabel = g.gender === 'male' ? 'المتسابق الكريم' : 'المتسابقة الكريمة';
    drawRow('👤', nameLabel, current.full_name, 220, '#ffffff');
    drawRow('📖', 'المستوى', levelName, 270, '#86efac');
    drawRow('🏅', 'المركز', g.rank ? `المركز ${g.rank}` : '—', 320, '#FFD700');
    drawRow('📊', 'الدرجة', g.score ? `${g.score} / 100` : '—', 370, '#fbbf24');

    ctx.strokeStyle = divGrad; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(80, 410); ctx.lineTo(W - 80, 410); ctx.stroke();

    ctx.save(); ctx.font = 'italic 17px serif'; ctx.fillStyle = '#86efac';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('جزاكم الله خيرًا على مشاركتكم المباركة وبارك الله في جهودكم', W / 2, 440); ctx.restore();

    ctx.save(); ctx.font = '44px serif'; ctx.fillStyle = 'rgba(212,175,55,0.2)';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('☪', 120, H / 2); ctx.fillText('☪', W - 120, H / 2); ctx.restore();

    ctx.save(); ctx.font = 'bold 15px serif'; ctx.fillStyle = '#6ee7b7';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('إدارة مسابقة قرية الحاج حسن جودة', W / 2, H - 45); ctx.restore();

    setImageReady(true);
  }, [current, grades, getLevelName, getGrade]); // Added getGrade to dependencies

  useEffect(() => {
    if (open && current) {
      setImageReady(false);
      const t = setTimeout(drawCard, 50);
      return () => clearTimeout(t);
    }
  }, [open, currentIdx, grades, drawCard, current]);

  useEffect(() => {
    if (open) { setCurrentIdx(0); setGrades({}); }
  }, [open]);

  const downloadCurrent = () => {
    const canvas = canvasRef.current;
    if (!canvas || !current) return;
    const link = document.createElement('a');
    link.download = `نتيجة-${current.full_name}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success('تم تحميل الصورة');
  };

  const sendWhatsApp = () => {
    if (!current?.whatsapp) return;
    const g = getGrade(current.id);
    const levelName = getLevelName(current.parts_count);
    const pronoun = g.gender === 'male' ? 'الطالب الكريم' : 'الطالبة الكريمة';
    const rankText = g.rank ? `المركز: ${g.rank}` : 'لم يتم تحديد المركز بعد';
    const scoreText = g.score ? `\n📊 الدرجة: ${g.score} / 100` : '';

    const message =
`السلام عليكم ورحمة الله وبركاته

${pronoun}: ${current.full_name}

يسعدنا إبلاغكم بنتيجة مسابقة الحاج حسن جودة للقرآن الكريم:

📖 المستوى: ${levelName}
🏅 ${rankText}${scoreText}

جزاكم الله خيرًا على مشاركتكم المباركة.
إدارة مسابقة قرية الحاج حسن جودة`;

    const phone = current.whatsapp.replace(/[^0-9]/g, '');
    const intlPhone = phone.startsWith('0') ? '2' + phone : phone;
    window.open(`https://wa.me/${intlPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (withWhatsApp.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-emerald-800">إرسال جماعي</DialogTitle>
          </DialogHeader>
          <p className="text-center text-slate-600 py-6">لا يوجد متسابقون بأرقام واتساب مسجّلة</p>
          <Button onClick={onClose} variant="outline" className="w-full">إغلاق</Button>
        </DialogContent>
      </Dialog>
    );
  }

  const g = getGrade(current?.id || '');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full max-h-[95vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-emerald-800 text-xl flex items-center gap-2">
            <Users className="h-6 w-6 text-emerald-600" />
            إرسال جماعي — {currentIdx + 1} / {withWhatsApp.length}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Navigation */}
          <div className="flex items-center justify-between bg-emerald-50 rounded-xl p-3 border border-emerald-200">
            <Button
              onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
              disabled={currentIdx === 0}
              size="sm"
              variant="outline"
              className="gap-1"
            >
              <ChevronRight className="h-4 w-4" />
              السابق
            </Button>
            <div className="text-center">
              <p className="font-bold text-emerald-800 text-lg">{current?.full_name}</p>
              <p className="text-sm text-slate-500">{current?.whatsapp}</p>
            </div>
            <Button
              onClick={() => setCurrentIdx(i => Math.min(withWhatsApp.length - 1, i + 1))}
              disabled={currentIdx === withWhatsApp.length - 1}
              size="sm"
              variant="outline"
              className="gap-1"
            >
              التالي
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentIdx + 1) / withWhatsApp.length) * 100}%` }}
            />
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-sm font-bold text-slate-700">الدرجة (من 100)</Label>
              <Input
                type="number" min="0" max="100" placeholder="85"
                value={g.score}
                onChange={(e) => updateGrade('score', e.target.value)}
                className="h-10 border-2 border-emerald-300 focus:border-emerald-600 rounded-lg"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-bold text-slate-700">المركز</Label>
              <Input
                type="text" placeholder="الأول"
                value={g.rank}
                onChange={(e) => updateGrade('rank', e.target.value)}
                className="h-10 border-2 border-emerald-300 focus:border-emerald-600 rounded-lg"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-bold text-slate-700">النوع</Label>
              <div className="flex gap-1 h-10">
                <button
                  type="button"
                  onClick={() => updateGrade('gender', 'male')}
                  className={`flex-1 rounded-lg border-2 text-sm font-semibold transition-all ${
                    g.gender === 'male' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >ذكر</button>
                <button
                  type="button"
                  onClick={() => updateGrade('gender', 'female')}
                  className={`flex-1 rounded-lg border-2 text-sm font-semibold transition-all ${
                    g.gender === 'female' ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >أنثى</button>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="rounded-xl overflow-hidden border-2 border-emerald-200 shadow-lg">
            <canvas ref={canvasRef} className="w-full" style={{ display: 'block', maxHeight: '280px' }} />
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-3">
            <Button onClick={downloadCurrent} disabled={!imageReady} className="bg-amber-600 hover:bg-amber-700 gap-2">
              <Download className="h-4 w-4" />
              تحميل الصورة
            </Button>
            <Button onClick={sendWhatsApp} className="bg-green-600 hover:bg-green-700 gap-2">
              <Send className="h-4 w-4" />
              إرسال واتساب
            </Button>
            <Button onClick={onClose} variant="outline" className="gap-2 border-2">
              <X className="h-4 w-4" />
              إغلاق
            </Button>
          </div>

          <p className="text-xs text-slate-500 text-center">
            💡 حمّل الصورة أولاً ثم اضغط إرسال واتساب وأرفق الصورة يدوياً
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkSendDialog;
