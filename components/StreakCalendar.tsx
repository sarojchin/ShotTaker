import React, { useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';

const CELL_SIZE = 40;
const CELL_GAP = 8;

interface StreakCalendarProps {
  streakDays?: number[]; // day-of-month numbers that have a shot
}

export default function StreakCalendar({ streakDays = [] }: StreakCalendarProps) {
  const scrollRef = useRef<ScrollView>(null);

  const { days, todayIndex } = useMemo(() => {
    const today = new Date();
    const lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const todayDate = today.getDate();

    const days = Array.from({ length: lastDate }, (_, i) => {
      const date = i + 1;
      return {
        date,
        isToday: date === todayDate,
        hasStreak: streakDays.includes(date),
      };
    });

    return { days, todayIndex: todayDate - 1 };
  }, [streakDays]);

  // Scroll to today on mount
  useEffect(() => {
    const offset = todayIndex * (CELL_SIZE + CELL_GAP);
    setTimeout(() => {
      scrollRef.current?.scrollTo({ x: Math.max(0, offset - CELL_SIZE * 2), animated: false });
    }, 100);
  }, [todayIndex]);

  const monthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <View style={styles.container}>
      <Text style={styles.monthLabel}>{monthName.toUpperCase()}</Text>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {days.map(({ date, isToday, hasStreak }) => (
          <View key={date} style={styles.dayCell}>
            <Text style={[styles.dayNumber, isToday && styles.dayNumberToday]}>
              {date}
            </Text>
            <View
              style={[
                styles.dot,
                hasStreak && styles.dotStreak,
                isToday && !hasStreak && styles.dotToday,
              ]}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    alignItems: 'center',
  },
  monthLabel: {
    ...Typography.labelSm,
    color: Colors.textMuted,
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 12,
  },
  row: {
    paddingHorizontal: 20,
    gap: CELL_GAP,
  },
  dayCell: {
    width: CELL_SIZE,
    alignItems: 'center',
    gap: 6,
  },
  dayNumber: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 12,
  },
  dayNumberToday: {
    color: Colors.primary,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.surfaceContainerLow,
  },
  dotStreak: {
    backgroundColor: Colors.primary,
  },
  dotToday: {
    borderWidth: 1.5,
    borderColor: Colors.primaryContainer,
    backgroundColor: 'transparent',
  },
});
