import React, { createContext, useState, useEffect, ReactNode } from 'react';

// 型定義
interface Feed {
  id: string;
  name: string;
  cost: number;
  unit: string;
  nutritions: {
    [key: string]: number;
  };
}

interface Purchase {
  id: string;
  feedId: string;
  quantity: number;
  feedingRatio?: number;
  purchaseDate: string;
}

interface FlockDetail {
  id: string;
  flockId: string;
  healthStatus?: string;
  mortalityRate?: number;
  feedConversionRatio?: number;
  notes?: string;
}

interface InventoryItem {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  optimalStock: number;
  unit: string;
  status: 'critical' | 'warning' | 'normal';
  daysRemaining: number;
}

interface Flock {
  id: string;
  name: string;
  birdCount: number;
  ageWeeks: number;
}

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'danger';
  date: string;
  read: boolean;
}

interface FarmContextProps {
  feeds: Feed[];
  purchases: Purchase[];
  flocks: Flock[];
  flockDetails: FlockDetail[];
  nutritionBenefits: { [key: string]: string };
  inventoryItems: InventoryItem[];
  revenueData: any[];
  notifications: Notification[];
  eggData: {
    eggCount: number;
    eggPrice: number;
  };
  feedDistribution: any[];
  nutritionData: any[];
  currentMonth: number;
  activeTabs: { [key: string]: number };
  isNotificationEnabled: boolean;
  // 関数
  addFeed: (feed: Omit<Feed, 'id'>) => void;
  updateFeed: (id: string, feed: Partial<Feed>) => void;
  deleteFeed: (id: string) => void;
  addPurchase: (purchase: Omit<Purchase, 'id'>) => void;
  updatePurchase: (id: string, purchase: Partial<Purchase>) => void;
  deletePurchase: (id: string) => void;
  addFlock: (flock: Omit<Flock, 'id'>) => void;
  updateFlock: (id: string, flock: Partial<Flock>) => void;
  deleteFlock: (id: string) => void;
  getFlockDetail: (flockId: string) => FlockDetail | undefined;
  updateFlockDetail: (id: string, detail: Partial<FlockDetail>) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  updateEggData: (data: Partial<{ eggCount: number, eggPrice: number }>) => void;
  changeTab: (section: string, newValue: number) => void;
  getMonthlyPurchases: (monthIndex: number) => Purchase[];
  calculateTotalCost: (monthIndex: number) => number;
  calculateFeedCostPercentage: (monthIndex: number) => any[];
  calculateEggCost: () => number;
  calculateBreakEvenPoint: () => number;
  calculateEggProfit: () => number;
  calculateProfitMargin: () => number;
  calculateNutritionContribution: (monthIndex: number) => Record<string, number>;
  syncData: () => void;
  toggleNotifications: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

// コンテキスト作成
export const FarmContext = createContext<FarmContextProps>({} as FarmContextProps);

// プロバイダーコンポーネント
export const FarmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 初期データ
  const [feeds, setFeeds] = useState<Feed[]>([
    {
      id: "feed1",
      name: "配合飼料A",
      cost: 2500,
      unit: "kg",
      nutritions: {
        protein: 16,
        fat: 3,
        fiber: 5,
        calcium: 3.5,
        phosphorus: 0.5
      }
    },
    {
      id: "feed2",
      name: "トウモロコシ",
      cost: 1800,
      unit: "kg",
      nutritions: {
        protein: 9,
        fat: 4,
        fiber: 2,
        calcium: 0.2,
        phosphorus: 0.3
      }
    },
    {
      id: "feed3",
      name: "魚粉",
      cost: 4500,
      unit: "kg",
      nutritions: {
        protein: 60,
        fat: 10,
        fiber: 1,
        calcium: 4,
        phosphorus: 2.5
      }
    }
  ]);

  const [purchases, setPurchases] = useState<Purchase[]>([
    {
      id: "purchase1",
      feedId: "feed1",
      quantity: 500,
      feedingRatio: 70,
      purchaseDate: "2024-03-01"
    },
    {
      id: "purchase2",
      feedId: "feed2",
      quantity: 300,
      feedingRatio: 20,
      purchaseDate: "2024-03-05"
    },
    {
      id: "purchase3",
      feedId: "feed3",
      quantity: 100,
      feedingRatio: 10,
      purchaseDate: "2024-03-10"
    }
  ]);

  const [flocks, setFlocks] = useState<Flock[]>([
    { id: "flock1", name: "鶏舎A", birdCount: 5000, ageWeeks: 45 },
    { id: "flock2", name: "鶏舎B", birdCount: 3000, ageWeeks: 25 },
    { id: "flock3", name: "育成舎", birdCount: 2000, ageWeeks: 12 }
  ]);

  const [flockDetails, setFlockDetails] = useState<FlockDetail[]>([
    { id: "detail1", flockId: "flock1", healthStatus: "良好", mortalityRate: 0.5, feedConversionRatio: 1.8 },
    { id: "detail2", flockId: "flock2", healthStatus: "経過観察", mortalityRate: 1.2, feedConversionRatio: 2.0 },
    { id: "detail3", flockId: "flock3", healthStatus: "良好", mortalityRate: 0.3, feedConversionRatio: 1.5 }
  ]);

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    { id: "inv1", name: "配合飼料A", currentStock: 300, minStock: 100, optimalStock: 500, unit: "kg", status: "normal", daysRemaining: 12 },
    { id: "inv2", name: "ワクチン", currentStock: 50, minStock: 100, optimalStock: 200, unit: "dose", status: "critical", daysRemaining: 5 },
    { id: "inv3", name: "敷料", currentStock: 150, minStock: 100, optimalStock: 300, unit: "kg", status: "warning", daysRemaining: 7 }
  ]);

  const [revenueData, setRevenueData] = useState<any[]>([
    { month: "1月", eggSales: 2500000, meatSales: 0, fertilizerSales: 50000, feedCosts: 1200000, profit: 1350000 },
    { month: "2月", eggSales: 2450000, meatSales: 0, fertilizerSales: 55000, feedCosts: 1190000, profit: 1315000 },
    { month: "3月", eggSales: 2600000, meatSales: 300000, fertilizerSales: 60000, feedCosts: 1250000, profit: 1710000 }
  ]);

  const [eggData, setEggData] = useState({ eggCount: 120000, eggPrice: 22 });
  const [feedDistribution, setFeedDistribution] = useState<any[]>([]);
  const [nutritionData, setNutritionData] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [activeTabs, setActiveTabs] = useState({ dashboard: 0, feedCalc: 0, farmSystem: 0 });
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "n1", message: "「ワクチン」の在庫が不足しています", type: "danger", date: "2024-03-25", read: false },
    { id: "n2", message: "「敷料」の在庫が最低水準に近づいています", type: "warning", date: "2024-03-24", read: false },
    { id: "n3", message: "鶏舎Bの健康状態を確認してください", type: "warning", date: "2024-03-23", read: true }
  ]);

  // 栄養素の説明データ
  const nutritionBenefits = {
    protein: "成長と卵の生産に必要。適切なレベルで筋肉の発達と卵殻形成を促進します。",
    fat: "エネルギー源として機能し、脂溶性ビタミンの吸収を助けます。",
    fiber: "消化を助け、鶏の腸内環境を健全に保ちます。",
    calcium: "卵殻形成に不可欠で、骨の健康も維持します。",
    phosphorus: "カルシウムとともに骨の形成を助け、細胞のエネルギー代謝にも重要です。"
  };

  // 飼料追加
  const addFeed = (feed: Omit<Feed, 'id'>) => {
    const newFeed = { ...feed, id: `feed${Date.now()}` };
    setFeeds([...feeds, newFeed]);
  };

  // 飼料更新
  const updateFeed = (id: string, updatedFeed: Partial<Feed>) => {
    setFeeds(feeds.map(feed => feed.id === id ? { ...feed, ...updatedFeed } : feed));
  };

  // 飼料削除
  const deleteFeed = (id: string) => {
    // 購入で使用されていないことを確認
    const usedInPurchases = purchases.some(purchase => purchase.feedId === id);
    if (usedInPurchases) {
      alert("この飼料は購入履歴で使用されているため削除できません");
      return;
    }
    
    setFeeds(feeds.filter(feed => feed.id !== id));
  };

  // 購入追加
  const addPurchase = (purchase: Omit<Purchase, 'id'>) => {
    const newPurchase = { ...purchase, id: `purchase${Date.now()}` };
    setPurchases([...purchases, newPurchase]);
  };

  // 購入更新
  const updatePurchase = (id: string, updatedPurchase: Partial<Purchase>) => {
    setPurchases(purchases.map(purchase => purchase.id === id ? { ...purchase, ...updatedPurchase } : purchase));
  };

  // 購入削除
  const deletePurchase = (id: string) => {
    setPurchases(purchases.filter(purchase => purchase.id !== id));
  };

  // 鶏群追加
  const addFlock = (flock: Omit<Flock, 'id'>) => {
    const newFlock = { ...flock, id: `flock${Date.now()}` };
    setFlocks([...flocks, newFlock]);
    
    // 詳細情報も作成
    const newDetail = { 
      id: `detail${Date.now()}`, 
      flockId: newFlock.id,
      healthStatus: "良好",
      mortalityRate: 0,
      feedConversionRatio: 2.0,
      notes: ""
    };
    setFlockDetails([...flockDetails, newDetail]);
  };

  // 鶏群更新
  const updateFlock = (id: string, updatedFlock: Partial<Flock>) => {
    setFlocks(flocks.map(flock => flock.id === id ? { ...flock, ...updatedFlock } : flock));
  };

  // 鶏群詳細取得
  const getFlockDetail = (flockId: string) => {
    return flockDetails.find(detail => detail.flockId === flockId);
  };

  // 鶏群詳細更新
  const updateFlockDetail = (id: string, updatedDetail: Partial<FlockDetail>) => {
    setFlockDetails(flockDetails.map(detail => 
      detail.id === id ? { ...detail, ...updatedDetail } : detail
    ));
  };

  // 鶏群削除
  const deleteFlock = (id: string) => {
    setFlocks(flocks.filter(flock => flock.id !== id));
    setFlockDetails(flockDetails.filter(detail => detail.flockId !== id));
  };

  // 在庫アイテム更新
  const updateInventoryItem = (id: string, updatedItem: Partial<InventoryItem>) => {
    setInventoryItems(inventoryItems.map(item => 
      item.id === id ? { ...item, ...updatedItem } : item
    ));
  };

  // 卵データ更新
  const updateEggData = (data: Partial<{ eggCount: number, eggPrice: number }>) => {
    setEggData({ ...eggData, ...data });
  };

  // タブ変更
  const changeTab = (section: string, newValue: number) => {
    setActiveTabs({ ...activeTabs, [section]: newValue });
  };

  // 月別の飼料購入データを取得
  const getMonthlyPurchases = (monthIndex: number) => {
    const year = new Date().getFullYear();
    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0);
    
    return purchases.filter(purchase => {
      const purchaseDate = new Date(purchase.purchaseDate);
      return purchaseDate >= startDate && purchaseDate <= endDate;
    });
  };

  // 月別の総コストを計算
  const calculateTotalCost = (monthIndex: number) => {
    const monthPurchases = getMonthlyPurchases(monthIndex);
    return monthPurchases.reduce((total, purchase) => {
      const feed = feeds.find(f => f.id === purchase.feedId);
      const ratio = purchase.feedingRatio || 100;
      return total + (feed ? (feed.cost * purchase.quantity / 1000) * (ratio / 100) : 0);
    }, 0);
  };

  // 各餌のコスト割合を計算
  const calculateFeedCostPercentage = (monthIndex: number) => {
    const monthPurchases = getMonthlyPurchases(monthIndex);
    const totalCost = calculateTotalCost(monthIndex);
    
    if (totalCost === 0) return [];
    
    // 飼料ごとの総コストを計算
    const feedCosts: {[key: string]: number} = {};
    
    monthPurchases.forEach(purchase => {
      const feed = feeds.find(f => f.id === purchase.feedId);
      if (feed) {
        const ratio = purchase.feedingRatio || 100;
        const cost = (feed.cost * purchase.quantity / 1000) * (ratio / 100);
        
        if (feedCosts[feed.id]) {
          feedCosts[feed.id] += cost;
        } else {
          feedCosts[feed.id] = cost;
        }
      }
    });
    
    // 割合に変換してグラフデータに整形
    return Object.entries(feedCosts).map(([feedId, cost]) => {
      const feed = feeds.find(f => f.id === feedId);
      return {
        name: feed ? feed.name : 'Unknown',
        value: cost,
        percent: ((cost / totalCost) * 100).toFixed(1)
      };
    }).sort((a, b) => b.value - a.value);
  };

  // 卵1個あたりのコストを計算
  const calculateEggCost = () => {
    if (eggData.eggCount === 0) return 0;
    const totalCost = calculateTotalCost(currentMonth);
    return totalCost / eggData.eggCount;
  };

  // 損益分岐点の計算
  const calculateBreakEvenPoint = () => {
    const eggCost = calculateEggCost();
    if (eggCost === 0) return 0;
    return Math.ceil(calculateTotalCost(currentMonth) / eggData.eggPrice);
  };

  // 卵の利益計算
  const calculateEggProfit = () => {
    const totalRevenue = eggData.eggCount * eggData.eggPrice;
    const totalCost = calculateTotalCost(currentMonth);
    return totalRevenue - totalCost;
  };

  // 利益率の計算
  const calculateProfitMargin = () => {
    const totalRevenue = eggData.eggCount * eggData.eggPrice;
    if (totalRevenue === 0) return 0;
    const profit = calculateEggProfit();
    return (profit / totalRevenue) * 100;
  };

  // 栄養素の寄与度を計算
  const calculateNutritionContribution = (monthIndex: number) => {
    const monthPurchases = getMonthlyPurchases(monthIndex);
    const totalWeight = monthPurchases.reduce((total, purchase) => total + purchase.quantity, 0);
    
    if (totalWeight === 0) return {};
    
    const nutritions: {[key: string]: number} = {};
    
    monthPurchases.forEach(purchase => {
      const feed = feeds.find(f => f.id === purchase.feedId);
      if (feed) {
        Object.entries(feed.nutritions).forEach(([key, value]) => {
          const weightedValue = (value * purchase.quantity) / totalWeight;
          nutritions[key] = (nutritions[key] || 0) + weightedValue;
        });
      }
    });
    
    return nutritions;
  };

  // 通知を開く/閉じる
  const toggleNotifications = () => {
    setIsNotificationEnabled(!isNotificationEnabled);
  };

  // 通知を既読にする
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // 全通知を既読にする
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  // データ同期 - 初期化時やデータ変更時に呼び出し
  const syncData = () => {
    // 1. インベントリを更新
    const updatedInventory = [...inventoryItems];
    
    // 各在庫アイテムのステータス計算
    updatedInventory.forEach((item, index) => {
      // 残り日数の計算（仮の消費速度で計算）
      const daysRemaining = item.currentStock > 0 ? 
        Math.floor((item.currentStock / item.optimalStock) * 30) : 0;
      
      // ステータスの更新
      let status: 'critical' | 'warning' | 'normal' = 'normal';
      if (item.currentStock <= item.minStock * 0.5) {
        status = 'critical';
      } else if (item.currentStock <= item.minStock) {
        status = 'warning';
      }
      
      updatedInventory[index] = {
        ...item,
        daysRemaining,
        status
      };
    });
    
    setInventoryItems(updatedInventory);
    
    // 2. 通知の更新
    const criticalItems = updatedInventory.filter(item => item.status === 'critical');
    const warningItems = updatedInventory.filter(item => item.status === 'warning');
    
    // 新しい通知を作成
    const newNotifications = [...notifications];
    
    // クリティカルアイテムの通知
    criticalItems.forEach(item => {
      const existingNotification = notifications.find(n => 
        n.message.includes(item.name) && n.type === 'danger'
      );
      
      if (!existingNotification) {
        newNotifications.push({
          id: `note${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          message: `「${item.name}」の在庫が不足しています`,
          type: 'danger',
          date: new Date().toISOString().split('T')[0],
          read: false
        });
      }
    });
    
    // 警告アイテムの通知
    warningItems.forEach(item => {
      const existingNotification = notifications.find(n => 
        n.message.includes(item.name) && n.type === 'warning'
      );
      
      if (!existingNotification) {
        newNotifications.push({
          id: `note${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          message: `「${item.name}」の在庫が最低水準に近づいています`,
          type: 'warning',
          date: new Date().toISOString().split('T')[0],
          read: false
        });
      }
    });
    
    setNotifications(newNotifications);
    
    // 3. 飼料分布データの更新
    const feedDistData = calculateFeedCostPercentage(currentMonth);
    setFeedDistribution(feedDistData);
    
    // 4. 栄養データの更新
    const nutritionContrib = calculateNutritionContribution(currentMonth);
    
    // 表示する栄養素
    const visibleNutritions: {[key: string]: boolean} = {
      protein: true,
      fat: true,
      fiber: true,
      calcium: true,
      phosphorus: true
    };
    
    // 栄養素データをグラフ用に整形
    const formattedNutritionData = Object.entries(nutritionContrib)
      .filter(([name]) => visibleNutritions[name])
      .map(([name, value]) => {
        let label;
        switch (name) {
          case 'protein':
            label = 'タンパク質';
            break;
          case 'fat':
            label = '脂肪';
            break;
          case 'fiber':
            label = '繊維';
            break;
          case 'calcium':
            label = 'カルシウム';
            break;
          case 'phosphorus':
            label = 'リン';
            break;
          default:
            label = name;
        }
        
        return {
          name: label,
          value: parseFloat(value.toFixed(2))
        };
      });
    
    setNutritionData(formattedNutritionData);
  };

  // 初期化時とデータ変更時に同期を実行
  useEffect(() => {
    syncData();
  }, [feeds, purchases, inventoryItems, currentMonth]);

  return (
    <FarmContext.Provider value={{
      feeds,
      purchases,
      flocks,
      flockDetails,
      nutritionBenefits,
      inventoryItems,
      revenueData,
      notifications,
      eggData,
      feedDistribution,
      nutritionData,
      currentMonth,
      activeTabs,
      isNotificationEnabled,
      addFeed,
      updateFeed,
      deleteFeed,
      addPurchase,
      updatePurchase,
      deletePurchase,
      addFlock,
      updateFlock,
      deleteFlock,
      getFlockDetail,
      updateFlockDetail,
      updateInventoryItem,
      updateEggData,
      changeTab,
      getMonthlyPurchases,
      calculateTotalCost,
      calculateFeedCostPercentage,
      calculateEggCost,
      calculateBreakEvenPoint,
      calculateEggProfit,
      calculateProfitMargin,
      calculateNutritionContribution,
      syncData,
      toggleNotifications,
      markAsRead,
      markAllAsRead
    }}>
      {children}
    </FarmContext.Provider>
  );
};
