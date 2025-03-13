const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Allowed origins configuration
const allowedOrigins = {
  production: [
    'https://jarviszxw.github.io',
    'https://jarviszxw.github.io/TestWeb-website'
  ],
  development: [
    'http://localhost:8080',
    'http://127.0.0.1:5500'
  ]
};

// Enhanced CORS configuration with origin validation
app.use(cors({
  origin: function(origin, callback) {
    // Get allowed origins based on environment
    const origins = process.env.NODE_ENV === 'production' 
      ? allowedOrigins.production 
      : allowedOrigins.development;
    
    // Check if origin is allowed
    if (!origin || origins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'));
    }
  },
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  if (err.message === 'CORS policy violation') {
    console.error(`CORS Error: ${req.headers.origin} not allowed`);
    res.status(403).json({
      error: 'Origin not allowed by CORS policy'
    });
  } else {
    next(err);
  }
});

// Add CORS debugging middleware
app.use((req, res, next) => {
  console.log('Incoming request from origin:', req.headers.origin);
  console.log('Current environment:', process.env.NODE_ENV);
  next();
});

app.get('/get-fans-count', async (req, res) => {
  const userProfileUrl = 'https://api.bilibili.com/x/relation/stat?vmid=343104452'; // B站API URL

  try {
    // Sending GET request to fetch user data
    const response = await axios.get(userProfileUrl);
    const data = response.data;

    // Sending the data as the response
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('获取粉丝数失败');
  }
});

// 添加健康检查端点
app.get('/', (req, res) => {
  res.send('API服务运行正常');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

/* 项目结构
├── TestProject/
│   ├── proxy.js      # 后端服务器入口
│   ├── TestWeb.html  # 前端页面
│   └── main.css      # 样式文件
└── package.json      # 项目配置
*/