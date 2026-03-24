export interface Task {
  id: string;
  title: string;
  subject: string;
  deadline: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface StudySession {
  id: string;
  date: string;
  duration: number; // in minutes
  subject: string;
  focusScore: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface StudyPlan {
  goal: string;
  schedule: {
    day: string;
    topics: string[];
    duration: string;
  }[];
}
