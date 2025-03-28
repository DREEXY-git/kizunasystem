import React, { useState, useEffect, createContext } from 'react';
import {
  Feed,
  InventoryItem,
  FeedDistributionItem,
  NutritionDataItem,
  EggData,
  Flock,
  ActiveTabs,
  Notification,
  FeedRequirements,
  InventoryAdjustment,
  FarmContextType
} from '../components/types';

// Create context for the entire application
export const FarmContext = createContext<FarmContextType | null>(null);

// Format time utility function
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString.replace(/(\d{4})\/(\d{2})\/(\d{2})/, '$1-$2-$3'));
  const now = new Date();
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffSeconds < 60) return `${diffSeconds}秒前`;
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}分前`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}時間前`;
  if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)}日前`;
  
  return dateString;
};

// FarmProvider Component
export function FarmProvider({ children }: { children: React.ReactNode }) {
  // ユーザーIDの生成
  const [userId] = useState(`user_${Math.random().toString(36).substr(2, 9)}`);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Initial feeds data
  const [feeds, setFeeds] = useState<Feed[]>([
    { id: 1, name: '配合飼料A', cost: 5000, unit: 'kg', nutritions: { protein: 18, fat: 4, fiber: 8, calcium: 1, umami: 2.5, amino: 14 } },
    { id: 2, name: '牧草', cost: 3000, unit: 'kg', nutritions: { protein: 12, fat: 2, fiber: 22, calcium: 0.5, umami: 1.2, amino: 9 } },
    { id: 3, name: 'サイレージ', cost: 2500, unit: 'kg', nutritions: { protein: 10, fat: 3, fiber: 25, calcium: 0.3, umami: 1.5, amino: 8 } },
    { id: 4, name: '大豆かす', cost: 6500, unit: 'kg', nutritions: { protein: 45, fat: 1, fiber: 7, calcium: 0.3, umami: 3.8, amino: 38 } }
  ]);

  // Initial inventory data
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    { 
      id: 1, 
      name: '配合飼料A', 
      currentStock: 2800, 
      unit: 'kg', 
      optimalLevel: 3000,
      cost: 5000,
      dailyUsage: 250,
      daysRemaining: 11,
      status: 'normal'
    },
    { 
      id: 2, 
      name: '牧草', 
      currentStock: 850, 
      unit: 'kg', 
      optimalLevel: 1500,
      cost: 3000,
      dailyUsage: 100,
      daysRemaining: 8,
      status: 'warning'
    },
    { 
      id: 3, 
      name: 'サイレージ', 
      currentStock: 3200, 
      unit: 'kg', 
      optimalLevel: 4000,
      cost: 2500,
      dailyUsage: 180,
      daysRemaining: 17,
      status: 'normal'
    },
    { 
      id: 4, 
      name: '大豆かす', 
      currentStock: 420, 
      unit: 'kg', 
      optimalLevel: 1200,
      cost: 6500,
      dailyUsage: 50,
      daysRemaining: 8,
      status: 'critical'
    }
  ]);

  // Initial purchases data
  const [purchases, setPurchases] = useState<any[]>([
    { id: 101, feedId: 1, quantity: 500, feedingRatio: 20, purchaseDate: new Date(2025, 0, 15).toISOString().split('T')[0] },
    { id: 102, feedId: 2, quantity: 300, feedingRatio: 30, purchaseDate: new Date(2025, 0, 20).toISOString().split('T')[0] },
    { id: 103, feedId: 3, quantity: 800, feedingRatio: 40, purchaseDate: new Date(2025, 1, 10).toISOString().split('T')[0] },
    { id: 104, feedId: 4, quantity: 200, feedingRatio: 10, purchaseDate: new Date(2025, 1, 20).toISOString().split('T')[0] }
  ]);

  // Feed data state
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [eggData, setEggData] = useState<EggData>({
    eggCount: 5000,
    eggPrice: 30
  });
  
  // Farm system state
  const [flocks] = useState<Flock[]>([
    { id: 1, name: '鶏舎A', birdCount: 2500, ageWeeks: 42 },
    { id: 2, name: '鶏舎B', birdCount: 3000, ageWeeks: 28 },
    { id: 3, name: '鶏舎C', birdCount: 1800, ageWeeks: 60 }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, type: 'system', message: '飼料使用量データが更新されました', date: '2025/03/26', read: false },
    { id: 2, type: 'inventory', message: '大豆かすの在庫が不足しています', date: '2025/03/25', read: false },
    { id: 3, type: 'production', message: '産卵率が2%向上しました', date: '2025/03/24', read: false }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [lastSync, setLastSync] = useState(new Date().toISOString());
  const [totalHens] = useState(7300);
  const [dailyEggProduction] = useState(6755);
  const [feedRequirements] = useState<FeedRequirements>({
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
  const [feedDistribution, setFeedDistribution] = useState<FeedDistributionItem[]>([
    { name: '配合飼料A', value: 7500 },
    { name: '牧草', value: 3000 },
    { name: 'サイレージ', value: 5400 },
    { name: '大豆かす', value: 1500 }
  ]);

  // Nutrition data
  const [nutritionData, setNutritionData] = useState<NutritionDataItem[]>([
    { name: 'タンパク質', value: 18.5 },
    { name: '脂肪', value: 3.2 },
    { name: '繊維', value: 14.8 },
    { name: 'カルシウム', value: 0.7 },
    { name: '旨み成分', value: 2.3 },
    { name: 'アミノ酸', value: 15.2 }
  ]);

  // UI states
  const [activeTabs, setActiveTabs] = useState<ActiveTabs>({
    poultry: 'economic',
    inventory: 'inventory'
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
      let status: 'critical' | 'warning' | 'normal' = 'normal';
      if (item.currentStock <= item.optimalLevel * 0.3) {
        status = 'critical';
      } else if (item.currentStock <= item.optimalLevel * 0.5) {
        status = 'warning';
      }
      
      return {
        ...item,
        dailyUsage,
        daysRemaining,
        status
      };
    });
    
    // Calculate monthly feed cost
    const daysInMonth = new Date(new Date().getFullYear(), currentMonth + 1, 0).getDate();
    const calculatedMonthFeedCost = updatedInventory.reduce((total, item) => {
      return total + (item.dailyUsage * daysInMonth * item.cost);
    }, 0);
    
    // Create new notification
    const newNotification: Notification = {
      id: Date.now(),
      type: 'system',
      message: 'データ同期が完了しました',
      date: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
      read: false
    };
    
    // Update feed distribution
    const updatedFeedDistribution = Object.entries(feedRequirements.dailyUsage).map(([name, usage]) => ({
      name,
      value: usage * daysInMonth
    }));
    
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
    setProjectedProfit(calculatedProfit);
    setProfitMargin(calculatedMargin);
  };

  // Mark notification as read
  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
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

  // Set current month
  const setMonth = (monthIndex: number) => {
    setCurrentMonth(monthIndex);
  };

  // Add a new purchase
  const addPurchase = (purchaseData: any) => {
    setPurchases([...purchases, { id: Date.now(), ...purchaseData }]);
  };

  // Delete a purchase
  const deletePurchase = (purchaseId: number) => {
    setPurchases(purchases.filter(p => p.id !== purchaseId));
  };

  // Add a new feed
  const addFeed = (feedData: Omit<Feed, 'id'>) => {
    setFeeds([...feeds, { id: Date.now(), ...feedData }]);
  };

  // Update a feed
  const updateFeed = (feedId: number, feedData: Omit<Feed, 'id'>) => {
    setFeeds(
      feeds.map(feed => 
        feed.id === feedId ? { id: feedId, ...feedData } : feed
      )
    );
  };

  // Delete a feed
  const deleteFeed = (feedId: number) => {
    // Check if feed is used in any purchase
    const isUsed = purchases.some(p => p.feedId === feedId);
    
    if (isUsed) {
      alert('この飼料は購入履歴で使用されているため削除できません');
      return false;
    } else {
      setFeeds(feeds.filter(f => f.id !== feedId));
      return true;
    }
  };

  // Update egg data
  const updateEggData = (newEggData: EggData) => {
    setEggData(newEggData);
  };

  // Update inventory item
  const updateInventoryItem = (itemId: number, adjustment: InventoryAdjustment) => {
    setInventoryItems(
      inventoryItems.map(item => {
        if (item.id === itemId) {
          // Calculate new current stock
          let newStock = item.currentStock;
          
          if (adjustment.type === 'add') {
            newStock += adjustment.quantity;
          } else if (adjustment.type === 'subtract') {
            newStock = Math.max(0, newStock - adjustment.quantity);
          } else if (adjustment.type === 'set') {
            newStock = adjustment.quantity;
          }
          
          // Recalculate days remaining
          const daysRemaining = Math.floor(newStock / item.dailyUsage);
          
          // Update status
          let status: 'critical' | 'warning' | 'normal' = 'normal';
          if (newStock <= item.optimalLevel * 0.3) {
            status = 'critical';
          } else if (newStock <= item.optimalLevel * 0.5) {
            status = 'warning';
          }
          
          // Create notification if stock is low
          if (status !== item.status && (status === 'warning' || status === 'critical')) {
            const newNotification: Notification = {
              id: Date.now(),
              type: 'inventory',
              message: `${item.name}の在庫が${status === 'critical' ? '危険' : '警告'}レベルに達しました`,
              date: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
              read: false
            };
            setNotifications([newNotification, ...notifications]);
          }
          
          return {
            ...item,
            currentStock: newStock,
            daysRemaining,
            status
          };
        }
        return item;
      })
    );
  };

  // Change active tab
  const changeTab = (system: keyof ActiveTabs, tab: string) => {
    setActiveTabs({
      ...activeTabs,
      [system]: tab
    });
  };

  // Calculate total cost for a given month
  const calculateTotalCost = (monthIndex: number) => {
    // Filter purchases for the specified month
    const monthPurchases = purchases.filter(purchase => {
      const purchaseDate = new Date(purchase.purchaseDate);
      return purchaseDate.getMonth() === monthIndex;
    });
    
    // Calculate total cost
    return monthPurchases.reduce((total, purchase) => {
      const feed = feeds.find(f => f.id === purchase.feedId);
      if (feed) {
        return total + (feed.cost * purchase.quantity);
      }
      return total;
    }, 0);
  };

  // Get monthly purchases
  const getMonthlyPurchases = (monthIndex: number) => {
    return purchases.filter(purchase => {
      const purchaseDate = new Date(purchase.purchaseDate);
      return purchaseDate.getMonth() === monthIndex;
    });
  };

  // Calculate nutritional contributions
  const calculateNutritionData = (monthPurchases) => {
    if (!monthPurchases || monthPurchases.length === 0) {
      return [];
    }

    // Calculate weighted nutrition amounts
    const totalWeightedNutritions = {};
    let totalQuantity = 0;

    monthPurchases.forEach(purchase => {
      const feed = feeds.find(f => f.id === purchase.feedId);
      if (feed) {
        const weightedQuantity = purchase.quantity * (purchase.feedingRatio / 100);
        totalQuantity += weightedQuantity;

        Object.entries(feed.nutritions).forEach(([key, value]) => {
          if (!totalWeightedNutritions[key]) {
            totalWeightedNutritions[key] = 0;
          }
          totalWeightedNutritions[key] += value * weightedQuantity;
        });
      }
    });

    // Format for chart display
    return Object.entries(totalWeightedNutritions).map(([key, value]) => ({
      name: key === 'protein' ? 'タンパク質' :
            key === 'fat' ? '脂肪' :
            key === 'fiber' ? '繊維' :
            key === 'calcium' ? 'カルシウム' :
            key === 'umami' ? '旨み成分' :
            key === 'amino' ? 'アミノ酸' : key,
      value: totalQuantity > 0 ? (value as number) / totalQuantity : 0
    }));
  };

  // Get visible nutrition entries
  const [visibleNutritions, setVisibleNutritions] = useState({
    protein: true,
    fat: true,
    fiber: true,
    calcium: true,
    umami: true,
    amino: true
  });

  // Toggle nutrition visibility
  const toggleNutritionVisibility = (key: string) => {
    setVisibleNutritions({
      ...visibleNutritions,
      [key]: !visibleNutritions[key]
    });
  };

  // Add custom nutrition
  const [newNutritionName, setNewNutritionName] = useState('');
  const [customNutritions, setCustomNutritions] = useState<string[]>([]);

  const addCustomNutrition = (name: string) => {
    // Convert to camelCase for use as a key
    const key = name.toLowerCase().replace(/\s+/g, '_');
    
    // Add to custom nutritions list
    setCustomNutritions([...customNutritions, key]);
    
    // Make it visible
    setVisibleNutritions({
      ...visibleNutritions,
      [key]: true
    });
    
    // Add empty value to all feeds
    setFeeds(
      feeds.map(feed => ({
        ...feed,
        nutritions: {
          ...feed.nutritions,
          [key]: 0
        }
      }))
    );
    
    // Reset input
    setNewNutritionName('');
  };

  // Get nutrition label
  const getNutritionLabel = (key: string) => {
    const labels = {
      protein: 'タンパク質',
      fat: '脂肪',
      fiber: '繊維',
      calcium: 'カルシウム',
      umami: '旨み成分',
      amino: 'アミノ酸'
    };
    
    return labels[key] || key.replace(/_/g, ' ');
  };

  // Delete custom nutrition
  const deleteNutrition = (key: string) => {
    // Only allow deleting custom nutritions, not basic ones
    const basicNutritions = ['protein', 'fat', 'fiber', 'calcium', 'umami', 'amino'];
    if (basicNutritions.includes(key)) {
      return;
    }
    
    // Remove from custom list
    setCustomNutritions(customNutritions.filter(n => n !== key));
    
    // Remove from visible list
    const newVisibleNutritions = { ...visibleNutritions };
    delete newVisibleNutritions[key];
    setVisibleNutritions(newVisibleNutritions);
    
    // Remove from all feeds
    setFeeds(
      feeds.map(feed => {
        const newNutritions = { ...feed.nutritions };
        delete newNutritions[key];
        return {
          ...feed,
          nutritions: newNutritions
        };
      })
    );
  };

  // Sort function for feeds
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  const sortFeeds = (key: string) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  // Get sorted feeds
  const getSortedFeeds = () => {
    return [...feeds].sort((a, b) => {
      if (sortConfig.key === 'name') {
        if (a.name < b.name) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a.name > b.name) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
      } else if (sortConfig.key === 'cost') {
        if (a.cost < b.cost) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a.cost > b.cost) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
      }
      return 0;
    });
  };

  // Nutrition benefits info
  const [showNutritionInfo, setShowNutritionInfo] = useState(false);
  const nutritionBenefits = {
    protein: 'タンパク質は筋肉の成長と修復を助け、免疫システムをサポートします。',
    fat: '適切な量の脂肪は、エネルギー源として必要で、脂溶性ビタミンの吸収を助けます。',
    fiber: '繊維質は、健康的な消化と腸内環境の維持に重要です。',
    calcium: 'カルシウムは、強い骨格の形成と卵殻の品質向上に不可欠です。',
    umami: '旨み成分は、飼料の風味を向上させ、鶏の摂食行動を促進します。',
    amino: 'アミノ酸は、タンパク質の構成要素で、鶏の成長と発育に重要です。'
  };

  // Get nutrition contribution data
  const calculateNutritionContribution = (monthIndex: number) => {
    const monthPurchases = getMonthlyPurchases(monthIndex);
    if (!monthPurchases || monthPurchases.length === 0) {
      return [];
    }
    
    // Group purchases by feed
    const feedContributions = {};
    let totalWeight = 0;
    
    // Calculate total weight and group by feed
    monthPurchases.forEach(purchase => {
      const feed = feeds.find(f => f.id === purchase.feedId);
      if (feed) {
        const weight = purchase.quantity * (purchase.feedingRatio / 100);
        totalWeight += weight;
        
        if (!feedContributions[feed.id]) {
          feedContributions[feed.id] = {
            name: feed.name,
            weight: 0,
            nutritions: {}
          };
        }
        
        feedContributions[feed.id].weight += weight;
      }
    });
    
    // Calculate percentage contribution for each nutrition
    Object.values(feedContributions).forEach((contribution: any) => {
      const feed = feeds.find(f => f.name === contribution.name);
      if (feed) {
        Object.entries(feed.nutritions)
          .filter(([key]) => visibleNutritions[key])
          .forEach(([key, value]) => {
            contribution[key] = Math.round((value * contribution.weight / totalWeight) * 10) / 10;
          });
      }
    });
    
    return Object.values(feedContributions);
  };

  // Download data as CSV
  const downloadFeedsAsCSV = () => {
    const headers = ['ID', '飼料名', '単価', '単位'];
    const nutritionKeys = Object.keys(visibleNutritions).filter(key => visibleNutritions[key]);
    nutritionKeys.forEach(key => headers.push(getNutritionLabel(key)));
    
    const rows = feeds.map(feed => {
      const row = [feed.id, feed.name, feed.cost, feed.unit];
      nutritionKeys.forEach(key => row.push(feed.nutritions[key] || 0));
      return row;
    });
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', '飼料データ.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download purchases as CSV
  const downloadPurchasesAsCSV = () => {
    const headers = ['ID', '飼料名', '数量', '配合比率', '購入日', 'コスト'];
    
    const rows = purchases.map(purchase => {
      const feed = feeds.find(f => f.id === purchase.feedId);
      const feedName = feed ? feed.name : '不明';
      const cost = feed ? feed.cost * purchase.quantity : 0;
      
      return [
        purchase.id,
        feedName,
        purchase.quantity,
        purchase.feedingRatio,
        purchase.purchaseDate,
        cost
      ];
    });
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', '購入履歴.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download nutrition data as CSV
  const downloadNutritionDataAsCSV = () => {
    const nutritionData = calculateNutritionData(getMonthlyPurchases(currentMonth));
    
    const headers = ['栄養成分', '含有率(%)'];
    const rows = nutritionData.map(item => [item.name, item.value]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', '栄養成分データ.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download all data as JSON
  const downloadAllDataAsJSON = () => {
    const allData = {
      lastSync,
      feeds,
      purchases,
      inventoryItems,
      eggData,
      flocks,
      notifications,
      customNutritions,
      visibleNutritions
    };
    
    const jsonContent = JSON.stringify(allData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', '養鶏管理データ.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Competitor analysis data
  const [showCompetitors, setShowCompetitors] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState('comp1');
  
  // Toggle competitors view
  const toggleCompetitorsView = () => {
    setShowCompetitors(!showCompetitors);
  };
  
  // Competitor data
  const competitors = [
    {
      id: 'comp1',
      name: 'A社',
      feeds: [
        { 
          name: 'プレミアム配合飼料',
          cost: 5200,
          nutritions: { protein: 19, fat: 4.5, fiber: 7.5, calcium: 1.1, umami: 2.2, amino: 15 }
        },
        { 
          name: '有機牧草',
          cost: 3300,
          nutritions: { protein: 13, fat: 2.2, fiber: 23, calcium: 0.6, umami: 1.3, amino: 9.5 }
        }
      ]
    },
    {
      id: 'comp2',
      name: 'B社',
      feeds: [
        { 
          name: 'エコノミー配合飼料',
          cost: 4800,
          nutritions: { protein: 17, fat: 3.8, fiber: 8.2, calcium: 0.9, umami: 2.0, amino: 13 }
        },
        { 
          name: '輸入牧草',
          cost: 2800,
          nutritions: { protein: 11, fat: 1.8, fiber: 21, calcium: 0.45, umami: 1.0, amino: 8.5 }
        }
      ]
    }
  ];

  // Calculate monthly nutrition contribution data
  const nutritionContributionData = calculateNutritionContribution(currentMonth);

  return (
    <FarmContext.Provider value={{
      userId,
      feeds,
      setFeeds,
      addFeed,
      updateFeed,
      deleteFeed,
      sortFeeds,
      sortConfig,
      getSortedFeeds,
      
      purchases,
      setPurchases,
      addPurchase,
      deletePurchase,
      getMonthlyPurchases,
      
      inventoryItems,
      setInventoryItems,
      updateInventoryItem,
      
      months,
      currentMonth,
      setMonth,
      
      eggData,
      updateEggData,
      
      flocks,
      
      notifications,
      showNotifications,
      toggleNotifications,
      markAsRead,
      markAllAsRead,
      
      syncData,
      lastSync,
      
      totalHens,
      dailyEggProduction,
      
      feedRequirements,
      
      currentMonthFeedCost,
      projectedProfit,
      profitMargin,
      
      feedDistribution,
      nutritionData,
      nutritionContributionData,
      calculateNutritionData,
      
      activeTabs,
      changeTab,
      
      calculateTotalCost,
      
      visibleNutritions,
      toggleNutritionVisibility,
      newNutritionName,
      setNewNutritionName,
      addCustomNutrition,
      customNutritions,
      getNutritionLabel,
      deleteNutrition,
      
      showNutritionInfo,
      setShowNutritionInfo,
      nutritionBenefits,
      
      downloadFeedsAsCSV,
      downloadPurchasesAsCSV,
      downloadNutritionDataAsCSV,
      downloadAllDataAsJSON,
      
      showCompetitors,
      selectedCompetitor,
      setSelectedCompetitor,
      toggleCompetitorsView,
      competitors,
      
      COLORS
    }}>
      {children}
    </FarmContext.Provider>
  );
} 