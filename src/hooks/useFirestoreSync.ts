import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { startFirestoreSync, stopFirestoreSync, saveBoardToCloud } from "../services/firestoreSync";
import { useStore } from "./useStore";

export const useFirestoreSync = () => {
    const syncStatus = useStore((state) => state.syncStatus);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                startFirestoreSync(user.uid);
            } else {
                stopFirestoreSync();
            }
        });

        return () => {
            unsubscribeAuth();
            stopFirestoreSync();
        };
    }, []);

    const triggerManualSave = () => {
        if (auth.currentUser) {
            saveBoardToCloud(auth.currentUser.uid);
        }
    };

    return {
        syncStatus,
        triggerManualSave,
    };
};
