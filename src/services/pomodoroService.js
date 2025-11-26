import { collection, addDoc, getDocs, query, where, orderBy, limit, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const POMODOROS_COLLECTION = 'pomodoros';

/**
 * Save a completed pomodoro session for a user.
 * @param {string} userId - Firebase Auth UID
 * @param {Object} session - Session data
 */
export async function addPomodoroSession(userId, session) {
  if (!userId) return;

  const colRef = collection(db, POMODOROS_COLLECTION);

  const payload = {
    userId,
    category: session.category || 'Work',
    description: session.description || '',
    durationSeconds: session.durationSeconds,
    startedAt: session.startedAt || null,
    endedAt: session.endedAt || null,
    sessionNumber: session.sessionNumber || null,
    createdAt: new Date().toISOString(),
  };

  await addDoc(colRef, payload);
}

/**
 * Fetch recent pomodoro sessions for a user.
 * @param {string} userId - Firebase Auth UID
 * @param {Object} options
 * @param {number} options.limitCount - Max number of sessions to return
 */
export async function fetchPomodoroSessions(userId, { limitCount = 50 } = {}) {
  if (!userId) return [];

  const colRef = collection(db, POMODOROS_COLLECTION);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTodayIso = startOfToday.toISOString();

  const q = query(
    colRef,
    where('userId', '==', userId),
    where('endedAt', '>=', startOfTodayIso),
    orderBy('endedAt', 'desc'),
    limit(limitCount),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Fetch all pomodoro sessions for a user (no date filter).
 * @param {string} userId - Firebase Auth UID
 * @param {Object} options
 * @param {number} options.limitCount - Max number of sessions to return
 */
export async function fetchAllPomodoroSessions(userId, { limitCount = 500 } = {}) {
  if (!userId) return [];

  const colRef = collection(db, POMODOROS_COLLECTION);
  const q = query(
    colRef,
    where('userId', '==', userId),
    orderBy('endedAt', 'desc'),
    limit(limitCount),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Delete a pomodoro session by id for a given user.
 * @param {string} userId - Firebase Auth UID
 * @param {string} sessionId - Firestore document id
 */
export async function deletePomodoroSession(userId, sessionId) {
  if (!userId || !sessionId) return;
  const docRef = doc(db, POMODOROS_COLLECTION, sessionId);
  await deleteDoc(docRef);
}



