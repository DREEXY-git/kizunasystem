import React, { useContext } from 'react';
import { FarmContext } from '../contexts/FarmContext';
import Dashboard from './Dashboard';
import FeedCalculator from './FeedCalculator';
import FarmSystem from './FarmSystem';
import { AppBar, Toolbar, Typography, IconButton, Badge, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@material-ui/core';
import { Notifications as NotificationsIcon, Dashboard as DashboardIcon, Functions as FunctionsIcon, Pets as PetsIcon } from '@material-ui/icons';

const IntegratedFarmApp: React.FC = () => {
  const {
    notifications,
    showNotifications,
    toggleNotifications,
    markAsRead,
    markAllAsRead,
    activeTabs,
    changeTab
  } = useContext(FarmContext);

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderContent = () => {
    switch (activeTabs.poultry) {
      case 'economic':
        return <FeedCalculator />;
      case 'system':
        return <FarmSystem />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AppBar position="static" className="bg-blue-600">
        <Toolbar>
          <Typography variant="h6" className="flex-grow">
            養鶏管理システム
          </Typography>
          <IconButton color="inherit" onClick={() => {
            console.log('Toggle notifications clicked');
            toggleNotifications();
          }}>
            <Badge badgeContent={unreadCount} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        className="w-64"
      >
        <Toolbar />
        <div className="overflow-auto">
          <List>
            <ListItem button onClick={() => changeTab('poultry', 'dashboard')}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="ダッシュボード" />
            </ListItem>
            <ListItem button onClick={() => changeTab('poultry', 'economic')}>
              <ListItemIcon>
                <FunctionsIcon />
              </ListItemIcon>
              <ListItemText primary="飼料コスト計算" />
            </ListItem>
            <ListItem button onClick={() => changeTab('poultry', 'system')}>
              <ListItemIcon>
                <PetsIcon />
              </ListItemIcon>
              <ListItemText primary="養鶏システム" />
            </ListItem>
          </List>
          <Divider />
        </div>
      </Drawer>

      <Drawer
        anchor="right"
        open={showNotifications}
        onClose={toggleNotifications}
        className="w-80"
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h6">通知</Typography>
            <button
              onClick={markAllAsRead}
              className="text-blue-600 hover:text-blue-800"
            >
              すべて既読にする
            </button>
          </div>
          <List>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                button
                onClick={() => markAsRead(notification.id)}
                className={notification.read ? 'bg-gray-50' : 'bg-white'}
              >
                <ListItemText
                  primary={notification.message}
                  secondary={notification.date}
                />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>

      <main className="ml-64 p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default IntegratedFarmApp; 