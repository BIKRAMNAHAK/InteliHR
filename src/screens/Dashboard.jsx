  import React from 'react';
  import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import Ionicons from 'react-native-vector-icons/Ionicons';

  const { width } = Dimensions.get('window');

  const Dashboard = () => {

    const options = [
      { label: 'Leave Request', icon: 'document-text-outline' },
      { label: 'Leave Request Details', icon: 'reader-outline' },
      { label: 'Leave Approval', icon: 'checkmark-done-outline' },
      { label: 'Attendance Regularization', icon: 'calendar-outline' },
      { label: 'Regularization Approval', icon: 'shield-checkmark-outline' },
      { label: 'Regularization Listing', icon: 'list-outline' },
    ];

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.container}>
          
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Dashboard</Text>
            <TouchableOpacity style={styles.logoutBtn}>
              <Ionicons name="log-out-outline" size={20} color="#E53935" />
              <Text style={styles.logoutText}>LOGOUT</Text>
            </TouchableOpacity>
          </View>

          {/* Cards */}
          <ScrollView contentContainerStyle={styles.grid}>
            {options.map((item, index) => (
              <View key={index} style={styles.card}>
                <Ionicons name={item.icon} size={36} color="#E53935" />
                <Text style={styles.cardText}>{item.label}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity>
              <Ionicons name="home-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerCenter}>
              <Text style={styles.footerCenterText}>DASHBOARD</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="settings-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  };

  export default Dashboard;

  const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
    headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    header: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    logoutBtn: { flexDirection: 'row', alignItems: 'center' },
    logoutText: { marginLeft: 5, color: '#E53935', fontWeight: '600' },

    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingBottom: 80 },
    card: {
      width: (width / 2) - 24,  // 2 cards per row with spacing
      backgroundColor: '#fafafa',
      paddingVertical: 24,
      paddingHorizontal: 12,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 5,
      elevation: 2,
    },
    cardText: { marginTop: 8, fontSize: 13, color: '#333', textAlign: 'center', fontWeight: '500' },

    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: 12,
      backgroundColor: '#E53935',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    footerCenter: {
      paddingHorizontal: 20,
      paddingVertical: 6,
      backgroundColor: '#fff',
      borderRadius: 20,
    },
    footerCenterText: { color: '#E53935', fontWeight: 'bold' },
  });
