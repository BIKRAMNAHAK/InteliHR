import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

// Shared card generator
const generateCard = (icon, title, subtitle, screen, navigation, extraStyle) => {
    const handlePress = () => {
        if (screen && navigation) {
            navigation.navigate(screen);
        } else {
            Alert.alert('Coming Soon', 'This feature is coming soon!');
        }
    };

    return (
        <TouchableOpacity
            key={title}
            style={[styles.card, extraStyle]}
            onPress={handlePress}
        >
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={30} color="#E53935" />
            </View>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardText}>{subtitle}</Text>
        </TouchableOpacity>
    );
};

// Time Tab
const FirstRoute = () => (
    <ScrollView contentContainerStyle={styles.grid}>
        {Array.from({ length: 6 }).map((_, i) =>
            generateCard(
                'time-outline',
                `Time Log ${i + 1}`,
                'Worked on project XYZ',
                null,
                null
            )
        )}
    </ScrollView>
);

// Finance data
const financeItems = [
    {
        icon: 'reader-outline',
        title: 'My Pay',
        subtitle: 'View salary details and payslips here',
        screen: 'MyPayScreen',
    },
    {
        icon: 'documents-outline',
        title: 'Tax Forms',
        subtitle: 'View and download all your tax related forms',
        screen: 'TaxFormsScreen',
    },
    {
        icon: 'calculator-outline',
        title: 'Manage Tax',
        subtitle: 'View and manage tax & declaration information',
        screen: 'ManageTaxScreen',
    },
    {
        icon: 'document-text-outline',
        title: 'Pay Slips',
        subtitle: 'View and download your previous payslips',
        screen: 'PaySlipsScreen',
    },
];

// Expenses data
const expenseItem = {
    icon: 'add-circle-outline',
    title: 'Add/Claim Expenses',
    subtitle:
        'Create expenses, advance requests, mileage tracking, per diem and claim them',
    screen: 'ExpensesScreen',
};

// Finances Tab
const SecondRoute = ({ navigation }) => (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionHeader}>Salary</Text>
        <View style={styles.grid}>
            {financeItems.map(item =>
                generateCard(
                    item.icon,
                    item.title,
                    item.subtitle,
                    item.screen,
                    navigation
                )
            )}
        </View>

        <Text style={styles.sectionHeader}>Expenses</Text>
        <View style={styles.expenseContainer}>
            {generateCard(
                expenseItem.icon,
                expenseItem.title,
                expenseItem.subtitle,
                expenseItem.screen,
                navigation,
                styles.fullWidthCard
            )}
        </View>
    </ScrollView>
);

// Performance Tab
const ThirdRoute = () => (
    <ScrollView contentContainerStyle={styles.grid}>
        {generateCard(
            'create-outline',
            'Personal Feedback',
            'Foster a culture of continuous learning',
            null,
            null
        )}
        {generateCard(
            'hand-left-outline',
            'Praise',
            'Appreciate your peers’ achievements',
            null,
            null
        )}
    </ScrollView>
);

// Documents Tab
const FourthRoute = () => (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionHeader}>Documents</Text>
        <View style={styles.grid}>
            {generateCard(
                'business-outline',
                'Org Documents',
                'Official policies, handbooks',
                null,
                null
            )}
            {generateCard(
                'document-text-outline',
                'My Documents',
                'Your uploaded or assigned files',
                null,
                null
            )}
        </View>
    </ScrollView>
);

// Main Component
const AboutMe = ({ navigation }) => {
    const [index, setIndex] = useState(1);
    const [routes] = useState([
        { key: 'time', title: 'Time' },
        { key: 'finances', title: 'Finances' },
        { key: 'performance', title: 'Performance' },
        { key: 'documents', title: 'Documents' },
    ]);

    const renderScene = SceneMap({
        time: FirstRoute,
        finances: () => <SecondRoute navigation={navigation} />,
        performance: ThirdRoute,
        documents: FourthRoute,
    });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            {/* Header */}
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <Image
                        source={{
                            uri: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?crop=faces&fit=crop&w=300&h=300',
                        }}
                        style={styles.profileImage}
                    />
                </TouchableOpacity>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search your colleagues"
                        placeholderTextColor="#888"
                    />
                </View>
            </View>

            {/* Tabs */}
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width }}
                renderTabBar={(props) => (
                    <TabBar
                        {...props}
                        indicatorStyle={styles.indicatorStyle}
                        style={styles.tabBar}
                        activeColor="#E53935"
                        inactiveColor="#333"
                        labelStyle={styles.labelStyle}
                        scrollEnabled
                        tabStyle={styles.tabStyle}
                    />
                )}
                style={{ flex: 1 }}
            />
        </KeyboardAvoidingView>
    );
};

export default AboutMe;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        paddingTop: 20,
        backgroundColor: '#fff',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    searchContainer: { flex: 1, marginLeft: 10 },
    searchInput: {
        height: 40,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 15,
        fontSize: 14,
        color: '#000',
    },
    indicatorStyle: { backgroundColor: '#E53935', height: 3 },
    tabBar: { backgroundColor: '#fff', elevation: 2 },
    labelStyle: { fontWeight: '600', fontSize: 12 },
    tabStyle: { minWidth: 80 },
    scrollContainer: { paddingBottom: 16 },
    sectionHeader: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
        paddingLeft: 16,
        marginTop: 10,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    expenseContainer: {
        width: '100%',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    card: {
        width: width / 2 - 24,
        backgroundColor: '#fafafa',
        borderRadius: 12,
        paddingVertical: 20,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    fullWidthCard: {
        width: width - 32,
    },
    iconContainer: {
        padding: 12,
        borderRadius: 50,
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#E53935',
        textAlign: 'center',
    },
    cardText: {
        color: '#333',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 4,
    },
});
