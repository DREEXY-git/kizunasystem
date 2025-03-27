import React, { createContext, useState, useEffect } from 'react';

export const FarmContext = createContext<any>(null);

export function FarmProvider({ children }: { children: React.ReactNode }) {
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Initial feeds data
  const initialFeeds = [
    { id: 1, name: '配合飼料A', cost: 5000, unit: 'kg', nutritions: { protein: 18, fat: 4, fiber: 8, calcium: 1, umami: 2.5, amino: 14 } },
    { id: 2, name: '牧草', cost: 3000, unit: 'kg', nutritions: { protein: 12, fat: 2, fiber: 22, calcium: 0.5, umami: 1.2, amino: 9 } },
    { id: 3, name: 'サイレージ', cost: 2500, unit: 'kg', nutritions: { protein: 10, fat: 3, fiber: 25, calcium: 0.3, umami: 1.5, amino: 8 } },
    { id: 4, name: '大豆かす', cost: 6500, unit: 'kg', nutritions: { protein: 45, fat: 1, fiber: 7, calcium: 0.3, umami: 3.8, amino: 38 } }
  ];

  // Initial purchases data
  const initialPurchases = [
    { id: 101, feedId: 1, quantity: 500, feedingRatio: 20, purchaseDate: new Date(2025, 0, 15).toISOString().split('T')[0] },
    { id: 102, feedId: 2, quantity: 300, feedingRatio: 30, purchaseDate: new Date(2025, 0, 20).toISOString().split('T')[0] },
    { id: 103, feedId: 3, quantity: 800, feedingRatio: 40, purchaseDate: new Date(2025, 1, 10).toISOString().split('T')[0] },
    { id: 104, feedId: 4, quantity: 200, feedingRatio: 10, purchaseDate: new Date(2025, 1, 20).toISOString().split('T')[0] }
  ];

  // 栄養成分の健康メリット情報
  const nutritionBenefits = {
    protein: 'タンパク質：筋肉の発達と維持、免疫機能の強化、組織の修復に重要です。',
    fat: '脂肪：エネルギー源として、ホルモン生成や脂溶性ビタミンの吸収に必要です。',
    fiber: '繊維：消化を助け、腸内環境を整え、糖質の吸収を穏やかにします。',
    calcium: 'カルシウム：骨や歯の形成、神経伝達、筋肉機能、血液凝固に重要です。',
    umami: '旨み成分：風味を豊かにし、食欲増進や満足感をもたらします。',
    amino: 'アミノ酸：タンパク質の構成要素で、筋肉合成や代謝機能の維持に必要です。'
  };

  // 競合他社データ
  const initialCompetitors = [
    {
      id: 1,
      name: '競合A社',
      feeds: [
        { name: '配合飼料X', cost: 5200, nutritions: { protein: 19, fat: 3.5, fiber: 7, calcium: 1.2, umami: 2.0, amino: 15 } },
        { name: '牧草Y', cost: 3200, nutritions: { protein: 13, fat: 2.5, fiber: 24, calcium: 0.6, umami: 1.0, amino: 10 } }
      ]
    },
    {
      id: 2,
      name: '競合B社',
      feeds: [
        { name: '配合飼料Z', cost: 4800, nutritions: { protein: 17, fat: 4.5, fiber: 9, calcium: 0.9, umami: 3.0, amino: 13 } }
      ]
    }
  ];
  
  // Feed data state
  const [feeds, setFeeds] = useState(initialFeeds);
  const [purchases, setPurchases] = useState(initialPurchases);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [visibleNutritions, setVisibleNutritions] = useState({
    protein: true,
    fat: true,
    fiber: true,
    calcium: true,
    umami: true,
    amino: true
  });
  const [customNutritions, setCustomNutritions] = useState({});
  const [eggData, setEggData] = useState({
    eggCount: 5000,
    eggPrice: 30
  });
  
  // 競合他社データの状態
  const [competitors, setCompetitors] = useState(initialCompetitors);
  const [showCompetitors, setShowCompetitors] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState(1);
  
  // フィードのソート状態
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  
  // 編集モード用の状態
  const [editMode, setEditMode] = useState(false);
  const [editFeedId, setEditFeedId] = useState(null);
  const [editFeedForm, setEditFeedForm] = useState({
    name: '',
    cost: 0,
    unit: 'kg',
    nutritions: { protein: 0, fat: 0, fiber: 0, calcium: 0, umami: 0, amino: 0 }
  });
  
  // 新しい栄養成分の追加用
  const [newNutritionName, setNewNutritionName] = useState('');
  
  // Farm system state
  const [flocks, setFlocks] = useState([
    { id: 1, name: '鶏舎A', birdCount: 2500, ageWeeks: 42 },
    { id: 2, name: '鶏舎B', birdCount: 3000, ageWeeks: 28 },
    { id: 3, name: '鶏舎C', birdCount: 1800, ageWeeks: 60 }
  ]);
  
  // 鶏群の詳細データ
  const [flockDetails, setFlockDetails] = useState([
    { id: 1, flockId: 1, healthStatus: '良好', mortalityRate: 0.5, feedConversionRatio: 1.8, notes: '産卵率が平均より高い' },
    { id: 2, flockId: 2, healthStatus: '良好', mortalityRate: 0.7, feedConversionRatio: 2.0, notes: '新しい飼料をテスト中' },
    { id: 3, flockId: 3, healthStatus: '経過観察', mortalityRate: 1.2, feedConversionRatio: 2.2, notes: '高齢のため生産性が低下' }
  ]);
  
  const [inventoryItems, setInventoryItems] = useState([
    { 
      id: 1, 
      name: '配合飼料A', 
      currentStock: 2800, 
      unit: 'kg', 
      minLevel: 1000, 
      optimalLevel: 3000, 
      lastUpdated: '2025/03/20',
      dailyUsage: 250,
      daysRemaining: 11,
      status: 'normal'
    },
    { 
      id: 2, 
      name: '牧草', 
      currentStock: 850, 
      unit: 'kg', 
      minLevel: 500, 
      optimalLevel: 1500, 
      lastUpdated: '2025/03/22',
      dailyUsage: 100,
      daysRemaining: 8,
      status: 'warning'
    },
    { 
      id: 3, 
      name: 'サイレージ', 
      currentStock: 3200, 
      unit: 'kg', 
      minLevel: 1000, 
      optimalLevel: 4000, 
      lastUpdated: '2025/03/18',
      dailyUsage: 180,
      daysRemaining: 17,
      status: 'normal'
    },
    { 
      id: 4, 
      name: '大豆かす', 
      currentStock: 420, 
      unit: 'kg', 
      minLevel: 500, 
      optimalLevel: 1200, 
      lastUpdated: '2025/03/23',
      dailyUsage: 50,
      daysRemaining: 8,
      status: 'critical'
    }
  ]);
  
  // 収益分析データ
  const [revenueData, setRevenueData] = useState([
    { month: '1月', eggs: 145000, meat: 28000, fertilizer: 12000, total: 185000 },
    { month: '2月', eggs: 142000, meat: 26000, fertilizer: 11000, total: 179000 },
    { month: '3月', eggs: 152000, meat: 30000, fertilizer: 13000, total: 195000 }
  ]);
  
  const [annualGoals, setAnnualGoals] = useState({
    revenue: 2400000,
    profit: 720000,
    productionIncrease: 8,
    costReduction: 5
  });
  
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'system', message: '飼料使用量データが更新されました', date: '2025/03/26', read: false, createdAt: new Date().getTime() - 1000 * 60 * 5 },
    { id: 2, type: 'inventory', message: '大豆かすの在庫が不足しています', date: '2025/03/25', read: false, createdAt: new Date().getTime() - 1000 * 60 * 60 },
    { id: 3, type: 'production', message: '産卵率が2%向上しました', date: '2025/03/24', read: false, createdAt: new Date().getTime() - 1000 * 60 * 60 * 5 }
  ]);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [lastSync, setLastSync] = useState(new Date().toISOString());
  const [totalHens, setTotalHens] = useState(7300);
  const [dailyEggProduction, setDailyEggProduction] = useState(6755);
  const [feedRequirements, setFeedRequirements] = useState({
    dailyUsage: {
      '配合飼料A': 250,
      '牧草': 100,
      'サイレージ': 180,
      '大豆かす': 50
    }
  });
  
  // Financial data
  const [currentMonthFeedCost, setCurrentMonthFeedCost] = useState(120000);
  const [projectedProfit, setProjectedProfit] = useState(30000);
  const [profitMargin, setProfitMargin] = useState(20.0);
  
  // Feed distribution for charts
  const [feedDistribution, setFeedDistribution] = useState([
    { name: '配合飼料A', value: 7500 },
    { name: '牧草', value: 3000 },
    { name: 'サイレージ', value: 5400 },
    { name: '大豆かす', value: 1500 }
  ]);
  
  // Nutrition data
  const [nutritionData, setNutritionData] = useState([
    { name: 'タンパク質', value: 18.5 },
    { name: '脂肪', value: 3.2 },
    { name: '繊維', value: 14.8 },
    { name: 'カルシウム', value: 0.7 },
    { name: '旨み成分', value: 2.3 },
    { name: 'アミノ酸', value: 15.2 }
  ]);
  
  // UI states
  const [activeTabs, setActiveTabs] = useState({
    poultry: 'economic',
    inventory: 'inventory',
    revenue: 'monthly'
  });
  
  // Months array
  const months = [
    '1月', '2月', '3月', '4月', '5月', '6月', 
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];
  
  // Initialize data on mount
  useEffect(() => {
    syncData();
  }, []);
  
  // Synchronize data between systems
  const syncData = () => {
    // Update inventory based on feed requirements
    const updatedInventory = inventoryItems.map(item => {
      // Find matching feed requirements
      const dailyUsage = feedRequirements.dailyUsage[item.name] || item.dailyUsage;
      
      // Recalculate days remaining
      const daysRemaining = Math.floor(item.currentStock / dailyUsage);
      
      // Update status
      let status = 'normal';
      if (item.currentStock <= item.minLevel * 0.5) {
        status = 'critical';
      } else if (item.currentStock <= item.minLevel) {
        status = 'warning';
      }
      
      return {
        ...item,
        dailyUsage,
        daysRemaining,
        status,
        lastUpdated: new Date().toISOString().split('T')[0].replace(/-/g, '/')
      };
    });
    
    // Calculate monthly feed cost
    const daysInMonth = new Date(new Date().getFullYear(), currentMonth + 1, 0).getDate();
    const calculatedMonthFeedCost = updatedInventory.reduce((total, item) => {
      return total + (item.dailyUsage * daysInMonth * 
        (feeds.find(f => f.name === item.name)?.cost || 0));
    }, 0);
    
    // Create new notification
    const newNotification = {
      id: Date.now(),
      type: 'system',
      message: 'データ同期が完了しました',
      date: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
      read: false,
      createdAt: new Date().getTime()
    };
    
    // Update feed distribution
    const updatedFeedDistribution = Object.entries(feedRequirements.dailyUsage).map(([name, usage]) => ({
      name,
      value: usage * daysInMonth
    }));
    
    // Calculate nutrition data from feed purchases
    const monthPurchases = purchases.filter(purchase => {
      const purchaseDate = new Date(purchase.purchaseDate);
      return purchaseDate.getMonth() === currentMonth;
    });
    
    const calculatedNutritionData = calculateNutritionData(monthPurchases);
    
    // Calculate financial projections
    const revenue = eggData.eggCount * eggData.eggPrice;
    const calculatedProfit = revenue - calculatedMonthFeedCost;
    const calculatedMargin = revenue > 0 ? (calculatedProfit / revenue) * 100 : 0;
    
    // Update all states
    setInventoryItems(updatedInventory);
    setNotifications([newNotification, ...notifications.slice(0, 9)]);
    setLastSync(new Date().toISOString());
    setShowNotifications(true);
    setCurrentMonthFeedCost(calculatedMonthFeedCost);
    setFeedDistribution(updatedFeedDistribution);
    setNutritionData(calculatedNutritionData);
    setProjectedProfit(calculatedProfit);
    setProfitMargin(calculatedMargin);
  };
  
  // Calculate nutrition data from purchases
  const calculateNutritionData = (monthPurchases: any[]) => {
    if (monthPurchases.length === 0) {
      return nutritionData; // Return existing data if no purchases
    }
    
    // Calculate total weighted amounts
    let totalWeightedWeight = 0;
    monthPurchases.forEach(purchase => {
      const ratio = purchase.feedingRatio || 100;
      totalWeightedWeight += purchase.quantity * (ratio / 100);
    });
    
    // Calculate nutritional values
    const nutritions = {
      protein: 0,
      fat: 0,
      fiber: 0,
      calcium: 0,
      umami: 0,
      amino: 0
    };
    
    monthPurchases.forEach(purchase => {
      const feed = feeds.find(f => f.id === purchase.feedId);
      if (feed) {
        const ratio = purchase.feedingRatio || 100;
        const weightedQuantity = purchase.quantity * (ratio / 100);
        
        Object.entries(feed.nutritions).forEach(([key, value]) => {
          if (nutritions[key as keyof typeof nutritions] !== undefined) {
            nutritions[key as keyof typeof nutritions] += (value * weightedQuantity / totalWeightedWeight);
          }
        });
      }
    });
    
    // Format for chart display
    return Object.entries(nutritions)
      .filter(([name]) => visibleNutritions[name])
      .map(([name, value]) => {
        let label;
        switch(name) {
          case 'protein': label = 'タンパク質'; break;
          case 'fat': label = '脂肪'; break;
          case 'fiber': label = '繊維'; break;
          case 'calcium': label = 'カルシウム'; break;
          case 'umami': label = '旨み成分'; break;
          case 'amino': label = 'アミノ酸'; break;
          default: label = customNutritions[name] || name;
        }
        return {
          name: label,
          value: Math.round(value * 100) / 100
        };
      });
  };
  
  // Mark notification as read
  const markAsRead = (notificationId: number) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === notificationId ? { ...notification, read: true } : notification
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, read: true }))
    );
  };
  
  // Toggle notifications panel
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  
  // Calculate egg cost
  const calculateEggCost = () => {
    if (!eggData.eggCount || eggData.eggCount <= 0) return 0;
    return currentMonthFeedCost / eggData.eggCount;
  };
  
  // Update month
  const setMonth = (monthIndex: number) => {
    setCurrentMonth(monthIndex);
    
    // Recalculate data for the new month
    setTimeout(() => {
      syncData();
    }, 0);
  };
  
  // Add purchase
  const addPurchase = (purchaseData: any) => {
    setPurchases([...purchases, { id: Date.now(), ...purchaseData }]);
    
    // Update related data
    setTimeout(() => {
      syncData();
    }, 0);
  };
  
  // Delete purchase
  const deletePurchase = (purchaseId: number) => {
    setPurchases(purchases.filter(p => p.id !== purchaseId));
    
    // Update related data
    setTimeout(() => {
      syncData();
    }, 0);
  };
  
  // Add feed
  const addFeed = (feedData: any) => {
    setFeeds([...feeds, { id: Date.now(), ...feedData }]);
    
    // Update related data
    setTimeout(() => {
      syncData();
    }, 0);
  };
  
  // Update feed
  const updateFeed = (feedId: number, feedData: any) => {
    setFeeds(feeds.map(feed => 
      feed.id === feedId ? { ...feed, ...feedData } : feed
    ));
    
    // Update related data
    setTimeout(() => {
      syncData();
    }, 0);
  };
  
  // Delete feed
  const deleteFeed = (feedId: number) => {
    // Check if feed is used in purchases
    const usedInPurchases = purchases.some(purchase => purchase.feedId === feedId);
    
    if (usedInPurchases) {
      if (window.confirm('この飼料は購入記録で使用されています。削除すると関連する記録が正しく表示されなくなる可能性があります。削除しますか？')) {
        setFeeds(feeds.filter(feed => feed.id !== feedId));
        syncData();
      }
    } else {
      setFeeds(feeds.filter(feed => feed.id !== feedId));
      syncData();
    }
  };
  
  // Update egg data
  const updateEggData = (newEggData: any) => {
    setEggData(newEggData);
    
    // Update financial projections
    setTimeout(() => {
      syncData();
    }, 0);
  };
  
  // Update inventory item
  const updateInventoryItem = (itemId: number, adjustment: any) => {
    setInventoryItems(inventoryItems.map(item => {
      if (item.id === itemId) {
        const newStock = adjustment.type === 'add' 
          ? item.currentStock + adjustment.quantity
          : Math.max(0, item.currentStock - adjustment.quantity);
        
        // Calculate days remaining
        const daysRemaining = item.dailyUsage > 0 ? Math.floor(newStock / item.dailyUsage) : 999;
        
        // Update status
        let status = 'normal';
        if (newStock <= item.minLevel * 0.5) {
          status = 'critical';
        } else if (newStock <= item.minLevel) {
          status = 'warning';
        }
        
        return {
          ...item,
          currentStock: newStock,
          lastUpdated: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
          daysRemaining,
          status
        };
      }
      return item;
    }));
    
    // Add notification
    const item = inventoryItems.find(i => i.id === itemId);
    const newNotification = {
      id: Date.now(),
      type: 'inventory',
      message: `${item?.name || '在庫'}を${adjustment.type === 'add' ? adjustment.quantity + '単位追加' : adjustment.quantity + '単位使用'}しました`,
      date: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
      read: false,
      createdAt: new Date().getTime()
    };
    
    setNotifications([newNotification, ...notifications]);
    
    // Update related data
    syncData();
  };
  
  // Change active tab
  const changeTab = (system: string, tab: string) => {
    setActiveTabs({
      ...activeTabs,
      [system]: tab
    });
  };
  
  // Get monthly purchases
  const getMonthlyPurchases = (monthIndex: number) => {
    const year = new Date().getFullYear();
    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0);
    
    return purchases.filter(purchase => {
      const purchaseDate = new Date(purchase.purchaseDate);
      return purchaseDate >= startDate && purchaseDate <= endDate;
    });
  };
  
  // Calculate total cost for a month
  const calculateTotalCost = (monthIndex: number) => {
    const monthPurchases = getMonthlyPurchases(monthIndex);
    return monthPurchases.reduce((total, purchase) => {
      const feed = feeds.find(f => f.id === purchase.feedId);
      const ratio = purchase.feedingRatio || 100;
      return total + (feed ? (feed.cost * purchase.quantity / 1000) * (ratio / 100) : 0);
    }, 0);
  };
  
  // 月別の飼料購入データを取得
  const getMonthlyPurchases = (monthIndex) => {
    const year = new Date().getFullYear();
    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0);
    
    return purchases.filter(purchase => {
      const purchaseDate = new Date(purchase.purchaseDate);
      return purchaseDate >= startDate && purchaseDate <= endDate;
    });
  };
  
  // Calculate nutrition data from purchases
  const calculateNutritionData = (monthPurchases) => {
    if (monthPurchases.length === 0) {
      return nutritionData; // Return existing data if no purchases
    }
    
    // Calculate total weighted amounts
    let totalWeightedWeight = 0;
    monthPurchases.forEach(purchase => {
      const ratio = purchase.feedingRatio || 100;
      totalWeightedWeight += purchase.quantity * (ratio / 100);
    });
    
    // Calculate nutritional values
    const nutritions = {
      protein: 0,
      fat: 0,
      fiber: 0,
      calcium: 0,
      umami: 0,
      amino: 0
    };
    
    monthPurchases.forEach(purchase => {
      const feed = feeds.find(f => f.id === purchase.feedId);
      if (feed) {
        const ratio = purchase.feedingRatio || 100;
        const weightedQuantity = purchase.quantity * (ratio / 100);
        
        Object.entries(feed.nutritions).forEach(([key, value]) => {
          if (nutritions[key] !== undefined) {
            nutritions[key] += (value * weightedQuantity / totalWeightedWeight);
          }
        });
      }
    });
    
    // Format for chart display
    return Object.entries(nutritions)
      .filter(([name]) => visibleNutritions[name])
      .map(([name, value]) => {
        let label;
        switch(name) {
          case 'protein': label = 'タンパク質'; break;
          case 'fat': label = '脂肪'; break;
          case 'fiber': label = '繊維'; break;
          case 'calcium': label = 'カルシウム'; break;
          case 'umami': label = '旨み成分'; break;
          case 'amino': label = 'アミノ酸'; break;
          default: label = customNutritions[name] || name;
        }
        return { name: label, value };
      });
  };
  
  // 月別の総コスト計算
  const calculateTotalCost = (monthIndex) => {
    const monthPurchases = getMonthlyPurchases(monthIndex);
    return monthPurchases.reduce((total, purchase) => {
      const feed = feeds.find(f => f.id === purchase.feedId);
      return total + (feed ? feed.cost * purchase.quantity / 1000 : 0);
    }, 0);
  };
  
  // 各餌のコスト割合を計算
  const calculateFeedCostPercentage = (monthIndex) => {
    const monthPurchases = getMonthlyPurchases(monthIndex);
    const totalCost = calculateTotalCost(monthIndex);
    
    if (totalCost === 0) return [];
    
    // 飼料ごとの総コストを計算
    const feedCosts = {};
    
    monthPurchases.forEach(purchase => {
      const feed = feeds.find(f => f.id === purchase.feedId);
      if (feed) {
        const cost = feed.cost * purchase.quantity / 1000;
        feedCosts[feed.id] = (feedCosts[feed.id] || 0) + cost;
      }
    });
    
    // パーセンテージに変換
    return Object.entries(feedCosts).map(([feedId, cost]) => {
      const feed = feeds.find(f => f.id === parseInt(feedId));
      return {
        name: feed ? feed.name : 'Unknown',
        value: cost,
        percentage: (cost / totalCost * 100).toFixed(1)
      };
    }).sort((a, b) => b.value - a.value);
  };
  
  // 卵1個あたりのコスト計算
  const calculateEggCost = () => {
    const totalCost = calculateTotalCost(currentMonth);
    if (eggData.eggCount <= 0) return 0;
    return totalCost / eggData.eggCount;
  };
  
  // 損益分岐点の計算
  const calculateBreakEvenPoint = () => {
    const totalCost = calculateTotalCost(currentMonth);
    if (eggData.eggPrice <= 0) return 0;
    return Math.ceil(totalCost / eggData.eggPrice);
  };
  
  // 卵の利益計算
  const calculateEggProfit = () => {
    const totalCost = calculateTotalCost(currentMonth);
    const totalRevenue = eggData.eggCount * eggData.eggPrice;
    return totalRevenue - totalCost;
  };
  
  // 利益率の計算
  const calculateProfitMargin = () => {
    const totalCost = calculateTotalCost(currentMonth);
    const totalRevenue = eggData.eggCount * eggData.eggPrice;
    if (totalRevenue === 0) return 0;
    return (totalRevenue - totalCost) / totalRevenue * 100;
  };
  
  // 各飼料の栄養影響度を計算
  const calculateNutritionContribution = () => {
    const monthPurchases = getMonthlyPurchases(currentMonth);
    if (monthPurchases.length === 0) return [];
    
    // 各飼料ごとに、各栄養素への寄与度を計算
    const contributions = {};
    const totalWeights = {};
    
    // 各栄養素の合計を計算
    const nutritionTotals = {};
    
    // 表示する栄養素のみを対象にする
    const activeNutritions = Object.keys(visibleNutritions).filter(key => visibleNutritions[key]);
    
    // 各購入に対して処理
    monthPurchases.forEach(purchase => {
      const feed = feeds.find(f => f.id === purchase.feedId);
      if (!feed) return;
      
      if (!contributions[feed.id]) {
        contributions[feed.id] = {
          name: feed.name,
          values: {}
        };
      }
      
      // 各栄養素に対して処理
      activeNutritions.forEach(nutritionKey => {
        if (feed.nutritions[nutritionKey] !== undefined) {
          // この購入で追加される栄養量
          const amount = feed.nutritions[nutritionKey] * purchase.quantity;
          
          // 累計に加算
          contributions[feed.id].values[nutritionKey] = (contributions[feed.id].values[nutritionKey] || 0) + amount;
          
          // 全体の合計に加算
          nutritionTotals[nutritionKey] = (nutritionTotals[nutritionKey] || 0) + amount;
        }
      });
      
      // 総重量を記録
      totalWeights[feed.id] = (totalWeights[feed.id] || 0) + purchase.quantity;
    });
    
    // パーセンテージに変換
    const result = [];
    Object.entries(contributions).forEach(([feedId, data]) => {
      const contribution = { name: data.name };
      
      activeNutritions.forEach(nutritionKey => {
        if (nutritionTotals[nutritionKey] > 0) {
          contribution[nutritionKey] = (data.values[nutritionKey] / nutritionTotals[nutritionKey] * 100).toFixed(1);
        } else {
          contribution[nutritionKey] = 0;
        }
      });
      
      result.push(contribution);
    });
    
    return result;
  };
  
  // フィードのソート処理を行う関数
  const sortFeeds = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  // ソートされたフィードリストを生成
  const getSortedFeeds = () => {
    const sortableFeeds = [...feeds];
    if (sortConfig.key !== null) {
      sortableFeeds.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableFeeds;
  };
  
  // 栄養成分の日本語名取得
  const getNutritionLabel = (key) => {
    switch(key) {
      case 'protein': return 'タンパク質';
      case 'fat': return '脂肪';
      case 'fiber': return '繊維';
      case 'calcium': return 'カルシウム';
      case 'umami': return '旨み成分';
      case 'amino': return 'アミノ酸';
      default: return customNutritions[key] || key;
    }
  };
  
  // 栄養成分の追加
  const addCustomNutrition = (name) => {
    if (!name.trim()) return;
    
    const nutritionKey = name.toLowerCase().replace(/\s+/g, '_');
    
    if (Object.keys(visibleNutritions).includes(nutritionKey)) {
      return false; // 既に存在する
    }
    
    // 栄養成分を追加
    setCustomNutritions({
      ...customNutritions,
      [nutritionKey]: name
    });
    
    // 表示状態を更新
    setVisibleNutritions({
      ...visibleNutritions,
      [nutritionKey]: true
    });
    
    // すべての飼料に新しい栄養成分を0で追加
    const updatedFeeds = feeds.map(feed => ({
      ...feed,
      nutritions: { ...feed.nutritions, [nutritionKey]: 0 }
    }));
    
    setFeeds(updatedFeeds);
    setNewNutritionName('');
    return true;
  };
  
  // 栄養成分の表示切替
  const toggleNutritionVisibility = (key) => {
    setVisibleNutritions({
      ...visibleNutritions,
      [key]: !visibleNutritions[key]
    });
  };
  
  // 栄養成分の削除
  const deleteNutrition = (key) => {
    // カスタム栄養成分のみ削除可能
    if (Object.keys(nutritionBenefits).includes(key)) {
      return false; // 基本栄養成分は削除不可
    }
    
    // カスタム栄養成分から削除
    const newCustomNutritions = { ...customNutritions };
    delete newCustomNutritions[key];
    setCustomNutritions(newCustomNutritions);
    
    // 表示状態から削除
    const newVisibleNutritions = { ...visibleNutritions };
    delete newVisibleNutritions[key];
    setVisibleNutritions(newVisibleNutritions);
    
    // すべての飼料から該当栄養成分を削除
    const updatedFeeds = feeds.map(feed => {
      const newNutritions = { ...feed.nutritions };
      delete newNutritions[key];
      return {
        ...feed,
        nutritions: newNutritions
      };
    });
    
    setFeeds(updatedFeeds);
    return true;
  };
  
  // 飼料の追加
  const addFeed = (feedData) => {
    const newFeed = {
      id: Date.now(),
      ...feedData
    };
    
    setFeeds([...feeds, newFeed]);
    return newFeed;
  };
  
  // 飼料の更新
  const updateFeed = (feedId, feedData) => {
    const updatedFeeds = feeds.map(feed => {
      if (feed.id === feedId) {
        return {
          ...feed,
          ...feedData
        };
      }
      return feed;
    });
    
    setFeeds(updatedFeeds);
  };
  
  // 飼料の削除
  const deleteFeed = (feedId) => {
    // この飼料を使用している購入記録があるか確認
    const usedInPurchases = purchases.some(purchase => purchase.feedId === feedId);
    
    if (usedInPurchases) {
      return false; // 使用中で削除不可
    }
    
    setFeeds(feeds.filter(feed => feed.id !== feedId));
    return true;
  };
  
  // 購入記録の追加
  const addPurchase = (purchaseData) => {
    const newPurchase = {
      id: Date.now(),
      ...purchaseData
    };
    
    setPurchases([...purchases, newPurchase]);
    return newPurchase;
  };
  
  // 購入記録の削除
  const deletePurchase = (purchaseId) => {
    setPurchases(purchases.filter(purchase => purchase.id !== purchaseId));
  };
  
  // 競合他社表示の切替
  const toggleCompetitorsView = () => {
    setShowCompetitors(!showCompetitors);
  };
  
  // 在庫アイテムの更新
  const updateInventoryItem = (itemId, data) => {
    const updatedItems = inventoryItems.map(item => {
      if (item.id === itemId) {
        return { ...item, ...data };
      }
      return item;
    });
    
    setInventoryItems(updatedItems);
  };
  
  // 鶏群の更新
  const updateFlock = (flockId, data) => {
    const updatedFlocks = flocks.map(flock => {
      if (flock.id === flockId) {
        return { ...flock, ...data };
      }
      return flock;
    });
    
    setFlocks(updatedFlocks);
  };
  
  // 鶏群の詳細情報を取得
  const getFlockDetail = (flockId) => {
    return flockDetails.find(detail => detail.flockId === flockId);
  };
  
  // 鶏群詳細の更新
  const updateFlockDetail = (detailId, data) => {
    const updatedDetails = flockDetails.map(detail => {
      if (detail.id === detailId) {
        return { ...detail, ...data };
      }
      return detail;
    });
    
    setFlockDetails(updatedDetails);
  };
  
  // ファイルをダウンロードするヘルパー関数
  const downloadFile = (content, fileName, contentType) => {
    if (typeof window !== 'undefined') {
      const blob = new Blob([content], { type: contentType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    }
  };
  
  // 飼料データをCSVでダウンロード
  const downloadFeedsAsCSV = () => {
    // ヘッダー行の作成
    let csv = '飼料ID,飼料名,コスト,単位,タンパク質(%),脂肪(%),繊維(%),カルシウム(%),旨み成分(%),アミノ酸(%)\n';
    
    // データ行の追加
    feeds.forEach(feed => {
      const { id, name, cost, unit, nutritions } = feed;
      const row = [
        id,
        name,
        cost,
        unit,
        nutritions.protein || 0,
        nutritions.fat || 0,
        nutritions.fiber || 0,
        nutritions.calcium || 0,
        nutritions.umami || 0,
        nutritions.amino || 0
      ].join(',');
      csv += row + '\n';
    });
    
    // CSVファイルとしてダウンロード
    downloadFile(csv, '飼料データ.csv', 'text/csv');
  };
  
  // 購入履歴をCSVでダウンロード
  const downloadPurchasesAsCSV = () => {
    // ヘッダー行の作成
    let csv = '購入ID,飼料ID,飼料名,数量(kg),単価(円/kg),合計(円),購入日\n';
    
    // データ行の追加
    purchases.forEach(purchase => {
      const { id, feedId, quantity, purchaseDate } = purchase;
      const feed = feeds.find(f => f.id === feedId);
      if (feed) {
        const cost = feed.cost;
        const total = cost * quantity;
        const row = [
          id,
          feedId,
          feed.name,
          quantity,
          cost,
          total,
          purchaseDate
        ].join(',');
        csv += row + '\n';
      }
    });
    
    // CSVファイルとしてダウンロード
    downloadFile(csv, '購入履歴.csv', 'text/csv');
  };
  
  // すべてのデータをJSONでダウンロード（バックアップ用）
  const downloadAllDataAsJSON = () => {
    const data = { 
      feeds, 
      purchases, 
      eggData,
      inventoryItems,
      flocks,
      flockDetails,
      revenueData
    };
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, '養鶏管理データ.json', 'application/json');
  };
  
  // 月別の栄養成分データをCSVでダウンロード
  const downloadNutritionDataAsCSV = () => {
    // ヘッダー行の作成
    let csv = '月,タンパク質(%),脂肪(%),繊維(%),カルシウム(%),旨み成分(%),アミノ酸(%),総コスト(円)\n';
    
    // 各月のデータを追加
    months.forEach((month, index) => {
      const nutritions = calculateNutritions(index);
      const cost = calculateTotalCost(index);
      
      const row = [
        month,
        nutritions.protein || 0,
        nutritions.fat || 0,
        nutritions.fiber || 0,
        nutritions.calcium || 0,
        nutritions.umami || 0,
        nutritions.amino || 0,
        cost
      ].join(',');
      
      csv += row + '\n';
    });
    
    // CSVファイルとしてダウンロード
    downloadFile(csv, '月別栄養成分データ.csv', 'text/csv');
  };
  
  // 各栄養成分の計算
  const calculateNutritions = (monthIndex) => {
    const monthPurchases = getMonthlyPurchases(monthIndex);
    const totalWeight = monthPurchases.reduce((total, purchase) => total + purchase.quantity, 0);
    
    if (totalWeight === 0) return {};
    
    const nutritions = {};
    
    monthPurchases.forEach(purchase => {
      const feed = feeds.find(f => f.id === purchase.feedId);
      if (feed) {
        Object.entries(feed.nutritions).forEach(([key, value]) => {
          nutritions[key] = (nutritions[key] || 0) + (value * purchase.quantity / totalWeight);
        });
      }
    });
    
    // 小数点第2位で四捨五入
    Object.keys(nutritions).forEach(key => {
      nutritions[key] = Math.round(nutritions[key] * 100) / 100;
    });
    
    return nutritions;
  };
  
  // タブの変更
  const changeTab = (tabSet, tabName) => {
    setActiveTabs({
      ...activeTabs,
      [tabSet]: tabName
    });
  };
  
  // 通知の切替
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  
  // 既読にする
  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === notificationId) {
        return { ...notification, read: true };
      }
      return notification;
    });
    
    setNotifications(updatedNotifications);
  };
  
  // すべて既読にする
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    
    setNotifications(updatedNotifications);
  };
  
  // 収益目標の更新
  const updateAnnualGoals = (goals) => {
    setAnnualGoals(goals);
  };
  
  // 卵データの更新
  const updateEggData = (data) => {
    setEggData(data);
  };
  
  // コンテキスト値
  const value = {
    // データ
    COLORS,
    feeds,
    purchases,
    flocks,
    flockDetails,
    inventoryItems,
    nutritionData,
    feedDistribution,
    notifications,
    eggData,
    revenueData,
    annualGoals,
    competitors,
    visibleNutritions,
    customNutritions,
    nutritionBenefits,
    
    // UI状態
    currentMonth,
    showNotifications,
    activeTabs,
    totalHens,
    dailyEggProduction,
    currentMonthFeedCost,
    projectedProfit,
    profitMargin,
    showCompetitors,
    selectedCompetitor,
    sortConfig,
    editMode,
    editFeedId,
    editFeedForm,
    newNutritionName,
    months,
    
    // 関数
    setCurrentMonth,
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
    markAllAsRead,
    changeTab,
    addFeed,
    updateFeed,
    deleteFeed,
    addPurchase,
    deletePurchase,
    updateInventoryItem,
    updateFlock,
    getFlockDetail,
    updateFlockDetail,
    updateAnnualGoals,
    getNutritionLabel,
    toggleNutritionVisibility,
    addCustomNutrition,
    deleteNutrition,
    setNewNutritionName,
    sortFeeds,
    getSortedFeeds,
    toggleCompetitorsView,
    setSelectedCompetitor,
    updateEggData,
    setEditMode,
    setEditFeedId,
    setEditFeedForm,
    
    // データエクスポート
    downloadFeedsAsCSV,
    downloadPurchasesAsCSV,
    downloadAllDataAsJSON,
    downloadNutritionDataAsCSV
  };
  
  return (
    <FarmContext.Provider value={value}>
      {children}
    </FarmContext.Provider>
  );
} 