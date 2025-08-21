import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/segments/route'
import { db } from '@/lib/store'
import { getSessionOrg } from '@/lib/auth'

vi.mock('@/lib/auth', () => ({ getSessionOrg: vi.fn() }))

beforeEach(() => {
  db.segments.clear()
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
    expect(db.segments.size).toBe(1)
  })
})
