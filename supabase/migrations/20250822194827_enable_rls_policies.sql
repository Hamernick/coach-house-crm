-- Enable RLS on core tables
ALTER TABLE IF EXISTS "Org" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Membership" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Contact" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Segment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "SegmentMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Campaign" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Sequence" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "SequenceStep" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "EmailTemplate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "EmailTemplateSnapshot" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "EmailCampaign" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "EmailMessage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "EmailAsset" ENABLE ROW LEVEL SECURITY;

-- Membership policies: allow users to read and self-signup their own memberships
CREATE POLICY "select_own_membership"
  ON "Membership"
  FOR SELECT
  USING ("user_id" = auth.uid());

CREATE POLICY "insert_own_membership"
  ON "Membership"
  FOR INSERT
  WITH CHECK ("user_id" = auth.uid());

-- Org table policies
CREATE POLICY "org_members_select_orgs"
  ON "Org"
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM "Membership"
    WHERE "Membership"."org_id" = "Org"."id"
      AND "Membership"."user_id" = auth.uid()
  ));

CREATE POLICY "org_members_insert_orgs"
  ON "Org"
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM "Membership"
    WHERE "Membership"."org_id" = "Org"."id"
      AND "Membership"."user_id" = auth.uid()
  ));

CREATE POLICY "org_admins_update_orgs"
  ON "Org"
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM "Membership"
    WHERE "Membership"."org_id" = "Org"."id"
      AND "Membership"."user_id" = auth.uid()
      AND "Membership"."role" IN ('ADMIN','OWNER')
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM "Membership"
    WHERE "Membership"."org_id" = "Org"."id"
      AND "Membership"."user_id" = auth.uid()
      AND "Membership"."role" IN ('ADMIN','OWNER')
  ));

CREATE POLICY "org_admins_delete_orgs"
  ON "Org"
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM "Membership"
    WHERE "Membership"."org_id" = "Org"."id"
      AND "Membership"."user_id" = auth.uid()
      AND "Membership"."role" IN ('ADMIN','OWNER')
  ));

-- Helper macro to create standard org policies
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'Contact',
    'Segment',
    'SegmentMember',
    'Campaign',
    'Sequence',
    'SequenceStep',
    'EmailTemplate',
    'EmailTemplateSnapshot',
    'EmailCampaign',
    'EmailMessage',
    'EmailAsset'
  ]) LOOP
    EXECUTE format('CREATE POLICY %I ON %I FOR SELECT USING (EXISTS (SELECT 1 FROM "Membership" m WHERE m."org_id" = %I."org_id" AND m."user_id" = auth.uid()));',
      'org_members_select_' || lower(tbl), tbl, tbl);

    EXECUTE format('CREATE POLICY %I ON %I FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM "Membership" m WHERE m."org_id" = %I."org_id" AND m."user_id" = auth.uid()));',
      'org_members_insert_' || lower(tbl), tbl, tbl);

    EXECUTE format('CREATE POLICY %I ON %I FOR UPDATE USING (EXISTS (SELECT 1 FROM "Membership" m WHERE m."org_id" = %I."org_id" AND m."user_id" = auth.uid() AND m."role" IN (''ADMIN'',''OWNER''))) WITH CHECK (EXISTS (SELECT 1 FROM "Membership" m WHERE m."org_id" = %I."org_id" AND m."user_id" = auth.uid() AND m."role" IN (''ADMIN'',''OWNER'')));',
      'org_admins_update_' || lower(tbl), tbl, tbl, tbl);

    EXECUTE format('CREATE POLICY %I ON %I FOR DELETE USING (EXISTS (SELECT 1 FROM "Membership" m WHERE m."org_id" = %I."org_id" AND m."user_id" = auth.uid() AND m."role" IN (''ADMIN'',''OWNER'')));',
      'org_admins_delete_' || lower(tbl), tbl, tbl);
  END LOOP;
END$$;
