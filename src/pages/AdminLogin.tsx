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
const ADMIN_PASSWORD = '123456';

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
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-emerald-800 font-semibold">
                  كلمة المرور
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 h-5 w-5 text-emerald-600" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
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
                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </Button>
            </form>
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
