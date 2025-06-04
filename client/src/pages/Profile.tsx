import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, User, Mail, UserCheck } from 'lucide-react';

export function Profile() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-1" />
          <div className="ml-3">
            <p className="text-yellow-800">Profilingizni ko'rish uchun tizimga kiring.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Profil</h2>
      
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Foydalanuvchi Ma'lumotlari
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To'liq ism
                </label>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <User className="mr-2 h-4 w-4 text-gray-500" />
                  <span>{user.fullName}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Mail className="mr-2 h-4 w-4 text-gray-500" />
                  <span>{user.email}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foydalanuvchi turi
                </label>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <UserCheck className="mr-2 h-4 w-4 text-gray-500" />
                  <span>
                    {user.userType === 'student' ? 'Talaba' : 'O\'qituvchi'}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID
                </label>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">#{user.id}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <Button 
                onClick={logout}
                variant="destructive"
                className="w-full md:w-auto"
              >
                Tizimdan chiqish
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
