'use client';

import { useState } from 'react';
import { Upload, Calculator, AlertCircle, CheckCircle, FileSpreadsheet } from 'lucide-react';
import { excelParser } from '@/lib/excelParser';
import { db } from '@/lib/supabase';
import { calculateAllContributions } from '@/lib/calculations';

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [calculationMessage, setCalculationMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [uploadStats, setUploadStats] = useState<{ salaries: number; cities: number } | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadMessage({ type: 'info', text: '正在验证文件...' });

      // 验证文件
      excelParser.validateExcelFile(file);

      setUploadMessage({ type: 'info', text: '正在解析文件...' });

      // 解析 Excel 文件
      const { salaries, cities } = await excelParser.parseExcelFile(file);

      if (salaries.length === 0 && cities.length === 0) {
        throw new Error(`文件中未找到有效的工资或城市标准数据。请确保Excel文件包含以下列名：
        - 工资数据：员工工号、员工姓名、月份、工资金额
        - 城市标准：城市名、年份、基数下限、基数上限、缴纳比例
        或者工作表名称包含"工资"或"city"关键词`);
      }

      setUploadMessage({ type: 'info', text: '正在上传数据到数据库...' });

      // 上传数据到数据库
      let salaryCount = 0;
      let cityCount = 0;

      if (salaries.length > 0) {
        await db.insertSalaries(salaries);
        salaryCount = salaries.length;
      }

      if (cities.length > 0) {
        await db.insertCities(cities);
        cityCount = cities.length;
      }

      setUploadStats({ salaries: salaryCount, cities: cityCount });
      setUploadMessage({
        type: 'success',
        text: `数据上传成功！工资记录: ${salaryCount} 条，城市标准: ${cityCount} 条`
      });

    } catch (error) {
      console.error('上传失败:', error);
      setUploadMessage({
        type: 'error',
        text: error instanceof Error ? error.message : '上传失败，请检查文件格式'
      });
    } finally {
      setIsUploading(false);
      event.target.value = ''; // 重置文件输入
    }
  };

  const handleCalculate = async () => {
    try {
      setIsCalculating(true);
      setCalculationMessage({ type: 'info', text: '正在计算五险一金费用...' });

      // 执行计算
      const results = await calculateAllContributions();

      setCalculationMessage({
        type: 'success',
        text: `计算完成！共计算了 ${results.length} 位员工的五险一金费用`
      });

    } catch (error) {
      console.error('计算失败:', error);
      setCalculationMessage({
        type: 'error',
        text: error instanceof Error ? error.message : '计算失败，请检查数据'
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">数据上传与操作</h1>
        <p className="text-gray-600">上传员工工资和城市标准数据，并执行五险一金计算</p>
      </div>

      {/* 文件上传区域 */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <Upload className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">上传数据</h2>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            请上传包含员工工资数据和城市标准的 Excel 文件。文件应包含以下工作表：
          </p>
          <ul className="list-disc pl-5 text-gray-600 space-y-2 mb-6">
            <li>工资数据表：包含员工工号、姓名、月份、工资金额等字段</li>
            <li>城市标准表：包含城市名、年份、基数下限、基数上限、缴纳比例等字段</li>
          </ul>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
              <div className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {isUploading ? '上传中...' : '选择 Excel 文件'}
              </div>
              <p className="mt-2 text-sm text-gray-500">支持 .xlsx, .xls, .csv 格式，最大 10MB</p>
            </label>
          </div>
        </div>

        {/* 上传状态 */}
        {uploadMessage && (
          <div className={`p-4 rounded-lg ${uploadMessage.type === 'success' ? 'bg-green-50 text-green-800' : uploadMessage.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'}`}>
            <div className="flex items-center">
              {uploadMessage.type === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : uploadMessage.type === 'error' ? (
                <AlertCircle className="w-5 h-5 mr-2" />
              ) : null}
              <span>{uploadMessage.text}</span>
            </div>
          </div>
        )}

        {/* 上传统计 */}
        {uploadStats && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">工资记录</div>
              <div className="text-2xl font-bold text-gray-900">{uploadStats.salaries}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">城市标准</div>
              <div className="text-2xl font-bold text-gray-900">{uploadStats.cities}</div>
            </div>
          </div>
        )}
      </div>

      {/* 计算区域 */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-100 text-green-600 rounded-lg">
            <Calculator className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">执行计算</h2>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            点击按钮执行五险一金计算。系统将根据上传的工资数据和城市标准，计算每位员工的五险一金费用。
          </p>
          <p className="text-sm text-gray-500 mb-6">
            注意：计算前请确保已上传工资数据。计算过程可能需要几秒钟时间。
          </p>

          <button
            onClick={handleCalculate}
            disabled={isCalculating}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCalculating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                计算中...
              </>
            ) : (
              <>
                <Calculator className="w-5 h-5 mr-2" />
                执行计算并存储结果
              </>
            )}
          </button>
        </div>

        {/* 计算状态 */}
        {calculationMessage && (
          <div className={`p-4 rounded-lg ${calculationMessage.type === 'success' ? 'bg-green-50 text-green-800' : calculationMessage.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'}`}>
            <div className="flex items-center">
              {calculationMessage.type === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : calculationMessage.type === 'error' ? (
                <AlertCircle className="w-5 h-5 mr-2" />
              ) : null}
              <span>{calculationMessage.text}</span>
            </div>
          </div>
        )}
      </div>

      {/* 注意事项 */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800 mb-2">注意事项</h3>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• 请确保 Excel 文件格式正确，包含必要的数据字段</li>
              <li>• 计算前请先上传工资数据</li>
              <li>• 计算结果将存储在数据库中，可在结果查询页面查看</li>
              <li>• 每次计算会清空之前的结果，重新计算所有数据</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}