import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('缺少 Supabase 环境变量配置。请检查 .env.local 文件。');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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