import { File, Directory, Paths } from 'expo-file-system/next';
import { LocalPhoto } from '../types';

const shotsDir = new Directory(Paths.document, 'shots');
const metaFile = new File(Paths.document, 'shots-meta.json');

function ensureShotsDir(): void {
  if (!shotsDir.exists) {
    shotsDir.create();
  }
}

function readMeta(): LocalPhoto[] {
  if (!metaFile.exists) return [];
  try {
    const raw = metaFile.text;
    return JSON.parse(raw) as LocalPhoto[];
  } catch {
    return [];
  }
}

function writeMeta(photos: LocalPhoto[]): void {
  metaFile.write(JSON.stringify(photos));
}

export function savePhoto(uri: string, dateKey: string, label?: string): LocalPhoto {
  ensureShotsDir();

  const filename = `${dateKey}-${Date.now()}.jpg`;
  const dest = new File(shotsDir, filename);
  const source = new File(uri);
  source.copy(dest);

  const photo: LocalPhoto = {
    dateKey,
    localPath: dest.uri,
    ...(label ? { label } : {}),
  };

  const photos = readMeta();
  photos.push(photo);
  writeMeta(photos);

  return photo;
}

export function getPhotos(): LocalPhoto[] {
  const photos = readMeta();
  return photos.sort((a, b) => b.dateKey.localeCompare(a.dateKey));
}
