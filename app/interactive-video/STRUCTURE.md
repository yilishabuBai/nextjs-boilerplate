# 项目文件结构说明

## 📁 目录结构

```
app/interactive-video/
├── components/           # UI组件
│   ├── CharacterPanel.tsx    # 角色状态面板
│   ├── SceneDisplay.tsx      # 场景展示组件
│   ├── ChoiceResult.tsx      # 选择结果组件
│   ├── GameHistory.tsx       # 游戏历史组件
│   └── index.ts              # 组件导出索引
├── data/                # 数据文件
│   ├── characters.ts         # 角色数据
│   └── scenes.ts            # 场景数据
├── hooks/               # 自定义Hook
│   └── useGameState.ts      # 游戏状态管理Hook
├── types/               # 类型定义
│   └── index.ts             # 接口和类型定义
├── utils/               # 工具函数
│   └── gameLogic.ts         # 游戏逻辑工具函数
├── page.tsx             # 主页面组件
├── README.md            # 游戏说明文档
└── STRUCTURE.md         # 项目结构说明（本文件）
```

## 🔧 各模块职责

### 1. 类型定义 (`types/`)
- `Character` - 角色接口
- `Choice` - 选择选项接口
- `Scene` - 场景接口
- `GameState` - 游戏状态接口

### 2. 数据层 (`data/`)
- `characters.ts` - 角色数据管理
- `scenes.ts` - 场景数据管理
- 提供数据查询和获取函数

### 3. 业务逻辑 (`utils/`)
- `gameLogic.ts` - 游戏核心逻辑
- 好感度计算、场景切换等

### 4. 状态管理 (`hooks/`)
- `useGameState.ts` - 游戏状态管理Hook
- 统一管理所有游戏相关的状态和操作

### 5. UI组件 (`components/`)
- `CharacterPanel` - 角色信息展示
- `SceneDisplay` - 场景内容展示
- `ChoiceResult` - 选择结果展示
- `GameHistory` - 游戏历程展示

### 6. 页面组件 (`page.tsx`)
- 主页面，组合所有组件
- 使用自定义Hook管理状态

## 🎯 设计原则

### 单一职责原则
每个文件只负责一个特定的功能模块

### 关注点分离
- 数据、逻辑、UI分别管理
- 状态管理与组件渲染分离

### 可维护性
- 模块化设计，易于修改和扩展
- 清晰的接口定义，降低耦合度

### 可复用性
- 组件可以在不同场景下复用
- 工具函数可以在多个地方使用

## 🚀 扩展指南

### 添加新角色
1. 在 `types/index.ts` 中扩展角色接口
2. 在 `data/characters.ts` 中添加角色数据
3. 在 `components/CharacterPanel.tsx` 中更新显示逻辑

### 添加新场景
1. 在 `types/index.ts` 中扩展场景接口
2. 在 `data/scenes.ts` 中添加场景数据
3. 在 `components/SceneDisplay.tsx` 中更新显示逻辑

### 添加新功能
1. 在 `types/index.ts` 中定义新的接口
2. 在 `utils/` 中实现相关逻辑
3. 在 `hooks/useGameState.ts` 中添加状态管理
4. 在相应的组件中实现UI展示

## 📝 注意事项

- 所有组件都使用TypeScript进行类型检查
- 使用React Hooks进行状态管理
- 遵循React函数组件的最佳实践
- 使用Tailwind CSS进行样式设计
- 保持组件的纯函数特性，便于测试
