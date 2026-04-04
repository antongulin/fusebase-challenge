import { useState } from 'react'
import { OnboardingFormData } from '../../lib/types'
import { cn } from '../../lib/utils'
import { Pencil, Loader2 } from 'lucide-react'

interface Props {
  data: OnboardingFormData
  onChange: (partial: Partial<OnboardingFormData>) => void
  onPrev: () => void
  onSubmit: () => void
  submitting: boolean
  error: string
  onEditStep: (step: number) => void
}

const CONTACT_METHODS = ['Email', 'Phone Call', 'Text Message', 'WhatsApp']
const BEST_TIMES = ['Morning (8am-12pm)', 'Afternoon (12pm-5pm)', 'Evening (5pm-8pm)', 'Anytime']

export default function Step5Review({ data, onChange, onPrev, onSubmit, submitting, error, onEditStep }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const toggleContactMethod = (method: string) => {
    const current = data.contactMethod
    if (current.includes(method)) {
      onChange({ contactMethod: current.filter((m) => m !== method) })
    } else {
      onChange({ contactMethod: [...current, method] })
    }
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (data.contactMethod.length === 0) e.contactMethod = 'Please select at least one way to reach you.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (validate()) onSubmit()
  }

  const industry = data.industry === 'Other' ? data.customIndustry : data.industry
  const allServices = [...data.servicesOffered, ...data.customServices]

  return (
    <div>
      <h2 className="text-2xl font-bold">Almost Done — Let's Make Sure Everything Looks Right</h2>
      <p className="text-muted-foreground mt-1">
        Review your info below. Click the pencil icon to edit any section.
      </p>

      <div className="mt-6 space-y-4">
        <ReviewSection title="Business Info" onEdit={() => onEditStep(0)}>
          <ReviewItem label="Business Name" value={data.companyName} />
          <ReviewItem label="Contact" value={`${data.contactName} (${data.contactRole})`} />
          <ReviewItem label="Phone" value={data.contactPhone} />
          <ReviewItem label="Email" value={data.contactEmail} />
          <ReviewItem label="Address" value={data.businessAddress} />
          <ReviewItem label="Industry" value={industry} />
        </ReviewSection>

        <ReviewSection title="Services & Goals" onEdit={() => onEditStep(1)}>
          <ReviewItem label="Services" value={allServices.join(', ')} />
          <ReviewItem label="Goal" value={data.primaryGoal} />
          <ReviewItem label="Budget" value={data.monthlyBudget} />
          {data.emergencyService && <ReviewItem label="Emergency Service" value="Yes" />}
          {data.freeEstimates && <ReviewItem label="Free Estimates" value="Yes" />}
        </ReviewSection>

        <ReviewSection title="Your Customers" onEdit={() => onEditStep(2)}>
          <ReviewItem label="Service Area" value={data.serviceAreaType} />
          {data.differentiator && <ReviewItem label="What sets you apart" value={data.differentiator} />}
          {data.competitors && <ReviewItem label="Competitors" value={data.competitors} />}
        </ReviewSection>

        <ReviewSection title="Brand & Presence" onEdit={() => onEditStep(3)}>
          {data.websiteUrl && <ReviewItem label="Website" value={data.websiteUrl} />}
          {data.hasGbp && <ReviewItem label="Google Business Profile" value={data.hasGbp === 'Yes' ? (data.gbpUrl || 'Yes') : data.hasGbp} />}
          {data.facebookUrl && <ReviewItem label="Facebook" value={data.facebookUrl} />}
          {data.instagramHandle && <ReviewItem label="Instagram" value={`@${data.instagramHandle}`} />}
          {data.tiktokHandle && <ReviewItem label="TikTok" value={`@${data.tiktokHandle}`} />}
          {data.linkedinUrl && <ReviewItem label="LinkedIn" value={data.linkedinUrl} />}
          {data.youtubeUrl && <ReviewItem label="YouTube" value={data.youtubeUrl} />}
          {data.specialOffers && <ReviewItem label="Special Offers" value={data.specialOffers} />}
          {!data.websiteUrl && !data.facebookUrl && !data.instagramHandle && (
            <p className="text-sm text-muted-foreground italic">No online presence info provided — we'll help set things up.</p>
          )}
        </ReviewSection>
      </div>

      {/* Contact preferences */}
      <div className="mt-6 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2">
            Preferred Contact Method <span className="text-destructive">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {CONTACT_METHODS.map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => toggleContactMethod(method)}
                className={cn(
                  'px-4 py-2 rounded-lg border text-sm transition-all',
                  data.contactMethod.includes(method)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:border-primary/50'
                )}
              >
                {method}
              </button>
            ))}
          </div>
          {errors.contactMethod && <p className="mt-1 text-xs text-destructive">{errors.contactMethod}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Best Time to Reach You</label>
          <select
            value={data.bestTime}
            onChange={(e) => onChange({ bestTime: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">No preference</option>
            {BEST_TIMES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Anything else we should know?</label>
          <textarea
            placeholder="Seasonal patterns, upcoming promotions, competitors you're worried about..."
            value={data.additionalNotes}
            onChange={(e) => onChange({ additionalNotes: e.target.value })}
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-destructive/30 rounded-lg text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <button onClick={onPrev} className="px-6 py-3 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
          ← Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 sm:flex-none px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit & Launch My Marketing'
          )}
        </button>
      </div>

      <p className="mt-3 text-xs text-muted-foreground text-center sm:text-left">
        We'll reach out within one business day. No spam, no pressure — just a team ready to work for you.
      </p>
    </div>
  )
}

function ReviewSection({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">{title}</h3>
        <button onClick={onEdit} className="text-primary hover:text-primary/80 transition-colors">
          <Pencil className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-muted-foreground whitespace-nowrap">{label}:</span>
      <span className="break-words">{value}</span>
    </div>
  )
}
