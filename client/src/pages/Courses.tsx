import { useState, useEffect } from 'react';
import { Course } from '@shared/schema';
import { CourseCard } from '@/components/CourseCard';
import { CourseModal } from '@/components/CourseModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Barcha yo'nalishlar");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, selectedCategory]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/courses');
      if (response.ok) {
        const coursesData = await response.json();
        setCourses(coursesData);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCourses = () => {
    if (selectedCategory === "Barcha yo'nalishlar") {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses(courses.filter(course => course.category === selectedCategory));
    }
  };

  const handleCourseView = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleCourseEnroll = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      handleCourseView(course);
    }
  };

  const categories = ["Barcha yo'nalishlar", "Dasturlash", "Data Science", "Muhandislik", "Marketing", "Dizayn"];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Kurslar yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Barcha Kurslar</h2>
        <div className="flex space-x-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Yo'nalishni tanlang" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Bu kategoriyada kurslar topilmadi.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEnroll={handleCourseEnroll}
              onViewDetails={handleCourseView}
            />
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
