import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
}

export function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const { login, register } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(loginData.email, loginData.password);
      toast({
        title: "Muvaffaqiyat",
        description: "Tizimga muvaffaqiyatli kirdingiz!",
      });
      onClose();
      setLoginData({ email: '', password: '' });
    } catch (error) {
      toast({
        title: "Xato",
        description: error instanceof Error ? error.message : "Tizimga kirishda xato",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Xato",
        description: "Parollar mos kelmaydi",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      await register(
        registerData.fullName,
        registerData.email,
        registerData.password,
        registerData.userType
      );
      toast({
        title: "Muvaffaqiyat",
        description: "Ro'yxatdan muvaffaqiyatli o'tdingiz!",
      });
      onClose();
      setRegisterData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        userType: '',
      });
    } catch (error) {
      toast({
        title: "Xato",
        description: error instanceof Error ? error.message : "Ro'yxatdan o'tishda xato",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'login' ? 'Tizimga kirish' : "Ro'yxatdan o'tish"}
          </DialogTitle>
        </DialogHeader>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Parol</Label>
              <Input
                id="password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
              {isLoading ? 'Kuzatilmoqda...' : 'Kirish'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Ism va Familiya</Label>
              <Input
                id="fullName"
                type="text"
                value={registerData.fullName}
                onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="registerEmail">Email</Label>
              <Input
                id="registerEmail"
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="registerPassword">Parol</Label>
              <Input
                id="registerPassword"
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Parolni tasdiqlash</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="userType">Foydalanuvchi turi</Label>
              <Select value={registerData.userType} onValueChange={(value) => setRegisterData({ ...registerData, userType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Talaba</SelectItem>
                  <SelectItem value="teacher">O'qituvchi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
              {isLoading ? 'Kuzatilmoqda...' : "Ro'yxatdan o'tish"}
            </Button>
          </form>
        )}

        <div className="text-center">
          <Button
            variant="link"
            onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
            className="text-blue-600"
          >
            {mode === 'login' 
              ? "Akkauntingiz yo'qmi? Ro'yxatdan o'ting"
              : "Akkauntingiz bormi? Kirish"
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
