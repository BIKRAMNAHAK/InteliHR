import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const ProfileScreen = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'summary', title: 'Summary' },
    { key: 'timeline', title: 'Timeline' },
    { key: 'personal', title: 'Personal' },
    { key: 'job', title: 'Job' },
    { key: 'Document', title: 'Document'}
  ]);

  const handleKycUpdate = () => {
    alert('KYC update feature coming soon!');
  };

  const SummaryRoute = () => (
    <ScrollView style={styles.scene}>
      <View style={styles.pariseCard}>
        <Text style={styles.tital}>Praises</Text>
        <View styel={styles.infoBody}>
          <Ionicons name="cube-outline" size={100} color="#eee" styel={styles.praisIcon} />
        </View>
      </View>

      <View style={styles.pariseCard}>
        <View style={{ display: "flex",flexDirection : "row", width: "100%", justifyContent : "space-between"}}>
          <Text style={styles.tital}>About</Text>
          <Ionicons name="create-outline" size={25} color="#E53935" styel={styles.icon} />
        </View>
        <View styel={styles.infoBody}>
            <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus similique officia quasi sint totam molestias perferendis neque quae sunt blanditiis tenetur odit voluptas voluptate, impedit, deleniti repellendus, temporibus mollitia officiis.</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="briefcase-outline" size={20} color="#E53935" style={styles.icon} />
        <View>
          <Text style={styles.label}>Designation</Text>
          <Text style={styles.value}>React Native Developer</Text>
        </View>
      </View>
    </ScrollView>
  );

  const TimelineRoute = () => (
    <View style={styles.placeholderScene}>
      <Text style={styles.placeholderText}>Timeline content goes here.</Text>
    </View>
  );

// Personal tab ke andar yeh code add karein:

function PersonalRoute({ navigation }) {
  return (
    <ScrollView style={styles.scene} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Primary Details */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Primary Details</Text>
          <TouchableOpacity onPress={() => console.log('Edit Primary')}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
        {[
          ['FIRST NAME', 'Utkarsha'],
          ['MIDDLE NAME', '-Not set-'],
          ['LAST NAME', 'Nagrikar'],
          ['DISPLAY NAME', 'Utkarsha Nagrikar'],
          ['GENDER', 'Female'],
          ['DATE OF BIRTH', '16 May, 1999'],
          ['MARITAL STATUS', 'Single'],
          ['BLOOD GROUP', 'O+ (O Positive)'],
          ['PHYSICALLY HANDICAPPED', 'No'],
          ['NATIONALITY', 'IN'],
        ].map(([label, value]) => (
          <View style={styles.row} key={label}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
      </View>

      {/* Contact Details */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Contact Details</Text>
          <TouchableOpacity onPress={() => console.log('Edit Contact')}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
        {[
          ['WORK EMAIL', 'hr@in.telarc.it'],
          ['PERSONAL EMAIL', 'nagrikarutkarsha@gmail.com'],
          ['MOBILE NUMBER', '+91‑9098878272'],
          ['WORK NUMBER', '-Not set-'],
          ['RESIDENCE NUMBER', '7610253005'],
          ['SKYPE', '-Not set-'],
        ].map(([label, value]) => (
          <View style={styles.row} key={label}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
      </View>

      {/* Addresses */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Addresses</Text>
          <TouchableOpacity onPress={() => console.log('Edit Address')}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
        {[
          ['CURRENT ADDRESS', '123, Raipur, Chhattisgarh, India'],
          ['PERMANENT ADDRESS', '-Not set-'],
        ].map(([label, value]) => (
          <View style={styles.row} key={label}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}


  const JobRoute = () => (
    <ScrollView style={styles.scene}>
      <View style={styles.infoCard}>
        <Ionicons name="document-text-outline" size={20} color="#E53935" style={styles.icon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>KYC Document</Text>
          <Text style={styles.value}>Not Updated</Text>
        </View>
        <TouchableOpacity style={styles.kycButton} onPress={handleKycUpdate}>
          <Text style={styles.kycButtonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const DocumentRoute = () => (
    <ScrollView style={styles.scene}>
      <View style={styles.infoCard}>
        <Ionicons name="document-text-outline" size={20} color="#E53935" style={styles.icon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>KYC Document</Text>
          <Text style={styles.value}>Not Updated</Text>
        </View>
        <TouchableOpacity style={styles.kycButton} onPress={handleKycUpdate}>
          <Text style={styles.kycButtonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderScene = SceneMap({
    summary: SummaryRoute,
    timeline: TimelineRoute,
    personal: PersonalRoute,
    job: JobRoute,
    Document : DocumentRoute
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#E53935' }}
      style={{ backgroundColor: '#fff', elevation: 2 }}
      activeColor="#E53935"
      inactiveColor="#333"
      labelStyle={{ fontWeight: '600', fontSize: 12 }}
      scrollEnabled={true}
      tabStyle={{ minWidth: 50 }}
    />
  );

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <TouchableOpacity style={styles.editIcon}>
            <Ionicons name="add-outline" size={18} color="#fff" />
          </TouchableOpacity>

          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?crop=faces&fit=crop&w=300&h=300',
              }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>johndoe@example.com</Text>
          <Text style={styles.mobile}>+91 98765 43210</Text>
        </View>

        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: Dimensions.get('window').width }}
          renderTabBar={renderTabBar}
        />
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    padding: 8,
  },
  container: {
    flex: 1,
  },
  profileContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    // elevation: 5,
    marginBottom: 10,
  },
  editIcon: {
    position: 'absolute',
    top: '54%',
    right: '37%',
    backgroundColor: '#E53935',
    padding: 3,
    borderRadius: 12,
    zIndex: 1
  },
  imageWrapper: {
    borderWidth: 3,
    borderColor: '#E53935',
    padding: 3,
    borderRadius: 65,
    elevation: 8,
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  mobile: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  scene: {
    flex: 1,
    padding: 10,
  },
  placeholderScene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  editText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E53935',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#888',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'right',
    flex: 1,
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  Abouticon: {
    alignSelf : "flex-end"
  },
  pariseCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
  },
  AboutTital: {
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#E53935',
    marginBottom: 10,
  },
  tital: {
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#E53935',
    marginBottom: 10,
  },
  infoBody: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },


  label: {
    fontSize: 12,
    color: '#999',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  kycButton: {
    backgroundColor: '#E53935',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 8,
  },
  kycButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
