import { db, Salary, City, Result } from './supabase';

// 计算年度月平均工资
export function calculateAverageSalary(salaries: Salary[]): Map<string, number> {
  const employeeSalaries = new Map<string, number[]>();

  // 按员工分组工资数据
  for (const salary of salaries) {
    if (!employeeSalaries.has(salary.employee_name)) {
      employeeSalaries.set(salary.employee_name, []);
    }
    employeeSalaries.get(salary.employee_name)!.push(salary.salary_amount);
  }

  // 计算每位员工的平均工资
  const averageSalaries = new Map<string, number>();
  for (const [employeeName, salaryList] of employeeSalaries) {
    const total = salaryList.reduce((sum, amount) => sum + amount, 0);
    const average = total / salaryList.length;
    averageSalaries.set(employeeName, average);
  }

  return averageSalaries;
}

// 获取城市标准（默认佛山，最新年份）
export async function getCityStandard(cityName: string = '佛山'): Promise<City> {
  const standard = await db.getCityStandard(cityName);

  if (!standard) {
    throw new Error(`未找到城市 ${cityName} 的社保标准数据`);
  }

  return standard;
}

// 确定缴费基数
export function determineContributionBase(
  averageSalary: number,
  baseMin: number,
  baseMax: number
): number {
  if (averageSalary < baseMin) {
    return baseMin;
  } else if (averageSalary > baseMax) {
    return baseMax;
  } else {
    return averageSalary;
  }
}

// 计算公司应缴金额
export function calculateCompanyFee(
  contributionBase: number,
  rate: number
): number {
  return contributionBase * rate;
}

// 完整的计算流程
export async function calculateAllContributions(): Promise<Result[]> {
  try {
    // 1. 读取工资数据
    const salaries = await db.getSalaries();

    if (salaries.length === 0) {
      throw new Error('没有找到工资数据，请先上传工资数据');
    }

    // 2. 计算年度月平均工资
    const averageSalaries = calculateAverageSalary(salaries);

    // 3. 获取城市标准（默认佛山）
    const cityStandard = await getCityStandard();
    const { base_min, base_max, rate } = cityStandard;

    // 4. 清空之前的计算结果
    await db.clearResults();

    // 5. 为每位员工计算并存储结果
    const results: Omit<Result, 'id' | 'calculated_at'>[] = [];

    for (const [employeeName, avgSalary] of averageSalaries) {
      // 确定缴费基数
      const contributionBase = determineContributionBase(avgSalary, base_min, base_max);

      // 计算公司应缴金额
      const companyFee = calculateCompanyFee(contributionBase, rate);

      results.push({
        employee_name: employeeName,
        avg_salary: parseFloat(avgSalary.toFixed(2)),
        contribution_base: parseFloat(contributionBase.toFixed(2)),
        company_fee: parseFloat(companyFee.toFixed(2))
      });
    }

    // 6. 存储计算结果
    const savedResults = await db.insertResults(results);

    return savedResults;

  } catch (error) {
    console.error('计算过程中发生错误:', error);
    throw error;
  }
}

// 导出计算函数供其他模块使用
export const calculations = {
  calculateAverageSalary,
  getCityStandard,
  determineContributionBase,
  calculateCompanyFee,
  calculateAllContributions
};