import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalPhoto } from '../types';

const SHOTS_DIR = FileSystem.documentDirectory + 'shots/';
const METADATA_KEY = 'shots_metadata';

async function ensureShotsDirExists(): Promise<void> {
  const info = await FileSystem.getInfoAsync(SHOTS_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(SHOTS_DIR, { intermediates: true });
  }
}

async function readMetadata(): Promise<LocalPhoto[]> {
  const raw = await AsyncStorage.getItem(METADATA_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as LocalPhoto[];
}

async function writeMetadata(photos: LocalPhoto[]): Promise<void> {
  await AsyncStorage.setItem(METADATA_KEY, JSON.stringify(photos));
}

/**
 * Copy a temp URI to the permanent shots directory and persist its metadata.
 * If a photo already exists for the same dateKey it is overwritten.
 */
export async function savePhoto(
  uri: string,
  dateKey: string,
  label?: string,
): Promise<LocalPhoto> {
  await ensureShotsDirExists();

  const destPath = SHOTS_DIR + dateKey + '.jpg';
  await FileSystem.copyAsync({ from: uri, to: destPath });

  const photo: LocalPhoto = { dateKey, localPath: destPath, label };

  const existing = await readMetadata();
  const updated = existing.filter((p) => p.dateKey !== dateKey);
  updated.push(photo);
  await writeMetadata(updated);

  return photo;
}

/**
 * Return all saved photos sorted by date descending (newest first).
 */
export async function getPhotos(): Promise<LocalPhoto[]> {
  const photos = await readMetadata();
  return photos.sort((a, b) => b.dateKey.localeCompare(a.dateKey));
}
