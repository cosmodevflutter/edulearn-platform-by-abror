import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertEnrollmentSchema } from "@shared/schema";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Bu email allaqachon ro'yxatdan o'tgan" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      // Don't return password
      const { password, ...userResponse } = user;
      res.json({ user: userResponse });
    } catch (error) {
      res.status(400).json({ message: "Noto'g'ri ma'lumotlar" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Email yoki parol noto'g'ri" });
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Email yoki parol noto'g'ri" });
      }
      
      // Don't return password
      const { password: _, ...userResponse } = user;
      res.json({ user: userResponse });
    } catch (error) {
      res.status(500).json({ message: "Server xatosi" });
    }
  });

  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const { category } = req.query;
      const courses = await storage.getCoursesByCategory(category as string);
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Kurslarni yuklashda xato" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const course = await storage.getCourse(id);
      
      if (!course) {
        return res.status(404).json({ message: "Kurs topilmadi" });
      }
      
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Kursni yuklashda xato" });
    }
  });

  // Enrollment routes
  app.post("/api/enrollments", async (req, res) => {
    try {
      const enrollmentData = insertEnrollmentSchema.parse({
        ...req.body,
        enrolledAt: new Date().toISOString()
      });
      
      // Check if already enrolled
      const existingEnrollment = await storage.getEnrollment(
        enrollmentData.userId,
        enrollmentData.courseId
      );
      
      if (existingEnrollment) {
        return res.status(400).json({ message: "Siz allaqachon bu kursga yozilgansiz" });
      }
      
      const enrollment = await storage.createEnrollment(enrollmentData);
      res.json(enrollment);
    } catch (error) {
      res.status(400).json({ message: "Kursga yozilishda xato" });
    }
  });

  app.get("/api/enrollments/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const enrollments = await storage.getEnrollmentsByUser(userId);
      
      // Get course details for each enrollment
      const enrollmentsWithCourses = await Promise.all(
        enrollments.map(async (enrollment) => {
          const course = await storage.getCourse(enrollment.courseId);
          return { ...enrollment, course };
        })
      );
      
      res.json(enrollmentsWithCourses);
    } catch (error) {
      res.status(500).json({ message: "Kurslarni yuklashda xato" });
    }
  });

  app.put("/api/enrollments/:id/progress", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { progress, completedLessons, completedTests } = req.body;
      
      const updatedEnrollment = await storage.updateEnrollmentProgress(
        id,
        progress,
        completedLessons || [],
        completedTests || []
      );
      
      res.json(updatedEnrollment);
    } catch (error) {
      res.status(400).json({ message: "Jarayonni yangilashda xato" });
    }
  });

  // File download route
  app.get("/api/download/:filename", async (req, res) => {
    try {
      const { filename } = req.params;
      
      // Generate sample content based on file type
      let content: string;
      let contentType: string;
      
      if (filename.endsWith('.pdf')) {
        content = `%PDF-1.4
%äüöß
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Bu kurs materiali) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000207 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
298
%%EOF`;
        contentType = 'application/pdf';
      } else {
        content = 'Bu kurs uchun DOC material.';
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      }
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(Buffer.from(content));
    } catch (error) {
      res.status(500).json({ message: "Faylni yuklashda xato" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
