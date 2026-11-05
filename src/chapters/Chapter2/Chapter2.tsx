import * as Plot from '@observablehq/plot'
import channelsData from '../../data/channels.json'
import { PlotChart } from '../../components/PlotChart'
import { DataTable } from '../../components/DataTable'
import type { UseChannelSelectionReturn } from '../../hooks/useChannelSelection'
import { formatDollars } from '../../utils/format'
import { displayName } from '../../utils/displayLabel'
import './Chapter2.css'

// Hong Kong teal palette — 8 usable data stops, lightest (HK-85) to darkest (HK-5).
const HK_TEAL_8 = [
  '#b5e4d8', // HK-85
  '#6dcdb5', // HK-70
  '#35b595', // HK-55
  '#1fa282', // HK-45
  '#158f75', // HK-35
  '#0e6e5a', // HK-25
  '#0a5c4b', // HK-15
  '#063d32', // HK-5
]

function getHKTeal(index: number, total: number): string {
  const step = Math.min(
    Math.floor((index / total) * HK_TEAL_8.length),
    HK_TEAL_8.length - 1
  )
  return HK_TEAL_8[step]
}

// Filter to channels with real per-unit data, sort ascending
const perUnitData = [...channelsData]
  .filter((d) => d.contribution_per_unit !== null && d.contribution_per_unit !== undefined)
  .sort((a, b) => (a.contribution_per_unit as unknown as number) - (b.contribution_per_unit as unknown as number))

// Fall back to contribution_margin_pct when units are not yet populated
const marginData = [...channelsData]
  .sort((a, b) => a.contribution_margin_pct - b.contribution_margin_pct)

const hasPerUnitData = perUnitData.length > 0
const sortedData = hasPerUnitData ? perUnitData : marginData

export function Chapter2({ selection }: { selection: UseChannelSelectionReturn }) {
  const renderChart = (_container: HTMLDivElement) => {
    const xField = hasPerUnitData ? 'contribution_per_unit' : 'contribution_margin_pct'
    const xLabel = hasPerUnitData
      ? 'Contribution per unit shipped ($)'
      : 'Contribution margin % (units data pending)'
    const xFormat = hasPerUnitData
      ? (v: number) => formatDollars(v)
      : (v: number) => `${(v * 100).toFixed(1)}%`

    const chart = Plot.plot({
      marks: [
        Plot.barX(sortedData, {
          x: xField,
          y: (d) => displayName(d.channel),
          sort: { y: 'x' },
          fill: (_d, i) => getHKTeal(i, sortedData.length),
          opacity: (d) => selection.getOpacity(d.channel),
          tip: {
            format: {
              x: xFormat,
              y: String,
            }
          },
        }),
        Plot.text(sortedData, {
          x: xField,
          y: (d) => displayName(d.channel),
          text: (d) => xFormat((d as Record<string, number>)[xField]),
          dx: 6,
          textAnchor: 'start',
          fontSize: 13,
          fill: 'var(--color-text-primary)',
        }),
        Plot.ruleX([0]),
      ],
      x: {
        label: xLabel,
        tickFormat: xFormat,
      },
      y: { label: null },
      marginLeft: 140,
      marginRight: 80,
      height: 420,
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: '13px',
        background: 'transparent',
      },
    })
    return chart
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as Element
    const channelEl = target.closest('[data-channel]')
    if (channelEl) {
      selection.select(channelEl.getAttribute('data-channel')!)
    } else {
      selection.clearSelection()
    }
  }

  return (
    <div className="ch2">
      <p className="ch2-framing prose">
        Strip away revenue and look at what each unit actually earns — for wholesale channels, after every deduction, chargeback, and fee; for DTC, after COGS and dispute overhead but before processing fees and fulfillment. All three distributor channels sit at the bottom. Despite fewer deductions, distributors buy at lower wholesale prices, so COGS consumes a larger share of every dollar. Retail channels, deduction-heavy as they are, start from a higher price point that more than compensates. The blended gap is roughly five margin points: 51% retail versus 46% distribution.
      </p>
      <div className="ch2-chart-container" onClick={handleClick}>
        <PlotChart
          render={renderChart}
          ariaLabel="Contribution per unit shipped by channel, ranked lowest to highest"
        />
      </div>
      <p className="ch2-footnote prose">
        Source: Cinderhaven platform data. Contribution = net revenue after all deductions minus COGS.
        DTC contribution is stated before processing fees and fulfillment costs, which this dataset does not itemize.
      </p>

      <DataTable
        caption={
          hasPerUnitData
            ? 'Contribution per unit by channel, ranked lowest to highest'
            : 'Contribution margin % by channel (per-unit data pending)'
        }
        columns={
          hasPerUnitData
            ? [
                { key: 'channel', label: 'Channel', format: (v) => displayName(v as string) },
                { key: 'contribution_per_unit', label: 'Contribution per Unit ($)', format: (v) => formatDollars(v as number) },
              ]
            : [
                { key: 'channel', label: 'Channel', format: (v) => displayName(v as string) },
                { key: 'contribution_margin_pct', label: 'Contribution Margin %', format: (v) => `${((v as number) * 100).toFixed(1)}%` },
              ]
        }
        data={sortedData as Record<string, unknown>[]}
      />
    </div>
  )
}
