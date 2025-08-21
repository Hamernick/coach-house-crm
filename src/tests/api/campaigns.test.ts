import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST as send } from '@/app/api/campaigns/[id]/send/route'
import { db, Campaign } from '@/lib/store'
import { getSessionOrg } from '@/lib/auth'

vi.mock('@/lib/auth', () => ({ getSessionOrg: vi.fn() }))

beforeEach(() => {
  db.campaigns.clear()
  vi.mocked(getSessionOrg).mockReset()
})

describe('campaign schedule guard', () => {
  it('schedules future send as SCHEDULED', async () => {
    const campaign: Campaign = {
      id: 'c1',
      orgId: 'org1',
      name: 'Camp',
      contentJson: {},
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    db.campaigns.set(campaign.id, campaign)
    vi.mocked(getSessionOrg).mockResolvedValue('org1')

    const future = new Date(Date.now() + 3600_000).toISOString()
    const req = new NextRequest('http://test.com', {
      method: 'POST',
      body: JSON.stringify({ sendAt: future }),
    })
    const res = await send(req, { params: { id: 'c1' } })
    const data = await res.json()
    expect(data.campaign.status).toBe('SCHEDULED')
  })

  it('sends immediately when past date', async () => {
    const campaign: Campaign = {
      id: 'c2',
      orgId: 'org1',
      name: 'Camp',
      contentJson: {},
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    db.campaigns.set(campaign.id, campaign)
    vi.mocked(getSessionOrg).mockResolvedValue('org1')

    const past = new Date(Date.now() - 3600_000).toISOString()
    const req = new NextRequest('http://test.com', {
      method: 'POST',
      body: JSON.stringify({ sendAt: past }),
    })
    const res = await send(req, { params: { id: 'c2' } })
    const data = await res.json()
    expect(data.campaign.status).toBe('SENT')
  })
})
