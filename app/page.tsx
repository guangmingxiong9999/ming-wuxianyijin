'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calculator, Upload, BarChart3, Shield, Users, FileCheck } from 'lucide-react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      title: '数据上传',
      description: '上传员工工资和城市标准数据',
      icon: Upload,
      href: '/upload',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
      delay: 'delay-0',
    },
    {
      title: '结果查询',
      description: '查看五险一金计算结果',
      icon: BarChart3,
      href: '/results',
      color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
      delay: 'delay-100',
    },
  ];

  const steps = [
    {
      number: '01',
      title: '准备数据',
      description: '准备员工工资数据和城市社保标准的 Excel 文件',
      icon: FileCheck,
      color: 'from-blue-500 to-blue-600',
    },
    {
      number: '02',
      title: '上传数据',
      description: '在数据上传页面导入 Excel 文件到数据库',
      icon: Upload,
      color: 'from-green-500 to-green-600',
    },
    {
      number: '03',
      title: '查看结果',
      description: '在结果查询页面查看计算出的五险一金费用',
      icon: BarChart3,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const stats = [
    { label: '快速计算', value: '< 5秒', icon: Calculator },
    { label: '准确可靠', value: '100%', icon: Shield },
    { label: '支持多人', value: '无限制', icon: Users },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* 英雄区域 */}
      <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 text-sm font-medium mb-6">
          <Shield className="w-4 h-4 mr-2" />
          专业五险一金计算工具
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          智能
          <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent"> 五险一金 </span>
          计算器
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
          根据预设的员工工资数据和城市社保标准，自动计算出公司为每位员工应缴纳的社保公积金费用
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link
            href="/upload"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl shadow-lg"
          >
            <Upload className="w-5 h-5 mr-3" />
            开始使用
          </Link>
          <Link
            href="/results"
            className="inline-flex items-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300"
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            查看示例
          </Link>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover-card transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="w-10 h-10 text-blue-500" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{stat.label}</h3>
          </div>
        ))}
      </div>

      {/* 功能卡片 */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          核心功能
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Link
              key={feature.title}
              href={feature.href}
              className={`block group transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${feature.delay}`}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover-card h-full border border-gray-100 dark:border-gray-700">
                <div className="flex items-start space-x-6">
                  <div className={`p-4 rounded-xl ${feature.color} transform group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">{feature.description}</p>
                    <div className="mt-6 inline-flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-2 transition-transform duration-300">
                      立即体验
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 使用步骤 */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-12 mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          简单三步，轻松计算
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`relative transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg h-full">
                <div className="absolute -top-4 -left-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                    {step.number}
                  </div>
                </div>
                <div className="pt-8">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6`}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-green-500"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 技术栈 */}
      <div className="text-center">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          技术栈
        </h3>
        <div className="flex flex-wrap justify-center gap-8">
          {['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL'].map((tech) => (
            <div
              key={tech}
              className="px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-md text-gray-700 dark:text-gray-300 font-medium hover:shadow-lg transition-shadow duration-300"
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
