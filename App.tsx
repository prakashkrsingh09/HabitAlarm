import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useActivityStore, Activity } from './src/store/activityStore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AddActivityModal from './src/components/AddActivityModal';
import { DateRangeReminderModal } from './src/components/DateRangeReminderModal';
import { colors } from './src/utils/themes';
import { cancelNotification } from './src/service/notificationService';

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const { activities, deteleActivity } = useActivityStore();
  const [selectedItem, setSelectedItem] = useState<Activity | null>(null);

  // const { activities, markCompleted, deteleActivity } = useActivityStore();

  const onPressRenderItem = (activityItem: Activity) => {
    setSelectedItem(activityItem);
    setOpenDetailsModal(prev => !prev);
  };

  const renderItem = ({ item }: { item: Activity }) => {
    return (
      <TouchableOpacity
        style={styles.renderItemContainer}
        onPress={() => onPressRenderItem(item)}
      >
        <View style={styles.renderItemTitle}>
          <Text style={styles.renderItemTitleText}>{item.title}</Text>
          <TouchableOpacity
            onPress={async () => {
              // Cancel the notification before deleting the activity
              if (item.notificationId) {
                await cancelNotification(item.notificationId);
              }
              deteleActivity(item.id);
            }}
            style={styles.deleteButton}
          >
            <Icon name="delete" size={20} color="red" />
          </TouchableOpacity>
        </View>
        <View style={styles.descriptionContainer}>
          <Text>
            {item.desicription.trim().length > 0
              ? item.desicription
              : 'No description'}
          </Text>
        </View>
        <View style={styles.dateConatiner}>
          <View style={styles.dateConatinerItem}>
            <Icon name="calendar-month" size={20} color="black" />
            <Text>Start: {item.startDate}</Text>
          </View>
          <View>
            <Icon name="start" size={20} color="black" />
          </View>
          <View style={styles.dateConatinerItem}>
            <Icon name="calendar-month" size={20} color="black" />
            <Text>End: {item.endDate || 'Ongoing'}</Text>
          </View>
        </View>
        <View style={styles.reminderTimeContainer}>
          <Icon name="share-arrival-time" size={20} color="black" />
          <Text>
            {`Reminder Time: ${
              item.reminderHour > 12
                ? item.reminderHour - 12
                : item.reminderHour.toString().padStart(2, '0')
            } : ${item.reminderMinute.toString().padStart(2, '0')} ${
              item.reminderHour > 11 ? 'PM' : 'AM'
            }`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View>
          <Text style={styles.titleTextStyle}>Habit Alarm</Text>
        </View>
        <TouchableOpacity
          style={styles.addActivitystyle}
          onPress={() => {
            setModalVisible(prev => !prev);
          }}
        >
          <Icon name="add-alarm" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <AddActivityModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(prev => !prev);
        }}
      />

      <DateRangeReminderModal
        activityId={selectedItem?.id || ''}
        visible={openDetailsModal}
        onClose={() => setOpenDetailsModal(prev => !prev)}
        onSave={data => {
          console.log(data);
          // setOpenDetailsModal(prev=>!prev)
        }}
        startDate={
          selectedItem?.startDate || new Date().toISOString().split('T')[0]
        }
        endDate={
          selectedItem?.endDate || new Date().toISOString().split('T')[0]
        }
        time={
          selectedItem
            ? new Date(
                2000,
                0,
                1,
                selectedItem.reminderHour,
                selectedItem.reminderMinute,
              )
            : undefined
        }
        title={selectedItem?.title?.toString() || ''}
        description={selectedItem?.desicription?.toString() || ''}
      />
      <FlatList
        data={activities}
        keyExtractor={activityItem => activityItem.id}
        renderItem={renderItem}
        style={styles.flatListContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  addActivitystyle: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
  },
  titleTextStyle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  renderItemTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateConatiner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginTop: 8,
  },
  renderItemContainer: {
    marginVertical: 3,
    paddingHorizontal: 10,
    borderWidth: 3,
    borderColor: '#ccc',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.secondary,
  },
  flatListContainer: {
    marginTop: 20,
    backgroundColor: colors.secondary,
    height: '100%',
  },
  dateConatinerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    justifyContent: 'space-between',
  },
  renderItemTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#ff64645f',
    borderRadius: 15,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
  },
  descriptionContainer: {
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
  },
  reminderTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 10,
    width: '100%',
  },
});
