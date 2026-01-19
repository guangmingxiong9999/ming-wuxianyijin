# 五险一金计算器 Web 应用

一个迷你的"五险一金"计算器Web应用，根据预设的员工工资数据和城市社保标准，计算出公司为每位员工应缴纳的社保公积金费用。

## 功能特性

- 📊 **数据上传**: 上传员工工资和城市标准数据
- 🧮 **智能计算**: 自动计算年度月平均工资和五险一金费用
- 📈 **结果展示**: 清晰展示计算结果和统计信息
- 📥 **数据导出**: 支持导出计算结果为 CSV 格式
- 🎨 **响应式设计**: 适配各种设备屏幕

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **开发语言**: TypeScript
- **样式框架**: Tailwind CSS
- **数据库**: Supabase (PostgreSQL)
- **图标库**: Lucide React
- **Excel 处理**: xlsx

## 快速开始

### 1. 环境准备

```bash
# 克隆项目
git clone <repository-url>
cd shebao-calculator

# 安装依赖
npm install
```

### 2. 配置 Supabase

1. 创建 [Supabase](https://supabase.com) 项目
2. 获取项目 URL 和匿名 API 密钥
3. 在 Supabase SQL 编辑器中执行 `supabase_tables.sql` 脚本创建表结构
4. 复制 `.env.example` 为 `.env.local` 并填写配置：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_DEFAULT_CITY=佛山
NEXT_PUBLIC_DEFAULT_YEAR=2024
```

### 3. 运行开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 访问应用。

## 使用说明

### 数据准备

准备 Excel 文件，包含两个工作表：

1. **工资数据表**: 包含员工工号、姓名、月份、工资金额
2. **城市标准表**: 包含城市名、年份、基数下限、基数上限、缴纳比例

详细格式请参考 [Excel 模板说明](public/excel_template.md)

### 操作流程

1. **上传数据**: 在数据上传页面导入 Excel 文件
2. **执行计算**: 点击"执行计算并存储结果"按钮
3. **查看结果**: 在结果查询页面查看计算出的五险一金费用

## 项目结构

```
shebao-calculator/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   ├── upload/            # 数据上传页面
│   ├── results/           # 结果查询页面
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页
├── components/            # React 组件
├── lib/                   # 工具函数和配置
│   ├── supabase.ts       # Supabase 客户端配置
│   ├── calculations.ts   # 核心计算逻辑
│   └── excelParser.ts    # Excel 文件解析
├── public/               # 静态资源
└── supabase_tables.sql   # 数据库表结构脚本
```

## 核心计算逻辑

1. **数据读取**: 从 `salaries` 表读取所有工资数据
2. **分组计算**: 按员工分组，计算年度月平均工资
3. **获取标准**: 获取城市社保标准（默认佛山）
4. **确定基数**: 根据平均工资和基数上下限确定缴费基数
5. **计算费用**: 缴费基数 × 缴纳比例 = 公司应缴金额
6. **存储结果**: 将计算结果存入 `results` 表

## 部署

### Vercel 部署

1. 将代码推送到 GitHub 仓库
2. 在 [Vercel](https://vercel.com) 中导入项目
3. 配置环境变量
4. 部署完成

### 其他部署方式

项目支持部署到任何支持 Next.js 的平台，如：
- Netlify
- Railway
- Docker 容器

## 开发指南

### 添加新功能

1. 在 `lib/` 目录中添加相关工具函数
2. 在 `app/` 目录中创建新的页面或 API 路由
3. 在 `components/` 目录中创建可复用组件

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码
- 编写清晰的注释和文档

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交 Issue 或联系项目维护者。
