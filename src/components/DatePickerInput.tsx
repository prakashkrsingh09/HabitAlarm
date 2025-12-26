import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../utils/themes';

type Props = {
  label: string;
  value: string;
  onChange: (date: string) => void;
  minDate?: string;
  maxDate?: string;
};

export function DatePickerInput({
  label,
  value,
  onChange,
  minDate,
  maxDate,
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <View style={styles.container}>
      <Text>{label}</Text>
      <Text>{value}</Text>

      <TouchableOpacity
        onPress={() => setShow(true)}
        style={styles.datePickButtonStyle}
      >
        <Text>Pick date</Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={new Date(value)}
          mode="date"
          display="default"
          minimumDate={minDate ? new Date(minDate) : undefined}
          maximumDate={maxDate ? new Date(maxDate) : undefined}
          onChange={(_, selectedDate) => {
            setShow(false);
            if (!selectedDate) return;

            const normalized = selectedDate.toISOString().split('T')[0];

            onChange(normalized);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  datePickButtonStyle: {
    marginVertical: 8,
    padding: 8,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  container: {
    marginBottom: 12,
  },
});
