import * as XLSX from 'xlsx';

// Excel 文件数据结构
export interface ExcelSalaryData {
  employee_id: string;
  employee_name: string;
  month: string; // YYYYMM 格式
  salary_amount: number;
}

export interface ExcelCityData {
  city_name: string;
  year: string;
  base_min: number;
  base_max: number;
  rate: number;
}

// 解析 Excel 文件
export function parseExcelFile(file: File): Promise<{
  salaries: ExcelSalaryData[];
  cities: ExcelCityData[];
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error('无法读取文件'));
          return;
        }

        const workbook = XLSX.read(data, { type: 'binary' });
        const result = parseWorkbook(workbook);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('读取文件失败'));
    };

    reader.readAsBinaryString(file);
  });
}

// 解析工作簿
function parseWorkbook(workbook: XLSX.WorkBook): {
  salaries: ExcelSalaryData[];
  cities: ExcelCityData[];
} {
  const salaries: ExcelSalaryData[] = [];
  const cities: ExcelCityData[] = [];

  // 遍历所有工作表
  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (jsonData.length === 0) return;

    // 尝试根据列名判断数据类型
    const firstRow = jsonData[0];
    const columns = Object.keys(firstRow);

    // 检查是否包含工资数据相关列
    const hasSalaryColumns = columns.some(col =>
      col.includes('工号') || col.includes('employee') ||
      col.includes('姓名') || col.includes('name') ||
      col.includes('工资') || col.includes('salary')
    );

    // 检查是否包含城市标准相关列
    const hasCityColumns = columns.some(col =>
      col.includes('城市') || col.includes('city') ||
      col.includes('基数') || col.includes('base') ||
      col.includes('比例') || col.includes('rate')
    );

    // 根据列名判断数据类型
    if (hasSalaryColumns) {
      // 解析工资数据
      jsonData.forEach((row: any) => {
        const salary = parseSalaryRow(row);
        if (salary) {
          salaries.push(salary);
        }
      });
    } else if (hasCityColumns) {
      // 解析城市标准数据
      jsonData.forEach((row: any) => {
        const city = parseCityRow(row);
        if (city) {
          cities.push(city);
        }
      });
    } else {
      // 如果无法通过列名判断，尝试通过工作表名称判断
      if (sheetName.toLowerCase().includes('salary') || sheetName.toLowerCase().includes('工资')) {
        jsonData.forEach((row: any) => {
          const salary = parseSalaryRow(row);
          if (salary) {
            salaries.push(salary);
          }
        });
      } else if (sheetName.toLowerCase().includes('city') || sheetName.toLowerCase().includes('城市')) {
        jsonData.forEach((row: any) => {
          const city = parseCityRow(row);
          if (city) {
            cities.push(city);
          }
        });
      }
    }
  });

  return { salaries, cities };
}

// 解析工资数据行
function parseSalaryRow(row: any): ExcelSalaryData | null {
  try {
    // 尝试不同的列名
    const employeeId = row['员工工号'] || row['employee_id'] || row['工号'] || '';
    const employeeName = row['员工姓名'] || row['employee_name'] || row['姓名'] || '';
    const month = row['月份'] || row['month'] || row['年月'] || '';
    const salaryAmount = row['工资金额'] || row['salary_amount'] || row['工资'] || 0;

    if (!employeeId || !employeeName || !month || !salaryAmount) {
      console.warn('工资数据行缺少必要字段:', row);
      return null;
    }

    // 格式化月份为 YYYYMM
    let formattedMonth = month.toString();
    if (formattedMonth.includes('-')) {
      const [year, monthNum] = formattedMonth.split('-');
      formattedMonth = `${year}${monthNum.padStart(2, '0')}`;
    }

    return {
      employee_id: employeeId.toString(),
      employee_name: employeeName.toString(),
      month: formattedMonth,
      salary_amount: Number(salaryAmount)
    };
  } catch (error) {
    console.error('解析工资数据行失败:', error, row);
    return null;
  }
}

// 解析城市标准数据行
function parseCityRow(row: any): ExcelCityData | null {
  try {
    const cityName = row['城市名'] || row['city_name'] || row['城市'] || '';
    const year = row['年份'] || row['year'] || '';
    const baseMin = row['基数下限'] || row['base_min'] || row['下限'] || 0;
    const baseMax = row['基数上限'] || row['base_max'] || row['上限'] || 0;
    const rate = row['缴纳比例'] || row['rate'] || row['比例'] || 0;

    if (!cityName || !year || !baseMin || !baseMax || !rate) {
      console.warn('城市标准数据行缺少必要字段:', row);
      return null;
    }

    return {
      city_name: cityName.toString(),
      year: year.toString(),
      base_min: Number(baseMin),
      base_max: Number(baseMax),
      rate: Number(rate)
    };
  } catch (error) {
    console.error('解析城市标准数据行失败:', error, row);
    return null;
  }
}

// 验证 Excel 文件
export function validateExcelFile(file: File): boolean {
  const allowedExtensions = ['.xlsx', '.xls', '.csv'];
  const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));

  if (!allowedExtensions.includes(fileExtension)) {
    throw new Error('只支持 .xlsx, .xls, .csv 格式的文件');
  }

  if (file.size > 10 * 1024 * 1024) { // 10MB
    throw new Error('文件大小不能超过 10MB');
  }

  return true;
}

// 导出 Excel 处理工具
export const excelParser = {
  parseExcelFile,
  validateExcelFile
};