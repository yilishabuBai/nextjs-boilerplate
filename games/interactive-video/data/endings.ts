import { Ending } from '../types';

export const endings: Ending[] = [
  // 小雨的结局
  {
    id: 'ending_xiaoyu_good',
    title: '甜蜜的烘焙时光',
    character: 'xiaoyu',
    type: 'romance',
    description: '你和小雨建立了深厚的感情，你们经常一起烘焙，分享生活的甜蜜。',
    background: '/backgrounds/ending-xiaoyu-romance.jpg',
    requirements: {
      minAffection: 80,
      scenesCompleted: ['scene8', 'scene16']
    },
    rewards: {
      affectionBonus: 20,
      achievement: 'baking_partner',
      specialItem: '小雨的爱心蛋糕配方'
    },
    dialogue: '和你在一起的每一天都很甜蜜，希望我们的爱情像蛋糕一样越来越甜！',
    choices: [
      {
        id: 'ending_choice_1',
        text: '我也很爱你，小雨',
        consequence: '你们拥抱在一起，开始了甜蜜的恋爱生活'
      },
      {
        id: 'ending_choice_2',
        text: '我们是最好的朋友',
        consequence: '小雨理解你的选择，你们保持着深厚的友谊'
      }
    ]
  },
  {
    id: 'ending_xiaoyu_normal',
    title: '温暖的友谊',
    character: 'xiaoyu',
    type: 'friendship',
    description: '你和小雨成为了好朋友，经常一起分享美食和快乐时光。',
    background: '/backgrounds/ending-xiaoyu-friendship.jpg',
    requirements: {
      minAffection: 50,
      scenesCompleted: ['scene4', 'scene9']
    },
    rewards: {
      affectionBonus: 10,
      achievement: 'friend_maker',
      specialItem: '小雨的烘焙小贴士'
    },
    dialogue: '谢谢你成为我的朋友，和你在一起真的很开心！',
    choices: [
      {
        id: 'ending_choice_3',
        text: '我们永远是好朋友',
        consequence: '你们约定要一直保持这份珍贵的友谊'
      }
    ]
  },
  {
    id: 'ending_xiaoyu_friendship',
    title: '渐行渐远',
    character: 'xiaoyu',
    type: 'acquaintance',
    description: '你和小雨保持着礼貌的关系，偶尔会在咖啡店遇到。',
    background: '/backgrounds/ending-xiaoyu-acquaintance.jpg',
    requirements: {
      minAffection: 30,
      scenesCompleted: ['scene4']
    },
    rewards: {
      affectionBonus: 5,
      achievement: 'first_choice',
      specialItem: '咖啡店会员卡'
    },
    dialogue: '希望你在咖啡店过得愉快，有机会再见。',
    choices: [
      {
        id: 'ending_choice_4',
        text: '谢谢，再见',
        consequence: '你们礼貌地告别，各自继续自己的生活'
      }
    ]
  },
  {
    id: 'ending_xiaoyu_acquaintance',
    title: '礼貌的陌生人',
    character: 'xiaoyu',
    type: 'distant',
    description: '你和小雨只是偶尔遇到的陌生人，关系比较疏远。',
    background: '/backgrounds/ending-xiaoyu-distant.jpg',
    requirements: {
      minAffection: 10,
      scenesCompleted: ['scene1']
    },
    rewards: {
      affectionBonus: 0,
      achievement: 'first_choice',
      specialItem: '无'
    },
    dialogue: '你好，欢迎光临。',
    choices: [
      {
        id: 'ending_choice_5',
        text: '谢谢',
        consequence: '你们保持着最基本的礼貌关系'
      }
    ]
  },
  {
    id: 'ending_xiaoyu_distant',
    title: '疏远的关系',
    character: 'xiaoyu',
    type: 'distant',
    description: '你和小雨的关系比较疏远，很少有机会深入交流。',
    background: '/backgrounds/ending-xiaoyu-distant.jpg',
    requirements: {
      minAffection: 5,
      scenesCompleted: ['scene1']
    },
    rewards: {
      affectionBonus: 0,
      achievement: 'first_choice',
      specialItem: '无'
    },
    dialogue: '欢迎光临，需要什么帮助吗？',
    choices: [
      {
        id: 'ending_choice_6',
        text: '不用了，谢谢',
        consequence: '你们保持着最基本的服务关系'
      }
    ]
  },

  // 美美的结局
  {
    id: 'ending_meimei_good',
    title: '健身伙伴',
    character: 'meimei',
    type: 'romance',
    description: '你和美美成为了健身伙伴，在运动中培养出了深厚的感情。',
    background: '/backgrounds/ending-meimei-romance.jpg',
    requirements: {
      minAffection: 80,
      scenesCompleted: ['scene10', 'scene20']
    },
    rewards: {
      affectionBonus: 20,
      achievement: 'fitness_buddy',
      specialItem: '美美的专属训练计划'
    },
    dialogue: '和你一起健身真的很开心，希望我们的关系能更进一步！',
    choices: [
      {
        id: 'ending_choice_7',
        text: '我也很喜欢和你在一起',
        consequence: '你们在健身房相拥，开始了甜蜜的恋爱'
      },
      {
        id: 'ending_choice_8',
        text: '我们是最好的健身伙伴',
        consequence: '美美理解你的选择，你们保持着深厚的友谊'
      }
    ]
  },
  {
    id: 'ending_meimei_normal',
    title: '健身好友',
    character: 'meimei',
    type: 'friendship',
    description: '你和美美成为了健身好友，经常一起锻炼身体。',
    background: '/backgrounds/ending-meimei-friendship.jpg',
    requirements: {
      minAffection: 50,
      scenesCompleted: ['scene5', 'scene21']
    },
    rewards: {
      affectionBonus: 10,
      achievement: 'friend_maker',
      specialItem: '美美的健身小贴士'
    },
    dialogue: '很高兴认识你，希望我们能一直一起健身！',
    choices: [
      {
        id: 'ending_choice_9',
        text: '我们永远是健身伙伴',
        consequence: '你们约定要一直保持这份珍贵的友谊'
      }
    ]
  },
  {
    id: 'ending_meimei_acquaintance',
    title: '健身指导',
    character: 'meimei',
    type: 'acquaintance',
    description: '美美是你的健身指导，你们保持着专业的关系。',
    background: '/backgrounds/ending-meimei-acquaintance.jpg',
    requirements: {
      minAffection: 30,
      scenesCompleted: ['scene5']
    },
    rewards: {
      affectionBonus: 5,
      achievement: 'first_choice',
      specialItem: '健身房会员卡'
    },
    dialogue: '希望你在健身路上越走越远，加油！',
    choices: [
      {
        id: 'ending_choice_10',
        text: '谢谢你的指导',
        consequence: '你们保持着专业的指导关系'
      }
    ]
  },

  // 小青的结局
  {
    id: 'ending_xiaoqing_good',
    title: '咖啡知音',
    character: 'xiaoqing',
    type: 'romance',
    description: '你和小青成为了咖啡知音，在咖啡的世界里找到了彼此。',
    background: '/backgrounds/ending-xiaoqing-romance.jpg',
    requirements: {
      minAffection: 80,
      scenesCompleted: ['scene6', 'scene24']
    },
    rewards: {
      affectionBonus: 20,
      achievement: 'coffee_lover',
      specialItem: '小青的珍藏咖啡豆'
    },
    dialogue: '遇到你这样的咖啡知音真的很幸运，希望我们的关系能更进一步！',
    choices: [
      {
        id: 'ending_choice_11',
        text: '我也很珍惜我们的相遇',
        consequence: '你们在咖啡香中相拥，开始了浪漫的恋爱'
      },
      {
        id: 'ending_choice_12',
        text: '我们是最好的咖啡伙伴',
        consequence: '小青理解你的选择，你们保持着深厚的友谊'
      }
    ]
  },
  {
    id: 'ending_xiaoqing_normal',
    title: '咖啡伙伴',
    character: 'xiaoqing',
    type: 'friendship',
    description: '你和小青成为了咖啡伙伴，经常一起品鉴咖啡。',
    background: '/backgrounds/ending-xiaoqing-friendship.jpg',
    requirements: {
      minAffection: 50,
      scenesCompleted: ['scene6', 'scene25']
    },
    rewards: {
      affectionBonus: 10,
      achievement: 'coffee_lover',
      specialItem: '小青的咖啡品鉴笔记'
    },
    dialogue: '很高兴遇到你这样的咖啡爱好者，希望我们能一直分享咖啡的乐趣！',
    choices: [
      {
        id: 'ending_choice_13',
        text: '我们永远是咖啡伙伴',
        consequence: '你们约定要一直保持这份珍贵的友谊'
      }
    ]
  },
  {
    id: 'ending_xiaoqing_acquaintance',
    title: '咖啡店主',
    character: 'xiaoqing',
    type: 'acquaintance',
    description: '小青是你的咖啡店主，你们保持着服务关系。',
    background: '/backgrounds/ending-xiaoqing-acquaintance.jpg',
    requirements: {
      minAffection: 30,
      scenesCompleted: ['scene6']
    },
    rewards: {
      affectionBonus: 5,
      achievement: 'first_choice',
      specialItem: '咖啡店优惠券'
    },
    dialogue: '欢迎下次再来，希望你喜欢我们的咖啡。',
    choices: [
      {
        id: 'ending_choice_14',
        text: '谢谢，咖啡很好喝',
        consequence: '你们保持着基本的服务关系'
      }
    ]
  },
  {
    id: 'ending_xiaoqing_distant',
    title: '陌生顾客',
    character: 'xiaoqing',
    type: 'distant',
    description: '你和小青只是店主和顾客的关系，很少深入交流。',
    background: '/backgrounds/ending-xiaoqing-distant.jpg',
    requirements: {
      minAffection: 10,
      scenesCompleted: ['scene1']
    },
    rewards: {
      affectionBonus: 0,
      achievement: 'first_choice',
      specialItem: '无'
    },
    dialogue: '欢迎光临，需要什么帮助吗？',
    choices: [
      {
        id: 'ending_choice_15',
        text: '不用了，谢谢',
        consequence: '你们保持着最基本的服务关系'
      }
    ]
  },

  // 小雪的结局
  {
    id: 'ending_xiaoxue_good',
    title: '艺术伙伴',
    character: 'xiaoxue',
    type: 'romance',
    description: '你和小雪成为了艺术伙伴，在艺术的世界里找到了彼此。',
    background: '/backgrounds/ending-xiaoxue-romance.jpg',
    requirements: {
      minAffection: 80,
      scenesCompleted: ['scene7', 'scene28']
    },
    rewards: {
      affectionBonus: 20,
      achievement: 'art_appreciator',
      specialItem: '小雪的原创画作'
    },
    dialogue: '遇到你这样的艺术知音真的很幸运，希望我们的关系能更进一步！',
    choices: [
      {
        id: 'ending_choice_16',
        text: '我也很珍惜我们的相遇',
        consequence: '你们在艺术的世界里相拥，开始了浪漫的恋爱'
      },
      {
        id: 'ending_choice_17',
        text: '我们是最好的艺术伙伴',
        consequence: '小雪理解你的选择，你们保持着深厚的友谊'
      }
    ]
  },
  {
    id: 'ending_xiaoxue_normal',
    title: '艺术好友',
    character: 'xiaoxue',
    type: 'friendship',
    description: '你和小雪成为了艺术好友，经常一起欣赏和创作艺术。',
    background: '/backgrounds/ending-xiaoxue-friendship.jpg',
    requirements: {
      minAffection: 50,
      scenesCompleted: ['scene7', 'scene29']
    },
    rewards: {
      affectionBonus: 10,
      achievement: 'art_appreciator',
      specialItem: '小雪的艺术创作心得'
    },
    dialogue: '很高兴遇到你这样的艺术爱好者，希望我们能一直分享艺术的魅力！',
    choices: [
      {
        id: 'ending_choice_18',
        text: '我们永远是艺术伙伴',
        consequence: '你们约定要一直保持这份珍贵的友谊'
      }
    ]
  },
  {
    id: 'ending_xiaoxue_acquaintance',
    title: '艺术欣赏者',
    character: 'xiaoxue',
    type: 'acquaintance',
    description: '你是小雪的 art 欣赏者，你们保持着基本的交流关系。',
    background: '/backgrounds/ending-xiaoxue-acquaintance.jpg',
    requirements: {
      minAffection: 30,
      scenesCompleted: ['scene7']
    },
    rewards: {
      affectionBonus: 5,
      achievement: 'first_choice',
      specialItem: '小雪的艺术明信片'
    },
    dialogue: '谢谢你对我的作品感兴趣，希望下次还能见到你。',
    choices: [
      {
        id: 'ending_choice_19',
        text: '你的作品很棒',
        consequence: '你们保持着基本的欣赏关系'
      }
    ]
  },
  {
    id: 'ending_xiaoxue_distant',
    title: '路人',
    character: 'xiaoxue',
    type: 'distant',
    description: '你和小雪只是偶尔遇到的路人，关系比较疏远。',
    background: '/backgrounds/ending-xiaoxue-distant.jpg',
    requirements: {
      minAffection: 10,
      scenesCompleted: ['scene7']
    },
    rewards: {
      affectionBonus: 0,
      achievement: 'first_choice',
      specialItem: '无'
    },
    dialogue: '你好，再见。',
    choices: [
      {
        id: 'ending_choice_20',
        text: '再见',
        consequence: '你们保持着最基本的礼貌关系'
      }
    ]
  }
];

export const getEndingById = (id: string): Ending | undefined => {
  return endings.find(ending => ending.id === id);
};

export const getEndingsByCharacter = (characterId: string): Ending[] => {
  return endings.filter(ending => ending.character === characterId);
};

export const getEndingsByType = (type: string): Ending[] => {
  return endings.filter(ending => ending.type === type);
};

export const getBestEndingForCharacter = (characterId: string): Ending | undefined => {
  const characterEndings = getEndingsByCharacter(characterId);
  return characterEndings.find(ending => ending.type === 'romance') ||
         characterEndings.find(ending => ending.type === 'friendship') ||
         characterEndings[0];
};

export const checkEndingRequirements = (ending: Ending, characterAffection: number, completedScenes: string[]): boolean => {
  return characterAffection >= ending.requirements.minAffection &&
         ending.requirements.scenesCompleted.every(scene => completedScenes.includes(scene));
};
