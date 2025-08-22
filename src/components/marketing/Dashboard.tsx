'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetcher } from '@/lib/fetch'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Campaign {
  id: string
  name: string
  status: string
  createdAt: string
}

interface Template {
  id: string
  name: string
  description?: string
}

interface CampaignListResponse {
  campaigns: Campaign[]
}

interface TemplateListResponse {
  templates: Template[]
}

export function Dashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [campaignData, templateData] = await Promise.all([
          fetcher<CampaignListResponse>('/api/campaigns'),
          fetcher<TemplateListResponse>('/api/templates'),
        ])
        setCampaigns(campaignData.campaigns)
        setTemplates(templateData.templates)
      } catch (error) {
        console.error(error)
      } finally {
        setLoaded(true)
      }
    }
    load()
  }, [])

  const total = campaigns.length
  const scheduled = campaigns.filter((c) => c.status === 'scheduled').length
  const sent = campaigns.filter((c) => c.status === 'sent').length

  if (loaded && campaigns.length === 0) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Card data-empty>
          <CardContent className="flex flex-col items-center justify-center gap-4 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              You haven't created any campaigns yet
            </p>
            <Button asChild>
              <Link href="/marketing/campaigns/new">Create campaign</Link>
            </Button>
          </CardContent>
        </Card>
        <Card data-empty>
          <CardContent className="flex flex-col items-center justify-center gap-4 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Need inspiration? Start from a template
            </p>
            <Button asChild>
              <Link href="/marketing/templates">Browse templates</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sent}</div>
          </CardContent>
        </Card>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Recent campaigns</h2>
        <div className="grid gap-4">
          {campaigns.slice(0, 5).map((c) => (
            <Card key={c.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">{c.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground capitalize">
                {c.status.toLowerCase()}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Templates</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {templates.slice(0, 3).map((t) => (
            <Card key={t.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">{t.name}</CardTitle>
              </CardHeader>
              {t.description && (
                <CardContent className="text-sm text-muted-foreground">
                  {t.description}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Dashboard

