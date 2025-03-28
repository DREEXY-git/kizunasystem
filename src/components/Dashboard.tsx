import React, { useContext, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Card,
  CardContent,
  Box
} from '@material-ui/core';
import { Warning as WarningIcon, Error as ErrorIcon, CheckCircle as CheckCircleIcon } from '@material-ui/icons';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FarmContext } from '../contexts/FarmContext';

// カラー設定
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const STATUS_COLORS = {
  critical: '#f44336',
  warning: '#ff9800',
  normal: '#4caf50'
};

const Dashboard: React.FC = () => {
  const {
    flocks,
    feeds,
    inventoryItems,
    eggData,
    feedDistribution,
    nutritionData,
    calculateTotalCost,
    calculateEggProfit,
    calculateProfitMargin,
    currentMonth,
    syncData
  } = useContext(FarmContext);

  // データの初期同期を実行
  useEffect(() => {
    syncData();
  }, [syncData]);

  // 合計鶏数を計算
  const totalHens = flocks.reduce((sum, flock) => sum + flock.birdCount, 0);
  
  // 日々の卵生産量（推定）
  const dailyEggProduction = Math.round(totalHens * 0.8); // 80%の産卵率と仮定
  
  // 現在月の飼料コスト
  const currentMonthFeedCost = calculateTotalCost(currentMonth);
  
  // 予測利益
  const projectedProfit = calculateEggProfit();
  
  // 利益率
  const profitMargin = calculateProfitMargin();

  // クリティカルおよび警告アイテム
  const criticalItems = inventoryItems.filter(item => item.status === 'critical');
  const warningItems = inventoryItems.filter(item => item.status === 'warning');
  const normalItems = inventoryItems.length - criticalItems.length - warningItems.length;

  return (
    <Container>
      <Typography variant="h4" gutterBottom style={{ marginTop: 20, marginBottom: 20 }}>
        養鶏場ダッシュボード
      </Typography>
      
      {/* サマリーカード */}
      <Grid container spacing={3} style={{ marginBottom: 24 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                合計鶏数
              </Typography>
              <Typography variant="h5" component="div">
                {totalHens.toLocaleString()} 羽
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                日産卵数
              </Typography>
              <Typography variant="h5" component="div">
                {dailyEggProduction.toLocaleString()} 個
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                今月の飼料コスト
              </Typography>
              <Typography variant="h5" component="div">
                ¥{currentMonthFeedCost.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                予測利益
              </Typography>
              <Typography variant="h5" component="div" style={{color: projectedProfit >= 0 ? 'green' : 'red'}}>
                ¥{projectedProfit.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                利益率: {profitMargin.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* 左側: グラフセクション */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* 飼料分布グラフ */}
            <Grid item xs={12}>
              <Paper style={{ padding: 16 }}>
                <Typography variant="h6" gutterBottom>
                  飼料分布
                </Typography>
                <Box height={300}>
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
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
            
            {/* 栄養素分析グラフ */}
            <Grid item xs={12}>
              <Paper style={{ padding: 16 }}>
                <Typography variant="h6" gutterBottom>
                  栄養素分析
                </Typography>
                <Box height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={nutritionData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="平均値 (%)" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        
        {/* 右側: 在庫アラート */}
        <Grid item xs={12} md={4}>
          <Paper style={{ padding: 16, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              在庫アラート
            </Typography>
            <Box display="flex" justifyContent="space-around" mb={2}>
              <Chip
                icon={<ErrorIcon />}
                label={`${criticalItems.length} クリティカル`}
                style={{ backgroundColor: STATUS_COLORS.critical, color: 'white' }}
              />
              <Chip
                icon={<WarningIcon />}
                label={`${warningItems.length} 警告`}
                style={{ backgroundColor: STATUS_COLORS.warning, color: 'white' }}
              />
              <Chip
                icon={<CheckCircleIcon />}
                label={`${normalItems} 正常`}
                style={{ backgroundColor: STATUS_COLORS.normal, color: 'white' }}
              />
            </Box>
            {inventoryItems.length === 0 ? (
              <ListItem>
                <ListItemText primary="インベントリデータが読み込まれていません" />
              </ListItem>
            ) : (
              <List>
                {criticalItems.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemIcon>
                      <ErrorIcon style={{ color: STATUS_COLORS.critical }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      secondary={`${item.currentStock}${item.unit} (残り${item.daysRemaining}日分)`}
                    />
                  </ListItem>
                ))}
                {warningItems.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemIcon>
                      <WarningIcon style={{ color: STATUS_COLORS.warning }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      secondary={`${item.currentStock}${item.unit} (残り${item.daysRemaining}日分)`}
                    />
                  </ListItem>
                ))}
                {criticalItems.length === 0 && warningItems.length === 0 && (
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon style={{ color: STATUS_COLORS.normal }} />
                    </ListItemIcon>
                    <ListItemText primary="すべての在庫レベルは正常です" />
                  </ListItem>
                )}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
