import { create } from "zustand";
import { decryptMessage, pem2ab } from "../utils/secUtils";

export type ChatRoomInfo = {
  id: string;
  verification: string;
  expiration: number;
};

type ChatRoomState = {
  id: string;
  symKey: CryptoKey | null;
  verification: string;
  expiration: number;
  enabled: boolean;
  sender: string;
};

type ChatRoomAction = {
  setChatRoomState: (newState: ChatRoomInfo) => void;
  verify: (pem: string) => Promise<boolean>;
};

export const useChatRoom = create<ChatRoomState & ChatRoomAction>(
  (set, get) => ({
    id: "",
    symKey: null,
    verification: "",
    expiration: 0,
    enabled: false,
    sender: "",
    setChatRoomState: (newState) => {
      set((state) => ({
        ...state,
        id: newState.id,
        verification: newState.verification,
        expiration: newState.expiration,
        sender: window.crypto.randomUUID().toString().split("-")[0],
      }));
    },
    verify: async (pem) => {
      try {
        const newSymKey = await window.crypto.subtle.importKey(
          "raw",
          pem2ab(pem),
          { name: "AES-GCM" },
          false,
          ["encrypt", "decrypt"]
        );
        const verificationDecrypted = await decryptMessage(
          get().verification,
          newSymKey
        );
        const match = pem === verificationDecrypted;
        if (match) {
          set((state) => ({ ...state, symKey: newSymKey, enabled: true }));
        }
        return match;
      } catch (e) {
        return false;
      }
    },
  })
);
