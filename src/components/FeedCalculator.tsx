import React, { useContext, useState } from 'react';
import { FarmContext } from '../contexts/FarmContext';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Box,
  Chip,
  Switch,
  FormControlLabel,
  Divider
} from '@material-ui/core';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  GetApp as DownloadIcon,
  Info as InfoIcon,
  Compare as CompareIcon,
  Cached as SyncIcon
} from '@material-ui/icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`feed-tabpanel-${index}`}
      aria-labelledby={`feed-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

const FeedCalculator: React.FC = () => {
  const {
    feeds,
    purchases,
    currentMonth,
    months,
    eggData,
    currentMonthFeedCost,
    COLORS,
    competitors,
    showCompetitors,
    selectedCompetitor,
    visibleNutritions,
    customNutritions,
    nutritionBenefits,
    newNutritionName,
    
    // 計算関数
    calculateEggCost,
    calculateBreakEvenPoint,
    calculateEggProfit,
    calculateProfitMargin,
    calculateFeedCostPercentage,
    calculateNutritionContribution,
    getNutritionLabel,
    
    // データ操作関数
    addPurchase,
    deletePurchase,
    addFeed,
    updateFeed,
    deleteFeed,
    updateEggData,
    getMonthlyPurchases,
    calculateTotalCost,
    addCustomNutrition,
    deleteNutrition,
    toggleNutritionVisibility,
    setNewNutritionName,
    sortFeeds,
    getSortedFeeds,
    toggleCompetitorsView,
    setSelectedCompetitor,
    
    // データエクスポート関数
    downloadFeedsAsCSV,
    downloadPurchasesAsCSV,
    downloadAllDataAsJSON,
    downloadNutritionDataAsCSV
  } = useContext(FarmContext);

  // タブ管理
  const [tabValue, setTabValue] = useState(0);
  
  // ダイアログ管理
  const [openFeedDialog, setOpenFeedDialog] = useState(false);
  const [openPurchaseDialog, setOpenPurchaseDialog] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState<any>(null);
  
  // クイック入力セクションの表示状態
  const [showQuickInput, setShowQuickInput] = useState(true);
  
  // 飼料データフォーム
  const [newFeed, setNewFeed] = useState({
    name: '',
    cost: '',
    unit: 'kg',
    nutritions: {
      protein: '',
      fat: '',
      fiber: '',
      calcium: '',
      umami: '',
      amino: ''
    }
  });
  
  // 購入データフォーム
  const [newPurchase, setNewPurchase] = useState({
    feedId: '',
    quantity: '',
    feedingRatio: '100',
    purchaseDate: new Date().toISOString().split('T')[0]
  });
  
  // 栄養成分詳細情報の表示状態
  const [showNutritionInfo, setShowNutritionInfo] = useState(false);
  
  // タブ切り替え処理
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  // 飼料ダイアログを開く
  const handleOpenFeedDialog = (feed?: any) => {
    if (feed) {
      setSelectedFeed(feed);
      setNewFeed({
        name: feed.name,
        cost: feed.cost.toString(),
        unit: feed.unit,
        nutritions: {
          protein: feed.nutritions.protein.toString(),
          fat: feed.nutritions.fat.toString(),
          fiber: feed.nutritions.fiber.toString(),
          calcium: feed.nutritions.calcium.toString(),
          umami: feed.nutritions.umami.toString(),
          amino: feed.nutritions.amino.toString()
        }
      });
    } else {
      setSelectedFeed(null);
      setNewFeed({
        name: '',
        cost: '',
        unit: 'kg',
        nutritions: {
          protein: '',
          fat: '',
          fiber: '',
          calcium: '',
          umami: '',
          amino: ''
        }
      });
    }
    setOpenFeedDialog(true);
  };

  // 飼料ダイアログを閉じる
  const handleCloseFeedDialog = () => {
    setOpenFeedDialog(false);
    setSelectedFeed(null);
  };

  // 購入ダイアログを開く
  const handleOpenPurchaseDialog = () => {
    setNewPurchase({
      feedId: feeds.length > 0 ? feeds[0].id.toString() : '',
      quantity: '100',
      feedingRatio: '100',
      purchaseDate: new Date().toISOString().split('T')[0]
    });
    setOpenPurchaseDialog(true);
  };

  // 購入ダイアログを閉じる
  const handleClosePurchaseDialog = () => {
    setOpenPurchaseDialog(false);
  };

  // 飼料データを保存
  const handleSaveFeed = () => {
    const feedData = {
      name: newFeed.name,
      cost: parseFloat(newFeed.cost),
      unit: newFeed.unit,
      nutritions: {
        protein: parseFloat(newFeed.nutritions.protein),
        fat: parseFloat(newFeed.nutritions.fat),
        fiber: parseFloat(newFeed.nutritions.fiber),
        calcium: parseFloat(newFeed.nutritions.calcium),
        umami: parseFloat(newFeed.nutritions.umami),
        amino: parseFloat(newFeed.nutritions.amino)
      }
    };

    if (selectedFeed) {
      updateFeed(selectedFeed.id, feedData);
    } else {
      addFeed(feedData);
    }

    handleCloseFeedDialog();
  };

  // 購入データを保存
  const handleSavePurchase = () => {
    addPurchase({
      feedId: parseInt(newPurchase.feedId),
      quantity: parseFloat(newPurchase.quantity),
      feedingRatio: parseFloat(newPurchase.feedingRatio),
      purchaseDate: newPurchase.purchaseDate
    });

    handleClosePurchaseDialog();
  };
  
  // 新しい栄養成分を追加
  const handleAddNutrition = () => {
    if (addCustomNutrition(newNutritionName)) {
      setNewNutritionName('');
    } else {
      alert('この栄養成分は既に存在します');
    }
  };
  
  // フォーム入力の処理
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'eggCount' || name === 'eggPrice') {
      updateEggData({
        ...eggData,
        [name]: parseFloat(value) || 0
      });
    } else if (name.startsWith('nutrition_')) {
      const nutritionName = name.replace('nutrition_', '');
      setNewFeed({
        ...newFeed,
        nutritions: {
          ...newFeed.nutritions,
          [nutritionName]: value
        }
      });
    } else if (name === 'newNutritionName') {
      setNewNutritionName(value);
    } else if (name === 'feedId' || name === 'quantity' || name === 'feedingRatio') {
      setNewPurchase({
        ...newPurchase,
        [name]: value
      });
    } else if (name === 'purchaseDate') {
      setNewPurchase({
        ...newPurchase,
        purchaseDate: value
      });
    } else {
      setNewFeed({
        ...newFeed,
        [name]: value
      });
    }
  };
  
  // クイック数量設定
  const handleQuickQuantity = (quantity) => {
    setNewPurchase({
      ...newPurchase,
      quantity: quantity.toString()
    });
  };
  
  // クイック飼料設定
  const handleQuickFeed = (feedId) => {
    setNewPurchase({
      ...newPurchase,
      feedId: feedId.toString()
    });
  };
  
  // 現在の月のデータを取得
  const monthlyPurchases = getMonthlyPurchases(currentMonth);
  const eggCost = calculateEggCost();
  const totalCost = calculateTotalCost(currentMonth);
  const breakEvenPoint = calculateBreakEvenPoint();
  const eggProfit = calculateEggProfit();
  const profitMargin = calculateProfitMargin();
  
  // 月別コストデータ（グラフ用）
  const monthlyCostData = months.map((_, index) => ({
    month: months[index],
    cost: calculateTotalCost(index)
  }));
  
  // 現在の月のコスト割合データ（パイチャート用）
  const costPercentageData = calculateFeedCostPercentage(currentMonth);
  
  // 栄養成分の寄与度分析
  const nutritionContributionData = calculateNutritionContribution();

  return (
    <Container maxWidth="lg" className="mt-4">
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
        className="mb-3"
      >
        <Tab label="コスト分析" />
        <Tab label="飼料管理" />
        <Tab label="栄養分析" />
        <Tab label="競合分析" />
        <Tab label="データ管理" />
      </Tabs>
      
      {/* コスト分析タブ */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* サマリーカード */}
          <Grid item xs={12} md={3}>
            <Paper className="p-4">
              <Typography variant="h6" gutterBottom>
                今月の飼料コスト
              </Typography>
              <Typography variant="h4">
                ¥{currentMonthFeedCost.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper className="p-4">
              <Typography variant="h6" gutterBottom>
                卵1個あたりのコスト
              </Typography>
              <Typography variant="h4">
                ¥{eggCost.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper className="p-4">
              <Typography variant="h6" gutterBottom>
                総コスト
              </Typography>
              <Typography variant="h4">
                ¥{totalCost.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper className="p-4">
              <Typography variant="h6" gutterBottom>
                予想利益率
              </Typography>
              <Typography variant="h4" className={profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}>
                {profitMargin.toFixed(1)}%
              </Typography>
            </Paper>
          </Grid>

          {/* 卵コスト計算セクション */}
          <Grid item xs={12} md={6}>
            <Paper className="p-4">
              <Typography variant="h6" gutterBottom>
                卵生産データ
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="卵の産卵数（個）"
                    type="number"
                    name="eggCount"
                    value={eggData.eggCount}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="卵の販売価格（円/個）"
                    type="number"
                    name="eggPrice"
                    value={eggData.eggPrice}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <div className="mt-4 bg-gray-50 p-3 rounded">
                <h3 className="font-medium mb-2">計算結果（{months[currentMonth]}）</h3>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between">
                    <span>総飼料コスト:</span>
                    <span className="font-medium">¥{totalCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>卵1個あたりのコスト:</span>
                    <span className="font-medium">¥{eggData.eggCount > 0 ? eggCost.toFixed(2) : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>損益分岐点（必要卵数）:</span>
                    <span className="font-medium">{eggData.eggPrice > 0 ? breakEvenPoint.toLocaleString() : '-'}個</span>
                  </div>
                  <div className="flex justify-between">
                    <span>予想売上:</span>
                    <span className="font-medium">¥{(eggData.eggCount * eggData.eggPrice).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>予想利益:</span>
                    <span className={`font-medium ${eggProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ¥{eggProfit.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>予想利益率:</span>
                    <span className={`font-medium ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {profitMargin.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </Paper>
          </Grid>
          
          {/* 飼料コスト割合 */}
          <Grid item xs={12} md={6}>
            <Paper className="p-4">
              <Typography variant="h6" gutterBottom>
                {months[currentMonth]}の飼料コスト割合
              </Typography>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={costPercentageData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {costPercentageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip formatter={(value) => [`¥${value.toLocaleString()}`, '飼料コスト']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Paper>
          </Grid>

          {/* 月別コストグラフ */}
          <Grid item xs={12}>
            <Paper className="p-4">
              <Typography variant="h6" gutterBottom>
                月別飼料コスト推移
              </Typography>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyCostData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip formatter={(value) => [`¥${value.toLocaleString()}`, '飼料コスト']} />
                    <Legend />
                    <Line type="monotone" dataKey="cost" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* 飼料管理タブ */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {/* クイック入力セクション */}
          <Grid item xs={12}>
            <Paper className="p-4">
              <div className="flex justify-between items-center mb-3">
                <Typography variant="h6">
                  クイック入力
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showQuickInput}
                      onChange={() => setShowQuickInput(!showQuickInput)}
                      color="primary"
                    />
                  }
                  label="表示"
                />
              </div>
              
              {showQuickInput && (
                <div>
                  <div className="mb-4">
                    <Typography variant="subtitle2" gutterBottom>
                      よく使う飼料
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                      {feeds.map(feed => (
                        <Chip
                          key={feed.id}
                          label={feed.name}
                          onClick={() => handleQuickFeed(feed.id)}
                          color={newPurchase.feedId === feed.id.toString() ? "primary" : "default"}
                          className="mb-1"
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Typography variant="subtitle2" gutterBottom>
                      よく使う数量
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                      {[50, 100, 250, 500, 1000].map(qty => (
                        <Chip
                          key={qty}
                          label={`${qty}kg`}
                          onClick={() => handleQuickQuantity(qty)}
                          color={newPurchase.quantity === qty.toString() ? "primary" : "default"}
                          className="mb-1"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Paper>
          </Grid>
          
          {/* 飼料購入フォーム */}
          <Grid item xs={12} md={6}>
            <Paper className="p-4">
              <Typography variant="h6" gutterBottom>
                飼料購入の登録
              </Typography>
              <form onSubmit={(e) => { e.preventDefault(); handleSavePurchase(); }} className="space-y-3">
                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel>飼料の種類</InputLabel>
                  <Select
                    name="feedId"
                    value={newPurchase.feedId}
                    onChange={handleInputChange}
                    label="飼料の種類"
                  >
                    {feeds.map(feed => (
                      <MenuItem key={feed.id} value={feed.id.toString()}>
                        {feed.name} (¥{feed.cost.toLocaleString()}/{feed.unit})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  label="数量 (kg)"
                  type="number"
                  name="quantity"
                  value={newPurchase.quantity}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
                
                <TextField
                  label="配合比率 (%)"
                  type="number"
                  name="feedingRatio"
                  value={newPurchase.feedingRatio}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  helperText="複数の飼料を混合する場合の割合"
                />
                
                <TextField
                  label="購入日"
                  type="date"
                  name="purchaseDate"
                  value={newPurchase.purchaseDate}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<AddIcon />}
                >
                  購入記録を追加
                </Button>
              </form>
            </Paper>
          </Grid>
          
          {/* 飼料一覧 */}
          <Grid item xs={12} md={6}>
            <Paper className="p-4">
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h6">
                  飼料一覧
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenFeedDialog()}
                >
                  新規飼料
                </Button>
              </div>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <button onClick={() => sortFeeds('name')} className="font-bold">
                          飼料名 {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </button>
                      </TableCell>
                      <TableCell align="right">
                        <button onClick={() => sortFeeds('cost')} className="font-bold">
                          単価 {sortConfig.key === 'cost' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </button>
                      </TableCell>
                      <TableCell align="right">操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getSortedFeeds().map((feed) => (
                      <TableRow key={feed.id}>
                        <TableCell>{feed.name}</TableCell>
                        <TableCell align="right">¥{feed.cost.toLocaleString()}/{feed.unit}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleOpenFeedDialog(feed)} size="small">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => deleteFeed(feed.id)} size="small">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          
          {/* 現在の月の購入リスト */}
          <Grid item xs={12}>
            <Paper className="p-4">
              <Typography variant="h6" gutterBottom>
                {months[currentMonth]}の飼料購入リスト
              </Typography>
              {monthlyPurchases.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>飼料名</TableCell>
                        <TableCell align="right">数量(kg)</TableCell>
                        <TableCell align="right">単価(円/kg)</TableCell>
                        <TableCell align="right">合計(円)</TableCell>
                        <TableCell align="right">配合比率(%)</TableCell>
                        <TableCell align="right">購入日</TableCell>
                        <TableCell align="right">操作</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {monthlyPurchases.map(purchase => {
                        const feed = feeds.find(f => f.id === purchase.feedId);
                        return (
                          <TableRow key={purchase.id}>
                            <TableCell>{feed ? feed.name : '不明'}</TableCell>
                            <TableCell align="right">{purchase.quantity.toLocaleString()}</TableCell>
                            <TableCell align="right">{feed ? feed.cost.toLocaleString() : 0}</TableCell>
                            <TableCell align="right">{feed ? (feed.cost * purchase.quantity).toLocaleString() : 0}</TableCell>
                            <TableCell align="right">{purchase.feedingRatio}%</TableCell>
                            <TableCell align="right">{new Date(purchase.purchaseDate).toLocaleDateString()}</TableCell>
                            <TableCell align="right">
                              <IconButton onClick={() => deletePurchase(purchase.id)} size="small">
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                    <tfoot>
                      <tr className="bg-gray-100">
                        <TableCell colSpan={3} align="right" className="font-bold">合計:</TableCell>
                        <TableCell align="right" className="font-bold">¥{totalCost.toLocaleString()}</TableCell>
                        <TableCell colSpan={3}></TableCell>
                      </tr>
                    </tfoot>
                  </Table>
                </TableContainer>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  購入データがありません
                </div>
              )}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* 栄養分析タブ */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {/* 栄養成分管理 */}
          <Grid item xs={12}>
            <Paper className="p-4">
              <Typography variant="h6" gutterBottom>
                栄養成分の管理
              </Typography>
              <div className="mb-4">
                <div className="flex space-x-2 mb-4">
                  <TextField
                    variant="outlined"
                    size="small"
                    value={newNutritionName}
                    onChange={(e) => handleInputChange({ target: { name: 'newNutritionName', value: e.target.value } })}
                    placeholder="新しい栄養成分名"
                    className="flex-grow"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddNutrition}
                    disabled={!newNutritionName.trim()}
                  >
                    追加
                  </Button>
                </div>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={showNutritionInfo}
                      onChange={() => setShowNutritionInfo(!showNutritionInfo)}
                      color="primary"
                    />
                  }
                  label="栄養成分の情報を表示"
                />
                
                {showNutritionInfo && (
                  <div className="mt-3 mb-4 bg-blue-50 p-3 rounded border border-blue-200">
                    <Typography variant="subtitle1" gutterBottom>
                      栄養成分の健康メリット
                    </Typography>
                    <ul className="pl-5 list-disc">
                      {Object.entries(nutritionBenefits).map(([key, value]) => (
                        <li key={key} className="mb-1">{value}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <Typography variant="subtitle1" className="mt-4 mb-2">
                  表示する栄養成分
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(visibleNutritions).map(([key, isVisible]) => {
                    // カスタム栄養成分の表示名を取得
                    const displayName = getNutritionLabel(key);
                    const isCustom = !Object.keys(nutritionBenefits).includes(key);
                    
                    return (
                      <div key={key} className="mb-2">
                        <Chip
                          label={displayName}
                          color={isVisible ? "primary" : "default"}
                          onClick={() => toggleNutritionVisibility(key)}
                          onDelete={isCustom ? () => deleteNutrition(key) : undefined}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </Paper>
          </Grid>
          
          {/* 栄養成分分析 */}
          <Grid item xs={12} md={6}>
            <Paper className="p-4">
              <Typography variant="h6" gutterBottom>
                {months[currentMonth]}の栄養成分分析
              </Typography>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={nutritionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip formatter={(value) => [`${value.toFixed(2)}%`, '含有率']} />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="含有率(%)">
                      {nutritionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Paper>
          </Grid>
          
          {/* 飼料の栄養影響度 */}
          <Grid item xs={12} md={6}>
            <Paper className="p-4">
              <Typography variant="h6" gutterBottom>
                各飼料の栄養寄与度
              </Typography>
              {nutritionContributionData.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>飼料名</TableCell>
                        {Object.entries(visibleNutritions)
                          .filter(([_, isVisible]) => isVisible)
                          .map(([key]) => (
                            <TableCell key={key} align="right">
                              {getNutritionLabel(key)}
                            </TableCell>
                          ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {nutritionContributionData.map((contribution, index) => (
                        <TableRow key={index}>
                          <TableCell>{contribution.name}</TableCell>
                          {Object.entries(visibleNutritions)
                            .filter(([_, isVisible]) => isVisible)
                            .map(([key]) => (
                              <TableCell key={key} align="right">
                                {contribution[key] ? `${contribution[key]}%` : '-'}
                              </TableCell>
                            ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  データがありません
                </div>
              )}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* 競合分析タブ */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className="p-4">
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h6">
                  競合他社の飼料分析
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CompareIcon />}
                  onClick={toggleCompetitorsView}
                >
                  {showCompetitors ? '分析を非表示' : '分析を表示'}
                </Button>
              </div>
              
              {showCompetitors && (
                <div>
                  <FormControl variant="outlined" className="mb-4" fullWidth>
                    <InputLabel>競合企業</InputLabel>
                    <Select
                      value={selectedCompetitor}
                      onChange={(e) => setSelectedCompetitor(e.target.value)}
                      label="競合企業"
                    >
                      {competitors.map(comp => (
                        <MenuItem key={comp.id} value={comp.id}>{comp.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>飼料名</TableCell>
                          <TableCell align="right">価格 (円/kg)</TableCell>
                          {Object.entries(visibleNutritions)
                            .filter(([_, isVisible]) => isVisible)
                            .map(([key]) => (
                              <TableCell key={key} align="right">
                                {getNutritionLabel(key)}
                              </TableCell>
                            ))}
                          <TableCell align="right">価格差</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {competitors.find(c => c.id === selectedCompetitor)?.feeds.map((feed, idx) => {
                          // 類似した自社飼料を探す
                          const similarFeed = feeds.find(f => 
                            f.nutritions.protein >= feed.nutritions.protein * 0.9 && 
                            f.nutritions.protein <= feed.nutritions.protein * 1.1
                          );
                          const priceDiff = similarFeed ? 
                            ((similarFeed.cost - feed.cost) / feed.cost * 100).toFixed(1) + '%' :
                            '-';
                          
                          return (
                            <TableRow key={idx}>
                              <TableCell>{feed.name}</TableCell>
                              <TableCell align="right">¥{feed.cost.toLocaleString()}</TableCell>
                              {Object.entries(visibleNutritions)
                                .filter(([_, isVisible]) => isVisible)
                                .map(([key]) => (
                                  <TableCell key={key} align="right">
                                    {feed.nutritions[key] !== undefined ? `${feed.nutritions[key].toFixed(1)}%` : '-'}
                                  </TableCell>
                                ))}
                              <TableCell 
                                align="right"
                                className={
                                  priceDiff !== '-' && 
                                  parseFloat(priceDiff) < 0 ? 
                                  'text-green-600 font-bold' : 
                                  parseFloat(priceDiff) > 0 ? 
                                  'text-red-600 font-bold' : ''
                                }
                              >
                                {priceDiff}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* データ管理タブ */}
      <TabPanel value={tabValue} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className="p-4">
              <Typography variant="h6" gutterBottom>
                データのダウンロード
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<DownloadIcon />}
                    onClick={downloadFeedsAsCSV}
                  >
                    飼料データ (CSV)
                  </Button>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    startIcon={<DownloadIcon />}
                    onClick={downloadPurchasesAsCSV}
                  >
                    購入履歴 (CSV)
                  </Button>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button
                    variant="contained"
                    style={{ backgroundColor: '#8884d8', color: 'white' }}
                    fullWidth
                    startIcon={<DownloadIcon />}
                    onClick={downloadNutritionDataAsCSV}
                  >
                    栄養成分データ (CSV)
                  </Button>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button
                    variant="contained"
                    style={{ backgroundColor: '#333', color: 'white' }}
                    fullWidth
                    startIcon={<DownloadIcon />}
                    onClick={downloadAllDataAsJSON}
                  >
                    すべてのデータ (JSON)
                  </Button>
                </Grid>
              </Grid>
              <Divider className="my-4" />
              <Typography variant="subtitle1" gutterBottom>
                データのバックアップとリストア
              </Typography>
              <Typography variant="body2" className="mb-3 text-gray-600">
                「すべてのデータ」をダウンロードすることで、現在の状態をバックアップできます。
                このJSONファイルはシステム管理者がデータの復元に使用できます。
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<SyncIcon />}
                onClick={() => window.confirm('データを同期しますか？') && syncData()}
              >
                データを最新の状態に同期
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* 飼料追加/編集ダイアログ */}
      <Dialog open={openFeedDialog} onClose={handleCloseFeedDialog} maxWidth="md" fullWidth>
        <DialogTitle>{selectedFeed ? '飼料の編集' : '新規飼料の追加'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="飼料名"
            type="text"
            fullWidth
            variant="outlined"
            value={newFeed.name}
            onChange={handleInputChange}
          />
          <Grid container spacing={2} className="mt-1">
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="cost"
                label="コスト (円/kg)"
                type="number"
                fullWidth
                variant="outlined"
                value={newFeed.cost}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="dense" variant="outlined">
                <InputLabel>単位</InputLabel>
                <Select
                  name="unit"
                  value={newFeed.unit as any}
                  onChange={handleInputChange}
                  label="単位"
                >
                  <MenuItem value="kg">kg</MenuItem>
                  <MenuItem value="g">g</MenuItem>
                  <MenuItem value="t">t</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Typography variant="subtitle1" className="mt-3 mb-2">
            栄養成分 (%)
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(visibleNutritions)
              .filter(([_, isVisible]) => isVisible)
              .map(([key]) => (
                <Grid item xs={6} md={4} key={key}>
                  <TextField
                    margin="dense"
                    name={`nutrition_${key}`}
                    label={getNutritionLabel(key)}
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={newFeed.nutritions[key]}
                    onChange={handleInputChange}
                  />
                </Grid>
              ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFeedDialog} color="default">
            キャンセル
          </Button>
          <Button onClick={handleSaveFeed} color="primary" variant="contained">
            {selectedFeed ? '更新' : '追加'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 購入追加ダイアログ */}
      <Dialog open={openPurchaseDialog} onClose={handleClosePurchaseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>飼料購入の登録</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" variant="outlined">
            <InputLabel>飼料の種類</InputLabel>
            <Select
              name="feedId"
              value={newPurchase.feedId}
              onChange={handleInputChange}
              label="飼料の種類"
            >
              {feeds.map((feed) => (
                <MenuItem key={feed.id} value={feed.id}>
                  {feed.name} (¥{feed.cost.toLocaleString()}/{feed.unit})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            margin="dense"
            name="quantity"
            label="数量 (kg)"
            type="number"
            fullWidth
            variant="outlined"
            value={newPurchase.quantity}
            onChange={handleInputChange}
          />
          
          <TextField
            margin="dense"
            name="feedingRatio"
            label="配合比率 (%)"
            type="number"
            fullWidth
            variant="outlined"
            value={newPurchase.feedingRatio}
            onChange={handleInputChange}
            helperText="複数の飼料を混合する場合の割合"
          />
          
          <TextField
            margin="dense"
            name="purchaseDate"
            label="購入日"
            type="date"
            fullWidth
            variant="outlined"
            value={newPurchase.purchaseDate}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePurchaseDialog} color="default">
            キャンセル
          </Button>
          <Button onClick={handleSavePurchase} color="primary" variant="contained">
            追加
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FeedCalculator; 