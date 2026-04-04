import { useState } from 'react'
import { OnboardingFormData } from '../../lib/types'
import { INDUSTRIES } from '../../lib/constants'
import { cn } from '../../lib/utils'

interface Props {
  data: OnboardingFormData
  onChange: (partial: Partial<OnboardingFormData>) => void
  onNext: () => void
}

export default function Step1Business({ data, onChange, onNext }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!data.companyName.trim()) e.companyName = 'We need your business name to get started.'
    if (!data.contactName.trim()) e.contactName = 'Please enter your name.'
    if (!data.contactRole) e.contactRole = 'Please select your role.'
    if (!data.contactPhone.trim()) e.contactPhone = 'We need a phone number for your ads and call tracking.'
    if (!data.contactEmail.trim() || !data.contactEmail.includes('@')) e.contactEmail = "We'll send your reports here — please double-check this."
    if (!data.businessAddress.trim()) e.businessAddress = 'We use this to target customers near you.'
    if (!data.industry) e.industry = 'Please select your industry.'
    if (data.industry === 'Other' && !data.customIndustry.trim()) e.customIndustry = 'Tell us your industry.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (validate()) onNext()
  }

  const roles = ['Owner', 'General Manager', 'Marketing Manager', 'Office Manager', 'Other']

  return (
    <div>
      <h2 className="text-2xl font-bold">First, Tell Us About Your Business</h2>
      <p className="text-muted-foreground mt-1">
        The basics help us understand who you are and where you operate so we can hit the ground running.
      </p>

      <div className="mt-6 space-y-5">
        <Field label="Business Name" required error={errors.companyName}>
          <input
            type="text"
            placeholder="e.g., Smith's HVAC Solutions"
            value={data.companyName}
            onChange={(e) => onChange({ companyName: e.target.value })}
            className={inputClass(errors.companyName)}
          />
        </Field>

        <Field label="Your Name" required error={errors.contactName}>
          <input
            type="text"
            placeholder="Your full name"
            value={data.contactName}
            onChange={(e) => onChange({ contactName: e.target.value })}
            className={inputClass(errors.contactName)}
          />
        </Field>

        <Field label="Your Role" required error={errors.contactRole}>
          <select
            value={data.contactRole}
            onChange={(e) => onChange({ contactRole: e.target.value })}
            className={inputClass(errors.contactRole)}
          >
            <option value="">Select your role</option>
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </Field>

        <Field label="Business Phone" required error={errors.contactPhone} hint="This is the number customers will call. We'll set up call tracking so you see exactly which calls come from ads.">
          <input
            type="tel"
            inputMode="tel"
            placeholder="(555) 123-4567"
            value={data.contactPhone}
            onChange={(e) => onChange({ contactPhone: e.target.value })}
            className={inputClass(errors.contactPhone)}
          />
        </Field>

        <Field label="Business Email" required error={errors.contactEmail}>
          <input
            type="email"
            inputMode="email"
            placeholder="you@yourbusiness.com"
            value={data.contactEmail}
            onChange={(e) => onChange({ contactEmail: e.target.value })}
            className={inputClass(errors.contactEmail)}
          />
        </Field>

        <Field label="Business Address" required error={errors.businessAddress} hint="We use this to target customers near you. If you serve a wider area, we'll ask about that next.">
          <input
            type="text"
            placeholder="Start typing your business address..."
            value={data.businessAddress}
            onChange={(e) => onChange({ businessAddress: e.target.value })}
            className={inputClass(errors.businessAddress)}
          />
        </Field>

        <Field label="Industry / Business Type" required error={errors.industry}>
          <select
            value={data.industry}
            onChange={(e) => onChange({ industry: e.target.value })}
            className={inputClass(errors.industry)}
          >
            <option value="">Select your industry</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </Field>

        {data.industry === 'Other' && (
          <Field label="Tell us your industry" required error={errors.customIndustry}>
            <input
              type="text"
              placeholder="e.g., Pool installation, Pet grooming"
              value={data.customIndustry}
              onChange={(e) => onChange({ customIndustry: e.target.value })}
              className={inputClass(errors.customIndustry)}
            />
          </Field>
        )}
      </div>

      <div className="mt-8">
        <button onClick={handleNext} className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
          Next: Services & Goals →
        </button>
      </div>
    </div>
  )
}

function Field({ label, required, error, hint, children }: {
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}

function inputClass(error?: string) {
  return cn(
    'w-full px-3 py-2.5 rounded-lg border text-sm transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
    error ? 'border-destructive bg-red-50/50' : 'border-border bg-white'
  )
}
