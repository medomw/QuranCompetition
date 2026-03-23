import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { BookOpen, Star, Sparkles, ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    partsCount: '',
  });

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('registration_open')
        .limit(1)
        .single();

      if (!error && data) {
        setRegistrationOpen(data.registration_open);
      }
    };

    checkRegistrationStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registrationOpen) {
      toast.error('عذراً، التسجيل مغلق حالياً');
      return;
    }
    
    if (!formData.fullName || !formData.age || !formData.partsCount) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from('applications')
      .insert({
        full_name: formData.fullName,
        age: parseInt(formData.age),
        parts_count: parseInt(formData.partsCount),
      });

    if (error) {
      console.error('Error submitting application:', error);
      toast.error('حدث خطأ في إرسال الاستمارة');
      setLoading(false);
    } else {
      toast.success('تم إرسال الاستمارة بنجاح');
      navigate('/confirmation');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 relative overflow-hidden">
      {/* Islamic Pattern Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23047857' fill-opacity='0.15'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-amber-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header with Bismillah */}
      <header className="relative bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-700 text-white py-10 shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="container mx-auto px-4 relative">
          {/* Bismillah */}
          <div className="text-center mb-6">
            <p className="text-5xl text-amber-300 mb-3">﷽</p>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-4"></div>
          </div>
          
          {/* Title */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="bg-amber-500/30 backdrop-blur-sm p-3 rounded-full border-2 border-amber-400/50">
              <BookOpen className="h-10 w-10 text-amber-200" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">مسابقة القرآن الكريم</h1>
              <p className="text-amber-200 text-lg mt-1 font-semibold">قرية الحاج حسن جودة</p>
            </div>
            <div className="bg-amber-500/30 backdrop-blur-sm p-3 rounded-full border-2 border-amber-400/50">
              <Star className="h-10 w-10 text-amber-200 animate-pulse" />
            </div>
          </div>

          {/* Quranic Verse */}
          <div className="bg-emerald-800/40 backdrop-blur-sm rounded-2xl p-6 max-w-3xl mx-auto border border-amber-400/30">
            <p className="text-xl md:text-2xl text-amber-100 text-center font-semibold leading-relaxed mb-2">
              "وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا"
            </p>
            <p className="text-center text-emerald-200 text-sm">سورة المزمل - آية 4</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-3xl relative">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold"
          >
            <ArrowRight className="h-5 w-5 ml-2" />
            العودة للصفحة الرئيسية
          </Button>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border-4 border-emerald-600 overflow-hidden relative">
          {/* Decorative Corner Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-400/20 to-transparent rounded-bl-full"></div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-br-full"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-emerald-400/20 to-transparent rounded-tl-full"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-amber-400/20 to-transparent rounded-tr-full"></div>

          {/* Form Header */}
          <div className="bg-gradient-to-br from-emerald-50 via-amber-50 to-emerald-50 px-8 py-8 border-b-4 border-emerald-600 relative">
            {/* Islamic Decorative Pattern */}
            <div className="absolute top-3 left-6 text-5xl text-emerald-600/20">☪</div>
            <div className="absolute top-3 right-6 text-5xl text-amber-600/20">✦</div>
            <div className="absolute bottom-3 left-8">
              <Star className="h-8 w-8 text-emerald-500/20" />
            </div>
            <div className="absolute bottom-3 right-8">
              <Star className="h-8 w-8 text-amber-500/20" />
            </div>
            
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-4 rounded-2xl shadow-xl border-2 border-amber-400">
                <BookOpen className="h-12 w-12 text-amber-200" />
              </div>
              <h2 className="text-4xl font-bold text-emerald-800">استمارة التسجيل</h2>
            </div>
            
            <div className="bg-emerald-700/10 rounded-xl p-4 border border-emerald-300">
              <p className="text-center text-emerald-900 font-bold text-lg">
                يُرجى ملء البيانات التالية للمشاركة في المسابقة المباركة
              </p>
            </div>
            <div className="w-40 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mt-4"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-10 space-y-8 bg-gradient-to-br from-white via-emerald-50/20 to-amber-50/30 relative">
            {/* Full Name */}
            <div className="space-y-3">
              <Label htmlFor="fullName" className="text-lg text-emerald-800 font-bold flex items-center gap-2">
                <span className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shadow-lg border-2 border-amber-400">1</span>
                الاسم الكامل <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="أدخل الاسم الكامل"
                className="text-lg h-14 border-3 border-emerald-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-200 rounded-xl shadow-md bg-white hover:border-emerald-400 transition-colors"
                required
              />
            </div>

            {/* Age */}
            <div className="space-y-3">
              <Label htmlFor="age" className="text-lg text-emerald-800 font-bold flex items-center gap-2">
                <span className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shadow-lg border-2 border-amber-400">2</span>
                السن <span className="text-red-500">*</span>
              </Label>
              <Input
                id="age"
                type="number"
                min="5"
                max="100"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="أدخل السن"
                className="text-lg h-14 border-3 border-emerald-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-200 rounded-xl shadow-md bg-white hover:border-emerald-400 transition-colors"
                required
              />
            </div>

            {/* Parts Count */}
            <div className="space-y-3">
              <Label htmlFor="partsCount" className="text-lg text-emerald-800 font-bold flex items-center gap-2">
                <span className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shadow-lg border-2 border-amber-400">3</span>
                المستوى <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.partsCount} onValueChange={(value) => setFormData({ ...formData, partsCount: value })}>
                <SelectTrigger className="text-lg h-14 border-3 border-emerald-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-200 rounded-xl shadow-md bg-white hover:border-emerald-400 transition-colors">
                  <SelectValue placeholder="اختر المستوى" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  <SelectItem value="30" className="text-lg">المستوى الأول - القرآن كاملاً (30 جزء)</SelectItem>
                  <SelectItem value="20" className="text-lg">المستوى الثاني - ثلثي القرآن (20 جزء)</SelectItem>
                  <SelectItem value="15" className="text-lg">المستوى الثالث - نصف القرآن (15 جزء)</SelectItem>
                  <SelectItem value="10" className="text-lg">المستوى الرابع - 10 أجزاء</SelectItem>
                  <SelectItem value="5" className="text-lg">المستوى الخامس - 5 أجزاء</SelectItem>
                  <SelectItem value="3" className="text-lg">المستوى السادس - 3 أجزاء</SelectItem>
                  <SelectItem value="1" className="text-lg">المستوى السابع - 1 جزء</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading || !registrationOpen}
                className="w-full h-18 py-6 text-2xl font-bold bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-600 hover:from-emerald-700 hover:via-emerald-800 hover:to-emerald-700 text-white shadow-2xl transform hover:scale-[1.02] transition-all duration-300 rounded-2xl border-4 border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!registrationOpen ? (
                  <span className="flex items-center justify-center gap-3">
                    التسجيل مغلق حالياً
                  </span>
                ) : loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-7 h-7 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري الإرسال...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <Star className="h-7 w-7 animate-pulse" />
                    إرسال الاستمارة
                    <Star className="h-7 w-7 animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </span>
                )}
              </Button>
            </div>
          </form>

          {/* Footer Note */}
          <div className="bg-gradient-to-r from-emerald-100 via-amber-50 to-emerald-100 px-8 py-6 border-t-4 border-emerald-600 relative">
            <div className="absolute top-3 left-6 text-3xl opacity-30">✦</div>
            <div className="absolute top-3 right-6 text-3xl opacity-30">✦</div>
            <div className="text-center space-y-2">
              <p className="text-base text-emerald-800 font-bold">
                🌟 بعد إرسال الاستمارة، سيتم مراجعتها من قِبل المسؤولين عن المسابقة 🌟
              </p>
              <p className="text-sm text-emerald-700">
                وفقكم الله وسدد خطاكم في حفظ كتابه الكريم
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Decorative Islamic Elements */}
      <div className="fixed top-20 left-10 text-8xl opacity-10 pointer-events-none animate-pulse">
        ☪
      </div>
      <div className="fixed bottom-20 right-10 text-8xl opacity-10 pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}>
        ✦
      </div>
      <div className="fixed top-1/3 right-20 w-32 h-32 opacity-10 pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}>
        <Star className="w-full h-full text-emerald-600" />
      </div>
      <div className="fixed bottom-1/3 left-20 w-28 h-28 opacity-10 pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }}>
        <Sparkles className="w-full h-full text-amber-600" />
      </div>
    </div>
  );
};

export default Index;
