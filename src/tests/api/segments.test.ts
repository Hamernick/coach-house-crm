import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/segments/route'
import prisma, { reset } from '@/lib/prisma'
import { getSessionOrg } from '@/lib/auth'

vi.mock('@/lib/auth', () => ({ getSessionOrg: vi.fn() }))

beforeEach(() => {
  reset()
  vi.mocked(getSessionOrg).mockReset()
})

describe('segments API', () => {
  it('rejects unauthorized access', async () => {
    vi.mocked(getSessionOrg).mockResolvedValue(null)
    const req = new NextRequest('http://test.com/api/segments')
    const res = await GET(req)
    expect(res.status).toBe(401)
  })

  it('creates a segment', async () => {
    vi.mocked(getSessionOrg).mockResolvedValue('org1')
    const body = { name: 'Test', dslJson: {} }
    const req = new NextRequest('http://test.com/api/segments', {
      method: 'POST',
      body: JSON.stringify(body),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.segment.name).toBe('Test')
    const segments = await (prisma as any).segment.findMany({ where: { orgId: 'org1' } })
    expect(segments.length).toBe(1)
  })
})
