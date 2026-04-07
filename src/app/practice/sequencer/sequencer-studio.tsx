"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { H1, H3, Text } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import {
  THREE_D_YOGA90_LICENSE,
  THREE_D_YOGA90_SLUGS,
  THREE_D_YOGA90_SOURCE,
} from "./pose-directory";
import styles from "./sequencer.module.css";

const JOINTS = [
  "head",
  "neck",
  "hip",
  "leftShoulder",
  "leftElbow",
  "leftHand",
  "rightShoulder",
  "rightElbow",
  "rightHand",
  "leftKnee",
  "leftFoot",
  "rightKnee",
  "rightFoot",
] as const;

type JointName = (typeof JOINTS)[number];

type PoseCategory =
  | "warmup"
  | "standing"
  | "flow"
  | "pranayama"
  | "seated"
  | "restorative";

type Point = {
  x: number;
  y: number;
};

type PoseFrame = Record<JointName, Point>;

type Pose = {
  id: string;
  name: string;
  sanskrit: string;
  category: PoseCategory;
  defaultSeconds: number;
  breathCue: string;
  description: string;
  frame: PoseFrame;
  origin?: "core" | "3dyoga90" | "custom";
  sourceLabel?: string;
};

type TeachingThread = {
  id: string;
  name: string;
  source: string;
  wisdom: string;
  science: string;
  spirituality: string;
};

type SequenceStep = {
  id: string;
  poseId: string;
  seconds: number;
  threadId: string;
};

const CATEGORY_THREAD_MAP: Record<PoseCategory, string> = {
  warmup: "sutra-balance",
  standing: "gita-action",
  flow: "vinyasa-heat",
  pranayama: "breath-bridge",
  seated: "light-on-yoga",
  restorative: "sutra-balance",
};

const TEACHING_THREADS: TeachingThread[] = [
  {
    id: "gita-action",
    name: "Purposeful Action",
    source: "Bhagavad Gita",
    wisdom:
      "Invite students to give full effort while releasing attachment to outcome.",
    science:
      "Task-focused attention reduces performance anxiety and preserves coordination under fatigue.",
    spirituality:
      "Action becomes offering: intention guides movement, ego loosens, practice becomes devotion.",
  },
  {
    id: "sutra-balance",
    name: "Steady + Ease",
    source: "Yoga Sutras",
    wisdom:
      "Steadiness and comfort can coexist: organize structure first, then soften reactivity.",
    science:
      "Co-contraction around joints improves stability, while slower exhale down-regulates threat responses.",
    spirituality:
      "Students learn to inhabit effort without aggression and stillness without collapse.",
  },
  {
    id: "light-on-yoga",
    name: "Precision as Presence",
    source: "Light on Yoga",
    wisdom:
      "Alignment is not rigid perfection; it is awareness distributed through the whole body.",
    science:
      "Clear skeletal stacking lowers unnecessary muscular load and supports efficient breathing mechanics.",
    spirituality:
      "Attention to detail becomes concentration practice and opens the mind to subtle sensation.",
  },
  {
    id: "breath-bridge",
    name: "Breath as Bridge",
    source: "Pranayama + neuroscience",
    wisdom:
      "Let breath lead transitions so movement is paced by awareness instead of urgency.",
    science:
      "Longer, smoother exhales can increase vagal tone and support emotional regulation.",
    spirituality:
      "Breath links the visible body with invisible energy, integrating westward physiology and eastern prana.",
  },
  {
    id: "vinyasa-heat",
    name: "Power with Integrity",
    source: "Power Vinyasa tradition",
    wisdom:
      "Heat serves transformation when drishti, bandha, and breath hold the container.",
    science:
      "Rhythmic full-body loading improves circulation and raises tissue temperature for safer mobility.",
    spirituality:
      "Intensity becomes ritual: each repetition refines will, humility, and trust.",
  },
];

const FRAMES: Record<string, PoseFrame> = {
  mountain: {
    head: { x: 50, y: 18 },
    neck: { x: 50, y: 30 },
    hip: { x: 50, y: 52 },
    leftShoulder: { x: 44, y: 32 },
    leftElbow: { x: 42, y: 48 },
    leftHand: { x: 42, y: 63 },
    rightShoulder: { x: 56, y: 32 },
    rightElbow: { x: 58, y: 48 },
    rightHand: { x: 58, y: 63 },
    leftKnee: { x: 47, y: 70 },
    leftFoot: { x: 46, y: 88 },
    rightKnee: { x: 53, y: 70 },
    rightFoot: { x: 54, y: 88 },
  },
  upwardSalute: {
    head: { x: 50, y: 18 },
    neck: { x: 50, y: 30 },
    hip: { x: 50, y: 52 },
    leftShoulder: { x: 44, y: 32 },
    leftElbow: { x: 40, y: 20 },
    leftHand: { x: 46, y: 10 },
    rightShoulder: { x: 56, y: 32 },
    rightElbow: { x: 60, y: 20 },
    rightHand: { x: 54, y: 10 },
    leftKnee: { x: 47, y: 70 },
    leftFoot: { x: 46, y: 88 },
    rightKnee: { x: 53, y: 70 },
    rightFoot: { x: 54, y: 88 },
  },
  fold: {
    head: { x: 62, y: 62 },
    neck: { x: 58, y: 58 },
    hip: { x: 52, y: 54 },
    leftShoulder: { x: 56, y: 56 },
    leftElbow: { x: 58, y: 70 },
    leftHand: { x: 58, y: 86 },
    rightShoulder: { x: 60, y: 56 },
    rightElbow: { x: 62, y: 70 },
    rightHand: { x: 62, y: 86 },
    leftKnee: { x: 48, y: 72 },
    leftFoot: { x: 46, y: 88 },
    rightKnee: { x: 54, y: 72 },
    rightFoot: { x: 54, y: 88 },
  },
  halfLift: {
    head: { x: 70, y: 44 },
    neck: { x: 63, y: 45 },
    hip: { x: 52, y: 53 },
    leftShoulder: { x: 60, y: 47 },
    leftElbow: { x: 64, y: 58 },
    leftHand: { x: 66, y: 69 },
    rightShoulder: { x: 66, y: 47 },
    rightElbow: { x: 70, y: 58 },
    rightHand: { x: 72, y: 69 },
    leftKnee: { x: 48, y: 72 },
    leftFoot: { x: 46, y: 88 },
    rightKnee: { x: 54, y: 72 },
    rightFoot: { x: 54, y: 88 },
  },
  chaturanga: {
    head: { x: 78, y: 52 },
    neck: { x: 72, y: 52 },
    hip: { x: 56, y: 56 },
    leftShoulder: { x: 70, y: 54 },
    leftElbow: { x: 64, y: 61 },
    leftHand: { x: 56, y: 66 },
    rightShoulder: { x: 72, y: 54 },
    rightElbow: { x: 66, y: 61 },
    rightHand: { x: 58, y: 66 },
    leftKnee: { x: 46, y: 60 },
    leftFoot: { x: 36, y: 64 },
    rightKnee: { x: 48, y: 60 },
    rightFoot: { x: 38, y: 64 },
  },
  upwardDog: {
    head: { x: 78, y: 33 },
    neck: { x: 73, y: 40 },
    hip: { x: 56, y: 62 },
    leftShoulder: { x: 70, y: 45 },
    leftElbow: { x: 62, y: 52 },
    leftHand: { x: 54, y: 66 },
    rightShoulder: { x: 72, y: 45 },
    rightElbow: { x: 64, y: 52 },
    rightHand: { x: 56, y: 66 },
    leftKnee: { x: 46, y: 66 },
    leftFoot: { x: 34, y: 70 },
    rightKnee: { x: 48, y: 66 },
    rightFoot: { x: 36, y: 70 },
  },
  downwardDog: {
    head: { x: 64, y: 56 },
    neck: { x: 62, y: 54 },
    hip: { x: 50, y: 36 },
    leftShoulder: { x: 58, y: 47 },
    leftElbow: { x: 54, y: 58 },
    leftHand: { x: 48, y: 70 },
    rightShoulder: { x: 60, y: 47 },
    rightElbow: { x: 56, y: 58 },
    rightHand: { x: 50, y: 70 },
    leftKnee: { x: 44, y: 54 },
    leftFoot: { x: 37, y: 72 },
    rightKnee: { x: 52, y: 54 },
    rightFoot: { x: 45, y: 72 },
  },
  chair: {
    head: { x: 50, y: 18 },
    neck: { x: 50, y: 30 },
    hip: { x: 50, y: 56 },
    leftShoulder: { x: 44, y: 32 },
    leftElbow: { x: 40, y: 22 },
    leftHand: { x: 45, y: 12 },
    rightShoulder: { x: 56, y: 32 },
    rightElbow: { x: 60, y: 22 },
    rightHand: { x: 55, y: 12 },
    leftKnee: { x: 45, y: 72 },
    leftFoot: { x: 42, y: 88 },
    rightKnee: { x: 55, y: 72 },
    rightFoot: { x: 58, y: 88 },
  },
  warrior1Right: {
    head: { x: 56, y: 18 },
    neck: { x: 56, y: 30 },
    hip: { x: 54, y: 52 },
    leftShoulder: { x: 50, y: 32 },
    leftElbow: { x: 48, y: 20 },
    leftHand: { x: 52, y: 9 },
    rightShoulder: { x: 62, y: 32 },
    rightElbow: { x: 64, y: 20 },
    rightHand: { x: 60, y: 9 },
    leftKnee: { x: 46, y: 58 },
    leftFoot: { x: 38, y: 72 },
    rightKnee: { x: 60, y: 72 },
    rightFoot: { x: 62, y: 88 },
  },
  warrior1Left: {
    head: { x: 44, y: 18 },
    neck: { x: 44, y: 30 },
    hip: { x: 46, y: 52 },
    leftShoulder: { x: 38, y: 32 },
    leftElbow: { x: 36, y: 20 },
    leftHand: { x: 40, y: 9 },
    rightShoulder: { x: 50, y: 32 },
    rightElbow: { x: 52, y: 20 },
    rightHand: { x: 48, y: 9 },
    leftKnee: { x: 40, y: 72 },
    leftFoot: { x: 38, y: 88 },
    rightKnee: { x: 54, y: 58 },
    rightFoot: { x: 62, y: 72 },
  },
  warrior2Right: {
    head: { x: 54, y: 22 },
    neck: { x: 54, y: 32 },
    hip: { x: 54, y: 54 },
    leftShoulder: { x: 48, y: 34 },
    leftElbow: { x: 39, y: 34 },
    leftHand: { x: 30, y: 34 },
    rightShoulder: { x: 60, y: 34 },
    rightElbow: { x: 69, y: 34 },
    rightHand: { x: 78, y: 34 },
    leftKnee: { x: 46, y: 60 },
    leftFoot: { x: 38, y: 74 },
    rightKnee: { x: 62, y: 72 },
    rightFoot: { x: 70, y: 88 },
  },
  triangleRight: {
    head: { x: 62, y: 26 },
    neck: { x: 60, y: 34 },
    hip: { x: 54, y: 56 },
    leftShoulder: { x: 56, y: 36 },
    leftElbow: { x: 50, y: 48 },
    leftHand: { x: 46, y: 60 },
    rightShoulder: { x: 64, y: 34 },
    rightElbow: { x: 66, y: 22 },
    rightHand: { x: 66, y: 10 },
    leftKnee: { x: 46, y: 64 },
    leftFoot: { x: 38, y: 80 },
    rightKnee: { x: 62, y: 72 },
    rightFoot: { x: 70, y: 88 },
  },
  seatedPranayama: {
    head: { x: 50, y: 24 },
    neck: { x: 50, y: 34 },
    hip: { x: 50, y: 56 },
    leftShoulder: { x: 45, y: 36 },
    leftElbow: { x: 43, y: 46 },
    leftHand: { x: 46, y: 56 },
    rightShoulder: { x: 55, y: 36 },
    rightElbow: { x: 58, y: 42 },
    rightHand: { x: 54, y: 27 },
    leftKnee: { x: 42, y: 66 },
    leftFoot: { x: 36, y: 76 },
    rightKnee: { x: 58, y: 66 },
    rightFoot: { x: 64, y: 76 },
  },
  childPose: {
    head: { x: 62, y: 54 },
    neck: { x: 58, y: 54 },
    hip: { x: 46, y: 58 },
    leftShoulder: { x: 54, y: 56 },
    leftElbow: { x: 62, y: 60 },
    leftHand: { x: 72, y: 64 },
    rightShoulder: { x: 52, y: 56 },
    rightElbow: { x: 60, y: 62 },
    rightHand: { x: 70, y: 68 },
    leftKnee: { x: 42, y: 66 },
    leftFoot: { x: 40, y: 76 },
    rightKnee: { x: 48, y: 66 },
    rightFoot: { x: 50, y: 76 },
  },
  reclined: {
    head: { x: 74, y: 58 },
    neck: { x: 68, y: 58 },
    hip: { x: 52, y: 60 },
    leftShoulder: { x: 66, y: 58 },
    leftElbow: { x: 58, y: 56 },
    leftHand: { x: 50, y: 56 },
    rightShoulder: { x: 68, y: 58 },
    rightElbow: { x: 60, y: 62 },
    rightHand: { x: 52, y: 64 },
    leftKnee: { x: 42, y: 58 },
    leftFoot: { x: 32, y: 58 },
    rightKnee: { x: 40, y: 64 },
    rightFoot: { x: 30, y: 70 },
  },
  plank: {
    head: { x: 78, y: 46 },
    neck: { x: 72, y: 47 },
    hip: { x: 56, y: 50 },
    leftShoulder: { x: 70, y: 49 },
    leftElbow: { x: 64, y: 55 },
    leftHand: { x: 56, y: 61 },
    rightShoulder: { x: 72, y: 49 },
    rightElbow: { x: 66, y: 55 },
    rightHand: { x: 58, y: 61 },
    leftKnee: { x: 46, y: 53 },
    leftFoot: { x: 36, y: 58 },
    rightKnee: { x: 48, y: 53 },
    rightFoot: { x: 38, y: 58 },
  },
  inversion: {
    head: { x: 50, y: 72 },
    neck: { x: 50, y: 64 },
    hip: { x: 50, y: 42 },
    leftShoulder: { x: 46, y: 62 },
    leftElbow: { x: 44, y: 54 },
    leftHand: { x: 45, y: 46 },
    rightShoulder: { x: 54, y: 62 },
    rightElbow: { x: 56, y: 54 },
    rightHand: { x: 55, y: 46 },
    leftKnee: { x: 46, y: 25 },
    leftFoot: { x: 42, y: 10 },
    rightKnee: { x: 54, y: 25 },
    rightFoot: { x: 58, y: 10 },
  },
  armBalance: {
    head: { x: 66, y: 52 },
    neck: { x: 62, y: 52 },
    hip: { x: 52, y: 56 },
    leftShoulder: { x: 60, y: 54 },
    leftElbow: { x: 56, y: 58 },
    leftHand: { x: 50, y: 64 },
    rightShoulder: { x: 62, y: 54 },
    rightElbow: { x: 58, y: 58 },
    rightHand: { x: 52, y: 64 },
    leftKnee: { x: 46, y: 50 },
    leftFoot: { x: 38, y: 46 },
    rightKnee: { x: 48, y: 46 },
    rightFoot: { x: 42, y: 36 },
  },
};

const DEFAULT_POSES: Pose[] = [
  {
    id: "mountain",
    name: "Mountain",
    sanskrit: "Tadasana",
    category: "warmup",
    defaultSeconds: 4,
    breathCue: "Steady inhale and exhale through the nose.",
    description: "Ground through both feet and lift through the crown.",
    frame: FRAMES.mountain,
  },
  {
    id: "upward-salute",
    name: "Upward Salute",
    sanskrit: "Urdhva Hastasana",
    category: "flow",
    defaultSeconds: 4,
    breathCue: "Inhale to rise, widen across the ribs.",
    description: "Arc up from legs to fingertips while keeping low ribs soft.",
    frame: FRAMES.upwardSalute,
  },
  {
    id: "standing-forward-fold",
    name: "Standing Forward Fold",
    sanskrit: "Uttanasana",
    category: "flow",
    defaultSeconds: 4,
    breathCue: "Exhale and fold from the hips.",
    description: "Lengthen the front body while releasing neck and jaw.",
    frame: FRAMES.fold,
  },
  {
    id: "half-lift",
    name: "Half Lift",
    sanskrit: "Ardha Uttanasana",
    category: "flow",
    defaultSeconds: 3,
    breathCue: "Inhale and draw heart forward.",
    description: "Create one long line from tailbone through crown.",
    frame: FRAMES.halfLift,
  },
  {
    id: "chaturanga",
    name: "Chaturanga",
    sanskrit: "Chaturanga Dandasana",
    category: "flow",
    defaultSeconds: 3,
    breathCue: "Exhale slowly, hover with control.",
    description: "Keep elbows close and core engaged for stable descent.",
    frame: FRAMES.chaturanga,
  },
  {
    id: "upward-dog",
    name: "Upward Dog",
    sanskrit: "Urdhva Mukha Svanasana",
    category: "flow",
    defaultSeconds: 4,
    breathCue: "Inhale and broaden collarbones.",
    description: "Press strongly through hands and lift thighs away from floor.",
    frame: FRAMES.upwardDog,
  },
  {
    id: "downward-dog",
    name: "Downward Dog",
    sanskrit: "Adho Mukha Svanasana",
    category: "flow",
    defaultSeconds: 6,
    breathCue: "Take two even rounds of breath.",
    description: "Lengthen spine and root evenly through hands and feet.",
    frame: FRAMES.downwardDog,
  },
  {
    id: "chair",
    name: "Chair",
    sanskrit: "Utkatasana",
    category: "standing",
    defaultSeconds: 5,
    breathCue: "Inhale to sit low, exhale to anchor through heels.",
    description: "Lift chest while the hips sink back and down.",
    frame: FRAMES.chair,
  },
  {
    id: "warrior-1-right",
    name: "Warrior I Right",
    sanskrit: "Virabhadrasana I",
    category: "standing",
    defaultSeconds: 5,
    breathCue: "Inhale up through fingertips, exhale into front leg.",
    description: "Square chest toward front while rooting through back heel.",
    frame: FRAMES.warrior1Right,
  },
  {
    id: "warrior-1-left",
    name: "Warrior I Left",
    sanskrit: "Virabhadrasana I",
    category: "standing",
    defaultSeconds: 5,
    breathCue: "Inhale tall, exhale deepen with calm effort.",
    description: "Build heat with stable legs and lifted spine.",
    frame: FRAMES.warrior1Left,
  },
  {
    id: "warrior-2-right",
    name: "Warrior II Right",
    sanskrit: "Virabhadrasana II",
    category: "standing",
    defaultSeconds: 5,
    breathCue: "Even breath as gaze stays soft over front hand.",
    description: "Reach in opposite directions while broadening shoulders.",
    frame: FRAMES.warrior2Right,
  },
  {
    id: "triangle-right",
    name: "Triangle Right",
    sanskrit: "Trikonasana",
    category: "standing",
    defaultSeconds: 5,
    breathCue: "Inhale to lengthen, exhale to revolve open.",
    description: "Length on both sides of waist as chest opens.",
    frame: FRAMES.triangleRight,
  },
  {
    id: "seated-pranayama",
    name: "Seated Pranayama",
    sanskrit: "Sukhasana Pranayama",
    category: "pranayama",
    defaultSeconds: 12,
    breathCue: "Try 4-4-6 or alternate nostril breathing cycles.",
    description: "Settle the nervous system and sharpen focus.",
    frame: FRAMES.seatedPranayama,
  },
  {
    id: "child-pose",
    name: "Child's Pose",
    sanskrit: "Balasana",
    category: "restorative",
    defaultSeconds: 8,
    breathCue: "Long exhale into back body.",
    description: "A reset shape for integration and recovery.",
    frame: FRAMES.childPose,
  },
];

const THREE_D_YOGA90_POSES = buildThreeDYoga90Poses(DEFAULT_POSES);

const SEGMENTS: Array<[JointName, JointName]> = [
  ["neck", "hip"],
  ["leftShoulder", "leftElbow"],
  ["leftElbow", "leftHand"],
  ["rightShoulder", "rightElbow"],
  ["rightElbow", "rightHand"],
  ["hip", "leftKnee"],
  ["leftKnee", "leftFoot"],
  ["hip", "rightKnee"],
  ["rightKnee", "rightFoot"],
  ["neck", "leftShoulder"],
  ["neck", "rightShoulder"],
];

const DEFAULT_POSE_ID = "mountain";
const MAX_STEP_SECONDS = 30;

function stepId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function clampSeconds(value: number) {
  if (!Number.isFinite(value)) {
    return 1;
  }
  return Math.min(Math.max(Math.round(value), 1), MAX_STEP_SECONDS);
}

function mixPoint(a: Point, b: Point, t: number): Point {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  };
}

function easeInOutCubic(value: number) {
  if (value < 0.5) {
    return 4 * value * value * value;
  }
  return 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function interpolateFrame(from: PoseFrame, to: PoseFrame, t: number): PoseFrame {
  const next: Partial<PoseFrame> = {};
  for (const joint of JOINTS) {
    next[joint] = mixPoint(from[joint], to[joint], t);
  }
  return next as PoseFrame;
}

function parseFrameFromJson(input: string): PoseFrame | null {
  try {
    const parsed = JSON.parse(input) as Partial<Record<JointName, Point>>;
    for (const joint of JOINTS) {
      const point = parsed[joint];
      if (
        !point ||
        typeof point.x !== "number" ||
        typeof point.y !== "number" ||
        Number.isNaN(point.x) ||
        Number.isNaN(point.y)
      ) {
        return null;
      }
    }
    return parsed as PoseFrame;
  } catch {
    return null;
  }
}

function getRecommendedThread(category: PoseCategory) {
  return CATEGORY_THREAD_MAP[category];
}

function humanizeSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function inferCategoryFromSlug(slug: string): PoseCategory {
  if (
    /corpse|reclining|supine|happy-baby|wind-relieving|child|hero$|plow|bridge|fish/.test(
      slug,
    )
  ) {
    return "restorative";
  }
  if (
    /sitting|seated|staff|cobbler|garland|twist|fishes|head-to-knee|forward-bend|tortoise|heron|boat/.test(
      slug,
    )
  ) {
    return "seated";
  }
  if (
    /warrior|triangle|angle|lunge|tree|eagle|goddess|half-moon|dance|split|big-toe-hold|chair|mountain|noose|gate/.test(
      slug,
    )
  ) {
    return "standing";
  }
  if (
    /dog|plank|cobra|locust|peacock|camel|cat|cow|frog|lizard|bow|pigeon|dolphin/.test(
      slug,
    )
  ) {
    return "flow";
  }
  return "warmup";
}

function inferFrameFromSlug(slug: string): PoseFrame {
  if (/headstand|handstand|shoulder-stand|scorpion|feather-peacock/.test(slug)) {
    return FRAMES.inversion;
  }
  if (/crow|firefly|scale|cockerel|eight-angle|flying-splits|peacock/.test(slug)) {
    return FRAMES.armBalance;
  }
  if (/reclining|corpse|supine|happy-baby|wind-relieving|plow|bridge|fish/.test(slug)) {
    return FRAMES.reclined;
  }
  if (/plank/.test(slug)) {
    return FRAMES.plank;
  }
  if (/sitting|seated|staff|cobbler|garland|hero|twist|fishes|head-to-knee|forward-bend|tortoise|heron|boat/.test(slug)) {
    return FRAMES.seatedPranayama;
  }
  if (/warrior-2|extended-side-angle/.test(slug)) {
    return FRAMES.warrior2Right;
  }
  if (/warrior-1/.test(slug)) {
    return FRAMES.warrior1Right;
  }
  if (/triangle/.test(slug)) {
    return FRAMES.triangleRight;
  }
  if (/lunge|monkey|pigeon|child|frog|lizard|cow|cat|camel/.test(slug)) {
    return FRAMES.childPose;
  }
  if (/standing-forward-bend/.test(slug)) {
    return FRAMES.fold;
  }
  if (/half-way-lift/.test(slug)) {
    return FRAMES.halfLift;
  }
  if (/downward-dog|three-legged-dog/.test(slug)) {
    return FRAMES.downwardDog;
  }
  if (/chair/.test(slug)) {
    return FRAMES.chair;
  }
  return FRAMES.mountain;
}

function inferBreathCue(category: PoseCategory) {
  switch (category) {
    case "standing":
      return "Inhale to lengthen, exhale to root.";
    case "flow":
      return "Keep one breath per movement with smooth ujjayi rhythm.";
    case "seated":
      return "Soften the jaw and elongate each exhale.";
    case "restorative":
      return "Let exhale be longer than inhale and settle deeply.";
    case "pranayama":
      return "Equal inhale and exhale through the nose.";
    default:
      return "Maintain steady, even nasal breath.";
  }
}

function inferDefaultSeconds(category: PoseCategory) {
  switch (category) {
    case "restorative":
      return 8;
    case "seated":
      return 7;
    case "standing":
      return 5;
    case "flow":
      return 4;
    default:
      return 4;
  }
}

function buildThreeDYoga90Poses(corePoses: Pose[]): Pose[] {
  const taken = new Set(
    corePoses.flatMap((pose) => [
      pose.id.toLowerCase(),
      pose.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    ]),
  );

  return THREE_D_YOGA90_SLUGS.filter((slug) => !taken.has(slug.toLowerCase())).map(
    (slug) => {
      const category = inferCategoryFromSlug(slug);
      const label = humanizeSlug(slug);
      return {
        id: `3dyoga90-${slug}`,
        name: label,
        sanskrit: "3DYoga90 reference",
        category,
        defaultSeconds: inferDefaultSeconds(category),
        breathCue: inferBreathCue(category),
        description: `Reference pose from the 3DYoga90 open dataset: ${label}.`,
        frame: inferFrameFromSlug(slug),
        origin: "3dyoga90",
        sourceLabel: "3DYoga90",
      };
    },
  );
}

function buildSuryaA(poses: Pose[]): SequenceStep[] {
  const byId = new Map(poses.map((pose) => [pose.id, pose]));
  const order = [
    "mountain",
    "upward-salute",
    "standing-forward-fold",
    "half-lift",
    "chaturanga",
    "upward-dog",
    "downward-dog",
    "half-lift",
    "standing-forward-fold",
    "upward-salute",
    "mountain",
    "seated-pranayama",
  ];

  return order
    .map((poseId) => byId.get(poseId))
    .filter((pose): pose is Pose => Boolean(pose))
    .map((pose) => ({
      id: stepId(),
      poseId: pose.id,
      seconds: pose.defaultSeconds,
      threadId: getRecommendedThread(pose.category),
    }));
}

function buildSuryaB(poses: Pose[]): SequenceStep[] {
  const byId = new Map(poses.map((pose) => [pose.id, pose]));
  const order = [
    "mountain",
    "chair",
    "standing-forward-fold",
    "half-lift",
    "chaturanga",
    "upward-dog",
    "downward-dog",
    "warrior-1-right",
    "chaturanga",
    "upward-dog",
    "downward-dog",
    "warrior-1-left",
    "chaturanga",
    "upward-dog",
    "downward-dog",
    "standing-forward-fold",
    "chair",
    "mountain",
    "seated-pranayama",
  ];

  return order
    .map((poseId) => byId.get(poseId))
    .filter((pose): pose is Pose => Boolean(pose))
    .map((pose) => ({
      id: stepId(),
      poseId: pose.id,
      seconds: pose.defaultSeconds,
      threadId: getRecommendedThread(pose.category),
    }));
}

export function SequencerStudio() {
  const [customPoses, setCustomPoses] = useState<Pose[]>([]);
  const poses = useMemo(
    () => [...DEFAULT_POSES, ...THREE_D_YOGA90_POSES, ...customPoses],
    [customPoses],
  );
  const poseMap = useMemo(
    () => new Map(poses.map((pose) => [pose.id, pose])),
    [poses],
  );

  const [sequence, setSequence] = useState<SequenceStep[]>(() =>
    buildSuryaA(DEFAULT_POSES),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationStartRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const [poseFilter, setPoseFilter] = useState("");
  const [poseCategoryFilter, setPoseCategoryFilter] = useState<PoseCategory | "all">(
    "all",
  );
  const [customName, setCustomName] = useState("");
  const [customSanskrit, setCustomSanskrit] = useState("");
  const [customCategory, setCustomCategory] = useState<PoseCategory>("standing");
  const [customBreathCue, setCustomBreathCue] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [customSeconds, setCustomSeconds] = useState(5);
  const [customBasePoseId, setCustomBasePoseId] = useState(DEFAULT_POSE_ID);
  const [customFrameJson, setCustomFrameJson] = useState(
    JSON.stringify(FRAMES.mountain, null, 2),
  );
  const [customError, setCustomError] = useState("");

  const filteredPoses = useMemo(() => {
    const text = poseFilter.trim().toLowerCase();
    return poses
      .filter((pose) => {
        const matchesText =
          !text ||
          pose.name.toLowerCase().includes(text) ||
          pose.sanskrit.toLowerCase().includes(text) ||
          pose.category.toLowerCase().includes(text);
        const matchesCategory =
          poseCategoryFilter === "all" || pose.category === poseCategoryFilter;
        return matchesText && matchesCategory;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [poseFilter, poseCategoryFilter, poses]);

  const currentStep = sequence[currentIndex];
  const currentPose = poseMap.get(currentStep?.poseId ?? DEFAULT_POSE_ID);
  const nextPose = poseMap.get(
    sequence[Math.min(currentIndex + 1, sequence.length - 1)]?.poseId ??
      currentStep?.poseId ??
      DEFAULT_POSE_ID,
  );

  const animatedFrame = useMemo(() => {
    const fromFrame = currentPose?.frame ?? FRAMES.mountain;
    const toFrame = nextPose?.frame ?? fromFrame;
    const easedProgress = easeInOutCubic(progress);
    return interpolateFrame(fromFrame, toFrame, easedProgress);
  }, [currentPose, nextPose, progress]);

  const currentThread = TEACHING_THREADS.find(
    (thread) => thread.id === currentStep?.threadId,
  );
  const totalSeconds = sequence.reduce((sum, step) => sum + step.seconds, 0);
  const breathPhases = ["Inhale", "Hold", "Exhale", "Hold"];
  const breathPhase = breathPhases[Math.floor(progress * breathPhases.length) % 4];

  useEffect(() => {
    if (!isPlaying || sequence.length === 0) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      animationStartRef.current = null;
      return;
    }

    const tick = (timestamp: number) => {
      if (!sequence.length) {
        return;
      }
      const activeStep = sequence[currentIndex];
      if (!activeStep) {
        setIsPlaying(false);
        return;
      }

      if (animationStartRef.current === null) {
        animationStartRef.current = timestamp;
      }

      const elapsed = timestamp - animationStartRef.current;
      const duration = activeStep.seconds * 1000;
      const phase = Math.min(elapsed / duration, 1);
      setProgress(phase);

      if (elapsed >= duration) {
        if (currentIndex >= sequence.length - 1) {
          setIsPlaying(false);
          setProgress(0);
          animationStartRef.current = null;
          return;
        }
        animationStartRef.current = timestamp;
        setProgress(0);
        setCurrentIndex((index) => Math.min(index + 1, sequence.length - 1));
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isPlaying, currentIndex, sequence]);

  function resetPlayback(nextIndex = 0) {
    setProgress(0);
    setCurrentIndex(Math.min(Math.max(nextIndex, 0), Math.max(sequence.length - 1, 0)));
    animationStartRef.current = null;
  }

  function setPreset(preset: "A" | "B") {
    const next = preset === "A" ? buildSuryaA(poses) : buildSuryaB(poses);
    setSequence(next);
    setIsPlaying(false);
    resetPlayback(0);
  }

  function addStepFromPose(pose: Pose) {
    setSequence((prev) => [
      ...prev,
      {
        id: stepId(),
        poseId: pose.id,
        seconds: pose.defaultSeconds,
        threadId: getRecommendedThread(pose.category),
      },
    ]);
  }

  function removeStep(stepIdToRemove: string) {
    setSequence((prev) => {
      if (prev.length <= 1) {
        return prev;
      }
      const removedIndex = prev.findIndex((step) => step.id === stepIdToRemove);
      if (removedIndex < 0) {
        return prev;
      }

      const next = prev.filter((step) => step.id !== stepIdToRemove);
      setCurrentIndex((index) => {
        if (index > removedIndex) {
          return index - 1;
        }
        return Math.min(index, next.length - 1);
      });
      return next;
    });
  }

  function moveStep(stepIndex: number, direction: "up" | "down") {
    setSequence((prev) => {
      const swapIndex = direction === "up" ? stepIndex - 1 : stepIndex + 1;
      if (swapIndex < 0 || swapIndex >= prev.length) {
        return prev;
      }
      const next = [...prev];
      const [item] = next.splice(stepIndex, 1);
      next.splice(swapIndex, 0, item);
      return next;
    });
    if (currentIndex === stepIndex) {
      resetPlayback(direction === "up" ? stepIndex - 1 : stepIndex + 1);
    } else if (currentIndex === (direction === "up" ? stepIndex - 1 : stepIndex + 1)) {
      resetPlayback(stepIndex);
    }
  }

  function updateStep(
    stepIdToUpdate: string,
    patch: Partial<Pick<SequenceStep, "poseId" | "seconds" | "threadId">>,
  ) {
    setSequence((prev) =>
      prev.map((step) => {
        if (step.id !== stepIdToUpdate) {
          return step;
        }
        return {
          ...step,
          ...patch,
          seconds:
            patch.seconds !== undefined ? clampSeconds(patch.seconds) : step.seconds,
        };
      }),
    );
  }

  function addCustomPose() {
    const name = customName.trim();
    if (!name) {
      setCustomError("Please add a pose name.");
      return;
    }

    const frame = parseFrameFromJson(customFrameJson);
    if (!frame) {
      setCustomError(
        "Frame JSON must include numeric x/y values for every required joint.",
      );
      return;
    }

    const idBase = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const id = `${idBase || "custom-pose"}-${Math.random().toString(36).slice(2, 6)}`;

    const nextPose: Pose = {
      id,
      name,
      sanskrit: customSanskrit.trim() || "Custom Asana",
      category: customCategory,
      defaultSeconds: clampSeconds(customSeconds),
      breathCue: customBreathCue.trim() || "Move with smooth ujjayi breath.",
      description:
        customDescription.trim() ||
        "Custom posture built to match your class intention.",
      frame,
      origin: "custom",
      sourceLabel: "Custom",
    };

    setCustomPoses((prev) => [...prev, nextPose]);
    setCustomError("");
    setCustomName("");
    setCustomSanskrit("");
    setCustomBreathCue("");
    setCustomDescription("");
    setCustomSeconds(5);
    setCustomCategory("standing");
  }

  function applyBasePoseFrame(basePoseId: string) {
    const source = poseMap.get(basePoseId)?.frame ?? FRAMES.mountain;
    setCustomBasePoseId(basePoseId);
    setCustomFrameJson(JSON.stringify(source, null, 2));
    setCustomError("");
  }

  function jumpTo(index: number) {
    setIsPlaying(false);
    resetPlayback(index);
  }

  return (
    <section className={`${styles.pageShell} py-16 md:py-20`}>
      <Container size="wide">
        <div className="mb-10">
          <Text variant="small" className="uppercase tracking-[0.18em]">
            FlowState
          </Text>
          <H1 className="mt-3 mb-5 max-w-4xl">
            Build class flow from a real 90-pose directory with a clean
            stick-figure stage.
          </H1>
          <Text variant="lead" className="max-w-3xl">
            FlowState now uses the open 3DYoga90 dataset as the pose backbone.
            Sequence Surya A/B, add advanced shapes fast, and keep instruction
            grounded in wisdom, breath, and precise movement.
          </Text>
          <div className="flex flex-wrap items-center gap-3 mt-7">
            <Button
              variant="primary"
              onClick={() => setIsPlaying((active) => !active)}
            >
              {isPlaying ? "Pause flow" : "Play flow"}
            </Button>
            <Button variant="secondary" onClick={() => setPreset("A")}>
              Load Surya A template
            </Button>
            <Button variant="secondary" onClick={() => setPreset("B")}>
              Load Surya B template
            </Button>
            <Button variant="outline" onClick={() => resetPlayback(0)}>
              Reset to beginning
            </Button>
            <Link href="/practice" className={styles.inlineLink}>
              Back to Practice
            </Link>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] mb-8">
          <div className={styles.stageCard}>
            <div className={styles.stageHeader}>
              <div>
                <Text variant="small" className="uppercase tracking-wider">
                  Stick Figure Pose Stage
                </Text>
                <H3 className="mt-2">
                  {currentPose?.name ?? "Mountain"}{" "}
                  <span className={styles.subtitleText}>
                    {currentPose?.sanskrit ?? "Tadasana"}
                  </span>
                </H3>
              </div>
              <div className={styles.counterPill}>
                Step {Math.min(currentIndex + 1, sequence.length)} / {sequence.length}
              </div>
            </div>

            <div className={styles.stageBody}>
              <svg
                viewBox="0 0 100 100"
                className={styles.figureCanvas}
                role="img"
                aria-label="Animated stick figure demonstrating yoga pose"
              >
                <circle cx="50" cy="49" r="36" className={styles.haloOuter} />
                <circle cx="50" cy="49" r="26" className={styles.haloInner} />
                <rect x="8" y="82" width="84" height="6" rx="3" className={styles.matt} />
                {SEGMENTS.map(([from, to]) => (
                  <line
                    key={`${from}-${to}`}
                    x1={animatedFrame[from].x}
                    y1={animatedFrame[from].y}
                    x2={animatedFrame[to].x}
                    y2={animatedFrame[to].y}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className={styles.figureLine}
                  />
                ))}
                <circle
                  cx={animatedFrame.head.x}
                  cy={animatedFrame.head.y}
                  r="4.5"
                  className={styles.figureHead}
                />
                <circle
                  cx={animatedFrame.hip.x}
                  cy={animatedFrame.hip.y}
                  r="2.5"
                  className={styles.figureCore}
                />
              </svg>
            </div>

            <div className={styles.transportRow}>
              <button
                type="button"
                className={styles.transportButton}
                onClick={() => jumpTo(Math.max(currentIndex - 1, 0))}
              >
                Prev
              </button>
              <button
                type="button"
                className={styles.transportButton}
                onClick={() => setIsPlaying((active) => !active)}
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                className={styles.transportButton}
                onClick={() => jumpTo(Math.min(currentIndex + 1, sequence.length - 1))}
              >
                Next
              </button>
              <div className={styles.progressWrap}>
                <div
                  className={styles.progressBar}
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <aside className={styles.sidePanel}>
            <div className={styles.threadCard}>
              <Text variant="small" className="uppercase tracking-wider">
                Live Teaching Thread
              </Text>
              <H3 className="mt-2 mb-2">{currentThread?.name ?? "Balanced Flow"}</H3>
              <Text variant="small" className={styles.sourceTag}>
                Source: {currentThread?.source ?? "Integrated traditions"}
              </Text>
              <div className="mt-4 space-y-3">
                <Text variant="small">
                  <strong>Wisdom:</strong> {currentThread?.wisdom}
                </Text>
                <Text variant="small">
                  <strong>Science:</strong> {currentThread?.science}
                </Text>
                <Text variant="small">
                  <strong>Spirituality:</strong> {currentThread?.spirituality}
                </Text>
              </div>
            </div>

            <div className={styles.breathCard}>
              <Text variant="small" className="uppercase tracking-wider">
                Pranayama Pulse
              </Text>
              <div className={styles.breathRow}>
                <div className={styles.breathOrb} />
                <div>
                  <Text variant="small" className="font-semibold">
                    {breathPhase}
                  </Text>
                  <Text variant="small">{currentPose?.breathCue}</Text>
                </div>
              </div>
            </div>

            <div className={styles.metricsCard}>
              <Text variant="small">
                <strong>Total sequence:</strong> {totalSeconds}s
              </Text>
              <Text variant="small">
                <strong>Current hold:</strong> {currentStep?.seconds ?? 0}s
              </Text>
              <Text variant="small">
                <strong>Mode:</strong> {isPlaying ? "Animating" : "Editing"}
              </Text>
            </div>
          </aside>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.2fr_1fr]">
          <section className={styles.panelCard}>
            <div className={styles.panelHeader}>
              <H3>Sequence Timeline</H3>
              <Text variant="small">
                Reorder, swap poses, assign teaching threads, and tune hold times.
              </Text>
            </div>
            <div className={styles.stepGrid}>
              {sequence.map((step, index) => {
                const pose = poseMap.get(step.poseId) ?? poseMap.get(DEFAULT_POSE_ID);
                return (
                  <article
                    key={step.id}
                    className={`${styles.stepCard} ${
                      index === currentIndex ? styles.stepCardActive : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <button
                        type="button"
                        className={styles.stepTitle}
                        onClick={() => jumpTo(index)}
                      >
                        {String(index + 1).padStart(2, "0")} {pose?.name}
                      </button>
                      <span className={styles.stepTag}>{pose?.category}</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <label className={styles.formField}>
                        Pose
                        <select
                          value={step.poseId}
                          onChange={(event) =>
                            updateStep(step.id, { poseId: event.target.value })
                          }
                        >
                          {poses.map((availablePose) => (
                            <option key={availablePose.id} value={availablePose.id}>
                              {availablePose.name}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className={styles.formField}>
                        Hold (seconds)
                        <input
                          type="number"
                          min={1}
                          max={MAX_STEP_SECONDS}
                          value={step.seconds}
                          onChange={(event) =>
                            updateStep(step.id, {
                              seconds: Number.parseInt(event.target.value, 10),
                            })
                          }
                        />
                      </label>
                    </div>

                    <label className={styles.formField}>
                      Thread
                      <select
                        value={step.threadId}
                        onChange={(event) =>
                          updateStep(step.id, { threadId: event.target.value })
                        }
                      >
                        {TEACHING_THREADS.map((thread) => (
                          <option key={thread.id} value={thread.id}>
                            {thread.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className={styles.stepActions}>
                      <button
                        type="button"
                        onClick={() => moveStep(index, "up")}
                        disabled={index === 0}
                      >
                        Move up
                      </button>
                      <button
                        type="button"
                        onClick={() => moveStep(index, "down")}
                        disabled={index === sequence.length - 1}
                      >
                        Move down
                      </button>
                      <button type="button" onClick={() => removeStep(step.id)}>
                        Remove
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className={styles.panelCard}>
            <div className={styles.panelHeader}>
              <H3>Pose Directory + Custom Lab</H3>
              <Text variant="small">
                3DYoga90 is now integrated as your main reference directory.
                Add poses instantly, then refine with custom stick-figure
                keyframes.
              </Text>
            </div>

            <div className={styles.datasetCard}>
              <Text variant="small" className="font-semibold">
                3DYoga90 connected: {THREE_D_YOGA90_POSES.length} directory poses
              </Text>
              <Text variant="small">
                Source:{" "}
                <a href={THREE_D_YOGA90_SOURCE} target="_blank" rel="noreferrer">
                  {THREE_D_YOGA90_SOURCE}
                </a>{" "}
                · License: {THREE_D_YOGA90_LICENSE}
              </Text>
            </div>

            <label className={styles.formField}>
              Search directory
              <input
                value={poseFilter}
                onChange={(event) => setPoseFilter(event.target.value)}
                placeholder="Search by name, Sanskrit, or category"
              />
            </label>

            <label className={styles.formField}>
              Category
              <select
                value={poseCategoryFilter}
                onChange={(event) =>
                  setPoseCategoryFilter(event.target.value as PoseCategory | "all")
                }
              >
                <option value="all">All categories</option>
                <option value="warmup">Warmup</option>
                <option value="standing">Standing</option>
                <option value="flow">Flow</option>
                <option value="pranayama">Pranayama</option>
                <option value="seated">Seated</option>
                <option value="restorative">Restorative</option>
              </select>
            </label>

            <div className={styles.poseBankList}>
              {filteredPoses.map((pose) => (
                <article key={pose.id} className={styles.poseBankItem}>
                  <div>
                    <p className={styles.poseBankTitle}>{pose.name}</p>
                    <p className={styles.poseBankMeta}>
                      {pose.sanskrit} · {pose.defaultSeconds}s · {pose.category}
                      {" · "}
                      {pose.sourceLabel ?? (pose.origin === "custom" ? "Custom" : "Core")}
                    </p>
                  </div>
                  <button type="button" onClick={() => addStepFromPose(pose)}>
                    Add
                  </button>
                </article>
              ))}
            </div>

            <div className={styles.divider} />

            <div className="space-y-3">
              <Text variant="small" className="font-semibold">
                Create Custom Pose
              </Text>
              <div className="grid sm:grid-cols-2 gap-3">
                <label className={styles.formField}>
                  Name
                  <input
                    value={customName}
                    onChange={(event) => setCustomName(event.target.value)}
                    placeholder="Example: Crescent Twist"
                  />
                </label>
                <label className={styles.formField}>
                  Sanskrit
                  <input
                    value={customSanskrit}
                    onChange={(event) => setCustomSanskrit(event.target.value)}
                    placeholder="Optional"
                  />
                </label>
                <label className={styles.formField}>
                  Category
                  <select
                    value={customCategory}
                    onChange={(event) =>
                      setCustomCategory(event.target.value as PoseCategory)
                    }
                  >
                    <option value="warmup">Warmup</option>
                    <option value="standing">Standing</option>
                    <option value="flow">Flow</option>
                    <option value="pranayama">Pranayama</option>
                    <option value="seated">Seated</option>
                    <option value="restorative">Restorative</option>
                  </select>
                </label>
                <label className={styles.formField}>
                  Default hold
                  <input
                    type="number"
                    min={1}
                    max={MAX_STEP_SECONDS}
                    value={customSeconds}
                    onChange={(event) =>
                      setCustomSeconds(
                        clampSeconds(Number.parseInt(event.target.value, 10)),
                      )
                    }
                  />
                </label>
              </div>

              <label className={styles.formField}>
                Breath cue
                <input
                  value={customBreathCue}
                  onChange={(event) => setCustomBreathCue(event.target.value)}
                  placeholder="Inhale to lengthen, exhale to rotate"
                />
              </label>

              <label className={styles.formField}>
                Teaching notes
                <input
                  value={customDescription}
                  onChange={(event) => setCustomDescription(event.target.value)}
                  placeholder="How this pose should feel in class"
                />
              </label>

              <div className="grid sm:grid-cols-[1fr_auto] gap-3">
                <label className={styles.formField}>
                  Base frame
                  <select
                    value={customBasePoseId}
                    onChange={(event) => applyBasePoseFrame(event.target.value)}
                  >
                    {poses.map((pose) => (
                      <option key={pose.id} value={pose.id}>
                        {pose.name}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => applyBasePoseFrame(customBasePoseId)}
                >
                  Reset JSON
                </button>
              </div>

              <label className={styles.formField}>
                Frame JSON (full control)
                <textarea
                  value={customFrameJson}
                  onChange={(event) => {
                    setCustomFrameJson(event.target.value);
                    setCustomError("");
                  }}
                  rows={13}
                  spellCheck={false}
                />
              </label>

              {customError ? (
                <p className={styles.errorText}>{customError}</p>
              ) : (
                <Text variant="small">
                  Required joints: {JOINTS.join(", ")}.
                </Text>
              )}

              <div className="flex flex-wrap gap-3">
                <Button variant="primary" onClick={addCustomPose}>
                  Save custom pose
                </Button>
                <Button variant="outline" onClick={() => addStepFromPose(currentPose ?? DEFAULT_POSES[0])}>
                  Add current pose to sequence
                </Button>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </section>
  );
}
