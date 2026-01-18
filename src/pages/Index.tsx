import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'study_motivation_progress';
const API_URL = 'https://functions.poehali.dev/fde910e0-2b93-419a-a94b-d3d53ad2780a';

// Генерация уникального ID пользователя
const getUserId = () => {
  let userId = localStorage.getItem('user_id');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('user_id', userId);
  }
  return userId;
};

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  reward?: string;
}

interface CollectionCard {
  id: string;
  name: string;
  emoji: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string;
  achievementId: string;
}

interface Subject {
  name: string;
  color: string;
  icon: string;
  xp: number;
  level: number;
}

interface MockTest {
  id: string;
  subject: string;
  date: string;
  score: number;
  maxScore: number;
}

const Index = () => {
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [subjects, setSubjects] = useState<Subject[]>([
    { name: 'Биология', color: 'bg-orange-500', icon: 'Dna', xp: 0, level: 1 },
    { name: 'Русский', color: 'bg-red-500', icon: 'BookOpen', xp: 0, level: 1 },
    { name: 'Химия', color: 'bg-amber-500', icon: 'FlaskConical', xp: 0, level: 1 },
  ]);

  const [webinarsWatched, setWebinarsWatched] = useState(0);
  const [videosWatched, setVideosWatched] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [mockTestsCompleted, setMockTestsCompleted] = useState(0);
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [newTestScore, setNewTestScore] = useState('');
  const [newTestSubject, setNewTestSubject] = useState('Биология');

  const [collectionCards] = useState<CollectionCard[]>([
    { id: 'c1', name: 'Морская звезда', emoji: '⭐', rarity: 'common', description: 'Начало пути', achievementId: '1' },
    { id: 'c2', name: 'Огненная медуза', emoji: '🔥', rarity: 'rare', description: 'Пылающий стрик', achievementId: '2' },
    { id: 'c3', name: 'Королевский осьминог', emoji: '🐙', rarity: 'epic', description: 'Месяц силы', achievementId: '3' },
    { id: 'c4', name: 'Рыба-клоун', emoji: '🐠', rarity: 'common', description: 'Первые шаги в биологии', achievementId: '4' },
    { id: 'c5', name: 'Мудрый дельфин', emoji: '🐬', rarity: 'rare', description: 'Мастер биологии', achievementId: '5' },
    { id: 'c6', name: 'Синий кит', emoji: '🐋', rarity: 'epic', description: 'Профессор биологии', achievementId: '6' },
    { id: 'c7', name: 'Морской конёк', emoji: '🌊', rarity: 'common', description: 'Любитель русского', achievementId: '7' },
    { id: 'c8', name: 'Золотая рыбка', emoji: '🐟', rarity: 'rare', description: 'Грамотей', achievementId: '8' },
    { id: 'c9', name: 'Акула-молот', emoji: '🦈', rarity: 'epic', description: 'Знаток русского', achievementId: '9' },
    { id: 'c10', name: 'Краб', emoji: '🦀', rarity: 'common', description: 'Начинающий химик', achievementId: '10' },
    { id: 'c11', name: 'Омар', emoji: '🦞', rarity: 'rare', description: 'Химик-лаборант', achievementId: '11' },
    { id: 'c12', name: 'Электрический скат', emoji: '⚡', rarity: 'epic', description: 'Профессор химии', achievementId: '12' },
    { id: 'c13', name: 'Морской ёж', emoji: '🦔', rarity: 'common', description: 'Киноман', achievementId: '13' },
    { id: 'c14', name: 'Морская черепаха', emoji: '🐢', rarity: 'rare', description: 'Марафонец', achievementId: '14' },
    { id: 'c15', name: 'Нарвал', emoji: '🦄', rarity: 'epic', description: 'Киногуру', achievementId: '15' },
    { id: 'c16', name: 'Креветка', emoji: '🦐', rarity: 'common', description: 'Новичок', achievementId: '16' },
    { id: 'c17', name: 'Морской котик', emoji: '🦭', rarity: 'rare', description: 'Практик', achievementId: '17' },
    { id: 'c18', name: 'Косатка', emoji: '🐋', rarity: 'epic', description: 'Мастер заданий', achievementId: '18' },
    { id: 'c19', name: 'Золотой дракон', emoji: '🐉', rarity: 'legendary', description: 'Перфекционист', achievementId: '19' },
    { id: 'c20', name: 'Летучая рыба', emoji: '🐠', rarity: 'rare', description: 'Испытание огнём', achievementId: '20' },
    { id: 'c21', name: 'Меч-рыба', emoji: '🗡️', rarity: 'epic', description: 'Боец экзаменов', achievementId: '21' },
    { id: 'c22', name: 'Морской император', emoji: '👑', rarity: 'legendary', description: 'Король пробников', achievementId: '22' },
    { id: 'c23', name: 'Электрический угорь', emoji: '⚡', rarity: 'common', description: 'Энергия', achievementId: '23' },
    { id: 'c24', name: 'Сияющий кальмар', emoji: '✨', rarity: 'rare', description: 'Звезда', achievementId: '24' },
    { id: 'c25', name: 'Космическая медуза', emoji: '🌟', rarity: 'epic', description: 'Супернова', achievementId: '25' },
    { id: 'c26', name: 'Ракета-рыба', emoji: '🚀', rarity: 'epic', description: 'Космонавт', achievementId: '26' },
    { id: 'c27', name: 'Властелин океана', emoji: '🌌', rarity: 'legendary', description: 'Покоритель вселенной', achievementId: '27' },
    { id: 'c28', name: 'Морская звезда', emoji: '📈', rarity: 'rare', description: 'Прогрессор', achievementId: '28' },
    { id: 'c29', name: 'Древний краб', emoji: '🦀', rarity: 'epic', description: 'Ветеран', achievementId: '29' },
    { id: 'c30', name: 'Посейдон', emoji: '🔱', rarity: 'legendary', description: 'Легенда', achievementId: '30' },
  ]);

  const [unlockedCards, setUnlockedCards] = useState<string[]>([]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: '1', title: '🌟 Первый шаг', description: 'Выполни первое задание', icon: 'Sparkles', unlocked: false, progress: 0, maxProgress: 1, reward: 'Морская звезда' },
    { id: '2', title: '🔥 Неделя силы', description: 'Занимайся 7 дней подряд', icon: 'Flame', unlocked: false, progress: 0, maxProgress: 7, reward: 'Огненная медуза' },
    { id: '3', title: '🌊 Месяц мощи', description: 'Занимайся 30 дней подряд', icon: 'Waves', unlocked: false, progress: 0, maxProgress: 30, reward: 'Королевский осьминог' },
    { id: '4', title: '🧬 Юный биолог', description: 'Набери 100 XP по биологии', icon: 'Dna', unlocked: false, progress: 0, maxProgress: 100, reward: 'Рыба-клоун' },
    { id: '5', title: '🔬 Мастер биологии', description: 'Набери 500 XP по биологии', icon: 'Microscope', unlocked: false, progress: 0, maxProgress: 500, reward: 'Мудрый дельфин' },
    { id: '6', title: '🌿 Профессор биологии', description: 'Набери 1000 XP по биологии', icon: 'TreeDeciduous', unlocked: false, progress: 0, maxProgress: 1000, reward: 'Синий кит' },
    { id: '7', title: '📖 Любитель русского', description: 'Набери 100 XP по русскому', icon: 'BookOpen', unlocked: false, progress: 0, maxProgress: 100, reward: 'Морской конёк' },
    { id: '8', title: '✍️ Грамотей', description: 'Набери 500 XP по русскому', icon: 'PenTool', unlocked: false, progress: 0, maxProgress: 500, reward: 'Золотая рыбка' },
    { id: '9', title: '📚 Знаток русского', description: 'Набери 1000 XP по русскому', icon: 'Library', unlocked: false, progress: 0, maxProgress: 1000, reward: 'Акула-молот' },
    { id: '10', title: '⚗️ Начинающий химик', description: 'Набери 100 XP по химии', icon: 'FlaskConical', unlocked: false, progress: 0, maxProgress: 100, reward: 'Краб' },
    { id: '11', title: '🧪 Химик-лаборант', description: 'Набери 500 XP по химии', icon: 'FlaskRound', unlocked: false, progress: 0, maxProgress: 500, reward: 'Омар' },
    { id: '12', title: '⚛️ Профессор химии', description: 'Набери 1000 XP по химии', icon: 'Atom', unlocked: false, progress: 0, maxProgress: 1000, reward: 'Электрический скат' },
    { id: '13', title: '🎬 Киноман', description: 'Посмотри 5 вебинаров', icon: 'Video', unlocked: false, progress: 0, maxProgress: 5, reward: 'Морской ёж' },
    { id: '14', title: '📺 Марафонец', description: 'Посмотри 20 вебинаров', icon: 'Monitor', unlocked: false, progress: 0, maxProgress: 20, reward: 'Морская черепаха' },
    { id: '15', title: '🎥 Киногуру', description: 'Посмотри 50 вебинаров', icon: 'Film', unlocked: false, progress: 0, maxProgress: 50, reward: 'Нарвал' },
    { id: '16', title: '📝 Новичок', description: 'Реши 10 заданий', icon: 'FileText', unlocked: false, progress: 0, maxProgress: 10, reward: 'Креветка' },
    { id: '17', title: '✅ Практик', description: 'Реши 50 заданий', icon: 'CheckSquare', unlocked: false, progress: 0, maxProgress: 50, reward: 'Морской котик' },
    { id: '18', title: '🎯 Мастер заданий', description: 'Реши 100 заданий', icon: 'Target', unlocked: false, progress: 0, maxProgress: 100, reward: 'Косатка' },
    { id: '19', title: '💯 Перфекционист', description: 'Реши 200 заданий', icon: 'Award', unlocked: false, progress: 0, maxProgress: 200, reward: 'Золотой дракон' },
    { id: '20', title: '🎓 Испытание огнём', description: 'Реши 5 пробников', icon: 'GraduationCap', unlocked: false, progress: 0, maxProgress: 5, reward: 'Летучая рыба' },
    { id: '21', title: '🏆 Боец экзаменов', description: 'Реши 10 пробников', icon: 'Trophy', unlocked: false, progress: 0, maxProgress: 10, reward: 'Меч-рыба' },
    { id: '22', title: '👑 Король пробников', description: 'Реши 25 пробников', icon: 'Crown', unlocked: false, progress: 0, maxProgress: 25, reward: 'Морской император' },
    { id: '23', title: '⚡ Энергия', description: 'Набери 100 общего XP', icon: 'Zap', unlocked: false, progress: 0, maxProgress: 100, reward: 'Электрический угорь' },
    { id: '24', title: '💫 Звезда', description: 'Набери 500 общего XP', icon: 'Star', unlocked: false, progress: 0, maxProgress: 500, reward: 'Сияющий кальмар' },
    { id: '25', title: '🌟 Супернова', description: 'Набери 1000 общего XP', icon: 'Sparkle', unlocked: false, progress: 0, maxProgress: 1000, reward: 'Космическая медуза' },
    { id: '26', title: '🚀 Космонавт', description: 'Набери 2500 общего XP', icon: 'Rocket', unlocked: false, progress: 0, maxProgress: 2500, reward: 'Ракета-рыба' },
    { id: '27', title: '🌌 Покоритель вселенной', description: 'Набери 5000 общего XP', icon: 'Galaxy', unlocked: false, progress: 0, maxProgress: 5000, reward: 'Властелин океана' },
    { id: '28', title: '📈 Прогрессор', description: 'Достигни 5 уровня', icon: 'TrendingUp', unlocked: false, progress: 0, maxProgress: 5, reward: 'Морская звезда' },
    { id: '29', title: '🎖️ Ветеран', description: 'Достигни 10 уровня', icon: 'Medal', unlocked: false, progress: 0, maxProgress: 10, reward: 'Древний краб' },
    { id: '30', title: '🦸 Легенда', description: 'Достигни 20 уровня', icon: 'Swords', unlocked: false, progress: 0, maxProgress: 20, reward: 'Посейдон' },
  ]);

  // Загрузка данных при монтировании компонента (сначала из облака, затем localStorage)
  useEffect(() => {
    const loadProgress = async () => {
      const userId = getUserId();
      
      try {
        // Попытка загрузить из облака
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': userId
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.totalXP !== undefined) {
            setTotalXP(data.totalXP);
            setLevel(data.level);
            setStreak(data.streak);
            setSubjects(data.subjects);
            setWebinarsWatched(data.webinarsWatched);
            setVideosWatched(data.videosWatched);
            setTasksCompleted(data.tasksCompleted);
            setMockTestsCompleted(data.mockTestsCompleted);
            setMockTests(data.mockTests);
            setAchievements(data.achievements);
            setUnlockedCards(data.unlockedCards || []);
            toast.success('Прогресс загружен из облака! ☁️', { duration: 2000 });
            return;
          }
        }
      } catch (error) {
        console.log('Не удалось загрузить из облака, пробую localStorage:', error);
      }
      
      // Fallback на localStorage
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setTotalXP(parsed.totalXP || 0);
          setLevel(parsed.level || 1);
          setStreak(parsed.streak || 0);
          setSubjects(parsed.subjects || subjects);
          setWebinarsWatched(parsed.webinarsWatched || 0);
          setVideosWatched(parsed.videosWatched || 0);
          setTasksCompleted(parsed.tasksCompleted || 0);
          setMockTestsCompleted(parsed.mockTestsCompleted || 0);
          setMockTests(parsed.mockTests || []);
          setAchievements(parsed.achievements || achievements);
          setUnlockedCards(parsed.unlockedCards || []);
          toast.success('Прогресс загружен! 🎉', { duration: 2000 });
        } catch (error) {
          console.error('Ошибка загрузки данных:', error);
        }
      }
    };
    
    loadProgress();
  }, []);

  // Автосохранение в localStorage и облако при любом изменении
  useEffect(() => {
    const dataToSave = {
      totalXP,
      level,
      streak,
      subjects,
      webinarsWatched,
      videosWatched,
      tasksCompleted,
      mockTestsCompleted,
      mockTests,
      achievements,
      unlockedCards,
      lastSaved: new Date().toISOString(),
    };
    
    // Сохранение в localStorage (мгновенно)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    
    // Сохранение в облако (с debounce через setTimeout)
    const saveToCloud = setTimeout(async () => {
      const userId = getUserId();
      
      try {
        await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': userId
          },
          body: JSON.stringify(dataToSave)
        });
      } catch (error) {
        console.error('Ошибка сохранения в облако:', error);
      }
    }, 2000); // Сохраняем через 2 секунды после последнего изменения
    
    return () => clearTimeout(saveToCloud);
  }, [totalXP, level, streak, subjects, webinarsWatched, videosWatched, tasksCompleted, mockTestsCompleted, mockTests, achievements, unlockedCards]);

  const playSound = (type: 'success' | 'achievement') => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'success') {
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } else {
      [523, 659, 784, 1047].forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.2, audioContext.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.1 + 0.3);
        osc.start(audioContext.currentTime + i * 0.1);
        osc.stop(audioContext.currentTime + i * 0.1 + 0.3);
      });
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f97316', '#ef4444', '#fde047']
    });
  };

  const checkAchievements = () => {
    setAchievements(prev => {
      const updated = prev.map(ach => {
        if (ach.unlocked) return ach;

        let currentProgress = 0;
        let shouldUnlock = false;

        // Достижения за задания
        if (ach.id === '1') currentProgress = tasksCompleted;
        if (ach.id === '16') currentProgress = tasksCompleted;
        if (ach.id === '17') currentProgress = tasksCompleted;
        if (ach.id === '18') currentProgress = tasksCompleted;
        if (ach.id === '19') currentProgress = tasksCompleted;

        // Достижения за стрик
        if (ach.id === '2') currentProgress = streak;
        if (ach.id === '3') currentProgress = streak;

        // Достижения по предметам
        const bioXP = subjects.find(s => s.name === 'Биология')?.xp || 0;
        const rusXP = subjects.find(s => s.name === 'Русский')?.xp || 0;
        const chemXP = subjects.find(s => s.name === 'Химия')?.xp || 0;

        if (ach.id === '4' || ach.id === '5' || ach.id === '6') currentProgress = bioXP;
        if (ach.id === '7' || ach.id === '8' || ach.id === '9') currentProgress = rusXP;
        if (ach.id === '10' || ach.id === '11' || ach.id === '12') currentProgress = chemXP;

        // Достижения за вебинары
        if (ach.id === '13' || ach.id === '14' || ach.id === '15') currentProgress = webinarsWatched;

        // Достижения за пробники
        if (ach.id === '20' || ach.id === '21' || ach.id === '22') currentProgress = mockTestsCompleted;

        // Достижения за общий XP
        if (ach.id === '23' || ach.id === '24' || ach.id === '25' || ach.id === '26' || ach.id === '27') currentProgress = totalXP;

        // Достижения за уровень
        if (ach.id === '28' || ach.id === '29' || ach.id === '30') currentProgress = level;

        if (currentProgress >= (ach.maxProgress || 0)) {
          shouldUnlock = true;
        }

        if (shouldUnlock) {
          const card = collectionCards.find(c => c.achievementId === ach.id);
          if (card && !unlockedCards.includes(card.id)) {
            setUnlockedCards(prev => [...prev, card.id]);
            toast.success(`🏆 Достижение разблокировано: ${ach.title}!\n🎁 Получена карточка: ${card.emoji} ${card.name}!`, { duration: 6000 });
          } else {
            toast.success(`🏆 Достижение разблокировано: ${ach.title}!`, { duration: 5000 });
          }
          triggerConfetti();
          playSound('achievement');
          return { ...ach, unlocked: true, progress: currentProgress };
        }

        return { ...ach, progress: currentProgress };
      });

      return updated;
    });
  };

  useEffect(() => {
    checkAchievements();
  }, [tasksCompleted, streak, subjects, webinarsWatched, mockTestsCompleted, totalXP, level]);

  useEffect(() => {
    const newLevel = Math.floor(totalXP / 500) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      toast.success(`🎊 Новый уровень! Теперь ты ${newLevel} уровня!`, { duration: 4000 });
      triggerConfetti();
      playSound('achievement');
    }
  }, [totalXP]);

  const addXP = (amount: number, subjectName: string, activityName: string, activityType: 'webinar' | 'video' | 'task' | 'mock') => {
    setTotalXP(prev => prev + amount);
    setSubjects(prev => prev.map(s => 
      s.name === subjectName ? { ...s, xp: s.xp + amount } : s
    ));

    if (activityType === 'webinar') setWebinarsWatched(prev => prev + 1);
    if (activityType === 'video') setVideosWatched(prev => prev + 1);
    if (activityType === 'task') setTasksCompleted(prev => prev + 1);
    if (activityType === 'mock') setMockTestsCompleted(prev => prev + 1);
    
    playSound('success');
    
    const messages = [
      `🎉 Ты крутышка! +${amount} XP за ${activityName}! Так держать!`,
      `💪 Большая молодец! Ты получил ${amount} XP! Горжусь тобой!`,
      `⭐ Вау, какая умница! +${amount} опыта! Ты супер!`,
      `🔥 Ты невероятная! +${amount} XP в копилку! Продолжай в том же духе!`,
      `✨ Потрясающе! Ещё ${amount} XP! Ты просто огонь!`,
      `🌟 Браво! Так держать! +${amount} XP! Ты лучшая!`,
      `🎊 Ура! Ты большая умничка! +${amount} опыта заслужила!`,
      `💖 Я в тебя верю! +${amount} XP! Ты справляешься отлично!`,
      `🚀 Вперёд к звёздам! +${amount} XP! Ты настоящая героиня!`,
      `🏆 Чемпионка! +${amount} XP за твоё старание!`,
    ];
    
    toast.success(messages[Math.floor(Math.random() * messages.length)], {
      duration: 3000,
    });

    if (amount >= 100) {
      triggerConfetti();
      playSound('achievement');
    }
  };

  const addMockTest = () => {
    if (!newTestScore || parseInt(newTestScore) < 0) return;
    
    const score = parseInt(newTestScore);
    const maxScore = 100;
    const newTest: MockTest = {
      id: Date.now().toString(),
      subject: newTestSubject,
      date: new Date().toLocaleDateString('ru-RU'),
      score,
      maxScore,
    };
    
    setMockTests(prev => [newTest, ...prev]);
    addXP(100, newTestSubject, 'пробник', 'mock');
    setNewTestScore('');
    
    toast.success(`Пробник записан! Результат: ${score}/${maxScore}`, {
      duration: 3000,
    });
  };

  const handleStarHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { x, y },
      colors: ['#fbbf24', '#f97316', '#ef4444', '#fde047', '#facc15', '#fb923c'],
      ticks: 150,
      gravity: 1,
      scalar: 1.2,
      drift: 0
    });
    
    playSound('achievement');
  };

  const levelProgress = ((totalXP % 500) / 500) * 100;
  const nextLevelXP = (level * 500) - (totalXP % 500);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-600 via-orange-500 to-red-600 relative overflow-hidden">
      {/* Солнышко */}
      <div className="absolute top-10 right-10 text-9xl animate-rotate-slow">☀️</div>
      
      {/* Деревья */}
      <div className="absolute bottom-0 left-0 text-[120px] opacity-30">🌴</div>
      <div className="absolute bottom-0 left-32 text-[100px] opacity-30">🌳</div>
      <div className="absolute bottom-0 right-0 text-[120px] opacity-30">🌲</div>
      <div className="absolute bottom-0 right-32 text-[100px] opacity-30">🌴</div>

      {/* Черепашки */}
      <div className="absolute top-1/3 left-20 text-6xl opacity-40 animate-swim" style={{ animationDelay: '0s', animationDuration: '5s' }}>🐢</div>
      <div className="absolute top-2/3 right-32 text-5xl opacity-40 animate-swim" style={{ animationDelay: '1s', animationDuration: '6s' }}>🐢</div>

      {/* Медузы (SVG) */}
      <svg className="absolute bottom-20 left-10 opacity-50 animate-float" style={{ animationDelay: '0.5s', zIndex: 5 }} width="100" height="100" viewBox="0 0 100 100">
        <ellipse cx="50" cy="35" rx="30" ry="25" fill="#E91E63" opacity="0.7"/>
        <path d="M 30 50 Q 25 80 30 95" stroke="#E91E63" strokeWidth="3" fill="none" opacity="0.6"/>
        <path d="M 40 50 Q 38 85 42 95" stroke="#E91E63" strokeWidth="3" fill="none" opacity="0.6"/>
        <path d="M 50 50 Q 50 90 50 98" stroke="#E91E63" strokeWidth="3" fill="none" opacity="0.6"/>
        <path d="M 60 50 Q 62 85 58 95" stroke="#E91E63" strokeWidth="3" fill="none" opacity="0.6"/>
        <path d="M 70 50 Q 75 80 70 95" stroke="#E91E63" strokeWidth="3" fill="none" opacity="0.6"/>
        <circle cx="42" cy="32" r="4" fill="white"/>
        <circle cx="58" cy="32" r="4" fill="white"/>
      </svg>
      <svg className="absolute bottom-32 right-10 opacity-50 animate-float" style={{ animationDelay: '1.5s', zIndex: 5 }} width="90" height="90" viewBox="0 0 100 100">
        <ellipse cx="50" cy="35" rx="28" ry="23" fill="#9C27B0" opacity="0.7"/>
        <path d="M 32 50 Q 28 78 32 92" stroke="#9C27B0" strokeWidth="3" fill="none" opacity="0.6"/>
        <path d="M 42 50 Q 40 83 44 92" stroke="#9C27B0" strokeWidth="3" fill="none" opacity="0.6"/>
        <path d="M 50 50 Q 50 88 50 96" stroke="#9C27B0" strokeWidth="3" fill="none" opacity="0.6"/>
        <path d="M 58 50 Q 60 83 56 92" stroke="#9C27B0" strokeWidth="3" fill="none" opacity="0.6"/>
        <path d="M 68 50 Q 72 78 68 92" stroke="#9C27B0" strokeWidth="3" fill="none" opacity="0.6"/>
        <circle cx="43" cy="32" r="3" fill="white"/>
        <circle cx="57" cy="32" r="3" fill="white"/>
      </svg>
      <svg className="absolute bottom-40 left-[15%] opacity-50 animate-float" style={{ animationDelay: '2.5s', zIndex: 5 }} width="80" height="80" viewBox="0 0 100 100">
        <ellipse cx="50" cy="35" rx="26" ry="21" fill="#FF5722" opacity="0.7"/>
        <path d="M 33 50 Q 30 76 33 90" stroke="#FF5722" strokeWidth="2.5" fill="none" opacity="0.6"/>
        <path d="M 43 50 Q 42 81 45 90" stroke="#FF5722" strokeWidth="2.5" fill="none" opacity="0.6"/>
        <path d="M 50 50 Q 50 86 50 94" stroke="#FF5722" strokeWidth="2.5" fill="none" opacity="0.6"/>
        <path d="M 57 50 Q 58 81 55 90" stroke="#FF5722" strokeWidth="2.5" fill="none" opacity="0.6"/>
        <path d="M 67 50 Q 70 76 67 90" stroke="#FF5722" strokeWidth="2.5" fill="none" opacity="0.6"/>
        <circle cx="44" cy="33" r="3" fill="white"/>
        <circle cx="56" cy="33" r="3" fill="white"/>
      </svg>
      <svg className="absolute bottom-24 right-[15%] opacity-50 animate-float" style={{ animationDelay: '3.5s', zIndex: 5 }} width="90" height="90" viewBox="0 0 100 100">
        <ellipse cx="50" cy="35" rx="28" ry="23" fill="#FF9800" opacity="0.7"/>
        <path d="M 32 50 Q 29 77 32 91" stroke="#FF9800" strokeWidth="3" fill="none" opacity="0.6"/>
        <path d="M 42 50 Q 41 82 45 91" stroke="#FF9800" strokeWidth="3" fill="none" opacity="0.6"/>
        <path d="M 50 50 Q 50 87 50 95" stroke="#FF9800" strokeWidth="3" fill="none" opacity="0.6"/>
        <path d="M 58 50 Q 59 82 55 91" stroke="#FF9800" strokeWidth="3" fill="none" opacity="0.6"/>
        <path d="M 68 50 Q 71 77 68 91" stroke="#FF9800" strokeWidth="3" fill="none" opacity="0.6"/>
        <circle cx="43" cy="32" r="3" fill="white"/>
        <circle cx="57" cy="32" r="3" fill="white"/>
      </svg>

      {/* Падающие разноцветные звёздочки */}
      {[...Array(12)].map((_, i) => {
        const colors = ['#fbbf24', '#f97316', '#ef4444', '#fde047', '#facc15', '#fb923c'];
        const positions = [8, 15, 23, 32, 41, 48, 56, 64, 71, 78, 85, 92];
        const durations = [18, 22, 16, 20, 24, 19, 17, 21, 23, 19, 18, 20];
        const delays = [0, 2, 4, 1, 3, 5, 2.5, 4.5, 1.5, 3.5, 0.5, 5.5];
        const sizes = [40, 48, 36, 52, 44, 38, 50, 42, 46, 40, 54, 38];
        
        return (
          <div
            key={i}
            className="absolute animate-fall-star cursor-pointer transition-all hover:scale-150 hover:brightness-150"
            style={{
              left: `${positions[i]}%`,
              top: '-100px',
              fontSize: `${sizes[i]}px`,
              filter: `drop-shadow(0 0 10px ${colors[i % colors.length]})`,
              animationDuration: `${durations[i]}s`,
              animationDelay: `${delays[i]}s`,
              zIndex: 20,
            }}
            onMouseEnter={handleStarHover}
          >
            ⭐
          </div>
        );
      })}

      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-5xl font-bold text-white mb-2 font-['Montserrat'] drop-shadow-lg">
            Покоритель экзаменов 🚀
          </h1>
          <p className="text-amber-100">Твой путь к успеху начинается здесь</p>
        </div>

        <Card className="mb-8 p-6 bg-gradient-to-r from-yellow-400/40 via-orange-400/40 to-red-400/40 backdrop-blur-xl border-yellow-300/60 animate-scale-in shadow-2xl">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-xl border-4 border-white/30 hover:scale-110 transition-transform cursor-pointer animate-pulse">
                {level}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white drop-shadow-lg">Уровень {level}</h2>
                <p className="text-white font-semibold drop-shadow">Всего опыта: {totalXP} XP</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Flame" className="text-yellow-300" size={24} />
                <span className="text-2xl font-bold text-white drop-shadow-lg">{streak}</span>
                <span className="text-white font-semibold drop-shadow">дней подряд</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-white font-semibold drop-shadow">
              <span>До следующего уровня</span>
              <span>{nextLevelXP} XP</span>
            </div>
            <Progress value={levelProgress} className="h-3" />
          </div>
        </Card>

        <Tabs defaultValue="actions" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6 bg-white/20 backdrop-blur-lg">
            <TabsTrigger value="actions" className="data-[state=active]:bg-orange-500">
              <Icon name="Zap" size={16} className="mr-2" />
              Действия
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-orange-500">
              <Icon name="TrendingUp" size={16} className="mr-2" />
              Прогресс
            </TabsTrigger>
            <TabsTrigger value="mocks" className="data-[state=active]:bg-orange-500">
              <Icon name="Target" size={16} className="mr-2" />
              Пробники
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-orange-500">
              <Icon name="Award" size={16} className="mr-2" />
              Награды
            </TabsTrigger>
            <TabsTrigger value="collection" className="data-[state=active]:bg-orange-500 relative">
              <Icon name="Gem" size={16} className="mr-2" />
              Коллекция
              {unlockedCards.length > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-yellow-400 text-black px-1.5 py-0.5 text-xs">
                  {unlockedCards.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-orange-500">
              <Icon name="BarChart3" size={16} className="mr-2" />
              Статистика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="actions" className="animate-fade-in">
            <div className="grid gap-4 md:grid-cols-2">
              {subjects.map(subject => (
                <Card key={subject.name} className="p-6 bg-white/10 backdrop-blur-lg border-white/30 hover-scale shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`${subject.color} p-3 rounded-lg shadow-lg hover:scale-110 transition-transform`}>
                      <Icon name={subject.icon as any} className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{subject.name}</h3>
                      <p className="text-amber-100">Уровень {subject.level} • {subject.xp} XP</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={() => addXP(50, subject.name, 'вебинар', 'webinar')}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all hover:scale-105 hover:shadow-lg"
                    >
                      <Icon name="Video" size={16} className="mr-2" />
                      Вебинар +50
                    </Button>
                    <Button 
                      onClick={() => addXP(30, subject.name, 'задание', 'task')}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all hover:scale-105 hover:shadow-lg"
                    >
                      <Icon name="FileText" size={16} className="mr-2" />
                      Задание +30
                    </Button>
                    <Button 
                      onClick={() => addXP(100, subject.name, 'пробник', 'mock')}
                      className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 transition-all hover:scale-105 hover:shadow-lg"
                    >
                      <Icon name="Target" size={16} className="mr-2" />
                      Пробник +100
                    </Button>
                    <Button 
                      onClick={() => addXP(20, subject.name, 'видео', 'video')}
                      className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 transition-all hover:scale-105 hover:shadow-lg"
                    >
                      <Icon name="Play" size={16} className="mr-2" />
                      Видео +20
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="animate-fade-in">
            <div className="grid gap-6">
              {subjects.map(subject => {
                const subjectLevelProgress = ((subject.xp % 200) / 200) * 100;
                return (
                  <Card key={subject.name} className="p-6 bg-white/10 backdrop-blur-lg border-white/30 hover-scale shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`${subject.color} p-3 rounded-lg shadow-lg hover:scale-110 transition-transform`}>
                        <Icon name={subject.icon as any} className="text-white" size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xl font-bold text-white">{subject.name}</h3>
                          <Badge className={`${subject.color} text-white shadow-md hover:scale-105 transition-transform`}>
                            Уровень {subject.level}
                          </Badge>
                        </div>
                        <Progress value={subjectLevelProgress} className="h-3 mb-2" />
                        <div className="flex justify-between text-sm text-amber-100">
                          <span>{subject.xp} XP</span>
                          <span>До уровня {subject.level + 1}: {200 - (subject.xp % 200)} XP</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="animate-fade-in">
            <div className="grid gap-4 md:grid-cols-2">
              {achievements.map(achievement => (
                <Card 
                  key={achievement.id} 
                  className={`p-6 transition-all hover-scale ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-br from-yellow-400/40 to-orange-500/40 border-4 border-yellow-400 shadow-2xl shadow-yellow-500/50 scale-105' 
                      : 'bg-white/10 border-white/30 opacity-70'
                  } backdrop-blur-lg`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-4 rounded-lg shadow-lg transition-transform ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-br from-yellow-300 to-orange-400 scale-110 shadow-xl' 
                        : 'bg-gray-700/50'
                    } hover:scale-125`}>
                      <Icon name={achievement.icon as any} className={`${achievement.unlocked ? 'text-white' : 'text-gray-400'}`} size={28} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-xl font-bold ${achievement.unlocked ? 'text-yellow-100 drop-shadow-lg' : 'text-white/60'}`}>
                          {achievement.title}
                        </h3>
                        {achievement.unlocked && (
                          <Badge className="bg-green-500 text-white animate-pulse">✓ Выполнено</Badge>
                        )}
                      </div>
                      <p className={`text-sm mb-2 ${achievement.unlocked ? 'text-yellow-200' : 'text-white/50'}`}>
                        {achievement.description}
                      </p>
                      {achievement.reward && (
                        <p className={`text-sm font-semibold ${achievement.unlocked ? 'text-yellow-300' : 'text-white/40'}`}>
                          🎁 Награда: {achievement.reward}
                        </p>
                      )}
                      {!achievement.unlocked && achievement.progress !== undefined && (
                        <div className="space-y-1 mt-3">
                          <Progress 
                            value={(achievement.progress! / achievement.maxProgress!) * 100} 
                            className="h-3 bg-gray-700" 
                          />
                          <p className="text-sm text-white/70 font-semibold">
                            Прогресс: {achievement.progress} / {achievement.maxProgress}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mocks" className="animate-fade-in">
            <Card className="p-6 bg-gradient-to-br from-orange-500/40 to-red-500/40 backdrop-blur-xl border-orange-300/60 mb-6 hover-scale shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 drop-shadow-lg">
                <Icon name="Target" size={24} className="text-yellow-300" />
                Записать новый пробник
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                <Select value={newTestSubject} onValueChange={setNewTestSubject}>
                  <SelectTrigger className="bg-white/20 border-white/40 text-white font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Биология">Биология</SelectItem>
                    <SelectItem value="Русский">Русский</SelectItem>
                    <SelectItem value="Химия">Химия</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  type="number"
                  placeholder="Балл (из 100)"
                  value={newTestScore}
                  onChange={(e) => setNewTestScore(e.target.value)}
                  className="bg-white/20 border-white/40 text-white font-semibold placeholder:text-white/70"
                />
                <Button 
                  onClick={addMockTest}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:scale-105 transition-all"
                >
                  <Icon name="Plus" size={16} className="mr-2" />
                  Добавить
                </Button>
              </div>
            </Card>

            {mockTests.length > 0 && (
              <Card className="p-6 bg-white/20 backdrop-blur-xl border-white/40 mb-6 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 drop-shadow-lg">
                  <Icon name="TrendingUp" size={24} className="text-yellow-300" />
                  График прогресса
                </h3>
                <div className="space-y-6">
                  {subjects.map(subject => {
                    const subjectTests = mockTests.filter(t => t.subject === subject.name);
                    if (subjectTests.length === 0) return null;
                    
                    const avgScore = subjectTests.reduce((sum, t) => sum + t.score, 0) / subjectTests.length;
                    const maxScore = Math.max(...subjectTests.map(t => t.score));
                    const minScore = Math.min(...subjectTests.map(t => t.score));
                    
                    return (
                      <div key={subject.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`${subject.color} p-2 rounded-lg`}>
                              <Icon name={subject.icon as any} className="text-white" size={16} />
                            </div>
                            <span className="text-white font-semibold">{subject.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-bold drop-shadow">Средний: {avgScore.toFixed(1)}</p>
                            <p className="text-white text-xs drop-shadow">Мин: {minScore} • Макс: {maxScore}</p>
                          </div>
                        </div>
                        <div className="flex items-end gap-1 h-32 bg-white/5 rounded-lg p-3">
                          {subjectTests.map((test, idx) => (
                            <div key={test.id} className="flex-1 flex flex-col items-center gap-1 group">
                              <div 
                                className={`w-full ${subject.color} rounded-t transition-all hover:opacity-80 cursor-pointer`}
                                style={{ height: `${(test.score / 100) * 100}%` }}
                                title={`${test.score} баллов - ${test.date}`}
                              />
                              <span className="text-xs text-white font-semibold drop-shadow">{idx + 1}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-white font-semibold drop-shadow">
                          <span>Попытка 1</span>
                          <span>Попытка {subjectTests.length}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {mockTests.length === 0 ? (
              <Card className="p-12 bg-white/20 backdrop-blur-xl border-white/40 text-center shadow-xl">
                <Icon name="Target" size={48} className="text-white mx-auto mb-4" />
                <p className="text-lg text-white font-bold drop-shadow-lg">Пока нет записанных пробников</p>
                <p className="text-sm text-white mt-2 drop-shadow">Добавь свой первый результат!</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {mockTests.map((test) => (
                  <Card key={test.id} className="p-6 bg-white/20 backdrop-blur-xl border-white/40 hover-scale shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`${subjects.find(s => s.name === test.subject)?.color} p-3 rounded-lg shadow-lg`}>
                          <Icon name={subjects.find(s => s.name === test.subject)?.icon as any} className="text-white" size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white drop-shadow-lg">{test.subject}</h3>
                          <p className="text-white text-sm drop-shadow">{test.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl font-bold text-white font-['Rubik'] drop-shadow-lg">{test.score}</p>
                        <p className="text-white text-sm drop-shadow">из {test.maxScore}</p>
                        <Progress value={(test.score / test.maxScore) * 100} className="h-2 mt-2 w-24" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="collection" className="animate-fade-in">
            <Card className="p-6 bg-gradient-to-br from-purple-500/40 to-blue-500/40 backdrop-blur-xl border-purple-300/60 mb-6 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg flex items-center gap-2">
                <Icon name="Gem" size={28} className="text-yellow-300" />
                Морская коллекция
              </h3>
              <p className="text-white/90 mb-4">Собери всех морских обитателей за выполнение достижений!</p>
              <div className="flex items-center gap-4">
                <Progress value={(unlockedCards.length / collectionCards.length) * 100} className="h-4 flex-1" />
                <p className="text-white font-bold text-lg">{unlockedCards.length}/{collectionCards.length}</p>
              </div>
            </Card>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              {collectionCards.map(card => {
                const isUnlocked = unlockedCards.includes(card.id);
                const rarityColors = {
                  common: 'from-gray-400/30 to-gray-500/30 border-gray-400/50',
                  rare: 'from-blue-400/30 to-blue-600/30 border-blue-400/60',
                  epic: 'from-purple-400/30 to-purple-600/30 border-purple-400/60',
                  legendary: 'from-yellow-400/40 to-orange-500/40 border-yellow-400/80'
                };
                const rarityGlow = {
                  common: 'shadow-gray-500/20',
                  rare: 'shadow-blue-500/40',
                  epic: 'shadow-purple-500/50',
                  legendary: 'shadow-yellow-500/60'
                };
                const rarityText = {
                  common: 'Обычная',
                  rare: 'Редкая',
                  epic: 'Эпическая',
                  legendary: 'Легендарная'
                };

                return (
                  <Card 
                    key={card.id}
                    className={`p-4 transition-all hover-scale ${
                      isUnlocked 
                        ? `bg-gradient-to-br ${rarityColors[card.rarity]} ${rarityGlow[card.rarity]} shadow-xl backdrop-blur-lg` 
                        : 'bg-black/30 border-gray-600/50 backdrop-blur-lg opacity-40 grayscale'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-6xl mb-3 ${isUnlocked ? 'animate-bounce' : 'blur-sm'}`}>
                        {isUnlocked ? card.emoji : '❓'}
                      </div>
                      <h4 className={`font-bold mb-1 ${isUnlocked ? 'text-white text-lg' : 'text-gray-500 text-sm'}`}>
                        {isUnlocked ? card.name : '???'}
                      </h4>
                      {isUnlocked && (
                        <>
                          <Badge className={`mb-2 ${
                            card.rarity === 'legendary' ? 'bg-yellow-500' :
                            card.rarity === 'epic' ? 'bg-purple-500' :
                            card.rarity === 'rare' ? 'bg-blue-500' : 'bg-gray-500'
                          } text-white`}>
                            {rarityText[card.rarity]}
                          </Badge>
                          <p className="text-white/80 text-xs">{card.description}</p>
                        </>
                      )}
                      {!isUnlocked && (
                        <p className="text-gray-500 text-xs mt-2">Получи достижение</p>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>

            {unlockedCards.length === collectionCards.length && (
              <Card className="p-8 bg-gradient-to-r from-yellow-400/50 to-orange-500/50 backdrop-blur-xl border-yellow-400 shadow-2xl mt-6 text-center">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold text-white mb-2">Поздравляем!</h3>
                <p className="text-white/90 text-lg">Ты собрал всю коллекцию морских обитателей!</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="stats" className="animate-fade-in">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/30 hover-scale">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="TrendingUp" className="text-green-400" size={24} />
                  <h3 className="text-lg font-semibold text-white">Всего опыта</h3>
                </div>
                <p className="text-4xl font-bold text-white font-['Rubik']">{totalXP}</p>
                <p className="text-amber-100 text-sm">XP за всё время</p>
              </Card>
              
              <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/30 hover-scale">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Flame" className="text-orange-400" size={24} />
                  <h3 className="text-lg font-semibold text-white">Серия</h3>
                </div>
                <p className="text-4xl font-bold text-white font-['Rubik']">{streak}</p>
                <p className="text-amber-100 text-sm">дней подряд</p>
              </Card>

              <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/30 hover-scale">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Award" className="text-yellow-400" size={24} />
                  <h3 className="text-lg font-semibold text-white">Достижения</h3>
                </div>
                <p className="text-4xl font-bold text-white font-['Rubik']">
                  {achievements.filter(a => a.unlocked).length}/{achievements.length}
                </p>
                <p className="text-amber-100 text-sm">получено наград</p>
              </Card>

              <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/30 hover-scale">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Video" className="text-purple-400" size={24} />
                  <h3 className="text-lg font-semibold text-white">Вебинары</h3>
                </div>
                <p className="text-4xl font-bold text-white font-['Rubik']">{webinarsWatched}</p>
                <p className="text-amber-100 text-sm">просмотрено</p>
              </Card>

              <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/30 hover-scale">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Play" className="text-green-400" size={24} />
                  <h3 className="text-lg font-semibold text-white">Видео</h3>
                </div>
                <p className="text-4xl font-bold text-white font-['Rubik']">{videosWatched}</p>
                <p className="text-amber-100 text-sm">просмотрено</p>
              </Card>

              <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/30 hover-scale">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="CheckSquare" className="text-blue-400" size={24} />
                  <h3 className="text-lg font-semibold text-white">Задания</h3>
                </div>
                <p className="text-4xl font-bold text-white font-['Rubik']">{tasksCompleted}</p>
                <p className="text-amber-100 text-sm">выполнено</p>
              </Card>

              <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/30 hover-scale">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Target" className="text-orange-400" size={24} />
                  <h3 className="text-lg font-semibold text-white">Пробники</h3>
                </div>
                <p className="text-4xl font-bold text-white font-['Rubik']">{mockTestsCompleted}</p>
                <p className="text-amber-100 text-sm">решено</p>
              </Card>

              <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/30 md:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-4">Распределение по предметам</h3>
                <div className="space-y-3">
                  {subjects.map(subject => (
                    <div key={subject.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white">{subject.name}</span>
                        <span className="text-amber-100">{subject.xp} XP</span>
                      </div>
                      <Progress 
                        value={totalXP > 0 ? (subject.xp / totalXP) * 100 : 0} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;