import { NextRequest, NextResponse } from 'next/server';
import { calculateAllContributions } from '@/lib/calculations';

export async function POST(request: NextRequest) {
  try {
    // 执行计算
    const results = await calculateAllContributions();

    return NextResponse.json({
      success: true,
      message: `计算完成，共计算了 ${results.length} 位员工的五险一金费用`,
      data: results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('API 计算错误:', error);

    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : '计算过程中发生错误',
      error: error instanceof Error ? error.message : '未知错误',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: '请使用 POST 请求执行计算',
    endpoint: '/api/calculate',
    method: 'POST'
  });
}