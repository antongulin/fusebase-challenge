import { useState } from 'react'
import { OnboardingFormData, defaultFormData } from '../lib/types'
import WelcomeScreen from '../components/onboarding/WelcomeScreen'
import Step1Business from '../components/onboarding/Step1Business'
import Step2Services from '../components/onboarding/Step2Services'
import Step3Market from '../components/onboarding/Step3Market'
import Step4Brand from '../components/onboarding/Step4Brand'
import Step5Review from '../components/onboarding/Step5Review'
import ConfirmationScreen from '../components/onboarding/ConfirmationScreen'
import ProgressBar from '../components/onboarding/ProgressBar'
import { apiFetch } from '../lib/auth'

const STEP_LABELS = ['Your Business', 'Services & Goals', 'Your Customers', 'Brand & Presence', 'Review & Submit']

export default function OnboardingPage() {
  const [step, setStep] = useState(-1) // -1 = welcome, 0-4 = steps, 5 = confirmation
  const [formData, setFormData] = useState<OnboardingFormData>(defaultFormData)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const updateForm = (partial: Partial<OnboardingFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }))
  }

  const next = () => setStep((s) => s + 1)
  const prev = () => setStep((s) => s - 1)

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')

    const industry = formData.industry === 'Other' ? formData.customIndustry : formData.industry
    const allServices = [...formData.servicesOffered, ...formData.customServices]

    const serviceArea = formData.serviceAreaType === 'I serve customers at my location'
      ? `At location. ${formData.specificAreas ? 'Areas: ' + formData.specificAreas : ''}`
      : `${formData.serviceAreaType}. Radius: ${formData.serviceAreaRadius} miles. ${formData.specificAreas ? 'Areas: ' + formData.specificAreas : ''}`

    try {
      await apiFetch('/api/onboard', {
        method: 'POST',
        body: JSON.stringify({
          companyName: formData.companyName,
          contactName: formData.contactName,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          contactRole: formData.contactRole,
          businessAddress: formData.businessAddress,
          industry,
          websiteUrl: formData.websiteUrl || undefined,
          servicesOffered: allServices,
          topServices: formData.topServices,
          primaryGoal: formData.primaryGoal,
          monthlyBudget: formData.monthlyBudget,
          serviceArea,
          idealCustomer: formData.idealCustomer,
          competitors: formData.competitors,
          differentiator: formData.differentiator,
          gbpUrl: formData.gbpUrl || undefined,
          facebookUrl: formData.facebookUrl || undefined,
          instagramHandle: formData.instagramHandle,
          tiktokHandle: formData.tiktokHandle,
          linkedinUrl: formData.linkedinUrl || undefined,
          youtubeUrl: formData.youtubeUrl || undefined,
          otherSocialLinks: formData.otherSocialLinks,
          specialOffers: formData.specialOffers,
          contactMethod: formData.contactMethod,
          bestTime: formData.bestTime,
          additionalNotes: formData.additionalNotes,
          emergencyService: formData.emergencyService,
          freeEstimates: formData.freeEstimates,
          employeeRange: formData.employeeRange,
        }),
      })
      setSubmitted(true)
      setStep(5)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Welcome screen
  if (step === -1) {
    return <WelcomeScreen onStart={() => setStep(0)} />
  }

  // Confirmation screen
  if (step === 5 && submitted) {
    return <ConfirmationScreen name={formData.contactName} />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <ProgressBar currentStep={step} labels={STEP_LABELS} />

        <div className="mt-8">
          {step === 0 && (
            <Step1Business data={formData} onChange={updateForm} onNext={next} />
          )}
          {step === 1 && (
            <Step2Services data={formData} onChange={updateForm} onNext={next} onPrev={prev} />
          )}
          {step === 2 && (
            <Step3Market data={formData} onChange={updateForm} onNext={next} onPrev={prev} />
          )}
          {step === 3 && (
            <Step4Brand data={formData} onChange={updateForm} onNext={next} onPrev={prev} />
          )}
          {step === 4 && (
            <Step5Review
              data={formData}
              onChange={updateForm}
              onPrev={prev}
              onSubmit={handleSubmit}
              submitting={submitting}
              error={error}
              onEditStep={setStep}
            />
          )}
        </div>
      </div>
    </div>
  )
}
