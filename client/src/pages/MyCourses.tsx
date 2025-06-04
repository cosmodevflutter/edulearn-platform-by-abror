import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Course, Enrollment } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CourseModal } from '@/components/CourseModal';
import { AlertCircle, PlayCircle, FileText, CheckCircle } from 'lucide-react';

interface EnrollmentWithCourse extends Enrollment {
  course: Course;
}

export function MyCourses() {
  const { user, isAuthenticated } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchEnrollments();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchEnrollments = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/enrollments/user/${user.id}`);
      if (response.ok) {
        const enrollmentsData = await response.json();
        setEnrollments(enrollmentsData);
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-1" />
          <div className="ml-3">
            <p className="text-yellow-800">Kurslarni ko'rish uchun tizimga kiring yoki ro'yxatdan o'ting.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Kurslaringiz yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Mening Kurslarim</h2>
      
      {enrollments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Siz hali hech qanday kursga yozilmagansiz.</p>
          <Button className="btn-primary">
            Kurslarni ko'rish
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {enrollments.map((enrollment) => (
            <div key={enrollment.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{enrollment.course.title}</h3>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                  Faol
                </span>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Jarayon</span>
                  <span>{enrollment.progress}%</span>
                </div>
                <Progress value={enrollment.progress} className="h-2" />
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <PlayCircle className="text-blue-600 mr-2 w-4 h-4" />
                  <span>
                    {enrollment.completedLessons.length}/{enrollment.course.videoLessons.length} video dars
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <FileText className="text-red-500 mr-2 w-4 h-4" />
                  <span>{enrollment.course.materials.length} ma'ruza</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="text-green-500 mr-2 w-4 h-4" />
                  <span>
                    {enrollment.completedTests.length}/{enrollment.course.tests.length} test
                  </span>
                </div>
              </div>
              
              <Button 
                onClick={() => handleContinueCourse(enrollment.course)}
                className="w-full btn-primary"
              >
                Davom etish
              </Button>
            </div>
          ))}
        </div>
      )}

      <CourseModal
        course={selectedCourse}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCourse(null);
        }}
      />
    </div>
  );
}
