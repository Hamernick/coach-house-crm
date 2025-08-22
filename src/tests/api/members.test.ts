import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST, DELETE } from '@/app/api/segments/[id]/members/route'
import prisma, { reset } from '@/lib/prisma'
import { getSessionOrg } from '@/lib/auth'

vi.mock('@/lib/auth', () => ({ getSessionOrg: vi.fn() }))

beforeEach(() => {
  reset()
  vi.mocked(getSessionOrg).mockReset()
})

describe('segment members API', () => {
  it('adds and removes members', async () => {
    await (prisma as any).segment.create({
      data: {
        id: 's1',
        orgId: 'org1',
        name: 'Seg',
        dslJson: {},
        members: [],
      },
    })
    vi.mocked(getSessionOrg).mockResolvedValue('org1')

    const addReq = new NextRequest('http://test.com', {
      method: 'POST',
      body: JSON.stringify({ contactIds: ['a', 'b'] }),
    })
    const addRes = await POST(addReq, { params: { id: 's1' } })
    expect(addRes.status).toBe(200)
    const addData = await addRes.json()
    expect(addData.members).toEqual(['a', 'b'])

    const delReq = new NextRequest('http://test.com', {
      method: 'DELETE',
      body: JSON.stringify({ contactIds: ['a'] }),
    })
    const delRes = await DELETE(delReq, { params: { id: 's1' } })
    expect(delRes.status).toBe(200)
    const delData = await delRes.json()
    expect(delData.members).toEqual(['b'])
  })
})
