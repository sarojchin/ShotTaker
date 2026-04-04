import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  hasStreak: boolean;
  isToday: boolean;
}

interface StreakCalendarProps {
  streakDays?: number[]; // array of day numbers with streaks (e.g., [1, 2, 3, 5, 7])
}

export default function StreakCalendar({ streakDays = [] }: StreakCalendarProps) {
  const { width } = useWindowDimensions();
  const cellSize = (width - 40 - 6 * 8) / 7; // 20px padding on each side, 8px gaps between 7 cells

  const calendar = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    // Get first day of month and total days
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevMonthLastDate = new Date(year, month, 0).getDate();

    const days: CalendarDay[] = [];

    // Previous month's days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: prevMonthLastDate - i,
        isCurrentMonth: false,
        hasStreak: false,
        isToday: false,
      });
    }

    // Current month's days
    for (let date = 1; date <= lastDate; date++) {
      const isToday = date === today.getDate();
      days.push({
        date,
        isCurrentMonth: true,
        hasStreak: streakDays.includes(date),
        isToday,
      });
    }

    // Next month's days
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let date = 1; date <= remainingDays; date++) {
      days.push({
        date,
        isCurrentMonth: false,
        hasStreak: false,
        isToday: false,
      });
    }

    return days;
  }, [streakDays]);

  const monthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <View style={styles.container}>
      <Text style={styles.monthLabel}>{monthName.toUpperCase()}</Text>

      {/* Day labels */}
      <View style={styles.weekLabels}>
        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
          <View key={day} style={[styles.dayLabelCell, { width: cellSize }]}>
            <Text style={styles.dayLabelText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.calendarGrid}>
        {calendar.map((day, idx) => (
          <View
            key={idx}
            style={[
              styles.dayCell,
              { width: cellSize, height: cellSize },
            ]}
          >
            <View
              style={[
                styles.dayContent,
                day.isToday && styles.dayContentToday,
                day.hasStreak && day.isCurrentMonth && styles.dayContentStreak,
              ]}
            >
              <Text
                style={[
                  styles.dayNumber,
                  !day.isCurrentMonth && styles.dayNumberOtherMonth,
                  day.hasStreak && day.isCurrentMonth && styles.dayNumberStreak,
                ]}
              >
                {day.date}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendDotStreak]} />
          <Text style={styles.legendLabel}>Shot taken</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendDotToday]} />
          <Text style={styles.legendLabel}>Today</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  monthLabel: {
    ...Typography.headlineSm,
    color: Colors.onBackground,
    marginBottom: 16,
    fontSize: 14,
    letterSpacing: 2,
  },
  weekLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayLabelCell: {
    alignItems: 'center',
  },
  dayLabelText: {
    ...Typography.labelSm,
    color: Colors.textMuted,
    fontSize: 10,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayContent: {
    flex: 1,
    width: '100%',
    aspectRatio: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceContainerLow,
  },
  dayContentStreak: {
    backgroundColor: Colors.primary,
  },
  dayContentToday: {
    borderWidth: 2,
    borderColor: Colors.primaryContainer,
  },
  dayNumber: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 12,
  },
  dayNumberOtherMonth: {
    color: Colors.textMuted,
    opacity: 0.5,
  },
  dayNumberStreak: {
    color: Colors.onPrimary,
  },
  legend: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendDotStreak: {
    backgroundColor: Colors.primary,
  },
  legendDotToday: {
    backgroundColor: Colors.primaryContainer,
  },
  legendLabel: {
    ...Typography.labelSm,
    color: Colors.textMuted,
    fontSize: 11,
  },
});
