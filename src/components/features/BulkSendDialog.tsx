import { useRef, useState, useEffect, useCallback } from 'react';
import { Application } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ChevronRight, ChevronLeft, X, Users, Camera, Share2 } from 'lucide-react';

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

const BulkSendDialog = ({ applications, open, onClose, getLevelName }: BulkSendDialogProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const withWhatsApp = applications.filter(a => a.whatsapp);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [grades, setGrades] = useState<Record<string, ParticipantGrade>>({});
  const [imageReady, setImageReady] = useState(false);
  const [capturedFormImage, setCapturedFormImage] = useState<File | null>(null);
  const [sending, setSending] = useState(false);

  const current = withWhatsApp[currentIdx];

  const getGrade = useCallback((id: string): ParticipantGrade => {
    return grades[id] || { id, score: '', rank: 'none', gender: 'male' };
  }, [grades]);

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
    const g = getGrade(current.id);
    const hasRank = g.rank && g.rank !== 'none';
    const H = hasRank ? 560 : 510;
    canvas.width = W;
    canvas.height = H;

    const levelName = getLevelName(current.parts_count);

    // Background
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#064e3b'); bgGrad.addColorStop(0.45, '#065f46'); bgGrad.addColorStop(1, '#1a3a2a');
    ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = '#D4AF37'; ctx.lineWidth = 6; ctx.strokeRect(18, 18, W - 36, H - 36);
    ctx.strokeStyle = '#B8860B'; ctx.lineWidth = 2; ctx.strokeRect(30, 30, W - 60, H - 60);

    const star = (cx: number, cy: number, size: number) => {
      ctx.save(); ctx.fillStyle = '#D4AF37'; ctx.font = `${size}px serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('✦', cx, cy); ctx.restore();
    };
    star(50, 50, 28); star(W - 50, 50, 28); star(50, H - 50, 28); star(W - 50, H - 50, 28);

    ctx.save(); ctx.font = 'bold 28px serif'; ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('﷽', W / 2, 65); ctx.restore();

    const divGrad = ctx.createLinearGradient(80, 0, W - 80, 0);
    divGrad.addColorStop(0, 'transparent'); divGrad.addColorStop(0.5, '#D4AF37'); divGrad.addColorStop(1, 'transparent');
    ctx.strokeStyle = divGrad; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(80, 90); ctx.lineTo(W - 80, 90); ctx.stroke();

    ctx.save(); ctx.font = 'bold 22px serif'; ctx.fillStyle = '#86efac';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('مسابقة القرآن الكريم - قرية الحاج حسن جودة', W / 2, 120); ctx.restore();

    ctx.save(); ctx.font = 'bold 26px serif'; ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('نتيجة المسابقة', W / 2, 158); ctx.restore();

    ctx.strokeStyle = divGrad; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(120, 178); ctx.lineTo(W - 120, 178); ctx.stroke();

    const drawRow = (icon: string, label: string, value: string, y: number, vc = '#FFD700') => {
      ctx.save(); ctx.font = '20px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(icon, W - 80, y); ctx.restore();
      ctx.save(); ctx.font = 'bold 18px serif'; ctx.fillStyle = '#86efac';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillText(label + ':', W - 108, y); ctx.restore();
      ctx.save(); ctx.font = 'bold 22px serif'; ctx.fillStyle = vc;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(value, W / 2 - 60, y); ctx.restore();
    };

    const nameLabel = g.gender === 'male' ? 'المتسابق الكريم' : 'المتسابقة الكريمة';
    drawRow('👤', nameLabel, current.full_name, 220, '#ffffff');
    drawRow('📖', 'المستوى', levelName, 270, '#86efac');
    if (hasRank) {
      drawRow('🏅', 'المركز', `المركز ${g.rank}`, 320, '#FFD700');
      drawRow('📊', 'الدرجة', g.score ? `${g.score} / 100` : '—', 370, '#fbbf24');
    } else {
      drawRow('📊', 'الدرجة', g.score ? `${g.score} / 100` : '—', 320, '#fbbf24');
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
  }, [current, grades, getLevelName, getGrade]);

  useEffect(() => {
    if (open && current) {
      setImageReady(false);
      const t = setTimeout(drawCard, 50);
      return () => clearTimeout(t);
    }
  }, [open, currentIdx, grades, drawCard, current]);

  useEffect(() => {
    if (open) { setCurrentIdx(0); setGrades({}); setCapturedFormImage(null); }
  }, [open]);

  // Camera capture
  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setCapturedFormImage(file); toast.success('تم التقاط صورة الاستمارة'); }
    e.target.value = '';
  };

  // Build message
  const buildMessage = () => {
    if (!current) return '';
    const g = getGrade(current.id);
    const levelName = getLevelName(current.parts_count);
    const pronoun = g.gender === 'male' ? 'الطالب الكريم' : 'الطالبة الكريمة';
    const hasRank = g.rank && g.rank !== 'none';
    const rankLine = hasRank ? `🏅 المركز: ${g.rank}` : '';
    const scoreLine = g.score ? `📊 الدرجة: ${g.score} / 100` : '';
    const details = [rankLine, scoreLine].filter(Boolean).join('\n');

    return `السلام عليكم ورحمة الله وبركاته\n\n${pronoun}: ${current.full_name}\n\nيسعدنا إبلاغكم بنتيجة مسابقة الحاج حسن جودة للقرآن الكريم:\n\n📖 المستوى: ${levelName}\n${details}\n\nجزاكم الله خيرًا على مشاركتكم المباركة.\nإدارة مسابقة قرية الحاج حسن جودة`;
  };

  // Merge card canvas + optional form photo into one tall image
  const buildMergedImage = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const cardCanvas = canvasRef.current;
      if (!cardCanvas) { resolve(null); return; }

      if (!capturedFormImage) {
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

  // Share: merge both images → single file → share or download
  const handleShare = async () => {
    if (!current?.whatsapp) return;
    setSending(true);
    const message = buildMessage();

    const blob = await buildMergedImage();
    if (!blob) { setSending(false); return; }

    const filename = capturedFormImage
      ? `نتيجة-واستمارة-${current.full_name}.png`
      : `نتيجة-${current.full_name}.png`;

    const imageFile = new File([blob], filename, { type: 'image/png' });
    const shareData: ShareData = { text: message, files: [imageFile] };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success('تم مشاركة الصورة عبر واتساب بنجاح');
        setSending(false);
        return;
      }
    } catch (err: unknown) {
      const errorName = (err as Error)?.name;
      if (errorName === 'AbortError') { setSending(false); return; }
    }

    // Fallback: download merged image + open WhatsApp
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    openWaLink(message);
    toast.info('تم تنزيل الصورة — أرفقها في واتساب يدوياً', { duration: 6000 });
    setSending(false);
  };

  const openWaLink = (message: string) => {
    if (!current?.whatsapp) return;
    const phone = current.whatsapp.replace(/[^0-9]/g, '');
    const intlPhone = phone.startsWith('0') ? '2' + phone : phone;
    window.open(`https://wa.me/${intlPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (withWhatsApp.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle className="text-emerald-800">إرسال جماعي</DialogTitle></DialogHeader>
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
            <Button onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} disabled={currentIdx === 0}
              size="sm" variant="outline" className="gap-1">
              <ChevronRight className="h-4 w-4" />السابق
            </Button>
            <div className="text-center">
              <p className="font-bold text-emerald-800 text-lg">{current?.full_name}</p>
              <p className="text-sm text-slate-500">{current?.whatsapp}</p>
            </div>
            <Button onClick={() => setCurrentIdx(i => Math.min(withWhatsApp.length - 1, i + 1))}
              disabled={currentIdx === withWhatsApp.length - 1} size="sm" variant="outline" className="gap-1">
              التالي<ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress */}
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-emerald-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentIdx + 1) / withWhatsApp.length) * 100}%` }} />
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-sm font-bold text-slate-700">الدرجة (من 100)</Label>
              <Input type="number" min="0" max="100" placeholder="85"
                value={g.score} onChange={(e) => updateGrade('score', e.target.value)}
                className="h-10 border-2 border-emerald-300 focus:border-emerald-600 rounded-lg" />
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-bold text-slate-700">المركز</Label>
              <Select value={g.rank || 'none'} onValueChange={(v) => updateGrade('rank', v)}>
                <SelectTrigger className="h-10 border-2 border-emerald-300 focus:border-emerald-600 rounded-lg">
                  <SelectValue placeholder="المركز" />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {RANK_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-bold text-slate-700">النوع</Label>
              <div className="flex gap-1 h-10">
                <button type="button" onClick={() => updateGrade('gender', 'male')}
                  className={`flex-1 rounded-lg border-2 text-sm font-semibold transition-all ${
                    g.gender === 'male' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-300'
                  }`}>ذكر</button>
                <button type="button" onClick={() => updateGrade('gender', 'female')}
                  className={`flex-1 rounded-lg border-2 text-sm font-semibold transition-all ${
                    g.gender === 'female' ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-slate-700 border-slate-300'
                  }`}>أنثى</button>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="rounded-xl overflow-hidden border-2 border-emerald-200 shadow-lg">
            <canvas ref={canvasRef} className="w-full" style={{ display: 'block', maxHeight: '280px' }} />
          </div>

          {/* Captured form indicator */}
          {capturedFormImage && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <Camera className="h-4 w-4 shrink-0" />
              <span className="flex-1">الاستمارة ملتقطة: <strong>{capturedFormImage.name}</strong></span>
              <button onClick={() => setCapturedFormImage(null)} className="text-blue-500 hover:text-blue-700 text-xs underline">إزالة</button>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-3 gap-3">
            <Button onClick={() => cameraInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Camera className="h-4 w-4" />
              {capturedFormImage ? 'إعادة التصوير' : 'تصوير الاستمارة'}
            </Button>
            <Button onClick={handleShare} disabled={!imageReady || sending}
              className="bg-green-600 hover:bg-green-700 gap-2">
              {sending
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Share2 className="h-4 w-4" />
              }
              إرسال واتساب
            </Button>
            <Button onClick={onClose} variant="outline" className="gap-2 border-2">
              <X className="h-4 w-4" />إغلاق
            </Button>
          </div>

          <p className="text-xs text-slate-500 text-center">
            💡 صوّر الاستمارة بالكاميرا ثم اضغط إرسال واتساب — سيتم مشاركة الصورتين معاً تلقائياً
          </p>
        </div>

        {/* Hidden camera input */}
        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment"
          onChange={handleCameraCapture} className="hidden" />
      </DialogContent>
    </Dialog>
  );
};

export default BulkSendDialog;
