export interface Segment {
  id: string;
  orgId: string;
  name: string;
  dslJson: unknown;
  members: string[];
  createdAt: string;
  updatedAt: string;
}

export type CampaignStatus = "DRAFT" | "SCHEDULED" | "SENT";

export interface Campaign {
  id: string;
  orgId: string;
  name: string;
  contentJson: unknown;
  status: CampaignStatus;
  sendAt?: string;
  segmentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SequenceStep {
  id: string;
  delayHours: number;
  contentJson: unknown;
  order: number;
}

export interface Sequence {
  id: string;
  orgId: string;
  name: string;
  steps: SequenceStep[];
  segmentId?: string;
  createdAt: string;
  updatedAt: string;
}

interface AutosaveEntry {
  key: string;
  data: unknown;
  updatedAt: string;
}

export const db = {
  segments: new Map<string, Segment>(),
  campaigns: new Map<string, Campaign>(),
  sequences: new Map<string, Sequence>(),
  autosave: new Map<string, Map<string, AutosaveEntry>>() /* orgId -> key -> entry */,
};
