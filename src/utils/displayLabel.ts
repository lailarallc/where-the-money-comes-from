/**
 * Public display labels for Cinderhaven's trade partners.
 *
 * Rule (2026-11-05): a Cinderhaven dollar figure never shares a sentence, row,
 * chart label, card, or tooltip with a real retailer/distributor name. Data keys
 * (channels.json, deductions.json, selection state) keep the real names; only
 * rendered text goes through these helpers. Labels come from the vendored
 * reference/retailer_display_labels.json (refresh with scripts/refresh_canonical.py).
 */
import labelMap from '../../reference/retailer_display_labels.json'

const LABELS: Record<string, string> = Object.fromEntries(
  [...Object.values(labelMap.retailers), ...Object.values(labelMap.distributors)].map(
    (p) => [p.name, p.label]
  )
)

// Longest names first so "DPI Northwest" is replaced before any shorter overlap.
const NAME_RE = new RegExp(
  `\\b(${Object.keys(LABELS)
    .sort((a, b) => b.length - a.length)
    .map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')})\\b`,
  'g'
)

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** Label for use mid-sentence ("the national mass retailer"). Unknown names (DTC) pass through. */
export function displayLabel(channel: string): string {
  return LABELS[channel] ?? channel
}

/** Label for a chart axis, legend, table cell, or title ("National mass retailer"). */
export function displayName(channel: string): string {
  return capitalize(displayLabel(channel))
}

/** Replace every real partner name inside a data-supplied string with its label. */
export function relabelText(text: string): string {
  return text.replace(NAME_RE, (name) => displayLabel(name))
}
