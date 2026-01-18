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

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
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

  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: '1', title: '🌟 Первый шаг', description: 'Выполни первое задание', icon: 'Sparkles', unlocked: false, progress: 0, maxProgress: 1 },
    { id: '2', title: '🔥 Неделя силы', description: 'Занимайся 7 дней подряд', icon: 'Flame', unlocked: false, progress: 0, maxProgress: 7 },
    { id: '3', title: '🌊 Месяц мощи', description: 'Занимайся 30 дней подряд', icon: 'Waves', unlocked: false, progress: 0, maxProgress: 30 },
    { id: '4', title: '🧬 Юный биолог', description: 'Набери 100 XP по биологии', icon: 'Dna', unlocked: false, progress: 0, maxProgress: 100 },
    { id: '5', title: '🔬 Мастер биологии', description: 'Набери 500 XP по биологии', icon: 'Microscope', unlocked: false, progress: 0, maxProgress: 500 },
    { id: '6', title: '🌿 Профессор биологии', description: 'Набери 1000 XP по биологии', icon: 'TreeDeciduous', unlocked: false, progress: 0, maxProgress: 1000 },
    { id: '7', title: '📖 Любитель русского', description: 'Набери 100 XP по русскому', icon: 'BookOpen', unlocked: false, progress: 0, maxProgress: 100 },
    { id: '8', title: '✍️ Грамотей', description: 'Набери 500 XP по русскому', icon: 'PenTool', unlocked: false, progress: 0, maxProgress: 500 },
    { id: '9', title: '📚 Знаток русского', description: 'Набери 1000 XP по русскому', icon: 'Library', unlocked: false, progress: 0, maxProgress: 1000 },
    { id: '10', title: '⚗️ Начинающий химик', description: 'Набери 100 XP по химии', icon: 'FlaskConical', unlocked: false, progress: 0, maxProgress: 100 },
    { id: '11', title: '🧪 Химик-лаборант', description: 'Набери 500 XP по химии', icon: 'FlaskRound', unlocked: false, progress: 0, maxProgress: 500 },
    { id: '12', title: '⚛️ Профессор химии', description: 'Набери 1000 XP по химии', icon: 'Atom', unlocked: false, progress: 0, maxProgress: 1000 },
    { id: '13', title: '🎬 Киноман', description: 'Посмотри 5 вебинаров', icon: 'Video', unlocked: false, progress: 0, maxProgress: 5 },
    { id: '14', title: '📺 Марафонец', description: 'Посмотри 20 вебинаров', icon: 'Monitor', unlocked: false, progress: 0, maxProgress: 20 },
    { id: '15', title: '🎥 Киногуру', description: 'Посмотри 50 вебинаров', icon: 'Film', unlocked: false, progress: 0, maxProgress: 50 },
    { id: '16', title: '📝 Новичок', description: 'Реши 10 заданий', icon: 'FileText', unlocked: false, progress: 0, maxProgress: 10 },
    { id: '17', title: '✅ Практик', description: 'Реши 50 заданий', icon: 'CheckSquare', unlocked: false, progress: 0, maxProgress: 50 },
    { id: '18', title: '🎯 Мастер заданий', description: 'Реши 100 заданий', icon: 'Target', unlocked: false, progress: 0, maxProgress: 100 },
    { id: '19', title: '💯 Перфекционист', description: 'Реши 200 заданий', icon: 'Award', unlocked: false, progress: 0, maxProgress: 200 },
    { id: '20', title: '🎓 Испытание огнём', description: 'Реши 5 пробников', icon: 'GraduationCap', unlocked: false, progress: 0, maxProgress: 5 },
    { id: '21', title: '🏆 Боец экзаменов', description: 'Реши 10 пробников', icon: 'Trophy', unlocked: false, progress: 0, maxProgress: 10 },
    { id: '22', title: '👑 Король пробников', description: 'Реши 25 пробников', icon: 'Crown', unlocked: false, progress: 0, maxProgress: 25 },
    { id: '23', title: '⚡ Энергия', description: 'Набери 100 общего XP', icon: 'Zap', unlocked: false, progress: 0, maxProgress: 100 },
    { id: '24', title: '💫 Звезда', description: 'Набери 500 общего XP', icon: 'Star', unlocked: false, progress: 0, maxProgress: 500 },
    { id: '25', title: '🌟 Супернова', description: 'Набери 1000 общего XP', icon: 'Sparkle', unlocked: false, progress: 0, maxProgress: 1000 },
    { id: '26', title: '🚀 Космонавт', description: 'Набери 2500 общего XP', icon: 'Rocket', unlocked: false, progress: 0, maxProgress: 2500 },
    { id: '27', title: '🌌 Покоритель вселенной', description: 'Набери 5000 общего XP', icon: 'Galaxy', unlocked: false, progress: 0, maxProgress: 5000 },
    { id: '28', title: '📈 Прогрессор', description: 'Достигни 5 уровня', icon: 'TrendingUp', unlocked: false, progress: 0, maxProgress: 5 },
    { id: '29', title: '🎖️ Ветеран', description: 'Достигни 10 уровня', icon: 'Medal', unlocked: false, progress: 0, maxProgress: 10 },
    { id: '30', title: '🦸 Легенда', description: 'Достигни 20 уровня', icon: 'Swords', unlocked: false, progress: 0, maxProgress: 20 },
  ]);

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
      particleCount: 30,
      spread: 60,
      origin: { x, y },
      colors: ['#fbbf24', '#f97316', '#ef4444', '#fde047', '#facc15', '#fb923c'],
      ticks: 100,
      gravity: 0.8,
      scalar: 0.8
    });
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

      {/* Медузы */}
      <div className="absolute top-1/2 left-1/4 text-7xl opacity-30 animate-float" style={{ animationDelay: '0.5s' }}>🪼</div>
      <div className="absolute top-1/4 right-1/4 text-6xl opacity-30 animate-float" style={{ animationDelay: '1.5s' }}>🪼</div>
      <div className="absolute bottom-1/3 left-1/3 text-5xl opacity-30 animate-float" style={{ animationDelay: '2.5s' }}>🪼</div>

      {/* Падающие разноцветные звёздочки */}
      {[...Array(12)].map((_, i) => {
        const colors = ['#fbbf24', '#f97316', '#ef4444', '#fde047', '#facc15', '#fb923c'];
        const leftPos = Math.random() * 100;
        const duration = 15 + Math.random() * 10;
        const delay = Math.random() * 10;
        const size = 32 + Math.random() * 32;
        
        return (
          <div
            key={i}
            className="absolute animate-fall-star cursor-pointer transition-transform hover:scale-150"
            style={{
              left: `${leftPos}%`,
              top: '-100px',
              fontSize: `${size}px`,
              filter: `drop-shadow(0 0 8px ${colors[i % colors.length]})`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
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
          <TabsList className="grid w-full grid-cols-5 mb-6 bg-white/20 backdrop-blur-lg">
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
                      ? 'bg-gradient-to-br from-yellow-400/30 to-orange-500/30 border-yellow-400/60 shadow-lg shadow-yellow-500/30' 
                      : 'bg-white/10 border-white/30'
                  } backdrop-blur-lg`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg shadow-lg transition-transform ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 animate-pulse' 
                        : 'bg-gray-600'
                    } hover:scale-110`}>
                      <Icon name={achievement.icon as any} className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white">{achievement.title}</h3>
                        {achievement.unlocked && (
                          <Icon name="CheckCircle2" className="text-green-400" size={20} />
                        )}
                      </div>
                      <p className="text-amber-100 text-sm mb-2">{achievement.description}</p>
                      {!achievement.unlocked && achievement.progress !== undefined && (
                        <div className="space-y-1">
                          <Progress 
                            value={(achievement.progress! / achievement.maxProgress!) * 100} 
                            className="h-2" 
                          />
                          <p className="text-xs text-amber-100">
                            {achievement.progress} / {achievement.maxProgress}
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