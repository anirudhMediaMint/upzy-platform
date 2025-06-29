import React from 'react';
import Card from '../../components/ui/card';
import Button from '../../components/ui/button';

interface EarningsData {
  today: number;
  week: number;
  month: number;
  year: number;
  total: number;
  trend: {
    today: number;
    week: number;
    month: number;
  };
}

interface EarningsHistory {
  id: string;
  jobTitle: string;
  amount: number;
  date: string;
  status: 'COMPLETED' | 'PENDING' | 'PAID';
  paymentMethod: string;
}

const PartnerEarnings: React.FC = () => {
  // Mock data - in real app, this would come from API
  const earningsData: EarningsData = {
    today: 125.50,
    week: 890.25,
    month: 3250.75,
    year: 28450.00,
    total: 47325.50,
    trend: {
      today: 15.2,
      week: -8.5,
      month: 12.3,
    },
  };

  const earningsHistory: EarningsHistory[] = [
    {
      id: '1',
      jobTitle: 'Delivery - Downtown Coffee Shop',
      amount: 45.00,
      date: '2024-01-15',
      status: 'PAID',
      paymentMethod: 'Bank Transfer',
    },
    {
      id: '2',
      jobTitle: 'Tech Support - Remote Assistance',
      amount: 80.50,
      date: '2024-01-14',
      status: 'PAID',
      paymentMethod: 'PayPal',
    },
    {
      id: '3',
      jobTitle: 'Installation - Home Router Setup',
      amount: 65.00,
      date: '2024-01-13',
      status: 'PENDING',
      paymentMethod: 'Bank Transfer',
    },
    {
      id: '4',
      jobTitle: 'Cleaning - Office Space',
      amount: 120.00,
      date: '2024-01-12',
      status: 'COMPLETED',
      paymentMethod: 'Direct Deposit',
    },
    {
      id: '5',
      jobTitle: 'Maintenance - HVAC Check',
      amount: 95.75,
      date: '2024-01-11',
      status: 'PAID',
      paymentMethod: 'Bank Transfer',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return '📈';
    if (trend < 0) return '📉';
    return '➡️';
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

     const getStatusColor = (status: string) => {
     const colors: Record<string, string> = {
       PAID: 'bg-green-100 text-green-800',
       PENDING: 'bg-yellow-100 text-yellow-800',
       COMPLETED: 'bg-blue-100 text-blue-800',
     };
     return colors[status] || 'bg-gray-100 text-gray-800';
   };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your income and payment history
        </p>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(earningsData.today)}
              </p>
            </div>
            <div className="flex items-center text-sm">
              <span className={getTrendColor(earningsData.trend.today)}>
                {getTrendIcon(earningsData.trend.today)} {Math.abs(earningsData.trend.today)}%
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">This Week</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(earningsData.week)}
              </p>
            </div>
            <div className="flex items-center text-sm">
              <span className={getTrendColor(earningsData.trend.week)}>
                {getTrendIcon(earningsData.trend.week)} {Math.abs(earningsData.trend.week)}%
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">This Month</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(earningsData.month)}
              </p>
            </div>
            <div className="flex items-center text-sm">
              <span className={getTrendColor(earningsData.trend.month)}>
                {getTrendIcon(earningsData.trend.month)} {Math.abs(earningsData.trend.month)}%
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Earnings</p>
            <p className="text-2xl font-bold text-primary-600">
              {formatCurrency(earningsData.total)}
            </p>
            <p className="text-sm text-gray-500 mt-1">All time</p>
          </div>
        </Card>
      </div>

      {/* Earnings Chart Placeholder */}
      <Card title="Earnings Trend" className="mb-8">
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-gray-500">Earnings chart will be displayed here</p>
            <p className="text-sm text-gray-400 mt-1">Integration with charting library pending</p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card title="Quick Actions" className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button variant="outline" className="flex items-center justify-center gap-2">
            <span>💳</span>
            Request Payout
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-2">
            <span>📄</span>
            Download Statement
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-2">
            <span>🧾</span>
            Tax Documents
          </Button>
        </div>
      </Card>

      {/* Earnings History */}
      <Card title="Recent Earnings">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {earningsHistory.map((earning) => (
                <tr key={earning.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {earning.jobTitle}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">
                      {formatCurrency(earning.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(earning.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(earning.status)}`}>
                      {earning.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {earning.paymentMethod}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-center">
          <Button variant="outline">View All Transactions</Button>
        </div>
      </Card>
    </div>
  );
};

export default PartnerEarnings; 