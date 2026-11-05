import { useCallback } from 'react'
import * as Plot from '@observablehq/plot'
import { PlotChart } from '../../components/PlotChart'
import { WaterfallChart } from './WaterfallChart'
import { DataTable } from '../../components/DataTable'
import { formatDollars } from '../../utils/format'
import { displayName } from '../../utils/displayLabel'
import type { UseChannelSelectionReturn } from '../../hooks/useChannelSelection'
import channelsData from '../../data/channels.json'
import deductionsData from '../../data/deductions.json'
import './Chapter3.css'

interface Chapter3Props {
  selection: UseChannelSelectionReturn
}

// Hong Kong teal palette — darkest to lightest, 6 steps for up to 6 channels
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

type DeductionsKey = keyof typeof deductionsData

function getDeductionSteps(channel: string) {
  const key = channel as DeductionsKey
  return deductionsData[key]?.steps ?? []
}

function isRetailChannel(channel: string): boolean {
  const key = channel as DeductionsKey
  const type = deductionsData[key]?.type
  return type === 'retail' || type === 'distributor'
}

function getComparisonChannel(channel: string): string {
  const key = channel as DeductionsKey
  const type = deductionsData[key]?.type
  return type === 'distributor' ? 'Walmart' : 'UNFI'
}

const sortedByContribution = [...channelsData].sort(
  (a, b) => b.contribution_dollars - a.contribution_dollars
)

export function Chapter3({ selection }: Chapter3Props) {
  const renderSummaryChart = useCallback(
    (_container: HTMLDivElement) => {
      const chart = Plot.plot({
        marks: [
          Plot.barX(sortedByContribution, {
            x: 'contribution_dollars',
            y: (d) => displayName(d.channel),
            sort: { y: '-x' },
            fill: (_d, i) => getHKColor(i, sortedByContribution.length),
            opacity: (d) => selection.getOpacity(d.channel),
            title: (d) => `${displayName(d.channel)}: ${formatDollars(d.contribution_dollars)}`,
          }),
          Plot.ruleX([0]),
          Plot.text(sortedByContribution, {
            x: 'contribution_dollars',
            y: (d) => displayName(d.channel),
            text: (d) => formatDollars(d.contribution_dollars),
            dx: 6,
            textAnchor: 'start',
            fontSize: 13,
            fill: 'var(--color-text-primary)',
            opacity: (d) => selection.getOpacity(d.channel),
          }),
        ],
        x: {
          label: 'Contribution Dollars',
          tickFormat: formatDollars,
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

      // Attach data-channel to bar rects for click handling
      const rects = chart.querySelectorAll<SVGRectElement>('rect')
      let barIndex = 0
      rects.forEach((rect) => {
        const h = parseFloat(rect.getAttribute('height') ?? '0')
        if (h > 2 && barIndex < sortedByContribution.length) {
          rect.setAttribute('data-channel', sortedByContribution[barIndex].channel)
          rect.style.cursor = 'pointer'
          barIndex++
        }
      })

      return chart
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selection.selected]
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

  const selected = selection.selected
  const showWaterfall = selected !== null && deductionsData[selected as DeductionsKey] !== undefined
  const selectedIsRetail = selected !== null && isRetailChannel(selected)
  const showSideBySide = showWaterfall && selectedIsRetail && selected !== 'DTC'
  const comparisonChannel = selected !== null && showSideBySide ? getComparisonChannel(selected) : null

  return (
    <div className="chapter-3">
      <p className="ch3-framing prose">
        Every retail channel carries a hidden layer of deductions between the invoice price and
        what actually reaches your bank account: slotting fees, chargebacks, OTIF penalties, label
        fines. Distributor channels have far less of this overhead. Click any channel to see where
        its revenue actually goes — and how it compares to its structural opposite.
      </p>

      <div
        className="ch3-summary"
        onClick={handleChartClick}
        role="presentation"
      >
        <PlotChart
          render={renderSummaryChart}
          ariaLabel="Contribution dollars by channel — horizontal bar chart, click to expand waterfall"
        />
      </div>

      <p className="ch3-footnote prose">
        Contribution dollars = gross revenue minus all trade deductions, slotting, chargebacks,
        freight, variable COGS, promo costs, and dispute overhead. Source: Cinderhaven FY2024–2026 channel P&amp;L.
      </p>

      <DataTable
        caption="Contribution dollars by channel"
        columns={[
          { key: 'channel', label: 'Channel', format: (v) => displayName(v as string) },
          { key: 'contribution_dollars', label: 'Contribution Dollars', format: (v) => formatDollars(v as number) },
        ]}
        data={sortedByContribution as Record<string, unknown>[]}
      />

      {showWaterfall && (
        <div className="ch3-waterfall-section" data-testid="waterfall-section">
          <h3 className="ch3-waterfall-heading">
            {showSideBySide && comparisonChannel
              ? `Deduction Structure: ${displayName(selected)} vs ${displayName(comparisonChannel)}`
              : `Deduction Structure: ${displayName(selected)}`}
          </h3>

          <div className={showSideBySide ? 'ch3-waterfall-grid' : undefined}>
            <WaterfallChart
              title={displayName(selected)}
              steps={getDeductionSteps(selected)}
              ariaLabel={`Waterfall deduction chart for ${displayName(selected)}`}
            />

            {showSideBySide && comparisonChannel && (
              <WaterfallChart
                title={displayName(comparisonChannel)}
                steps={getDeductionSteps(comparisonChannel)}
                ariaLabel={`Waterfall deduction chart for ${displayName(comparisonChannel)}`}
              />
            )}
          </div>

          <DataTable
            caption={`Deduction waterfall: ${displayName(selected)}`}
            columns={[
              { key: 'label', label: 'Line Item' },
              { key: 'value', label: 'Amount', format: (v) => v === 0 ? '—' : formatDollars(v as number) },
              { key: 'cumulative', label: 'Running Total', format: (v) => formatDollars(v as number) },
            ]}
            data={getDeductionSteps(selected) as Record<string, unknown>[]}
          />

          {showSideBySide && comparisonChannel && (
            <DataTable
              caption={`Deduction waterfall: ${displayName(comparisonChannel)}`}
              columns={[
                { key: 'label', label: 'Line Item' },
                { key: 'value', label: 'Amount', format: (v) => v === 0 ? '—' : formatDollars(v as number) },
                { key: 'cumulative', label: 'Running Total', format: (v) => formatDollars(v as number) },
              ]}
              data={getDeductionSteps(comparisonChannel) as Record<string, unknown>[]}
            />
          )}
        </div>
      )}
    </div>
  )
}
