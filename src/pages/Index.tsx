import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

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

const Index = () => {
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [subjects, setSubjects] = useState<Subject[]>([
    { name: 'Биология', color: 'bg-green-500', icon: 'Dna', xp: 0, level: 1 },
    { name: 'Русский', color: 'bg-blue-500', icon: 'BookOpen', xp: 0, level: 1 },
    { name: 'Химия', color: 'bg-purple-500', icon: 'FlaskConical', xp: 0, level: 1 },
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: '1', title: 'Первые шаги', description: 'Выполни первое задание', icon: 'Star', unlocked: false, progress: 0, maxProgress: 1 },
    { id: '2', title: 'Неделя силы', description: 'Занимайся 7 дней подряд', icon: 'Flame', unlocked: false, progress: 0, maxProgress: 7 },
    { id: '3', title: 'Биолог', description: 'Набери 500 XP по биологии', icon: 'Dna', unlocked: false, progress: 0, maxProgress: 500 },
    { id: '4', title: 'Марафонец', description: 'Посмотри 10 вебинаров', icon: 'Video', unlocked: false, progress: 0, maxProgress: 10 },
    { id: '5', title: 'Практик', description: 'Реши 50 заданий', icon: 'Target', unlocked: false, progress: 0, maxProgress: 50 },
    { id: '6', title: 'Знаток химии', description: 'Достигни 5 уровня по химии', icon: 'FlaskConical', unlocked: false, progress: 0, maxProgress: 5 },
  ]);

  const addXP = (amount: number, subjectName: string, activityName: string) => {
    setTotalXP(prev => prev + amount);
    setSubjects(prev => prev.map(s => 
      s.name === subjectName ? { ...s, xp: s.xp + amount } : s
    ));
    
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
  };

  const levelProgress = ((totalXP % 500) / 500) * 100;
  const nextLevelXP = (level * 500) - (totalXP % 500);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-5xl font-bold text-white mb-2 font-['Montserrat']">
            Покоритель экзаменов 🚀
          </h1>
          <p className="text-purple-200">Твой путь к успеху начинается здесь</p>
        </div>

        <Card className="mb-8 p-6 bg-white/10 backdrop-blur-lg border-white/20 animate-scale-in">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                {level}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Уровень {level}</h2>
                <p className="text-purple-200">Всего опыта: {totalXP} XP</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Flame" className="text-orange-400" size={24} />
                <span className="text-2xl font-bold text-white">{streak}</span>
                <span className="text-purple-200">дней подряд</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-purple-200">
              <span>До следующего уровня</span>
              <span>{nextLevelXP} XP</span>
            </div>
            <Progress value={levelProgress} className="h-3" />
          </div>
        </Card>

        <Tabs defaultValue="actions" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/10 backdrop-blur-lg">
            <TabsTrigger value="actions" className="data-[state=active]:bg-purple-500">
              <Icon name="Zap" size={16} className="mr-2" />
              Действия
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-purple-500">
              <Icon name="TrendingUp" size={16} className="mr-2" />
              Прогресс
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-500">
              <Icon name="Award" size={16} className="mr-2" />
              Награды
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-purple-500">
              <Icon name="BarChart3" size={16} className="mr-2" />
              Статистика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="actions" className="animate-fade-in">
            <div className="grid gap-4 md:grid-cols-2">
              {subjects.map(subject => (
                <Card key={subject.name} className="p-6 bg-white/10 backdrop-blur-lg border-white/20 hover-scale">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`${subject.color} p-3 rounded-lg shadow-lg`}>
                      <Icon name={subject.icon as any} className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{subject.name}</h3>
                      <p className="text-purple-200">Уровень {subject.level} • {subject.xp} XP</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={() => addXP(50, subject.name, 'вебинар')}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all"
                    >
                      <Icon name="Video" size={16} className="mr-2" />
                      Вебинар +50
                    </Button>
                    <Button 
                      onClick={() => addXP(30, subject.name, 'задание')}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all"
                    >
                      <Icon name="FileText" size={16} className="mr-2" />
                      Задание +30
                    </Button>
                    <Button 
                      onClick={() => addXP(100, subject.name, 'пробник')}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all"
                    >
                      <Icon name="Target" size={16} className="mr-2" />
                      Пробник +100
                    </Button>
                    <Button 
                      onClick={() => addXP(20, subject.name, 'видео')}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all"
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
                  <Card key={subject.name} className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`${subject.color} p-3 rounded-lg shadow-lg`}>
                        <Icon name={subject.icon as any} className="text-white" size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xl font-bold text-white">{subject.name}</h3>
                          <Badge className={`${subject.color} text-white`}>
                            Уровень {subject.level}
                          </Badge>
                        </div>
                        <Progress value={subjectLevelProgress} className="h-3 mb-2" />
                        <div className="flex justify-between text-sm text-purple-200">
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
                      ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50' 
                      : 'bg-white/10 border-white/20'
                  } backdrop-blur-lg`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg shadow-lg ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-400' 
                        : 'bg-gray-600'
                    }`}>
                      <Icon name={achievement.icon as any} className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white">{achievement.title}</h3>
                        {achievement.unlocked && (
                          <Icon name="CheckCircle2" className="text-green-400" size={20} />
                        )}
                      </div>
                      <p className="text-purple-200 text-sm mb-2">{achievement.description}</p>
                      {!achievement.unlocked && achievement.progress !== undefined && (
                        <div className="space-y-1">
                          <Progress 
                            value={(achievement.progress! / achievement.maxProgress!) * 100} 
                            className="h-2" 
                          />
                          <p className="text-xs text-purple-200">
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

          <TabsContent value="stats" className="animate-fade-in">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 hover-scale">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="TrendingUp" className="text-green-400" size={24} />
                  <h3 className="text-lg font-semibold text-white">Всего опыта</h3>
                </div>
                <p className="text-4xl font-bold text-white font-['Rubik']">{totalXP}</p>
                <p className="text-purple-200 text-sm">XP за всё время</p>
              </Card>
              
              <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 hover-scale">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Flame" className="text-orange-400" size={24} />
                  <h3 className="text-lg font-semibold text-white">Серия</h3>
                </div>
                <p className="text-4xl font-bold text-white font-['Rubik']">{streak}</p>
                <p className="text-purple-200 text-sm">дней подряд</p>
              </Card>

              <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 hover-scale">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Award" className="text-yellow-400" size={24} />
                  <h3 className="text-lg font-semibold text-white">Достижения</h3>
                </div>
                <p className="text-4xl font-bold text-white font-['Rubik']">
                  {achievements.filter(a => a.unlocked).length}/{achievements.length}
                </p>
                <p className="text-purple-200 text-sm">получено наград</p>
              </Card>

              <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 md:col-span-3">
                <h3 className="text-lg font-semibold text-white mb-4">Распределение по предметам</h3>
                <div className="space-y-3">
                  {subjects.map(subject => (
                    <div key={subject.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white">{subject.name}</span>
                        <span className="text-purple-200">{subject.xp} XP</span>
                      </div>
                      <Progress 
                        value={(subject.xp / totalXP) * 100} 
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