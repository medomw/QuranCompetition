import { useRef, useState, useEffect, useCallback } from 'react';
import { Application } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { MessageCircle, Send, Camera, X, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SendGradeDialogProps {
  app: Application | null;
  open: boolean;
  onClose: () => void;
  getLevelName: (parts: number) => string;
}

const RANK_OPTIONS = [
  { value: 'none', label: 'لا يوجد' },
  { value: 'الأول', label: 'الأول' },
  { value: 'الثاني', label: 'الثاني' },
  { value: 'الثالث', label: 'الثالث' },
  { value: 'الرابع', label: 'الرابع' },
  { value: 'الخامس', label: 'الخامس' },
  { value: 'السادس', label: 'السادس' },
  { value: 'السابع', label: 'السابع' },
  { value: 'الثامن', label: 'الثامن' },
  { value: 'التاسع', label: 'التاسع' },
  { value: 'العاشر', label: 'العاشر' },
  { value: 'الحادي عشر', label: 'الحادي عشر' },
  { value: 'الثاني عشر', label: 'الثاني عشر' },
  { value: 'الثالث عشر', label: 'الثالث عشر' },
  { value: 'الرابع عشر', label: 'الرابع عشر' },
  { value: 'الخامس عشر', label: 'الخامس عشر' },
  { value: 'السادس عشر', label: 'السادس عشر' },
  { value: 'السابع عشر', label: 'السابع عشر' },
  { value: 'الثامن عشر', label: 'الثامن عشر' },
  { value: 'التاسع عشر', label: 'التاسع عشر' },
  { value: 'العشرون', label: 'العشرون' },
  { value: 'الحادي والعشرون', label: 'الحادي والعشرون' },
  { value: 'الثاني والعشرون', label: 'الثاني والعشرون' },
  { value: 'الثالث والعشرون', label: 'الثالث والعشرون' },
  { value: 'الرابع والعشرون', label: 'الرابع والعشرون' },
  { value: 'الخامس والعشرون', label: 'الخامس والعشرون' },
  { value: 'السادس والعشرون', label: 'السادس والعشرون' },
  { value: 'السابع والعشرون', label: 'السابع والعشرون' },
  { value: 'الثامن والعشرون', label: 'الثامن والعشرون' },
  { value: 'التاسع والعشرون', label: 'التاسع والعشرون' },
  { value: 'الثلاثون', label: 'الثلاثون' },
];

// Upload blob to Supabase Storage and return public URL
const uploadToStorage = async (blob: Blob, filename: string): Promise<string | null> => {
  const path = `cards/${Date.now()}_${filename}`;
  const { error } = await supabase.storage.from('results').upload(path, blob, {
    contentType: 'image/png',
    upsert: true,
  });
  if (error) {
    console.error('Storage upload error:', error);
    return null;
  }
  const { data } = supabase.storage.from('results').getPublicUrl(path);
  return data.publicUrl;
};

const SendGradeDialog = ({ app, open, onClose, getLevelName }: SendGradeDialogProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [score, setScore] = useState('');
  const [rank, setRank] = useState('none');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [imageReady, setImageReady] = useState(false);
  const [capturedFormImage, setCapturedFormImage] = useState<File | null>(null);
  const [sending, setSending] = useState(false);

  const levelName = app ? getLevelName(app.parts_count) : '';
  const hasRank = rank && rank !== 'none';

  const drawCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !app) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Certificate dimensions: A4 landscape ratio
    const W = 1122;
    const H = 794;
    canvas.width = W;
    canvas.height = H;

    // ── Background: deep black with subtle gradient ──
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#0a0a0a');
    bgGrad.addColorStop(0.5, '#111111');
    bgGrad.addColorStop(1, '#080808');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // ── Outer golden border ──
    ctx.strokeStyle = '#C9A84C'; ctx.lineWidth = 10;
    ctx.strokeRect(14, 14, W - 28, H - 28);

    // ── Inner golden border ──
    ctx.strokeStyle = '#E8C96B'; ctx.lineWidth = 2;
    ctx.strokeRect(26, 26, W - 52, H - 52);

    // ── Third thin border ──
    ctx.strokeStyle = '#C9A84C'; ctx.lineWidth = 1;
    ctx.strokeRect(34, 34, W - 68, H - 68);

    // ── Corner ornaments ──
    const drawCornerOrn = (x: number, y: number, flip: boolean) => {
      ctx.save();
      ctx.translate(x, y);
      if (flip) ctx.scale(-1, -1);
      const g = ctx.createLinearGradient(0, 0, 60, 60);
      g.addColorStop(0, '#FFD700'); g.addColorStop(1, '#B8860B');
      ctx.fillStyle = g;
      ctx.font = '52px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('❧', 30, 30);
      ctx.restore();
    };
    drawCornerOrn(20, 20, false);
    drawCornerOrn(W - 20, 20, true);
    drawCornerOrn(20, H - 20, true);
    drawCornerOrn(W - 20, H - 20, false);

    // ── Top golden banner ──
    const topBanner = ctx.createLinearGradient(0, 50, 0, 130);
    topBanner.addColorStop(0, '#1a1200');
    topBanner.addColorStop(0.3, '#3d2900');
    topBanner.addColorStop(0.7, '#3d2900');
    topBanner.addColorStop(1, '#1a1200');
    ctx.fillStyle = topBanner;
    ctx.fillRect(44, 50, W - 88, 80);
    ctx.strokeStyle = '#C9A84C'; ctx.lineWidth = 1.5;
    ctx.strokeRect(44, 50, W - 88, 80);

    // ── Bismillah in top banner ──
    ctx.save();
    const bGrad = ctx.createLinearGradient(W/2 - 100, 0, W/2 + 100, 0);
    bGrad.addColorStop(0, '#C9A84C'); bGrad.addColorStop(0.5, '#FFD700'); bGrad.addColorStop(1, '#C9A84C');
    ctx.fillStyle = bGrad;
    ctx.font = 'bold 38px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('﷽', W / 2, 90);
    ctx.restore();

    // ── Central golden divider line ──
    const mkDivGrad = (y: number) => {
      const d = ctx.createLinearGradient(60, y, W - 60, y);
      d.addColorStop(0, 'transparent'); d.addColorStop(0.2, '#C9A84C');
      d.addColorStop(0.5, '#FFD700'); d.addColorStop(0.8, '#C9A84C'); d.addColorStop(1, 'transparent');
      return d;
    };

    ctx.strokeStyle = mkDivGrad(142); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(60, 142); ctx.lineTo(W - 60, 142); ctx.stroke();

    // ── Organization title ──
    ctx.save();
    const orgGrad = ctx.createLinearGradient(W/2 - 200, 0, W/2 + 200, 0);
    orgGrad.addColorStop(0, '#C9A84C'); orgGrad.addColorStop(0.5, '#FFD700'); orgGrad.addColorStop(1, '#C9A84C');
    ctx.fillStyle = orgGrad;
    ctx.font = 'bold 26px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowColor = '#FFD700'; ctx.shadowBlur = 8;
    ctx.fillText('مسابقة القرآن الكريم — قرية الحاج حسن جودة', W / 2, 175);
    ctx.restore();

    // ── Central rosette / star emblem ──
    const cx = W / 2, ey = 295;
    ctx.save();
    const rGrad = ctx.createRadialGradient(cx, ey, 0, cx, ey, 60);
    rGrad.addColorStop(0, '#FFD700'); rGrad.addColorStop(0.5, '#C9A84C'); rGrad.addColorStop(1, 'rgba(180,120,0,0)');
    ctx.fillStyle = rGrad;
    ctx.beginPath(); ctx.arc(cx, ey, 60, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 2;
    ctx.stroke();
    // Star points
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const x1 = cx + Math.cos(angle) * 62;
      const y1 = ey + Math.sin(angle) * 62;
      const x2 = cx + Math.cos(angle + Math.PI/8) * 48;
      const y2 = ey + Math.sin(angle + Math.PI/8) * 48;
      ctx.save(); ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(cx, ey); ctx.lineTo(x1, y1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, ey); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.restore();
    }
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath(); ctx.arc(cx, ey, 44, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#FFD700'; ctx.font = 'bold 36px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('★', cx, ey);
    ctx.restore();

    // ── Certificate title ──
    ctx.save();
    const titleGrad = ctx.createLinearGradient(W/2 - 150, 0, W/2 + 150, 0);
    titleGrad.addColorStop(0, '#C9A84C'); titleGrad.addColorStop(0.5, '#FFFFFF'); titleGrad.addColorStop(1, '#C9A84C');
    ctx.fillStyle = titleGrad;
    ctx.font = 'bold 46px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowColor = '#FFD700'; ctx.shadowBlur = 16;
    ctx.fillText('شهادة تقدير', W / 2, 375);
    ctx.restore();

    ctx.strokeStyle = mkDivGrad(410); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(120, 410); ctx.lineTo(W - 120, 410); ctx.stroke();

    // ── Participant info ──
    const nameLabel = gender === 'male' ? 'المتسابق الكريم' : 'المتسابقة الكريمة';
    const pronoun = gender === 'male' ? 'له' : 'لها';

    // Presented-to text
    ctx.save();
    ctx.fillStyle = '#aaaaaa'; ctx.font = '20px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(`تُقدَّم هذه الشهادة إلى ${nameLabel}`, W / 2, 440);
    ctx.restore();

    // Name highlighted
    ctx.save();
    const nameGrad = ctx.createLinearGradient(W/2 - 200, 0, W/2 + 200, 0);
    nameGrad.addColorStop(0, '#C9A84C'); nameGrad.addColorStop(0.5, '#FFD700'); nameGrad.addColorStop(1, '#C9A84C');
    ctx.fillStyle = nameGrad;
    ctx.font = 'bold 42px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowColor = '#FFD700'; ctx.shadowBlur = 10;
    ctx.fillText(app.full_name, W / 2, 485);
    ctx.restore();

    // Level line
    ctx.save();
    ctx.fillStyle = '#dddddd'; ctx.font = '22px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(`لمشاركته ${pronoun} في مسابقة القرآن الكريم — مستوى: ${levelName}`, W / 2, 524);
    ctx.restore();

    // Score & Rank pills
    const pillY = 562;
    const pillH = 38;
    const drawPill = (text: string, px: number, pw: number, color: string) => {
      ctx.save();
      const pg = ctx.createLinearGradient(px, pillY, px, pillY + pillH);
      pg.addColorStop(0, color + '44'); pg.addColorStop(1, color + '22');
      ctx.fillStyle = pg;
      ctx.strokeStyle = color; ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(px - pw/2, pillY - pillH/2, pw, pillH, 8);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = color; ctx.font = 'bold 19px serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(text, px, pillY);
      ctx.restore();
    };

    if (score && hasRank) {
      drawPill(`الدرجة: ${score} / 100`, W / 2 - 180, 300, '#FFD700');
      drawPill(`المركز: ${rank}`, W / 2 + 180, 300, '#C9A84C');
    } else if (score) {
      drawPill(`الدرجة: ${score} / 100`, W / 2, 340, '#FFD700');
    } else if (hasRank) {
      drawPill(`المركز: ${rank}`, W / 2, 340, '#C9A84C');
    }

    // ── Bottom golden banner ──
    ctx.strokeStyle = mkDivGrad(600); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(60, 600); ctx.lineTo(W - 60, 600); ctx.stroke();

    const botBanner = ctx.createLinearGradient(0, 618, 0, 680);
    botBanner.addColorStop(0, '#1a1200'); botBanner.addColorStop(0.5, '#3d2900'); botBanner.addColorStop(1, '#1a1200');
    ctx.fillStyle = botBanner;
    ctx.fillRect(44, 618, W - 88, 62);
    ctx.strokeStyle = '#C9A84C'; ctx.lineWidth = 1;
    ctx.strokeRect(44, 618, W - 88, 62);

    // Quranic verse in bottom banner
    ctx.save();
    const vGrad = ctx.createLinearGradient(W/2 - 150, 0, W/2 + 150, 0);
    vGrad.addColorStop(0, '#C9A84C'); vGrad.addColorStop(0.5, '#FFD700'); vGrad.addColorStop(1, '#C9A84C');
    ctx.fillStyle = vGrad;
    ctx.font = 'bold 21px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('"وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا" — سورة المزمل', W / 2, 636);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = '#888888'; ctx.font = '15px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('إدارة مسابقة قرية الحاج حسن جودة', W / 2, 662);
    ctx.restore();

    // ── Side decorative Islamic stars ──
    ['right', 'left'].forEach((side) => {
      const sx = side === 'right' ? 100 : W - 100;
      ctx.save();
      ctx.font = '64px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(201,168,76,0.12)';
      ctx.fillText('✦', sx, H / 2 - 60);
      ctx.fillStyle = 'rgba(201,168,76,0.08)';
      ctx.fillText('✦', sx, H / 2 + 60);
      ctx.restore();
    });

    setImageReady(true);
  }, [app, score, rank, gender, levelName, hasRank]);

  useEffect(() => {
    if (open && app) {
      setImageReady(false);
      const timer = setTimeout(drawCard, 50);
      return () => clearTimeout(timer);
    }
  }, [open, app, score, rank, gender, drawCard]);

  useEffect(() => {
    if (open) {
      setScore('');
      setRank('none');
      setGender('male');
      setImageReady(false);
      setCapturedFormImage(null);
    }
  }, [open, app]);

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCapturedFormImage(file);
      toast.success('تم التقاط صورة الاستمارة بنجاح');
    }
    e.target.value = '';
  };

  // Canvas → Blob
  const getCardBlob = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) { resolve(null); return; }
      canvas.toBlob(resolve, 'image/png');
    });
  };

  // Build WhatsApp message — motivational only, no personal data
  const buildMessage = (imageUrl?: string, formUrl?: string) => {
    const addDownload = (url: string, name: string) =>
      `${url}?download=${encodeURIComponent(name)}`;

    let msg = `السلام عليكم ورحمة الله وبركاته 🌙

نبشّركم بنتيجة مسابقة القرآن الكريم
قرية الحاج حسن جودة 📖

جزاكم الله خيرًا على مشاركتكم المباركة، وبارك الله في جهودكم في حفظ كتابه الكريم 🤲

"وَمَنْ يَتَّقِ اللَّهَ يَجْعَلْ لَهُ مَخْرَجًا"

إدارة مسابقة قرية الحاج حسن جودة`;

    if (imageUrl) msg += `\n\n🖼️ بطاقة النتيجة (اضغط لمشاهدتها وحفظها):\n${addDownload(imageUrl, 'نتيجة_المسابقة.png')}`;
    if (formUrl)  msg += `\n\n📄 صورة الاستمارة (اضغط لمشاهدتها وحفظها):\n${addDownload(formUrl, 'استمارة_المسابقة.png')}`;

    return msg;
  };

  const handleSend = async () => {
    if (!app?.whatsapp) {
      toast.error('لا يوجد رقم واتساب لهذا المتسابق');
      return;
    }
    if (!imageReady) return;

    setSending(true);
    toast.info('جاري رفع الصور...');

    // 1. Upload card image
    const cardBlob = await getCardBlob();
    let cardUrl: string | null = null;
    if (cardBlob) {
      cardUrl = await uploadToStorage(cardBlob, `${app.id}_card.png`);
      if (!cardUrl) toast.error('تعذّر رفع بطاقة النتيجة');
    }

    // 2. Upload form photo if captured
    let formUrl: string | null = null;
    if (capturedFormImage) {
      const formPath = `forms/${Date.now()}_${app.id}_form.png`;
      const { error: formErr } = await supabase.storage.from('results').upload(formPath, capturedFormImage, {
        contentType: capturedFormImage.type,
        upsert: true,
      });
      if (!formErr) {
        const { data } = supabase.storage.from('results').getPublicUrl(formPath);
        formUrl = data.publicUrl;
      } else {
        toast.error('تعذّر رفع صورة الاستمارة');
      }
    }

    // 3. Open WhatsApp with URLs in the message
    const message = buildMessage(cardUrl ?? undefined, formUrl ?? undefined);
    const phone = app.whatsapp.replace(/[^0-9]/g, '');
    const intlPhone = phone.startsWith('0') ? '2' + phone : phone;
    window.open(`https://wa.me/${intlPhone}?text=${encodeURIComponent(message)}`, '_blank');

    toast.success('تم فتح واتساب بالرسالة والروابط');
    setSending(false);
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
          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-sm font-bold text-slate-700">الدرجة (من 100)</Label>
              <Input
                type="number" min="0" max="100" placeholder="مثال: 85"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="h-11 border-2 border-emerald-300 focus:border-emerald-600 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-bold text-slate-700">المركز</Label>
              <Select value={rank} onValueChange={setRank}>
                <SelectTrigger className="h-11 border-2 border-emerald-300 focus:border-emerald-600 rounded-lg">
                  <SelectValue placeholder="اختر المركز" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {RANK_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-bold text-slate-700">النوع</Label>
              <div className="flex gap-2 h-11">
                <button
                  type="button" onClick={() => setGender('male')}
                  className={`flex-1 rounded-lg border-2 text-sm font-semibold transition-all ${
                    gender === 'male' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-400'
                  }`}
                >ذكر</button>
                <button
                  type="button" onClick={() => setGender('female')}
                  className={`flex-1 rounded-lg border-2 text-sm font-semibold transition-all ${
                    gender === 'female' ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-slate-700 border-slate-300 hover:border-pink-400'
                  }`}
                >أنثى</button>
              </div>
            </div>
          </div>

          {/* Canvas preview */}
          <div className="rounded-xl overflow-hidden border-2 border-emerald-200 shadow-lg">
            <canvas ref={canvasRef} className="w-full" style={{ display: 'block', maxHeight: '320px', objectFit: 'contain' }} />
          </div>

          {/* Captured form image indicator */}
          {capturedFormImage && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <Camera className="h-4 w-4 shrink-0" />
              <span className="flex-1">استمارة ملتقطة: <strong>{capturedFormImage.name}</strong></span>
              <button onClick={() => setCapturedFormImage(null)} className="text-blue-500 hover:text-blue-700 text-xs underline">إزالة</button>
            </div>
          )}

          {/* How it works note */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-800 space-y-1">
            <p className="font-bold">⚙️ آلية الإرسال:</p>
            <p>١. يتم رفع الصور تلقائياً إلى الخادم وتحويلها إلى روابط</p>
            <p>٢. تُضاف الروابط داخل رسالة واتساب — المستقبل يضغط الرابط لمشاهدة الصورة</p>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={() => cameraInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center gap-1 h-auto py-3"
            >
              <Camera className="h-5 w-5" />
              <span className="text-xs">{capturedFormImage ? 'إعادة التصوير' : 'تصوير الاستمارة'}</span>
            </Button>

            <Button
              onClick={handleSend}
              disabled={!app.whatsapp || !imageReady || sending}
              className="bg-green-600 hover:bg-green-700 text-white flex flex-col items-center gap-1 h-auto py-3"
            >
              {sending
                ? <Loader2 className="h-5 w-5 animate-spin" />
                : <Send className="h-5 w-5" />
              }
              <span className="text-xs">{sending ? 'جاري الرفع...' : 'إرسال واتساب'}</span>
            </Button>

            <Button
              onClick={onClose}
              variant="outline"
              className="border-2 border-slate-300 flex flex-col items-center gap-1 h-auto py-3"
            >
              <X className="h-5 w-5" />
              <span className="text-xs">إغلاق</span>
            </Button>
          </div>

          {!app.whatsapp && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800 text-center">
              ⚠️ هذا المتسابق لم يُسجّل رقم واتساب
            </div>
          )}
        </div>

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCameraCapture}
          className="hidden"
        />
      </DialogContent>
    </Dialog>
  );
};

export default SendGradeDialog;
