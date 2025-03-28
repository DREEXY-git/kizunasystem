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
  LinearProgress
} from '@material-ui/core';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Pets as PetsIcon,
  Storage as StorageIcon,
  AttachMoney as AttachMoneyIcon
} from '@material-ui/icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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

const FarmSystem: React.FC = () => {
  const {
    flocks,
    inventoryItems,
    activeTabs,
    changeTab,
    updateInventoryItem,
    getFlockDetail,
    updateFlockDetail
  } = useContext(FarmContext);

  const [tabValue, setTabValue] = useState(0);
  const [openFlockDialog, setOpenFlockDialog] = useState(false);
  const [selectedFlock, setSelectedFlock] = useState<any>(null);
  const [newFlock, setNewFlock] = useState({
    name: '',
    birdCount: '',
    ageWeeks: ''
  });

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenFlockDialog = (flock?: any) => {
    if (flock) {
      setSelectedFlock(flock);
      setNewFlock({
        name: flock.name,
        birdCount: flock.birdCount.toString(),
        ageWeeks: flock.ageWeeks.toString()
      });
    } else {
      setSelectedFlock(null);
      setNewFlock({
        name: '',
        birdCount: '',
        ageWeeks: ''
      });
    }
    setOpenFlockDialog(true);
  };

  const handleCloseFlockDialog = () => {
    setOpenFlockDialog(false);
    setSelectedFlock(null);
  };

  const handleSaveFlock = () => {
    // TODO: Implement flock save functionality
    handleCloseFlockDialog();
  };

  // 在庫データのグラフ用データ
  const inventoryData = inventoryItems.map(item => ({
    name: item.name,
    currentStock: item.currentStock,
    minStock: item.minStock,
    optimalStock: item.optimalStock
  }));

  return (
    <Container maxWidth="lg" className="mt-4">
      <Paper className="p-4">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab icon={<PetsIcon />} label="鶏舎管理" />
          <Tab icon={<StorageIcon />} label="在庫管理" />
          <Tab icon={<AttachMoneyIcon />} label="収益分析" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h6">
              鶏舎一覧
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenFlockDialog()}
            >
              新規鶏舎
            </Button>
          </div>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={7}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>鶏舎名</TableCell>
                      <TableCell align="right">飼育数</TableCell>
                      <TableCell align="right">週齢</TableCell>
                      <TableCell align="right">健康状態</TableCell>
                      <TableCell align="right">産卵率</TableCell>
                      <TableCell align="right">操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {flocks.map((flock) => {
                      const detail = getFlockDetail(flock.id);
                      // 週齢に基づいて産卵率を計算（簡易的な計算）
                      const eggProductionRate = flock.ageWeeks >= 20 && flock.ageWeeks <= 80 
                        ? Math.max(0, 90 - (0.7 * Math.abs(flock.ageWeeks - 40)))
                        : 0;
                      
                      return (
                        <TableRow key={flock.id}>
                          <TableCell>{flock.name}</TableCell>
                          <TableCell align="right">{flock.birdCount.toLocaleString()}羽</TableCell>
                          <TableCell align="right">{flock.ageWeeks}週</TableCell>
                          <TableCell align="right">
                            <span className={`px-2 py-1 rounded ${
                              detail?.healthStatus === '経過観察' ? 'bg-yellow-100 text-yellow-800' :
                              detail?.healthStatus === '不良' ? 'bg-red-100 text-red-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {detail?.healthStatus || '良好'}
                            </span>
                          </TableCell>
                          <TableCell align="right">{eggProductionRate.toFixed(1)}%</TableCell>
                          <TableCell align="right">
                            <Tooltip title="編集">
                              <IconButton onClick={() => handleOpenFlockDialog(flock)}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="削除">
                              <IconButton>
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            
            <Grid item xs={12} lg={5}>
              <Paper className="p-4">
                <Typography variant="subtitle1" gutterBottom>
                  鶏群年齢分布
                </Typography>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { category: '雛 (1-8週)', count: flocks.filter(f => f.ageWeeks >= 1 && f.ageWeeks <= 8).reduce((sum, f) => sum + f.birdCount, 0) },
                        { category: '育成 (9-19週)', count: flocks.filter(f => f.ageWeeks >= 9 && f.ageWeeks <= 19).reduce((sum, f) => sum + f.birdCount, 0) },
                        { category: '産卵初期 (20-35週)', count: flocks.filter(f => f.ageWeeks >= 20 && f.ageWeeks <= 35).reduce((sum, f) => sum + f.birdCount, 0) },
                        { category: '産卵中期 (36-65週)', count: flocks.filter(f => f.ageWeeks >= 36 && f.ageWeeks <= 65).reduce((sum, f) => sum + f.birdCount, 0) },
                        { category: '産卵後期 (66週以上)', count: flocks.filter(f => f.ageWeeks >= 66).reduce((sum, f) => sum + f.birdCount, 0) }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" angle={-45} textAnchor="end" height={70} />
                      <YAxis label={{ value: '羽数', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value) => [`${value.toLocaleString()}羽`, '']} />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper className="p-4 mt-4">
                <Typography variant="subtitle1" gutterBottom>
                  産卵量予測
                </Typography>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={Array.from({ length: 6 }).map((_, i) => {
                        // 今後6ヶ月の予測
                        const month = new Date();
                        month.setMonth(month.getMonth() + i);
                        
                        // 各鶏群の産卵数を予測
                        const eggProduction = flocks.reduce((sum, flock) => {
                          const futureWeeks = flock.ageWeeks + (i * 4);
                          // 週齢に基づいて産卵率を計算
                          const eggRate = futureWeeks >= 20 && futureWeeks <= 80
                            ? Math.max(0, 90 - (0.7 * Math.abs(futureWeeks - 40)))
                            : 0;
                          return sum + (flock.birdCount * eggRate / 100 * 30); // 月30日換算
                        }, 0);
                        
                        return {
                          month: `${month.getMonth() + 1}月`,
                          eggs: Math.round(eggProduction)
                        };
                      })}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis label={{ value: '月間産卵数', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value) => [`${value.toLocaleString()}個`, '']} />
                      <Legend />
                      <Line type="monotone" dataKey="eggs" name="予測産卵数" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <div className="mb-4">
            <Typography variant="h6" gutterBottom>
              在庫状況
            </Typography>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inventoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip />
                  <Legend />
                  <Bar dataKey="currentStock" fill="#8884d8" name="現在の在庫" />
                  <Bar dataKey="minStock" fill="#ff7300" name="最小在庫" />
                  <Bar dataKey="optimalStock" fill="#387908" name="適正在庫" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>アイテム名</TableCell>
                  <TableCell align="right">現在の在庫</TableCell>
                  <TableCell align="right">最小在庫</TableCell>
                  <TableCell align="right">適正在庫</TableCell>
                  <TableCell align="right">残り日数</TableCell>
                  <TableCell align="right">状態</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventoryItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">{item.currentStock}{item.unit}</TableCell>
                    <TableCell align="right">{item.minStock}{item.unit}</TableCell>
                    <TableCell align="right">{item.optimalStock}{item.unit}</TableCell>
                    <TableCell align="right">{item.daysRemaining}日</TableCell>
                    <TableCell align="right">
                      <span className={`px-2 py-1 rounded ${
                        item.status === 'critical' ? 'bg-red-100 text-red-800' :
                        item.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.status === 'critical' ? '危険' :
                         item.status === 'warning' ? '注意' :
                         '正常'}
                      </span>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => updateInventoryItem(item.id, { type: 'add', quantity: 100 })}
                      >
                        入庫
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <Typography variant="h6">
                収益分析
              </Typography>
              <div className="flex space-x-2">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => changeTab('revenue', 'monthly')}
                  className={activeTabs.revenue === 'monthly' ? 'bg-blue-50' : ''}
                >
                  月次
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => changeTab('revenue', 'annual')}
                  className={activeTabs.revenue === 'annual' ? 'bg-blue-50' : ''}
                >
                  年次
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => changeTab('revenue', 'forecast')}
                  className={activeTabs.revenue === 'forecast' ? 'bg-blue-50' : ''}
                >
                  予測
                </Button>
              </div>
            </div>
            
            {activeTabs.revenue === 'monthly' && (
              <Grid container spacing={3}>
                {/* 収益サマリーカード */}
                <Grid item xs={12}>
                  <Paper className="p-4">
                    <Typography variant="subtitle1" gutterBottom>
                      月別収益サマリー
                    </Typography>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={revenueData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis 
                            tickFormatter={(value) => `¥${(value / 1000).toLocaleString()}K`}
                            label={{ value: '金額 (円)', angle: -90, position: 'insideLeft' }}
                          />
                          <Tooltip formatter={(value) => [`¥${value.toLocaleString()}`, '']} />
                          <Legend />
                          <Bar dataKey="eggs" name="卵販売" fill="#8884d8" stackId="a" />
                          <Bar dataKey="meat" name="肉販売" fill="#82ca9d" stackId="a" />
                          <Bar dataKey="fertilizer" name="肥料販売" fill="#ffc658" stackId="a" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Paper>
                </Grid>
                
                {/* 収益詳細テーブル */}
                <Grid item xs={12}>
                  <Paper className="p-4">
                    <Typography variant="subtitle1" gutterBottom>
                      収益詳細
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>月</TableCell>
                            <TableCell align="right">卵販売</TableCell>
                            <TableCell align="right">肉販売</TableCell>
                            <TableCell align="right">肥料販売</TableCell>
                            <TableCell align="right">合計収益</TableCell>
                            <TableCell align="right">飼料コスト</TableCell>
                            <TableCell align="right">純利益</TableCell>
                            <TableCell align="right">利益率</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {revenueData.map((item, index) => {
                            const feedCost = calculateTotalCost(index);
                            const profit = item.total - feedCost;
                            const profitMargin = item.total > 0 ? (profit / item.total * 100) : 0;
                            
                            return (
                              <TableRow key={item.month}>
                                <TableCell>{item.month}</TableCell>
                                <TableCell align="right">¥{item.eggs.toLocaleString()}</TableCell>
                                <TableCell align="right">¥{item.meat.toLocaleString()}</TableCell>
                                <TableCell align="right">¥{item.fertilizer.toLocaleString()}</TableCell>
                                <TableCell align="right">¥{item.total.toLocaleString()}</TableCell>
                                <TableCell align="right">¥{feedCost.toLocaleString()}</TableCell>
                                <TableCell align="right" className={profit >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                                  ¥{profit.toLocaleString()}
                                </TableCell>
                                <TableCell align="right" className={profitMargin >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                                  {profitMargin.toFixed(1)}%
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
            )}
            
            {activeTabs.revenue === 'annual' && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper className="p-4">
                    <Typography variant="subtitle1" gutterBottom>
                      年間目標
                    </Typography>
                    <div className="space-y-4">
                      <div>
                        <Typography variant="body2" className="text-gray-600">
                          総収益目標
                        </Typography>
                        <Typography variant="h5">
                          ¥{annualGoals.revenue.toLocaleString()}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={Math.min(100, revenueData.reduce((sum, item) => sum + item.total, 0) / annualGoals.revenue * 100)} 
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Typography variant="body2" className="text-gray-600">
                          純利益目標
                        </Typography>
                        <Typography variant="h5">
                          ¥{annualGoals.profit.toLocaleString()}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={Math.min(100, revenueData.reduce((sum, item, index) => {
                            const feedCost = calculateTotalCost(index);
                            return sum + (item.total - feedCost);
                          }, 0) / annualGoals.profit * 100)} 
                          className="mt-1"
                          color="secondary"
                        />
                      </div>
                      <div>
                        <Typography variant="body2" className="text-gray-600">
                          生産量増加目標
                        </Typography>
                        <Typography variant="h5">
                          {annualGoals.productionIncrease}%
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="body2" className="text-gray-600">
                          コスト削減目標
                        </Typography>
                        <Typography variant="h5">
                          {annualGoals.costReduction}%
                        </Typography>
                      </div>
                    </div>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper className="p-4">
                    <Typography variant="subtitle1" gutterBottom>
                      収益源の内訳
                    </Typography>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: '卵販売', value: revenueData.reduce((sum, item) => sum + item.eggs, 0) },
                              { name: '肉販売', value: revenueData.reduce((sum, item) => sum + item.meat, 0) },
                              { name: '肥料販売', value: revenueData.reduce((sum, item) => sum + item.fertilizer, 0) }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {[0, 1, 2].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`¥${value.toLocaleString()}`, '']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </Paper>
                </Grid>
              </Grid>
            )}
            
            {activeTabs.revenue === 'forecast' && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper className="p-4">
                    <Typography variant="subtitle1" gutterBottom>
                      収益・コスト予測 (今後3ヶ月)
                    </Typography>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" type="category" allowDuplicatedCategory={false} />
                          <YAxis 
                            tickFormatter={(value) => `¥${(value / 1000).toLocaleString()}K`}
                            label={{ value: '金額 (円)', angle: -90, position: 'insideLeft' }}
                          />
                          <Tooltip formatter={(value) => [`¥${value.toLocaleString()}`, '']} />
                          <Legend />
                          <Line 
                            dataKey="revenue" 
                            name="予測収益" 
                            data={[
                              { month: '過去', revenue: revenueData[revenueData.length - 1].total },
                              { month: '1ヶ月後', revenue: revenueData[revenueData.length - 1].total * 1.05 },
                              { month: '2ヶ月後', revenue: revenueData[revenueData.length - 1].total * 1.08 },
                              { month: '3ヶ月後', revenue: revenueData[revenueData.length - 1].total * 1.12 }
                            ]} 
                            stroke="#8884d8" 
                          />
                          <Line 
                            dataKey="cost" 
                            name="予測コスト" 
                            data={[
                              { month: '過去', cost: calculateTotalCost(revenueData.length - 1) },
                              { month: '1ヶ月後', cost: calculateTotalCost(revenueData.length - 1) * 1.02 },
                              { month: '2ヶ月後', cost: calculateTotalCost(revenueData.length - 1) * 1.03 },
                              { month: '3ヶ月後', cost: calculateTotalCost(revenueData.length - 1) * 1.04 }
                            ]} 
                            stroke="#82ca9d" 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <Typography variant="body2" className="italic text-gray-500 mt-2">
                      注: 予測は過去のトレンドに基づき推定されており、実際の結果は異なる場合があります。
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </div>
        </TabPanel>
      </Paper>

      {/* 鶏舎編集ダイアログ */}
      <Dialog open={openFlockDialog} onClose={handleCloseFlockDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedFlock ? '鶏舎の編集' : '新規鶏舎の追加'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="dense"
                label="鶏舎名"
                variant="outlined"
                value={newFlock.name}
                onChange={(e) => setNewFlock({ ...newFlock, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="dense"
                label="飼育数"
                type="number"
                variant="outlined"
                value={newFlock.birdCount}
                onChange={(e) => setNewFlock({ ...newFlock, birdCount: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="dense"
                label="週齢"
                type="number"
                variant="outlined"
                value={newFlock.ageWeeks}
                onChange={(e) => setNewFlock({ ...newFlock, ageWeeks: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense" variant="outlined">
                <InputLabel>健康状態</InputLabel>
                <Select
                  value={selectedFlock ? (getFlockDetail(selectedFlock.id)?.healthStatus || '良好') : '良好'}
                  onChange={(e) => {
                    if (selectedFlock) {
                      const detail = getFlockDetail(selectedFlock.id);
                      if (detail) {
                        updateFlockDetail(detail.id, { healthStatus: e.target.value });
                      }
                    }
                  }}
                  label="健康状態"
                >
                  <MenuItem value="良好">良好</MenuItem>
                  <MenuItem value="経過観察">経過観察</MenuItem>
                  <MenuItem value="不良">不良</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="dense"
                label="死亡率 (%)"
                type="number"
                variant="outlined"
                value={selectedFlock ? (getFlockDetail(selectedFlock.id)?.mortalityRate || 0) : 0}
                onChange={(e) => {
                  if (selectedFlock) {
                    const detail = getFlockDetail(selectedFlock.id);
                    if (detail) {
                      updateFlockDetail(detail.id, { mortalityRate: parseFloat(e.target.value) });
                    }
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="dense"
                label="飼料転換効率"
                type="number"
                variant="outlined"
                value={selectedFlock ? (getFlockDetail(selectedFlock.id)?.feedConversionRatio || 0) : 0}
                onChange={(e) => {
                  if (selectedFlock) {
                    const detail = getFlockDetail(selectedFlock.id);
                    if (detail) {
                      updateFlockDetail(detail.id, { feedConversionRatio: parseFloat(e.target.value) });
                    }
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="dense"
                label="備考"
                multiline
                rows={3}
                variant="outlined"
                value={selectedFlock ? (getFlockDetail(selectedFlock.id)?.notes || '') : ''}
                onChange={(e) => {
                  if (selectedFlock) {
                    const detail = getFlockDetail(selectedFlock.id);
                    if (detail) {
                      updateFlockDetail(detail.id, { notes: e.target.value });
                    }
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFlockDialog} color="default">キャンセル</Button>
          <Button onClick={handleSaveFlock} color="primary" variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FarmSystem; 