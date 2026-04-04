import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../lib/auth'
import { Submission } from '../lib/types'
import { STATUS_LABELS } from '../lib/constants'
import { cn } from '../lib/utils'
import { Clock, CheckCircle, AlertCircle, Eye } from 'lucide-react'

const STATUS_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(STATUS_LABELS).map(([key, nanoid]) => [nanoid, key])
)

const STATUS_DISPLAY: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-800', icon: Clock },
  underReview: { label: 'Under Review', color: 'bg-amber-100 text-amber-800', icon: Eye },
  workspaceCreated: { label: 'Workspace Created', color: 'bg-purple-100 text-purple-800', icon: CheckCircle },
  active: { label: 'Active', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: AlertCircle },
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch<{ submissions: Submission[] }>('/api/submissions')
      .then((data) => setSubmissions(data.submissions))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const getStatusKey = (statusArr: string[] | undefined): string => {
    if (!statusArr || statusArr.length === 0) return 'new'
    return STATUS_NAME[statusArr[0]] || 'new'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading submissions...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Onboarding Submissions</h1>
            <p className="text-muted-foreground text-sm mt-1">{submissions.length} total submissions</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-destructive/30 rounded-lg text-sm text-destructive">
            {error}
          </div>
        )}

        {submissions.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No submissions yet</p>
            <p className="text-sm mt-1">New client onboarding submissions will appear here.</p>
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Company</th>
                  <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Contact</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Industry</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Submitted</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {submissions.map((sub) => {
                  const statusKey = getStatusKey(sub.status)
                  const statusInfo = STATUS_DISPLAY[statusKey] || STATUS_DISPLAY.new

                  return (
                    <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium">{sub.companyName}</div>
                        <div className="text-xs text-muted-foreground sm:hidden">{sub.contactName}</div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div>{sub.contactName}</div>
                        <div className="text-xs text-muted-foreground">{sub.contactEmail}</div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{sub.industry}</td>
                      <td className="px-4 py-3">
                        <span className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', statusInfo.color)}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                        {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/${sub.id}`}
                          className="text-primary hover:text-primary/80 text-sm font-medium"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
