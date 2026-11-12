import type { Transition, Variants } from "motion/react"
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"
import React, { useEffect, useId, useRef, useState } from "react"

// --- Web Audio API Tap Sound ---
function playTapSound(pitchMultiplier = 1) {
  if (typeof window === "undefined") return
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "sine"
    osc.frequency.setValueAtTime(540 * pitchMultiplier, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(
      220 * pitchMultiplier,
      ctx.currentTime + 0.065
    )
    gain.gain.setValueAtTime(0.06, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.065)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.065)
  } catch {
    // Ignore audio context errors
  }
}

// --- Exact 9-Letter 3D Isometric Geometry for "PHONG PHAN" ---
const LETTERS = [
  {
    char: "P",
    front:
      "M0.00 42.00L86.00 42.00L86.00 115.44L26.00 115.44L26.00 178.00L0.00 178.00Z M26.00 68.00L60.00 68.00L60.00 89.44L26.00 89.44Z",
    wallsNormal:
      "M0.00 42.00L86.00 42.00L108.00 20.00L22.00 20.00ZM86.00 42.00L86.00 115.44L108.00 93.44L108.00 20.00ZM26.00 115.44L26.00 178.00L48.00 156.00L48.00 93.44ZM26.00 68.00L60.00 68.00L82.00 46.00L48.00 46.00ZM60.00 68.00L60.00 89.44L82.00 67.44L82.00 46.00Z",
    wallsPressed:
      "M0.00 42.00L86.00 42.00L94.00 34.00L8.00 34.00ZM86.00 42.00L86.00 115.44L94.00 107.44L94.00 34.00ZM26.00 115.44L26.00 178.00L34.00 170.00L34.00 107.44ZM26.00 68.00L60.00 68.00L68.00 60.00L34.00 60.00ZM60.00 68.00L60.00 89.44L68.00 81.44L68.00 60.00Z",
    strokeNormal:
      "M0.00 42.00L86.00 42.00M0.00 42.00L22.00 20.00M86.00 42.00L108.00 20.00M22.00 20.00L108.00 20.00M86.00 42.00L86.00 115.44M86.00 42.00L108.00 20.00M86.00 115.44L108.00 93.44M108.00 20.00L108.00 93.44M86.00 115.44L26.00 115.44M26.00 115.44L26.00 178.00M26.00 115.44L48.00 93.44M26.00 178.00L48.00 156.00M48.00 93.44L48.00 156.00M26.00 178.00L0.00 178.00M0.00 178.00L0.00 42.00M26.00 68.00L60.00 68.00M26.00 68.00L48.00 46.00M60.00 68.00L82.00 46.00M48.00 46.00L82.00 46.00M60.00 68.00L60.00 89.44M60.00 68.00L82.00 46.00M60.00 89.44L82.00 67.44M82.00 46.00L82.00 67.44M60.00 89.44L26.00 89.44M26.00 89.44L26.00 68.00",
    strokePressed:
      "M0.00 42.00L86.00 42.00M0.00 42.00L8.00 34.00M86.00 42.00L94.00 34.00M8.00 34.00L94.00 34.00M86.00 42.00L86.00 115.44M86.00 42.00L94.00 34.00M86.00 115.44L94.00 107.44M94.00 34.00L94.00 107.44M86.00 115.44L26.00 115.44M26.00 115.44L26.00 178.00M26.00 115.44L34.00 107.44M26.00 178.00L34.00 170.00M34.00 107.44L34.00 170.00M26.00 178.00L0.00 178.00M0.00 178.00L0.00 42.00M26.00 68.00L60.00 68.00M26.00 68.00L34.00 60.00M60.00 68.00L68.00 60.00M34.00 60.00L68.00 60.00M60.00 68.00L60.00 89.44M60.00 68.00L68.00 60.00M60.00 89.44L68.00 81.44M68.00 60.00L68.00 81.44M60.00 89.44L26.00 89.44M26.00 89.44L26.00 68.00",
  },
  {
    char: "H",
    front:
      "M108.00 42.00L134.00 42.00L134.00 97.00L170.00 97.00L170.00 42.00L196.00 42.00L196.00 178.00L170.00 178.00L170.00 123.00L134.00 123.00L134.00 178.00L108.00 178.00Z",
    wallsNormal:
      "M108.00 42.00L134.00 42.00L156.00 20.00L130.00 20.00ZM134.00 42.00L134.00 97.00L156.00 75.00L156.00 20.00ZM134.00 97.00L170.00 97.00L192.00 75.00L156.00 75.00ZM170.00 42.00L196.00 42.00L218.00 20.00L192.00 20.00ZM196.00 42.00L196.00 178.00L218.00 156.00L218.00 20.00ZM134.00 123.00L134.00 178.00L156.00 156.00L156.00 101.00Z",
    wallsPressed:
      "M108.00 42.00L134.00 42.00L142.00 34.00L116.00 34.00ZM134.00 42.00L134.00 97.00L142.00 89.00L142.00 34.00ZM134.00 97.00L170.00 97.00L178.00 89.00L142.00 89.00ZM170.00 42.00L196.00 42.00L204.00 34.00L178.00 34.00ZM196.00 42.00L196.00 178.00L204.00 170.00L204.00 34.00ZM134.00 123.00L134.00 178.00L142.00 170.00L142.00 115.00Z",
    strokeNormal:
      "M108.00 42.00L134.00 42.00M108.00 42.00L130.00 20.00M134.00 42.00L156.00 20.00M130.00 20.00L156.00 20.00M134.00 42.00L134.00 97.00M134.00 42.00L156.00 20.00M134.00 97.00L156.00 75.00M156.00 20.00L156.00 75.00M134.00 97.00L170.00 97.00M134.00 97.00L156.00 75.00M170.00 97.00L192.00 75.00M156.00 75.00L192.00 75.00M170.00 97.00L170.00 42.00M170.00 42.00L196.00 42.00M170.00 42.00L192.00 20.00M196.00 42.00L218.00 20.00M192.00 20.00L218.00 20.00M196.00 42.00L196.00 178.00M196.00 42.00L218.00 20.00M196.00 178.00L218.00 156.00M218.00 20.00L218.00 156.00M196.00 178.00L170.00 178.00M170.00 178.00L170.00 123.00M170.00 123.00L134.00 123.00M134.00 123.00L134.00 178.00M134.00 123.00L156.00 101.00M134.00 178.00L156.00 156.00M156.00 101.00L156.00 156.00M134.00 178.00L108.00 178.00M108.00 178.00L108.00 42.00",
    strokePressed:
      "M108.00 42.00L134.00 42.00M108.00 42.00L116.00 34.00M134.00 42.00L142.00 34.00M116.00 34.00L142.00 34.00M134.00 42.00L134.00 97.00M134.00 42.00L142.00 34.00M134.00 97.00L142.00 89.00M142.00 34.00L142.00 89.00M134.00 97.00L170.00 97.00M134.00 97.00L142.00 89.00M170.00 97.00L178.00 89.00M142.00 89.00L178.00 89.00M170.00 97.00L170.00 42.00M170.00 42.00L196.00 42.00M170.00 42.00L178.00 34.00M196.00 42.00L204.00 34.00M178.00 34.00L204.00 34.00M196.00 42.00L196.00 178.00M196.00 42.00L204.00 34.00M196.00 178.00L204.00 170.00M204.00 34.00L204.00 170.00M196.00 178.00L170.00 178.00M170.00 178.00L170.00 123.00M170.00 123.00L134.00 123.00M134.00 123.00L134.00 178.00M134.00 123.00L142.00 115.00M134.00 178.00L142.00 170.00M142.00 115.00L142.00 170.00M134.00 178.00L108.00 178.00M108.00 178.00L108.00 42.00",
  },
  {
    char: "O",
    front:
      "M218.00 42.00L306.00 42.00L306.00 178.00L218.00 178.00Z M244.00 68.00L280.00 68.00L280.00 152.00L244.00 152.00Z",
    wallsNormal:
      "M218.00 42.00L306.00 42.00L328.00 20.00L240.00 20.00ZM306.00 42.00L306.00 178.00L328.00 156.00L328.00 20.00ZM244.00 68.00L280.00 68.00L302.00 46.00L266.00 46.00ZM280.00 68.00L280.00 152.00L302.00 130.00L302.00 46.00Z",
    wallsPressed:
      "M218.00 42.00L306.00 42.00L314.00 34.00L226.00 34.00ZM306.00 42.00L306.00 178.00L314.00 170.00L314.00 34.00ZM244.00 68.00L280.00 68.00L288.00 60.00L252.00 60.00ZM280.00 68.00L280.00 152.00L288.00 144.00L288.00 60.00Z",
    strokeNormal:
      "M218.00 42.00L306.00 42.00M218.00 42.00L240.00 20.00M306.00 42.00L328.00 20.00M240.00 20.00L328.00 20.00M306.00 42.00L306.00 178.00M306.00 42.00L328.00 20.00M306.00 178.00L328.00 156.00M328.00 20.00L328.00 156.00M306.00 178.00L218.00 178.00M218.00 178.00L218.00 42.00M244.00 68.00L280.00 68.00M244.00 68.00L266.00 46.00M280.00 68.00L302.00 46.00M266.00 46.00L302.00 46.00M280.00 68.00L280.00 152.00M280.00 68.00L302.00 46.00M280.00 152.00L302.00 130.00M302.00 46.00L302.00 130.00M280.00 152.00L244.00 152.00M244.00 152.00L244.00 68.00",
    strokePressed:
      "M218.00 42.00L306.00 42.00M218.00 42.00L226.00 34.00M306.00 42.00L314.00 34.00M226.00 34.00L314.00 34.00M306.00 42.00L306.00 178.00M306.00 42.00L314.00 34.00M306.00 178.00L314.00 170.00M314.00 34.00L314.00 170.00M306.00 178.00L218.00 178.00M218.00 178.00L218.00 42.00M244.00 68.00L280.00 68.00M244.00 68.00L252.00 60.00M280.00 68.00L288.00 60.00M252.00 60.00L288.00 60.00M280.00 68.00L280.00 152.00M280.00 68.00L288.00 60.00M280.00 152.00L288.00 144.00M288.00 60.00L288.00 144.00M280.00 152.00L244.00 152.00M244.00 152.00L244.00 68.00",
  },
  {
    char: "N",
    front:
      "M328.00 42.00L354.00 42.00L394.00 139.92L394.00 42.00L420.00 42.00L420.00 178.00L394.00 178.00L354.00 80.08L354.00 178.00L328.00 178.00Z",
    wallsNormal:
      "M328.00 42.00L354.00 42.00L376.00 20.00L350.00 20.00ZM354.00 42.00L394.00 139.92L416.00 117.92L376.00 20.00ZM394.00 42.00L420.00 42.00L442.00 20.00L416.00 20.00ZM420.00 42.00L420.00 178.00L442.00 156.00L442.00 20.00ZM354.00 80.08L354.00 178.00L376.00 156.00L376.00 58.08Z",
    wallsPressed:
      "M328.00 42.00L354.00 42.00L362.00 34.00L336.00 34.00ZM354.00 42.00L394.00 139.92L402.00 131.92L362.00 34.00ZM394.00 42.00L420.00 42.00L428.00 34.00L402.00 34.00ZM420.00 42.00L420.00 178.00L428.00 170.00L428.00 34.00ZM354.00 80.08L354.00 178.00L362.00 170.00L362.00 72.08Z",
    strokeNormal:
      "M328.00 42.00L354.00 42.00M328.00 42.00L350.00 20.00M354.00 42.00L376.00 20.00M350.00 20.00L376.00 20.00M354.00 42.00L394.00 139.92M354.00 42.00L376.00 20.00M394.00 139.92L416.00 117.92M376.00 20.00L416.00 117.92M394.00 139.92L394.00 42.00M394.00 42.00L420.00 42.00M394.00 42.00L416.00 20.00M420.00 42.00L442.00 20.00M416.00 20.00L442.00 20.00M420.00 42.00L420.00 178.00M420.00 42.00L442.00 20.00M420.00 178.00L442.00 156.00M442.00 20.00L442.00 156.00M420.00 178.00L394.00 178.00M394.00 178.00L354.00 80.08M354.00 80.08L354.00 178.00M354.00 80.08L376.00 58.08M354.00 178.00L376.00 156.00M376.00 58.08L376.00 156.00M354.00 178.00L328.00 178.00M328.00 178.00L328.00 42.00",
    strokePressed:
      "M328.00 42.00L354.00 42.00M328.00 42.00L336.00 34.00M354.00 42.00L362.00 34.00M336.00 34.00L362.00 34.00M354.00 42.00L394.00 139.92M354.00 42.00L362.00 34.00M394.00 139.92L402.00 131.92M362.00 34.00L402.00 131.92M394.00 139.92L394.00 42.00M394.00 42.00L420.00 42.00M394.00 42.00L402.00 34.00M420.00 42.00L428.00 34.00M402.00 34.00L428.00 34.00M420.00 42.00L420.00 178.00M420.00 42.00L428.00 34.00M420.00 178.00L428.00 170.00M428.00 34.00L428.00 170.00M420.00 178.00L394.00 178.00M394.00 178.00L354.00 80.08M354.00 80.08L354.00 178.00M354.00 80.08L362.00 72.08M354.00 178.00L362.00 170.00M362.00 72.08L362.00 170.00M354.00 178.00L328.00 178.00M328.00 178.00L328.00 42.00",
  },
  {
    char: "G",
    front:
      "M442.00 42.00L530.00 42.00L530.00 68.00L468.00 68.00L468.00 152.00L504.00 152.00L504.00 123.00L492.00 123.00L492.00 97.00L530.00 97.00L530.00 178.00L442.00 178.00Z",
    wallsNormal:
      "M442.00 42.00L530.00 42.00L552.00 20.00L464.00 20.00ZM530.00 42.00L530.00 68.00L552.00 46.00L552.00 20.00ZM468.00 68.00L468.00 152.00L490.00 130.00L490.00 46.00ZM468.00 152.00L504.00 152.00L526.00 130.00L490.00 130.00ZM492.00 97.00L530.00 97.00L552.00 75.00L514.00 75.00ZM530.00 97.00L530.00 178.00L552.00 156.00L552.00 75.00Z",
    wallsPressed:
      "M442.00 42.00L530.00 42.00L538.00 34.00L450.00 34.00ZM530.00 42.00L530.00 68.00L538.00 60.00L538.00 34.00ZM468.00 68.00L468.00 152.00L476.00 144.00L476.00 60.00ZM468.00 152.00L504.00 152.00L512.00 144.00L476.00 144.00ZM492.00 97.00L530.00 97.00L538.00 89.00L500.00 89.00ZM530.00 97.00L530.00 178.00L538.00 170.00L538.00 89.00Z",
    strokeNormal:
      "M442.00 42.00L530.00 42.00M442.00 42.00L464.00 20.00M530.00 42.00L552.00 20.00M464.00 20.00L552.00 20.00M530.00 42.00L530.00 68.00M530.00 42.00L552.00 20.00M530.00 68.00L552.00 46.00M552.00 20.00L552.00 46.00M530.00 68.00L468.00 68.00M468.00 68.00L468.00 152.00M468.00 68.00L490.00 46.00M468.00 152.00L490.00 130.00M490.00 46.00L490.00 130.00M468.00 152.00L504.00 152.00M468.00 152.00L490.00 130.00M504.00 152.00L526.00 130.00M490.00 130.00L526.00 130.00M504.00 152.00L504.00 123.00M504.00 123.00L492.00 123.00M492.00 123.00L492.00 97.00M492.00 97.00L530.00 97.00M492.00 97.00L514.00 75.00M530.00 97.00L552.00 75.00M514.00 75.00L552.00 75.00M530.00 97.00L530.00 178.00M530.00 97.00L552.00 75.00M530.00 178.00L552.00 156.00M552.00 75.00L552.00 156.00M530.00 178.00L442.00 178.00M442.00 178.00L442.00 42.00",
    strokePressed:
      "M442.00 42.00L530.00 42.00M442.00 42.00L450.00 34.00M530.00 42.00L538.00 34.00M450.00 34.00L538.00 34.00M530.00 42.00L530.00 68.00M530.00 42.00L538.00 34.00M530.00 68.00L538.00 60.00M538.00 34.00L538.00 60.00M530.00 68.00L468.00 68.00M468.00 68.00L468.00 152.00M468.00 68.00L476.00 60.00M468.00 152.00L476.00 144.00M476.00 60.00L476.00 144.00M468.00 152.00L504.00 152.00M468.00 152.00L476.00 144.00M504.00 152.00L512.00 144.00M476.00 144.00L512.00 144.00M504.00 152.00L504.00 123.00M504.00 123.00L492.00 123.00M492.00 123.00L492.00 97.00M492.00 97.00L530.00 97.00M492.00 97.00L500.00 89.00M530.00 97.00L538.00 89.00M500.00 89.00L538.00 89.00M530.00 97.00L530.00 178.00M530.00 97.00L538.00 89.00M530.00 178.00L538.00 170.00M538.00 89.00L538.00 170.00M530.00 178.00L442.00 178.00M442.00 178.00L442.00 42.00",
  },
  {
    char: "P",
    front:
      "M612.00 42.00L698.00 42.00L698.00 115.44L638.00 115.44L638.00 178.00L612.00 178.00Z M638.00 68.00L672.00 68.00L672.00 89.44L638.00 89.44Z",
    wallsNormal:
      "M612.00 42.00L698.00 42.00L720.00 20.00L634.00 20.00ZM698.00 42.00L698.00 115.44L720.00 93.44L720.00 20.00ZM638.00 115.44L638.00 178.00L660.00 156.00L660.00 93.44ZM638.00 68.00L672.00 68.00L694.00 46.00L660.00 46.00ZM672.00 68.00L672.00 89.44L694.00 67.44L694.00 46.00Z",
    wallsPressed:
      "M612.00 42.00L698.00 42.00L706.00 34.00L620.00 34.00ZM698.00 42.00L698.00 115.44L706.00 107.44L706.00 34.00ZM638.00 115.44L638.00 178.00L646.00 170.00L646.00 107.44ZM638.00 68.00L672.00 68.00L680.00 60.00L646.00 60.00ZM672.00 68.00L672.00 89.44L680.00 81.44L680.00 60.00Z",
    strokeNormal:
      "M612.00 42.00L698.00 42.00M612.00 42.00L634.00 20.00M698.00 42.00L720.00 20.00M634.00 20.00L720.00 20.00M698.00 42.00L698.00 115.44M698.00 42.00L720.00 20.00M698.00 115.44L720.00 93.44M720.00 20.00L720.00 93.44M698.00 115.44L638.00 115.44M638.00 115.44L638.00 178.00M638.00 115.44L660.00 93.44M638.00 178.00L660.00 156.00M660.00 93.44L660.00 156.00M638.00 178.00L612.00 178.00M612.00 178.00L612.00 42.00M638.00 68.00L672.00 68.00M638.00 68.00L660.00 46.00M672.00 68.00L694.00 46.00M660.00 46.00L694.00 46.00M672.00 68.00L672.00 89.44M672.00 68.00L694.00 46.00M672.00 89.44L694.00 67.44M694.00 46.00L694.00 67.44M672.00 89.44L638.00 89.44M638.00 89.44L638.00 68.00",
    strokePressed:
      "M612.00 42.00L698.00 42.00M612.00 42.00L620.00 34.00M698.00 42.00L706.00 34.00M620.00 34.00L706.00 34.00M698.00 42.00L698.00 115.44M698.00 42.00L706.00 34.00M698.00 115.44L706.00 107.44M706.00 34.00L706.00 107.44M698.00 115.44L638.00 115.44M638.00 115.44L638.00 178.00M638.00 115.44L646.00 107.44M638.00 178.00L646.00 170.00M646.00 107.44L646.00 170.00M638.00 178.00L612.00 178.00M612.00 178.00L612.00 42.00M638.00 68.00L672.00 68.00M638.00 68.00L646.00 60.00M672.00 68.00L680.00 60.00M646.00 60.00L680.00 60.00M672.00 68.00L672.00 89.44M672.00 68.00L680.00 60.00M672.00 89.44L680.00 81.44M680.00 60.00L680.00 81.44M672.00 89.44L638.00 89.44M638.00 89.44L638.00 68.00",
  },
  {
    char: "H",
    front:
      "M720.00 42.00L746.00 42.00L746.00 97.00L782.00 97.00L782.00 42.00L808.00 42.00L808.00 178.00L782.00 178.00L782.00 123.00L746.00 123.00L746.00 178.00L720.00 178.00Z",
    wallsNormal:
      "M720.00 42.00L746.00 42.00L768.00 20.00L742.00 20.00ZM746.00 42.00L746.00 97.00L768.00 75.00L768.00 20.00ZM746.00 97.00L782.00 97.00L804.00 75.00L768.00 75.00ZM782.00 42.00L808.00 42.00L830.00 20.00L804.00 20.00ZM808.00 42.00L808.00 178.00L830.00 156.00L830.00 20.00ZM746.00 123.00L746.00 178.00L768.00 156.00L768.00 101.00Z",
    wallsPressed:
      "M720.00 42.00L746.00 42.00L754.00 34.00L728.00 34.00ZM746.00 42.00L746.00 97.00L754.00 89.00L754.00 34.00ZM746.00 97.00L782.00 97.00L790.00 89.00L754.00 89.00ZM782.00 42.00L808.00 42.00L816.00 34.00L790.00 34.00ZM808.00 42.00L808.00 178.00L816.00 170.00L816.00 34.00ZM746.00 123.00L746.00 178.00L754.00 170.00L754.00 115.00Z",
    strokeNormal:
      "M720.00 42.00L746.00 42.00M720.00 42.00L742.00 20.00M746.00 42.00L768.00 20.00M742.00 20.00L768.00 20.00M746.00 42.00L746.00 97.00M746.00 42.00L768.00 20.00M746.00 97.00L768.00 75.00M768.00 20.00L768.00 75.00M746.00 97.00L782.00 97.00M746.00 97.00L768.00 75.00M782.00 97.00L804.00 75.00M768.00 75.00L804.00 75.00M782.00 97.00L782.00 42.00M782.00 42.00L808.00 42.00M782.00 42.00L804.00 20.00M808.00 42.00L830.00 20.00M804.00 20.00L830.00 20.00M808.00 42.00L808.00 178.00M808.00 42.00L830.00 20.00M808.00 178.00L830.00 156.00M830.00 20.00L830.00 156.00M808.00 178.00L782.00 178.00M782.00 178.00L782.00 123.00M782.00 123.00L746.00 123.00M746.00 123.00L746.00 178.00M746.00 123.00L768.00 101.00M746.00 178.00L768.00 156.00M768.00 101.00L768.00 156.00M746.00 178.00L720.00 178.00M720.00 178.00L720.00 42.00",
    strokePressed:
      "M720.00 42.00L746.00 42.00M720.00 42.00L728.00 34.00M746.00 42.00L754.00 34.00M728.00 34.00L754.00 34.00M746.00 42.00L746.00 97.00M746.00 42.00L754.00 34.00M746.00 97.00L754.00 89.00M754.00 34.00L754.00 89.00M746.00 97.00L782.00 97.00M746.00 97.00L754.00 89.00M782.00 97.00L790.00 89.00M754.00 89.00L790.00 89.00M782.00 97.00L782.00 42.00M782.00 42.00L808.00 42.00M782.00 42.00L790.00 34.00M808.00 42.00L816.00 34.00M790.00 34.00L816.00 34.00M808.00 42.00L808.00 178.00M808.00 42.00L816.00 34.00M808.00 178.00L816.00 170.00M816.00 34.00L816.00 170.00M808.00 178.00L782.00 178.00M782.00 178.00L782.00 123.00M782.00 123.00L746.00 123.00M746.00 123.00L746.00 178.00M746.00 123.00L754.00 115.00M746.00 178.00L754.00 170.00M754.00 115.00L754.00 170.00M746.00 178.00L720.00 178.00M720.00 178.00L720.00 42.00",
  },
  {
    char: "A",
    front:
      "M830.00 42.00L918.00 42.00L918.00 178.00L892.00 178.00L892.00 133.88L856.00 133.88L856.00 178.00L830.00 178.00Z M856.00 68.00L892.00 68.00L892.00 107.88L856.00 107.88Z",
    wallsNormal:
      "M830.00 42.00L918.00 42.00L940.00 20.00L852.00 20.00ZM918.00 42.00L918.00 178.00L940.00 156.00L940.00 20.00ZM856.00 133.88L856.00 178.00L878.00 156.00L878.00 111.88ZM856.00 68.00L892.00 68.00L914.00 46.00L878.00 46.00ZM892.00 68.00L892.00 107.88L914.00 85.88L914.00 46.00Z",
    wallsPressed:
      "M830.00 42.00L918.00 42.00L926.00 34.00L838.00 34.00ZM918.00 42.00L918.00 178.00L926.00 170.00L926.00 34.00ZM856.00 133.88L856.00 178.00L864.00 170.00L864.00 125.88ZM856.00 68.00L892.00 68.00L900.00 60.00L864.00 60.00ZM892.00 68.00L892.00 107.88L900.00 99.88L900.00 60.00Z",
    strokeNormal:
      "M830.00 42.00L918.00 42.00M830.00 42.00L852.00 20.00M918.00 42.00L940.00 20.00M852.00 20.00L940.00 20.00M918.00 42.00L918.00 178.00M918.00 42.00L940.00 20.00M918.00 178.00L940.00 156.00M940.00 20.00L940.00 156.00M918.00 178.00L892.00 178.00M892.00 178.00L892.00 133.88M892.00 133.88L856.00 133.88M856.00 133.88L856.00 178.00M856.00 133.88L878.00 111.88M856.00 178.00L878.00 156.00M878.00 111.88L878.00 156.00M856.00 178.00L830.00 178.00M830.00 178.00L830.00 42.00M856.00 68.00L892.00 68.00M856.00 68.00L878.00 46.00M892.00 68.00L914.00 46.00M878.00 46.00L914.00 46.00M892.00 68.00L892.00 107.88M892.00 68.00L914.00 46.00M892.00 107.88L914.00 85.88M914.00 46.00L914.00 85.88M892.00 107.88L856.00 107.88M856.00 107.88L856.00 68.00",
    strokePressed:
      "M830.00 42.00L918.00 42.00M830.00 42.00L838.00 34.00M918.00 42.00L926.00 34.00M838.00 34.00L926.00 34.00M918.00 42.00L918.00 178.00M918.00 42.00L926.00 34.00M918.00 178.00L926.00 170.00M926.00 34.00L926.00 170.00M918.00 178.00L892.00 178.00M892.00 178.00L892.00 133.88M892.00 133.88L856.00 133.88M856.00 133.88L856.00 178.00M856.00 133.88L864.00 125.88M856.00 178.00L864.00 170.00M864.00 125.88L864.00 170.00M856.00 178.00L830.00 178.00M830.00 178.00L830.00 42.00M856.00 68.00L892.00 68.00M856.00 68.00L864.00 60.00M892.00 68.00L900.00 60.00M864.00 60.00L900.00 60.00M892.00 68.00L892.00 107.88M892.00 68.00L900.00 60.00M892.00 107.88L900.00 99.88M900.00 60.00L900.00 99.88M892.00 107.88L856.00 107.88M856.00 107.88L856.00 68.00",
  },
  {
    char: "N",
    front:
      "M940.00 42.00L966.00 42.00L1006.00 139.92L1006.00 42.00L1032.00 42.00L1032.00 178.00L1006.00 178.00L966.00 80.08L966.00 178.00L940.00 178.00Z",
    wallsNormal:
      "M940.00 42.00L966.00 42.00L988.00 20.00L962.00 20.00ZM966.00 42.00L1006.00 139.92L1028.00 117.92L988.00 20.00ZM1006.00 42.00L1032.00 42.00L1054.00 20.00L1028.00 20.00ZM1032.00 42.00L1032.00 178.00L1054.00 156.00L1054.00 20.00ZM966.00 80.08L966.00 178.00L988.00 156.00L988.00 58.08Z",
    wallsPressed:
      "M940.00 42.00L966.00 42.00L974.00 34.00L948.00 34.00ZM966.00 42.00L1006.00 139.92L1014.00 131.92L974.00 34.00ZM1006.00 42.00L1032.00 42.00L1040.00 34.00L1014.00 34.00ZM1032.00 42.00L1032.00 178.00L1040.00 170.00L1040.00 34.00ZM966.00 80.08L966.00 178.00L974.00 170.00L974.00 72.08Z",
    strokeNormal:
      "M940.00 42.00L966.00 42.00M940.00 42.00L962.00 20.00M966.00 42.00L988.00 20.00M962.00 20.00L988.00 20.00M966.00 42.00L1006.00 139.92M966.00 42.00L988.00 20.00M1006.00 139.92L1028.00 117.92M988.00 20.00L1028.00 117.92M1006.00 139.92L1006.00 42.00M1006.00 42.00L1032.00 42.00M1006.00 42.00L1028.00 20.00M1032.00 42.00L1054.00 20.00M1028.00 20.00L1054.00 20.00M1032.00 42.00L1032.00 178.00M1032.00 42.00L1054.00 20.00M1032.00 178.00L1054.00 156.00M1054.00 20.00L1054.00 156.00M1032.00 178.00L1006.00 178.00M1006.00 178.00L966.00 80.08M966.00 80.08L966.00 178.00M966.00 80.08L988.00 58.08M966.00 178.00L988.00 156.00M988.00 58.08L988.00 156.00M966.00 178.00L940.00 178.00M940.00 178.00L940.00 42.00",
    strokePressed:
      "M940.00 42.00L966.00 42.00M940.00 42.00L948.00 34.00M966.00 42.00L974.00 34.00M948.00 34.00L974.00 34.00M966.00 42.00L1006.00 139.92M966.00 42.00L974.00 34.00M1006.00 139.92L1014.00 131.92M974.00 34.00L1014.00 131.92M1006.00 139.92L1006.00 42.00M1006.00 42.00L1032.00 42.00M1006.00 42.00L1014.00 34.00M1032.00 42.00L1040.00 34.00M1014.00 34.00L1040.00 34.00M1032.00 42.00L1032.00 178.00M1032.00 42.00L1040.00 34.00M1032.00 178.00L1040.00 170.00M1040.00 34.00L1040.00 170.00M1032.00 178.00L1006.00 178.00M1006.00 178.00L966.00 80.08M966.00 80.08L966.00 178.00M966.00 80.08L974.00 72.08M966.00 178.00L974.00 170.00M974.00 72.08L974.00 170.00M966.00 178.00L940.00 178.00M940.00 178.00L940.00 42.00",
  },
]

const pressTransition: Transition = {
  type: "spring",
  stiffness: 350,
  damping: 22,
  mass: 0.6,
}

export type PhongPhanVariant = "full" | "padded"

export interface PhongPhanIsometricProps {
  className?: string
  showGrid?: boolean
  showCrosshairs?: boolean
  variant?: PhongPhanVariant
  padding?: boolean
  enableSound?: boolean
  onTap?: () => void
  isDark?: boolean
  accentColor?: string
  legacyDiagonalMode?: boolean
  pressMode?: "individual" | "all"
  stiffness?: number
  damping?: number
  staggerDelay?: number
  initialY?: number
  forceVisible?: boolean
  onInViewChange?: (inView: boolean) => void
}

/**
 * CoreRedesigned Component: PhongPhanIsometric
 * Supports both the refined clean look (no diagonal lines) and legacy mode for comparison,
 * plus scroll-triggered staggered spring jump animation per letter.
 */
export function PhongPhanIsometric({
  className = "",
  showGrid = true,
  variant = "full",
  padding,
  enableSound = true,
  onTap,
  isDark,
  accentColor = "#ff3c00",
  legacyDiagonalMode = false,
  pressMode = "individual",
  stiffness = 100,
  damping = 12,
  staggerDelay = 0.035,
  initialY = 200,
  forceVisible,
  onInViewChange,
}: PhongPhanIsometricProps = {}) {
  const id = useId()
  const ids = {
    frontSurface: `pp-front-surface-${id}`,
    facePattern: `pp-face-pattern-${id}`,
    radialGradient: `pp-radial-gradient-${id}`,
    clipArea: `pp-clip-area-${id}`,
  }

  const isFull = padding === undefined ? variant === "full" : !padding
  const viewBox = isFull ? "0 0 1054 198" : "-80 0 1214 198"
  const widthBoundMin = isFull ? 0 : -80
  const widthBoundMax = isFull ? 1054 : 1134

  const ref = useRef<SVGSVGElement | null>(null)
  const [pressedWord, setPressedWord] = useState(false)
  const [pressedLetterIdx, setPressedLetterIdx] = useState<number | null>(null)

  const shouldReduceMotion = useReducedMotion()
  const isInView = useInView(ref, { amount: 0.25 })

  useEffect(() => {
    if (onInViewChange) {
      onInViewChange(isInView)
    }
  }, [isInView, onInViewChange])

  const activeVisible = forceVisible !== undefined ? forceVisible : isInView

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const cx = useSpring(
    useTransform(mouseX, [0, 1], [widthBoundMin, widthBoundMax]),
    {
      stiffness: 300,
      damping: 30,
      mass: 0.1,
    }
  )

  const cy = useSpring(useTransform(mouseY, [0, 1], [0, 198]), {
    stiffness: 300,
    damping: 30,
    mass: 0.1,
  })

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  const [themeDark, setThemeDark] = useState(() => {
    if (typeof document === "undefined") return true
    const root = document.documentElement
    if (root.classList.contains("dark")) return true
    if (root.classList.contains("light")) return false
    return window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : true
  })

  useEffect(() => {
    if (typeof document === "undefined") return
    const checkDark = () => {
      const root = document.documentElement
      if (root.classList.contains("dark")) return true
      if (root.classList.contains("light")) return false
      return window.matchMedia
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
        : true
    }
    setThemeDark(checkDark())

    const observer = new MutationObserver(() => setThemeDark(checkDark()))
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    const handleGlobalPointerUp = () => {
      setPressedWord(false)
      setPressedLetterIdx(null)
    }
    window.addEventListener("pointerup", handleGlobalPointerUp)

    return () => {
      observer.disconnect()
      window.removeEventListener("pointerup", handleGlobalPointerUp)
    }
  }, [])

  const activeDark = isDark !== undefined ? isDark : themeDark

  const frontTopColor = activeDark ? "#1c1c22" : "#ffffff"
  const frontBottomColor = activeDark ? "#0c0c0f" : "#f1f1f5"
  const wallFill = activeDark ? "#141418" : "#e0e0e6"
  const baseStroke = activeDark
    ? "rgba(255, 255, 255, 0.22)"
    : "rgba(15, 20, 30, 0.28)"
  const patternStroke = activeDark
    ? "rgba(255, 255, 255, 0.12)"
    : "rgba(15, 20, 30, 0.14)"
  const gridStroke = activeDark
    ? "rgba(255, 255, 255, 0.08)"
    : "rgba(15, 20, 30, 0.07)"

  // Variants inspired by TextContainer.tsx
  const scrollVariants: Variants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : {
            type: "spring",
            stiffness: stiffness,
            damping: damping,
            duration: 0.4,
            delay: i * staggerDelay,
          },
    }),
    hidden: {
      y: shouldReduceMotion ? 0 : initialY,
      opacity: shouldReduceMotion ? 1 : 0,
    },
  }

  return (
    <motion.svg
      ref={ref}
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      className={`block h-auto w-full cursor-pointer touch-manipulation overflow-visible select-none ${className}`}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="PHONG PHAN 3D Isometric Typography"
      initial="hidden"
      animate={activeVisible ? "visible" : "hidden"}
      onMouseMove={handleMouseMove}
      onPointerDown={() => {
        if (pressMode === "all") {
          setPressedWord(true)
          if (enableSound) playTapSound(1)
        }
        onTap?.()
      }}
      onPointerUp={() => setPressedWord(false)}
      onPointerLeave={() => {
        setPressedWord(false)
        setPressedLetterIdx(null)
      }}
      onPointerCancel={() => {
        setPressedWord(false)
        setPressedLetterIdx(null)
      }}
    >
      <defs>
        <clipPath id={ids.clipArea}>
          <rect x="-120" y="-45" width="1300" height="243" />
        </clipPath>

        {/* Clean Refined Front Surface Gradient (No diagonal lines) */}
        <linearGradient
          id={ids.frontSurface}
          x1="0"
          y1="42"
          x2="0"
          y2="178"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={frontTopColor} />
          <stop offset="100%" stopColor={frontBottomColor} />
        </linearGradient>

        {/* Legacy Diagonal Hatching Pattern (only used when comparing old vs new) */}
        <pattern
          id={ids.facePattern}
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M-1 1l2 -2M0 10l10 -10M9 11l2 -2"
            stroke={patternStroke}
            strokeWidth="1.2"
          />
        </pattern>

        {/* Cursor-following Radial Gradient Flashlight */}
        <motion.radialGradient
          id={ids.radialGradient}
          cx={cx}
          cy={cy}
          r="340"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={accentColor} stopOpacity="1" />
          <stop offset="48%" stopColor={accentColor} stopOpacity="0.55" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
        </motion.radialGradient>
      </defs>

      {/* Blueprint Technical Construction Grid Lines */}
      {showGrid && (
        <g stroke={gridStroke} strokeWidth="1" strokeDasharray="4 3">
          <line x1="-200" y1="20" x2="1250" y2="20" />
          <line x1="-200" y1="42" x2="1250" y2="42" />
          <line x1="-200" y1="110" x2="1250" y2="110" />
          <line x1="-200" y1="178" x2="1250" y2="178" />
          {[-200, -60, 80, 220, 360, 500, 640, 780, 920, 1060, 1200].map(
            (offset) => (
              <line
                key={offset}
                x1={offset - 220}
                y1="240"
                x2={offset + 220}
                y2="-200"
              />
            )
          )}
        </g>
      )}

      {/* Staggered 9 Letters Container */}
      <g clipPath={`url(#${ids.clipArea})`}>
        {LETTERS.map((letter, index) => {
          const isPressed =
            pressMode === "all" ? pressedWord : pressedLetterIdx === index

          return (
            <motion.g
              key={`${letter.char}-${index}`}
              custom={index}
              variants={scrollVariants}
              onPointerDown={(e) => {
                if (pressMode === "individual") {
                  e.stopPropagation()
                  setPressedLetterIdx(index)
                  if (enableSound) playTapSound(0.9 + index * 0.04)
                  onTap?.()
                }
              }}
              onPointerUp={() => {
                if (pressMode === "individual") setPressedLetterIdx(null)
              }}
            >
              {/* 1. 3D Extruded Side & Top Walls */}
              <motion.path
                fill={legacyDiagonalMode ? frontBottomColor : wallFill}
                animate={{
                  d: isPressed ? letter.wallsPressed : letter.wallsNormal,
                  x: isPressed ? 14 : 0,
                  y: isPressed ? -14 : 0,
                }}
                transition={pressTransition}
              />

              {/* 2. Front Face (Clean Gradient vs Legacy Diagonal Hatching) */}
              <motion.path
                d={letter.front}
                fill={
                  legacyDiagonalMode
                    ? frontBottomColor
                    : `url(#${ids.frontSurface})`
                }
                fillRule="evenodd"
                clipRule="evenodd"
                animate={{
                  x: isPressed ? 14 : 0,
                  y: isPressed ? -14 : 0,
                }}
                transition={pressTransition}
              />

              {legacyDiagonalMode && (
                <motion.path
                  d={letter.front}
                  fill={`url(#${ids.facePattern})`}
                  fillRule="evenodd"
                  clipRule="evenodd"
                  animate={{
                    x: isPressed ? 14 : 0,
                    y: isPressed ? -14 : 0,
                  }}
                  transition={pressTransition}
                />
              )}

              {/* 3. Subtle Wireframe Base Stroke */}
              <motion.path
                stroke={baseStroke}
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{
                  d: isPressed ? letter.strokePressed : letter.strokeNormal,
                  x: isPressed ? 14 : 0,
                  y: isPressed ? -14 : 0,
                }}
                transition={pressTransition}
              />

              {/* 4. Cursor-Following Radial Flashlight Stroke */}
              <motion.path
                stroke={`url(#${ids.radialGradient})`}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{
                  d: isPressed ? letter.strokePressed : letter.strokeNormal,
                  x: isPressed ? 14 : 0,
                  y: isPressed ? -14 : 0,
                }}
                transition={pressTransition}
              />
            </motion.g>
          )
        })}
      </g>
    </motion.svg>
  )
}

export default PhongPhanIsometric
