import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { mapSupabaseUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock, Shield } from 'lucide-react';

const ADMIN_EMAIL = 'mohamedgomaamedomedo@gmail.com';
const ADMIN_PASSWORD = '2292006';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      toast.error('يرجى إدخال كلمة المرور');
      return;
    }

    // Check password
    if (password !== ADMIN_PASSWORD) {
      toast.error('كلمة المرور غير صحيحة');
      setPassword('');
      return;
    }
    
    setLoading(true);
    
    // Try to login with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    if (error) {
      // If account doesn't exist, create it
      if (error.message.includes('Invalid login credentials')) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          options: {
            data: {
              username: 'المسؤول',
            },
          },
        });

        if (signUpError) {
          console.error('Error creating account:', signUpError);
          toast.error('حدث خطأ في إنشاء الحساب');
          setLoading(false);
          return;
        }

        if (signUpData.user) {
          toast.success('تم تسجيل الدخول بنجاح');
          login(mapSupabaseUser(signUpData.user));
          navigate('/admin/dashboard');
        }
      } else {
        console.error('Error logging in:', error);
        toast.error('حدث خطأ في تسجيل الدخول');
        setLoading(false);
      }
    } else if (data.user) {
      toast.success('تم تسجيل الدخول بنجاح');
      login(mapSupabaseUser(data.user));
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center px-3 sm:px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 px-4 sm:px-8 py-4 sm:py-6 text-center">
            <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-white mx-auto mb-2" />
            <h1 className="text-xl sm:text-2xl font-bold text-white">لوحة تحكم المسؤولين</h1>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1">مسابقة القرآن الكريم</p>
          </div>

          <div className="p-4 sm:p-8">
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base sm:text-base text-emerald-800 font-semibold">
                  كلمة المرور
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    className="pr-9 sm:pr-10 h-10 sm:h-11 border-2 border-emerald-200 text-base"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 sm:h-11 bg-emerald-600 hover:bg-emerald-700 text-base sm:text-base"
              >
                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 text-center">
          <a href="/" className="text-white hover:text-emerald-200 underline text-sm sm:text-base">
            العودة إلى الصفحة الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
