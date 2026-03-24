import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { mapSupabaseUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock, Mail, Shield } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Attempting login with:', formData.email);
    
    // Hardcoded credentials check
    if (formData.email.toLowerCase().trim() !== 'mosapaqa@gmail.com') {
      toast.error('عذراً، هذا البريد الإلكتروني غير مصرح له بالدخول');
      console.error('Email mismatch:', formData.email.toLowerCase().trim());
      return;
    }
    
    if (formData.password !== '123456') {
      toast.error('كلمة المرور غير صحيحة');
      console.error('Password mismatch');
      return;
    }
    
    setLoading(true);
    console.log('Credentials validated, attempting Supabase login...');
    
    try {
      // Try to login with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
      });

      if (error) {
        console.log('Login failed, error:', error.message);
        
        // If account doesn't exist, create it
        if (error.message.includes('Invalid') || error.message.includes('invalid')) {
          console.log('Account does not exist, creating new account...');
          
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: formData.email.toLowerCase().trim(),
            password: formData.password,
            options: {
              data: {
                username: 'mosapaqa',
              },
              emailRedirectTo: undefined,
            }
          });

          if (signUpError) {
            console.error('SignUp error:', signUpError);
            toast.error(`خطأ في إنشاء الحساب: ${signUpError.message}`);
            setLoading(false);
            return;
          }

          console.log('Account created successfully:', signUpData);

          // Wait a moment for the account to be fully created
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Try to login again
          console.log('Attempting login after signup...');
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: formData.email.toLowerCase().trim(),
            password: formData.password,
          });

          if (loginError) {
            console.error('Login error after signup:', loginError);
            toast.error(`خطأ في تسجيل الدخول: ${loginError.message}`);
            setLoading(false);
            return;
          }

          if (loginData.user) {
            console.log('Login successful after signup');
            toast.success('تم إنشاء الحساب وتسجيل الدخول بنجاح');
            login(mapSupabaseUser(loginData.user));
            navigate('/admin/dashboard');
          }
        } else {
          toast.error(`خطأ في تسجيل الدخول: ${error.message}`);
          setLoading(false);
        }
      } else if (data.user) {
        console.log('Login successful:', data.user.email);
        toast.success('تم تسجيل الدخول بنجاح');
        login(mapSupabaseUser(data.user));
        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast.error('حدث خطأ غير متوقع');
      setLoading(false);
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
                <Label htmlFor="email" className="text-emerald-800 font-semibold">
                  البريد الإلكتروني
                </Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-3 h-5 w-5 text-emerald-600" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="mosapaqa@gmail.com"
                    className="pr-10 h-11 border-2 border-emerald-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-emerald-800 font-semibold">
                  كلمة المرور
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 h-5 w-5 text-emerald-600" />
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
