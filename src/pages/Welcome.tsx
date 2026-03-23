import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Star, Sparkles, Award, Users, CheckCircle } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 relative overflow-hidden">
      {/* Islamic Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl w-full">
          {/* Main Content */}
          <div className="text-center mb-12">
            {/* Bismillah */}
            <div className="mb-8">
              <p className="text-5xl md:text-6xl text-amber-300 font-arabic mb-4">﷽</p>
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto"></div>
            </div>

            {/* Title */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 mb-8 border-2 border-amber-400/30 shadow-2xl">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Star className="h-12 w-12 md:h-16 md:w-16 text-amber-300 animate-pulse" />
                <div>
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">مسابقة القرآن الكريم</h1>
                  <p className="text-2xl md:text-3xl text-amber-200">قرية الحاج حسن جودة</p>
                </div>
                <Sparkles className="h-12 w-12 md:h-16 md:w-16 text-amber-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
              
              <div className="bg-emerald-800/50 rounded-xl p-6 mb-6">
                <p className="text-xl md:text-2xl text-amber-100 font-semibold leading-relaxed">
                  "إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ"
                </p>
                <p className="text-emerald-200 mt-2">سورة الإسراء - آية 9</p>
              </div>

              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                نرحب بكم في مسابقة القرآن الكريم السنوية
                <br />
                فرصة مباركة لتنافس في حفظ كتاب الله العزيز
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-amber-400/20 hover:bg-white/15 transition-all duration-300">
                <div className="bg-amber-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-amber-200 mb-2">تسجيل سهل</h3>
                <p className="text-white/80">املأ البيانات وسجّل في المسابقة بخطوات بسيطة</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-amber-400/20 hover:bg-white/15 transition-all duration-300">
                <div className="bg-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-amber-200 mb-2">مستويات متعددة</h3>
                <p className="text-white/80">من جزء واحد إلى 30 جزء كامل - اختر مستواك</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-amber-400/20 hover:bg-white/15 transition-all duration-300">
                <div className="bg-amber-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-amber-200 mb-2">تقييم عادل</h3>
                <p className="text-white/80">لجنة متخصصة لتقييم الحفظ والتلاوة</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-12 py-8 text-2xl font-bold bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-white shadow-2xl rounded-2xl border-4 border-amber-400 transform hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="h-8 w-8 ml-3" />
                سجّل الآن في المسابقة
                <Sparkles className="h-8 w-8 mr-3" />
              </Button>

              <Button
                onClick={() => navigate('/admin/login')}
                variant="outline"
                className="w-full sm:w-auto px-8 py-6 text-xl font-bold bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 rounded-2xl"
              >
                <Users className="h-6 w-6 ml-2" />
                دخول المسؤولين
              </Button>
            </div>
          </div>

          {/* Footer Quote */}
          <div className="text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <p className="text-amber-200 text-lg font-semibold">
                "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ"
              </p>
              <p className="text-white/70 mt-2">صحيح البخاري</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Islamic Stars */}
      <div className="fixed top-10 left-10 w-20 h-20 opacity-20 pointer-events-none">
        <Star className="w-full h-full text-amber-300 animate-pulse" />
      </div>
      <div className="fixed top-20 right-20 w-16 h-16 opacity-20 pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}>
        <Sparkles className="w-full h-full text-amber-400" />
      </div>
      <div className="fixed bottom-20 left-20 w-24 h-24 opacity-20 pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}>
        <Star className="w-full h-full text-emerald-300" />
      </div>
      <div className="fixed bottom-10 right-10 w-20 h-20 opacity-20 pointer-events-none animate-pulse" style={{ animationDelay: '0.5s' }}>
        <Sparkles className="w-full h-full text-amber-300" />
      </div>
    </div>
  );
};

export default Welcome;
