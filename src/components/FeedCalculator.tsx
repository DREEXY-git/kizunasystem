import React, { useState, useContext } from 'react';
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
  Box
} from '@material-ui/core';
import { AddCircle as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';
import { FarmContext } from '../contexts/FarmContext';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`feedcalc-tabpanel-${index}`}
      aria-labelledby={`feedcalc-tab-${index}`}
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

const FeedCalculator = () => {
  const { 
    feeds, 
    purchases, 
    addFeed, 
    updateFeed, 
    deleteFeed, 
    addPurchase, 
    updatePurchase, 
    deletePurchase,
    calculateTotalCost,
    calculateEggCost,
    calculateBreakEvenPoint,
    calculateFeedCostPercentage,
    calculateEggProfit,
    calculateProfitMargin,
    feedDistribution,
    eggData,
    updateEggData,
    currentMonth,
    activeTabs,
    changeTab
  } = useContext(FarmContext);

  const [openFeedDialog, setOpenFeedDialog] = useState(false);
  const [openPurchaseDialog, setOpenPurchaseDialog] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  
  const [newFeed, setNewFeed] = useState({
    name: '',
    cost: 0,
    unit: 'kg',
    nutritions: {
      protein: 0,
      fat: 0,
      fiber: 0,
      calcium: 0,
      phosphorus: 0
    }
  });
  
  const [newPurchase, setNewPurchase] = useState({
    feedId: '',
    quantity: 0,
    purchaseDate: new Date().toISOString().split('T')[0],
    feedingRatio: 100
  });

  const [currentTab, setCurrentTab] = useState(0);
  
  const monthNames = [
    "1月", "2月", "3月", "4月", "5月", "6月",
    "7月", "8月", "9月", "10月", "11月", "12月"
  ];

  const handleTabChange = (event, newValue) => {
    changeTab('feedCalc', newValue);
  };

  const handleOpenFeedDialog = (feed = null) => {
    if (feed) {
      setSelectedFeed(feed);
      setNewFeed({
        name: feed.name,
        cost: feed.cost,
        unit: feed.unit,
        nutritions: { ...feed.nutritions }
      });
    } else {
      setSelectedFeed(null);
      setNewFeed({
        name: '',
        cost: 0,
        unit: 'kg',
        nutritions: {
          protein: 0,
          fat: 0,
          fiber: 0,
          calcium: 0,
          phosphorus: 0
        }
      });
    }
    setOpenFeedDialog(true);
  };

  const handleCloseFeedDialog = () => {
    setOpenFeedDialog(false);
  };

  const handleOpenPurchaseDialog = (purchase = null) => {
    if (purchase) {
      setSelectedPurchase(purchase);
      setNewPurchase({
        feedId: purchase.feedId,
        quantity: purchase.quantity,
        purchaseDate: purchase.purchaseDate,
        feedingRatio: purchase.feedingRatio || 100
      });
    } else {
      setSelectedPurchase(null);
      setNewPurchase({
        feedId: feeds.length > 0 ? feeds[0].id : '',
        quantity: 0,
        purchaseDate: new Date().toISOString().split('T')[0],
        feedingRatio: 100
      });
    }
    setOpenPurchaseDialog(true);
  };

  const handleClosePurchaseDialog = () => {
    setOpenPurchaseDialog(false);
  };

  const handleSaveFeed = () => {
    if (selectedFeed) {
      updateFeed(selectedFeed.id, newFeed);
    } else {
      addFeed(newFeed);
    }
    handleCloseFeedDialog();
  };

  const handleSavePurchase = () => {
    if (selectedPurchase) {
      updatePurchase(selectedPurchase.id, newPurchase);
    } else {
      addPurchase(newPurchase);
    }
    handleClosePurchaseDialog();
  };

  const handleNutritionChange = (key, value) => {
    setNewFeed({
      ...newFeed,
      nutritions: {
        ...newFeed.nutritions,
        [key]: parseFloat(value) || 0
      }
    });
  };

  const handleDeleteFeed = (feedId) => {
    if (window.confirm('この飼料を削除してもよろしいですか？')) {
      deleteFeed(feedId);
    }
  };

  const handleDeletePurchase = (purchaseId) => {
    if (window.confirm('この購入記録を削除してもよろしいですか？')) {
      deletePurchase(purchaseId);
    }
  };

  const monthlyFeedCost = calculateTotalCost(currentMonth);
  const eggUnitCost = calculateEggCost();
  const breakEvenPoint = calculateBreakEvenPoint();
  const projectedProfit = calculateEggProfit();
  const profitMargin = calculateProfitMargin();

  const FEED_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <Container>
      <Typography variant="h4" gutterBottom style={{ marginTop: 20, marginBottom: 20 }}>
        飼料コスト計算
      </Typography>
      
      <Tabs
        value={activeTabs.feedCalc || 0}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="コスト分析" />
        <Tab label="飼料管理" />
        <Tab label="栄養分析" />
        <Tab label="競合分析" />
        <Tab label="データ管理" />
      </Tabs>
      
      <TabPanel value={activeTabs.feedCalc || 0} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper style={{ padding: 16 }}>
              <Typography variant="h6" gutterBottom>
                今月の飼料コスト
              </Typography>
              <Typography variant="h4" style={{ marginTop: 16 }}>
                ¥{monthlyFeedCost.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper style={{ padding: 16 }}>
              <Typography variant="h6" gutterBottom>
                卵1個あたりのコスト
              </Typography>
              <Typography variant="h4" style={{ marginTop: 16 }}>
                ¥{eggUnitCost.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper style={{ padding: 16 }}>
              <Typography variant="h6" gutterBottom>
                総コスト
              </Typography>
              <Typography variant="h4" style={{ marginTop: 16 }}>
                ¥{monthlyFeedCost.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper style={{ padding: 16 }}>
              <Typography variant="h6" gutterBottom>
                卵生産データ
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="月間卵数"
                    type="number"
                    fullWidth
                    value={eggData.eggCount}
                    onChange={(e) => updateEggData({ eggCount: parseInt(e.target.value) || 0 })}
                    InputProps={{
                      endAdornment: <Typography variant="body2">個</Typography>
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="卵単価"
                    type="number"
                    fullWidth
                    value={eggData.eggPrice}
                    onChange={(e) => updateEggData({ eggPrice: parseInt(e.target.value) || 0 })}
                    InputProps={{
                      startAdornment: <Typography variant="body2">¥</Typography>
                    }}
                  />
                </Grid>
              </Grid>
              
              <Box mt={3}>
                <Typography variant="body1">
                  <strong>総飼料コスト: </strong>¥{monthlyFeedCost.toLocaleString()}
                </Typography>
                <Typography variant="body1">
                  <strong>損益分岐点: </strong>{breakEvenPoint.toLocaleString()} 個
                </Typography>
                <Typography variant="body1">
                  <strong>予想利益: </strong>
                  <span style={{ color: projectedProfit >= 0 ? 'green' : 'red' }}>
                    ¥{projectedProfit.toLocaleString()}
                  </span>
                </Typography>
                <Typography variant="body1">
                  <strong>利益率: </strong>
                  <span style={{ color: profitMargin >= 0 ? 'green' : 'red' }}>
                    {profitMargin.toFixed(1)}%
                  </span>
                </Typography>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper style={{ padding: 16 }}>
              <Typography variant="h6" gutterBottom>
                飼料コスト割合
              </Typography>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={feedDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${percent}%`}
                    >
                      {feedDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={FEED_COLORS[index % FEED_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper style={{ padding: 16 }}>
              <Typography variant="h6" gutterBottom>
                月間飼料コスト推移
              </Typography>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={Array.from({ length: 6 }).map((_, i) => {
                      const month = (currentMonth - 5 + i + 12) % 12;
                      return {
                        name: monthNames[month],
                        cost: calculateTotalCost(month)
                      };
                    })}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="cost"
                      name="飼料コスト"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
      
      <TabPanel value={activeTabs.feedCalc || 0} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
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
                      <TableCell>飼料名</TableCell>
                      <TableCell align="right">単価 (¥/kg)</TableCell>
                      <TableCell align="right">単位</TableCell>
                      <TableCell align="right">タンパク質 (%)</TableCell>
                      <TableCell align="right">脂肪 (%)</TableCell>
                      <TableCell align="right">繊維 (%)</TableCell>
                      <TableCell align="right">操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {feeds.map((feed) => (
                      <TableRow key={feed.id}>
                        <TableCell>{feed.name}</TableCell>
                        <TableCell align="right">{feed.cost.toLocaleString()}</TableCell>
                        <TableCell align="right">{feed.unit}</TableCell>
                        <TableCell align="right">{feed.nutritions.protein}</TableCell>
                        <TableCell align="right">{feed.nutritions.fat}</TableCell>
                        <TableCell align="right">{feed.nutritions.fiber}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleOpenFeedDialog(feed)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteFeed(feed.id)}>
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
          
          <Grid item xs={12}>
            <Paper style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Typography variant="h6">
                  購入履歴
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenPurchaseDialog()}
                >
                  新規購入
                </Button>
              </div>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>飼料</TableCell>
                      <TableCell align="right">数量</TableCell>
                      <TableCell align="right">購入日</TableCell>
                      <TableCell align="right">給餌比率 (%)</TableCell>
                      <TableCell align="right">小計</TableCell>
                      <TableCell align="right">操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {purchases.map((purchase) => {
                      const feed = feeds.find(f => f.id === purchase.feedId);
                      const cost = feed ? feed.cost * purchase.quantity / 1000 : 0;
                      return (
                        <TableRow key={purchase.id}>
                          <TableCell>{feed ? feed.name : 'Unknown'}</TableCell>
                          <TableCell align="right">{purchase.quantity.toLocaleString()}{feed ? feed.unit : ''}</TableCell>
                          <TableCell align="right">{purchase.purchaseDate}</TableCell>
                          <TableCell align="right">{purchase.feedingRatio || 100}%</TableCell>
                          <TableCell align="right">¥{cost.toLocaleString()}</TableCell>
                          <TableCell align="right">
                            <IconButton onClick={() => handleOpenPurchaseDialog(purchase)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDeletePurchase(purchase.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
      
      <TabPanel value={activeTabs.feedCalc || 0} index={2}>
        <Typography variant="h6">
          栄養分析（実装中）
        </Typography>
      </TabPanel>
      
      <TabPanel value={activeTabs.feedCalc || 0} index={3}>
        <Typography variant="h6">
          競合分析（実装中）
        </Typography>
      </TabPanel>
      
      <TabPanel value={activeTabs.feedCalc || 0} index={4}>
        <Typography variant="h6">
          データ管理（実装中）
        </Typography>
      </TabPanel>
      
      <Dialog open={openFeedDialog} onClose={handleCloseFeedDialog}>
        <DialogTitle>{selectedFeed ? '飼料の編集' : '新規飼料の追加'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="飼料名"
                value={newFeed.name}
                onChange={(e) => setNewFeed({ ...newFeed, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="単価"
                type="number"
                value={newFeed.cost}
                onChange={(e) => setNewFeed({ ...newFeed, cost: parseFloat(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>単位</InputLabel>
                <Select
                  value={newFeed.unit}
                  onChange={(e) => setNewFeed({ ...newFeed, unit: e.target.value })}
                >
                  <MenuItem value="kg">kg</MenuItem>
                  <MenuItem value="g">g</MenuItem>
                  <MenuItem value="t">t</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" style={{ marginTop: 16 }}>
                栄養成分 (%)
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="タンパク質"
                type="number"
                value={newFeed.nutritions.protein}
                onChange={(e) => handleNutritionChange('protein', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="脂肪"
                type="number"
                value={newFeed.nutritions.fat}
                onChange={(e) => handleNutritionChange('fat', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="繊維"
                type="number"
                value={newFeed.nutritions.fiber}
                onChange={(e) => handleNutritionChange('fiber', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="カルシウム"
                type="number"
                value={newFeed.nutritions.calcium}
                onChange={(e) => handleNutritionChange('calcium', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="リン"
                type="number"
                value={newFeed.nutritions.phosphorus}
                onChange={(e) => handleNutritionChange('phosphorus', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFeedDialog} color="default">
            キャンセル
          </Button>
          <Button onClick={handleSaveFeed} color="primary">
            保存
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={openPurchaseDialog} onClose={handleClosePurchaseDialog}>
        <DialogTitle>{selectedPurchase ? '購入記録の編集' : '新規購入の追加'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>飼料</InputLabel>
                <Select
                  value={newPurchase.feedId}
                  onChange={(e) => setNewPurchase({ ...newPurchase, feedId: e.target.value })}
                >
                  {feeds.map((feed) => (
                    <MenuItem key={feed.id} value={feed.id}>
                      {feed.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="数量"
                type="number"
                value={newPurchase.quantity}
                onChange={(e) => setNewPurchase({ ...newPurchase, quantity: parseFloat(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="購入日"
                type="date"
                value={newPurchase.purchaseDate}
                onChange={(e) => setNewPurchase({ ...newPurchase, purchaseDate: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="給餌比率 (%)"
                type="number"
                value={newPurchase.feedingRatio}
                onChange={(e) => setNewPurchase({ ...newPurchase, feedingRatio: parseFloat(e.target.value) || 0 })}
                helperText="飼料の使用率（デフォルト: 100%）"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePurchaseDialog} color="default">
            キャンセル
          </Button>
          <Button onClick={handleSavePurchase} color="primary">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FeedCalculator;
