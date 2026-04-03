import { useRef, useState, useEffect, useCallback } from 'react';
import { Application } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { MessageCircle, Download, Send, Camera, X } from 'lucide-react';

interface SendGradeDialogProps {
  app: Application | null;
  open: boolean;
  onClose: () => void;
  getLevelName: (parts: number) => string;
  printUrl?: string;
}

const SendGradeDialog = ({ app, open, onClose, getLevelName, printUrl }: SendGradeDialogProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState('');
  const [rank, setRank] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [imageReady, setImageReady] = useState(false);

  const levelName = app ? getLevelName(app.parts_count) : '';

  const drawCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !app) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 900;
    const H = 560;
    canvas.width = W;
    canvas.height = H;

    // ── Background gradient ──────────────────────────────────────────
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#064e3b');
    bgGrad.addColorStop(0.45, '#065f46');
    bgGrad.addColorStop(1, '#1a3a2a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // ── Outer gold border ────────────────────────────────────────────
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 6;
    ctx.strokeRect(18, 18, W - 36, H - 36);

    // ── Inner thin border ────────────────────────────────────────────
    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, W - 60, H - 60);

    // ── Decorative corner stars ──────────────────────────────────────
    const drawStar = (cx: number, cy: number, size: number) => {
      ctx.save();
      ctx.fillStyle = '#D4AF37';
      ctx.font = `${size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✦', cx, cy);
      ctx.restore();
    };
    drawStar(50, 50, 28);
    drawStar(W - 50, 50, 28);
    drawStar(50, H - 50, 28);
    drawStar(W - 50, H - 50, 28);

    // ── Bismillah ────────────────────────────────────────────────────
    ctx.save();
    ctx.font = 'bold 28px serif';
    ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('﷽', W / 2, 65);
    ctx.restore();

    // ── Divider line ─────────────────────────────────────────────────
    const divGrad = ctx.createLinearGradient(80, 0, W - 80, 0);
    divGrad.addColorStop(0, 'transparent');
    divGrad.addColorStop(0.5, '#D4AF37');
    divGrad.addColorStop(1, 'transparent');
    ctx.strokeStyle = divGrad;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(80, 90);
    ctx.lineTo(W - 80, 90);
    ctx.stroke();

    // ── Competition title ────────────────────────────────────────────
    ctx.save();
    ctx.font = 'bold 22px serif';
    ctx.fillStyle = '#86efac';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('مسابقة القرآن الكريم - قرية الحاج حسن جودة', W / 2, 120);
    ctx.restore();

    // ── Main label ───────────────────────────────────────────────────
    ctx.save();
    ctx.font = 'bold 26px serif';
    ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('نتيجة المسابقة', W / 2, 158);
    ctx.restore();

    // ── Horizontal separator ─────────────────────────────────────────
    ctx.strokeStyle = divGrad;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(120, 178);
    ctx.lineTo(W - 120, 178);
    ctx.stroke();

    // ── Data rows helper ─────────────────────────────────────────────
    const drawRow = (icon: string, label: string, value: string, y: number, valueColor = '#FFD700') => {
      // icon
      ctx.save();
      ctx.font = '20px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(icon, W - 80, y);
      ctx.restore();

      // label
      ctx.save();
      ctx.font = 'bold 18px serif';
      ctx.fillStyle = '#86efac';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(label + ':', W - 108, y);
      ctx.restore();

      // value
      ctx.save();
      ctx.font = 'bold 22px serif';
      ctx.fillStyle = valueColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(value, W / 2 - 60, y);
      ctx.restore();
    };

    const nameLabel = gender === 'male' ? 'المتسابق الكريم' : 'المتسابقة الكريمة';
    drawRow('👤', nameLabel, app.full_name, 220, '#ffffff');
    drawRow('📖', 'المستوى', levelName, 270, '#86efac');
    drawRow('🏅', 'المركز', rank ? `المركز ${rank}` : '—', 320, '#FFD700');
    drawRow('📊', 'الدرجة', score ? `${score} / 100` : '—', 370, '#fbbf24');

    // ── Bottom divider ───────────────────────────────────────────────
    ctx.strokeStyle = divGrad;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(80, 410);
    ctx.lineTo(W - 80, 410);
    ctx.stroke();

    // ── Closing dua ──────────────────────────────────────────────────
    ctx.save();
    ctx.font = 'italic 17px serif';
    ctx.fillStyle = '#86efac';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('جزاكم الله خيرًا على مشاركتكم المباركة وبارك الله في جهودكم', W / 2, 440);
    ctx.restore();

    // ── Moon crescent decoration ─────────────────────────────────────
    ctx.save();
    ctx.font = '44px serif';
    ctx.fillStyle = 'rgba(212,175,55,0.2)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('☪', 120, H / 2);
    ctx.fillText('☪', W - 120, H / 2);
    ctx.restore();

    // ── Footer stamp ─────────────────────────────────────────────────
    ctx.save();
    ctx.font = 'bold 15px serif';
    ctx.fillStyle = '#6ee7b7';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('إدارة مسابقة قرية الحاج حسن جودة', W / 2, H - 45);
    ctx.restore();

    setImageReady(true);
  }, [app, score, rank, gender, levelName]);

  // Redraw whenever inputs change
  useEffect(() => {
    if (open && app) {
      setImageReady(false);
      const timer = setTimeout(drawCard, 50);
      return () => clearTimeout(timer);
    }
  }, [open, app, score, rank, gender, drawCard]);

  // Reset on open
  useEffect(() => {
    if (open) {
      setScore('');
      setRank(app?.rank || '');
      setGender('male');
      setImageReady(false);
    }
  }, [open, app]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `نتيجة-${app?.full_name || 'متسابق'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success('تم تحميل الصورة بنجاح');
  };

  const openWhatsApp = () => {
    if (!app?.whatsapp) {
      toast.error('لا يوجد رقم واتساب لهذا المتسابق');
      return;
    }
    const pronoun = gender === 'male' ? 'الطالب الكريم' : 'الطالبة الكريمة';
    const rankText = rank ? `المركز: ${rank}` : 'لم يتم تحديد المركز بعد';
    const scoreText = score ? `الدرجة: ${score} / 100` : '';

    const message =
`السلام عليكم ورحمة الله وبركاته

${pronoun}: ${app.full_name}

يسعدنا إبلاغكم بنتيجة مسابقة الحاج حسن جودة للقرآن الكريم:

📖 المستوى: ${levelName}
🏅 ${rankText}${scoreText ? '\n📊 ' + scoreText : ''}

جزاكم الله خيرًا على مشاركتكم المباركة،
وبارك الله في جهودكم في حفظ كتابه الكريم.

إدارة مسابقة قرية الحاج حسن جودة`;

    const phone = app.whatsapp.replace(/[^0-9]/g, '');
    const intlPhone = phone.startsWith('0') ? '2' + phone : phone;
    window.open(`https://wa.me/${intlPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const openFormCapture = () => {
    if (!app) return;
    window.open(printUrl || `/admin/print/${app.id}`, '_blank');
    toast.info('افتح صفحة الطباعة ثم التقط صورة شاشة للاستمارة وأرسلها عبر واتساب');
  };

  if (!app) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full max-h-[95vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-emerald-800 text-xl flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-green-600" />
            إرسال النتيجة عبر واتساب — {app.full_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* ── Inputs row ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Score */}
            <div className="space-y-1">
              <Label className="text-sm font-bold text-slate-700">الدرجة (من 100)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="مثال: 85"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="h-11 border-2 border-emerald-300 focus:border-emerald-600 rounded-lg"
              />
            </div>

            {/* Rank */}
            <div className="space-y-1">
              <Label className="text-sm font-bold text-slate-700">المركز</Label>
              <Input
                type="text"
                placeholder="مثال: الأول"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                className="h-11 border-2 border-emerald-300 focus:border-emerald-600 rounded-lg"
              />
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <Label className="text-sm font-bold text-slate-700">النوع</Label>
              <div className="flex gap-2 h-11">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`flex-1 rounded-lg border-2 text-sm font-semibold transition-all ${
                    gender === 'male'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-400'
                  }`}
                >
                  ذكر
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`flex-1 rounded-lg border-2 text-sm font-semibold transition-all ${
                    gender === 'female'
                      ? 'bg-pink-500 text-white border-pink-500'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-pink-400'
                  }`}
                >
                  أنثى
                </button>
              </div>
            </div>
          </div>

          {/* ── Canvas preview ── */}
          <div className="rounded-xl overflow-hidden border-2 border-emerald-200 shadow-lg">
            <canvas
              ref={canvasRef}
              className="w-full"
              style={{ display: 'block', maxHeight: '320px', objectFit: 'contain' }}
            />
          </div>

          {/* ── Action buttons ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Download image */}
            <Button
              onClick={downloadImage}
              disabled={!imageReady}
              className="bg-amber-600 hover:bg-amber-700 text-white flex flex-col items-center gap-1 h-auto py-3"
            >
              <Download className="h-5 w-5" />
              <span className="text-xs">تحميل الصورة</span>
            </Button>

            {/* Send WhatsApp */}
            <Button
              onClick={openWhatsApp}
              disabled={!app.whatsapp}
              className="bg-green-600 hover:bg-green-700 text-white flex flex-col items-center gap-1 h-auto py-3"
              title={app.whatsapp ? '' : 'لا يوجد رقم واتساب'}
            >
              <Send className="h-5 w-5" />
              <span className="text-xs">إرسال واتساب</span>
            </Button>

            {/* Capture form */}
            <Button
              onClick={openFormCapture}
              className="bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center gap-1 h-auto py-3"
            >
              <Camera className="h-5 w-5" />
              <span className="text-xs">تصوير الاستمارة</span>
            </Button>

            {/* Close */}
            <Button
              onClick={onClose}
              variant="outline"
              className="border-2 border-slate-300 flex flex-col items-center gap-1 h-auto py-3"
            >
              <X className="h-5 w-5" />
              <span className="text-xs">إغلاق</span>
            </Button>
          </div>

          {/* ── Tip ── */}
          {!app.whatsapp && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800 text-center">
              ⚠️ هذا المتسابق لم يُسجّل رقم واتساب — يمكنك تحميل الصورة فقط
            </div>
          )}
          {app.whatsapp && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-800 text-center">
              💡 قم بتحميل الصورة أولاً ثم اضغط "إرسال واتساب" — الرسالة ستُفتح وأرسل الصورة يدوياً معها
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendGradeDialog;
