import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const saveSchema = z.object({
  contentJson: z.any(),
  html: z.string(),
})

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json().catch(() => null)
  const parsed = saveSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 422 }
    )
  }

  const { contentJson, html } = parsed.data
  const templateId = params.id

  await prisma.emailTemplate.update({
    where: { id: templateId },
    data: { contentJson },
  })

  await prisma.emailTemplateSnapshot.create({
    data: { templateId, html },
  })

  return NextResponse.json({ ok: true })
}
