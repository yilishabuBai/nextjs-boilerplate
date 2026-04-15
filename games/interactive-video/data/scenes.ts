import { Scene } from '../types';

export const scenes: Scene[] = [
  {
    id: 'scene1',
    title: '初遇',
    description: '你在咖啡店偶遇了三位美丽的女孩...',
    background: '/backgrounds/coffee-shop.jpg',
    characters: ['xiaoyu', 'meimei', 'xiaoqing'],
    dialogue: '欢迎光临！今天想喝点什么？',
    choices: [
      {
        id: 'choice1',
        text: '点一杯拿铁，然后和她们聊天',
        affectionChange: 5,
        nextScene: 'scene2',
        consequence: '你选择了主动交流，女孩们对你的印象不错'
      },
      {
        id: 'choice2',
        text: '只是安静地喝咖啡，观察她们',
        affectionChange: 2,
        nextScene: 'scene3',
        consequence: '你选择了观察，虽然低调但也没有引起反感'
      }
    ]
  },
  {
    id: 'scene2',
    title: '深入交流',
    description: '你选择了主动交流，女孩们开始对你感兴趣...',
    background: '/backgrounds/coffee-shop-interior.jpg',
    characters: ['xiaoyu', 'meimei'],
    dialogue: '你平时都喜欢做什么呢？',
    choices: [
      {
        id: 'choice3',
        text: '我喜欢看书和听音乐，和小雨有共同话题',
        affectionChange: 8,
        nextScene: 'scene4',
        consequence: '小雨对你的好感度大幅提升！'
      },
      {
        id: 'choice4',
        text: '我喜欢运动健身，和美美有共同爱好',
        affectionChange: 8,
        nextScene: 'scene5',
        consequence: '美美对你的好感度大幅提升！'
      }
    ]
  },
  {
    id: 'scene3',
    title: '默默观察',
    description: '你选择了低调观察，但意外发现了有趣的事情...',
    background: '/backgrounds/coffee-shop-observation.jpg',
    characters: ['xiaoqing'],
    dialogue: '这位客人，需要续杯吗？',
    choices: [
      {
        id: 'choice5',
        text: '好的，谢谢。顺便问一下，你们店里的咖啡豆是从哪里进的？',
        affectionChange: 6,
        nextScene: 'scene6',
        consequence: '小青对你的专业问题很感兴趣'
      },
      {
        id: 'choice6',
        text: '不用了，谢谢。我想在这里多坐一会儿',
        affectionChange: 3,
        nextScene: 'scene7',
        consequence: '小青觉得你是个安静的客人'
      }
    ]
  },
  {
    id: 'scene4',
    title: '小雨的邀请',
    description: '小雨邀请你去她家做客，她想要展示她的烘焙技能...',
    background: '/backgrounds/xiaoyu-home.jpg',
    characters: ['xiaoyu'],
    dialogue: '要不要来我家？我最近学会做抹茶蛋糕了！',
    choices: [
      {
        id: 'choice7',
        text: '当然好！我很想尝尝你的手艺',
        affectionChange: 10,
        nextScene: 'scene8',
        consequence: '小雨非常开心，准备为你做最拿手的蛋糕'
      },
      {
        id: 'choice8',
        text: '改天吧，今天有点忙',
        affectionChange: -2,
        nextScene: 'scene9',
        consequence: '小雨有点失望，但还是理解你的忙碌'
      }
    ]
  },
  {
    id: 'scene5',
    title: '美美的健身课',
    description: '美美邀请你参加她的健身课程，想要测试你的体能...',
    background: '/backgrounds/gym.jpg',
    characters: ['meimei'],
    dialogue: '要不要来试试我的健身课？保证让你大汗淋漓！',
    choices: [
      {
        id: 'choice9',
        text: '好啊！我正想锻炼身体',
        affectionChange: 10,
        nextScene: 'scene10',
        consequence: '美美很兴奋，准备给你安排最合适的训练计划'
      },
      {
        id: 'choice10',
        text: '我体力不太好，还是算了吧',
        affectionChange: -3,
        nextScene: 'scene11',
        consequence: '美美有点失望，但表示理解你的顾虑'
      }
    ]
  },
  {
    id: 'scene6',
    title: '咖啡品鉴',
    description: '小青邀请你参加她的咖啡品鉴会，想要分享她的咖啡知识...',
    background: '/backgrounds/coffee-tasting.jpg',
    characters: ['xiaoqing'],
    dialogue: '你对咖啡很感兴趣吗？要不要参加我的品鉴会？',
    choices: [
      {
        id: 'choice11',
        text: '非常感兴趣！我想了解更多',
        affectionChange: 8,
        nextScene: 'scene12',
        consequence: '小青很高兴遇到知音，准备为你介绍最顶级的咖啡'
      },
      {
        id: 'choice12',
        text: '我只是随便问问',
        affectionChange: 2,
        nextScene: 'scene13',
        consequence: '小青礼貌地回应，但热情有所减退'
      }
    ]
  },
  {
    id: 'scene7',
    title: '偶遇小雪',
    description: '在咖啡店外，你遇到了正在写生的艺术系学生小雪...',
    background: '/backgrounds/street-art.jpg',
    characters: ['xiaoxue'],
    dialogue: '你在画什么？看起来很有趣的样子',
    choices: [
      {
        id: 'choice13',
        text: '走近看看她的画作，赞美她的艺术天赋',
        affectionChange: 7,
        nextScene: 'scene14',
        consequence: '小雪很开心有人欣赏她的作品，邀请你一起创作'
      },
      {
        id: 'choice14',
        text: '只是礼貌地打个招呼就离开',
        affectionChange: 3,
        nextScene: 'scene15',
        consequence: '小雪礼貌地回应，继续专注于她的创作'
      }
    ]
  },
  {
    id: 'scene8',
    title: '小雨的烘焙时光',
    description: '在小雨家，你们一起制作美味的抹茶蛋糕...',
    background: '/backgrounds/baking.jpg',
    characters: ['xiaoyu'],
    dialogue: '我们一起做蛋糕吧！这样更有趣',
    choices: [
      {
        id: 'choice15',
        text: '好的！我来帮你打蛋清',
        affectionChange: 8,
        nextScene: 'scene16',
        consequence: '小雨很喜欢你的参与，你们配合得很默契'
      },
      {
        id: 'choice16',
        text: '我在旁边看着就好，我怕搞砸了',
        affectionChange: 4,
        nextScene: 'scene17',
        consequence: '小雨理解你的担心，但还是希望你能参与'
      }
    ]
  },
  {
    id: 'scene9',
    title: '咖啡店的偶遇',
    description: '几天后，你在咖啡店又遇到了小雨...',
    background: '/backgrounds/coffee-shop-later.jpg',
    characters: ['xiaoyu'],
    dialogue: '今天有空吗？我做了新的蛋糕想请你尝尝',
    choices: [
      {
        id: 'choice17',
        text: '今天有空！我很期待',
        affectionChange: 6,
        nextScene: 'scene18',
        consequence: '小雨很高兴，准备为你展示她的新作品'
      },
      {
        id: 'choice18',
        text: '抱歉，今天还是没空',
        affectionChange: -1,
        nextScene: 'scene19',
        consequence: '小雨表示理解，但明显有些失落'
      }
    ]
  },
  {
    id: 'scene10',
    title: '健身房挑战',
    description: '在健身房，美美为你安排了一系列挑战性的训练...',
    background: '/backgrounds/gym-challenge.jpg',
    characters: ['meimei'],
    dialogue: '准备好了吗？今天的训练会很辛苦哦！',
    choices: [
      {
        id: 'choice19',
        text: '我准备好了！让我们开始吧',
        affectionChange: 9,
        nextScene: 'scene20',
        consequence: '美美很欣赏你的勇气，决定亲自指导你'
      },
      {
        id: 'choice20',
        text: '能不能从简单的开始？',
        affectionChange: 5,
        nextScene: 'scene21',
        consequence: '美美理解你的想法，调整了训练计划'
      }
    ]
  },
  {
    id: 'scene11',
    title: '美美的理解',
    description: '美美理解你的顾虑，决定从基础开始...',
    background: '/backgrounds/gym-basic.jpg',
    characters: ['meimei'],
    dialogue: '没关系，我们可以从最基础的开始，慢慢来',
    choices: [
      {
        id: 'choice21',
        text: '谢谢你理解我，我们开始吧',
        affectionChange: 6,
        nextScene: 'scene22',
        consequence: '美美很感动你的信任，准备为你制定专属计划'
      },
      {
        id: 'choice22',
        text: '我想先了解一下健身的基本知识',
        affectionChange: 4,
        nextScene: 'scene23',
        consequence: '美美很乐意为你讲解健身知识'
      }
    ]
  },
  {
    id: 'scene12',
    title: '深度咖啡交流',
    description: '小青带你深入了解咖啡的世界...',
    background: '/backgrounds/coffee-deep.jpg',
    characters: ['xiaoqing'],
    dialogue: '咖啡不仅仅是饮品，更是一种生活态度',
    choices: [
      {
        id: 'choice23',
        text: '我很想了解这种生活态度',
        affectionChange: 10,
        nextScene: 'scene24',
        consequence: '小青很高兴遇到真正理解咖啡的人'
      },
      {
        id: 'choice24',
        text: '听起来很有趣，但我更关心口感',
        affectionChange: 6,
        nextScene: 'scene25',
        consequence: '小青理解你的想法，开始介绍不同口感的咖啡'
      }
    ]
  },
  {
    id: 'scene11',
    title: '美美的理解',
    description: '美美理解你的顾虑，决定从基础开始...',
    background: '/backgrounds/gym-basic.jpg',
    characters: ['meimei'],
    dialogue: '没关系，我们可以从最基础的开始，慢慢来',
    choices: [
      {
        id: 'choice21',
        text: '谢谢你理解我，我们开始吧',
        affectionChange: 6,
        nextScene: 'scene22',
        consequence: '美美很感动你的信任，准备为你制定专属计划'
      },
      {
        id: 'choice22',
        text: '我想先了解一下健身的基本知识',
        affectionChange: 4,
        nextScene: 'scene23',
        consequence: '美美很乐意为你讲解健身知识'
      }
    ]
  },
  {
    id: 'scene12',
    title: '深度咖啡交流',
    description: '小青带你深入了解咖啡的世界...',
    background: '/backgrounds/coffee-deep.jpg',
    characters: ['xiaoqing'],
    dialogue: '咖啡不仅仅是饮品，更是一种生活态度',
    choices: [
      {
        id: 'choice23',
        text: '我很想了解这种生活态度',
        affectionChange: 10,
        nextScene: 'scene24',
        consequence: '小青很高兴遇到真正理解咖啡的人'
      },
      {
        id: 'choice24',
        text: '听起来很有趣，但我更关心口感',
        affectionChange: 6,
        nextScene: 'scene25',
        consequence: '小青理解你的想法，开始介绍不同口感的咖啡'
      }
    ]
  },
  {
    id: 'scene13',
    title: '小青的失望',
    description: '小青对你的回应有些失望...',
    background: '/backgrounds/coffee-disappointed.jpg',
    characters: ['xiaoqing'],
    dialogue: '看来你对咖啡的兴趣有限，没关系',
    choices: [
      {
        id: 'choice25',
        text: '其实我想了解更多，刚才是我太紧张了',
        affectionChange: 5,
        nextScene: 'scene26',
        consequence: '小青重新燃起了希望，决定给你一次机会'
      },
      {
        id: 'choice26',
        text: '是的，我对咖啡确实不太了解',
        affectionChange: 1,
        nextScene: 'scene27',
        consequence: '小青礼貌地结束了对话'
      }
    ]
  },
  {
    id: 'scene14',
    title: '小雪的艺术世界',
    description: '小雪邀请你进入她的艺术世界...',
    background: '/backgrounds/art-studio.jpg',
    characters: ['xiaoxue'],
    dialogue: '艺术是心灵的表达，你想试试吗？',
    choices: [
      {
        id: 'choice27',
        text: '我很想尝试，虽然我可能画不好',
        affectionChange: 8,
        nextScene: 'scene28',
        consequence: '小雪很欣赏你的勇气，决定教你基础绘画'
      },
      {
        id: 'choice28',
        text: '我想先欣赏你的作品',
        affectionChange: 5,
        nextScene: 'scene29',
        consequence: '小雪很高兴有人欣赏她的作品'
      }
    ]
  },
  {
    id: 'scene15',
    title: '小雪的专注',
    description: '小雪继续专注于她的创作...',
    background: '/backgrounds/street-art-focus.jpg',
    characters: ['xiaoxue'],
    dialogue: '好的，那我继续画了，下次见',
    choices: [
      {
        id: 'choice29',
        text: '下次见，期待看到你的作品',
        affectionChange: 3,
        nextScene: 'scene30',
        consequence: '小雪对你留下了好印象'
      },
      {
        id: 'choice30',
        text: '再见',
        affectionChange: 1,
        nextScene: 'scene31',
        consequence: '小雪礼貌地告别'
      }
    ]
  },
  {
    id: 'scene16',
    title: '甜蜜时光',
    description: '你们一起制作蛋糕，度过了美好的时光...',
    background: '/backgrounds/baking-together.jpg',
    characters: ['xiaoyu'],
    dialogue: '和你一起做蛋糕真的很开心！',
    choices: [
      {
        id: 'choice31',
        text: '我也是！希望以后还有这样的机会',
        affectionChange: 10,
        nextScene: 'ending_xiaoyu_good',
        consequence: '小雨非常感动，你们的关系更进一步'
      },
      {
        id: 'choice32',
        text: '蛋糕很好吃，谢谢你的邀请',
        affectionChange: 6,
        nextScene: 'ending_xiaoyu_normal',
        consequence: '小雨很开心，你们成为了好朋友'
      }
    ]
  },
  {
    id: 'scene17',
    title: '小雨的鼓励',
    description: '小雨鼓励你参与制作...',
    background: '/backgrounds/baking-encourage.jpg',
    characters: ['xiaoyu'],
    dialogue: '没关系，失败是成功之母，我们一起学习',
    choices: [
      {
        id: 'choice33',
        text: '你说得对，让我试试吧',
        affectionChange: 7,
        nextScene: 'ending_xiaoyu_friendship',
        consequence: '小雨很高兴你的改变，你们的关系更加亲密'
      },
      {
        id: 'choice34',
        text: '我还是在旁边看着吧',
        affectionChange: 3,
        nextScene: 'ending_xiaoyu_acquaintance',
        consequence: '小雨理解你的选择，你们保持着礼貌的关系'
      }
    ]
  },
  {
    id: 'scene18',
    title: '小雨的新作品',
    description: '小雨为你展示她的新蛋糕作品...',
    background: '/backgrounds/new-cake.jpg',
    characters: ['xiaoyu'],
    dialogue: '这是我新学的红丝绒蛋糕，你觉得怎么样？',
    choices: [
      {
        id: 'choice35',
        text: '太棒了！你的手艺越来越好了',
        affectionChange: 8,
        nextScene: 'ending_xiaoyu_good',
        consequence: '小雨非常开心，你们的关系更加亲密'
      },
      {
        id: 'choice36',
        text: '看起来不错，味道应该很好',
        affectionChange: 5,
        nextScene: 'ending_xiaoyu_normal',
        consequence: '小雨对你的评价很满意'
      }
    ]
  },
  {
    id: 'scene19',
    title: '小雨的失落',
    description: '小雨对你的拒绝感到失落...',
    background: '/backgrounds/xiaoyu-sad.jpg',
    characters: ['xiaoyu'],
    dialogue: '没关系，你忙的话就算了',
    choices: [
      {
        id: 'choice37',
        text: '我真的很抱歉，改天一定补偿你',
        affectionChange: 2,
        nextScene: 'ending_xiaoyu_acquaintance',
        consequence: '小雨理解你的忙碌，但关系有所疏远'
      },
      {
        id: 'choice38',
        text: '谢谢你的理解',
        affectionChange: 0,
        nextScene: 'ending_xiaoyu_distant',
        consequence: '小雨礼貌地回应，但热情明显减退'
      }
    ]
  },
  {
    id: 'scene20',
    title: '健身挑战成功',
    description: '你成功完成了美美的健身挑战...',
    background: '/backgrounds/gym-success.jpg',
    characters: ['meimei'],
    dialogue: '太棒了！你的表现超出了我的预期！',
    choices: [
      {
        id: 'choice39',
        text: '都是你的指导有方，我想继续和你一起健身',
        affectionChange: 12,
        nextScene: 'ending_meimei_good',
        consequence: '美美非常感动，你们的关系更加亲密'
      },
      {
        id: 'choice40',
        text: '谢谢你的训练，我感觉很好',
        affectionChange: 8,
        nextScene: 'ending_meimei_normal',
        consequence: '美美很高兴，你们成为了健身伙伴'
      }
    ]
  },
  {
    id: 'scene21',
    title: '循序渐进',
    description: '美美为你制定了循序渐进的训练计划...',
    background: '/backgrounds/gym-progressive.jpg',
    characters: ['meimei'],
    dialogue: '这样更适合你，我们慢慢来',
    choices: [
      {
        id: 'choice41',
        text: '谢谢你为我考虑，我很感动',
        affectionChange: 9,
        nextScene: 'ending_meimei_good',
        consequence: '美美很欣赏你的态度，你们的关系更加亲密'
      },
      {
        id: 'choice42',
        text: '好的，我会努力的',
        affectionChange: 6,
        nextScene: 'ending_meimei_normal',
        consequence: '美美对你的决心很满意'
      }
    ]
  },
  {
    id: 'scene22',
    title: '专属健身计划',
    description: '美美为你制定了个性化的健身计划...',
    background: '/backgrounds/personal-plan.jpg',
    characters: ['meimei'],
    dialogue: '这是专门为你制定的计划，希望你喜欢',
    choices: [
      {
        id: 'choice43',
        text: '太贴心了！我一定会认真执行',
        affectionChange: 10,
        nextScene: 'ending_meimei_good',
        consequence: '美美很感动你的认真态度'
      },
      {
        id: 'choice44',
        text: '看起来很不错，我会试试的',
        affectionChange: 7,
        nextScene: 'ending_meimei_normal',
        consequence: '美美对你的反馈很满意'
      }
    ]
  },
  {
    id: 'scene23',
    title: '健身知识课堂',
    description: '美美为你详细讲解健身知识...',
    background: '/backgrounds/gym-education.jpg',
    characters: ['meimei'],
    dialogue: '了解这些基础知识很重要，你还有什么问题吗？',
    choices: [
      {
        id: 'choice45',
        text: '我想了解更多，可以继续吗？',
        affectionChange: 8,
        nextScene: 'ending_meimei_normal',
        consequence: '美美很高兴你的求知欲'
      },
      {
        id: 'choice46',
        text: '谢谢你的讲解，我学到了很多',
        affectionChange: 5,
        nextScene: 'ending_meimei_acquaintance',
        consequence: '美美对你的感谢很满意'
      }
    ]
  },
  {
    id: 'scene24',
    title: '咖啡哲学',
    description: '小青带你深入了解咖啡的哲学...',
    background: '/backgrounds/coffee-philosophy.jpg',
    characters: ['xiaoqing'],
    dialogue: '每一杯咖啡都有它的故事，就像每个人都有自己的故事',
    choices: [
      {
        id: 'choice47',
        text: '我想听听你的故事',
        affectionChange: 10,
        nextScene: 'ending_xiaoqing_good',
        consequence: '小青很感动你的关心，你们的关系更加亲密'
      },
      {
        id: 'choice48',
        text: '咖啡确实很有魅力',
        affectionChange: 7,
        nextScene: 'ending_xiaoqing_normal',
        consequence: '小青很高兴你理解咖啡的魅力'
      }
    ]
  },
  {
    id: 'scene25',
    title: '口感探索',
    description: '小青为你介绍不同口感的咖啡...',
    background: '/backgrounds/coffee-taste.jpg',
    characters: ['xiaoqing'],
    dialogue: '从酸度到苦度，每一种都有它的特色',
    choices: [
      {
        id: 'choice49',
        text: '我想尝试不同的口感',
        affectionChange: 8,
        nextScene: 'ending_xiaoqing_normal',
        consequence: '小青很高兴你的探索精神'
      },
      {
        id: 'choice50',
        text: '听起来很复杂，但我很感兴趣',
        affectionChange: 6,
        nextScene: 'ending_xiaoqing_acquaintance',
        consequence: '小青理解你的想法'
      }
    ]
  },
  {
    id: 'scene26',
    title: '重新开始',
    description: '小青决定重新给你一次机会...',
    background: '/backgrounds/coffee-second-chance.jpg',
    characters: ['xiaoqing'],
    dialogue: '没关系，紧张是正常的，我们重新开始',
    choices: [
      {
        id: 'choice51',
        text: '谢谢你给我机会，我很珍惜',
        affectionChange: 7,
        nextScene: 'ending_xiaoqing_normal',
        consequence: '小青很欣赏你的真诚'
      },
      {
        id: 'choice52',
        text: '好的，我们重新开始',
        affectionChange: 5,
        nextScene: 'ending_xiaoqing_acquaintance',
        consequence: '小青对你的态度很满意'
      }
    ]
  },
  {
    id: 'scene27',
    title: '礼貌告别',
    description: '小青礼貌地结束了对话...',
    background: '/backgrounds/coffee-goodbye.jpg',
    characters: ['xiaoqing'],
    dialogue: '没关系，希望下次有机会再聊',
    choices: [
      {
        id: 'choice53',
        text: '好的，下次见',
        affectionChange: 2,
        nextScene: 'ending_xiaoqing_distant',
        consequence: '小青礼貌地告别'
      },
      {
        id: 'choice54',
        text: '再见',
        affectionChange: 1,
        nextScene: 'ending_xiaoqing_distant',
        consequence: '小青礼貌地回应'
      }
    ]
  },
  {
    id: 'scene28',
    title: '绘画学习',
    description: '小雪教你基础绘画技巧...',
    background: '/backgrounds/art-learning.jpg',
    characters: ['xiaoxue'],
    dialogue: '绘画最重要的是用心去感受，不要害怕犯错',
    choices: [
      {
        id: 'choice55',
        text: '我会用心去感受的，谢谢你教我',
        affectionChange: 9,
        nextScene: 'ending_xiaoxue_good',
        consequence: '小雪很感动你的认真态度'
      },
      {
        id: 'choice56',
        text: '我会努力的，虽然可能画不好',
        affectionChange: 7,
        nextScene: 'ending_xiaoxue_normal',
        consequence: '小雪很欣赏你的勇气'
      }
    ]
  },
  {
    id: 'scene29',
    title: '作品欣赏',
    description: '你仔细欣赏小雪的艺术作品...',
    background: '/backgrounds/art-appreciation.jpg',
    characters: ['xiaoxue'],
    dialogue: '每一幅画都承载着我的情感和想法',
    choices: [
      {
        id: 'choice57',
        text: '我能感受到你作品中的情感',
        affectionChange: 8,
        nextScene: 'ending_xiaoxue_good',
        consequence: '小雪很感动你能理解她的作品'
      },
      {
        id: 'choice58',
        text: '你的作品很有特色',
        affectionChange: 6,
        nextScene: 'ending_xiaoxue_normal',
        consequence: '小雪对你的评价很满意'
      }
    ]
  },
  {
    id: 'scene30',
    title: '下次约定',
    description: '你们约定下次再见...',
    background: '/backgrounds/street-art-next.jpg',
    characters: ['xiaoxue'],
    dialogue: '下次见，希望你能看到我完成的作品',
    choices: [
      {
        id: 'choice59',
        text: '我很期待看到你的作品',
        affectionChange: 5,
        nextScene: 'ending_xiaoxue_acquaintance',
        consequence: '小雪很高兴你的期待'
      },
      {
        id: 'choice60',
        text: '好的，下次见',
        affectionChange: 3,
        nextScene: 'ending_xiaoxue_acquaintance',
        consequence: '小雪礼貌地告别'
      }
    ]
  },
  {
    id: 'scene31',
    title: '简单告别',
    description: '你们简单地告别...',
    background: '/backgrounds/street-art-simple.jpg',
    characters: ['xiaoxue'],
    dialogue: '再见',
    choices: [
      {
        id: 'choice61',
        text: '再见',
        affectionChange: 2,
        nextScene: 'ending_xiaoxue_distant',
        consequence: '小雪礼貌地告别'
      },
      {
        id: 'choice62',
        text: '拜拜',
        affectionChange: 1,
        nextScene: 'ending_xiaoxue_distant',
        consequence: '小雪简单回应'
      }
    ]
  }
];

export const getSceneById = (id: string): Scene | undefined => {
  return scenes.find(scene => scene.id === id);
};

export const getInitialScene = (): Scene => {
  return scenes[0];
};

export const getScenesByCharacter = (characterId: string): Scene[] => {
  return scenes.filter(scene => scene.characters.includes(characterId));
};

export const getTotalScenes = (): number => {
  return scenes.length;
};
