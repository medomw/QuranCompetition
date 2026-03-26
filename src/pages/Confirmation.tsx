import { useEffect } from 'react';
import { CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Confirmation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Application submitted successfully - Confirmation page loaded');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 flex items-center justify-center px-3 sm:px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl border-2 sm:border-4 border-emerald-400 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 sm:px-8 py-4 sm:py-6 text-center">
            <Star className="h-12 w-12 sm:h-16 sm:w-16 text-white mx-auto mb-2 sm:mb-3" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">مسابقة القرآن الكريم</h1>
            <p className="text-sm sm:text-base text-emerald-100 mt-1">قرية الحاج حسن جودة</p>
          </div>

          {/* Success Message */}
          <div className="p-6 sm:p-12 text-center space-y-4 sm:space-y-6">
            <div className="flex justify-center">
              <div className="bg-emerald-100 rounded-full p-3 sm:p-4">
                <CheckCircle className="h-16 w-16 sm:h-24 sm:w-24 text-emerald-600" />
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-800">
                تم استلام الاستمارة بنجاح!
              </h2>
              <p className="text-base sm:text-xl text-emerald-700 leading-relaxed px-2">
                سيتم إرسال الاستمارة الخاصة بك إلى المسؤولين عن المسابقة
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-300 sm:border-2 rounded-lg p-4 sm:p-6 mt-4 sm:mt-8">
              <p className="text-emerald-800 font-semibold text-base sm:text-lg">
                ﷽
              </p>
              <p className="text-sm sm:text-base text-emerald-700 mt-2 sm:mt-3">
                نسأل الله أن يوفقكم في حفظ كتابه الكريم
              </p>
              <p className="text-emerald-600 text-xs sm:text-sm mt-2">
                وأن يجعله شفيعاً لكم يوم القيامة
              </p>
            </div>

            <div className="pt-4 sm:pt-6">
              <Button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-6 h-auto"
              >
                العودة إلى الصفحة الرئيسية
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="mt-4 sm:mt-6 text-center px-3">
          <p className="text-emerald-600 text-xs sm:text-sm">
            "وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ"
          </p>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
