import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getDateRange } from '../utils/date';
import { colors } from '../utils/themes';

interface DateRangeReminderModalProps  {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    startDate: string;
    endDate: string;
    time: Date;
  }) => void;
  startDate: string;
  endDate: string;
  time?: Date;
  title:string
};

export const DateRangeReminderModal = (props:DateRangeReminderModalProps) => {
    console.log('Props in DateRangeReminderModal:', props);
  const [startDate, setStartDate] = useState<string | null>(props.startDate || null);
  const [endDate, setEndDate] = useState<string | null>(props.endDate || null);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onDayPress = (day: any) => {
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

          {/* Footer */}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() =>
              props.onSave({
                startDate: startDate!,
                endDate: endDate!,
                time,
              })
            }
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
});

