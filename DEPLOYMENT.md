# Vercel 部署指南

## 环境变量配置

在 Vercel 部署前，需要在项目设置中配置以下环境变量：

### 必需的环境变量

| 变量名 | 描述 | 示例值 |
|--------|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | `https://rcfbkdmmzuzdxekybxzm.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjZmJrZG1tenV6ZHhla3lieHptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3ODM0NTAsImV4cCI6MjA4NDM1OTQ1MH0.K8hK9wGtUJing0mQtNzLyLunZMsmscris10RrxIgLzg` |

### 可选的环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `NEXT_PUBLIC_DEFAULT_CITY` | 默认计算城市 | `佛山` |
| `NEXT_PUBLIC_DEFAULT_YEAR` | 默认计算年份 | `2024` |

## 配置步骤

1. **登录 Vercel**：访问 https://vercel.com
2. **选择项目**：`ming-wuxianyijin`
3. **进入设置**：Settings → Environment Variables
4. **添加环境变量**：
   - 点击 "Add New"
   - 输入变量名和值
   - 选择环境：Production, Preview, Development（全选）
   - 点击 "Save"
5. **重新部署**：在部署页面点击 "Redeploy"

## Supabase 数据库设置

确保 Supabase 数据库已正确设置：

1. **创建表**：运行 `supabase_tables.sql` 中的 SQL 语句
2. **表结构**：
   - `cities`：城市社保标准
   - `salaries`：员工工资数据
   - `results`：计算结果

## 测试部署

部署完成后：

1. 访问部署的 URL（如 `https://ming-wuxianyijin.vercel.app`）
2. 测试功能：
   - 主页导航
   - 数据上传页面
   - 计算结果页面

## 故障排除

### 错误：缺少 Supabase 环境变量配置
- 检查 Vercel 环境变量是否已配置
- 确保变量名正确（注意大小写）
- 重新部署项目

### 错误：数据库连接失败
- 检查 Supabase 项目是否正常运行
- 验证 URL 和密钥是否正确
- 检查 Supabase 表是否已创建

### 构建失败
- 检查构建日志中的具体错误
- 确保所有依赖已正确安装
- 验证 TypeScript 编译是否通过

## 本地开发

```bash
# 安装依赖
npm install

# 复制环境变量文件
cp .env.example .env.local

# 编辑 .env.local 文件，填入实际的 Supabase 配置

# 开发模式
npm run dev

# 构建测试
npm run build
```

## 注意事项

1. `.env.local` 文件已添加到 `.gitignore`，不会上传到 GitHub
2. 生产环境必须通过 Vercel 环境变量配置
3. Supabase 匿名密钥可以公开，但应定期轮换
4. 建议启用 Supabase 行级安全（RLS）策略