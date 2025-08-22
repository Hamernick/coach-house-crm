import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { randomUUID } from 'node:crypto'

const segments = new Map<string, any>()
const campaigns = new Map<string, any>()
const sequences = new Map<string, any>()
const autosaves = new Map<string, any>()

function findMany(store: Map<string, any>, { where = {}, orderBy, take }: any) {
  let items = Array.from(store.values())
  if (where.orgId) items = items.filter((i) => i.orgId === where.orgId)
  if (where.createdAt?.gt)
    items = items.filter((i) => i.createdAt > where.createdAt.gt)
  if (orderBy?.createdAt === 'asc')
    items.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  if (take) items = items.slice(0, take)
  return items
}

function create(store: Map<string, any>, { data }: any) {
  const now = new Date().toISOString()
  const id = data.id || randomUUID()
  const item = { id, createdAt: now, updatedAt: now, ...data }
  store.set(id, item)
  return item
}

function findFirst(store: Map<string, any>, { where }: any) {
  const item = store.get(where.id)
  if (!item) return null
  if (where.orgId && item.orgId !== where.orgId) return null
  return item
}

function update(store: Map<string, any>, { where, data }: any) {
  const item = findFirst(store, { where })
  if (!item) throw new Error('Not found')
  const updated = { ...item, ...data, updatedAt: new Date().toISOString() }
  store.set(item.id, updated)
  return updated
}

function del(store: Map<string, any>, { where }: any) {
  const item = findFirst(store, { where })
  if (!item) throw new Error('Not found')
  store.delete(item.id)
  return item
}

const prisma = {
  segment: {
    findMany: (args: any) => Promise.resolve(findMany(segments, args)),
    create: (args: any) => Promise.resolve(create(segments, args)),
    findFirst: (args: any) => Promise.resolve(findFirst(segments, args)),
    update: (args: any) => Promise.resolve(update(segments, args)),
    delete: (args: any) => Promise.resolve(del(segments, args)),
  },
  campaign: {
    findMany: (args: any) => Promise.resolve(findMany(campaigns, args)),
    create: (args: any) => Promise.resolve(create(campaigns, args)),
    findFirst: (args: any) => Promise.resolve(findFirst(campaigns, args)),
    update: (args: any) => Promise.resolve(update(campaigns, args)),
    delete: (args: any) => Promise.resolve(del(campaigns, args)),
  },
  sequence: {
    findMany: (args: any) => Promise.resolve(findMany(sequences, args)),
    create: (args: any) => Promise.resolve(create(sequences, args)),
    findFirst: (args: any) => Promise.resolve(findFirst(sequences, args)),
    update: (args: any) => Promise.resolve(update(sequences, args)),
    delete: (args: any) => Promise.resolve(del(sequences, args)),
  },
  autosave: {
    findFirst: ({ where }: any) => {
      const key = `${where.orgId}:${where.key}`
      return Promise.resolve(autosaves.get(key) ?? null)
    },
    upsert: ({ where, create: dataCreate, update: dataUpdate }: any) => {
      const { orgId, key } = where.orgId_key
      const composite = `${orgId}:${key}`
      const now = new Date().toISOString()
      let entry = autosaves.get(composite)
      if (!entry) {
        entry = { id: randomUUID(), orgId, key, data: dataCreate.data, updatedAt: now }
      } else {
        entry = { ...entry, ...dataUpdate, updatedAt: now }
      }
      autosaves.set(composite, entry)
      return Promise.resolve(entry)
    },
  },
}

export function reset() {
  segments.clear()
  campaigns.clear()
  sequences.clear()
  autosaves.clear()
}

vi.mock('@/lib/prisma', () => ({ __esModule: true, default: prisma, reset }))
