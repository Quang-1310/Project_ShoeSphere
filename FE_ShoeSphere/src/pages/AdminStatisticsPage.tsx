import React, { useEffect, useState, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  PackageCheck,
  RefreshCw,
  Crown,
  Calendar,
  Award,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  BarChart3,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { toast } from 'react-toastify';
import { getAdminStatisticsAPI, type AdminStatisticsResponse } from '../api/adminStatisticsAPI';

export const AdminStatisticsPage: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<AdminStatisticsResponse | null>(null);
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  const fetchStatistics = async (year: number) => {
    try {
      setLoading(true);
      const res = await getAdminStatisticsAPI(year);
      setData(res);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics(selectedYear);
  }, [selectedYear]);

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  // Format compact numbers
  const formatCompact = (amount: number) => {
    if (amount >= 1_000_000_000) {
      return (amount / 1_000_000_000).toFixed(1) + ' Tỷ';
    }
    if (amount >= 1_000_000) {
      return (amount / 1_000_000).toFixed(1) + ' Tr';
    }
    return amount.toLocaleString('vi-VN');
  };

  // Peak month calculation
  const peakMonth = useMemo(() => {
    if (!data?.monthlyRevenue || data.monthlyRevenue.length === 0) return null;
    return [...data.monthlyRevenue].sort((a, b) => b.revenue - a.revenue)[0];
  }, [data]);

  // Max monthly revenue for scaling chart bars
  const maxRevenue = useMemo(() => {
    if (!data?.monthlyRevenue) return 1;
    const max = Math.max(...data.monthlyRevenue.map((m) => m.revenue));
    return max > 0 ? max : 1;
  }, [data]);

  // Average monthly revenue
  const avgRevenue = useMemo(() => {
    if (!data?.monthlyRevenue) return 0;
    const total = data.monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);
    return Math.round(total / 12);
  }, [data]);

  // Max sold quantity for scaling product rank progress
  const maxProductSold = useMemo(() => {
    if (!data?.topProducts || data.topProducts.length === 0) return 1;
    return Math.max(...data.topProducts.map((p) => p.totalQuantitySold));
  }, [data]);

  // Format Image URL helper
  const formatImageUrl = (url?: string) => {
    if (!url || url.trim() === '') return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://res.cloudinary.com/dq3ocm9yl/image/upload/${url}`;
  };

  return (

    <div style={{ padding: '32px', backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px', background: 'linear-gradient(90deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            📊 Thống kê & Báo cáo Doanh thu
          </h1>
          <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>
            Tổng quan hiệu suất bán hàng, doanh thu thực tế và sản phẩm bán chạy nhất ShoeSphere
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Year Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '8px 14px' }}>
            <Calendar size={18} color="#38bdf8" />
            <span style={{ fontSize: '14px', color: '#cbd5e1', fontWeight: 500 }}>Năm:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              style={{
                backgroundColor: 'transparent',
                color: '#38bdf8',
                border: 'none',
                outline: 'none',
                fontWeight: 'bold',
                fontSize: '15px',
                cursor: 'pointer'
              }}
            >
              {[currentYear, currentYear - 1, currentYear - 2, currentYear - 3].map((year) => (
                <option key={year} value={year} style={{ backgroundColor: '#1e293b', color: '#fff' }}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => fetchStatistics(selectedYear)}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#1d4ed8'; }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#2563eb'; }}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            <span>{loading ? 'Đang tải...' : 'Làm mới'}</span>
          </button>
        </div>
      </div>

      {loading && !data ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8' }}>
          <div style={{ display: 'inline-block', width: '48px', height: '48px', border: '4px solid #334155', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ marginTop: '16px', fontSize: '16px' }}>Đang tổng hợp dữ liệu báo cáo...</p>
        </div>
      ) : (
        <>
          {/* KPI Summary Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            
            {/* Card 1: Total Revenue */}
            <div style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '16px',
              padding: '24px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
            }}>
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '90px', height: '90px', background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)', borderRadius: '50%' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 600 }}>TỔNG DOANH THU</span>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'rgba(56,189,248,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign size={22} color="#38bdf8" />
                </div>
              </div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#38bdf8', marginBottom: '8px' }}>
                {formatCurrency(data?.summary.totalRevenue || 0)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#4ade80' }}>
                <TrendingUp size={16} />
                <span>Không tính đơn hủy</span>
              </div>
            </div>

            {/* Card 2: Total Orders */}
            <div style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '16px',
              padding: '24px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 600 }}>TỔNG SỐ ĐƠN HÀNG</span>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'rgba(129,140,248,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PackageCheck size={22} color="#818cf8" />
                </div>
              </div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#f8fafc', marginBottom: '8px' }}>
                {data?.summary.totalOrders.toLocaleString('vi-VN')} <span style={{ fontSize: '15px', color: '#94a3b8', fontWeight: 'normal' }}>đơn</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#cbd5e1' }}>
                <span style={{ color: '#4ade80' }}>✓ {data?.summary.deliveredOrders} đã giao</span>
                <span style={{ color: '#f59e0b' }}>⏳ {data?.summary.pendingOrders} xử lý</span>
              </div>
            </div>

            {/* Card 3: Total Shoes Sold */}
            <div style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '16px',
              padding: '24px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 600 }}>SẢN PHẨM ĐÃ BÁN</span>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'rgba(251,146,60,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShoppingBag size={22} color="#fb923c" />
                </div>
              </div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#fb923c', marginBottom: '8px' }}>
                {data?.summary.totalProductsSold.toLocaleString('vi-VN')} <span style={{ fontSize: '15px', color: '#94a3b8', fontWeight: 'normal' }}>đôi giày</span>
              </div>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                Top 10 mẫu đóng góp đa số doanh số
              </div>
            </div>

            {/* Card 4: Total Customers */}
            <div style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '16px',
              padding: '24px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 600 }}>KHÁCH HÀNG THÀNH VIÊN</span>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'rgba(52,211,153,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={22} color="#34d399" />
                </div>
              </div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#34d399', marginBottom: '8px' }}>
                {data?.summary.totalCustomers.toLocaleString('vi-VN')} <span style={{ fontSize: '15px', color: '#94a3b8', fontWeight: 'normal' }}>tài khoản</span>
              </div>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                Tài khoản khách hàng hoạt động
              </div>
            </div>

          </div>

          {/* Monthly Revenue Chart Section */}
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '20px', padding: '28px', marginBottom: '32px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <BarChart3 size={24} color="#38bdf8" />
                  <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: '#f8fafc' }}>
                    Biểu Đồ Doanh Thu Theo Tháng ({data?.selectedYear})
                  </h2>
                </div>
                <p style={{ margin: '4px 0 0 34px', color: '#94a3b8', fontSize: '13px' }}>
                  Thống kê cột chi tiết theo từng tháng từ tháng 1 đến tháng 12
                </p>
              </div>

              {peakMonth && (
                <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Award size={20} color="#f59e0b" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Tháng Cao Nhất</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fbbf24' }}>
                      Tháng {peakMonth.month}: {formatCompact(peakMonth.revenue)} ₫
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Custom Interactive SVG/HTML Chart Container */}
            <div style={{ position: 'relative', width: '100%', paddingTop: '16px' }}>
              
              {/* Chart Grid Lines */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', position: 'absolute', top: '20px', left: 0, right: 0, bottom: '50px', pointerEvents: 'none', opacity: 0.2 }}>
                <div style={{ borderTop: '1px dashed #94a3b8', width: '100%' }}></div>
                <div style={{ borderTop: '1px dashed #94a3b8', width: '100%' }}></div>
                <div style={{ borderTop: '1px dashed #94a3b8', width: '100%' }}></div>
              </div>

              {/* Bars Container */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '260px', gap: '12px', paddingBottom: '40px', position: 'relative', zIndex: 2 }}>
                {data?.monthlyRevenue.map((item) => {
                  const heightPercent = maxRevenue > 0 ? Math.max((item.revenue / maxRevenue) * 100, 4) : 4;
                  const isPeak = peakMonth?.month === item.month && item.revenue > 0;
                  const isHovered = hoveredMonth === item.month;

                  return (
                    <div
                      key={item.month}
                      onMouseEnter={() => setHoveredMonth(item.month)}
                      onMouseLeave={() => setHoveredMonth(null)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        height: '100%',
                        justifyContent: 'flex-end',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                    >
                      {/* Tooltip on Hover */}
                      {isHovered && (
                        <div style={{
                          position: 'absolute',
                          bottom: `${heightPercent + 8}%`,
                          backgroundColor: '#0f172a',
                          border: '1px solid #38bdf8',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                          borderRadius: '10px',
                          padding: '10px 14px',
                          whiteSpace: 'nowrap',
                          zIndex: 10,
                          textAlign: 'center',
                          pointerEvents: 'none',
                          transform: 'translateY(-5px)',
                          transition: 'all 0.2s ease'
                        }}>
                          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#38bdf8', marginBottom: '2px' }}>
                            Tháng {item.month}/{data.selectedYear}
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff' }}>
                            {formatCurrency(item.revenue)}
                          </div>
                          <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '2px' }}>
                            📦 {item.orderCount} đơn hàng
                          </div>
                        </div>
                      )}

                      {/* Bar Column */}
                      <div
                        style={{
                          width: '100%',
                          maxWidth: '44px',
                          height: `${heightPercent}%`,
                          background: isPeak
                            ? 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)'
                            : isHovered
                            ? 'linear-gradient(180deg, #38bdf8 0%, #2563eb 100%)'
                            : 'linear-gradient(180deg, #0284c7 0%, #1e40af 100%)',
                          borderRadius: '8px 8px 3px 3px',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          transform: isHovered ? 'scaleY(1.05)' : 'scaleY(1)',
                          boxShadow: isPeak
                            ? '0 0 15px rgba(245,158,11,0.5)'
                            : isHovered
                            ? '0 0 15px rgba(56,189,248,0.4)'
                            : 'none'
                        }}
                      />

                      {/* Month Label */}
                      <span style={{
                        marginTop: '12px',
                        fontSize: '13px',
                        fontWeight: isHovered || isPeak ? 'bold' : '500',
                        color: isPeak ? '#fbbf24' : isHovered ? '#38bdf8' : '#94a3b8'
                      }}>
                        T{item.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Average Monthly Legend */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #334155', paddingTop: '16px', fontSize: '13px', color: '#94a3b8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#0284c7', borderRadius: '3px' }}></div>
                    <span>Doanh thu tháng</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#f59e0b', borderRadius: '3px' }}></div>
                    <span>Tháng doanh thu đỉnh</span>
                  </div>
                </div>

                <div>
                  Doanh thu trung bình/tháng: <strong style={{ color: '#38bdf8' }}>{formatCurrency(avgRevenue)}</strong>
                </div>
              </div>

            </div>
          </div>

          {/* Grid Two Columns: Top Products & Distribution Status */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '28px' }}>
            
            {/* Left Column: Top Best Selling Products */}
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '20px', padding: '28px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Crown size={22} color="#f59e0b" />
                  <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: '#f8fafc' }}>
                    Sản Phẩm Bán Chạy Nhất
                  </h2>
                </div>
                <span style={{ fontSize: '12px', color: '#94a3b8', backgroundColor: '#0f172a', padding: '4px 10px', borderRadius: '20px', border: '1px solid #334155' }}>
                  Xếp theo số lượng
                </span>
              </div>

              {!data?.topProducts || data.topProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                  Chưa có dữ liệu bán sản phẩm nào
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {data.topProducts.map((product, index) => {
                    const rank = index + 1;
                    const percentOfTop = Math.round((product.totalQuantitySold / maxProductSold) * 100);

                    return (
                      <div
                        key={product.shoeId || index}
                        style={{
                          backgroundColor: '#0f172a',
                          border: '1px solid #334155',
                          borderRadius: '14px',
                          padding: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          transition: 'transform 0.2s ease, border-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#38bdf8';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#334155';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        {/* Rank Badge */}
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '800',
                          fontSize: '15px',
                          flexShrink: 0,
                          backgroundColor: rank === 1 ? 'rgba(245,158,11,0.2)' : rank === 2 ? 'rgba(148,163,184,0.2)' : rank === 3 ? 'rgba(217,119,6,0.2)' : '#1e293b',
                          color: rank === 1 ? '#fbbf24' : rank === 2 ? '#cbd5e1' : rank === 3 ? '#fb923c' : '#94a3b8',
                          border: rank <= 3 ? '1px solid currentColor' : '1px solid #334155'
                        }}>
                          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                        </div>

                        {/* Product Image */}
                        <div style={{ width: '50px', height: '50px', borderRadius: '10px', backgroundColor: '#1e293b', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #334155' }}>
                          <img
                            src={formatImageUrl(product.imageUrl)}
                            alt={product.shoeName}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80';
                            }}
                          />
                        </div>


                        {/* Product Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {product.shoeName}
                          </div>
                          <div style={{ fontSize: '13px', color: '#94a3b8', display: 'flex', gap: '8px', marginTop: '2px' }}>
                            <span style={{ color: '#38bdf8' }}>{product.brand || 'Giày'}</span>
                            <span>•</span>
                            <span>{formatCurrency(product.price)}</span>
                          </div>

                          {/* Progress Bar */}
                          <div style={{ width: '100%', height: '6px', backgroundColor: '#1e293b', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
                            <div style={{ width: `${percentOfTop}%`, height: '100%', backgroundColor: rank === 1 ? '#f59e0b' : '#38bdf8', borderRadius: '3px' }}></div>
                          </div>
                        </div>

                        {/* Sales Summary */}
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: '16px', fontWeight: '800', color: '#4ade80' }}>
                            {product.totalQuantitySold} <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'normal' }}>đôi</span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                            {formatCompact(product.totalRevenue)} ₫
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Order Status Breakdown & Brand Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              
              {/* Order Status Visual Distribution */}
              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '20px', padding: '28px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <Layers size={22} color="#818cf8" />
                  <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: '#f8fafc' }}>
                    Trạng Thái Đơn Hàng
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  
                  {/* Item: Delivered */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                      <span style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={16} color="#4ade80" /> Giao thành công
                      </span>
                      <strong style={{ color: '#4ade80' }}>{data?.summary.deliveredOrders || 0} đơn</strong>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#0f172a', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(data?.summary.totalOrders || 1) > 0 ? Math.round(((data?.summary.deliveredOrders || 0) / (data?.summary.totalOrders || 1)) * 100) : 0}%`, height: '100%', backgroundColor: '#4ade80' }}></div>
                    </div>
                  </div>

                  {/* Item: Shipping */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                      <span style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Truck size={16} color="#38bdf8" /> Đang vận chuyển
                      </span>
                      <strong style={{ color: '#38bdf8' }}>{data?.summary.shippingOrders || 0} đơn</strong>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#0f172a', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(data?.summary.totalOrders || 1) > 0 ? Math.round(((data?.summary.shippingOrders || 0) / (data?.summary.totalOrders || 1)) * 100) : 0}%`, height: '100%', backgroundColor: '#38bdf8' }}></div>
                    </div>
                  </div>

                  {/* Item: Confirmed */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                      <span style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={16} color="#818cf8" /> Đã xác nhận / Đóng gói
                      </span>
                      <strong style={{ color: '#818cf8' }}>{data?.summary.confirmedOrders || 0} đơn</strong>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#0f172a', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(data?.summary.totalOrders || 1) > 0 ? Math.round(((data?.summary.confirmedOrders || 0) / (data?.summary.totalOrders || 1)) * 100) : 0}%`, height: '100%', backgroundColor: '#818cf8' }}></div>
                    </div>
                  </div>

                  {/* Item: Pending */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                      <span style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={16} color="#f59e0b" /> Chờ xác nhận
                      </span>
                      <strong style={{ color: '#f59e0b' }}>{data?.summary.pendingOrders || 0} đơn</strong>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#0f172a', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(data?.summary.totalOrders || 1) > 0 ? Math.round(((data?.summary.pendingOrders || 0) / (data?.summary.totalOrders || 1)) * 100) : 0}%`, height: '100%', backgroundColor: '#f59e0b' }}></div>
                    </div>
                  </div>

                  {/* Item: Cancelled */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                      <span style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <XCircle size={16} color="#ef4444" /> Đã hủy
                      </span>
                      <strong style={{ color: '#ef4444' }}>{data?.summary.cancelledOrders || 0} đơn</strong>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#0f172a', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(data?.summary.totalOrders || 1) > 0 ? Math.round(((data?.summary.cancelledOrders || 0) / (data?.summary.totalOrders || 1)) * 100) : 0}%`, height: '100%', backgroundColor: '#ef4444' }}></div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Brand Performance Breakdown */}
              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '20px', padding: '28px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <Award size={22} color="#fb923c" />
                  <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: '#f8fafc' }}>
                    Doanh Số Theo Thương Hiệu
                  </h2>
                </div>

                {!data?.brandSales || data.brandSales.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#64748b', padding: '20px 0' }}>
                    Chưa có thương hiệu nào phát sinh doanh số
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px' }}>
                    {data.brandSales.map((brandItem, idx) => (
                      <div key={idx} style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fb923c', marginBottom: '4px' }}>
                          {brandItem.brand}
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>
                          {brandItem.totalQuantitySold} <span style={{ fontSize: '12px', color: '#94a3b8' }}>đôi</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#38bdf8', marginTop: '2px' }}>
                          {formatCompact(brandItem.totalRevenue)} ₫
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        </>
      )}

      {/* Global Spin Keyframe CSS */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  );
};
