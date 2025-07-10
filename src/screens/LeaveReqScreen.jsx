import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
  ScrollView, SafeAreaView, KeyboardAvoidingView,
  Platform, TextInput,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LeaveReqScreen = () => {
  const [open, setOpen] = useState(false);
  const [leaveType, setLeaveType] = useState(null);
  const [items, setItems] = useState([
    { label: 'Sick Leave', value: 'sick' },
    { label: 'Casual Leave', value: 'casual' },
    { label: 'Earned Leave', value: 'earned' },
  ]);
  const [reason, setReason] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [days, setDays] = useState(0);
  const [showCal, setShowCal] = useState(false);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [selectedDates, setSelectedDates] = useState([]);

  const onDayPress = (day) => {
    if (!start || (start && end)) {
      setStart(day.dateString);
      setEnd('');
      setFromDate(day.dateString);
      setToDate('');
      setDays(1);
      setSelectedDates([{
        date: day.dateString,
        mode: 'full',
        halfType: null
      }]);
    } else {
      setEnd(day.dateString);
      setToDate(day.dateString);
      const d1 = new Date(start);
      const d2 = new Date(day.dateString);
      const diff = (d2 - d1) / (1000 * 3600 * 24) + 1;
      setDays(diff > 0 ? diff : 1);
      setShowCal(false);

      const temp = [];
      const tempDate = new Date(start);
      while (tempDate <= d2) {
        const formatted = tempDate.toISOString().split('T')[0];
        temp.push({
          date: formatted,
          mode: 'full',
          halfType: null
        });
        tempDate.setDate(tempDate.getDate() + 1);
      }
      setSelectedDates(temp);
    }
  };

  const marked = {};
  if (start) marked[start] = { startingDay: true, color: '#E53935', textColor: '#fff' };
  if (end) {
    let cur = new Date(start);
    const last = new Date(end);
    while (cur <= last) {
      const ds = cur.toISOString().split('T')[0];
      marked[ds] = {
        color: ds === start ? '#E53935' :
          ds === end ? '#E53935' :
            '#FFCDD2',
        textColor: '#000',
        startingDay: ds === start,
        endingDay: ds === end,
      };
      cur.setDate(cur.getDate() + 1);
    }
  }

  const handleSubmit = () => {
    if (!leaveType || !reason || !fromDate || !toDate || days <= 0) {
      alert('Please complete all fields correctly');
      return;
    }
    console.log(selectedDates);
    alert('Leave Request Submitted');
  };

  const calculateTotalDays = () => {
    let total = 0;
    selectedDates.forEach(item => {
      total += item.mode === 'half' ? 0.5 : 1;
    });
    return total;
  };

  return (
    <SafeAreaView style={styles.flex}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Apply Leave</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.datesRow}>
              {['Start Date', 'End Date'].map((label, idx) => {
                const dateValue = idx === 0 ? fromDate : toDate;
                return (
                  <TouchableOpacity
                    key={label}
                    style={styles.datePicker}
                    onPress={() => setShowCal(!showCal)}
                  >
                    <Ionicons name="calendar-outline" size={20} color="#E53935" />
                    <View style={{ marginLeft: 8 }}>
                      <Text style={styles.subTitle}>{label}</Text>
                      <Text style={styles.dateText}>{dateValue}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {showCal && (
              <Calendar
                markingType={'period'}
                markedDates={marked}
                onDayPress={onDayPress}
                style={{ marginTop: 10 }}
              />
            )}

            <Text style={styles.subTitle}>Leave Type</Text>
            <DropDownPicker
              open={open}
              value={leaveType}
              items={items}
              setOpen={setOpen}
              setValue={setLeaveType}
              setItems={setItems}
              placeholder="Unpaid Leave"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
            <Text style={styles.availability}>Available : ∞</Text>

            {selectedDates.length > 0 && leaveType && (
              <View style={{ marginTop: 20 }}>
                <Text style={[styles.subTitle, { fontWeight: 'bold' }]}>Selected Dates:</Text>
                {selectedDates.map((item, index) => (
                  <View key={index} style={styles.dateRow}>
                    <Text style={styles.dateRowText}>
                      {item.date} - {item.mode === 'full' ? 'Full Day' : 'Half Day'}{item.mode === 'half' ? ` - ${item.halfType === 'first' ? 'First Shift' : 'Second Shift'}` : ''}
                    </Text>
                    <View style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                      <TouchableOpacity
                        style={[styles.radioBtn, { backgroundColor: item.mode === 'full' ? '#E53935' : '#ccc' }]}
                        onPress={() => {
                          const updated = [...selectedDates];
                          updated[index].mode = 'full';
                          updated[index].halfType = null;
                          setSelectedDates(updated);
                        }}
                      >
                        <Text style={styles.radioText}>Full Day</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.radioBtn, { backgroundColor: item.mode === 'half' ? '#E53935' : '#ccc' }]}
                        onPress={() => {
                          const updated = [...selectedDates];
                          updated[index].mode = 'half';
                          updated[index].halfType = 'first';
                          setSelectedDates(updated);
                        }}
                      >
                        <Text style={styles.radioText}>Half Day</Text>
                      </TouchableOpacity>
                      {item.mode === 'half' && (
                        <>
                          <TouchableOpacity
                            style={[styles.halfBtn, {
                              backgroundColor: item.halfType === 'first' ? '#E53935' : '#ccc'
                            }]}
                            onPress={() => {
                              const updated = [...selectedDates];
                              updated[index].halfType = 'first';
                              setSelectedDates(updated);
                            }}
                          >
                            <Text style={styles.radioText}>1st Shift</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.halfBtn, {
                              backgroundColor: item.halfType === 'second' ? '#E53935' : '#ccc'
                            }]}
                            onPress={() => {
                              const updated = [...selectedDates];
                              updated[index].halfType = 'second';
                              setSelectedDates(updated);
                            }}
                          >
                            <Text style={styles.radioText}>2nd Shift</Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}

            <Text style={styles.subTitle}>Note to approver *</Text>
            <TextInput
              style={styles.inputNote}
              placeholder="Ex: Need to attend a family function."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={reason}
              onChangeText={setReason}
            />

            <Text style={styles.subTitle}>Notify your teammates</Text>
            <View style={styles.notifyWrapper}>
              <Ionicons name="add-circle-outline" size={24} color="#E53935" />
              <Text style={styles.notifyText}>Add</Text>
            </View>

            <Text style={styles.footer}>
              Leave request is for{' '}
              <Text style={{ fontWeight: 'bold' }}>{calculateTotalDays()} Day(s)</Text>
            </Text>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitText}>Request Leave</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LeaveReqScreen;

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20 },
  header: { alignItems: 'start', marginBottom: 10 },
  title: { fontSize: 22, fontWeight: '700', color: '#000' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  subTitle: { fontSize: 14, color: '#000', },
  dateText: { color: '#000', fontSize: 16, marginBottom: 8 },
  availability: { color: '#000', marginTop: 10 },
  inputNote: {
    backgroundColor: '#fff',
    borderColor: '#E53935',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    color: '#000',
    marginTop: 10
  },
  notifyWrapper: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  notifyText: { color: '#000', marginLeft: 8 },
  footer: { color: '#000', textAlign: 'center', marginVertical: 10 },
  submitBtn: { backgroundColor: '#E53935', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 10 },
  submitText: { color: '#fff', fontWeight: '600' },
  dropdown: { backgroundColor: '#fff', borderColor: '#E53935', marginTop: 8 },
  dropdownContainer: { backgroundColor: '#fff', borderColor: '#E53935' },
  radioBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 8
  },
  halfBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 8
  },
  radioText: {
    color: '#fff',
    fontWeight: '500'
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  datePicker: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '48%', 
    paddingVertical: 10,
  },
  dateRowText: {
    color: '#000',
    fontWeight: '600',
    marginRight: 10
  }
});
