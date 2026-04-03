import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { mapSupabaseUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock, Mail, Shield, BookOpen } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (error) {
      console.error('Login error:', error.message);
      if (error.message.includes('Invalid login credentials')) {
        toast.error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } else if (error.message.includes('Email not confirmed')) {
        toast.error('البريد الإلكتروني غير مفعّل');
      } else {
        toast.error('حدث خطأ في تسجيل الدخول: ' + error.message);
      }
      setLoading(false);
      return;
    }

    if (data.user) {
      toast.success('تم تسجيل الدخول بنجاح');
      login(mapSupabaseUser(data.user));
      navigate('/admin/dashboard');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #065f46 30%, #047857 60%, #1a3a2a 100%)',
      }}
    >
      {/* Islamic decorative background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute top-10 right-10 text-9xl text-amber-400">☪</div>
        <div className="absolute bottom-10 left-10 text-9xl text-amber-400">✦</div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[20rem] text-emerald-300">✦</div>
      </div>

      {/* Glow effects */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400/50 mb-4 backdrop-blur-sm">
            <BookOpen className="h-10 w-10 text-amber-300" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">مسابقة القرآن الكريم</h1>
          <p className="text-emerald-200 text-sm">قرية الحاج حسن جودة</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Card Header */}
          <div className="bg-white/10 px-8 py-5 border-b border-white/20 flex items-center gap-3">
            <Shield className="h-6 w-6 text-amber-300" />
            <div>
              <h2 className="text-xl font-bold text-white">لوحة تحكم المسؤولين</h2>
              <p className="text-emerald-200 text-xs">يرجى تسجيل الدخول للمتابعة</p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-5" dir="rtl">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-emerald-100 font-semibold text-sm">
                  البريد الإلكتروني
                </Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-300" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="أدخل البريد الإلكتروني"
                    className="pr-10 h-12 bg-white/10 border-white/30 text-white placeholder:text-white/40 focus:border-amber-400 focus:ring-amber-400/30 rounded-xl"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-emerald-100 font-semibold text-sm">
                  كلمة المرور
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-300" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    className="pr-10 pl-12 h-12 bg-white/10 border-white/30 text-white placeholder:text-white/40 focus:border-amber-400 focus:ring-amber-400/30 rounded-xl"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300 hover:text-white transition-colors text-xs"
                  >
                    {showPassword ? 'إخفاء' : 'إظهار'}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 mt-2 text-base font-bold rounded-xl"
                style={{
                  background: loading
                    ? '#6b7280'
                    : 'linear-gradient(135deg, #d97706, #b45309)',
                  color: 'white',
                  border: 'none',
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري تسجيل الدخول...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Shield className="h-5 w-5" />
                    تسجيل الدخول
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-emerald-200 hover:text-white text-sm underline underline-offset-4 transition-colors"
          >
            العودة إلى الصفحة الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
