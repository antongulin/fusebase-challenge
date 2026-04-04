export interface OnboardingFormData {
  // Step 1: Your Business
  companyName: string
  contactName: string
  contactRole: string
  contactPhone: string
  contactEmail: string
  businessAddress: string
  industry: string
  customIndustry: string

  // Step 2: Services & Goals
  servicesOffered: string[]
  customServices: string[]
  topServices: string[]
  primaryGoal: string
  monthlyBudget: string
  emergencyService: boolean
  freeEstimates: boolean

  // Step 3: Customers & Market
  serviceAreaType: string
  serviceAreaRadius: number
  specificAreas: string
  idealCustomer: string
  competitors: string
  differentiator: string

  // Step 4: Brand & Online Presence
  websiteUrl: string
  hasGbp: string
  gbpUrl: string
  facebookUrl: string
  instagramHandle: string
  tiktokHandle: string
  linkedinUrl: string
  youtubeUrl: string
  otherSocialLinks: string
  specialOffers: string

  // Step 5: Review & Submit
  contactMethod: string[]
  bestTime: string
  additionalNotes: string
  employeeRange: string
}

export const defaultFormData: OnboardingFormData = {
  companyName: '',
  contactName: '',
  contactRole: '',
  contactPhone: '',
  contactEmail: '',
  businessAddress: '',
  industry: '',
  customIndustry: '',
  servicesOffered: [],
  customServices: [],
  topServices: [],
  primaryGoal: '',
  monthlyBudget: '',
  emergencyService: false,
  freeEstimates: false,
  serviceAreaType: '',
  serviceAreaRadius: 15,
  specificAreas: '',
  idealCustomer: '',
  competitors: '',
  differentiator: '',
  websiteUrl: '',
  hasGbp: '',
  gbpUrl: '',
  facebookUrl: '',
  instagramHandle: '',
  tiktokHandle: '',
  linkedinUrl: '',
  youtubeUrl: '',
  otherSocialLinks: '',
  specialOffers: '',
  contactMethod: [],
  bestTime: '',
  additionalNotes: '',
  employeeRange: '',
}

export interface Submission {
  id: string
  companyName: string
  contactName: string
  contactEmail: string
  contactPhone: string
  contactRole: string
  industry: string
  businessAddress: string
  servicesOffered: string
  topServices: string
  primaryGoal: string[]
  monthlyBudget: string[]
  status: string[]
  workspaceId: string
  submittedAt: string
  websiteUrl: { url: string; text: string } | null
  serviceArea: string
  idealCustomer: string
  competitors: string
  differentiator: string
  gbpUrl: { url: string; text: string } | null
  facebookUrl: { url: string; text: string } | null
  instagramHandle: string
  tiktokHandle: string
  linkedinUrl: { url: string; text: string } | null
  youtubeUrl: { url: string; text: string } | null
  otherSocialLinks: string
  specialOffers: string
  contactMethod: string
  bestTime: string
  additionalNotes: string
  emergencyService: boolean
  freeEstimates: boolean
  employeeRange: string
}
