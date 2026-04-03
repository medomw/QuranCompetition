import { useRef, useState, useEffect, useCallback } from 'react';
import { Application } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { MessageCircle, Send, Camera, X, Share2 } from 'lucide-react';

interface SendGradeDialogProps {
  app: Application | null;
  open: boolean;
  onClose: () => void;
  getLevelName: (parts: number) => string;
  printUrl?: string;
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

    const W = 900;
    const H = hasRank ? 560 : 510;
    canvas.width = W;
    canvas.height = H;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#064e3b');
    bgGrad.addColorStop(0.45, '#065f46');
    bgGrad.addColorStop(1, '#1a3a2a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Borders
    ctx.strokeStyle = '#D4AF37'; ctx.lineWidth = 6;
    ctx.strokeRect(18, 18, W - 36, H - 36);
    ctx.strokeStyle = '#B8860B'; ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, W - 60, H - 60);

    // Corner stars
    const drawStar = (cx: number, cy: number, size: number) => {
      ctx.save(); ctx.fillStyle = '#D4AF37';
      ctx.font = `${size}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('✦', cx, cy); ctx.restore();
    };
    drawStar(50, 50, 28); drawStar(W - 50, 50, 28);
    drawStar(50, H - 50, 28); drawStar(W - 50, H - 50, 28);

    // Bismillah
    ctx.save(); ctx.font = 'bold 28px serif'; ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('﷽', W / 2, 65); ctx.restore();

    // Divider
    const divGrad = ctx.createLinearGradient(80, 0, W - 80, 0);
    divGrad.addColorStop(0, 'transparent'); divGrad.addColorStop(0.5, '#D4AF37'); divGrad.addColorStop(1, 'transparent');
    ctx.strokeStyle = divGrad; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(80, 90); ctx.lineTo(W - 80, 90); ctx.stroke();

    // Title
    ctx.save(); ctx.font = 'bold 22px serif'; ctx.fillStyle = '#86efac';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('مسابقة القرآن الكريم - قرية الحاج حسن جودة', W / 2, 120); ctx.restore();

    ctx.save(); ctx.font = 'bold 26px serif'; ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('نتيجة المسابقة', W / 2, 158); ctx.restore();

    ctx.strokeStyle = divGrad; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(120, 178); ctx.lineTo(W - 120, 178); ctx.stroke();

    // Data rows
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

    const nameLabel = gender === 'male' ? 'المتسابق الكريم' : 'المتسابقة الكريمة';
    drawRow('👤', nameLabel, app.full_name, 220, '#ffffff');
    drawRow('📖', 'المستوى', levelName, 270, '#86efac');
    if (hasRank) {
      drawRow('🏅', 'المركز', `المركز ${rank}`, 320, '#FFD700');
      drawRow('📊', 'الدرجة', score ? `${score} / 100` : '—', 370, '#fbbf24');
    } else {
      drawRow('📊', 'الدرجة', score ? `${score} / 100` : '—', 320, '#fbbf24');
    }

    const bottomY = hasRank ? 410 : 360;
    ctx.strokeStyle = divGrad; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(80, bottomY); ctx.lineTo(W - 80, bottomY); ctx.stroke();

    ctx.save(); ctx.font = 'italic 17px serif'; ctx.fillStyle = '#86efac';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('جزاكم الله خيرًا على مشاركتكم المباركة وبارك الله في جهودكم', W / 2, bottomY + 30); ctx.restore();

    ctx.save(); ctx.font = '44px serif'; ctx.fillStyle = 'rgba(212,175,55,0.2)';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('☪', 120, H / 2); ctx.fillText('☪', W - 120, H / 2); ctx.restore();

    ctx.save(); ctx.font = 'bold 15px serif'; ctx.fillStyle = '#6ee7b7';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('إدارة مسابقة قرية الحاج حسن جودة', W / 2, H - 45); ctx.restore();

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

  // Camera capture handler
  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCapturedFormImage(file);
      toast.success('تم التقاط صورة الاستمارة بنجاح');
    }
    // Reset input so same file can be recaptured
    e.target.value = '';
  };

  // Build WhatsApp message
  const buildMessage = () => {
    const pronoun = gender === 'male' ? 'الطالب الكريم' : 'الطالبة الكريمة';
    const rankLine = hasRank ? `🏅 المركز: ${rank}` : '';
    const scoreLine = score ? `📊 الدرجة: ${score} / 100` : '';
    const details = [rankLine, scoreLine].filter(Boolean).join('\n');

    return `السلام عليكم ورحمة الله وبركاته\n\n${pronoun}: ${app?.full_name}\n\nيسعدنا إبلاغكم بنتيجة مسابقة الحاج حسن جودة للقرآن الكريم:\n\n📖 المستوى: ${levelName}\n${details}\n\nجزاكم الله خيرًا على مشاركتكم المباركة،\nوبارك الله في جهودكم في حفظ كتابه الكريم.\n\nإدارة مسابقة قرية الحاج حسن جودة`;
  };

  // Merge card canvas + optional form photo into one tall image
  const buildMergedImage = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const cardCanvas = canvasRef.current;
      if (!cardCanvas) { resolve(null); return; }

      if (!capturedFormImage) {
        // No form photo — just use card canvas directly
        cardCanvas.toBlob(resolve, 'image/png');
        return;
      }

      const formImg = new Image();
      const formUrl = URL.createObjectURL(capturedFormImage);
      formImg.onload = () => {
        URL.revokeObjectURL(formUrl);
        const W = cardCanvas.width;
        const formH = Math.round((formImg.height / formImg.width) * W);
        const GAP = 20;

        const merged = document.createElement('canvas');
        merged.width = W;
        merged.height = cardCanvas.height + GAP + formH;

        const ctx = merged.getContext('2d')!;
        // Dark separator background
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(0, 0, W, merged.height);

        ctx.drawImage(cardCanvas, 0, 0);
        ctx.drawImage(formImg, 0, cardCanvas.height + GAP, W, formH);

        merged.toBlob(resolve, 'image/png');
      };
      formImg.onerror = () => {
        URL.revokeObjectURL(formUrl);
        cardCanvas.toBlob(resolve, 'image/png');
      };
      formImg.src = formUrl;
    });
  };

  // Send: merge both images → single file → share or download
  const handleShare = async () => {
    if (!app?.whatsapp) {
      toast.error('لا يوجد رقم واتساب لهذا المتسابق');
      return;
    }

    setSending(true);
    const message = buildMessage();

    const blob = await buildMergedImage();
    if (!blob) { setSending(false); return; }

    const filename = capturedFormImage
      ? `نتيجة-واستمارة-${app?.full_name}.png`
      : `نتيجة-${app?.full_name}.png`;

    const imageFile = new File([blob], filename, { type: 'image/png' });
    const shareData: ShareData = { text: message, files: [imageFile] };

    // Try native share (single file — works on mobile)
    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success('تم مشاركة الصورة بنجاح عبر واتساب');
        setSending(false);
        return;
      }
    } catch (err: unknown) {
      const errorName = (err as Error)?.name;
      if (errorName === 'AbortError') { setSending(false); return; }
    }

    // Fallback: download the merged image + open WhatsApp text link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    openWaLink(message);
    toast.info('تم تنزيل الصورة — أرفقها في واتساب يدوياً', { duration: 6000 });
    setSending(false);
  };

  const openWaLink = (message: string) => {
    if (!app?.whatsapp) return;
    const phone = app.whatsapp.replace(/[^0-9]/g, '');
    const intlPhone = phone.startsWith('0') ? '2' + phone : phone;
    window.open(`https://wa.me/${intlPhone}?text=${encodeURIComponent(message)}`, '_blank');
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
            {/* Score */}
            <div className="space-y-1">
              <Label className="text-sm font-bold text-slate-700">الدرجة (من 100)</Label>
              <Input
                type="number" min="0" max="100" placeholder="مثال: 85"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="h-11 border-2 border-emerald-300 focus:border-emerald-600 rounded-lg"
              />
            </div>

            {/* Rank dropdown */}
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

            {/* Gender */}
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
              <span className="flex-1">تم التقاط الاستمارة: <strong>{capturedFormImage.name}</strong></span>
              <button onClick={() => setCapturedFormImage(null)} className="text-blue-500 hover:text-blue-700 text-xs underline">إزالة</button>
            </div>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-3">
            {/* Camera capture */}
            <Button
              onClick={() => cameraInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center gap-1 h-auto py-3"
            >
              <Camera className="h-5 w-5" />
              <span className="text-xs">{capturedFormImage ? 'إعادة التصوير' : 'تصوير الاستمارة'}</span>
            </Button>

            {/* Share / Send */}
            <Button
              onClick={handleShare}
              disabled={!app.whatsapp || !imageReady || sending}
              className="bg-green-600 hover:bg-green-700 text-white flex flex-col items-center gap-1 h-auto py-3"
              title={app.whatsapp ? '' : 'لا يوجد رقم واتساب'}
            >
              {sending
                ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Share2 className="h-5 w-5" />
              }
              <span className="text-xs">إرسال واتساب</span>
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

          {/* Tips */}
          {!app.whatsapp && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800 text-center">
              ⚠️ هذا المتسابق لم يُسجّل رقم واتساب
            </div>
          )}
          {app.whatsapp && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-800 text-center">
              💡 اضغط "تصوير الاستمارة" لالتقاط صورة بالكاميرا، ثم "إرسال واتساب" لإرسال كل شيء دفعةً واحدة
            </div>
          )}
        </div>

        {/* Hidden camera input */}
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
