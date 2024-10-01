// assets/javascript/utils/api.js

const API_BASE_URL = '/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
};

const createApiMethod = (method, endpoint, requiresAuth = true) => async (data = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (requiresAuth) {
    const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrftoken=')).split('=')[1];
    options.headers['X-CSRFToken'] = csrfToken;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  return handleResponse(response);
};

export const api = {
  // Trading API
  executeTrade: createApiMethod('POST', '/tradingapi/trading/execute_trade/'),
  getOrderDetails: createApiMethod('GET', '/tradingapi/trading/order_details/'),
  getAccountInfo: createApiMethod('GET', '/tradingapi/trading/account_info/'),
  getPositions: createApiMethod('GET', '/tradingapi/trading/positions/'),
  getOrders: createApiMethod('GET', '/tradingapi/trading/orders/'),
  cancelOrder: createApiMethod('POST', '/tradingapi/trading/cancel_order/'),

  // Portfolio
  getPortfolios: createApiMethod('GET', '/portfolio/portfolios/'),
  createPortfolio: createApiMethod('POST', '/portfolio/portfolios/'),
  updatePortfolio: createApiMethod('PUT', '/portfolio/portfolios/'),
  deletePortfolio: createApiMethod('DELETE', '/portfolio/portfolios/'),
  getTrades: createApiMethod('GET', '/portfolio/trades/'),
  createTrade: createApiMethod('POST', '/portfolio/trades/'),
  updateTrade: createApiMethod('PUT', '/portfolio/trades/'),
  deleteTrade: createApiMethod('DELETE', '/portfolio/trades/'),

  // Data Manager
  getDataSources: createApiMethod('GET', '/datamanager/data-sources/'),
  createDataSource: createApiMethod('POST', '/datamanager/data-sources/'),
  updateDataSource: createApiMethod('PUT', '/datamanager/data-sources/'),
  deleteDataSource: createApiMethod('DELETE', '/datamanager/data-sources/'),
  getStockData: createApiMethod('GET', '/datamanager/stock-data/'),
  getOptionData: createApiMethod('GET', '/datamanager/option-data/'),
  getForexData: createApiMethod('GET', '/datamanager/forex-data/'),
  getCryptoData: createApiMethod('GET', '/datamanager/crypto-data/'),

  // Developer
  getComponents: createApiMethod('GET', '/developer/components/'),
  createComponent: createApiMethod('POST', '/developer/components/'),
  updateComponent: createApiMethod('PUT', '/developer/components/'),
  deleteComponent: createApiMethod('DELETE', '/developer/components/'),
  getModels: createApiMethod('GET', '/developer/models/'),
  createModel: createApiMethod('POST', '/developer/models/'),
  updateModel: createApiMethod('PUT', '/developer/models/'),
  deleteModel: createApiMethod('DELETE', '/developer/models/'),
  getModelComponents: createApiMethod('GET', '/developer/model-components/'),
  addComponentToModel: createApiMethod('POST', '/developer/model-components/'),
  updateModelComponent: createApiMethod('PUT', '/developer/model-components/'),
  deleteModelComponent: createApiMethod('DELETE', '/developer/model-components/'),
  getConnections: createApiMethod('GET', '/developer/connections/'),
  createConnection: createApiMethod('POST', '/developer/connections/'),
  updateConnection: createApiMethod('PUT', '/developer/connections/'),
  deleteConnection: createApiMethod('DELETE', '/developer/connections/'),

  // Settings
  getUserSettings: createApiMethod('GET', '/settings/user-settings/'),
  updateUserSettings: createApiMethod('PUT', '/settings/user-settings/'),
  changePassword: createApiMethod('POST', '/settings/user-settings/change_password/'),
  changeEmail: createApiMethod('POST', '/settings/user-settings/change_email/'),
  deleteAccount: createApiMethod('POST', '/settings/user-settings/delete_account/'),
  exportData: createApiMethod('GET', '/settings/user-settings/export_data/'),

  // User
  getUserInfo: createApiMethod('GET', '/user/info/'),
  logout: createApiMethod('POST', '/user/logout/'),
};