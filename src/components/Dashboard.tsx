import React, { useContext, useEffect } from 'react';
import { FarmContext } from '../contexts/FarmContext';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@material-ui/core';
import {
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
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
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard: React.FC = () => {
  const {
    inventoryItems,
    flocks,
    totalHens,
    dailyEggProduction,
    currentMonthFeedCost,
    projectedProfit,
    profitMargin,
    feedDistribution,
    nutritionData,
    syncData,
    COLORS
  } = useContext(FarmContext);

  // 初期データ読み込み
  useEffect(() => {
    console.log('Dashboard: Loading initial data...');
    syncData();
  }, [syncData]);

  const criticalItems = inventoryItems.filter(item => item.status === 'critical');
  const warningItems = inventoryItems.filter(item => item.status === 'warning');

  return (
    <Container maxWidth="lg" className="mt-4">
      <Grid container spacing={3}>
        {/* サマリーカード */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                総鶏数
              </Typography>
              <Typography variant="h4">
                {totalHens.toLocaleString()}羽
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                日次産卵数
              </Typography>
              <Typography variant="h4">
                {dailyEggProduction.toLocaleString()}個
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                今月の飼料コスト
              </Typography>
              <Typography variant="h4">
                ¥{currentMonthFeedCost.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                予想利益
              </Typography>
              <Typography variant="h4">
                ¥{projectedProfit.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                利益率: {profitMargin.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* グラフ */}
        <Grid item xs={12} md={6}>
          <Paper className="p-4">
            <Typography variant="h6" gutterBottom>
              飼料配分
            </Typography>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={feedDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {feedDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper className="p-4">
            <Typography variant="h6" gutterBottom>
              栄養分析
            </Typography>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={nutritionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        </Grid>

        {/* 在庫アラート */}
        <Grid item xs={12}>
          <Paper className="p-4">
            <Typography variant="h6" gutterBottom>
              在庫アラート
            </Typography>
            <List>
              {criticalItems.map((item) => (
                <ListItem key={item.id}>
                  <ListItemIcon>
                    <WarningIcon color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${item.name} - 残り${item.daysRemaining}日`}
                    secondary={`現在の在庫: ${item.currentStock}${item.unit}`}
                  />
                </ListItem>
              ))}
              {warningItems.map((item) => (
                <ListItem key={item.id}>
                  <ListItemIcon>
                    <WarningIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${item.name} - 残り${item.daysRemaining}日`}
                    secondary={`現在の在庫: ${item.currentStock}${item.unit}`}
                  />
                </ListItem>
              ))}
              {criticalItems.length === 0 && warningItems.length === 0 && (
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="在庫は正常です" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 