import React, { useCallback, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

import { getInfoAsync } from '../services/Actions/employeeAction';
import ScreenWithBackHandler from '../navigation/ScreenWithBackHandler';

const AttendanceTimelineCard = ({ record }) => {
  const {
    intime, outtime, total_time, att_status, att_type,
    remark, attdate, latitude, longitude,
    chackout_leti, chackout_longi, attfrom
  } = record;

  const inTime = intime || '--:--';
  const outTime = outtime || '--:--';
  const date = attdate ? moment(attdate, ['YYYY-MM-DD', 'DD/MM/YYYY']).format('DD/MM/YYYY') : '__/__/__';
  const inLoc = `${latitude}, ${longitude}`;
  const outLoc = `${chackout_leti}, ${chackout_longi}`;

  const statusColor = {
    present: '#4CAF50', pending: '#FFC107', absent: '#F44336'
  }[att_status?.toLowerCase()] || '#333';

  const typeColor = {
    'on-time': '#4CAF50', late: '#F44336', pending: '#FFC107'
  }[att_type?.toLowerCase()] || '#333';

  const iconMap = {
    Mobile: 'cellphone', Web: 'web', Biometric: 'fingerprint'
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}><Text style={styles.headerText}>{date}</Text></View>
      <View style={styles.card}>
        <View style={styles.body}>
          <View style={styles.timeline}>
            <View style={styles.dot}><MaterialCommunityIcons name="map-marker" size={20} color="green" /></View>
            <View style={styles.line} />
            <View style={styles.dot}><MaterialCommunityIcons name="map-marker" size={20} color="red" /></View>
          </View>

          <View style={styles.details}>
            <View style={styles.rowBetween}>
              <Text style={styles.locText}>Check In: {inLoc}</Text>
              <MaterialCommunityIcons name={iconMap[attfrom] || 'help-circle'} size={20} color="red" />
            </View>

            <View style={styles.timeContainer}>
              <View style={styles.timeLineContainer}>
                <Text style={styles.totalHoursText}>{total_time || '--:--'}</Text>
                <View style={styles.timeLineRow}>
                  <Text style={styles.timeEnd}>{inTime}</Text>
                  <View style={styles.horizontalLine} />
                  <Text style={styles.timeEnd}>{outTime}</Text>
                </View>
              </View>
              <View style={styles.statusRow}>
                <Text>Status: <Text style={{ color: statusColor, fontWeight: '600' }}>{att_status}</Text></Text>
                <Text>Type: <Text style={{ color: typeColor, fontWeight: '600' }}>{att_type}</Text></Text>
              </View>
            </View>

            {remark ? (
              <>
                <Text>Remark:</Text>
                <View style={styles.remarkBox}>
                  <ScrollView nestedScrollEnabled><Text style={styles.remarkText}>{remark}</Text></ScrollView>
                </View>
              </>
            ) : null}

            <View style={styles.rowBetween}>
              <Text style={styles.locText}>Check Out: {(!chackout_leti || chackout_leti === "null") ? '' : outLoc}</Text>
              {!outTime ? <MaterialCommunityIcons name={iconMap[attfrom] || 'help-circle'} size={20} color="red" /> : null}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function Attendance_rec({ route }) {
  const { empid, date } = route.params || {};
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [attendanceData, setAttendanceData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAttendanceData = async () => {
    if (!empid || !date) return;
    try {
      setRefreshing(true);
      const res = await dispatch(getInfoAsync({ empid, date }));
      setAttendanceData(res?.status === "200" ? res.Data : []);
    } catch (err) {
      console.log("Fetch Error:", err);
      setAttendanceData([]);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchAttendanceData(); }, []));

  return (
    <ScreenWithBackHandler onBack={() => navigation.goBack()}>
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchAttendanceData} />}
      >
        {attendanceData.length === 0 ? (
          <View style={styles.emptyBox}><Text style={styles.emptyText}>📭 Attendance record not found for today</Text></View>
        ) : (
          attendanceData.map((rec, idx) => <AttendanceTimelineCard key={idx} record={rec} />)
        )}
      </ScrollView>
    </ScreenWithBackHandler>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  cardContainer: { paddingHorizontal: 10, marginBottom: 10, marginTop: 10 },
  header: {
    padding: 12,
    backgroundColor: '#E53935',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  headerText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  card: { borderRadius: 8, backgroundColor: '#fff', elevation: 3 },
  body: { flexDirection: 'row', padding: 10 },
  timeline: { width: 30, alignItems: 'center' },
  dot: {
    width: 30, height: 30, borderRadius: 50, backgroundColor: 'white',
    alignItems: 'center', justifyContent: 'center', borderColor: '#eee', borderWidth: 2,
  },
  line: { flex: 1, width: 2, backgroundColor: '#E53935' },
  details: { flex: 1, paddingLeft: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: "space-between" },
  locText: { fontSize: 14, color: '#333', marginBottom: 4, fontWeight: '700' },
  timeContainer: { paddingVertical: 8 },
  timeLineContainer: { alignItems: 'center', marginVertical: 8 },
  totalHoursText: { fontSize: 14, fontWeight: '600', color: '#444', marginBottom: 6 },
  timeLineRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  timeEnd: { fontSize: 14, fontWeight: '600', color: '#333', width: 60, textAlign: 'center' },
  horizontalLine: { flex: 1, height: 2, backgroundColor: '#E53935', marginHorizontal: 8 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-around' },
  remarkBox: { maxHeight: 50, backgroundColor: "#eee", padding: 10, borderRadius: 10 },
  remarkText: { fontSize: 13, color: '#000' },
  emptyBox: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100, padding: 20 },
  emptyText: { fontSize: 16, color: '#888', fontWeight: '600', textAlign: 'center' },
});
