import { 
  users, 
  courses, 
  enrollments,
  type User, 
  type InsertUser,
  type Course,
  type InsertCourse,
  type Enrollment,
  type InsertEnrollment,
  type VideoLesson,
  type CourseMaterial,
  type CourseTest
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Courses
  getAllCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  getCoursesByCategory(category?: string): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // Enrollments
  getEnrollmentsByUser(userId: number): Promise<Enrollment[]>;
  getEnrollment(userId: number, courseId: number): Promise<Enrollment | undefined>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollmentProgress(enrollmentId: number, progress: number, completedLessons: number[], completedTests: number[]): Promise<Enrollment>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private enrollments: Map<number, Enrollment>;
  private currentUserId: number;
  private currentCourseId: number;
  private currentEnrollmentId: number;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.enrollments = new Map();
    this.currentUserId = 1;
    this.currentCourseId = 1;
    this.currentEnrollmentId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Sample courses
    const sampleCourses: Course[] = [
      {
        id: this.currentCourseId++,
        title: "Python Dasturlash",
        description: "Python tilida dasturlash asoslari va amaliy loyihalar",
        price: 100000,
        duration: "8 hafta",
        rating: "4.9",
        reviewCount: 312,
        imageUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
        category: "Dasturlash",
        teacherId: 1,
        videoLessons: [
          { id: 1, title: "1-dars: Python dasturlashga kirish", duration: "25 daqiqa", youtubeId: "rfscVS0vtbw" },
          { id: 2, title: "2-dars: Python o'rnatish va muhit sozlash", duration: "18 daqiqa", youtubeId: "x7X9w_GIm1s" },
          { id: 3, title: "3-dars: O'zgaruvchilar va ma'lumot turlari", duration: "30 daqiqa", youtubeId: "cKxRvEZd3Mw" },
          { id: 4, title: "4-dars: Operatorlar va ifodalar", duration: "22 daqiqa", youtubeId: "v5MR5JnKcZI" },
          { id: 5, title: "5-dars: Shartli operatorlar (if/else)", duration: "28 daqiqa", youtubeId: "DZwmZ8Usvnk" },
          { id: 6, title: "6-dars: Sikllar (for va while)", duration: "35 daqiqa", youtubeId: "6iF8Xb7Z3wQ" },
          { id: 7, title: "7-dars: Ro'yxatlar (Lists)", duration: "32 daqiqa", youtubeId: "ohCDWZgNIU0" },
          { id: 8, title: "8-dars: Funksiyalar", duration: "40 daqiqa", youtubeId: "9Os0o3wzS_I" },
          { id: 9, title: "9-dars: Lug'atlar (Dictionaries)", duration: "26 daqiqa", youtubeId: "daefaLgNkw0" },
          { id: 10, title: "10-dars: Amaliy loyiha - Kalkulyator", duration: "45 daqiqa", youtubeId: "u-OmVr_fT4s" }
        ],
        materials: [
          { id: 1, title: "Python dasturlashga kirish", type: "pdf", filename: "python-kirish.pdf", size: "2.5 MB" },
          { id: 2, title: "Python sintaksisi", type: "pdf", filename: "python-sintaksis.pdf", size: "1.8 MB" },
          { id: 3, title: "Amaliy topshiriqlar", type: "doc", filename: "amaliy-topshiriqlar.docx", size: "945 KB" }
        ],
        tests: [
          {
            id: 1,
            title: "1-test: Asosiy tushunchalar",
            questionCount: 10,
            duration: "15 daqiqa",
            questions: [
              {
                id: 1,
                question: "Python dasturlash tilining yaratuvchisi kim?",
                options: ["Guido van Rossum", "Dennis Ritchie", "Bjarne Stroustrup", "James Gosling"],
                correctAnswer: 0
              }
            ]
          }
        ]
      },
      {
        id: this.currentCourseId++,
        title: "Web Sayt Yaratish",
        description: "HTML, CSS, JavaScript va React.js asoslari",
        price: 130000,
        duration: "10 hafta",
        rating: "4.8",
        reviewCount: 256,
        imageUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
        category: "Dasturlash",
        teacherId: 1,
        videoLessons: [
          { id: 1, title: "1-dars: HTML asoslari va tuzilishi", duration: "35 daqiqa", youtubeId: "qz0aGYrrlhU" },
          { id: 2, title: "2-dars: HTML elementlari va teglar", duration: "28 daqiqa", youtubeId: "pQN-pnXPaVg" },
          { id: 3, title: "3-dars: CSS kirish va sintaksis", duration: "30 daqiqa", youtubeId: "yfoY53QXEnI" },
          { id: 4, title: "4-dars: CSS selektorlar va xususiyatlar", duration: "32 daqiqa", youtubeId: "1Rs2ND1ryYc" },
          { id: 5, title: "5-dars: Flexbox layout", duration: "45 daqiqa", youtubeId: "3YW65K6LcIA" },
          { id: 6, title: "6-dars: CSS Grid layout", duration: "40 daqiqa", youtubeId: "jV8B24rSN5o" },
          { id: 7, title: "7-dars: Responsive dizayn", duration: "38 daqiqa", youtubeId: "srvUrASNdxk" },
          { id: 8, title: "8-dars: JavaScript asoslari", duration: "50 daqiqa", youtubeId: "PkZNo7MFNFg" },
          { id: 9, title: "9-dars: DOM manipulyatsiyasi", duration: "42 daqiqa", youtubeId: "0ik6X4DJKCc" },
          { id: 10, title: "10-dars: React.js kirish", duration: "55 daqiqa", youtubeId: "Tn6-PIqc4UM" },
          { id: 11, title: "11-dars: React komponentlar", duration: "48 daqiqa", youtubeId: "4UZrsTqkcW4" },
          { id: 12, title: "12-dars: Amaliy loyiha - Portfolio sayt", duration: "60 daqiqa", youtubeId: "P8YuWEkTeuE" }
        ],
        materials: [
          { id: 1, title: "HTML qo'llanma", type: "pdf", filename: "html-guide.pdf", size: "3.2 MB" },
          { id: 2, title: "CSS misollari", type: "doc", filename: "css-examples.docx", size: "1.5 MB" }
        ],
        tests: [
          {
            id: 1,
            title: "HTML/CSS testi",
            questionCount: 15,
            duration: "20 daqiqa",
            questions: []
          }
        ]
      },
      {
        id: this.currentCourseId++,
        title: "Ma'lumotlar Tahlili",
        description: "Data Science va Machine Learning asoslari",
        price: 180000,
        duration: "12 hafta",
        rating: "4.7",
        reviewCount: 198,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
        category: "Data Science",
        teacherId: 1,
        videoLessons: [
          { id: 1, title: "1-dars: Data Science nima?", duration: "25 daqiqa", youtubeId: "X3paOmcrTjQ" },
          { id: 2, title: "2-dars: Python data science uchun", duration: "30 daqiqa", youtubeId: "LHBE6Q9XlzI" },
          { id: 3, title: "3-dars: Pandas kutubxonasi", duration: "40 daqiqa", youtubeId: "vmEHCJofslg" },
          { id: 4, title: "4-dars: NumPy asoslari", duration: "35 daqiqa", youtubeId: "QUT1VHiLmmI" },
          { id: 5, title: "5-dars: Matplotlib bilan vizualizatsiya", duration: "38 daqiqa", youtubeId: "3Xc3CA655Y4" },
          { id: 6, title: "6-dars: Ma'lumotlarni tozalash", duration: "45 daqiqa", youtubeId: "bDhvCp3_lYw" },
          { id: 7, title: "7-dars: Statistik tahlil", duration: "42 daqiqa", youtubeId: "MdHtK7CWpCQ" },
          { id: 8, title: "8-dars: Machine Learning kirish", duration: "50 daqiqa", youtubeId: "aircAruvnKk" },
          { id: 9, title: "9-dars: Linear Regression", duration: "48 daqiqa", youtubeId: "nk2CQITm_eo" },
          { id: 10, title: "10-dars: Classification algoritmlari", duration: "52 daqiqa", youtubeId: "yIYKR4sgzI8" },
          { id: 11, title: "11-dars: Model baholash", duration: "35 daqiqa", youtubeId: "85dtiMz9tSo" },
          { id: 12, title: "12-dars: Amaliy loyiha - Ma'lumotlarni tahlil qilish", duration: "65 daqiqa", youtubeId: "r-uHLfJBokM" }
        ],
        materials: [
          { id: 1, title: "Data Science asoslari", type: "pdf", filename: "data-science.pdf", size: "4.1 MB" }
        ],
        tests: [
          {
            id: 1,
            title: "Ma'lumotlar tahlili testi",
            questionCount: 12,
            duration: "18 daqiqa",
            questions: []
          }
        ]
      }
    ];

    sampleCourses.forEach(course => {
      this.courses.set(course.id, course);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getCoursesByCategory(category?: string): Promise<Course[]> {
    const allCourses = Array.from(this.courses.values());
    if (!category || category === "Barcha yo'nalishlar") {
      return allCourses;
    }
    return allCourses.filter(course => course.category === category);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.currentCourseId++;
    const course: Course = { ...insertCourse, id };
    this.courses.set(id, course);
    return course;
  }

  async getEnrollmentsByUser(userId: number): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values()).filter(
      enrollment => enrollment.userId === userId
    );
  }

  async getEnrollment(userId: number, courseId: number): Promise<Enrollment | undefined> {
    return Array.from(this.enrollments.values()).find(
      enrollment => enrollment.userId === userId && enrollment.courseId === courseId
    );
  }

  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const id = this.currentEnrollmentId++;
    const enrollment: Enrollment = { 
      ...insertEnrollment, 
      id, 
      progress: 0,
      completedLessons: [],
      completedTests: []
    };
    this.enrollments.set(id, enrollment);
    return enrollment;
  }

  async updateEnrollmentProgress(
    enrollmentId: number, 
    progress: number, 
    completedLessons: number[], 
    completedTests: number[]
  ): Promise<Enrollment> {
    const enrollment = this.enrollments.get(enrollmentId);
    if (!enrollment) {
      throw new Error("Enrollment not found");
    }
    
    const updated: Enrollment = {
      ...enrollment,
      progress,
      completedLessons,
      completedTests
    };
    
    this.enrollments.set(enrollmentId, updated);
    return updated;
  }
}

export const storage = new MemStorage();
