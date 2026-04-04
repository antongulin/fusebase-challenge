import { useState } from 'react'
import { OnboardingFormData } from '../../lib/types'
import { INDUSTRY_SERVICES } from '../../lib/constants'
import { cn } from '../../lib/utils'

interface Props {
  data: OnboardingFormData
  onChange: (partial: Partial<OnboardingFormData>) => void
  onNext: () => void
  onPrev: () => void
}

const GOALS = [
  { label: 'More phone calls', icon: '📞' },
  { label: 'More form submissions', icon: '📝' },
  { label: 'More walk-in traffic', icon: '🏪' },
  { label: 'More booked appointments', icon: '📅' },
  { label: 'Brand awareness', icon: '📢' },
]

const BUDGETS = [
  '$500-$1,000/mo',
  '$1,000-$2,500/mo',
  '$2,500-$5,000/mo',
  '$5,000-$10,000/mo',
  '$10,000+/mo',
  'Help me figure it out',
]

export default function Step2Services({ data, onChange, onNext, onPrev }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [customService, setCustomService] = useState('')

  const suggestedServices = INDUSTRY_SERVICES[data.industry] || []

  const toggleService = (service: string) => {
    const current = data.servicesOffered
    if (current.includes(service)) {
      onChange({ servicesOffered: current.filter((s) => s !== service) })
    } else {
      onChange({ servicesOffered: [...current, service] })
    }
  }

  const addCustomService = () => {
    if (customService.trim() && !data.customServices.includes(customService.trim())) {
      onChange({ customServices: [...data.customServices, customService.trim()] })
      setCustomService('')
    }
  }

  const removeCustomService = (service: string) => {
    onChange({ customServices: data.customServices.filter((s) => s !== service) })
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (data.servicesOffered.length === 0 && data.customServices.length === 0) {
      e.services = 'Select at least one service so we know what to advertise.'
    }
    if (!data.primaryGoal) e.primaryGoal = 'Pick the one that matters most.'
    if (!data.monthlyBudget) e.monthlyBudget = 'Even a rough range helps us build the right plan.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (validate()) onNext()
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">What Are You Looking to Achieve?</h2>
      <p className="text-muted-foreground mt-1">
        This drives your keyword targeting and determines which campaigns we build first.
      </p>

      <div className="mt-6 space-y-6">
        {/* Services */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Services You Offer <span className="text-destructive">*</span>
          </label>
          <p className="text-xs text-muted-foreground mb-3">Select all that apply. Don't see yours? Type it in below.</p>
          <div className="flex flex-wrap gap-2">
            {suggestedServices.map((service) => (
              <button
                key={service}
                type="button"
                onClick={() => toggleService(service)}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm border transition-all',
                  data.servicesOffered.includes(service)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-white border-border hover:border-primary/50'
                )}
              >
                {service}
              </button>
            ))}
            {data.customServices.map((service) => (
              <button
                key={service}
                type="button"
                onClick={() => removeCustomService(service)}
                className="px-3 py-2 rounded-lg text-sm border bg-primary text-primary-foreground border-primary"
              >
                {service} ×
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              placeholder="Add a custom service..."
              value={customService}
              onChange={(e) => setCustomService(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomService())}
              className="flex-1 px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button type="button" onClick={addCustomService} className="px-4 py-2 bg-muted rounded-lg text-sm font-medium hover:bg-muted/80">
              Add
            </button>
          </div>
          {errors.services && <p className="mt-1 text-xs text-destructive">{errors.services}</p>}
        </div>

        {/* Primary Goal */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Primary Goal <span className="text-destructive">*</span>
          </label>
          <p className="text-xs text-muted-foreground mb-3">If you could only measure one thing, what would it be?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GOALS.map(({ label, icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => onChange({ primaryGoal: label })}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg border text-left text-sm transition-all',
                  data.primaryGoal === label
                    ? 'bg-primary/5 border-primary ring-2 ring-primary/20'
                    : 'bg-white border-border hover:border-primary/50'
                )}
              >
                <span className="text-xl">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
          {errors.primaryGoal && <p className="mt-1 text-xs text-destructive">{errors.primaryGoal}</p>}
        </div>

        {/* Monthly Budget */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Monthly Marketing Budget <span className="text-destructive">*</span>
          </label>
          <p className="text-xs text-muted-foreground mb-3">This includes ad spend + management. We'll show you exactly where every dollar goes.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BUDGETS.map((budget) => (
              <button
                key={budget}
                type="button"
                onClick={() => onChange({ monthlyBudget: budget })}
                className={cn(
                  'px-3 py-2.5 rounded-lg border text-sm transition-all',
                  data.monthlyBudget === budget
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-white border-border hover:border-primary/50'
                )}
              >
                {budget}
              </button>
            ))}
          </div>
          {errors.monthlyBudget && <p className="mt-1 text-xs text-destructive">{errors.monthlyBudget}</p>}
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border cursor-pointer hover:border-primary/30">
            <input
              type="checkbox"
              checked={data.emergencyService}
              onChange={(e) => onChange({ emergencyService: e.target.checked })}
              className="w-4 h-4 accent-primary"
            />
            <div>
              <span className="text-sm font-medium">Emergency / Same-Day Service</span>
              <p className="text-xs text-muted-foreground">These searches convert fast.</p>
            </div>
          </label>
          <label className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border cursor-pointer hover:border-primary/30">
            <input
              type="checkbox"
              checked={data.freeEstimates}
              onChange={(e) => onChange({ freeEstimates: e.target.checked })}
              className="w-4 h-4 accent-primary"
            />
            <div>
              <span className="text-sm font-medium">Free Estimates / Consultations</span>
              <p className="text-xs text-muted-foreground">Top-performing CTA in local ads.</p>
            </div>
          </label>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button onClick={onPrev} className="px-6 py-3 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
          ← Back
        </button>
        <button onClick={handleNext} className="flex-1 sm:flex-none px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
          Next: Your Customers →
        </button>
      </div>
    </div>
  )
}
