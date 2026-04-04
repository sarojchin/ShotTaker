import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';

interface Props {
  uri: string | null;
  username: string;
  size?: number;
}

export default function Avatar({ uri, username, size = 40 }: Props) {
  const initials = username.slice(0, 2).toUpperCase();
  const borderRadius = size / 2;

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.image, { width: size, height: size, borderRadius }]}
      />
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        { width: size, height: size, borderRadius },
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.36 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: Colors.surface,
  },
  placeholder: {
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    ...Typography.labelMd,
    color: Colors.onSurfaceVariant,
  },
});
