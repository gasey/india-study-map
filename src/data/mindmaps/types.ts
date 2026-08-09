import type { SubjectId } from '@/types';

// ============================================
// MIND MAP SCHEMA
//
// A mind map is a tree: one root, branches, leaves.
// Each node can carry a `note` (shown on select) and an
// optional `chapterId` linking back into the Study Map.
// One file per map in src/data/mindmaps/, registered in
// src/data/mindmaps/index.ts — same pattern as everything.
//
// `chapterId` is also what the canvas uses to show real mastery state
// (see lib/mindMapMastery.ts) — a node only gets a state pill/accuracy
// if it carries one. Most outline nodes won't, and that's fine: showing
// nothing beats showing a made-up number.
// ============================================

export interface MindNode {
  id: string;
  label: string;
  /** Longer explanation shown in the detail panel when selected. */
  note?: string;
  /** Jump target in the Study Map module — also what mastery state reads. */
  chapterId?: string;
  children?: MindNode[];
}

export interface MindMap {
  id: string;
  title: string;
  description: string;
  /** Drives the card hue — fixed per subject app-wide, see tokens.css. */
  subject: SubjectId;
  root: MindNode;
}
