import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiFetch } from '../lib/auth'
import { Submission } from '../lib/types'
import { STATUS_LABELS } from '../lib/constants'
import { ArrowLeft, ExternalLink, Building2, User, MapPin, Target, Globe, Briefcase } from 'lucide-react'
import { cn } from '../lib/utils'

const STATUS_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(STATUS_LABELS).map(([key, nanoid]) => [nanoid, key])
)

export default function AdminDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [workspaceId, setWorkspaceId] = useState('')
  const [setupLoading, setSetupLoading] = useState(false)
  const [setupDone, setSetupDone] = useState(false)

  useEffect(() => {
    apiFetch<{ submissions: Submission[] }>('/api/submissions')
      .then((data) => {
        const found = data.submissions.find((s) => s.id === id)
        if (found) {
          setSubmission(found)
          if (found.workspaceId) setWorkspaceId(found.workspaceId)
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleSetup = async () => {
    if (!workspaceId.trim() || !id) return
    setSetupLoading(true)
    try {
      await apiFetch(`/api/submissions/${id}/setup`, {
        method: 'POST',
        body: JSON.stringify({ workspaceId: workspaceId.trim() }),
      })
      setSetupDone(true)
    } catch {
      // error handled by apiFetch
    } finally {
      setSetupLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Submission not found</p>
      </div>
    )
  }

  const statusKey = submission.status?.[0] ? (STATUS_NAME[submission.status[0]] || 'new') : 'new'

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Submissions
        </Link>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{submission.companyName}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Submitted {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : '—'}
            </p>
          </div>
          <span className={cn(
            'px-3 py-1 rounded-full text-xs font-medium',
            statusKey === 'new' && 'bg-blue-100 text-blue-800',
            statusKey === 'underReview' && 'bg-amber-100 text-amber-800',
            statusKey === 'workspaceCreated' && 'bg-purple-100 text-purple-800',
            statusKey === 'active' && 'bg-green-100 text-green-800',
            statusKey === 'rejected' && 'bg-red-100 text-red-800',
          )}>
            {statusKey.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard icon={Building2} title="Business Info">
            <InfoRow label="Industry" value={submission.industry} />
            <InfoRow label="Address" value={submission.businessAddress} />
            <InfoRow label="Website" value={submission.websiteUrl?.url} link />
            <InfoRow label="Employee Range" value={submission.employeeRange} />
          </InfoCard>

          <InfoCard icon={User} title="Contact">
            <InfoRow label="Name" value={`${submission.contactName}${submission.contactRole ? ' (' + submission.contactRole + ')' : ''}`} />
            <InfoRow label="Email" value={submission.contactEmail} />
            <InfoRow label="Phone" value={submission.contactPhone} />
            <InfoRow label="Preferred Contact" value={submission.contactMethod} />
            <InfoRow label="Best Time" value={submission.bestTime} />
          </InfoCard>

          <InfoCard icon={Target} title="Services & Goals">
            <InfoRow label="Services" value={submission.servicesOffered} />
            <InfoRow label="Top Services" value={submission.topServices} />
            <InfoRow label="Primary Goal" value={submission.primaryGoal?.length ? 'Set' : ''} />
            <InfoRow label="Monthly Budget" value={submission.monthlyBudget?.length ? 'Set' : ''} />
            <InfoRow label="Emergency" value={submission.emergencyService ? 'Yes' : 'No'} />
            <InfoRow label="Free Estimates" value={submission.freeEstimates ? 'Yes' : 'No'} />
          </InfoCard>

          <InfoCard icon={MapPin} title="Market">
            <InfoRow label="Service Area" value={submission.serviceArea} />
            <InfoRow label="Ideal Customer" value={submission.idealCustomer} />
            <InfoRow label="Competitors" value={submission.competitors} />
            <InfoRow label="Differentiator" value={submission.differentiator} />
          </InfoCard>

          <InfoCard icon={Globe} title="Online Presence" className="md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1">
              <InfoRow label="GBP" value={submission.gbpUrl?.url} link />
              <InfoRow label="Facebook" value={submission.facebookUrl?.url} link />
              <InfoRow label="Instagram" value={submission.instagramHandle ? '@' + submission.instagramHandle : ''} />
              <InfoRow label="TikTok" value={submission.tiktokHandle ? '@' + submission.tiktokHandle : ''} />
              <InfoRow label="LinkedIn" value={submission.linkedinUrl?.url} link />
              <InfoRow label="YouTube" value={submission.youtubeUrl?.url} link />
              <InfoRow label="Other" value={submission.otherSocialLinks} />
            </div>
          </InfoCard>

          {submission.specialOffers && (
            <InfoCard icon={Briefcase} title="Special Offers" className="md:col-span-2">
              <p className="text-sm">{submission.specialOffers}</p>
            </InfoCard>
          )}

          {submission.additionalNotes && (
            <InfoCard icon={Briefcase} title="Additional Notes" className="md:col-span-2">
              <p className="text-sm">{submission.additionalNotes}</p>
            </InfoCard>
          )}
        </div>

        {/* Workspace Association */}
        {!setupDone && statusKey !== 'workspaceCreated' && statusKey !== 'active' && (
          <div className="mt-6 border border-primary/30 bg-primary/5 rounded-lg p-6">
            <h3 className="font-semibold mb-2">Set Up Workspace</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create a workspace for this client in Fusebase (just type the business name), then paste the workspace ID here.
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Paste workspace ID..."
                value={workspaceId}
                onChange={(e) => setWorkspaceId(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                onClick={handleSetup}
                disabled={setupLoading || !workspaceId.trim()}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
              >
                {setupLoading ? 'Saving...' : 'Associate Workspace'}
              </button>
            </div>
          </div>
        )}

        {(setupDone || statusKey === 'workspaceCreated' || statusKey === 'active') && (
          <div className="mt-6 border border-success/30 bg-success/5 rounded-lg p-6">
            <h3 className="font-semibold text-success mb-1">Workspace Associated</h3>
            <p className="text-sm text-muted-foreground">
              Workspace ID: {workspaceId || submission.workspaceId}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function InfoCard({ icon: Icon, title, children, className }: {
  icon: typeof Building2
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('border border-border rounded-lg p-4', className)}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

function InfoRow({ label, value, link }: { label: string; value?: string | null; link?: boolean }) {
  if (!value) return null
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-muted-foreground whitespace-nowrap">{label}:</span>
      {link ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 break-all">
          {value} <ExternalLink className="w-3 h-3 flex-shrink-0" />
        </a>
      ) : (
        <span className="break-words">{value}</span>
      )}
    </div>
  )
}
