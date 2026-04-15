import { Character } from '../types';

export const characters: Character[] = [
  {
    id: 'xiaoyu',
    name: '小雨',
    avatar: '/characters/xiaoyu.jpg',
    description: '温柔可爱的邻家女孩，喜欢看书和听音乐',
    personality: '温柔、善良、有点害羞',
    currentAffection: 0,
    maxAffection: 100,
    birthday: '3月15日',
    zodiac: '双鱼座',
    hobby: '看书、听音乐、烘焙',
    specialSkill: '心灵感应',
    favoriteFood: '抹茶蛋糕',
    weakness: '怕黑、容易紧张'
  },
  {
    id: 'meimei',
    name: '美美',
    avatar: '/characters/meimei.jpg',
    description: '活泼开朗的健身教练，性格直爽',
    personality: '开朗、直率、运动型',
    currentAffection: 0,
    maxAffection: 100,
    birthday: '7月22日',
    zodiac: '巨蟹座',
    hobby: '健身、跑步、游泳',
    specialSkill: '超强体力',
    favoriteFood: '蛋白质奶昔',
    weakness: '怕冷、容易饿'
  },
  {
    id: 'xiaoqing',
    name: '小青',
    avatar: '/characters/xiaoqing.jpg',
    description: '知性优雅的咖啡店老板，成熟稳重',
    personality: '成熟、优雅、有主见',
    currentAffection: 0,
    maxAffection: 100,
    birthday: '11月8日',
    zodiac: '天蝎座',
    hobby: '品咖啡、读书、旅行',
    specialSkill: '读心术',
    favoriteFood: '手冲咖啡',
    weakness: '怕热、容易失眠'
  },
  {
    id: 'xiaoxue',
    name: '小雪',
    avatar: '/characters/xiaoxue.jpg',
    description: '神秘的艺术系学生，喜欢画画和摄影',
    personality: '神秘、艺术、敏感',
    currentAffection: 0,
    maxAffection: 100,
    birthday: '12月21日',
    zodiac: '射手座',
    hobby: '画画、摄影、写诗',
    specialSkill: '预知未来',
    favoriteFood: '巧克力',
    weakness: '怕人多、容易情绪化'
  },
  {
    id: 'xiaohong',
    name: '小红',
    avatar: '/characters/xiaohong.jpg',
    description: '热情开朗的护士，总是充满正能量',
    personality: '热情、乐观、善良',
    currentAffection: 0,
    maxAffection: 100,
    birthday: '5月20日',
    zodiac: '金牛座',
    hobby: '护理、唱歌、跳舞',
    specialSkill: '治愈能力',
    favoriteFood: '火锅',
    weakness: '怕疼、容易感动'
  }
];

export const getCharacterById = (id: string): Character | undefined => {
  return characters.find(char => char.id === id);
};

export const getCharactersByIds = (ids: string[]): Character[] => {
  return characters.filter(char => ids.includes(char.id));
};

export const getCharactersByPersonality = (personality: string): Character[] => {
  return characters.filter(char =>
    char.personality.includes(personality) ||
    char.hobby.includes(personality)
  );
};

export const getCharactersByZodiac = (zodiac: string): Character[] => {
  return characters.filter(char => char.zodiac === zodiac);
};
