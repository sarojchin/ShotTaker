import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';

interface Props {
  onUploadComplete?: (uri: string) => void;
  onReviewShot?: (uri: string) => void;
}

export default function ShotUploadCard({ onUploadComplete, onReviewShot }: Props) {
  const [uploadedUri, setUploadedUri] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const cardRotate = useRef(new Animated.Value(0)).current;
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(12)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const goalOpacity = useRef(new Animated.Value(0)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsTranslateY = useRef(new Animated.Value(8)).current;

  const rotateY = cardRotate.interpolate({
    inputRange: [-90, 0, 90],
    outputRange: ['-90deg', '0deg', '90deg'],
  });

  const flipToBack = (uri: string) => {
    // Phase 1: tilt front away
    Animated.timing(cardRotate, {
      toValue: 90,
      duration: 210,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      // Swap face at the invisible midpoint
      setUploadedUri(uri);
      setIsFlipped(true);
      cardRotate.setValue(-90);

      // Phase 2: spring the back face in
      Animated.parallel([
        Animated.spring(cardRotate, {
          toValue: 0,
          friction: 7,
          tension: 75,
          useNativeDriver: true,
        }),
        // Checkmark badge pops with overshoot
        Animated.sequence([
          Animated.delay(180),
          Animated.spring(checkmarkScale, {
            toValue: 1,
            friction: 4,
            tension: 180,
            useNativeDriver: true,
          }),
        ]),
        // "DAILY GOAL REACHED" fades in
        Animated.sequence([
          Animated.delay(220),
          Animated.timing(goalOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        // Headline slides up and fades in
        Animated.sequence([
          Animated.delay(270),
          Animated.parallel([
            Animated.spring(titleTranslateY, {
              toValue: 0,
              friction: 8,
              tension: 90,
              useNativeDriver: true,
            }),
            Animated.timing(titleOpacity, {
              toValue: 1,
              duration: 250,
              useNativeDriver: true,
            }),
          ]),
        ]),
        // Buttons slide up and fade in
        Animated.sequence([
          Animated.delay(360),
          Animated.parallel([
            Animated.spring(buttonsTranslateY, {
              toValue: 0,
              friction: 8,
              tension: 90,
              useNativeDriver: true,
            }),
            Animated.timing(buttonsOpacity, {
              toValue: 1,
              duration: 220,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]).start();
    });
  };

  const flipToFront = (afterFlip?: () => void) => {
    Animated.timing(cardRotate, {
      toValue: 90,
      duration: 210,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setIsFlipped(false);
      setUploadedUri(null);
      checkmarkScale.setValue(0);
      titleTranslateY.setValue(12);
      titleOpacity.setValue(0);
      goalOpacity.setValue(0);
      buttonsOpacity.setValue(0);
      buttonsTranslateY.setValue(8);
      cardRotate.setValue(-90);

      Animated.spring(cardRotate, {
        toValue: 0,
        friction: 7,
        tension: 75,
        useNativeDriver: true,
      }).start(afterFlip);
    });
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo access to upload your shot.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      flipToBack(uri);
      onUploadComplete?.(uri);
    }
  };

  const handleUploadAnother = () => {
    flipToFront(() => pickImage());
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          { transform: [{ perspective: 1200 }, { rotateY }] },
        ]}
      >
        {!isFlipped ? (
          /* ── FRONT: Upload CTA ── */
          <TouchableOpacity
            onPress={pickImage}
            activeOpacity={0.85}
            style={styles.cardTouchable}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryContainer]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.uploadGradient}
            >
              <Ionicons
                name="camera"
                size={32}
                color={Colors.onPrimary}
                style={{ marginBottom: 12 }}
              />
              <Text style={styles.uploadTitle}>UPLOAD YOUR DAILY SHOT</Text>
              <Text style={styles.uploadSubtitle}>
                Perfect your craft, one shot at a time.{'\n'}Capture and upload before midnight.
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          /* ── BACK: Shot Uploaded ── */
          <View style={styles.uploadedCard}>
            {/* Phone mockup with uploaded image */}
            <View style={styles.phoneMockupWrapper}>
              <View style={styles.phoneMockup}>
                <View style={styles.phoneSpeaker} />
                {uploadedUri ? (
                  <Image
                    source={{ uri: uploadedUri }}
                    style={styles.phoneImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.phoneImage, { backgroundColor: Colors.surfaceContainerHigh }]} />
                )}
              </View>
              {/* Green checkmark badge */}
              <Animated.View
                style={[
                  styles.checkBadge,
                  { transform: [{ scale: checkmarkScale }] },
                ]}
              >
                <Ionicons name="checkmark" size={20} color={Colors.white} />
              </Animated.View>
            </View>

            {/* Daily goal reached row */}
            <Animated.View style={[styles.goalRow, { opacity: goalOpacity }]}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
              <Text style={styles.goalText}>DAILY GOAL REACHED</Text>
            </Animated.View>

            {/* SHOT UPLOADED headline */}
            <Animated.Text
              style={[
                styles.uploadedHeadline,
                {
                  opacity: titleOpacity,
                  transform: [{ translateY: titleTranslateY }],
                },
              ]}
            >
              SHOT{'\n'}UPLOADED!
            </Animated.Text>

            {/* Action buttons */}
            <Animated.View
              style={[
                styles.buttonRow,
                {
                  opacity: buttonsOpacity,
                  transform: [{ translateY: buttonsTranslateY }],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.reviewButton}
                activeOpacity={0.8}
                onPress={() => uploadedUri && onReviewShot?.(uploadedUri)}
              >
                <Text style={styles.reviewButtonText}>REVIEW{'\n'}SHOT</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.anotherButton}
                activeOpacity={0.8}
                onPress={handleUploadAnother}
              >
                <Text style={styles.anotherButtonText}>UPLOAD{'\n'}ANOTHER</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  card: {
    borderRadius: 6,
    overflow: 'hidden',
    // Ambient shadow per design system
    shadowColor: Colors.onBackground,
    shadowOpacity: 0.05,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  cardTouchable: {
    borderRadius: 6,
    overflow: 'hidden',
  },

  // ── Front face ──
  uploadGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  uploadTitle: {
    ...Typography.labelLg,
    color: Colors.onPrimary,
    fontSize: 16,
    letterSpacing: 2.5,
    textAlign: 'center',
  },
  uploadSubtitle: {
    ...Typography.bodySm,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },

  // ── Back face ──
  uploadedCard: {
    backgroundColor: Colors.surfaceElevated,
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
  },

  // Phone mockup
  phoneMockupWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  phoneMockup: {
    width: 140,
    height: 176,
    backgroundColor: Colors.inverseSurface,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    paddingTop: 10,
  },
  phoneSpeaker: {
    width: 36,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    marginBottom: 6,
  },
  phoneImage: {
    flex: 1,
    width: '100%',
    borderRadius: 0,
  },

  // Checkmark badge
  checkBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.success,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  // Goal row
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  goalText: {
    ...Typography.labelSm,
    color: Colors.success,
    letterSpacing: 1.8,
    fontSize: 11,
  },

  // Headline
  uploadedHeadline: {
    fontSize: 52,
    fontWeight: '800',
    fontStyle: 'italic',
    color: Colors.onBackground,
    letterSpacing: -1,
    lineHeight: 56,
    textAlign: 'center',
    marginBottom: 24,
  },

  // Buttons
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  reviewButton: {
    flex: 1,
    backgroundColor: Colors.inverseSurface,
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewButtonText: {
    ...Typography.labelMd,
    color: Colors.inverseOnSurface,
    letterSpacing: 1.5,
    textAlign: 'center',
    lineHeight: 18,
  },
  anotherButton: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  anotherButtonText: {
    ...Typography.labelMd,
    color: Colors.onBackground,
    letterSpacing: 1.5,
    textAlign: 'center',
    lineHeight: 18,
  },
});
