import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { t } from '../../../i18n';

const { width } = Dimensions.get('window');

type TimePeriod = '7d' | '30d' | '90d' | 'all';

export default function StreamAnalyticsScreen({ navigation }: any) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('30d');

  const periods = [
    { key: '7d', label: t('days7') },
    { key: '30d', label: t('days30') },
    { key: '90d', label: t('days90') },
    { key: 'all', label: t('allTime') },
  ];

  // Mock analytics data
  const analytics = {
    totalViews: 15234,
    totalWatchTime: '256h 32m',
    avgViewers: 234,
    peakViewers: 1234,
    totalRevenue: 3456.78,
    totalOrders: 145,
    conversionRate: 12.5,
    avgOrderValue: 23.84,
  };

  const topProducts = [
    { name: 'Summer Dress', sold: 45, revenue: 1349.55 },
    { name: 'Sneakers', sold: 32, revenue: 1919.68 },
    { name: 'Lipstick Set', sold: 28, revenue: 699.72 },
  ];

  const viewerDemographics = [
    { label: 'Female', percentage: 68 },
    { label: 'Male', percentage: 30 },
    { label: 'Other', percentage: 2 },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('streamAnalytics')}</Text>
        <TouchableOpacity>
          <Text style={styles.exportButton}>📊</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Time Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period.key as TimePeriod)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period.key && styles.periodButtonTextActive,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('performanceOverview')}</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricIcon}>👁️</Text>
              <Text style={styles.metricValue}>{analytics.totalViews.toLocaleString()}</Text>
              <Text style={styles.metricLabel}>{t('totalViews')}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricIcon}>⏱️</Text>
              <Text style={styles.metricValue}>{analytics.totalWatchTime}</Text>
              <Text style={styles.metricLabel}>{t('watchTime')}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricIcon}>📈</Text>
              <Text style={styles.metricValue}>{analytics.avgViewers}</Text>
              <Text style={styles.metricLabel}>{t('avgViewers')}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricIcon}>🔥</Text>
              <Text style={styles.metricValue}>{analytics.peakViewers}</Text>
              <Text style={styles.metricLabel}>{t('peakViewers')}</Text>
            </View>
          </View>
        </View>

        {/* Revenue Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('revenueAnalytics')}</Text>
          <View style={styles.revenueCard}>
            <View style={styles.revenueRow}>
              <Text style={styles.revenueLabel}>{t('totalRevenue')}</Text>
              <Text style={styles.revenueValue}>
                ${analytics.totalRevenue.toFixed(2)}
              </Text>
            </View>
            <View style={styles.revenueRow}>
              <Text style={styles.revenueLabel}>{t('totalOrders')}</Text>
              <Text style={styles.revenueValueSecondary}>{analytics.totalOrders}</Text>
            </View>
            <View style={styles.revenueRow}>
              <Text style={styles.revenueLabel}>{t('conversionRate')}</Text>
              <Text style={styles.revenueValueSecondary}>
                {analytics.conversionRate}%
              </Text>
            </View>
            <View style={styles.revenueRow}>
              <Text style={styles.revenueLabel}>{t('avgOrderValue')}</Text>
              <Text style={styles.revenueValueSecondary}>
                ${analytics.avgOrderValue.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Top Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('topSellingProducts')}</Text>
          {topProducts.map((product, index) => (
            <View key={index} style={styles.productRow}>
              <View style={styles.productRank}>
                <Text style={styles.rankNumber}>{index + 1}</Text>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productSold}>{product.sold} {t('sold')}</Text>
              </View>
              <Text style={styles.productRevenue}>
                ${product.revenue.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Viewer Demographics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('viewerDemographics')}</Text>
          {viewerDemographics.map((demo, index) => (
            <View key={index} style={styles.demoRow}>
              <Text style={styles.demoLabel}>{t(demo.label.toLowerCase())}</Text>
              <View style={styles.demoBar}>
                <View
                  style={[styles.demoBarFill, { width: `${demo.percentage}%` }]}
                />
              </View>
              <Text style={styles.demoPercentage}>{demo.percentage}%</Text>
            </View>
          ))}
        </View>

        {/* Engagement Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('engagement')}</Text>
          <View style={styles.engagementGrid}>
            <View style={styles.engagementCard}>
              <Text style={styles.engagementValue}>2.4K</Text>
              <Text style={styles.engagementLabel}>{t('comments')}</Text>
            </View>
            <View style={styles.engagementCard}>
              <Text style={styles.engagementValue}>5.6K</Text>
              <Text style={styles.engagementLabel}>{t('likes')}</Text>
            </View>
            <View style={styles.engagementCard}>
              <Text style={styles.engagementValue}>892</Text>
              <Text style={styles.engagementLabel}>{t('shares')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#6C5CE7',
    padding: 16,
    paddingTop: 50,
  },
  backButton: {
    fontSize: 28,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  exportButton: {
    fontSize: 24,
    color: '#fff',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    gap: 8,
    marginBottom: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#6C5CE7',
  },
  periodButtonText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: (width - 48) / 2,
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  metricIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
  },
  revenueCard: {
    backgroundColor: '#F0EDFF',
    padding: 16,
    borderRadius: 12,
  },
  revenueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  revenueLabel: {
    fontSize: 14,
    color: '#666',
  },
  revenueValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  revenueValueSecondary: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  productSold: {
    fontSize: 13,
    color: '#666',
  },
  productRevenue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  demoLabel: {
    width: 60,
    fontSize: 14,
    color: '#666',
  },
  demoBar: {
    flex: 1,
    height: 24,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 12,
  },
  demoBarFill: {
    height: '100%',
    backgroundColor: '#6C5CE7',
  },
  demoPercentage: {
    width: 45,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
  },
  engagementGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  engagementCard: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  engagementValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C5CE7',
    marginBottom: 4,
  },
  engagementLabel: {
    fontSize: 12,
    color: '#666',
  },
  bottomPadding: {
    height: 40,
  },
});
