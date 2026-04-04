// Discovered via MCP — do not hardcode elsewhere
export const ONBOARDING_DASHBOARD_ID = 'bf2ac31b-ec51-4a65-8fa2-266c50fcabba'
export const ONBOARDING_VIEW_ID = '678ac307-0b7a-4548-8ddf-38e649899912'

export const COMPANIES_DASHBOARD_ID = 'a938ccbc-afc9-4405-b96e-ad399448cdb8'
export const COMPANIES_VIEW_ID = '6fae5ced-b4a8-4344-8013-056708f40b73'

export const ORG_ID = 'u263ad'
export const FUSEBASE_HOST = 'thefusebase.com'

// Column keys (from getDashboardView schema)
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

// Label nanoids for Status
export const STATUS_LABELS = {
  new: 'nVDS-0di',
  underReview: 'RdRZQIw0',
  workspaceCreated: 'eTQQCR9R',
  active: 'vSfoup5k',
  rejected: 'zh1mZXOG',
} as const

// Label nanoids for Primary Goal
export const GOAL_LABELS = {
  moreCalls: 'lEMPfDRJ',
  moreForms: 'EXhZixp3',
  moreTraffic: 'MmEkJqKp',
  moreAppointments: 'vJpqbUms',
  brandAwareness: '84Oov_Kp',
} as const

// Label nanoids for Monthly Budget
export const BUDGET_LABELS = {
  '$500-$1,000/mo': '0VgKscCV',
  '$1,000-$2,500/mo': 'fkY3nlAN',
  '$2,500-$5,000/mo': 'v_Kp-UsH',
  '$5,000-$10,000/mo': 'Q-BoOUQ1',
  '$10,000+/mo': 'KTtVSBH3',
  'Help me figure it out': '1a7f9V9t',
} as const

// Pre-populated services by industry
export const INDUSTRY_SERVICES: Record<string, string[]> = {
  'HVAC': ['AC Repair', 'AC Installation', 'Heating Repair', 'Furnace Installation', 'Duct Cleaning', 'Maintenance Plans', 'Heat Pump', 'Mini Split'],
  'Plumbing': ['Drain Cleaning', 'Pipe Repair', 'Water Heater', 'Leak Detection', 'Sewer Line', 'Fixture Installation', 'Emergency Plumbing'],
  'Auto Body & Collision': ['Collision Repair', 'Dent Removal (PDR)', 'Paint Services', 'Frame Repair', 'Insurance Claims', 'Bumper Repair', 'Scratch Repair'],
  'Aesthetics & Med Spa': ['Botox', 'Fillers', 'Laser Hair Removal', 'Chemical Peels', 'Microneedling', 'Facials', 'Body Contouring', 'IV Therapy'],
  'Cleaning (Residential)': ['Deep Clean', 'Regular Maintenance', 'Move-In/Move-Out', 'Post-Construction', 'Carpet Cleaning', 'Window Cleaning'],
  'Cleaning (Commercial)': ['Office Cleaning', 'Janitorial', 'Floor Care', 'Window Cleaning', 'Post-Construction', 'Disinfection'],
  'Roofing': ['Roof Repair', 'Roof Replacement', 'Inspection', 'Storm Damage', 'Gutter Installation', 'Flat Roof', 'Metal Roof'],
  'Electrical': ['Wiring', 'Panel Upgrade', 'Lighting', 'EV Charger', 'Generator', 'Outlet Repair', 'Emergency Electrical'],
  'Landscaping': ['Lawn Care', 'Landscape Design', 'Tree Service', 'Irrigation', 'Hardscaping', 'Snow Removal'],
  'Dental': ['General Dentistry', 'Cosmetic Dentistry', 'Orthodontics', 'Implants', 'Teeth Whitening', 'Emergency Dental'],
  'Legal Services': ['Personal Injury', 'Family Law', 'Criminal Defense', 'Estate Planning', 'Business Law', 'Immigration'],
}

export const INDUSTRIES = [
  'HVAC',
  'Plumbing',
  'Auto Body & Collision',
  'Aesthetics & Med Spa',
  'Cleaning (Residential)',
  'Cleaning (Commercial)',
  'Roofing',
  'Electrical',
  'Landscaping',
  'Dental',
  'Legal Services',
  'Other',
]
