import * as Plot from '@observablehq/plot'
import scenariosData from '../../data/scenarios.json'
import { PlotChart } from '../../components/PlotChart'
import { DataTable } from '../../components/DataTable'
import { formatDollars, formatUnits } from '../../utils/format'
import { displayLabel, displayName } from '../../utils/displayLabel'
import './Chapter4.css'

const { walmart_volume_curve, walmart_inflection_volume } = scenariosData

export function Chapter4() {
  const renderChart = (_container: HTMLDivElement) => {
    return Plot.plot({
      marks: [
        // Main declining line
        Plot.lineY(walmart_volume_curve, {
          x: 'volume_units',
          y: 'marginal_contribution_per_unit',
          stroke: 'var(--color-navy)',
          strokeWidth: 2.5,
          curve: 'monotone-x',
        }),
        // Dots at each data point
        Plot.dot(walmart_volume_curve, {
          x: 'volume_units',
          y: 'marginal_contribution_per_unit',
          fill: 'var(--color-navy)',
          r: 4,
        }),
        // Zero line (break-even reference)
        Plot.ruleY([0], {
          stroke: 'var(--color-reference)',
          strokeDasharray: '4 3',
          strokeWidth: 1.5,
        }),
        // Inflection point reference line
        Plot.ruleX([walmart_inflection_volume], {
          stroke: 'var(--color-red)',
          strokeDasharray: '4 3',
          strokeWidth: 1.5,
        }),
        // Hover tooltip
        Plot.tip(walmart_volume_curve, Plot.pointerX({
          x: 'volume_units',
          y: 'marginal_contribution_per_unit',
          title: (d) => `${formatUnits(d.volume_units)} units\n${formatDollars(d.marginal_contribution_per_unit)}/unit`,
        })),
      ],
      x: {
        label: `Annual ${displayLabel('Walmart')} volume (units shipped)`,
        tickFormat: (v: number) => formatUnits(v),
      },
      y: {
        label: 'Marginal contribution per unit ($)',
        tickFormat: (v: number) => formatDollars(v),
      },
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: '13px',
        background: 'transparent',
      },
      marginLeft: 80,
      height: 420,
    })
  }

  return (
    <div className="ch4">
      <p className="ch4-framing prose">
        More {displayLabel('Walmart')} volume does not mean more contribution. Trade spend and chargebacks scale faster than revenue. Cinderhaven ships roughly 934,000 units a year through the {displayLabel('Walmart')} today (2.8 million across the three-year window), and each unit earns about $1.86 in contribution. But every additional unit earns a little less than the last: hold COGS steady and let promotional funding escalate with volume, and contribution per unit crosses zero near 5.3 million units a year, nearly six times current volume. The {displayLabel('Walmart')}'s velocity requirements push brands up that curve year over year.
      </p>
      <div className="ch4-chart-container">
        <PlotChart
          render={renderChart}
          ariaLabel={`Line chart showing ${displayLabel('Walmart')} marginal contribution per unit declining as volume increases`}
        />
      </div>
      <div className="ch4-annotation">
        <span className="ch4-annotation__line" /> Scale trap threshold: ~{formatUnits(walmart_inflection_volume)} units
      </div>
      <p className="ch4-footnote prose">
        Anchored to Cinderhaven's observed FY2024–2026 economics with the {displayLabel('Walmart')}: 2.8M units at a $3.85 realized wholesale price and $1.86 contribution per unit. Volumes above current are modeled — trade-deduction rates escalate with volume at an assumed 1.8× promotional elasticity, while COGS and fixed costs are held constant per unit. Marginal contribution includes trade spend, chargebacks, slotting amortization, and swell at the applicable volume tier.
      </p>

      {/* Screen-reader data table */}
      <DataTable
        caption={`${displayName('Walmart')} marginal contribution per unit at each volume tier`}
        columns={[
          { key: 'volume_units', label: 'Volume (units)', format: (v) => formatUnits(v as number) },
          { key: 'marginal_contribution_per_unit', label: 'Marginal Contribution per Unit ($)', format: (v) => formatDollars(v as number) },
        ]}
        data={walmart_volume_curve as Record<string, unknown>[]}
      />
    </div>
  )
}
