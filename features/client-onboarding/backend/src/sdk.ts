import {
  createClient,
  DashboardDataApi,
} from '@fusebase/dashboard-service-sdk'
import {
  createClient as createGateClient,
  OrgUsersApi,
  EmailsApi,
} from '@fusebase/fusebase-gate-sdk'

const DASHBOARD_BASE_URL = 'https://app-api.thefusebase.com/v4/api/proxy/dashboard-service/v1'
const GATE_BASE_URL = 'https://app-api.thefusebase.com/v4/api/proxy/gate-service/v1'

export function createDashboardDataApi(featureToken: string): DashboardDataApi {
  const client = createClient({
    baseUrl: DASHBOARD_BASE_URL,
    defaultHeaders: { 'x-app-feature-token': featureToken },
  })
  return new DashboardDataApi(client)
}

export function createOrgUsersApi(featureToken: string): OrgUsersApi {
  const client = createGateClient({
    baseUrl: GATE_BASE_URL,
    defaultHeaders: { 'x-app-feature-token': featureToken },
  })
  return new OrgUsersApi(client)
}

export function createEmailsApi(featureToken: string): EmailsApi {
  const client = createGateClient({
    baseUrl: GATE_BASE_URL,
    defaultHeaders: { 'x-app-feature-token': featureToken },
  })
  return new EmailsApi(client)
}

// Constants from MCP discovery
export const ONBOARDING_DASHBOARD_ID = 'bf2ac31b-ec51-4a65-8fa2-266c50fcabba'
export const ONBOARDING_VIEW_ID = '678ac307-0b7a-4548-8ddf-38e649899912'
export const COMPANIES_DASHBOARD_ID = 'a938ccbc-afc9-4405-b96e-ad399448cdb8'
export const COMPANIES_VIEW_ID = '6fae5ced-b4a8-4344-8013-056708f40b73'
export const ORG_ID = 'u263ad'

// Column keys
export const COL = {
  companyName: 'c6v6hKCB',
  contactName: 'Q5hvVkb7',
  contactEmail: 'dOirEf16',
  contactPhone: 'Ksj9mlnW',
  contactRole: 'jnodX2rk',
  businessAddress: '6c3w2gDl',
  industry: '0LQD4zIo',
  websiteUrl: 'uIU4_lFQ',
  servicesOffered: 'E6KNUQui',
  topServices: 'u_2GGQ46',
  primaryGoal: 'w6-ooqy7',
  monthlyBudget: 'hbcvT2fT',
  serviceArea: 'FJmff8VA',
  idealCustomer: 'Yx2vTPJ7',
  competitors: 'gQ6yhN9m',
  differentiator: 'AMy7Ogcg',
  gbpUrl: 'DcVaUJDO',
  facebookUrl: '1rh86LZy',
  instagramHandle: 'Q6zDCHtK',
  tiktokHandle: 'K5SKXQJ_',
  linkedinUrl: 'GmZ5HhcY',
  youtubeUrl: 'Wng9aOcU',
  otherSocialLinks: 'Xff-VUw_',
  logo: 'OJZC4zGF',
  workPhotos: '7BbZc_03',
  specialOffers: '-fQsRckQ',
  contactMethod: '7T_pDpvY',
  bestTime: 'TuXfw6Gg',
  additionalNotes: 'xXEsVlH_',
  emergencyService: 'EWPwIWgY',
  freeEstimates: '1oN4hQ3k',
  employeeRange: 'A6g8pkiy',
  status: 'z_E9ztPm',
  workspaceId: 'G8mvCGY8',
  submittedAt: 'Sc7Ak4qx',
} as const

export const STATUS_LABELS = {
  new: 'nVDS-0di',
  underReview: 'RdRZQIw0',
  workspaceCreated: 'eTQQCR9R',
  active: 'vSfoup5k',
  rejected: 'zh1mZXOG',
} as const

export const GOAL_LABELS: Record<string, string> = {
  'More phone calls': 'lEMPfDRJ',
  'More form submissions': 'EXhZixp3',
  'More walk-in traffic': 'MmEkJqKp',
  'More booked appointments': 'vJpqbUms',
  'Brand awareness': '84Oov_Kp',
}

export const BUDGET_LABELS: Record<string, string> = {
  '$500-$1,000/mo': '0VgKscCV',
  '$1,000-$2,500/mo': 'fkY3nlAN',
  '$2,500-$5,000/mo': 'v_Kp-UsH',
  '$5,000-$10,000/mo': 'Q-BoOUQ1',
  '$10,000+/mo': 'KTtVSBH3',
  'Help me figure it out': '1a7f9V9t',
}

// Companies DB column keys (from earlier MCP discovery)
export const COMPANIES_COL = {
  name: 'PuQq_YCO',
  url: '39xRSNSJ',
  description: 'XiLMzAMI',
  categories: 'c7vn_a3C',
  employeeRange: 'FFamTW8m',
} as const
