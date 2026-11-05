import * as Plot from '@observablehq/plot'
import scenariosData from '../../data/scenarios.json'
import { PlotChart } from '../../components/PlotChart'
import { DataTable } from '../../components/DataTable'
import { formatDollars } from '../../utils/format'
import { displayLabel, relabelText } from '../../utils/displayLabel'
import './Chapter5.css'

const { capital_allocation } = scenariosData

const scenarioBars = [
  {
    scenario: capital_allocation.retailer.label,
    incremental_contribution: capital_allocation.retailer.incremental_contribution,
    color: '#b5e4d8',  // HK-85, lightest teal
    assumption: relabelText(capital_allocation.retailer.assumption),
  },
  {
    scenario: capital_allocation.distributor.label,
    incremental_contribution: capital_allocation.distributor.incremental_contribution,
    color: '#063d32',  // HK-5, darkest teal
    assumption: relabelText(capital_allocation.distributor.assumption),
  },
]

export function Chapter5() {
  const renderChart = (_container: HTMLDivElement) => {
    return Plot.plot({
      marks: [
        Plot.barX(scenarioBars, {
          x: 'incremental_contribution',
          y: 'scenario',
          fill: 'color',
          sort: { y: 'x' },  // ascending: retail shorter, distributor taller
          tip: {
            format: {
              x: (v: number) => formatDollars(v),
              y: String,
            },
          },
        }),
        Plot.text(scenarioBars, {
          x: 'incremental_contribution',
          y: 'scenario',
          text: (d) => formatDollars(d.incremental_contribution),
          dx: 8,
          textAnchor: 'start',
          fontSize: 13,
          fontWeight: '600',
          fill: 'var(--color-text-primary)',
        }),
        Plot.ruleX([0]),
      ],
      x: {
        label: 'Projected incremental contribution',
        tickFormat: (v: number) => formatDollars(v),
      },
      y: { label: null },
      marginLeft: 210,
      marginRight: 100,
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: '13px',
        background: 'transparent',
      },
    })
  }

  const distributorWins =
    capital_allocation.distributor.incremental_contribution >
    capital_allocation.retailer.incremental_contribution

  const deltaLabel = distributorWins
    ? `Distribution growth generates ${formatDollars(capital_allocation.delta)} more contribution per $1M of incremental revenue — ${(capital_allocation.delta_pct * 100).toFixed(1)}% more per revenue dollar`
    : `Retail expansion generates ${formatDollars(Math.abs(capital_allocation.delta))} more contribution per $1M of incremental revenue than distribution`

  return (
    <div className="ch5">
      <p className="ch5-framing prose">
        The question is not whether to be in distribution. It is which channel turns a dollar of
        revenue into more contribution. At Cinderhaven's current margin structure, retail wins — it
        keeps roughly five more cents of every revenue dollar than distribution does.
      </p>

      <div className="ch5-chart-container">
        <PlotChart
          render={renderChart}
          ariaLabel="Bar chart comparing incremental contribution from $1M of incremental revenue in retail expansion vs distribution growth"
        />
      </div>

      <div className="ch5-delta-callout">
        <p className="ch5-delta-text">{deltaLabel}</p>
        <p className="ch5-delta-assumption">
          Retail assumption: {scenarioBars[0].assumption}.
        </p>
        <p className="ch5-delta-assumption">
          Distribution assumption: {scenarioBars[1].assumption}.
        </p>
      </div>

      <div className="ch5-closing">
        <p className="ch5-closing-prose prose">
          Every brand at this stage faces the same decision. Distribution looks low-friction — fewer
          deductions, no slotting fees, no compliance fines. But distributors buy at lower wholesale
          prices, and COGS eats a larger share of every dollar. Retail, net of all deductions, returns
          roughly 51 cents of contribution per revenue dollar. Distribution returns 46 cents.
        </p>
        <p className="ch5-closing-prose prose">
          The implication is not to exit distribution. It is to stop treating distribution growth as
          the default answer to every investment decision. The brands that invest deliberately in
          retail — and manage the compliance cost — capture margin that lower-touch channels cannot match.
        </p>
      </div>

      <p className="ch5-footnote prose">
        Scenario projections apply current blended contribution margin rates to $1M of incremental
        revenue — a per-revenue-dollar comparison, not a return on invested capital. These are
        average channel margins; as Chapter 4 shows, the marginal contribution of a single channel
        erodes as its own volume scales, so these rates describe current channel economics, not the
        yield on the next dollar forced through a channel already at scale. Retail scenario blends
        the {['Walmart', 'Kroger', 'Whole Foods', 'Sprouts', 'Costco'].map(displayLabel).join(', ')}, and
        Regional Group. Distribution scenario blends {['UNFI', 'KeHE'].map(displayLabel).join(', ')}, and {displayLabel('DPI Northwest')}. Figures are based on Cinderhaven's FY2024–2026 channel
        P&amp;L data.
      </p>

      {/* Screen-reader data table */}
      <DataTable
        caption="Capital allocation scenarios — projected incremental contribution from $1M of incremental revenue"
        columns={[
          { key: 'scenario', label: 'Scenario' },
          { key: 'incremental_contribution', label: 'Projected Incremental Contribution', format: (v) => formatDollars(v as number) },
          { key: 'assumption', label: 'Key Assumption' },
        ]}
        data={scenarioBars as Record<string, unknown>[]}
      />
    </div>
  )
}
