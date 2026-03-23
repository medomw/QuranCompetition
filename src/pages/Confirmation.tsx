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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-xl shadow-2xl border-4 border-emerald-400 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6 text-center">
            <Star className="h-16 w-16 text-white mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-white">مسابقة القرآن الكريم</h1>
            <p className="text-emerald-100 mt-1">قرية الحاج حسن جودة</p>
          </div>

          {/* Success Message */}
          <div className="p-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-emerald-100 rounded-full p-4">
                <CheckCircle className="h-24 w-24 text-emerald-600" />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-emerald-800">
                تم استلام الاستمارة بنجاح!
              </h2>
              <p className="text-xl text-emerald-700 leading-relaxed">
                سيتم إرسال الاستمارة الخاصة بك إلى المسؤولين عن المسابقة
              </p>
            </div>

            <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-6 mt-8">
              <p className="text-emerald-800 font-semibold text-lg">
                ﷽
              </p>
              <p className="text-emerald-700 mt-3">
                نسأل الله أن يوفقكم في حفظ كتابه الكريم
              </p>
              <p className="text-emerald-600 text-sm mt-2">
                وأن يجعله شفيعاً لكم يوم القيامة
              </p>
            </div>

            <div className="pt-6">
              <Button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-lg px-8 py-6 h-auto"
              >
                العودة إلى الصفحة الرئيسية
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="mt-6 text-center">
          <p className="text-emerald-600 text-sm">
            "وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ"
          </p>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
