export const ALL_CATEGORIES = ["İsim", "Şehir", "Hayvan", "Bitki", "Eşya", "Ünlü"] as const;
export const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "İ", "K", "L", "M", "N", "O", "P", "R", "S", "T", "U", "V", "Y", "Z"];

export type PowerId = "double" | "joker" | "shield";
export type RoomStatus = "lobby" | "playing" | "scoring" | "results" | "finished";

export type Player = {
  uid: string;
  name: string;
  score: number;
  joinedAt: number;
  lastSeen: number;
  isHost: boolean;
  powers: Record<PowerId, boolean>;
};

export type RoomSettings = {
  rounds: number;
  seconds: number;
  categories: string[];
  powersEnabled: boolean;
};

export type SubmittedAnswer = {
  values: Record<string, string>;
  submittedAt: number;
  power: PowerId | null;
};

export type Judgement = {
  answer: string;
  normalized: string;
  valid: boolean;
  points: number;
  reason: string;
};

export type PlayerRoundResult = {
  uid: string;
  name: string;
  basePoints: number;
  earnedPoints: number;
  power: PowerId | null;
  answers: Record<string, Judgement>;
};

export type RoundResult = {
  round: number;
  letter: string;
  aiMode: "groq" | "basic";
  players: Record<string, PlayerRoundResult>;
  scoredAt: number;
};

export type Room = {
  code: string;
  hostUid: string;
  createdAt: number;
  status: RoomStatus;
  settings: RoomSettings;
  players: Record<string, Player>;
  game?: {
    round: number;
    letter: string;
    startedAt: number;
    endsAt: number;
  };
  answers?: Record<string, Record<string, SubmittedAnswer>>;
  results?: Record<string, RoundResult>;
};

export function pickLetter(previous?: string) {
  const choices = LETTERS.filter((letter) => letter !== previous);
  return choices[Math.floor(Math.random() * choices.length)];
}

export function makeRoomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

export function cleanName(value: string) {
  return value.replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 18);
}

export function newPlayer(uid: string, name: string, isHost: boolean): Player {
  const now = Date.now();
  return {
    uid,
    name: cleanName(name),
    score: 0,
    joinedAt: now,
    lastSeen: now,
    isHost,
    powers: { double: true, joker: true, shield: true },
  };
}
