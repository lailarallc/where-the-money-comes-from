import { describe, it, expect } from 'vitest'
import { displayLabel, displayName, relabelText } from './displayLabel'

describe('displayLabel', () => {
  it('maps real partner names to the shared public labels', () => {
    expect(displayLabel('Walmart')).toBe('national mass retailer')
    expect(displayLabel('DPI Northwest')).toBe('distributor C')
    expect(displayName('KeHE')).toBe('Distributor B')
  })

  it('passes through names without a label', () => {
    expect(displayName('DTC')).toBe('DTC')
    expect(displayName('Regional Group')).toBe('Regional Group')
  })

  it('relabels every name inside a data-supplied string', () => {
    expect(relabelText('across 3 distributor channels (UNFI, KeHE, DPI Northwest)')).toBe(
      'across 3 distributor channels (distributor A, distributor B, distributor C)'
    )
  })
})
