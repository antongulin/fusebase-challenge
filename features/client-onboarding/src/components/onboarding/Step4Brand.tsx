import { OnboardingFormData } from '../../lib/types'
import { cn } from '../../lib/utils'

interface Props {
  data: OnboardingFormData
  onChange: (partial: Partial<OnboardingFormData>) => void
  onNext: () => void
  onPrev: () => void
}

const GBP_OPTIONS = ['Yes', 'No', "I'm not sure"]

export default function Step4Brand({ data, onChange, onNext, onPrev }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold">Let's See What You're Working With</h2>
      <p className="text-muted-foreground mt-1">
        Share your online accounts and brand details. Don't worry if some don't apply — fill in what you can.
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Website URL</label>
          <input
            type="url"
            inputMode="url"
            placeholder="https://www.yourbusiness.com"
            value={data.websiteUrl}
            onChange={(e) => onChange({ websiteUrl: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Don't have one? That's fine — we'll build landing pages that work even better for paid ads.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Do you have a Google Business Profile?</label>
          <div className="flex gap-2">
            {GBP_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange({ hasGbp: opt })}
                className={cn(
                  'px-4 py-2 rounded-lg border text-sm transition-all',
                  data.hasGbp === opt
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:border-primary/50'
                )}
              >
                {opt}
              </button>
            ))}
          </div>
          {data.hasGbp === "I'm not sure" && (
            <p className="mt-2 text-xs text-muted-foreground">
              No worries — we'll look it up for you. If you have one, we'll claim and optimize it.
            </p>
          )}
        </div>

        {data.hasGbp === 'Yes' && (
          <div>
            <label className="block text-sm font-medium mb-1.5">Google Business Profile URL</label>
            <input
              type="url"
              placeholder="Paste your Google Business Profile link"
              value={data.gbpUrl}
              onChange={(e) => onChange({ gbpUrl: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Facebook Page URL</label>
            <input
              type="url"
              placeholder="https://facebook.com/yourbusiness"
              value={data.facebookUrl}
              onChange={(e) => onChange({ facebookUrl: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Instagram Handle</label>
            <div className="flex">
              <span className="px-3 py-2.5 rounded-l-lg border border-r-0 border-border bg-muted text-sm text-muted-foreground">@</span>
              <input
                type="text"
                placeholder="yourbusinessname"
                value={data.instagramHandle}
                onChange={(e) => onChange({ instagramHandle: e.target.value })}
                className="flex-1 px-3 py-2.5 rounded-r-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">TikTok Handle</label>
            <div className="flex">
              <span className="px-3 py-2.5 rounded-l-lg border border-r-0 border-border bg-muted text-sm text-muted-foreground">@</span>
              <input
                type="text"
                placeholder="yourbusinessname"
                value={data.tiktokHandle}
                onChange={(e) => onChange({ tiktokHandle: e.target.value })}
                className="flex-1 px-3 py-2.5 rounded-r-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">LinkedIn URL</label>
            <input
              type="url"
              placeholder="https://linkedin.com/company/..."
              value={data.linkedinUrl}
              onChange={(e) => onChange({ linkedinUrl: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">YouTube URL</label>
            <input
              type="url"
              placeholder="https://youtube.com/@yourbusiness"
              value={data.youtubeUrl}
              onChange={(e) => onChange({ youtubeUrl: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Other Profile Links</label>
            <input
              type="text"
              placeholder="Yelp, Angi, Nextdoor, etc."
              value={data.otherSocialLinks}
              onChange={(e) => onChange({ otherSocialLinks: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Special Offers or Promotions</label>
          <textarea
            placeholder="e.g., '$50 off first service', 'Free AC tune-up with repair', '20% off for new patients'"
            value={data.specialOffers}
            onChange={(e) => onChange({ specialOffers: e.target.value })}
            rows={2}
            className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Ads with a specific offer get 30-40% more clicks. Don't have one? We can help you create one.
          </p>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button onClick={onPrev} className="px-6 py-3 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
          ← Back
        </button>
        <button onClick={onNext} className="flex-1 sm:flex-none px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
          Review & Submit →
        </button>
      </div>
    </div>
  )
}
