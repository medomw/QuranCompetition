import { useRef, useState, useEffect, useCallback } from 'react';
import { Application } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ChevronRight, ChevronLeft, X, Users, Camera, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

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

const uploadToStorage = async (blob: Blob, path: string): Promise<string | null> => {
  const { error } = await supabase.storage.from('results').upload(path, blob, { contentType: 'image/png', upsert: true });
  if (error) { console.error('Storage upload error:', error); return null; }
  const { data } = supabase.storage.from('results').getPublicUrl(path);
  return data.publicUrl;
};

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

  const getGrade = useCallback((id: string): ParticipantGrade =>
    grades[id] || { id, score: '', rank: 'none', gender: 'male' }, [grades]);

  const updateGrade = (field: keyof ParticipantGrade, value: string) => {
    if (!current) return;
    setGrades(prev => ({ ...prev, [current.id]: { ...getGrade(current.id), [field]: value } }));
  };

  const drawCard = useCallback(() => {
    if (!current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const g = getGrade(current.id);
    const hasRank = g.rank && g.rank !== 'none';
    const levelName = getLevelName(current.parts_count);

    const W = 1122; const H = 794;
    canvas.width = W; canvas.height = H;

    // Background
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#080808'); bgGrad.addColorStop(0.5, '#111'); bgGrad.addColorStop(1, '#080808');
    ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);

    // Borders
    ctx.strokeStyle = '#C9A84C'; ctx.lineWidth = 10; ctx.strokeRect(14, 14, W - 28, H - 28);
    ctx.strokeStyle = '#E8C96B'; ctx.lineWidth = 2; ctx.strokeRect(26, 26, W - 52, H - 52);
    ctx.strokeStyle = '#C9A84C'; ctx.lineWidth = 1; ctx.strokeRect(34, 34, W - 68, H - 68);

    // Corner ornaments
    const drawCorn = (x: number, y: number, flip: boolean) => {
      ctx.save(); ctx.translate(x, y);
      if (flip) ctx.scale(-1, -1);
      const cg = ctx.createLinearGradient(0, 0, 60, 60);
      cg.addColorStop(0, '#FFD700'); cg.addColorStop(1, '#B8860B');
      ctx.fillStyle = cg; ctx.font = '52px serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('❧', 30, 30); ctx.restore();
    };
    drawCorn(20, 20, false); drawCorn(W - 20, 20, true);
    drawCorn(20, H - 20, true); drawCorn(W - 20, H - 20, false);

    // Top banner
    const topBanner = ctx.createLinearGradient(0, 50, 0, 120);
    topBanner.addColorStop(0, '#1a1200'); topBanner.addColorStop(0.5, '#3d2900'); topBanner.addColorStop(1, '#1a1200');
    ctx.fillStyle = topBanner; ctx.fillRect(44, 48, W - 88, 72);
    ctx.strokeStyle = '#C9A84C'; ctx.lineWidth = 1.5; ctx.strokeRect(44, 48, W - 88, 72);

    ctx.save();
    const bGrad = ctx.createLinearGradient(W/2 - 100, 0, W/2 + 100, 0);
    bGrad.addColorStop(0, '#C9A84C'); bGrad.addColorStop(0.5, '#FFD700'); bGrad.addColorStop(1, '#C9A84C');
    ctx.fillStyle = bGrad; ctx.font = 'bold 34px serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('﷽', W / 2, 84); ctx.restore();

    const mkDiv = (y: number) => {
      const d = ctx.createLinearGradient(60, y, W - 60, y);
      d.addColorStop(0, 'transparent'); d.addColorStop(0.2, '#C9A84C');
      d.addColorStop(0.5, '#FFD700'); d.addColorStop(0.8, '#C9A84C'); d.addColorStop(1, 'transparent');
      return d;
    };
    ctx.strokeStyle = mkDiv(132); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(60, 132); ctx.lineTo(W - 60, 132); ctx.stroke();

    // Org title
    ctx.save();
    const orgGrad = ctx.createLinearGradient(W/2 - 200, 0, W/2 + 200, 0);
    orgGrad.addColorStop(0, '#C9A84C'); orgGrad.addColorStop(0.5, '#FFD700'); orgGrad.addColorStop(1, '#C9A84C');
    ctx.fillStyle = orgGrad; ctx.font = 'bold 24px serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowColor = '#FFD700'; ctx.shadowBlur = 8;
    ctx.fillText('مسابقة القرآن الكريم — قرية الحاج حسن جودة', W / 2, 162); ctx.restore();

    // Rosette
    const cx = W / 2, ey = 268;
    ctx.save();
    const rGrad = ctx.createRadialGradient(cx, ey, 0, cx, ey, 55);
    rGrad.addColorStop(0, '#FFD700'); rGrad.addColorStop(0.5, '#C9A84C'); rGrad.addColorStop(1, 'rgba(180,120,0,0)');
    ctx.fillStyle = rGrad; ctx.beginPath(); ctx.arc(cx, ey, 55, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 2; ctx.stroke();
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      ctx.save(); ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(cx, ey); ctx.lineTo(cx + Math.cos(a) * 57, ey + Math.sin(a) * 57); ctx.stroke(); ctx.restore();
    }
    ctx.fillStyle = '#080808'; ctx.beginPath(); ctx.arc(cx, ey, 40, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#FFD700'; ctx.font = 'bold 30px serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('★', cx, ey); ctx.restore();

    // Card title: بيان درجات
    ctx.save();
    const titleGrad = ctx.createLinearGradient(W/2 - 150, 0, W/2 + 150, 0);
    titleGrad.addColorStop(0, '#C9A84C'); titleGrad.addColorStop(0.5, '#FFFFFF'); titleGrad.addColorStop(1, '#C9A84C');
    ctx.fillStyle = titleGrad; ctx.font = 'bold 46px serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowColor = '#FFD700'; ctx.shadowBlur = 16;
    ctx.fillText('بيان درجات', W / 2, 348); ctx.restore();

    ctx.strokeStyle = mkDiv(380); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(120, 380); ctx.lineTo(W - 120, 380); ctx.stroke();

    const nameLabel = g.gender === 'male' ? 'المتسابق' : 'المتسابقة';

    // Label
    ctx.save(); ctx.fillStyle = '#aaaaaa'; ctx.font = '18px serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(`اسم ${nameLabel}:`, W / 2, 406); ctx.restore();

    // Name with dotted underline
    ctx.save();
    ctx.setLineDash([4, 6]); ctx.strokeStyle = '#C9A84C'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(160, 440); ctx.lineTo(W - 160, 440); ctx.stroke();
    ctx.setLineDash([]);
    const nameGrad = ctx.createLinearGradient(W/2 - 200, 0, W/2 + 200, 0);
    nameGrad.addColorStop(0, '#C9A84C'); nameGrad.addColorStop(0.5, '#FFD700'); nameGrad.addColorStop(1, '#C9A84C');
    ctx.fillStyle = nameGrad; ctx.font = 'bold 40px serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.shadowColor = '#FFD700'; ctx.shadowBlur = 10;
    ctx.fillText(current.full_name, W / 2, 438); ctx.restore();

    // Level row
    ctx.save(); ctx.fillStyle = '#aaaaaa'; ctx.font = '17px serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('المستوى:', W / 2, 460); ctx.restore();

    ctx.save();
    ctx.setLineDash([4, 6]); ctx.strokeStyle = '#C9A84C'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(200, 482); ctx.lineTo(W - 200, 482); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#dddddd'; ctx.font = 'bold 22px serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillText(levelName, W / 2, 480); ctx.restore();

    // Score & Rank pills
    const pillY = 520; const pillH = 40;
    const drawPill = (text: string, px: number, pw: number, color: string) => {
      ctx.save();
      const pg = ctx.createLinearGradient(px, pillY, px, pillY + pillH);
      pg.addColorStop(0, color + '44'); pg.addColorStop(1, color + '22');
      ctx.fillStyle = pg; ctx.strokeStyle = color; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(px - pw/2, pillY - pillH/2, pw, pillH, 10);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = color; ctx.font = 'bold 20px serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(text, px, pillY); ctx.restore();
    };
    if (g.score && hasRank) {
      drawPill(`الدرجة: ${g.score} / 100`, W/2 - 200, 320, '#FFD700');
      drawPill(`المركز: ${g.rank}`, W/2 + 200, 320, '#C9A84C');
    } else if (g.score) {
      drawPill(`الدرجة: ${g.score} / 100`, W/2, 360, '#FFD700');
    } else if (hasRank) {
      drawPill(`المركز: ${g.rank}`, W/2, 360, '#C9A84C');
    }

    // Bottom banner
    ctx.strokeStyle = mkDiv(570); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(60, 570); ctx.lineTo(W - 60, 570); ctx.stroke();

    const botBanner = ctx.createLinearGradient(0, 588, 0, 660);
    botBanner.addColorStop(0, '#1a1200'); botBanner.addColorStop(0.5, '#3d2900'); botBanner.addColorStop(1, '#1a1200');
    ctx.fillStyle = botBanner; ctx.fillRect(44, 588, W - 88, 72);
    ctx.strokeStyle = '#C9A84C'; ctx.lineWidth = 1; ctx.strokeRect(44, 588, W - 88, 72);

    ctx.save();
    const vGrad = ctx.createLinearGradient(W/2 - 150, 0, W/2 + 150, 0);
    vGrad.addColorStop(0, '#C9A84C'); vGrad.addColorStop(0.5, '#FFD700'); vGrad.addColorStop(1, '#C9A84C');
    ctx.fillStyle = vGrad; ctx.font = 'bold 20px serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('"خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ" — صحيح البخاري', W / 2, 614); ctx.restore();

    ctx.save(); ctx.fillStyle = '#888888'; ctx.font = '15px serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('إدارة مسابقة القرآن الكريم — قرية الحاج حسن جودة', W / 2, 645); ctx.restore();

    ['right', 'left'].forEach((side) => {
      const sx = side === 'right' ? 100 : W - 100;
      ctx.save(); ctx.font = '64px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(201,168,76,0.10)'; ctx.fillText('✦', sx, H/2 - 60);
      ctx.fillStyle = 'rgba(201,168,76,0.06)'; ctx.fillText('✦', sx, H/2 + 60); ctx.restore();
    });

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

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setCapturedFormImage(file); toast.success('تم التقاط صورة الاستمارة'); }
    e.target.value = '';
  };

  const buildMessage = (cardUrl?: string, formUrl?: string) => {
    if (!current) return '';
    const dl = (url: string, name: string) => `${url}?download=${encodeURIComponent(name)}`;
    let msg = `السلام عليكم ورحمة الله وبركاته 🌙\n\nنبشّركم بنتيجة مسابقة القرآن الكريم\nقرية الحاج حسن جودة 📖\n\nجزاكم الله خيرًا على مشاركتكم المباركة، وبارك الله في جهودكم في حفظ كتابه الكريم 🤲\n\n"خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ"\n\nإدارة مسابقة قرية الحاج حسن جودة`;
    if (cardUrl) msg += `\n\n🖼️ بيان الدرجات (اضغط لمشاهدته وحفظه):\n${dl(cardUrl, 'بيان_الدرجات.png')}`;
    if (formUrl)  msg += `\n\n📄 صورة الاستمارة (اضغط لمشاهدتها وحفظها):\n${dl(formUrl, 'استمارة_المسابقة.png')}`;
    return msg;
  };

  const handleSend = async () => {
    if (!current?.whatsapp) return;
    setSending(true); toast.info('جاري رفع الصور...');

    const canvas = canvasRef.current;
    const cardBlob: Blob | null = canvas ? await new Promise(resolve => canvas.toBlob(resolve, 'image/png')) : null;
    let cardUrl: string | null = null;
    if (cardBlob) { cardUrl = await uploadToStorage(cardBlob, `cards/${Date.now()}_${current.id}.png`); if (!cardUrl) toast.error('تعذّر رفع بيان الدرجات'); }

    let formUrl: string | null = null;
    if (capturedFormImage) {
      const fp = `forms/${Date.now()}_${current.id}_form.png`;
      const { error } = await supabase.storage.from('results').upload(fp, capturedFormImage, { contentType: capturedFormImage.type, upsert: true });
      if (!error) { const { data } = supabase.storage.from('results').getPublicUrl(fp); formUrl = data.publicUrl; }
      else toast.error('تعذّر رفع صورة الاستمارة');
    }

    const message = buildMessage(cardUrl ?? undefined, formUrl ?? undefined);
    const phone = current.whatsapp!.replace(/[^0-9]/g, '');
    const intlPhone = phone.startsWith('0') ? '2' + phone : phone;
    window.open(`https://wa.me/${intlPhone}?text=${encodeURIComponent(message)}`, '_blank');
    toast.success('تم فتح واتساب بالرسالة والروابط');
    setSending(false);
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
            إرسال بيان الدرجات — {currentIdx + 1} / {withWhatsApp.length}
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
                  {RANK_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-bold text-slate-700">النوع</Label>
              <div className="flex gap-1 h-10">
                <button type="button" onClick={() => updateGrade('gender', 'male')}
                  className={`flex-1 rounded-lg border-2 text-sm font-semibold transition-all ${g.gender === 'male' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-300'}`}>ذكر</button>
                <button type="button" onClick={() => updateGrade('gender', 'female')}
                  className={`flex-1 rounded-lg border-2 text-sm font-semibold transition-all ${g.gender === 'female' ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-slate-700 border-slate-300'}`}>أنثى</button>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="rounded-xl overflow-hidden border-2 border-amber-300 shadow-lg bg-black">
            <canvas ref={canvasRef} className="w-full" style={{ display: 'block', maxHeight: '280px' }} />
          </div>

          {capturedFormImage && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <Camera className="h-4 w-4 shrink-0" />
              <span className="flex-1">الاستمارة ملتقطة: <strong>{capturedFormImage.name}</strong></span>
              <button onClick={() => setCapturedFormImage(null)} className="text-blue-500 hover:text-blue-700 text-xs underline">إزالة</button>
            </div>
          )}

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800">
            <p className="font-bold">⚙️ آلية الإرسال: الصور تُرفع إلى الخادم ويُرسل رابطها في الرسالة</p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-3">
            <Button onClick={() => cameraInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Camera className="h-4 w-4" />
              {capturedFormImage ? 'إعادة التصوير' : 'تصوير الاستمارة'}
            </Button>
            <Button onClick={handleSend} disabled={!imageReady || sending}
              className="bg-green-600 hover:bg-green-700 gap-2">
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {sending ? 'جاري الرفع...' : 'إرسال واتساب'}
            </Button>
            <Button onClick={onClose} variant="outline" className="gap-2 border-2">
              <X className="h-4 w-4" />إغلاق
            </Button>
          </div>
        </div>

        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment"
          onChange={handleCameraCapture} className="hidden" />
      </DialogContent>
    </Dialog>
  );
};

export default BulkSendDialog;
