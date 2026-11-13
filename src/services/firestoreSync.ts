import { doc, onSnapshot, setDoc, serverTimestamp, type Unsubscribe } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useStore } from "../hooks/useStore";

let unsubscribeSnapshot: Unsubscribe | null = null;
let saveTimeout: ReturnType<typeof setTimeout> | null = null;
let isApplyingRemoteUpdate = false;
let subscriberUnsubscribe: (() => void) | null = null;

// Helper to remove undefined values before sending to Firestore
const sanitizeForFirestore = (obj: any): any => {
    return JSON.parse(JSON.stringify(obj, (_, v) => (v === undefined ? null : v)));
};

/**
 * Starts real-time bi-directional synchronization with Cloud Firestore
 */
export const startFirestoreSync = (userId: string) => {
    if (!userId) return;

    // Clean up previous snapshot listener if any
    if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
    }

    useStore.getState().setSyncStatus('syncing');

    const boardDocRef = doc(db, "users", userId, "kanban", "board");

    unsubscribeSnapshot = onSnapshot(
        boardDocRef,
        async (docSnap) => {
            try {
                if (!docSnap.exists()) {
                    // Document does not exist in Cloud yet.
                    // Seed Firestore with the user's current local board data!
                    const current = useStore.getState();
                    const initialPayload = sanitizeForFirestore({
                        tasks: current.tasks,
                        columns: current.columns,
                        columnOrder: current.columnOrder,
                        activities: current.activities || [],
                        updatedAt: serverTimestamp(),
                    });
                    await setDoc(boardDocRef, initialPayload);
                    useStore.getState().setSyncStatus('synced');
                } else {
                    // Check if this snapshot was triggered by a local pending write
                    if (docSnap.metadata.hasPendingWrites) {
                        useStore.getState().setSyncStatus('syncing');
                        return;
                    }

                    const data = docSnap.data();
                    if (data && data.tasks && data.columns && Array.isArray(data.columnOrder)) {
                        isApplyingRemoteUpdate = true;
                        useStore.getState().syncFromRemote({
                            tasks: data.tasks,
                            columns: data.columns,
                            columnOrder: data.columnOrder,
                            activities: Array.isArray(data.activities) ? data.activities : undefined,
                        });
                        setTimeout(() => {
                            isApplyingRemoteUpdate = false;
                        }, 50);
                    }
                    useStore.getState().setSyncStatus('synced');
                }
            } catch (err: any) {
                console.error("Firestore snapshot processing error:", err);
                const msg = err.code === 'permission-denied'
                    ? "Permission denied. Update Firestore rules in Firebase Console."
                    : err.message || "Error processing snapshot.";
                useStore.getState().setSyncStatus('error', msg);
            }
        },
            (error: any) => {
                console.error("Firestore onSnapshot error:", error);
                const msg = error.code === 'permission-denied'
                    ? "Permission denied. Update Firestore rules in Firebase Console."
                    : error.message || "Failed to connect to Cloud Firestore.";
                useStore.getState().setSyncStatus('error', msg);
            }
    );

    // Initialize the Zustand state subscriber if not already started
    if (!subscriberUnsubscribe) {
        subscriberUnsubscribe = initStoreSubscriber();
    }
};

/**
 * Saves current board state to Firestore (debounced to avoid spamming writes)
 */
export const saveBoardToCloud = async (userId: string) => {
    if (!userId) return;
    try {
        useStore.getState().setSyncStatus('syncing');
        const state = useStore.getState();
        const boardDocRef = doc(db, "users", userId, "kanban", "board");
        const payload = sanitizeForFirestore({
            tasks: state.tasks,
            columns: state.columns,
            columnOrder: state.columnOrder,
            activities: state.activities || [],
            updatedAt: serverTimestamp(),
        });
        await setDoc(boardDocRef, payload, { merge: true });
        useStore.getState().setSyncStatus('synced');
    } catch (err) {
        console.error("Error saving board to Firestore:", err);
        useStore.getState().setSyncStatus('error');
    }
};

/**
 * Subscribes to local Zustand store changes and automatically persists to Cloud Firestore
 */
export const initStoreSubscriber = () => {
    return useStore.subscribe((state, prevState) => {
        const user = auth.currentUser;
        if (!user) return;

        // Skip saving if this change was triggered by remote Firestore snapshot
        if (isApplyingRemoteUpdate) return;

        // Check if board content or activities changed
        const hasBoardChanged =
            state.tasks !== prevState.tasks ||
            state.columns !== prevState.columns ||
            state.columnOrder !== prevState.columnOrder ||
            state.activities !== prevState.activities;

        if (!hasBoardChanged) return;

        // Debounce saving by 500ms to batch drag/drop and rapid actions smoothly
        if (saveTimeout) clearTimeout(saveTimeout);

        saveTimeout = setTimeout(async () => {
            await saveBoardToCloud(user.uid);
        }, 500);
    });
};

/**
 * Stops Firestore sync and cleans up all listeners and timers
 */
export const stopFirestoreSync = () => {
    if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
    }
    if (subscriberUnsubscribe) {
        subscriberUnsubscribe();
        subscriberUnsubscribe = null;
    }
    if (saveTimeout) {
        clearTimeout(saveTimeout);
        saveTimeout = null;
    }
    useStore.getState().setSyncStatus('idle');
};

