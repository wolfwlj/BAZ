import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { getAllNutrilogs } from '../../services/NutrilogService';
import { 
  calculateDailyCalories, 
  calculateDailyNutrients, 
  groupByDate, 
  formatDate 
} from '../../utils/helpers';

const screenWidth = Dimensions.get('window').width;

const CHART_TYPES = {
  CALORIES: 'calories',
  NUTRIENTS: 'nutrients',
  MACROS: 'macros'
};

const TIME_PERIODS = {
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year'
};

const StatsScreen = () => {
  const [nutrilogs, setNutrilogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeChart, setActiveChart] = useState(CHART_TYPES.CALORIES);
  const [timePeriod, setTimePeriod] = useState(TIME_PERIODS.WEEK);
  
  useEffect(() => {
    fetchNutrilogs();
  }, []);
  
  const fetchNutrilogs = async () => {
    setIsLoading(true);
    const response = await getAllNutrilogs();
    
    if (response.success) {
      const logs = response.data.nutrilogs || [];
      setNutrilogs(logs);
    }
    
    setIsLoading(false);
  };
  
  const getFilteredLogs = () => {
    const now = new Date();
    let startDate;
    
    switch (timePeriod) {
      case TIME_PERIODS.WEEK:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case TIME_PERIODS.MONTH:
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case TIME_PERIODS.YEAR:
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
    }
    
    return nutrilogs.filter(log => {
      const logDate = new Date(log.meal_date);
      return logDate >= startDate && logDate <= now;
    });
  };
  
  const getChartData = () => {
    const filteredLogs = getFilteredLogs();
    const groupedByDate = groupByDate(filteredLogs);
    
    // Sort dates
    const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(a) - new Date(b));
    
    // Limit to last 7 days for week view, or appropriate number for other views
    let displayDates = sortedDates;
    if (timePeriod === TIME_PERIODS.WEEK) {
      displayDates = sortedDates.slice(-7);
    } else if (timePeriod === TIME_PERIODS.MONTH) {
      displayDates = sortedDates.slice(-30);
    }
    
    switch (activeChart) {
      case CHART_TYPES.CALORIES:
        return {
          labels: displayDates.map(date => {
            const d = new Date(date);
            return `${d.getDate()}/${d.getMonth() + 1}`;
          }),
          datasets: [
            {
              data: displayDates.map(date => calculateDailyCalories(groupedByDate[date])),
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
              strokeWidth: 2
            }
          ],
          legend: ['Calories']
        };
      
      case CHART_TYPES.NUTRIENTS:
        return {
          labels: ['Protein', 'Carbs', 'Fat'],
          data: [
            displayDates.map(date => {
              const nutrients = calculateDailyNutrients(groupedByDate[date]);
              return nutrients.proteins;
            }),
            displayDates.map(date => {
              const nutrients = calculateDailyNutrients(groupedByDate[date]);
              return nutrients.carbohydrates;
            }),
            displayDates.map(date => {
              const nutrients = calculateDailyNutrients(groupedByDate[date]);
              return nutrients.fats;
            })
          ]
        };
      
      case CHART_TYPES.MACROS:
        // Calculate average macros over the period
        let totalProteins = 0;
        let totalCarbs = 0;
        let totalFats = 0;
        
        displayDates.forEach(date => {
          const nutrients = calculateDailyNutrients(groupedByDate[date]);
          totalProteins += nutrients.proteins;
          totalCarbs += nutrients.carbohydrates;
          totalFats += nutrients.fats;
        });
        
        const totalNutrients = totalProteins + totalCarbs + totalFats;
        
        return [
          {
            name: 'Protein',
            population: totalProteins,
            color: '#4CAF50',
            legendFontColor: '#7F7F7F',
            legendFontSize: 12
          },
          {
            name: 'Carbs',
            population: totalCarbs,
            color: '#2196F3',
            legendFontColor: '#7F7F7F',
            legendFontSize: 12
          },
          {
            name: 'Fat',
            population: totalFats,
            color: '#F44336',
            legendFontColor: '#7F7F7F',
            legendFontSize: 12
          }
        ];
      
      default:
        return {
          labels: [],
          datasets: [{ data: [] }]
        };
    }
  };
  
  const renderChart = () => {
    const chartData = getChartData();
    
    const chartConfig = {
      backgroundGradientFrom: '#fff',
      backgroundGradientTo: '#fff',
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: '6',
        strokeWidth: '2',
        stroke: '#4CAF50'
      }
    };
    
    switch (activeChart) {
      case CHART_TYPES.CALORIES:
        return (
          <LineChart
            data={chartData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        );
      
      case CHART_TYPES.NUTRIENTS:
        return (
          <BarChart
            data={chartData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero
          />
        );
      
      case CHART_TYPES.MACROS:
        return (
          <PieChart
            data={chartData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        );
      
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Nutrition Statistics</Text>
        
        <View style={styles.chartTypeContainer}>
          <TouchableOpacity
            style={[
              styles.chartTypeButton,
              activeChart === CHART_TYPES.CALORIES && styles.activeChartTypeButton
            ]}
            onPress={() => setActiveChart(CHART_TYPES.CALORIES)}
          >
            <Text 
              style={[
                styles.chartTypeText,
                activeChart === CHART_TYPES.CALORIES && styles.activeChartTypeText
              ]}
            >
              Calories
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.chartTypeButton,
              activeChart === CHART_TYPES.NUTRIENTS && styles.activeChartTypeButton
            ]}
            onPress={() => setActiveChart(CHART_TYPES.NUTRIENTS)}
          >
            <Text 
              style={[
                styles.chartTypeText,
                activeChart === CHART_TYPES.NUTRIENTS && styles.activeChartTypeText
              ]}
            >
              Nutrients
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.chartTypeButton,
              activeChart === CHART_TYPES.MACROS && styles.activeChartTypeButton
            ]}
            onPress={() => setActiveChart(CHART_TYPES.MACROS)}
          >
            <Text 
              style={[
                styles.chartTypeText,
                activeChart === CHART_TYPES.MACROS && styles.activeChartTypeText
              ]}
            >
              Macros
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.timePeriodContainer}>
          <TouchableOpacity
            style={[
              styles.timePeriodButton,
              timePeriod === TIME_PERIODS.WEEK && styles.activeTimePeriodButton
            ]}
            onPress={() => setTimePeriod(TIME_PERIODS.WEEK)}
          >
            <Text 
              style={[
                styles.timePeriodText,
                timePeriod === TIME_PERIODS.WEEK && styles.activeTimePeriodText
              ]}
            >
              Week
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.timePeriodButton,
              timePeriod === TIME_PERIODS.MONTH && styles.activeTimePeriodButton
            ]}
            onPress={() => setTimePeriod(TIME_PERIODS.MONTH)}
          >
            <Text 
              style={[
                styles.timePeriodText,
                timePeriod === TIME_PERIODS.MONTH && styles.activeTimePeriodText
              ]}
            >
              Month
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.timePeriodButton,
              timePeriod === TIME_PERIODS.YEAR && styles.activeTimePeriodButton
            ]}
            onPress={() => setTimePeriod(TIME_PERIODS.YEAR)}
          >
            <Text 
              style={[
                styles.timePeriodText,
                timePeriod === TIME_PERIODS.YEAR && styles.activeTimePeriodText
              ]}
            >
              Year
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.chartContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading data...</Text>
            </View>
          ) : nutrilogs.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="analytics-outline" size={48} color="#E0E0E0" />
              <Text style={styles.emptyText}>
                No data available. Start logging your meals to see statistics.
              </Text>
            </View>
          ) : (
            renderChart()
          )}
        </View>
        
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Summary</Text>
          
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {getFilteredLogs().length}
              </Text>
              <Text style={styles.statLabel}>Meals Logged</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {Object.keys(groupByDate(getFilteredLogs())).length}
              </Text>
              <Text style={styles.statLabel}>Days Tracked</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {Math.round(
                  getFilteredLogs().reduce((sum, log) => sum + log.calories, 0) / 
                  (Object.keys(groupByDate(getFilteredLogs())).length || 1)
                )}
              </Text>
              <Text style={styles.statLabel}>Avg. Calories</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  chartTypeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  chartTypeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
  },
  activeChartTypeButton: {
    borderBottomColor: '#4CAF50',
  },
  chartTypeText: {
    fontSize: 14,
    color: '#666',
  },
  activeChartTypeText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  timePeriodContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timePeriodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 4,
    borderRadius: 20,
  },
  activeTimePeriodButton: {
    backgroundColor: '#E8F5E9',
  },
  timePeriodText: {
    fontSize: 14,
    color: '#666',
  },
  activeTimePeriodText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
});

export default StatsScreen;
