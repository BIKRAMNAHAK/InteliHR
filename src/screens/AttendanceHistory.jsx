import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Dimensions, Image
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { getAttHistoryAsync, getInfoAsync } from '../services/Actions/employeeAction';
import { useLoading } from '../navigation/LoadingContext';
import ScreenWithBackHandler from '../navigation/ScreenWithBackHandler';

const { width } = Dimensions.get('window');

const AttendanceHistory = ({ navigation }) => {
  const { employee } = useSelector((state) => state.employee);
  const dispatch = useDispatch();
  const { loading, setLoading } = useLoading();

  const [showCalendar, setShowCalendar] = useState(false);
  const [activeTab, setActiveTab] = useState('My Attendance');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const [expandedSub, setExpandedSub] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [singleDayAtt, setSingleDayAtt] = useState([])


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

  // generate month dates 

  const formatDateToLocalISO = date => {
    const offset = date.getTimezoneOffset() * 60000; // offset in ms
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().slice(0, 10);     // 'YYYY-MM-DD'
  };

  const generateMonthDates = (year, month) => {
    const daysInMonth = new Date(year, month, 0).getDate(); // month is 1-based
    const dates = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);         // JS Date months are 0-based
      const formattedDate = formatDateToLocalISO(date);    // corrected local YYYY-MM-DD
      const dayLabel = date
        .toLocaleDateString('en-CA', { weekday: 'short' })
        .toUpperCase();

      // console.log("dates", formattedDate, dayLabel);

      const isSunday = date.getDay() === 0;                // Sunday = 0
      const status = isSunday ? 'Holiday' : 'Absent';

      dates.push({
        date: formattedDate,
        day: dayLabel,
        punchIn: '',
        punchOut: '',
        total: '',
        color: '#ddd',
        status
      });
    }

    return dates;
  };

  // Function to get background color based on status
  function getBgColor(status) {
    switch (status) {
      case 'Absent': return '#EF9A9A';
      case 'Present': return '#9dd49eff';
      case 'Miss punch': return '#FFE082';
      case 'Leave': return '#CE93D8';
      case 'Outside': return '#90CAF9';
      case 'Holiday': return '#E53935';
      default: return '#ddd';
    }
  }

  // Fetch attendance history on component mount
  useEffect(() => {
    if (!employee) return;
    setLoading(true);
    dispatch(getAttHistoryAsync(employee.empid))
      .then((res) => {
        console.log("res", res);

        setLoading(false);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Midnight for date-only comparison

        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const allDates = generateMonthDates(year, month);
        const color = '';

        // --- Group raw data by attdate ---
        const groupedData = res?.Data?.reduce((acc, curr) => {
          const date = curr.attdate;

          if (!acc[date]) {
            acc[date] = {
              ...curr,
              intime: curr.intime || '',
              outtime: curr.outtime || ''
            };
          } else {
            // Earliest punch-in
            if (curr.intime && (!acc[date].intime || curr.intime < acc[date].intime)) {
              acc[date].intime = curr.intime;
            }
            // Latest punch-out
            if (curr.outtime && (!acc[date].outtime || curr.outtime > acc[date].outtime)) {
              acc[date].outtime = curr.outtime;
            }
          }

          return acc;
        }, {});

        const groupedArray = Object.values(groupedData);

        const attMap = {};
        groupedArray.forEach((item) => {
          const date = item.attdate;
          const punchIn = item.intime || '';
          const punchOut = item.outtime || '';
          const statusRaw = item.att_status || "Absent";
          const status = statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1).toLowerCase();

          // --- Calculate total hours ---
          let total = '';
          if (punchIn && punchOut) {
            const inTime = new Date(`${date}T${punchIn}`);
            const outTime = punchOut ? new Date(`${date}T${punchOut}`) : new Date(); // if no outTime, use current time

            const diffMs = outTime - inTime;
            if (diffMs > 0) {
              const hours = Math.floor(diffMs / (1000 * 60 * 60));
              const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
              total = `${hours}h ${minutes}m`;
            }
          }

          attMap[date] = {
            date,
            day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
            punchIn,
            punchOut,
            total, // dynamic total time
            arrival_status: item.arrival_status,
            lateby: item.late_by,
            early_by: item.early_by,
            color,
            status,
            isPast: new Date(date) <= today,
          };
        });

        const finalAttendance = allDates.map((dateObj) => {
          const rec = attMap[dateObj.date];
          if (rec) return rec;

          const recDate = new Date(dateObj.date);
          const absentRecord = {
            ...dateObj,
            day: recDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
            punchIn: '',
            punchOut: '',
            total: '',
            arrival_status: '',
            lateby: '',
            early_by: '',
            isPast: recDate <= today,
          };

          if (absentRecord.isPast && absentRecord.day !== 'SUN') {
            absentRecord.status = 'Absent';
          } else if (absentRecord.isPast && absentRecord.day == 'SUN') {
            absentRecord.status = 'Holiday';
          } else {
            absentRecord.status = '';
          }

          return absentRecord;
        });

        setAttendance(finalAttendance);
      })
      .catch((err) => {
        setLoading(false);
        console.error("Failed to fetch attendance", err);
      });
  }, [employee, dispatch]);

  // console.log("att status", attendance);

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
      const isHoliday = item.status?.toLowerCase() === 'holiday' || dayOfWeek === 0;
      const color = isHoliday ? '#E53935' : getBgColor(item.status);

      markedDates[d] = {
        customStyles: {
          container: { backgroundColor: color, borderRadius: 8 },
          text: { color: '#000', fontWeight: 'bold' }
        }
      };
    });

  }

  const currentMonth = new Date().toISOString().slice(0, 7);

  const handleDayPress = async (day) => {
    const selectedDate = pad(day.dateString); // normalize date format

    const apiRecords = await handleFetchSingleRecAtt(selectedDate, employee.empid);
    const allRecords = attendance.filter(a => pad(a.date) === selectedDate);
    
    // Add activeSub if it's for this date
    if (activeSub && pad(activeSub.date) === selectedDate) {
      allRecords.push(activeSub);
    }

    // Normalize dates for API too
    const normalizedApi = apiRecords.map(r => ({
      ...r,
      date: r.attdate ? r.attdate : allRecords.find(a => a.date === selectedDate)?.date || selectedDate
    }));
    
    // Combine, but remove duplicates (prefer API data over local)
    const combined = [
      ...normalizedApi,
      ...allRecords.filter(local => !normalizedApi.some(api => api.date === pad(local.date)))
    ];

    setSelectedRecord(combined.length ? combined : [{
      date: selectedDate,
      intime: '00:00',
      outtime: '00:00',
      total_time: '00:00',
      att_status: 'Absent'
    }]);
  };

  const handleLeave = () => {
    navigation.navigate('Leave');
  };

  const handleFetchSingleRecAtt = async (date, empid) => {
    try {
      setLoading(true);
      const response = await dispatch(getInfoAsync({ date, empid }));
      const records = response?.Data || [];
      // console.log("Single day data:", response);
      setSingleDayAtt(response.Data || [])
      setLoading(false);

      const index = attendance.findIndex(item => item.date === date);
      if (index !== -1) {
        setExpandedSub(index);
      }

      return records;
    } catch (err) {
      setLoading(false);
      console.error("Failed to fetch single record:", err);
    }
  };

  console.log("single rec: ", attendance);

  return (
    <ScreenWithBackHandler onBack={() => navigation.goBack()}>
      <View style={styles.headerTitle}>
        <Text style={styles.title}>{activeTab === 'My Attendance' ? 'My Attendance  Rec' : `Sub-Ordinate's Rec`} </Text>
      </View>
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
                { col: '#FFE082', label: 'Miss punch' },
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
                todayTextColor: '#E53935',
                textSectionTitleColor: 'black',
              }}
              style={styles.calendar}
            />

            {selectedRecord && (
              <View style={styles.accordionDetail1}>
                <View style={[styles.cardHeader, { backgroundColor: '#E53935' }]}>
                  <Text style={styles.headerText}>{selectedRecord[0]?.date}</Text>
                  <Ionicons name="close" size={20} style={{ color: "white" }} onPress={() => setSelectedRecord(null)} />
                </View>

                <ScrollView style={{ maxHeight: 250 }} nestedScrollEnabled={true}>
                  {selectedRecord.map((att, idx) => (
                    <View key={idx} style={{ elevation: 16, marginBottom: 10, backgroundColor: '#fff', padding: 10 }}>

                      {/* Attendance Details */}
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Check In:</Text>
                        <Text style={styles.detailValue}>{att.intime || '00:00:00'}</Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Check Out:</Text>
                        <Text style={styles.detailValue}>{att.outtime || '00:00:00'}</Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Shift:</Text>
                        <Text style={styles.detailValue}>{att.shift || 'N/A'}</Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Total Hour:</Text>
                        <Text style={styles.detailValue}>{att.total_time || '00:00 hr'}</Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Remarks:</Text>
                        <Text style={styles.detailValue}>{att.remark || 'N/A'}</Text>
                      </View>

                        {/* Footer with Buttons */}
                  {activeTab === "My Attendance" && (
                    <View style={styles.cardFooter}>
                      {
                        new Date(att.date).getTime() > new Date().setHours(0, 0, 0, 0) && (
                          <TouchableOpacity
                            style={[styles.footerBtn, styles.btnLeave]}
                            onPress={handleLeave}
                          >
                            <Text style={styles.btnText}>Apply Leave</Text>
                          </TouchableOpacity>
                        )
                      }

                      {
                        ((!singleDayAtt[0]?.intime || !singleDayAtt[0]?.outtime) &&
                          new Date(att.date).getTime() < new Date().setHours(0, 0, 0, 0)) && (
                          <TouchableOpacity style={[styles.footerBtn, styles.btnReg]}>
                            <Text style={styles.btnText}>Regularisation</Text>
                          </TouchableOpacity>
                        )
                      }

                    </View>
                  )}
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

          </ScrollView>
        ) : (
          <ScrollView contentContainerStyle={styles.scroll}>
            {activeTab === 'My Attendance' ? (
              attendance.map((it, i) => {

                const isWhiteText =
                  it.status === 'Leave' ||
                  it.status === 'Holiday' ||
                  it.status === 'Absent' ||
                  it.day === 'SUN' ||
                  it.punchIn === '';

                return (
                  <View key={i}>
                    <TouchableOpacity
                      style={[styles.subRecordRow, { backgroundColor: '#edf0f0ff' }]}
                      onPress={() =>
                        expandedSub === i
                          ? setExpandedSub(null)
                          : handleFetchSingleRecAtt(it.date, employee.empid)
                      }
                    >

                      <View style={[styles.dateBox, { backgroundColor: getBgColor(it.status) }]}>
                        <Text style={styles.dateText}>{it.date.slice(-2)}</Text>
                        <Text style={styles.dayText}>{it.day}</Text>
                      </View>

                      <View style={styles.subDetails}>
                        {/* Arrival */}
                        <View style={styles.row}>
                          <Text style={[styles.label2, isWhiteText && { color: 'black' }]}>
                            Check In:
                          </Text>
                          {(!it.punchIn && !it.punchOut) ? (
                            <Text style={[styles.value, isWhiteText && { color: 'black' }]}>
                              00:00:00
                            </Text>
                          ) : (
                            <Text
                              style={[
                                styles.value,
                                { color: it.arrival_status === 'Late' ? 'red' : 'green' },
                                isWhiteText && { color: 'black' },
                              ]}
                            >
                              {it.punchIn || '00:00:00'}

                            </Text>
                          )}
                        </View>

                        {/* Leave */}
                        <View style={styles.row}>
                          <Text style={[styles.label2, isWhiteText && { color: 'black' }]}>
                            Check Out:
                          </Text>
                          <Text style={[styles.value, { color: it.checkOut && it.lateby === '0m' ? 'green' : 'red' }, isWhiteText && { color: 'black' },]}>
                            {it.punchOut || '00:00:00'}
                          </Text>
                        </View>


                        {/* Status */}
                        <View style={styles.row}>
                          <Text style={[styles.label2, isWhiteText && { color: 'black' }]}>
                            Status:
                          </Text>
                          <View style={styles.statusRow}>
                            <View
                              style={[
                                styles.statusCircle,
                                {
                                  backgroundColor:
                                    it.status === 'Absent'
                                      ? '#EF9A9A'
                                      : it.status === 'Leave'
                                        ? '#CE93D8'
                                        : it.status === 'Holiday'
                                          ? '#E53935'
                                          : it.status === 'Outside'
                                            ? '#90CAF9'
                                            : it.status === 'Miss punch'
                                              ? '#fdcb35ff'
                                              : it.status === 'Present'
                                                ? 'green'
                                                : 'gray',
                                },
                              ]}
                            >
                              <Text style={styles.circleText}>
                                {it.status ? it.status.charAt(0).toUpperCase() : '-'}
                              </Text>
                            </View>
                            <Text style={[
                              styles.value, {
                                color:
                                  it.arrival_status === 'Late' ? 'red' :
                                    it.status === 'Absent' ? '#EF9A9A' :
                                      it.status === 'Leave' ? '#CE93D8' :
                                        it.status === 'Holiday' ? '#E53935' :
                                          it.status === 'Outside' ? '#90CAF9' :
                                            it.status === 'Miss punch' ? '#FFE082' :
                                              it.status === 'Present' ? 'green' : 'black'
                              }
                            ]}>
                              {it.lateby && it.arrival_status == 'Late'
                                ? ` (${it.arrival_status} by ,${it.lateby})`
                                : ''}
                            </Text>
                          </View>
                        </View>

                        {/* Working Hour */}
                        <View style={styles.row}>
                          <Text style={[styles.label2, isWhiteText && { color: 'black' }]}>
                            Working Hour:
                          </Text>
                          <Text style={[styles.value, isWhiteText && { color: 'black' }]}>
                            {it.total || '00:00:00'}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    {/* Accordion Detail Below */}
                    {expandedSub === i && (
                      <View style={styles.accordionDetail}>
                        <View style={styles.AttcardHeader}>
                          <Text style={styles.detailTitle}>Attendance Details</Text>
                          <Text style={styles.detailValue}>{it.date}</Text>
                        </View>

                        <ScrollView style={{ maxHeight: 250 }} nestedScrollEnabled={true}>
                          {singleDayAtt.map((att, idx) => (
                            <View key={idx} style={{ elevation: 16, marginBottom: 10, backgroundColor: '#fff', padding: 10 }}>
                              <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Check In:</Text>
                                <Text style={styles.detailValue}>{att.intime || 'N/A'}</Text>
                              </View>
                              <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Check Out:</Text>
                                <Text style={styles.detailValue}>{att.outtime || '00:00:00'}</Text>
                              </View>
                              <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Shift:</Text>
                                <Text style={styles.detailValue}>{att.shift || 'N/A'}</Text>
                              </View>
                              <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Total Hour:</Text>
                                <Text style={styles.detailValue}>{att.total_time || '00:00 hr'}</Text>
                              </View>
                              <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Remarks:</Text>
                                <Text style={styles.detailValue}>{att.remarks || 'N/A'}</Text>
                              </View>
                            </View>
                          ))}
                        </ScrollView>

                        <View style={styles.cardFooter}>
                          {
                            new Date(it.date).getTime() > new Date().setHours(0, 0, 0, 0) && (
                              <TouchableOpacity
                                style={[styles.footerBtn, styles.btnLeave]}
                                onPress={handleLeave}
                              >
                                <Text style={styles.btnText}>Apply Leave</Text>
                              </TouchableOpacity>
                            )
                          }

                          {
                            ((!singleDayAtt[0]?.intime || !singleDayAtt[0]?.outtime) &&
                              new Date(it.date).getTime() < new Date().setHours(0, 0, 0, 0)) && (
                              <TouchableOpacity style={[styles.footerBtn, styles.btnReg]}>
                                <Text style={styles.btnText}>Regularisation</Text>
                              </TouchableOpacity>
                            )
                          }

                        </View>
                      </View>
                    )}
                  </View>
                );
              })
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
                      <View style={styles.detailRow}>
                        <Text style={styles.detailTitle}>Attendance Details</Text>
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

        {
          activeTab === 'My Attendance' && (
            <TouchableOpacity style={styles.toggleFloating}
              onPress={() => {
                setShowCalendar(v => !v);
                setSelectedRecord(null);
              }}>
              <Ionicons name={showCalendar ? 'list-outline' : 'calendar-number-outline'} size={24} color="#fff" />
            </TouchableOpacity>
          )
        }

        {activeTab === 'Sub-ordinate' && showCalendar && (
          <TouchableOpacity
            style={styles.toggleFloating}
            onPress={() => {
              setShowCalendar(false);
              setActiveSub(null);
            }}
          >
            <Ionicons name="list-outline" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </ScreenWithBackHandler>
  );
};

export default AttendanceHistory;

const styles = StyleSheet.create({
  headerTitle: { alignItems: 'start', paddingHorizontal: 10, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: '700', color: '#000' },
  recordContainer: {
    paddingVertical: 8
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // marginBottom: 4,
    elevation: 16,
  },

  label2: {
    fontWeight: '900',
    fontSize: 12,
    color: '#333',
    width: "38%"
  },

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
  scroll: { flexGrow: 1, paddingBottom: 80 },
  recordRow: { flexDirection: 'row', padding: 10, marginBottom: 8, backgroundColor: '#f9f9f9', borderRadius: 8, alignItems: 'center' },
  dateBox: { width: 60, height: 60, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  dateText: { fontSize: 14, fontWeight: 'bold' },
  dayText: { fontSize: 10, textAlign: 'center' },
  recordDetails: { flex: 1 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  statusCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 0,
  },
  circleText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  value: { fontSize: 12, fontWeight: '600', color: '#333' },
  subRecordRow: { flexDirection: 'row', alignItems: 'center', padding: 10, marginBottom: 8, backgroundColor: '#f9f9f9', borderRadius: 8 },
  employeePhoto: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ccc' },
  subDetails: { flex: 1, marginHorizontal: 10 },
  nameText: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  subButtons: { flexDirection: 'row' },
  iconBtn: { marginLeft: 8, padding: 4 },
  AttcardHeader: { borderBottomWidth: 2, borderBottomColor: '#E53935', flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  accordionDetail: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginHorizontal: 8, marginBottom: 10, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  detailTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, paddingBottom: 4 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  detailLabel: { fontSize: 14, color: '#555', fontWeight: '600' },
  detailValue: { fontSize: 14, color: '#222', fontWeight: '600' },
  toggleFloating: { position: 'absolute', bottom: 70, right: 20, flexDirection: 'row', backgroundColor: '#E53935', padding: 8, borderRadius: 20, elevation: 4 },
  toggleText: { color: '#fff', marginLeft: 5 },
  accordionDetail1: { backgroundColor: '#fff', padding: 0, borderRadius: 10, marginHorizontal: 8, marginBottom: 10, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  cardHeader: { paddingVertical: 10, flexDirection: "row", justifyContent: "space-between", width: '100%', alignItems: 'center', backgroundColor: '#E53935', borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  headerText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  cardBody: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#fff', flexDirection: 'column', gap: 8, maxHeight: 250 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 14, color: '#555' },
  cardFooter: { flexDirection: 'column', gap: 5, padding: 10, backgroundColor: '#f9f9f9' },
  footerBtn: { marginHorizontal: 8, paddingVertical: 10, borderRadius: 5, alignItems: 'center' },
  btnLeave: { backgroundColor: 'green' },
  btnReg: { backgroundColor: '#E53935' },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '600' }
});

