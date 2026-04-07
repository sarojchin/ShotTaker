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
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';

type CardFace = 'front' | 'meta' | 'uploaded';

interface Props {
  onUploadComplete?: (uri: string, title?: string, location?: string, caption?: string, notes?: string) => void;
  onReviewShot?: (uri: string) => void;
}

export default function ShotUploadCard({ onUploadComplete, onReviewShot }: Props) {
  const [cardFace, setCardFace] = useState<CardFace>('front');
  const [pendingUri, setPendingUri] = useState<string | null>(null);
  const [uploadedUri, setUploadedUri] = useState<string | null>(null);

  // Metadata form fields
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [caption, setCaption] = useState('');
  const [notes, setNotes] = useState('');

  // Card flip animation
  const cardRotate = useRef(new Animated.Value(0)).current;

  // Meta face animations
  const photoPopScale = useRef(new Animated.Value(0.85)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(10)).current;

  // Uploaded face animations
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const mockupScale = useRef(new Animated.Value(1)).current;
  const headlineScale = useRef(new Animated.Value(1)).current;
  const titleTranslateY = useRef(new Animated.Value(12)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const goalOpacity = useRef(new Animated.Value(0)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsTranslateY = useRef(new Animated.Value(8)).current;

  const rotateY = cardRotate.interpolate({
    inputRange: [-90, 0, 90],
    outputRange: ['-90deg', '0deg', '90deg'],
  });

  const resetMetaAnimations = () => {
    photoPopScale.setValue(0.85);
    formOpacity.setValue(0);
    formTranslateY.setValue(10);
  };

  const resetUploadedAnimations = () => {
    checkmarkScale.setValue(0);
    mockupScale.setValue(1);
    headlineScale.setValue(1);
    titleTranslateY.setValue(12);
    titleOpacity.setValue(0);
    goalOpacity.setValue(0);
    buttonsOpacity.setValue(0);
    buttonsTranslateY.setValue(8);
  };

  const animateMetaEntrance = () => {
    Animated.parallel([
      Animated.spring(photoPopScale, {
        toValue: 1,
        friction: 5,
        tension: 160,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(120),
        Animated.parallel([
          Animated.spring(formTranslateY, {
            toValue: 0,
            friction: 8,
            tension: 90,
            useNativeDriver: true,
          }),
          Animated.timing(formOpacity, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  };

  const flipToMeta = (uri: string) => {
    setTitle('');
    setLocation('');
    setCaption('');
    setNotes('');
    resetMetaAnimations();

    Animated.timing(cardRotate, {
      toValue: 90,
      duration: 210,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setPendingUri(uri);
      setCardFace('meta');
      cardRotate.setValue(-90);

      Animated.spring(cardRotate, {
        toValue: 0,
        friction: 7,
        tension: 75,
        useNativeDriver: true,
      }).start(() => {
        animateMetaEntrance();
      });
    });
  };

  const flipToUploaded = (uri: string) => {
    resetUploadedAnimations();

    Animated.timing(cardRotate, {
      toValue: 90,
      duration: 210,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setUploadedUri(uri);
      setCardFace('uploaded');
      cardRotate.setValue(-90);

      Animated.parallel([
        Animated.spring(cardRotate, {
          toValue: 0,
          friction: 7,
          tension: 75,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(180),
          Animated.spring(checkmarkScale, {
            toValue: 1,
            friction: 4,
            tension: 180,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(220),
          Animated.timing(goalOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
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
      setCardFace('front');
      setPendingUri(null);
      setUploadedUri(null);
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
      flipToMeta(result.assets[0].uri);
    }
  };

  const handleUpload = () => {
    if (!pendingUri) return;
    onUploadComplete?.(pendingUri, title || undefined, location || undefined, caption || undefined, notes || undefined);
    flipToUploaded(pendingUri);
  };

  const handleUploadAnother = async () => {
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
      flipToMeta(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          { transform: [{ perspective: 1200 }, { rotateY }] },
        ]}
      >
        {cardFace === 'front' && (
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
        )}

        {cardFace === 'meta' && (
          /* ── META: Photo preview + metadata form ── */
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.metaCard}>
                {/* Photo preview with pop animation */}
                <Animated.View
                  style={[
                    styles.metaPhotoWrapper,
                    { transform: [{ scale: photoPopScale }] },
                  ]}
                >
                  {pendingUri ? (
                    <Image
                      source={{ uri: pendingUri }}
                      style={styles.metaPhoto}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.metaPhoto, { backgroundColor: Colors.surfaceContainerHigh }]} />
                  )}
                </Animated.View>

                {/* Form fields */}
                <Animated.View
                  style={[
                    styles.metaForm,
                    {
                      opacity: formOpacity,
                      transform: [{ translateY: formTranslateY }],
                    },
                  ]}
                >
                  {/* Title */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>TITLE</Text>
                    <TextInput
                      style={styles.fieldInput}
                      value={title}
                      onChangeText={setTitle}
                      placeholder="optional"
                      placeholderTextColor={Colors.outlineVariant}
                      returnKeyType="next"
                    />
                    <View style={styles.fieldUnderline} />
                  </View>

                  {/* Location */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>LOCATION</Text>
                    <TextInput
                      style={styles.fieldInput}
                      value={location}
                      onChangeText={setLocation}
                      placeholder="optional"
                      placeholderTextColor={Colors.outlineVariant}
                      returnKeyType="next"
                    />
                    <View style={styles.fieldUnderline} />
                  </View>

                  {/* Caption */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>CAPTION</Text>
                    <TextInput
                      style={styles.fieldInput}
                      value={caption}
                      onChangeText={setCaption}
                      placeholder="optional"
                      placeholderTextColor={Colors.outlineVariant}
                      returnKeyType="next"
                      multiline
                    />
                    <View style={styles.fieldUnderline} />
                  </View>

                  {/* Notes */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>NOTES</Text>
                    <TextInput
                      style={styles.fieldInput}
                      value={notes}
                      onChangeText={setNotes}
                      placeholder="optional"
                      placeholderTextColor={Colors.outlineVariant}
                      returnKeyType="done"
                      multiline
                    />
                    <View style={styles.fieldUnderline} />
                  </View>

                  {/* Upload button */}
                  <TouchableOpacity
                    style={styles.uploadButton}
                    activeOpacity={0.85}
                    onPress={handleUpload}
                  >
                    <Text style={styles.uploadButtonText}>UPLOAD SHOT</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        )}

        {cardFace === 'uploaded' && (
          /* ── UPLOADED: Confirmation ── */
          <View style={styles.uploadedCard}>
            {/* Phone mockup with uploaded image */}
            <Animated.View style={[styles.phoneMockupWrapper, { transform: [{ scale: mockupScale }] }]}>
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
            </Animated.View>

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
                  transform: [{ translateY: titleTranslateY }, { scale: headlineScale }],
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

  // ── Meta face ──
  metaCard: {
    backgroundColor: Colors.surfaceElevated,
    paddingTop: 0,
    paddingBottom: 28,
  },
  metaPhotoWrapper: {
    width: '100%',
  },
  metaPhoto: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  metaForm: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    ...Typography.labelSm,
    color: Colors.textMuted,
    letterSpacing: 1.5,
    fontSize: 11,
    marginBottom: 6,
  },
  fieldInput: {
    ...Typography.bodyMd,
    color: Colors.onBackground,
    paddingVertical: 6,
    paddingHorizontal: 0,
    fontSize: 15,
  },
  fieldUnderline: {
    height: 1,
    backgroundColor: Colors.outlineVariant,
    marginTop: 2,
  },
  uploadButton: {
    backgroundColor: Colors.primary,
    borderRadius: 6,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  uploadButtonText: {
    ...Typography.labelMd,
    color: Colors.onPrimary,
    letterSpacing: 2,
  },

  // ── Uploaded face ──
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
