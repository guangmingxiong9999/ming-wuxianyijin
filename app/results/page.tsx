'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { db, Result } from '@/lib/supabase';

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCompanyFee, setTotalCompanyFee] = useState(0);

  const fetchResults = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await db.getResults();
      setResults(data);

      // 计算总费用
      const total = data.reduce((sum, result) => sum + result.company_fee, 0);
      setTotalCompanyFee(total);
    } catch (err) {
      console.error('获取结果失败:', err);
      setError('获取计算结果失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleExportCSV = () => {
    if (results.length === 0) return;

    const headers = ['员工姓名', '月平均工资', '缴费基数', '公司应缴金额', '计算时间'];
    const csvData = results.map(result => [
      result.employee_name,
      result.avg_salary.toFixed(2),
      result.contribution_base.toFixed(2),
      result.company_fee.toFixed(2),
      new Date(result.calculated_at).toLocaleString('zh-CN')
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `五险一金计算结果_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">结果查询</h1>
            <p className="text-gray-600">查看五险一金计算结果</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={fetchResults}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              刷新
            </button>
            <button
              onClick={handleExportCSV}
              disabled={results.length === 0}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4 mr-2" />
              导出 CSV
            </button>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">员工数量</p>
              <p className="text-2xl font-bold text-gray-900">{results.length}</p>
            </div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">总公司应缴金额</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCompanyFee)}</p>
            </div>
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">人均公司应缴</p>
              <p className="text-2xl font-bold text-gray-900">
                {results.length > 0 ? formatCurrency(totalCompanyFee / results.length) : formatCurrency(0)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* 结果表格 */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">计算结果详情</h2>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">正在加载数据...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-gray-600">{error}</p>
            <button
              onClick={fetchResults}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              重试
            </button>
          </div>
        ) : results.length === 0 ? (
          <div className="p-12 text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">暂无计算结果</p>
            <p className="text-sm text-gray-500">
              请先上传数据并在数据上传页面执行计算
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    员工姓名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    月平均工资
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    缴费基数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    公司应缴金额
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    计算时间
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{result.employee_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(result.avg_salary)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(result.contribution_base)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-green-600">
                        {formatCurrency(result.company_fee)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(result.calculated_at).toLocaleString('zh-CN')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {results.length > 0 && (
          <div className="px-6 py-4 border-t bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                共 {results.length} 条记录
              </div>
              <div className="text-sm font-medium text-gray-900">
                总计: {formatCurrency(totalCompanyFee)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 说明 */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-medium text-blue-800 mb-2">计算结果说明</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• <span className="font-medium">月平均工资</span>: 员工所有月份工资的平均值</li>
          <li>• <span className="font-medium">缴费基数</span>: 根据城市标准调整后的基数（在基数下限和上限之间）</li>
          <li>• <span className="font-medium">公司应缴金额</span>: 缴费基数 × 缴纳比例</li>
          <li>• 计算结果基于最新上传的数据和城市标准</li>
        </ul>
      </div>
    </div>
  );
}