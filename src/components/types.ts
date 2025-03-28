// Feed types
export interface Feed {
  id: number;
  name: string;
  cost: number;
  unit: string;
  nutritions: {
    protein: number;
    fat: number;
    fiber: number;
    calcium: number;
    umami: number;
    amino: number;
    [key: string]: number;
  };
}

// Inventory types
export interface InventoryItem {
  id: number;
  name: string;
  currentStock: number;
  optimalLevel: number;
  unit: string;
  cost: number;
  dailyUsage: number;
  daysRemaining: number;
  status: 'critical' | 'warning' | 'normal';
}

// Feed distribution types
export interface FeedDistributionItem {
  name: string;
  value: number;
}

// Nutrition data types
export interface NutritionDataItem {
  name: string;
  value: number;
}

// Egg data types
export interface EggData {
  eggCount: number;
  eggPrice: number;
}

// Flock types
export interface Flock {
  id: number;
  name: string;
  birdCount: number;
  ageWeeks: number;
}

// Active tabs types
export interface ActiveTabs {
  poultry: 'economic' | 'health' | 'production' | 'system' | 'dashboard';
  inventory: 'inventory';
}

// Form data types
export interface FormData {
  feedId: number;
  quantity: number | string;
  feedingRatio: number | string;
  purchaseDate: string;
  type: 'add' | 'remove';
}

// Event types
export interface InputChangeEvent {
  target: {
    name: string;
    value: string;
  };
}

export interface Notification {
  id: number;
  type: 'system' | 'inventory' | 'production';
  message: string;
  date: string;
  read: boolean;
}

export interface FeedRequirements {
  dailyUsage: {
    [key: string]: number;
  };
}

export interface InventoryAdjustment {
  type: 'add' | 'remove' | 'subtract' | 'set';
  quantity: number;
  notes?: string;
}

export interface CompetitorEgg {
  id: number;
  companyName: string;
  price: number;
  nutritionData: {
    protein: number;
    calcium: number;
  };
  evaluation: {
    taste: number;
    freshness: number;
  };
}

export interface FarmContextType {
  // Core data
  feeds: Feed[];
  purchases: any[];
  inventoryItems: InventoryItem[];
  flocks: Flock[];
  notifications: Notification[];
  
  // Display state
  activeTabs: ActiveTabs;
  showNotifications: boolean;
  visibleNutritions: {[key: string]: boolean};
  
  // Statistics & Metrics
  totalHens: number;
  dailyEggProduction: number;
  currentMonthFeedCost: number;
  projectedProfit: number;
  profitMargin: number;
  eggData: EggData;
  feedDistribution: FeedDistributionItem[];
  nutritionData: NutritionDataItem[];
  nutritionContributionData: any[];
  
  // Settings & Configuration
  lastSync: string;
  currentMonth: number;
  months: string[];
  feedRequirements: FeedRequirements;
  COLORS: string[];
  userId: string;
  
  // State setters
  setFeeds: React.Dispatch<React.SetStateAction<Feed[]>>;
  setPurchases: React.Dispatch<React.SetStateAction<any[]>>;
  setInventoryItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  setMonth: (month: number) => void;
  
  // Core functions
  syncData: () => void;
  updateEggData: (data: EggData) => void;
  calculateTotalCost: (month: number) => number;
  getMonthlyPurchases: (monthIndex: number) => any[];
  addPurchase: (purchase: any) => void;
  deletePurchase: (id: number) => void;
  addFeed: (feed: Omit<Feed, 'id'>) => void;
  updateFeed: (id: number, feed: Omit<Feed, 'id'>) => void;
  deleteFeed: (id: number) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  toggleNotifications: () => void;
  updateInventoryItem: (id: number, adjustment: InventoryAdjustment) => void;
  changeTab: (system: keyof ActiveTabs, tab: string) => void;
  
  // Sorting & filtering
  sortFeeds: (field: string, direction: 'ascending' | 'descending') => void;
  sortConfig: { field: string; direction: 'ascending' | 'descending' };
  getSortedFeeds: () => Feed[];
  
  // Nutrition management
  toggleNutritionVisibility: (key: string) => void;
  newNutritionName: string;
  setNewNutritionName: React.Dispatch<React.SetStateAction<string>>;
  addCustomNutrition: (name: string) => void;
  customNutritions: string[];
  getNutritionLabel: (key: string) => string;
  deleteNutrition: (key: string) => void;
  showNutritionInfo: boolean;
  setShowNutritionInfo: React.Dispatch<React.SetStateAction<boolean>>;
  nutritionBenefits: {[key: string]: string};
  calculateNutritionContribution: (monthIndex: number) => any[];
  calculateNutritionData: (monthPurchases: any[]) => any[];
  
  // Export functions
  downloadFeedsAsCSV: () => void;
  downloadPurchasesAsCSV: () => void;
  downloadNutritionDataAsCSV: () => void;
  downloadAllDataAsJSON: () => void;
  
  // Competitor analysis
  showCompetitors: boolean;
  selectedCompetitor: string;
  setSelectedCompetitor: React.Dispatch<React.SetStateAction<string>>;
  toggleCompetitorsView: () => void;
  competitors: any[];
} 