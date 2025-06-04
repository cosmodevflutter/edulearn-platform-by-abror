import { Course } from '@shared/schema';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: number) => void;
  onViewDetails?: (course: Course) => void;
  showEnrollButton?: boolean;
}

export function CourseCard({ course, onEnroll, onViewDetails, showEnrollButton = true }: CourseCardProps) {
  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(course);
    }
  };

  const handleEnrollClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEnroll) {
      onEnroll(course.id);
    }
  };

  return (
    <div className="course-card" onClick={handleCardClick}>
      <img 
        src={course.imageUrl} 
        alt={course.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h4 className="text-lg font-semibold mb-2">{course.title}</h4>
        <p className="text-gray-600 text-sm mb-4">{course.description}</p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-blue-600 font-semibold">
            {course.price.toLocaleString()} so'm
          </span>
          <div className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1 text-sm text-gray-600">
              {course.rating} ({course.reviewCount})
            </span>
          </div>
        </div>
        {showEnrollButton && (
          <Button 
            onClick={handleEnrollClick}
            className="w-full btn-primary"
          >
            Kursga yozilish
          </Button>
        )}
      </div>
    </div>
  );
}
