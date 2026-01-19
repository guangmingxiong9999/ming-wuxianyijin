import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 创建 Supabase 客户端（构建时兼容模式）
let supabaseClient;

// 检查是否是客户端环境
const isClient = typeof window !== 'undefined';

if (!supabaseUrl || !supabaseAnonKey) {
  if (isClient) {
    // 客户端运行时：显示详细错误
    console.error('❌ Supabase 环境变量未配置！请检查：');
    console.error('1. Vercel 环境变量配置：');
    console.error('   - NEXT_PUBLIC_SUPABASE_URL');
    console.error('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
    console.error('2. 当前值：');
    console.error(`   - URL: ${supabaseUrl || '未设置'}`);
    console.error(`   - Key: ${supabaseAnonKey ? '已设置（隐藏）' : '未设置'}`);

    // 在页面上显示错误（可选）
    if (typeof document !== 'undefined') {
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #f44336;
        color: white;
        padding: 15px;
        border-radius: 5px;
        z-index: 9999;
        max-width: 400px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      `;
      errorDiv.innerHTML = `
        <strong>⚠️ 配置错误</strong><br>
        Supabase 环境变量未配置。<br>
        请检查 Vercel 环境变量设置。
      `;
      document.body.appendChild(errorDiv);
    }
  }

  // 返回一个完整的假客户端，避免构建失败和运行时错误
  const fakeClient = {
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          order: (column: string, options?: { ascending: boolean }) =>
            Promise.resolve({ data: [], error: null })
        }),
        order: (column: string, options?: { ascending: boolean }) =>
          Promise.resolve({ data: [], error: null })
      }),
      insert: (data: any) => ({
        select: (columns?: string) => Promise.resolve({ data: [], error: null })
      }),
      delete: () => ({
        neq: (column: string, value: any) => Promise.resolve({ error: null })
      }),
      eq: (column: string, value: any) => ({
        select: (columns?: string) => ({
          order: (column: string, options?: { ascending: boolean }) =>
            Promise.resolve({ data: [], error: null })
        }),
        order: (column: string, options?: { ascending: boolean }) =>
          Promise.resolve({ data: [], error: null })
      }),
      order: (column: string, options?: { ascending: boolean }) =>
        Promise.resolve({ data: [], error: null })
    })
  } as any;

  supabaseClient = fakeClient;
} else {
  // 环境变量已配置，创建真实的 Supabase 客户端
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

  if (isClient) {
    console.log('✅ Supabase 客户端已成功初始化');
  }
}

export const supabase = supabaseClient;

// 数据库表类型定义
export interface City {
  id: number;
  city_name: string;
  year: string;
  base_min: number;
  base_max: number;
  rate: number;
  created_at: string;
}

export interface Salary {
  id: number;
  employee_id: string;
  employee_name: string;
  month: string;
  salary_amount: number;
  created_at: string;
}

export interface Result {
  id: number;
  employee_name: string;
  avg_salary: number;
  contribution_base: number;
  company_fee: number;
  calculated_at: string;
}

// 数据库操作函数
export const db = {
  // 获取所有城市标准数据
  async getCities() {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('year', { ascending: false });

    if (error) throw error;
    return data as City[];
  },

  // 获取指定城市和年份的标准
  async getCityStandard(cityName: string, year?: string) {
    let query = supabase
      .from('cities')
      .select('*')
      .eq('city_name', cityName);

    if (year) {
      query = query.eq('year', year);
    } else {
      query = query.order('year', { ascending: false }).limit(1);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data[0] as City | null;
  },

  // 获取所有工资数据
  async getSalaries() {
    const { data, error } = await supabase
      .from('salaries')
      .select('*');

    if (error) throw error;
    return data as Salary[];
  },

  // 批量插入工资数据
  async insertSalaries(salaries: Omit<Salary, 'id' | 'created_at'>[]) {
    const { data, error } = await supabase
      .from('salaries')
      .insert(salaries)
      .select();

    if (error) throw error;
    return data as Salary[];
  },

  // 获取所有计算结果
  async getResults() {
    const { data, error } = await supabase
      .from('results')
      .select('*')
      .order('calculated_at', { ascending: false });

    if (error) throw error;
    return data as Result[];
  },

  // 清空计算结果表
  async clearResults() {
    const { error } = await supabase
      .from('results')
      .delete()
      .neq('id', 0); // 删除所有记录

    if (error) throw error;
    return true;
  },

  // 批量插入计算结果
  async insertResults(results: Omit<Result, 'id' | 'calculated_at'>[]) {
    const { data, error } = await supabase
      .from('results')
      .insert(results)
      .select();

    if (error) throw error;
    return data as Result[];
  },

  // 批量插入城市标准数据
  async insertCities(cities: Omit<City, 'id' | 'created_at'>[]) {
    const { data, error } = await supabase
      .from('cities')
      .insert(cities)
      .select();

    if (error) throw error;
    return data as City[];
  }
};