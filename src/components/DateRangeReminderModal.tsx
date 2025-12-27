import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Keyboard,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getDateRange } from '../utils/date';
import { colors } from '../utils/themes';
import { useActivityStore } from '../store/activityStore';

interface DateRangeReminderModalProps {
  activityId: string;
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    startDate: string;
    endDate: string;
    time: Date;
    descriptionText: string;
  }) => void;
  startDate: string;
  endDate: string;
  time: Date;
  title: string;
  description: string;
}

// Helper function to convert DD-MM-YYYY to YYYY-MM-DD
const convertToCalendarFormat = (date: string): string => {
  if (!date) return '';
  // If already in YYYY-MM-DD format, return as is
  if (date.match(/^\d{4}-\d{2}-\d{2}$/)) return date;
  // Convert from DD-MM-YYYY to YYYY-MM-DD
  const parts = date.split('-');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return date;
};

// Helper function to convert YYYY-MM-DD to DD-MM-YYYY
const convertToAppFormat = (date: string): string => {
  if (!date) return '';
  // If already in DD-MM-YYYY format, return as is
  if (date.match(/^\d{2}-\d{2}-\d{4}$/)) return date;
  // Convert from YYYY-MM-DD to DD-MM-YYYY
  const parts = date.split('-');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return date;
};

export const DateRangeReminderModal = (props: DateRangeReminderModalProps) => {
  const { updateActivity } = useActivityStore();
  // Store dates in YYYY-MM-DD format for calendar (convert from props if needed)
  const [startDate, setStartDate] = useState<string | null>(
    props.startDate ? convertToCalendarFormat(props.startDate) : null,
  );
  const [endDate, setEndDate] = useState<string | null>(
    props.endDate ? convertToCalendarFormat(props.endDate) : null,
  );
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [description, setDescription] = useState(props.description);
  const onDayPress = (day: any) => {
    // day.dateString is already in YYYY-MM-DD format
    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString);
      setEndDate(null);
    } else {
      setEndDate(day.dateString);
    }
  };

  const markedDates =
    startDate && endDate
      ? getDateRange(startDate, endDate)
      : startDate
      ? {
          [startDate]: {
            startingDay: true,
            color: colors.primary,
            textColor: colors.secondary,
          },
        }
      : {};

  const onUpdateDescription = (text: string) => {
    setDescription(text);
  };

  return (
    <Modal visible={props.visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{props.title}</Text>
            <TouchableOpacity onPress={props.onClose}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Calendar */}
          <Calendar
            markingType="period"
            markedDates={markedDates}
            onDayPress={onDayPress}
          />

          {/* Reminder Time */}
          <TouchableOpacity
            style={styles.timeRow}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.timeLabel}>Reminder Time</Text>
            <Text style={styles.timeValue}>
              {time.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              onChange={(_, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) setTime(selectedTime);
              }}
            />
          )}

          <TextInput
            placeholder={props.description}
            value={description}
            onChangeText={text => onUpdateDescription(text)}
            style={styles.descriptionInput}
            multiline={true}
            numberOfLines={4}
            maxLength={100}
            showSoftInputOnFocus={true}
            returnKeyType="done"
            onSubmitEditing={() => {
              Keyboard.dismiss();
            }}
          />

          {/* Footer */}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => {
              // Convert dates back to DD-MM-YYYY format for saving
              const startDateFormatted = convertToAppFormat(startDate!);
              const endDateFormatted = convertToAppFormat(endDate!);
              props.onSave({
                startDate: startDateFormatted,
                endDate: endDateFormatted,
                time,
                descriptionText: description,
              });
              updateActivity(props.activityId, {
                startDate: startDateFormatted,
                endDate: endDateFormatted,
                reminderHour: time.getHours(),
                reminderMinute: time.getMinutes(),
                desicription: description,
              });
              props.onClose();
            }}
            disabled={!startDate || !endDate}
          >
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: colors.secondary,
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
  },
  close: {
    fontSize: 18,
    color: '#64748B',
  },
  timeRow: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeLabel: {
    color: '#334155',
  },
  timeValue: {
    color: '#0F172A',
    fontWeight: '500',
  },
  saveBtn: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: colors.secondary,
    fontWeight: '600',
  },
  descriptionInput: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    fontSize: 16,
    fontWeight: '500',
    height: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.secondary,
  },
});
