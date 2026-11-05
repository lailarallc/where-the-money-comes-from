import { useState, useCallback } from 'react'
import * as Plot from '@observablehq/plot'
import { PlotChart } from '../../components/PlotChart'
import { DataTable } from '../../components/DataTable'
import { formatDollars, formatPercent, formatUnits } from '../../utils/format'
import { displayLabel, displayName } from '../../utils/displayLabel'
import type { UseChannelSelectionReturn } from '../../hooks/useChannelSelection'
import channelsData from '../../data/channels.json'
import './Chapter1.css'

type ViewKey = 'revenue' | 'contribution_dollars' | 'contribution_pct'

interface Chapter1Props {
  selection: UseChannelSelectionReturn
}

// Hong Kong teal palette -- darkest to lightest, 6 steps for up to 6 channels
const HK_COLORS = [
  '#063d32', // HK-5
  '#0a5c4b', // HK-15
  '#0e6e5a', // HK-25
  '#158f75', // HK-35
  '#1fa282', // HK-45
  '#35b595', // HK-55
]

function getHKColor(index: number, total: number): string {
  const step = Math.min(
    Math.floor((index / total) * HK_COLORS.length),
    HK_COLORS.length - 1
  )
  return HK_COLORS[step]
}

// Compute Walmart revenue share for framing prose
const totalRevenue = channelsData.reduce((sum, d) => sum + d.revenue, 0)
const walmartRevenuePct = formatPercent(
  (channelsData.find((d) => d.channel === 'Walmart')?.revenue ?? 0) / totalRevenue
)

const VIEW_CONFIG: Record<
  ViewKey,
  {
    label: string
    field: keyof (typeof channelsData)[0]
    xLabel: string
    tickFormat: (d: number) => string
    framing: string
    footnote: string
  }
> = {
  revenue: {
    label: 'Revenue',
    field: 'revenue',
    xLabel: 'Gross Revenue',
    tickFormat: formatDollars,
    framing: `The ${displayLabel('Walmart')} accounts for ${walmartRevenuePct} of Cinderhaven's gross revenue. By this measure, the board's conclusion is obvious: the ${displayLabel('Walmart')} is the business. Keep feeding it.`,
    footnote: 'Source: Cinderhaven FY2024–2026 channel P&L. Revenue shown as gross before trade deductions.',
  },
  contribution_dollars: {
    label: 'Contribution $',
    field: 'contribution_dollars',
    xLabel: 'Contribution Dollars',
    tickFormat: formatDollars,
    framing: `The same data, reframed by what each channel actually leaves in the business. The ${displayLabel('Walmart')} drops from first in revenue to third in contribution, behind the ${displayLabel('Whole Foods')} and the ${displayLabel('Kroger')}. The retail leaders, not distributors, surface as the highest-contribution channels.`,
    footnote: 'Contribution dollars = gross revenue minus all trade deductions, promo costs, freight, and variable COGS. Fixed overhead excluded.',
  },
  contribution_pct: {
    label: 'Contribution %',
    field: 'contribution_margin_pct',
    xLabel: 'Contribution Margin %',
    tickFormat: (d: number) => formatPercent(d),
    framing:
      'Retail channels earn roughly 51 cents per revenue dollar. Distributors earn 46 cents. The 5-point gap is structural — distributors buy at lower wholesale prices, so manufacturing cost consumes a larger share of every dollar.',
    footnote:
      'Contribution margin % = contribution dollars divided by gross revenue. Figures are pre-overhead and pre-tax.',
  },
}

export function Chapter1({ selection }: Chapter1Props) {
  const [activeView, setActiveView] = useState<ViewKey>('revenue')
  const [opacity, setOpacity] = useState(1)

  const handleViewChange = (view: ViewKey) => {
    if (view === activeView) return

    selection.clearSelection()

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      setActiveView(view)
      return
    }

    // Crossfade: fade out -> swap -> fade in
    setOpacity(0)
    requestAnimationFrame(() => {
      setActiveView(view)
      requestAnimationFrame(() => {
        setOpacity(1)
      })
    })
  }

  const config = VIEW_CONFIG[activeView]

  const renderChart = useCallback(
    (_container: HTMLDivElement) => {
      const field = config.field as keyof (typeof channelsData)[0]

      const sortedData = [...channelsData].sort(
        (a, b) => (b[field] as number) - (a[field] as number)
      )

      const chart = Plot.plot({
        marks: [
          Plot.barX(sortedData, {
            x: field,
            y: (d) => displayName(d.channel),
            sort: { y: '-x' },
            fill: (_d, i) => getHKColor(i, sortedData.length),
            opacity: (d) => selection.getOpacity(d.channel),
            title: (d) =>
              `${displayName(d.channel)}: ${
                activeView === 'contribution_pct'
                  ? formatPercent(d.contribution_margin_pct)
                  : formatDollars(d[field] as number)
              }`,
          }),
          Plot.ruleX([0]),
          Plot.text(sortedData, {
            x: field,
            y: (d) => displayName(d.channel),
            text: (d) =>
              activeView === 'contribution_pct'
                ? formatPercent(d.contribution_margin_pct)
                : formatDollars(d[field] as number),
            dx: 6,
            textAnchor: 'start',
            fontSize: 13,
            fill: 'var(--color-text-primary)',
            opacity: (d) => selection.getOpacity(d.channel),
          }),
        ],
        x: {
          label: config.xLabel,
          tickFormat: config.tickFormat,
          grid: true,
        },
        y: { label: null },
        marginLeft: 140,
        marginRight: 80,
        height: 420,
        style: {
          fontFamily: 'var(--font-sans)',
          fontSize: '13px',
          background: 'transparent',
          overflow: 'visible',
        },
      })

      // Post-process: attach data-channel to each bar rect so click handler can read it
      const rects = chart.querySelectorAll<SVGRectElement>('rect')
      let barIndex = 0
      rects.forEach((rect) => {
        const h = parseFloat(rect.getAttribute('height') ?? '0')
        if (h > 2 && barIndex < sortedData.length) {
          rect.setAttribute('data-channel', sortedData[barIndex].channel)
          rect.style.cursor = 'pointer'
          barIndex++
        }
      })

      return chart
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeView, selection.selected]
  )

  const handleChartClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const channel = target.getAttribute('data-channel')
    if (channel) {
      selection.select(channel)
    } else if (
      target === e.currentTarget ||
      target.tagName === 'svg' ||
      target.tagName === 'g'
    ) {
      selection.clearSelection()
    }
  }

  return (
    <div className="chapter-1">
      {/* Toggle buttons */}
      <div className="ch1-toggle" role="group" aria-label="Chart view selector">
        {(Object.keys(VIEW_CONFIG) as ViewKey[]).map((view) => (
          <button
            key={view}
            className={`ch1-toggle__btn${activeView === view ? ' ch1-toggle__btn--active' : ''}`}
            onClick={() => handleViewChange(view)}
            aria-pressed={activeView === view}
          >
            {VIEW_CONFIG[view].label}
          </button>
        ))}
      </div>

      {/* Framing prose */}
      <p className="ch1-framing prose">{config.framing}</p>

      {/* Chart */}
      <div
        className="ch1-chart-wrapper"
        style={{ opacity }}
        onClick={handleChartClick}
        role="presentation"
      >
        <PlotChart
          render={renderChart}
          ariaLabel={`${config.label} by channel -- horizontal bar chart`}
        />
      </div>

      {/* Footnote */}
      <p className="ch1-footnote prose">{config.footnote}</p>

      {/* Screen-reader data table */}
      <DataTable
        caption="Channel revenue and profitability — all metrics"
        columns={[
          { key: 'channel', label: 'Channel', format: (v) => displayName(v as string) },
          { key: 'revenue', label: 'Gross Revenue', format: (v) => formatDollars(v as number) },
          { key: 'contribution_dollars', label: 'Contribution Dollars', format: (v) => formatDollars(v as number) },
          { key: 'contribution_margin_pct', label: 'Contribution Margin %', format: (v) => formatPercent(v as number) },
          { key: 'units_shipped', label: 'Units Shipped', format: (v) => formatUnits(v as number | null) },
          { key: 'contribution_per_unit', label: 'Contribution per Unit', format: (v) => v == null ? '—' : formatDollars(v as number) },
        ]}
        data={channelsData as Record<string, unknown>[]}
      />
    </div>
  )
}
