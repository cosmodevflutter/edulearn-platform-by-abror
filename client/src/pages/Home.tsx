import { Button } from '@/components/ui/button';
import { CourseCard } from '@/components/CourseCard';
import { CourseModal } from '@/components/CourseModal';
import { useState, useEffect } from 'react';
import { Course } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface HomeProps {
  onSectionChange: (section: string) => void;
}

export function Home({ onSectionChange }: HomeProps) {
  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPopularCourses();
  }, []);

  const fetchPopularCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      if (response.ok) {
        const courses = await response.json();
        setPopularCourses(courses.slice(0, 3)); // Show only first 3 courses
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleCourseView = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleCourseEnroll = (courseId: number) => {
    // Find the course and open modal
    const course = popularCourses.find(c => c.id === courseId);
    if (course) {
      handleCourseView(course);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-gradient rounded-xl text-white p-8 mb-8">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-bold mb-4">Kelajak bugundan boshlanadi</h2>
          <p className="text-xl mb-6 opacity-90">Qarshi davlat Texnika universiteti</p>
          <p className="text-lg mb-8 opacity-80">
            Zamonaviy ta'lim texnologiyalari bilan bilimingizni oshiring va 
            professional ko'nikmalaringizni rivojlantiring.
          </p>
          <Button 
            onClick={() => onSectionChange('courses')}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold"
          >
            Kurslarni ko'rish
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="stats-card">
          <div className="text-3xl font-bold text-blue-600 mb-2">150+</div>
          <div className="text-gray-600">Kurslar</div>
        </div>
        <div className="stats-card">
          <div className="text-3xl font-bold text-green-500 mb-2">5000+</div>
          <div className="text-gray-600">Talabalar</div>
        </div>
        <div className="stats-card">
          <div className="text-3xl font-bold text-orange-500 mb-2">50+</div>
          <div className="text-gray-600">O'qituvchilar</div>
        </div>
        <div className="stats-card">
          <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
          <div className="text-gray-600">Mamnunlik</div>
        </div>
      </div>

      {/* Popular Courses */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Mashhur Kurslar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEnroll={handleCourseEnroll}
              onViewDetails={handleCourseView}
            />
          ))}
        </div>
      </div>

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
