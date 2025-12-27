import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from 'react-native';
import { useActivityStore } from '../store/activityStore';
import { formatDateInWord } from '../utils/date';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Provider } from 'react-native-paper';

import { TimePickerInput } from './TimePickerInput';
import { scheduleDailyNotification } from '../service/notificationService';
import { DateRangeReminderModal } from './DateRangeReminderModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../utils/themes';

interface AddActivityModalProps {
  visible: boolean;
  onClose: () => void;
}
type Frequency = 'DAILY' | 'WEEKLY' | 'HOURLY';

const AddActivityModal = (props: AddActivityModalProps) => {
  const [activities, setActivities] = useState<string>('');
  const [activityDescription, setActivityDescription] = useState<string>('');
  const [selectedDateRange, setSelectedDateRange] = useState(false);
  const [startDate, setStartDate] = useState<string>(new Date().toLocaleDateString('en-CA'));
  const [endDate, setEndDate] = useState<string>(new Date().toLocaleDateString('en-CA'));
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(30);
  const [frequencyForNotification, setFrequencyForNotification] = useState<Frequency>('DAILY');
  const [showFrequencyMenu, setShowFrequencyMenu] = useState(false);

  const { addActivity } = useActivityStore();

  useEffect(() => {
    return () => {
      setStartDate('');
      setEndDate('');
      setActivities('');
      setActivityDescription('');
      setFrequencyForNotification('DAILY');
      setShowFrequencyMenu(false);
      setHour(12);
      setMinute(30);
      setSelectedDateRange(false);
    };
  }, []);

  const saveActivity = async () => {
    if (!activities) {
      return;
    }

    // Schedule a daily notification for this activity
    let notificationId: string | undefined;
    try {
      notificationId = await scheduleDailyNotification(
        activities,
        'Time to complete your activity',
        hour,
        minute,
      );
    } catch (error) {
      console.warn('Failed to schedule notification', error);
    }

    addActivity({
      id: Date.now().toString(),
      title: activities,
      startDate,
      endDate,
      reminderHour: hour,
      reminderMinute: minute,
      notificationId,
      frequency: frequencyForNotification,
      desicription: activityDescription,
    });

    props.onClose();
  };
  const finalTitle = (): string => {
    if (startDate.length > 0 && endDate.length > 0) {
      return `${formatDateInWord(startDate.split('-'))} - ${formatDateInWord(
        endDate.split('-'),
      )}`;
    } else {
      return 'Select start and end date';
    }
  };

  const onchangeActivityDescriptionText = (text: string) => {
    setActivityDescription(text);
  };

  return (
    <Provider>
      <Modal visible={props.visible} animationType="fade" transparent={true}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <SafeAreaView>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Add New Activity</Text>
              <View style={styles.closeIconContainer}>
                <Icon name="close" size={15} onPress={props.onClose} />
              </View>
            </View>

            <TextInput
              placeholder="Activity Title*"
              placeholderTextColor={colors.secondary}
              style={styles.activityTitleInput}
              value={activities}
              onChangeText={(text: string) => setActivities(text)}
            />

            <TextInput
              placeholder="Activity Description"
              placeholderTextColor={colors.secondary}
              textAlignVertical="top"
              style={styles.activityDescriptionInput}
              value={activityDescription}
              multiline={true}
              onChangeText={(text: string) =>
                onchangeActivityDescriptionText(text)
              }
              numberOfLines={4}
              maxLength={100}
              showSoftInputOnFocus={true}
              returnKeyType="done"
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
            />
            <View style={{ marginBottom: 20 }}>
              <Text style={{ color: colors.secondary, marginBottom: 6 }}>
                Frequency
              </Text>

              <View style={styles.frequencyContainer}>
                <TouchableOpacity
                  style={styles.frequencyButton}
                  onPress={() => setShowFrequencyMenu(!showFrequencyMenu)}
                >
                  <Text style={{ color: colors.secondary }}>
                    {frequencyForNotification}
                  </Text>
                  <Icon
                    name={showFrequencyMenu ? 'arrow-drop-up' : 'arrow-drop-down'}
                    size={22}
                    color={colors.secondary}
                  />
                </TouchableOpacity>

                {showFrequencyMenu && (
                  <View style={styles.dropdownMenu}>
                    <TouchableOpacity
                      style={[
                        styles.dropdownItem,
                        frequencyForNotification === 'DAILY' &&
                          styles.dropdownItemSelected,
                      ]}
                      onPress={() => {
                        setFrequencyForNotification('DAILY');
                        setShowFrequencyMenu(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          frequencyForNotification === 'DAILY' &&
                            styles.dropdownItemTextSelected,
                        ]}
                      >
                        Daily
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.dropdownItem,
                        frequencyForNotification === 'WEEKLY' &&
                          styles.dropdownItemSelected,
                      ]}
                      onPress={() => {
                        setFrequencyForNotification('WEEKLY');
                        setShowFrequencyMenu(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          frequencyForNotification === 'WEEKLY' &&
                            styles.dropdownItemTextSelected,
                        ]}
                      >
                        Weekly
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.dropdownItem,
                        frequencyForNotification === 'HOURLY' &&
                          styles.dropdownItemSelected,
                      ]}
                      onPress={() => {
                        setFrequencyForNotification('HOURLY');
                        setShowFrequencyMenu(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          frequencyForNotification === 'HOURLY' &&
                            styles.dropdownItemTextSelected,
                        ]}
                      >
                        Hourly
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.dateContainer}>
              <TouchableOpacity
                style={[styles.saveActivityButton, styles.timePickerButton]}
                onPress={() => setSelectedDateRange(true)}
              >
                <Icon name="date-range" size={20} color="white" />
                <Text
                  style={{
                    color: colors.secondary,
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}
                >
                  {finalTitle()}
                </Text>
                <Icon name="arrow-forward" size={20} color="white" />
              </TouchableOpacity>

              <DateRangeReminderModal
                activityId={Date.now().toString()}
                visible={selectedDateRange}
                onClose={() => setSelectedDateRange(prev => !prev)}
                onSave={data => {
                  setSelectedDateRange(prev => !prev);
                  setStartDate(data.startDate.split('-').reverse().join('-'));
                  setEndDate(data.endDate.split('-').reverse().join('-'));
                  setActivityDescription(data.descriptionText);
                }}
                startDate={startDate}
                endDate={endDate}
                time={new Date(hour, minute)}
                title={'Select start and end date'}
                description={activityDescription}
              />
            </View>

            <TimePickerInput
              label="Reminder Time"
              hour={hour}
              minute={minute}
              onChange={(h, m) => {
                setHour(h);
                setMinute(m);
              }}
            />

            <TouchableOpacity
              style={styles.saveActivityButton}
              onPress={() => saveActivity()}
            >
              <Text style={styles.saveActivityButtonText}>Save Activity</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </ScrollView>
      </Modal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: '#8bbef9',
    marginTop: '55%',
    borderWidth: 1,
    borderRadius: 10,
    flex: 0.5,
    borderColor: colors.primary,
    paddingVertical: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  activityTitleInput: {
    borderWidth: 2,
    borderColor: colors.secondary,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    color: colors.secondary,
    fontSize: 16,
  },
  activityDescriptionInput: {
    borderWidth: 2,
    borderColor: colors.secondary,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    color: colors.secondary,
    fontSize: 16,
    height: 100,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveActivityButton: {
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    paddingVertical: 14,
  },
  closeIconContainer: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timePickerButton: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  frequencyContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  frequencyButton: {
    borderWidth: 2,
    borderColor: colors.secondary,
    borderRadius: 5,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    backgroundColor: colors.secondary,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.secondary,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dropdownItemSelected: {
    backgroundColor: colors.primary,
  },
  dropdownItemText: {
    color: colors.primary,
    fontSize: 16,
  },
  dropdownItemTextSelected: {
    color: colors.secondary,
    fontWeight: 'bold',
  },
  saveActivityButtonText:{
    fontSize:16,
    fontWeight: 'bold',
    color: colors.secondary,
  }
});

export default AddActivityModal;
