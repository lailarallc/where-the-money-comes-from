import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Chapter3 } from './Chapter3'
import type { UseChannelSelectionReturn } from '../../hooks/useChannelSelection'

function makeSelection(overrides: Partial<UseChannelSelectionReturn> = {}): UseChannelSelectionReturn {
  return {
    selected: null,
    select: () => {},
    clearSelection: () => {},
    getOpacity: () => 1.0,
    ...overrides,
  }
}

describe('Chapter3', () => {
  it('renders the summary bar chart section', () => {
    const { container } = render(<Chapter3 selection={makeSelection()} />)
    expect(container.querySelector('.chapter-3')).toBeTruthy()
    expect(container.querySelector('.ch3-summary')).toBeTruthy()
  })

  it('waterfall section is hidden when no channel is selected', () => {
    const { queryByTestId } = render(
      <Chapter3 selection={makeSelection({ selected: null })} />
    )
    expect(queryByTestId('waterfall-section')).toBeNull()
  })

  it('waterfall section shows when a retail channel is selected', () => {
    const { getByTestId } = render(
      <Chapter3 selection={makeSelection({ selected: 'Walmart', getOpacity: (ch) => ch === 'Walmart' ? 1.0 : 0.25 })} />
    )
    expect(getByTestId('waterfall-section')).toBeTruthy()
  })

  it('shows UNFI waterfall for comparison alongside a retail channel', () => {
    const { getByTestId, getAllByText } = render(
      <Chapter3 selection={makeSelection({ selected: 'Walmart', getOpacity: (ch) => ch === 'Walmart' ? 1.0 : 0.25 })} />
    )
    const section = getByTestId('waterfall-section')
    // Two waterfall chart titles, shown by public label: Walmart and UNFI (distributor comparison)
    const chartTitles = section.querySelectorAll('.waterfall-chart__title')
    const titles = Array.from(chartTitles).map(el => el.textContent)
    expect(titles).toContain('National mass retailer')
    expect(titles).toContain('Distributor A')
    expect(section.textContent).not.toMatch(/Walmart|UNFI/)
    // Suppress unused variable warning
    void getAllByText
  })

  it('shows only DTC waterfall when DTC is the selected channel', () => {
    const { getByTestId } = render(
      <Chapter3 selection={makeSelection({ selected: 'DTC', getOpacity: (ch) => ch === 'DTC' ? 1.0 : 0.25 })} />
    )
    const section = getByTestId('waterfall-section')
    const titles = Array.from(section.querySelectorAll('.waterfall-chart__title')).map(el => el.textContent)
    expect(titles).toContain('DTC')
    expect(titles).not.toContain('National mass retailer')
    expect(titles.length).toBe(1)
  })
})
