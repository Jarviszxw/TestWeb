const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import the cors package

const app = express();
const port = 3000;

// Use the cors middleware with specific options
app.use(cors({
  // origin: 'http://localhost:8080', // Allow only this origin
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://Jarviszxw.github.io/TestWeb']
    : ['http://localhost:8080', 'http://127.0.0.1:5500'],
  methods: 'GET', // Allow only GET requests
  allowedHeaders: ['Content-Type'] // Allow only specific headers
}));

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