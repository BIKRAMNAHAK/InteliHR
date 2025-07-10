import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { getInfoAsync } from '../services/Actions/employeeAction';
 // ✅ Replace with actual path

const AttendanceTimelineCard = ({ record }) => {
    const {
        intime, outtime, total_time, att_status,
        att_type, remark, attdate, latitude,
        longitude, chackout_leti, chackout_longi, attfrom
    } = record;

    console.log("attform", record);
    

    const inLocation = `${latitude}, ${longitude}`;
    const outLocation = `${chackout_leti}, ${chackout_longi}`;
    const inTime = intime || '--:--';
    const outTime = outtime || '--:--';
    const totalHours = total_time || '--:--';
    const status = att_status || 'Unknown';
    const type = att_type || 'Unknown';
    const date = attdate ? moment(attdate, ['YYYY-MM-DD', 'DD/MM/YYYY']).format('MM/DD/YYYY') : '__/__/__';

    const statusColors = {
        present: '#4CAF50',
        pending: '#FFC107',
        absent: '#F44336',
    };
    const typeColors = {
        'on-time': '#4CAF50',
        'late': '#F44336',
        'pending': '#FFC107',
    };

    const statusColor = statusColors[status.toLowerCase()] || '#333';
    const typeColor = typeColors[type.toLowerCase()] || '#333';

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.headerText}>{date}</Text>
                {
                    attfrom == "Mobile" ? (
                        <MaterialCommunityIcons name="cellphone" size={20} color="white" />
                    ) : attfrom === "Web" ? (
                        <MaterialCommunityIcons name="web" size={20} color="white" />
                    ) : attfrom === "Biometric" ? (
                        <MaterialCommunityIcons name="fingerprint" size={20} color="white" />
                    ) : (
                        <MaterialCommunityIcons name="help-circle" size={20} color="white" />
                    )
                }
            </View>

            <View style={styles.body}>
                <View style={styles.timeline}>
                    <View style={styles.dot}>
                        <MaterialCommunityIcons name="map-marker" size={20} color="red" />
                    </View>
                    <View style={styles.line} />
                    <View style={styles.dot}>
                        <MaterialCommunityIcons name="map-marker" size={20} color="red" />
                    </View>
                </View>

                <View style={styles.details}>
                    <Text style={styles.locText}>Check In: {inLocation}</Text>
                    <View style={styles.timeContainer}>
                        <View style={styles.timeLineContainer}>
                            <Text style={styles.totalHoursText}>{totalHours}</Text>
                            <View style={styles.timeLineRow}>
                                <Text style={styles.timeEnd}>{inTime}</Text>
                                <View style={styles.horizontalLine} />
                                <Text style={styles.timeEnd}>{outTime}</Text>
                            </View>
                        </View>
                        <View style={styles.statusRow}>
                            <Text>Status: <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text></Text>
                            <Text>Type: <Text style={[styles.typeText, { color: typeColor }]}>{type}</Text></Text>
                        </View>
                    </View>
                    {remark ? <Text style={styles.remarkText}>Remark: {remark}</Text> : null}
                    <Text style={styles.locText}>Check Out: {
                        !chackout_leti || chackout_leti === "null" || !chackout_longi || chackout_longi === "null"
                            ? ""
                            : outLocation
                    }</Text>
                </View>
            </View>
        </View>
    );
};

export default function Attendance_rec({ route }) {
    const { empid, date } = route.params || {};
    const dispatch = useDispatch();

    const [attendanceData, setAttendanceData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAttendanceData = async () => {
        if (!empid || !date) return;

        try {
            setRefreshing(true);
            const res = await dispatch(getInfoAsync({ empid, date }));
            if (res?.status === "200" && res?.Data) {
                setAttendanceData(res.Data);
            } else {
                setAttendanceData([]); // show empty state
            }
        } catch (err) {
            console.log("Fetch Error:", err);
            setAttendanceData([]);
        } finally {
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchAttendanceData(); // Refresh when screen comes back in focus
        }, [])
    );

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchAttendanceData} />}
        >
            {attendanceData.length === 0 ? (
                <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>📭 Attendance record not found for today</Text>
                </View>
            ) : (
                attendanceData.map((record, index) => (
                    <AttendanceTimelineCard key={index} record={record} />
                ))
            )}
        </ScrollView>
    );
}

// ✅ Styles
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f7f7f7' },
    header: {
        padding: 12,
        backgroundColor: '#E53935',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
    },
    headerText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    card: {
        margin: 8,
        borderRadius: 8,
        backgroundColor: '#fff',
        elevation: 3,
        overflow: 'hidden',
    },
    body: { flexDirection: 'row', padding: 16 },
    timeline: { width: 40, alignItems: 'center' },
    timeLineContainer: {
        alignItems: 'center',
        marginVertical: 12,
    },
    totalHoursText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
        marginBottom: 6,
    },
    timeLineRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    timeEnd: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        width: 60,
        textAlign: 'center',
    },
    horizontalLine: {
        flex: 1,
        height: 2,
        backgroundColor: '#E53935',
        marginHorizontal: 8,
    },
    dot: {
        width: 30,
        height: 30,
        borderRadius: 50,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#eee',
        borderWidth: 2,
    },
    line: {
        flex: 1,
        width: 2,
        backgroundColor: '#E53935',
    },
    details: { flex: 1, paddingLeft: 12 },
    locText: { fontSize: 14, color: '#333', marginBottom: 4, fontWeight: '700' },
    timeContainer: { paddingVertical: 8, elevation: 16 },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statusText: { fontSize: 14, fontWeight: '600' },
    typeText: { fontSize: 14, fontWeight: '600' },
    remarkText: {
        marginTop: 8,
        fontSize: 13,
        color: '#777',
    },
    emptyBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
        fontWeight: '600',
        textAlign: 'center',
    },
});
