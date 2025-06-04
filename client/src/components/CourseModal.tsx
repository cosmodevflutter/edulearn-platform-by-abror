import { useState } from 'react';
import { Course, VideoLesson, CourseMaterial } from '@shared/schema';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { VideoModal } from './VideoModal';
import { 
  PlayCircle, 
  FileText, 
  Download, 
  Clock, 
  Users, 
  CheckCircle, 
  Award 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface CourseModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CourseModal({ course, isOpen, onClose }: CourseModalProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoLesson | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  if (!course) return null;

  const handleVideoClick = (video: VideoLesson) => {
    setSelectedVideo(video);
    setIsVideoModalOpen(true);
  };

  const handleMaterialDownload = async (material: CourseMaterial) => {
    try {
      const response = await fetch(`/api/download/${material.filename}`);
      
      if (!response.ok) {
        throw new Error('Faylni yuklashda xato');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = material.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Muvaffaqiyat",
        description: `${material.filename} yuklandi!`,
      });
    } catch (error) {
      toast({
        title: "Xato",
        description: "Faylni yuklashda muammo yuz berdi",
        variant: "destructive",
      });
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Xato",
        description: "Kursga yozilish uchun tizimga kiring",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          courseId: course.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      toast({
        title: "Muvaffaqiyat",
        description: "Kursga muvaffaqiyatli yozildingiz!",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Xato",
        description: error instanceof Error ? error.message : "Kursga yozilishda xato",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{course.title}</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Course Content */}
            <div className="lg:col-span-2">
              {/* Video Lessons */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Video Darslar</h3>
                <div className="space-y-3">
                  {course.videoLessons.map((video) => (
                    <div
                      key={video.id}
                      className="video-item"
                      onClick={() => handleVideoClick(video)}
                    >
                      <PlayCircle className="text-blue-600 text-xl mr-3" />
                      <div>
                        <h4 className="font-medium">{video.title}</h4>
                        <p className="text-sm text-gray-600">{video.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PDF Materials */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Ma'ruzalar va Materiallar</h3>
                <div className="space-y-3">
                  {course.materials.map((material) => (
                    <div
                      key={material.id}
                      className="material-item"
                      onClick={() => handleMaterialDownload(material)}
                    >
                      <FileText className={`text-xl mr-3 ${
                        material.type === 'pdf' ? 'text-red-500' : 'text-blue-500'
                      }`} />
                      <div className="flex-1">
                        <h4 className="font-medium">{material.title}</h4>
                        <p className="text-sm text-gray-600">
                          {material.type.toUpperCase()} • {material.size}
                        </p>
                      </div>
                      <Download className="text-gray-400 ml-auto" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Tests */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Testlar</h3>
                <div className="space-y-3">
                  {course.tests.map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="text-green-500 text-xl mr-3" />
                        <div>
                          <h4 className="font-medium">{test.title}</h4>
                          <p className="text-sm text-gray-600">
                            {test.questionCount} savol • {test.duration}
                          </p>
                        </div>
                      </div>
                      <Button className="btn-primary text-sm">
                        Testni boshlash
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Course Info Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 sticky top-6">
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {course.price.toLocaleString()} so'm
                  </div>
                  <Button onClick={handleEnroll} className="w-full btn-primary font-semibold">
                    Kursga yozilish
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Clock className="text-gray-500 mr-3 w-5 h-5" />
                    <span className="text-sm">{course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <PlayCircle className="text-gray-500 mr-3 w-5 h-5" />
                    <span className="text-sm">{course.videoLessons.length} video dars</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="text-gray-500 mr-3 w-5 h-5" />
                    <span className="text-sm">{course.materials.length} ma'ruza</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-gray-500 mr-3 w-5 h-5" />
                    <span className="text-sm">{course.tests.length} test</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="text-gray-500 mr-3 w-5 h-5" />
                    <span className="text-sm">Sertifikat</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <VideoModal
        video={selectedVideo}
        isOpen={isVideoModalOpen}
        onClose={() => {
          setIsVideoModalOpen(false);
          setSelectedVideo(null);
        }}
      />
    </>
  );
}
