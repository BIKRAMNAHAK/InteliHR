import React, { useEffect, useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
  ScrollView, SafeAreaView, KeyboardAvoidingView,
  Platform, TextInput, Image
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import DocumentPicker from 'react-native-document-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { useDispatch } from 'react-redux';
import { getLeaveAsync } from '../services/Actions/employeeAction';

const LeaveReqScreen = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [leaveType, setLeaveType] = useState(null);
  const [items, setItems] = useState([]);
  const [reason, setReason] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [days, setDays] = useState(0);
  const [showCal, setShowCal] = useState(false);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [selectedDates, setSelectedDates] = useState([]);
  const [attachment, setAttachment] = useState(null);

  // Contact list states
  const [showContacts, setShowContacts] = useState(false);
  const [contacts, setContacts] = useState([
    { id: '1', name: 'John Doe', selected: false },
    { id: '2', name: 'Jane Smith', selected: false },
    { id: '3', name: 'David Johnson', selected: false },
    { id: '4', name: 'Alice Brown', selected: false }
  ]);
  const [selectedContacts, setSelectedContacts] = useState([]);

  const onDayPress = (day) => {
    if (!start || (start && end)) {
      setStart(day.dateString);
      setEnd('');
      setFromDate(day.dateString);
      setToDate('');
      setDays(1);
      setSelectedDates([{ date: day.dateString, mode: 'full', halfType: null }]);
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
        temp.push({ date: formatted, mode: 'full', halfType: null });
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
        color: ds === start ? '#E53935' : ds === end ? '#E53935' : '#FFCDD2',
        textColor: '#000',
        startingDay: ds === start,
        endingDay: ds === end,
      };
      cur.setDate(cur.getDate() + 1);
    }
  }

  const handlePickFileOrImage = () => {
    launchImageLibrary(
      {
        mediaType: 'mixed',
        includeBase64: false,
        selectionLimit: 1,
        includeExtra: true,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled picker');
        } else if (response.errorCode) {
          console.log('Picker Error: ', response.errorMessage);
        } else {
          const asset = response.assets[0];
          setAttachment({
            uri: asset.uri,
            name: asset.fileName,
            type: asset.type,
          });
        }
      }
    );
  };

  const toggleContactSelection = (id) => {
    const updated = contacts.map((c) =>
      c.id === id ? { ...c, selected: !c.selected } : c
    );
    setContacts(updated);
    setSelectedContacts(updated.filter(c => c.selected).map(c => c.name));
  };

  const handleSubmit = () => {
    if (!leaveType || !reason || !fromDate || !toDate || days <= 0) {
      alert('Please complete all fields correctly');
      return;
    }
    console.log('Selected Dates:', selectedDates);
    console.log('Attachment:', attachment);
    console.log('Notify To:', selectedContacts);
    alert(`Leave Request Submitted. Notifying: ${selectedContacts.join(', ')}`);
  };

  const calculateTotalDays = () => {
    let total = 0;
    selectedDates.forEach(item => {
      total += item.mode === 'half' ? 0.5 : 1;
    });
    return total;
  };

  useEffect(() => {
    dispatch(getLeaveAsync())
      .then((res) => {
        const leaveArray = res?.leaveTypes || [];
        const employeeArray = res?.employees || [];

        // Leave types for dropdown
        const formattedLeaves = leaveArray.map((item) => ({
          label: item?.leave_type || "N/A",
          value: item?.leaveid || 0
        }));
        setItems(formattedLeaves);

        // Employees for notify list
        const formattedEmployees = employeeArray.map((emp) => ({
          id: emp.empid?.toString() || Math.random().toString(),
          name: emp.empname || "Unknown",
          selected: false
        }));
        setContacts(formattedEmployees);
      })
      .catch((err) => {
        console.log("Error fetching leave data:", err);
        setItems([]);
        setContacts([]);
      });
  }, [dispatch]);


  return (
    <SafeAreaView style={styles.flex}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}><Text style={styles.title}>Apply Leave</Text></View>

          <View style={styles.card}>
            {/* Dates */}
            <View style={styles.datesRow}>
              {['Start Date', 'End Date'].map((label, idx) => {
                const dateValue = idx === 0 ? fromDate : toDate;
                return (
                  <TouchableOpacity key={label} style={styles.datePicker} onPress={() => setShowCal(!showCal)}>
                    <Ionicons name="calendar-outline" size={20} color="#E53935" />
                    <View style={{ marginLeft: 8 }}>
                      <Text style={styles.subTitle}>{label}</Text>
                      <Text style={styles.dateText}>{dateValue}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {showCal && <Calendar markingType={'period'} markedDates={marked} onDayPress={onDayPress} style={{ marginTop: 10 }} />}

            {/* Leave Type */}
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

            {/* Selected Dates */}
            {selectedDates.length > 0 && leaveType && (
              <View style={{ marginTop: 20 }}>
                <Text style={[styles.subTitle, { fontWeight: 'bold' }]}>Selected Dates:</Text>
                {selectedDates.map((item, index) => (
                  <View key={index} style={styles.dateRow}>
                    <Text style={styles.dateRowText}>{item.date} - {item.mode === 'full' ? 'Full Day' : 'Half Day'}{item.mode === 'half' ? ` - ${item.halfType === 'first' ? 'First Shift' : 'Second Shift'}` : ''}</Text>
                    <View style={{ flexDirection: "row", width: "100%" }}>
                      <TouchableOpacity style={[styles.radioBtn, { backgroundColor: item.mode === 'full' ? '#E53935' : '#ccc' }]} onPress={() => { const updated = [...selectedDates]; updated[index].mode = 'full'; updated[index].halfType = null; setSelectedDates(updated); }}><Text style={styles.radioText}>Full Day</Text></TouchableOpacity>
                      <TouchableOpacity style={[styles.radioBtn, { backgroundColor: item.mode === 'half' ? '#E53935' : '#ccc' }]} onPress={() => { const updated = [...selectedDates]; updated[index].mode = 'half'; updated[index].halfType = 'first'; setSelectedDates(updated); }}><Text style={styles.radioText}>Half Day</Text></TouchableOpacity>
                      {item.mode === 'half' && (
                        <>
                          <TouchableOpacity style={[styles.halfBtn, { backgroundColor: item.halfType === 'first' ? '#E53935' : '#ccc' }]} onPress={() => { const updated = [...selectedDates]; updated[index].halfType = 'first'; setSelectedDates(updated); }}><Text style={styles.radioText}>1st Half</Text></TouchableOpacity>
                          <TouchableOpacity style={[styles.halfBtn, { backgroundColor: item.halfType === 'second' ? '#E53935' : '#ccc' }]} onPress={() => { const updated = [...selectedDates]; updated[index].halfType = 'second'; setSelectedDates(updated); }}><Text style={styles.radioText}>2nd Half</Text></TouchableOpacity>
                        </>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Note */}
            <Text style={styles.subTitle}>Note to approver *</Text>
            <TextInput style={styles.inputNote} placeholder="Ex: Need to attend a family function." placeholderTextColor="#999" multiline numberOfLines={4} value={reason} onChangeText={setReason} />

            {/* Notify Contacts */}
            <Text style={styles.subTitle}>Notify your teammates</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => setShowContacts(!showContacts)}>
              <Ionicons name="person-add-outline" size={20} color="#fff" />
              {/* <Text style={styles.attachText}>Add</Text> */}
            </TouchableOpacity>

            {showContacts && (
              <View style={{ marginTop: 10 }}>
                {contacts.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.contactRow}
                    onPress={() => toggleContactSelection(item.id)}
                  >
                    <Ionicons
                      name={item.selected ? "checkbox-outline" : "square-outline"}
                      size={20}
                      color={item.selected ? "#E53935" : "#000"}
                    />
                    <Text style={styles.contactName}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Attach File */}
            <Text style={[styles.subTitle, { marginTop: 20 }]}>Attach Image / Document</Text>
            <TouchableOpacity style={styles.attachBtn} onPress={handlePickFileOrImage}>
              <Ionicons name="attach-outline" size={20} color="#fff" />
              <Text style={styles.attachText}>Attach File</Text>
            </TouchableOpacity>

            {attachment && (
              <View style={{ marginTop: 10 }}>
                {attachment.type?.startsWith('image') || attachment.uri?.match(/\.(jpg|jpeg|png)$/i) ? (
                  <Image source={{ uri: attachment.uri }} style={{ width: 100, height: 100, borderRadius: 8 }} />
                ) : (
                  <Text style={styles.fileName}>Attached: {attachment.name || attachment.uri?.split('/').pop()}</Text>
                )}
              </View>
            )}

            {/* Footer */}
            <Text style={styles.footer}>Leave request is for <Text style={{ fontWeight: 'bold' }}>{calculateTotalDays()} Day(s)</Text></Text>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}><Text style={styles.submitText}>Request Leave</Text></TouchableOpacity>
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
  subTitle: { fontSize: 14, color: '#000' },
  dateText: { color: '#000', fontSize: 16, marginBottom: 8 },
  availability: { color: '#000', marginTop: 10 },
  inputNote: { backgroundColor: '#fff', borderColor: '#E53935', borderWidth: 1, borderRadius: 8, padding: 10, color: '#000', marginTop: 10 },
  footer: { color: '#000', textAlign: 'center', marginVertical: 10 },
  submitBtn: { backgroundColor: '#E53935', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 10 },
  submitText: { color: '#fff', fontWeight: '600' },
  dropdown: { backgroundColor: '#fff', borderColor: '#E53935', marginTop: 8 },
  dropdownContainer: { backgroundColor: '#fff', borderColor: '#E53935' },
  radioBtn: { paddingVertical: 5, paddingHorizontal: 10, borderRadius: 6, marginLeft: 8 },
  halfBtn: { paddingVertical: 5, paddingHorizontal: 10, borderRadius: 6, marginLeft: 8 },
  radioText: { color: '#fff', fontWeight: '500' },
  datesRow: { flexDirection: 'row', justifyContent: 'space-between' },
  datePicker: { flexDirection: 'row', alignItems: 'flex-start', width: '48%', paddingVertical: 10 },
  dateRowText: { color: '#000', fontWeight: '600', marginRight: 10 },
  attachBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E53935', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, marginTop: 10 },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E53935', justifyContent: "center", borderRadius: 50, marginTop: 10, width: 50, height: 50 },
  attachText: { color: '#fff', marginLeft: 6, fontWeight: '500' },
  fileName: { marginTop: 8, color: '#000', fontStyle: 'italic' },
  contactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  contactName: { marginLeft: 10, fontSize: 16, color: '#000' }
});
