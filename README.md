# smarthub-platform

cd frontend
npm run dev

cd backend
node server.js

cd ai/recommender
python api.py

--------------------------------------------------------------------------------
📂 CẤU TRÚC THƯ MỤC
--------------------------------------------------------------------------------
```bash
smarthub-platform/
│
├── backend/          # NodeJS (API, Auth, Order, User…)
│   ├── src/
│   └── package.json
│
├── frontend/         # ReactJS
│   ├── src/
│   └── package.json
│
├── ai/               # Python (crawl, recommend, model)
│   ├── crawler/
│   ├── recommender/
│   └── requirements.txt
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── docs/
│   └── architecture.md
│
└── README.md
```