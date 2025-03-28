import React, { useContext } from 'react';
import { FarmContext } from '../contexts/FarmContext';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FarmSystem: React.FC = () => {
  const context = useContext(FarmContext);
  
  if (!context) return null;
  
  const { 
    flocks, 
    totalHens, 
    dailyEggProduction, 
    eggData, 
    updateEggData,
    currentMonthFeedCost,
    projectedProfit,
    profitMargin 
  } = context;

  // 月間データのモック（実際にはAPI等から取得することを想定）
  const monthlyData = [
    { month: '1月', eggCount: 198000, feedCost: 120000, revenue: 198000 * 30 / 100, profit: 198000 * 30 / 100 - 120000 },
    { month: '2月', eggCount: 185000, feedCost: 115000, revenue: 185000 * 30 / 100, profit: 185000 * 30 / 100 - 115000 },
    { month: '3月', eggCount: 205000, feedCost: 125000, revenue: 205000 * 30 / 100, profit: 205000 * 30 / 100 - 125000 },
    { month: '4月', eggCount: 210000, feedCost: 123000, revenue: 210000 * 30 / 100, profit: 210000 * 30 / 100 - 123000 },
    { month: '5月', eggCount: 215000, feedCost: 128000, revenue: 215000 * 30 / 100, profit: 215000 * 30 / 100 - 128000 },
    { month: '6月', eggCount: 203000, feedCost: 122000, revenue: 203000 * 30 / 100, profit: 203000 * 30 / 100 - 122000 }
  ];

  // 卵の生産性データモック
  const productivityData = [
    { name: '鶏舎A', 羽数: 2500, 産卵率: 92, 平均体重: 1.8 },
    { name: '鶏舎B', 羽数: 3000, 産卵率: 88, 平均体重: 1.75 },
    { name: '鶏舎C', 羽数: 1800, 産卵率: 83, 平均体重: 1.9 }
  ];

  // フォーム送信ハンドラ
  const handleEggDataSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const eggCount = Number(form.eggCount.value);
    const eggPrice = Number(form.eggPrice.value);
    
    updateEggData({ eggCount, eggPrice });
    
    alert('卵データが更新されました');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">養鶏システム管理</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">鶏舎管理、産卵率、収益性の分析</p>
        </div>
        
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">鶏舎概要</h3>
            <div className="mt-4 flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            鶏舎
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            羽数
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            週齢
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            状態
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {flocks.map((flock) => (
                          <tr key={flock.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{flock.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{flock.birdCount.toLocaleString()} 羽</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{flock.ageWeeks} 週</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                flock.ageWeeks < 30 ? 'bg-yellow-100 text-yellow-800' : 
                                flock.ageWeeks < 70 ? 'bg-green-100 text-green-800' : 
                                'bg-red-100 text-red-800'
                              }`}>
                                {flock.ageWeeks < 30 ? '育成中' : 
                                 flock.ageWeeks < 70 ? '生産期' : 
                                 '終了間近'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">産卵統計</h3>
                <div className="mt-2 bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-sm font-medium text-gray-500">鶏総数</span>
                      <span className="block mt-1 text-xl font-semibold">{totalHens.toLocaleString()} 羽</span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-500">日間産卵数</span>
                      <span className="block mt-1 text-xl font-semibold">{dailyEggProduction.toLocaleString()} 個</span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-500">産卵率</span>
                      <span className="block mt-1 text-xl font-semibold">
                        {((dailyEggProduction / totalHens) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-500">卵あたりコスト</span>
                      <span className="block mt-1 text-xl font-semibold">
                        {(currentMonthFeedCost / eggData.eggCount).toFixed(2)} 円
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900">月間卵生産量 (個)</h4>
                  <div className="h-64 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlyData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [value.toLocaleString(), '生産数']} />
                        <Legend />
                        <Line type="monotone" dataKey="eggCount" stroke="#8884d8" name="卵生産量" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">収益性分析</h3>
                <div className="mt-2 bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-sm font-medium text-gray-500">卵価格 (1個)</span>
                      <span className="block mt-1 text-xl font-semibold">{eggData.eggPrice} 円</span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-500">月間飼料コスト</span>
                      <span className="block mt-1 text-xl font-semibold">{currentMonthFeedCost.toLocaleString()} 円</span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-500">予想利益</span>
                      <span className={`block mt-1 text-xl font-semibold ${projectedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {projectedProfit.toLocaleString()} 円
                      </span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-500">利益率</span>
                      <span className={`block mt-1 text-xl font-semibold ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {profitMargin.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900">月間収益推移 (円)</h4>
                  <div className="h-64 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlyData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [value.toLocaleString() + '円', '']} />
                        <Legend />
                        <Bar dataKey="revenue" fill="#4C9A52" name="売上" />
                        <Bar dataKey="profit" fill="#82ca9d" name="利益" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">鶏舎別生産性</h3>
            <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={productivityData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={80} />
                      <Tooltip formatter={(value) => [`${value}%`, '産卵率']} />
                      <Legend />
                      <Bar dataKey="産卵率" fill="#8884d8" name="産卵率 (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={productivityData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={80} />
                      <Tooltip formatter={(value) => [`${value}kg`, '平均体重']} />
                      <Legend />
                      <Bar dataKey="平均体重" fill="#82ca9d" name="平均体重 (kg)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">卵データ更新</h3>
            <form className="mt-4 max-w-lg" onSubmit={handleEggDataSubmit}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="eggCount" className="block text-sm font-medium text-gray-700">卵生産数 (月間)</label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="eggCount"
                      id="eggCount"
                      defaultValue={eggData.eggCount}
                      min="0"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="eggPrice" className="block text-sm font-medium text-gray-700">卵価格 (1個)</label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="eggPrice"
                      id="eggPrice"
                      defaultValue={eggData.eggPrice}
                      min="0"
                      step="0.1"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  更新
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmSystem; 