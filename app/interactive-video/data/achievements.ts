import { Achievement } from '../types';

export const achievements: Achievement[] = [
  {
    id: 'first_choice',
    name: '初次选择',
    description: '做出你的第一个选择',
    icon: '🎯',
    unlocked: false,
    unlockCondition: '完成第一个选择'
  },
  {
    id: 'friend_maker',
    name: '社交达人',
    description: '与所有角色都有过互动',
    icon: '🤝',
    unlocked: false,
    unlockCondition: '与所有角色互动过'
  },
  {
    id: 'love_master',
    name: '恋爱大师',
    description: '让一个角色的好感度达到80以上',
    icon: '❤️',
    unlocked: false,
    unlockCondition: '角色好感度达到80+'
  },
  {
    id: 'scene_explorer',
    name: '场景探索者',
    description: '完成5个不同的场景',
    icon: '🗺️',
    unlocked: false,
    unlockCondition: '完成5个场景'
  },
  {
    id: 'choice_collector',
    name: '选择收集者',
    description: '做出10个不同的选择',
    icon: '📚',
    unlocked: false,
    unlockCondition: '做出10个选择'
  },
  {
    id: 'perfect_gentleman',
    name: '完美绅士',
    description: '所有选择都获得正面好感度',
    icon: '🎩',
    unlocked: false,
    unlockCondition: '所有选择都获得正面好感度'
  },
  {
    id: 'coffee_lover',
    name: '咖啡爱好者',
    description: '与小青进行深度咖啡交流',
    icon: '☕',
    unlocked: false,
    unlockCondition: '完成咖啡品鉴场景'
  },
  {
    id: 'fitness_buddy',
    name: '健身伙伴',
    description: '与美美一起完成健身挑战',
    icon: '💪',
    unlocked: false,
    unlockCondition: '完成健身房挑战场景'
  },
  {
    id: 'baking_partner',
    name: '烘焙伙伴',
    description: '与小雨一起制作蛋糕',
    icon: '🍰',
    unlocked: false,
    unlockCondition: '完成烘焙场景'
  },
  {
    id: 'art_appreciator',
    name: '艺术欣赏者',
    description: '欣赏小雪的艺术作品',
    icon: '🎨',
    unlocked: false,
    unlockCondition: '完成艺术场景'
  },
  {
    id: 'nurse_helper',
    name: '护士助手',
    description: '与小红建立深厚的友谊',
    icon: '🏥',
    unlocked: false,
    unlockCondition: '与小红互动达到好感度50+'
  },
  {
    id: 'zodiac_expert',
    name: '星座专家',
    description: '了解所有角色的星座信息',
    icon: '⭐',
    unlocked: false,
    unlockCondition: '查看所有角色的星座信息'
  },
  {
    id: 'hobby_master',
    name: '兴趣大师',
    description: '与角色讨论他们的兴趣爱好',
    icon: '🎭',
    unlocked: false,
    unlockCondition: '与角色讨论兴趣爱好'
  },
  {
    id: 'special_skill_discoverer',
    name: '特殊技能发现者',
    description: '了解所有角色的特殊技能',
    icon: '🔮',
    unlocked: false,
    unlockCondition: '了解所有角色的特殊技能'
  },
  {
    id: 'true_love',
    name: '真爱永恒',
    description: '让一个角色的好感度达到100',
    icon: '💕',
    unlocked: false,
    unlockCondition: '角色好感度达到100'
  }
];

export const getAchievementById = (id: string): Achievement | undefined => {
  return achievements.find(achievement => achievement.id === id);
};

export const getUnlockedAchievements = (): Achievement[] => {
  return achievements.filter(achievement => achievement.unlocked);
};

export const getLockedAchievements = (): Achievement[] => {
  return achievements.filter(achievement => !achievement.unlocked);
};

export const unlockAchievement = (id: string): void => {
  const achievement = getAchievementById(id);
  if (achievement) {
    achievement.unlocked = true;
  }
};

export const getTotalAchievements = (): number => {
  return achievements.length;
};

export const getUnlockedCount = (): number => {
  return getUnlockedAchievements().length;
};
