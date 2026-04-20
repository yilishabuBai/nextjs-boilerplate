# Next.js Game Platform 🎮

A Next.js-based game platform featuring **Flappy Bird** and more, with global leaderboard persistence and comprehensive test coverage.

[![codecov](https://codecov.io/gh/yilishabuBai/nextjs-boilerplate/graph/badge.svg)](https://codecov.io/gh/yilishabuBai/nextjs-boilerplate)
[![Tests & Coverage](https://github.com/yilishabuBai/nextjs-boilerplate/actions/workflows/test.yml/badge.svg)](https://github.com/yilishabuBai/nextjs-boilerplate/actions/workflows/test.yml)

---

## 🎯 Features

- **🎮 Game Platform**: Play Flappy Bird and more games
- **🏆 Global Leaderboard**: Real-time score ranking powered by Upstash Redis
- **📊 Test Coverage**: 122 tests with 20%+ coverage
- **🚀 Vercel Ready**: Optimized for serverless deployment

---

## 🎮 Games

### Flappy Bird 🐦

Classic Flappy Bird game with:
- Smooth physics and collision detection
- Real-time score tracking
- Global leaderboard integration
- Responsive design

**Play**: [https://nextjs-boilerplate.vercel.app/games/flappy-bird](https://nextjs-boilerplate.vercel.app/games/flappy-bird)

---

## 🏆 Leaderboard

Global leaderboard data is stored in **Upstash Redis**, optimized for Vercel serverless deployments.

### Environment Variables

Set these in Vercel Project Settings (or local `.env.local`):

```bash
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

Or use Vercel KV integration defaults:

```bash
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

> ⚠️ Without either variable pair, leaderboard API requests will return a configuration error.

---

## 🚀 Getting Started

### Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

### Run tests with coverage:

```bash
npm test
# or
npm run test:ci  # For CI environments
```

---

## 📊 Test Coverage

**Current Coverage**: 20.12% (122 tests)

| Module | Coverage | Status |
|--------|----------|--------|
| `pipe-layout.ts` | 100% | ✅ |
| `registry.ts` | 90% | ✅ |
| `storage.ts` | 87.8% | ✅ |

View detailed coverage report: [Codecov Dashboard](https://app.codecov.io/gh/yilishabuBai/nextjs-boilerplate)

---

## 🏗️ Project Structure

```
nextjs-boilerplate/
├── app/                    # Next.js App Router
│   ├── api/leaderboard/    # Leaderboard API endpoints
│   └── games/[slug]/       # Game pages
├── components/             # React components
│   └── game-hall/          # Game hall UI
├── core/                   # Core business logic
│   └── game-engine/        # Game engine (registry, storage, leaderboard)
├── games/                  # Game implementations
│   └── flappy-bird/        # Flappy Bird game
├── __tests__/              # Jest test suites
└── coverage/               # Coverage reports
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4.10 (App Router)
- **Language**: TypeScript 5
- **UI**: React 19.1.0 + Tailwind CSS 4
- **Database**: Upstash Redis (serverless)
- **Testing**: Jest + Testing Library
- **Coverage**: Codecov

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - features and API
- [Learn Next.js](https://nextjs.org/learn) - interactive tutorial
- [Upstash Redis](https://upstash.com/docs/redis) - serverless Redis
- [Codecov](https://docs.codecov.com) - coverage reporting

---

## 🚀 Deploy on Vercel

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

### Pre-deployment Checklist

- [ ] Set up Upstash Redis environment variables
- [ ] Configure custom domain (optional)
- [ ] Enable GitHub integration for automatic deployments

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for new features
4. Ensure coverage doesn't decrease
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

_Built with ❤️ using Next.js_
