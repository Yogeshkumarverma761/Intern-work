import React, { useState, useEffect } from 'react';
import { ShoppingBag, Package, Users, DollarSign, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import Header from '../components/Header.jsx';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

const formatInr = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  delivered: 'bg-teal-100 text-teal-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusIcons = {
  pending: Clock,
  accepted: CheckCircle,
  'in-progress': Package,
  completed: CheckCircle,
  delivered: CheckCircle,
  cancelled: XCircle,
};

const formatPaymentMethod = (method) => {
  if (!method || method === 'none') return 'Not specified';
  return method.charAt(0).toUpperCase() + method.slice(1);
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/all`);
      
      if (response.data.success) {
        const ordersData = response.data.data;
        setOrders(ordersData);
        
        // Calculate stats
        const totalRevenue = ordersData.reduce((sum, order) => {
          return sum + (order.total || order.clothId?.price || 0);
        }, 0);
        
        const pendingCount = ordersData.filter(o => o.status === 'pending').length;
        const completedCount = ordersData.filter(o => o.status === 'completed' || o.status === 'delivered').length;
        
        setStats({
          totalOrders: ordersData.length,
          totalRevenue,
          pendingOrders: pendingCount,
          completedOrders: completedCount,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
              <ShoppingBag className="w-10 h-10 text-purple-600" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Manage all orders and view statistics</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Package}
              label="Total Orders"
              value={stats.totalOrders}
              color="bg-blue-500"
            />
            <StatCard
              icon={DollarSign}
              label="Total Revenue"
              value={formatInr(stats.totalRevenue)}
              color="bg-green-500"
            />
            <StatCard
              icon={Clock}
              label="Pending Orders"
              value={stats.pendingOrders}
              color="bg-yellow-500"
            />
            <StatCard
              icon={CheckCircle}
              label="Completed Orders"
              value={stats.completedOrders}
              color="bg-purple-500"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">All Orders</h2>
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-600">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center text-gray-600">No orders found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => {
                      const StatusIcon = statusIcons[order.status] || Clock;
                      const orderTotal = order.total || order.clothId?.price || 0;
                      const itemCount = order.orderType === 'cart' 
                        ? order.items?.length || 0 
                        : 1;

                      return (
                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order._id.slice(-6)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {order.userId?.name || 'Unknown'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.userId?.email || ''}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              order.orderType === 'cart' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {order.orderType === 'cart' ? 'Cart Order' : 'Single Item'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {itemCount} {itemCount === 1 ? 'item' : 'items'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {formatInr(orderTotal)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex items-center gap-1 text-xs font-semibold rounded-full ${statusColors[order.status]}`}>
                              <StatusIcon className="w-3 h-3" />
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Order Details #{selectedOrder._id.slice(-6)}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Customer Information
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm"><span className="font-medium">Name:</span> {selectedOrder.userId?.name || 'N/A'}</p>
                  <p className="text-sm"><span className="font-medium">Email:</span> {selectedOrder.userId?.email || 'N/A'}</p>
                  <p className="text-sm"><span className="font-medium">Phone:</span> {selectedOrder.userId?.phoneNo || 'N/A'}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  Order Items
                </h4>
                {selectedOrder.orderType === 'cart' ? (
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-800">
                            {item.clothId?.title || item.clothId?.name || 'Product'}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} • Size: {item.size || 'N/A'}
                          </p>
                          {(item.selectedFabric || item.selectedColor || item.selectedDesign) && (
                            <p className="text-xs text-gray-600 mt-1">
                              {item.selectedFabric && `Fabric: ${item.selectedFabric}`}
                              {item.selectedColor && ` • Color: ${item.selectedColor}`}
                              {item.selectedDesign && ` • Design: ${item.selectedDesign}`}
                            </p>
                          )}
                          {item.customMeasurements && (
                            <p className="text-xs text-purple-600 mt-1">Custom measurements applied</p>
                          )}
                        </div>
                        <p className="font-bold text-gray-800">{formatInr(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium text-gray-800">
                      {selectedOrder.clothId?.title || selectedOrder.clothId?.name || 'Product'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Price: {formatInr(selectedOrder.clothId?.price || 0)}
                    </p>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              {selectedOrder.orderType === 'cart' && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    Order Summary
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span className="font-semibold">{formatInr(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>GST (18%):</span>
                      <span className="font-semibold">{formatInr(selectedOrder.gst)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-bold">Total:</span>
                      <span className="font-bold text-purple-600 text-lg">
                        {formatInr(selectedOrder.total)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Info */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  Payment
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Method:</span>
                    <span className="font-semibold">{formatPaymentMethod(selectedOrder.paymentMethod)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Paid now:</span>
                    <span className="font-semibold">{formatInr(selectedOrder.paidAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pay on delivery:</span>
                    <span className="font-semibold">{formatInr(selectedOrder.remainingAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-semibold">{selectedOrder.paymentStatus || 'unpaid'}</span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Order Status</h4>
                <span className={`px-4 py-2 inline-flex items-center gap-2 font-semibold rounded-full ${statusColors[selectedOrder.status]}`}>
                  {React.createElement(statusIcons[selectedOrder.status] || Clock, { className: 'w-4 h-4' })}
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
