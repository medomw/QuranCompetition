import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { mapSupabaseUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock, Mail, Shield, Key } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if email is authorized
    if (email.toLowerCase().trim() !== 'mohamedgomaamedomedo@gmail.com') {
      toast.error('عذراً، هذا البريد الإلكتروني غير مصرح له بالدخول');
      return;
    }
    
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase().trim(),
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      console.error('Error sending OTP:', error);
      toast.error('حدث خطأ في إرسال رمز التحقق');
      setLoading(false);
    } else {
      toast.success('تم إرسال رمز التحقق إلى بريدك الإلكتروني');
      setStep('otp');
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length < 4) {
      toast.error('يرجى إدخال رمز التحقق');
      return;
    }
    
    setLoading(true);
    
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.toLowerCase().trim(),
      token: otp,
      type: 'email',
    });

    if (error) {
      console.error('Error verifying OTP:', error);
      toast.error('رمز التحقق غير صحيح');
      setLoading(false);
    } else if (data.user) {
      toast.success('تم تسجيل الدخول بنجاح');
      login(mapSupabaseUser(data.user));
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 px-8 py-6 text-center">
            <Shield className="h-12 w-12 text-white mx-auto mb-2" />
            <h1 className="text-2xl font-bold text-white">لوحة تحكم المسؤولين</h1>
            <p className="text-emerald-100 text-sm mt-1">مسابقة القرآن الكريم</p>
          </div>

          <div className="p-8">
            {step === 'email' ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-emerald-800 font-semibold">
                    البريد الإلكتروني
                  </Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-3 h-5 w-5 text-emerald-600" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="mohamedgomaamedomedo@gmail.com"
                      className="pr-10 h-11 border-2 border-emerald-200"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700"
                >
                  {loading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-emerald-800 font-semibold">
                    رمز التحقق
                  </Label>
                  <div className="relative">
                    <Key className="absolute right-3 top-3 h-5 w-5 text-emerald-600" />
                    <Input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="أدخل رمز التحقق المرسل إلى بريدك"
                      className="pr-10 h-11 border-2 border-emerald-200"
                      required
                    />
                  </div>
                  <p className="text-sm text-emerald-600">تم إرسال الرمز إلى: {email}</p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => {
                      setStep('email');
                      setOtp('');
                    }}
                    variant="outline"
                    className="flex-1 h-11"
                  >
                    تغيير البريد
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700"
                  >
                    {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-white hover:text-emerald-200 underline">
            العودة إلى الصفحة الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
