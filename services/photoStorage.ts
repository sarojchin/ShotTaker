import { File, Directory, Paths } from 'expo-file-system/next';
import { LocalPhoto } from '../types';

const shotsDir = new Directory(Paths.document, 'shots');
const metadataFile = new File(Paths.document, 'shots_metadata.json');

function ensureShotsDirExists(): void {
  if (!shotsDir.exists) {
    shotsDir.create();
  }
}

function readMetadata(): LocalPhoto[] {
  if (!metadataFile.exists) return [];
  try {
    const raw = metadataFile.text();
    return JSON.parse(raw) as LocalPhoto[];
  } catch {
    return [];
  }
}

function writeMetadata(photos: LocalPhoto[]): void {
  metadataFile.write(JSON.stringify(photos));
}

/**
 * Copy a temp URI to the permanent shots directory and persist its metadata.
 * If a photo already exists for the same dateKey it is overwritten.
 */
export function savePhoto(
  uri: string,
  dateKey: string,
  label?: string,
): LocalPhoto {
  ensureShotsDirExists();

  const destFile = new File(shotsDir, dateKey + '.jpg');

  // Remove existing file for this date if re-uploading
  if (destFile.exists) {
    destFile.delete();
  }

  const sourceFile = new File(uri);
  sourceFile.copy(destFile);

  const photo: LocalPhoto = { dateKey, localPath: destFile.uri, label };

  const existing = readMetadata();
  const updated = existing.filter((p) => p.dateKey !== dateKey);
  updated.push(photo);
  writeMetadata(updated);

  return photo;
}

/**
 * Return all saved photos sorted by date descending (newest first).
 */
export function getPhotos(): LocalPhoto[] {
  const photos = readMetadata();
  return photos.sort((a, b) => b.dateKey.localeCompare(a.dateKey));
}
