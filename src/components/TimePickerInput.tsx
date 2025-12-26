import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import  Icon  from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../utils/themes';

type Props = {
  label: string;
  hour: number;
  minute: number;
  onChange: (hour: number, minute: number) => void;
};

export function TimePickerInput({ hour, minute, onChange }: Props) {
  const [show, setShow] = useState(false);
  const [hours, setHours] = useState(hour);
  const [minutes, setMinutes] = useState(minute);

  const value = new Date();
  value.setHours(hour);
  value.setMinutes(minute);
  value.setSeconds(0);
  value.setMilliseconds(0);

  const updateTime = (selectedDate: Date | undefined) => {
            setShow(false);
            if (!selectedDate) return;

            setHours(selectedDate.getHours());
            setMinutes(selectedDate.getMinutes());
            onChange(selectedDate.getHours(), selectedDate.getMinutes());
          }

  return (
    <View style={{ marginVertical: 12 }}>
      {/* <Text>{label}</Text>
      <Text>
        {hour.toString().padStart(2, '0')}:{minute.toString().padStart(2, '0')}
      </Text> */}

      <TouchableOpacity
        style={styles.timePickerButton}
        onPress={() => setShow(true)}
      >
        <Icon name="punch-clock" size={20} color="white" />
        <Text style={styles.buttonText}>Reminder At {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}</Text>
        <Icon name="arrow-forward" size={20} color="white" />
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value}
          mode="time"
          display="default"
          onChange={(_, selectedDate) => updateTime(selectedDate)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  timePickerButton: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
