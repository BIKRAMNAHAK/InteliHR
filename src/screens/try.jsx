mujhe responce kuch esa milta he  

return res 
{status: '200', Data: Array(3)}
Data
: 
Array(3)
0
: 
{attendanceid: '41', empid: '7', attdate: '2025-07-06', intime: '15:49:57', outtime: null, att_status: 'present', att_type: 'pending', latitude: '37.421998333333', longitude: '-122.084', chackout_leti: null, …}
1
: 
{attendanceid: '42', empid: '7', attdate: '2025-07-08', intime: '10:30:20', outtime: '10:31:04', att_status: 'present', att_type: 'pending', latitude: '37.421998333333', longitude: '-122.084', chackout_leti: '37.421998333333', …}
2
: 
{attendanceid: '43', empid: '7', attdate: '2025-07-08', intime: '10:43:35', outtime: '10:44:20', att_status: 'present', att_type: 'pending', latitude: '37.421998333333', longitude: '-122.084', chackout_leti: '37.421998333333', …}
length
: 
3
[[Prototype]]
: 
Array(0)
status
: 
"200"c


ab mujhe wanha pe print karna he  

// code

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Dimensions, Image
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { getAttHistoryAsync } from '../services/Actions/employeeAction';

const { width } = Dimensions.get('window');

const AttendanceHistory = ({navigation}) => {
  const {employee} = useSelector((state)=>state.employee)
  const dispatch = useDispatch()

  const [showCalendar, setShowCalendar] = useState(false);
  const [activeTab, setActiveTab] = useState('My Attendance');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const [expandedSub, setExpandedSub] = useState(null);

  const attendance = [
    { date: '2025-06-06', day: 'FRI', punchIn: '', punchOut: '', total: '', color: '#EF9A9A', status: 'Absent' },
    { date: '2025-06-07', day: 'SAT', punchIn: '09:00 AM', punchOut: '06:00 PM', total: '09:00', color: 'green', status: 'Present' },
    { date: '2025-06-08', day: 'SUN', punchIn: '', punchOut: '', total: '', color: '#FFE082', status: 'Holiday' },
    { date: '2025-06-09', day: 'MON', punchIn: '00:00 AM', punchOut: '00:00 PM', total: '00:00', color: '#CE93D8', status: 'Leave' },
    { date: '2025-06-10', day: 'TUE', punchIn: '09:00 AM', punchOut: '06:00 PM', total: '09:00', color: '#90CAF9', status: 'Outside' },
    { date: '2025-06-11', day: 'WED', punchIn: '', punchOut: '', total: '', color: '#EF9A9A', status: 'Absent' },
    { date: '2025-06-12', day: 'THU', punchIn: '09:00 AM', punchOut: '06:00 PM', total: '09:00', color: 'green', status: 'Present' },
    { date: '2025-06-13', day: 'FRI', punchIn: '', punchOut: '', total: '', color: '#FFE082', status: 'Miss Punch' },
    { date: '2025-06-14', day: 'SAT', punchIn: '00:00 AM', punchOut: '00:00 PM', total: '00:00', color: '#CE93D8', status: 'Leave' },
    { date: '2025-06-15', day: 'SUN', punchIn: '09:00 AM', punchOut: '06:00 PM', total: '09:00', color: '#90CAF9', status: 'Holiday' }
  ];

  const subAttendance = [
    {
      name: 'John Doe',
      photo: 'https://as2.ftcdn.net/v2/jpg/03/64/21/11/1000_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg',
      date: '2025-06-06',
      punchIn: '09:00 AM',
      punchOut: '06:00 PM',
      total: '09:00'
    },
    {
      name: 'Jane Smith',
      photo: 'https://thumbs.dreamstime.com/z/profile-picture-smiling-indian-young-businesswoman-look-camera-posing-workplace-headshot-portrait-happy-millennial-ethnic-190959731.jpg',
      date: '2025-06-07',
      punchIn: '',
      punchOut: '',
      total: ''
    },
    {
      name: 'Alice Johnson',
      photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
      date: '2025-06-06',
      punchIn: '09:15 AM',
      punchOut: '06:10 PM',
      total: '08:55'
    },
    {
      name: 'Bob Williams',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
      date: '2025-06-06',
      punchIn: '',
      punchOut: '',
      total: ''
    },
    {
      name: 'Charlie Brown',
      photo: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126',
      date: '2025-06-06',
      punchIn: '08:55 AM',
      punchOut: '05:50 PM',
      total: '08:55'
    },
    {
      name: 'Diana Prince',
      photo: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39',
      date: '2024-12-06',
      punchIn: '',
      punchOut: '',
      total: ''
    },
    {
      name: 'Ethan Hunt',
      photo: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167',
      date: '2024-12-06',
      punchIn: '09:05 AM',
      punchOut: '06:00 PM',
      total: '08:55'
    },
    {
      name: 'Fiona Glenanne',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      date: '2024-12-06',
      punchIn: '',
      punchOut: '',
      total: ''
    },
    {
      name: 'George Martin',
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
      date: '2024-12-06',
      punchIn: '09:10 AM',
      punchOut: '06:05 PM',
      total: '08:55'
    },
    {
      name: 'Hannah Baker',
      photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
      date: '2024-12-06',
      punchIn: '',
      punchOut: '',
      total: ''
    },
    {
      name: 'Ivan Petrov',
      photo: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12',
      date: '2024-12-06',
      punchIn: '09:00 AM',
      punchOut: '06:00 PM',
      total: '09:00'
    },
    {
      name: 'Julia Roberts',
      photo: 'https://images.unsplash.com/photo-1502767089025-6572583495b0',
      date: '2024-12-06',
      punchIn: '',
      punchOut: '',
      total: ''
    }
  ];

useEffect(()=>{
  if (employee) {
    dispatch(getAttHistoryAsync(employee.empid)).then((res)=>{
      console.log("return res", res);
    }).catch((err)=>{
      console.log("errror ",err);
    })
  }
},[employee])

  const pad = s => s.split('-').map((v, i) => i > 0 ? v.padStart(2, '0') : v).join('-');
  const markedDates = {};
  if (activeSub) {
    const d = pad(activeSub.date);
    markedDates[d] = {
      customStyles: {
        container: { backgroundColor: '#A5D6A7', borderRadius: 8 },
        text: { color: '#000', fontWeight: 'bold' }
      }
    };
  } else {
    attendance.forEach(item => {
      const d = pad(item.date);
      const dayOfWeek = new Date(item.date).getDay();
      const isHoliday = item.status === 'Holiday' || dayOfWeek === 0;
      const color = isHoliday ? '#E53935' : item.color;

      markedDates[d] = {
        customStyles: {
          container: { backgroundColor: color, borderRadius: 8 },
          text: { color: '#000', fontWeight: 'bold' }
        }
      };
    });
  }

  const currentMonth = new Date().toISOString().slice(0, 7);

  const handleDayPress = day => {

    setSelectedRecord(null);
    const rec = attendance.find(a => pad(a.date) === day.dateString)
      || (activeSub && pad(activeSub.date) === day.dateString && activeSub);

    const { date = day.dateString, punchIn = '', punchOut = '', total = '', status = 'No Data' } = rec || {};

    setSelectedRecord({
      date,
      punchIn: punchIn || '00:00',
      punchOut: punchOut || '00:00',
      total: total || '00:00',
      status
    });
  };

  const handleLeave =()=>{
    navigation.navigate('Leave')
  }

  return (
    <SafeAreaView style={styles.container}>
      {!showCalendar && (
        <View style={styles.tabContainer}>
          {['My Attendance', 'Sub-ordinate'].map(tab => (
            <TouchableOpacity key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => {
                setActiveTab(tab);
                setActiveSub(null);
                setExpandedSub(null);
              }}>
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {showCalendar ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={styles.legend}>
            {[
              { col: '#EF9A9A', label: 'Absent' },
              { col: '#A5D6A7', label: 'Present' },
              { col: '#FFE082', label: 'Miss Punch' },
              { col: '#CE93D8', label: 'Leave' },
              { col: '#90CAF9', label: 'Outside' },
              { col: '#E53935', label: 'Holiday' }
            ].map((l, i) => (
              <View key={i} style={[styles.legendItem, { borderBottomColor: l.col }]}>
                <Text style={styles.legendText}>{l.label}</Text>
              </View>
            ))}
          </View>

          <Calendar
            current={`${currentMonth}-01`}
            markingType='custom'
            markedDates={markedDates}
            onDayPress={handleDayPress}
            theme={{
              calendarBackground: '#fff',
              dayTextColor: '#333',
              monthTextColor: '#E53935',
              arrowColor: '#E53935',
              todayTextColor: '#E53935'
            }}
            style={styles.calendar}
          />

          {selectedRecord && (
            <View style={styles.detailCard}>
              <View style={[styles.cardHeader, { backgroundColor: selectedRecord.color || '#E53935' }]}>
                <Text style={styles.headerText}>{selectedRecord.date}</Text>
                <Ionicons name="close" size={20} style={{ color: "white" }} onPress={() => setSelectedRecord(null)} />
              </View>

              <View style={styles.cardBody}>
                <View style={styles.row}>
                  <Text style={styles.label}>Punch In:</Text>
                  <Text style={styles.value}>{selectedRecord.punchIn}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Punch Out:</Text>
                  <Text style={styles.value}>{selectedRecord.punchOut}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Total:</Text>
                  <Text style={styles.value}>{selectedRecord.total}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Status:</Text>
                  <Text style={styles.value}>{selectedRecord.status}</Text>
                </View>
              </View>
              {
                activeTab === "My Attendance" && (
                  <View style={styles.cardFooter}>
                    <TouchableOpacity style={[styles.footerBtn, styles.btnLeave]} onPress={handleLeave}>
                      <Text style={styles.btnText}>Apply Leave</Text>
                    </TouchableOpacity>
                    {
                      selectedRecord.status != "No Data" && (
                        <TouchableOpacity style={[styles.footerBtn, styles.btnReg]}>
                          <Text style={styles.btnText}>Regularisation</Text>
                        </TouchableOpacity>
                      )
                    }
                  </View>
                )
              }

            </View>
          )}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {activeTab === 'My Attendance' ? (
            attendance.map((it, i) => (
              <View key={i} style={styles.recordRow}>
                <View style={[styles.dateBox, { backgroundColor: it.color }]}>
                  <Text style={styles.dateText}>{it.date.slice(-2)}</Text>
                  <Text style={styles.dayText}>{it.day}</Text>
                </View>
                <View style={styles.recordDetails}>
                  <Text style={styles.value}>Punch In: {it.punchIn || '00:00'}</Text>
                  <Text style={styles.value}>Out: {it.punchOut || '00:00'}</Text>
                  <Text style={styles.value}>Total: {it.total || '00:00'}</Text>
                </View>
              </View>
            ))
          ) : (
            subAttendance.map((it, i) => (
              <View key={i}>
                <TouchableOpacity style={styles.subRecordRow}
                  onPress={() => setExpandedSub(expandedSub === i ? null : i)}>
                  <Image source={{ uri: it.photo }} style={styles.employeePhoto} />
                  <View style={styles.subDetails}>
                    <Text style={styles.nameText}>{it.name}</Text>
                    <Text style={styles.value}>Date: {it.date}</Text>
                    <Text style={styles.value}>In: {it.punchIn || '00:00'}</Text>
                    <Text style={styles.value}>Out: {it.punchOut || '00:00'}</Text>
                    {it.total ? <Text style={styles.value}>Total: {it.total}</Text> : null}
                  </View>
                  <View style={styles.subButtons}>
                    <TouchableOpacity style={styles.iconBtn}
                      onPress={() => {
                        setShowCalendar(true);
                        setActiveSub(it);
                      }}>
                      <Ionicons name="calendar-outline" size={24} color="#E53935" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                      <Ionicons name="location-outline" size={24} color="#E53935" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
                {expandedSub === i && (
                  <View style={styles.accordionDetail}>
                    <Text style={styles.detailTitle}>Attendance Details</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Date:</Text>
                      <Text style={styles.detailValue}>{it.date}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Punch In:</Text>
                      <Text style={styles.detailValue}>{it.punchIn || 'N/A'}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Punch Out:</Text>
                      <Text style={styles.detailValue}>{it.punchOut || 'N/A'}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Total Hour:</Text>
                      <Text style={styles.detailValue}>{it.total || '00:00 hr'}</Text>
                    </View>
                  </View>

                )}
              </View>
            ))
          )}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.toggleFloating}
        onPress={() => {
          setShowCalendar(v => !v);
          setSelectedRecord(null);
        }}>
        <Ionicons name={showCalendar ? 'list-outline' : 'calendar-number-outline'} size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );

};

export default AttendanceHistory; 

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 14 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  tabContainer: { flexDirection: 'row', marginBottom: 10, gap: 20 },
  tab: { flex: 1, padding: 8, borderWidth: 1, borderColor: '#E53935', borderRadius: 5, alignItems: 'center' },
  activeTab: { backgroundColor: '#E53935' },
  tabText: { color: '#E53935', fontWeight: '600' },
  activeTabText: { color: '#fff' },
  legend: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 5 },
  legendItem: { paddingBottom: 4, marginRight: 10, marginBottom: 8, borderBottomWidth: 4, alignSelf: 'flex-start' },
  legendText: { fontSize: 12, color: '#333' },
  calendar: { borderRadius: 10, marginBottom: 10, elevation: 2 },
  calendarDetailCard: { margin: 10, padding: 12, backgroundColor: '#fff', borderRadius: 8, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 1 } },
  scroll: { paddingBottom: 80 },
  recordRow: { flexDirection: 'row', padding: 10, marginBottom: 8, backgroundColor: '#f9f9f9', borderRadius: 8, alignItems: 'center' },
  dateBox: { width: 60, height: 60, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  dateText: { fontSize: 14, fontWeight: 'bold' },
  dayText: { fontSize: 10, textAlign: 'center' },
  recordDetails: { flex: 1 },
  value: { fontSize: 14, fontWeight: '600', color: '#333' },
  subRecordRow: { flexDirection: 'row', alignItems: 'center', padding: 10, marginBottom: 8, backgroundColor: '#f9f9f9', borderRadius: 8 },
  employeePhoto: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ccc' },
  subDetails: { flex: 1, marginHorizontal: 10 },
  nameText: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  subButtons: { flexDirection: 'row' },
  iconBtn: { marginLeft: 8, padding: 4 },
  accordionDetail: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginHorizontal: 8, marginBottom: 10, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  detailTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#E53935', textAlign: 'center', borderBottomWidth: 2, borderBottomColor: "#E53935", paddingBottom: 4 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  detailLabel: { fontSize: 14, color: '#555', fontWeight: '600' },
  detailValue: { fontSize: 14, color: '#222', fontWeight: '600' },
  toggleFloating: { position: 'absolute', bottom: 70, right: 20, flexDirection: 'row', backgroundColor: '#E53935', padding: 8, borderRadius: 20, elevation: 4 },
  toggleText: { color: '#fff', marginLeft: 5 },
  detailCard: { width: '100%', borderRadius: 8, overflow: 'hidden', marginVertical: 10, elevation: 5, backgroundColor: '#fff' },
  cardHeader: { padding: 10, flexDirection: "row", justifyContent: "space-between" },
  headerText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  cardBody: { paddingHorizontal: 20, paddingVertical: 20, backgroundColor: '#fff', flexDirection: 'column', gap: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 14, color: '#555' },
  cardFooter: { flexDirection: 'column', gap: 5, padding: 10, backgroundColor: '#f9f9f9' },
  footerBtn: { marginHorizontal: 8, paddingVertical: 10, borderRadius: 5, alignItems: 'center' },
  btnLeave: { backgroundColor: 'green' },
  btnReg: { backgroundColor: '#E53935' },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '600' }
});