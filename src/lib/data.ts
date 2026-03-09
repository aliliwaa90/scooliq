// Mock data for the Iraqi Student Educational Platform

export interface Grade {
  id: string;
  name: string;
  stage: 'ابتدائي' | 'متوسط' | 'إعدادي';
  order: number;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradeId: string;
  description: string;
  videoCount: number;
  handoutCount: number;
  bookCount: number;
  quizCount: number;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  teacher: string;
  duration: string;
  views: number;
  subjectId: string;
  gradeId: string;
  chapter: string;
  lesson: string;
  isFree: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface Handout {
  id: string;
  title: string;
  cover: string;
  fileUrl: string;
  fileSize: string;
  type: 'handout' | 'book' | 'summary';
  downloads: number;
  subjectId: string;
  gradeId: string;
  isFree: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface Quiz {
  id: string;
  title: string;
  subjectId: string;
  gradeId: string;
  chapter: string;
  duration: number;
  questionCount: number;
  attempts: number;
  questions: Question[];
  isActive: boolean;
  createdAt: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'mcq' | 'truefalse';
  options: string[];
  correct: number;
  explanation: string;
}

export interface Teacher {
  id: string;
  name: string;
  avatar: string;
  subject: string;
  bio: string;
  videoCount: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'content' | 'quiz' | 'announcement' | 'review';
  createdAt: string;
  isRead: boolean;
}

// ===== GRADES =====
export const grades: Grade[] = [
  { id: 'g1', name: 'الأول الابتدائي', stage: 'ابتدائي', order: 1 },
  { id: 'g2', name: 'الثاني الابتدائي', stage: 'ابتدائي', order: 2 },
  { id: 'g3', name: 'الثالث الابتدائي', stage: 'ابتدائي', order: 3 },
  { id: 'g4', name: 'الرابع الابتدائي', stage: 'ابتدائي', order: 4 },
  { id: 'g5', name: 'الخامس الابتدائي', stage: 'ابتدائي', order: 5 },
  { id: 'g6', name: 'السادس الابتدائي', stage: 'ابتدائي', order: 6 },
  { id: 'g7', name: 'الأول المتوسط', stage: 'متوسط', order: 7 },
  { id: 'g8', name: 'الثاني المتوسط', stage: 'متوسط', order: 8 },
  { id: 'g9', name: 'الثالث المتوسط', stage: 'متوسط', order: 9 },
  { id: 'g10', name: 'الرابع الإعدادي', stage: 'إعدادي', order: 10 },
  { id: 'g11', name: 'الخامس الإعدادي', stage: 'إعدادي', order: 11 },
  { id: 'g12', name: 'السادس الإعدادي', stage: 'إعدادي', order: 12 },
];

// ===== SUBJECTS =====
export const subjects: Subject[] = [
  { id: 's1', name: 'الرياضيات', icon: '📐', color: '#3B82F6', gradeId: 'g9', description: 'الرياضيات للصف الثالث المتوسط - جبر وهندسة وإحصاء', videoCount: 48, handoutCount: 12, bookCount: 3, quizCount: 8 },
  { id: 's2', name: 'اللغة العربية', icon: '📝', color: '#10B981', gradeId: 'g9', description: 'القواعد والأدب والنصوص والإنشاء', videoCount: 36, handoutCount: 8, bookCount: 2, quizCount: 6 },
  { id: 's3', name: 'اللغة الإنكليزية', icon: '🌍', color: '#8B5CF6', gradeId: 'g9', description: 'English for Iraq - Grammar, Reading, Writing', videoCount: 42, handoutCount: 10, bookCount: 2, quizCount: 7 },
  { id: 's4', name: 'العلوم', icon: '🔬', color: '#F59E0B', gradeId: 'g9', description: 'الفيزياء والكيمياء والأحياء', videoCount: 54, handoutCount: 15, bookCount: 4, quizCount: 10 },
  { id: 's5', name: 'الاجتماعيات', icon: '🌏', color: '#EF4444', gradeId: 'g9', description: 'التاريخ والجغرافيا والوطنية', videoCount: 28, handoutCount: 6, bookCount: 2, quizCount: 5 },
  { id: 's6', name: 'التربية الإسلامية', icon: '🕌', color: '#06B6D4', gradeId: 'g9', description: 'القرآن الكريم والأحكام والسيرة', videoCount: 20, handoutCount: 5, bookCount: 1, quizCount: 4 },
  { id: 's7', name: 'الرياضيات', icon: '📐', color: '#3B82F6', gradeId: 'g12', description: 'الرياضيات للصف السادس الإعدادي', videoCount: 60, handoutCount: 18, bookCount: 4, quizCount: 12 },
  { id: 's8', name: 'الفيزياء', icon: '⚛️', color: '#8B5CF6', gradeId: 'g12', description: 'الفيزياء للصف السادس الإعدادي', videoCount: 50, handoutCount: 14, bookCount: 3, quizCount: 10 },
  { id: 's9', name: 'الكيمياء', icon: '🧪', color: '#10B981', gradeId: 'g12', description: 'الكيمياء للصف السادس الإعدادي', videoCount: 45, handoutCount: 12, bookCount: 3, quizCount: 9 },
  { id: 's10', name: 'الأحياء', icon: '🧬', color: '#F59E0B', gradeId: 'g12', description: 'الأحياء للصف السادس الإعدادي', videoCount: 40, handoutCount: 10, bookCount: 2, quizCount: 8 },
];

// ===== VIDEOS =====
export const videos: Video[] = [
  { id: 'v1', title: 'حل المعادلات من الدرجة الثانية', description: 'شرح مفصل لحل المعادلات التربيعية بالطرق المختلفة', thumbnail: '', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', teacher: 'أ. محمد العلي', duration: '25:30', views: 15420, subjectId: 's1', gradeId: 'g9', chapter: 'الفصل الأول', lesson: 'الدرس الثالث', isFree: true, isActive: true, createdAt: '2026-03-01' },
  { id: 'v2', title: 'نظرية فيثاغورس وتطبيقاتها', description: 'فهم نظرية فيثاغورس مع أمثلة عملية متعددة', thumbnail: '', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', teacher: 'أ. محمد العلي', duration: '32:15', views: 12350, subjectId: 's1', gradeId: 'g9', chapter: 'الفصل الثاني', lesson: 'الدرس الأول', isFree: true, isActive: true, createdAt: '2026-03-02' },
  { id: 'v3', title: 'قواعد الفعل المضارع المرفوع والمنصوب', description: 'شرح شامل لأحكام الفعل المضارع', thumbnail: '', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', teacher: 'أ. سارة الكاظمي', duration: '28:45', views: 9870, subjectId: 's2', gradeId: 'g9', chapter: 'الفصل الأول', lesson: 'الدرس الثاني', isFree: true, isActive: true, createdAt: '2026-03-01' },
  { id: 'v4', title: 'Present Perfect Tense', description: 'شرح زمن المضارع التام مع أمثلة وتمارين', thumbnail: '', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', teacher: 'أ. زينب الموسوي', duration: '22:10', views: 8540, subjectId: 's3', gradeId: 'g9', chapter: 'Unit 3', lesson: 'Lesson 1', isFree: true, isActive: true, createdAt: '2026-03-03' },
  { id: 'v5', title: 'قوانين نيوتن الثلاثة', description: 'شرح مبسط لقوانين نيوتن للحركة مع تجارب', thumbnail: '', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', teacher: 'أ. علي الحسيني', duration: '35:20', views: 18900, subjectId: 's4', gradeId: 'g9', chapter: 'الفصل الثالث', lesson: 'الدرس الأول', isFree: true, isActive: true, createdAt: '2026-02-28' },
  { id: 'v6', title: 'الحرب العالمية الأولى - الأسباب والنتائج', description: 'درس شامل عن الحرب العالمية الأولى', thumbnail: '', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', teacher: 'أ. حسن الربيعي', duration: '40:10', views: 6780, subjectId: 's5', gradeId: 'g9', chapter: 'الفصل الرابع', lesson: 'الدرس الثاني', isFree: true, isActive: true, createdAt: '2026-03-04' },
  { id: 'v7', title: 'التكامل وتطبيقاته', description: 'شرح التكامل المحدد وغير المحدد', thumbnail: '', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', teacher: 'أ. كريم الجابري', duration: '45:00', views: 22100, subjectId: 's7', gradeId: 'g12', chapter: 'الفصل الخامس', lesson: 'الدرس الأول', isFree: true, isActive: true, createdAt: '2026-03-05' },
  { id: 'v8', title: 'الدوائر الكهربائية', description: 'شرح دوائر التوالي والتوازي', thumbnail: '', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', teacher: 'أ. أحمد الشمري', duration: '38:30', views: 16500, subjectId: 's8', gradeId: 'g12', chapter: 'الفصل الثاني', lesson: 'الدرس الثالث', isFree: false, isActive: true, createdAt: '2026-03-06' },
  { id: 'v9', title: 'التفاعلات الكيميائية العضوية', description: 'أنواع التفاعلات في الكيمياء العضوية', thumbnail: '', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', teacher: 'أ. فاطمة النجار', duration: '30:15', views: 11200, subjectId: 's9', gradeId: 'g12', chapter: 'الفصل الرابع', lesson: 'الدرس الثاني', isFree: true, isActive: true, createdAt: '2026-03-07' },
  { id: 'v10', title: 'الوراثة والجينات', description: 'شرح قوانين مندل في الوراثة', thumbnail: '', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', teacher: 'أ. نور الهاشمي', duration: '33:45', views: 9800, subjectId: 's10', gradeId: 'g12', chapter: 'الفصل السادس', lesson: 'الدرس الأول', isFree: true, isActive: true, createdAt: '2026-03-08' },
];

// ===== HANDOUTS =====
export const handouts: Handout[] = [
  { id: 'h1', title: 'ملزمة الرياضيات - الفصل الأول', cover: '', fileUrl: '#', fileSize: '2.4 MB', type: 'handout', downloads: 5420, subjectId: 's1', gradeId: 'g9', isFree: true, isActive: true, createdAt: '2026-02-15' },
  { id: 'h2', title: 'ملخص القواعد العربية الشامل', cover: '', fileUrl: '#', fileSize: '1.8 MB', type: 'summary', downloads: 4280, subjectId: 's2', gradeId: 'g9', isFree: true, isActive: true, createdAt: '2026-02-20' },
  { id: 'h3', title: 'ملزمة العلوم - كاملة', cover: '', fileUrl: '#', fileSize: '5.1 MB', type: 'handout', downloads: 7650, subjectId: 's4', gradeId: 'g9', isFree: true, isActive: true, createdAt: '2026-02-25' },
  { id: 'h4', title: 'كتاب الرياضيات المنهجي', cover: '', fileUrl: '#', fileSize: '12.3 MB', type: 'book', downloads: 3200, subjectId: 's1', gradeId: 'g9', isFree: true, isActive: true, createdAt: '2026-01-10' },
  { id: 'h5', title: 'ملزمة الإنكليزي - Grammar', cover: '', fileUrl: '#', fileSize: '3.2 MB', type: 'handout', downloads: 6100, subjectId: 's3', gradeId: 'g9', isFree: true, isActive: true, createdAt: '2026-03-01' },
  { id: 'h6', title: 'أسئلة وزارية رياضيات 2025', cover: '', fileUrl: '#', fileSize: '1.5 MB', type: 'handout', downloads: 9200, subjectId: 's1', gradeId: 'g9', isFree: true, isActive: true, createdAt: '2026-03-05' },
  { id: 'h7', title: 'ملزمة التكامل والتفاضل', cover: '', fileUrl: '#', fileSize: '4.7 MB', type: 'handout', downloads: 8100, subjectId: 's7', gradeId: 'g12', isFree: true, isActive: true, createdAt: '2026-02-28' },
  { id: 'h8', title: 'كتاب الفيزياء المنهجي', cover: '', fileUrl: '#', fileSize: '15.6 MB', type: 'book', downloads: 4500, subjectId: 's8', gradeId: 'g12', isFree: true, isActive: true, createdAt: '2026-01-15' },
  { id: 'h9', title: 'ملخص الكيمياء العضوية', cover: '', fileUrl: '#', fileSize: '2.1 MB', type: 'summary', downloads: 5800, subjectId: 's9', gradeId: 'g12', isFree: true, isActive: true, createdAt: '2026-03-03' },
  { id: 'h10', title: 'أسئلة وزارية أحياء 2025', cover: '', fileUrl: '#', fileSize: '1.9 MB', type: 'handout', downloads: 7400, subjectId: 's10', gradeId: 'g12', isFree: true, isActive: true, createdAt: '2026-03-06' },
];

// ===== QUIZZES =====
export const quizzes: Quiz[] = [
  {
    id: 'q1', title: 'اختبار المعادلات التربيعية', subjectId: 's1', gradeId: 'g9', chapter: 'الفصل الأول', duration: 15, questionCount: 10, attempts: 3420, isActive: true, createdAt: '2026-03-01',
    questions: [
      { id: 'qq1', text: 'ما هي درجة المعادلة x² + 3x - 5 = 0 ؟', type: 'mcq', options: ['الأولى', 'الثانية', 'الثالثة', 'الرابعة'], correct: 1, explanation: 'أعلى أس للمتغير هو 2 لذلك هي من الدرجة الثانية' },
      { id: 'qq2', text: 'المعادلة التربيعية لها حلان دائماً', type: 'truefalse', options: ['صح', 'خطأ'], correct: 1, explanation: 'ليس دائماً، فقد لا يكون لها حلول حقيقية إذا كان المميز سالباً' },
      { id: 'qq3', text: 'ما قيمة المميز للمعادلة x² - 4x + 4 = 0 ؟', type: 'mcq', options: ['0', '4', '8', '-4'], correct: 0, explanation: 'المميز = b² - 4ac = 16 - 16 = 0' },
      { id: 'qq4', text: 'حل المعادلة x² - 9 = 0', type: 'mcq', options: ['x = 3', 'x = -3', 'x = ±3', 'x = 9'], correct: 2, explanation: 'x² = 9 إذن x = ±3' },
      { id: 'qq5', text: 'صيغة القانون العام هي x = (-b ± √(b²-4ac)) / 2a', type: 'truefalse', options: ['صح', 'خطأ'], correct: 0, explanation: 'نعم، هذه هي صيغة القانون العام لحل المعادلات التربيعية' },
    ]
  },
  {
    id: 'q2', title: 'اختبار الفعل المضارع', subjectId: 's2', gradeId: 'g9', chapter: 'الفصل الأول', duration: 10, questionCount: 8, attempts: 2150, isActive: true, createdAt: '2026-03-02',
    questions: [
      { id: 'qq6', text: 'الفعل المضارع يُرفع بالضمة الظاهرة', type: 'truefalse', options: ['صح', 'خطأ'], correct: 0, explanation: 'نعم، الفعل المضارع يُرفع بالضمة إذا لم يتصل بآخره شيء' },
      { id: 'qq7', text: 'ما علامة نصب الفعل المضارع؟', type: 'mcq', options: ['الضمة', 'الفتحة', 'الكسرة', 'السكون'], correct: 1, explanation: 'يُنصب الفعل المضارع بالفتحة الظاهرة' },
      { id: 'qq8', text: 'أيُّ الأدوات التالية تنصب الفعل المضارع؟', type: 'mcq', options: ['لم', 'أن', 'لا الناهية', 'لمّا'], correct: 1, explanation: 'أن من أدوات نصب الفعل المضارع' },
    ]
  },
  {
    id: 'q3', title: 'اختبار Present Perfect', subjectId: 's3', gradeId: 'g9', chapter: 'Unit 3', duration: 12, questionCount: 8, attempts: 1890, isActive: true, createdAt: '2026-03-03',
    questions: [
      { id: 'qq9', text: 'Which is correct: "I have went" or "I have gone"?', type: 'mcq', options: ['I have went', 'I have gone', 'Both are correct', 'Neither'], correct: 1, explanation: 'The past participle of "go" is "gone", not "went"' },
      { id: 'qq10', text: 'Present Perfect uses "has/have + past participle"', type: 'truefalse', options: ['True', 'False'], correct: 0, explanation: 'Yes, the formula is Subject + has/have + V3 (past participle)' },
    ]
  },
  {
    id: 'q4', title: 'اختبار قوانين نيوتن', subjectId: 's4', gradeId: 'g9', chapter: 'الفصل الثالث', duration: 20, questionCount: 12, attempts: 4100, isActive: true, createdAt: '2026-03-04',
    questions: [
      { id: 'qq11', text: 'قانون نيوتن الأول يسمى قانون القصور الذاتي', type: 'truefalse', options: ['صح', 'خطأ'], correct: 0, explanation: 'نعم، القانون الأول ينص على أن الجسم يبقى على حالته ما لم تؤثر عليه قوة خارجية' },
      { id: 'qq12', text: 'ما هي صيغة قانون نيوتن الثاني؟', type: 'mcq', options: ['F = mv', 'F = ma', 'F = mg', 'F = m/a'], correct: 1, explanation: 'القوة = الكتلة × التسارع' },
    ]
  },
];

// ===== TEACHERS =====
export const teachers: Teacher[] = [
  { id: 't1', name: 'أ. محمد العلي', avatar: '', subject: 'الرياضيات', bio: 'مدرس رياضيات بخبرة 15 سنة، متخصص في المرحلة المتوسطة', videoCount: 48 },
  { id: 't2', name: 'أ. سارة الكاظمي', avatar: '', subject: 'اللغة العربية', bio: 'مدرّسة لغة عربية حاصلة على الماجستير في النحو والصرف', videoCount: 36 },
  { id: 't3', name: 'أ. زينب الموسوي', avatar: '', subject: 'اللغة الإنكليزية', bio: 'مدرّسة لغة إنكليزية بأساليب تدريس حديثة وممتعة', videoCount: 42 },
  { id: 't4', name: 'أ. علي الحسيني', avatar: '', subject: 'العلوم', bio: 'مدرس علوم متخصص في الفيزياء والكيمياء', videoCount: 54 },
  { id: 't5', name: 'أ. حسن الربيعي', avatar: '', subject: 'الاجتماعيات', bio: 'مدرس تاريخ وجغرافيا بأسلوب ممتع وتفاعلي', videoCount: 28 },
  { id: 't6', name: 'أ. كريم الجابري', avatar: '', subject: 'الرياضيات', bio: 'مدرس رياضيات للمرحلة الإعدادية بخبرة 20 سنة', videoCount: 60 },
  { id: 't7', name: 'أ. أحمد الشمري', avatar: '', subject: 'الفيزياء', bio: 'أستاذ فيزياء في جامعة بغداد', videoCount: 50 },
  { id: 't8', name: 'أ. فاطمة النجار', avatar: '', subject: 'الكيمياء', bio: 'مدرّسة كيمياء متميزة بأسلوب مبسط', videoCount: 45 },
];

// ===== NOTIFICATIONS =====
export const notifications: Notification[] = [
  { id: 'n1', title: 'فيديو جديد', message: 'تم إضافة فيديو جديد في مادة الرياضيات - حل المعادلات', type: 'content', createdAt: '2026-03-10', isRead: false },
  { id: 'n2', title: 'اختبار جديد', message: 'اختبار جديد متاح في مادة العلوم - قوانين نيوتن', type: 'quiz', createdAt: '2026-03-09', isRead: false },
  { id: 'n3', title: 'مراجعة مهمة', message: 'مراجعة شاملة لمادة الإنكليزي قبل الامتحان النهائي', type: 'review', createdAt: '2026-03-08', isRead: true },
  { id: 'n4', title: 'ملزمة جديدة', message: 'تم رفع ملزمة العلوم الكاملة - الفصل الثالث', type: 'content', createdAt: '2026-03-07', isRead: true },
  { id: 'n5', title: 'إعلان مهم', message: 'سيتم إضافة محتوى جديد للصف السادس الإعدادي قريباً', type: 'announcement', createdAt: '2026-03-06', isRead: true },
];

// ===== STAGES META =====
export const stages = [
  { id: 'primary', name: 'المرحلة الابتدائية', icon: '🎒', color: '#10B981', description: 'من الصف الأول إلى السادس الابتدائي', gradeCount: 6 },
  { id: 'intermediate', name: 'المرحلة المتوسطة', icon: '📚', color: '#3B82F6', description: 'من الصف الأول إلى الثالث المتوسط', gradeCount: 3 },
  { id: 'preparatory', name: 'المرحلة الإعدادية', icon: '🎓', color: '#8B5CF6', description: 'من الصف الرابع إلى السادس الإعدادي', gradeCount: 3 },
];

export const stageToGradeMap: Record<string, string> = {
  'primary': 'ابتدائي',
  'intermediate': 'متوسط',
  'preparatory': 'إعدادي',
};

// ===== ADMIN STATS =====
export const adminStats = {
  totalUsers: 12450,
  totalVideos: 342,
  totalHandouts: 156,
  totalBooks: 48,
  totalQuizzes: 87,
  totalDownloads: 89200,
  totalViews: 245600,
  activeUsers: 3210,
};

// Iraqi provinces
export const provinces = [
  'بغداد', 'البصرة', 'نينوى', 'أربيل', 'النجف', 'كربلاء', 'ذي قار',
  'بابل', 'ديالى', 'الأنبار', 'كركوك', 'صلاح الدين', 'واسط', 'ميسان',
  'المثنى', 'القادسية', 'دهوك', 'السليمانية',
];
