import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  userType: text("user_type").notNull(), // 'student' or 'teacher'
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  duration: text("duration").notNull(),
  rating: text("rating").notNull(),
  reviewCount: integer("review_count").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  teacherId: integer("teacher_id").notNull(),
  videoLessons: json("video_lessons").$type<VideoLesson[]>().notNull(),
  materials: json("materials").$type<CourseMaterial[]>().notNull(),
  tests: json("tests").$type<CourseTest[]>().notNull(),
});

export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id").notNull(),
  progress: integer("progress").notNull().default(0),
  enrolledAt: text("enrolled_at").notNull(),
  completedLessons: json("completed_lessons").$type<number[]>().notNull().default([]),
  completedTests: json("completed_tests").$type<number[]>().notNull().default([]),
});

export interface VideoLesson {
  id: number;
  title: string;
  duration: string;
  youtubeId: string;
}

export interface CourseMaterial {
  id: number;
  title: string;
  type: 'pdf' | 'doc';
  filename: string;
  size: string;
}

export interface CourseTest {
  id: number;
  title: string;
  questionCount: number;
  duration: string;
  questions: TestQuestion[];
}

export interface TestQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  fullName: true,
  userType: true,
});

export const insertCourseSchema = createInsertSchema(courses).pick({
  title: true,
  description: true,
  price: true,
  duration: true,
  rating: true,
  reviewCount: true,
  imageUrl: true,
  category: true,
  teacherId: true,
  videoLessons: true,
  materials: true,
  tests: true,
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).pick({
  userId: true,
  courseId: true,
  enrolledAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Enrollment = typeof enrollments.$inferSelect;
