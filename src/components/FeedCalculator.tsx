import React, { useContext, useState } from 'react';
import { FarmContext } from '../contexts/FarmContext';

const FeedCalculator: React.FC = () => {
  const context = useContext(FarmContext);
  
  if (!context) return null;
  
  const { 
    feeds, 
    months, 
    currentMonth, 
    setMonth, 
    calculateTotalCost,
    getMonthlyPurchases,
    addPurchase,
    deletePurchase
  } = context;

  const [formData, setFormData] = useState({
    feedId: feeds[0]?.id || 0,
    quantity: '',
    feedingRatio: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    type: 'add'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addPurchase({
      feedId: Number(formData.feedId),
      quantity: Number(formData.quantity),
      feedingRatio: Number(formData.feedingRatio),
      purchaseDate: formData.purchaseDate
    });
    
    // Reset form
    setFormData({
      feedId: feeds[0]?.id || 0,
      quantity: '',
      feedingRatio: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      type: 'add'
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('この購入記録を削除してもよろしいですか？')) {
      deletePurchase(id);
    }
  };

  const monthlyPurchases = getMonthlyPurchases(currentMonth);
  const totalCost = calculateTotalCost(currentMonth);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">飼料コスト計算機</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">飼料の購入と月間コスト計算</p>
        </div>
        
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center mb-4">
              <div className="text-sm font-medium text-gray-500">表示月: </div>
              <div className="ml-4">
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={currentMonth}
                  onChange={(e) => setMonth(Number(e.target.value))}
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>{month}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">飼料購入の追加</h3>
              <form onSubmit={handleSubmit} className="mt-2 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="feedId" className="block text-sm font-medium text-gray-700">飼料</label>
                    <select
                      id="feedId"
                      name="feedId"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={formData.feedId}
                      onChange={handleInputChange}
                    >
                      {feeds.map((feed) => (
                        <option key={feed.id} value={feed.id}>{feed.name} - {feed.cost}円/{feed.unit}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">数量</label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      min="0"
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="feedingRatio" className="block text-sm font-medium text-gray-700">配合比率 (%)</label>
                    <input
                      type="number"
                      id="feedingRatio"
                      name="feedingRatio"
                      min="0"
                      max="100"
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.feedingRatio}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700">購入日</label>
                    <input
                      type="date"
                      id="purchaseDate"
                      name="purchaseDate"
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.purchaseDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    購入追加
                  </button>
                </div>
              </form>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900">
                {months[currentMonth]}の飼料購入履歴 - 合計: {totalCost.toLocaleString()}円
              </h3>
              <div className="mt-2 flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              飼料
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              数量
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              配合比率
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              コスト
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              購入日
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {monthlyPurchases.map((purchase) => {
                            const feed = feeds.find(f => f.id === purchase.feedId);
                            return (
                              <tr key={purchase.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{feed?.name || 'Unknown'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{purchase.quantity} {feed?.unit}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{purchase.feedingRatio}%</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {(feed ? feed.cost * purchase.quantity : 0).toLocaleString()}円
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{purchase.purchaseDate}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    onClick={() => handleDelete(purchase.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    削除
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                          {monthlyPurchases.length === 0 && (
                            <tr>
                              <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                購入記録がありません
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCalculator; 