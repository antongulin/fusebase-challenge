import { useState } from 'react'
import { OnboardingFormData } from '../../lib/types'
import { cn } from '../../lib/utils'

interface Props {
  data: OnboardingFormData
  onChange: (partial: Partial<OnboardingFormData>) => void
  onNext: () => void
  onPrev: () => void
}

const AREA_TYPES = [
  'I serve customers at my location',
  'I go to customers (mobile/on-site)',
  'Both',
]

export default function Step3Market({ data, onChange, onNext, onPrev }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!data.serviceAreaType) e.serviceAreaType = 'Please select how you serve customers.'
    if (!data.differentiator.trim()) e.differentiator = 'This helps us write ad copy that stands out.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (validate()) onNext()
  }

  const showRadius = data.serviceAreaType !== 'I serve customers at my location' && data.serviceAreaType !== ''

  return (
    <div>
      <h2 className="text-2xl font-bold">Who Are We Reaching?</h2>
      <p className="text-muted-foreground mt-1">
        The more we know about your ideal customers and your local market, the more precisely we can target.
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2">
            How do you serve customers? <span className="text-destructive">*</span>
          </label>
          <div className="space-y-2">
            {AREA_TYPES.map((type) => (
              <label
                key={type}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all',
                  data.serviceAreaType === type
                    ? 'bg-primary/5 border-primary'
                    : 'border-border hover:border-primary/30'
                )}
              >
                <input
                  type="radio"
                  name="serviceAreaType"
                  checked={data.serviceAreaType === type}
                  onChange={() => onChange({ serviceAreaType: type })}
                  className="accent-primary"
                />
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
          {errors.serviceAreaType && <p className="mt-1 text-xs text-destructive">{errors.serviceAreaType}</p>}
        </div>

        {showRadius && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Service Area Radius: {data.serviceAreaRadius} miles
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={data.serviceAreaRadius}
              onChange={(e) => onChange({ serviceAreaRadius: Number(e.target.value) })}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5 miles</span>
              <span>50 miles</span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1.5">Specific Cities or Zip Codes</label>
          <input
            type="text"
            placeholder="Type cities or zip codes, separated by commas"
            value={data.specificAreas}
            onChange={(e) => onChange({ specificAreas: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Describe Your Ideal Customer</label>
          <textarea
            placeholder="e.g., Homeowners 30-60, household income $80K+, within 25 miles of our shop"
            value={data.idealCustomer}
            onChange={(e) => onChange({ idealCustomer: e.target.value })}
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Top 2-3 Competitors</label>
          <textarea
            placeholder="Who are you competing against locally?"
            value={data.competitors}
            onChange={(e) => onChange({ competitors: e.target.value })}
            rows={2}
            className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            What Makes Customers Choose You? <span className="text-destructive">*</span>
          </label>
          <textarea
            placeholder="What do customers say they love about your business?"
            value={data.differentiator}
            onChange={(e) => onChange({ differentiator: e.target.value })}
            rows={3}
            className={cn(
              'w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none',
              errors.differentiator ? 'border-destructive bg-red-50/50' : 'border-border'
            )}
          />
          {errors.differentiator && <p className="mt-1 text-xs text-destructive">{errors.differentiator}</p>}
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button onClick={onPrev} className="px-6 py-3 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
          ← Back
        </button>
        <button onClick={handleNext} className="flex-1 sm:flex-none px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
          Next: Brand & Presence →
        </button>
      </div>
    </div>
  )
}
