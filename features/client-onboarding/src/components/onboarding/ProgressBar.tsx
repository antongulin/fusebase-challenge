import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

interface ProgressBarProps {
  currentStep: number
  labels: string[]
}

export default function ProgressBar({ currentStep, labels }: ProgressBarProps) {
  return (
    <div>
      {/* Mobile: compact */}
      <div className="sm:hidden text-center">
        <p className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {labels.length}
        </p>
        <p className="font-medium">{labels[currentStep]}</p>
        <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / labels.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop: full stepper */}
      <div className="hidden sm:flex items-center justify-between">
        {labels.map((label, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300',
                  i < currentStep && 'bg-success text-white',
                  i === currentStep && 'bg-primary text-primary-foreground scale-110',
                  i > currentStep && 'bg-muted text-muted-foreground'
                )}
              >
                {i < currentStep ? <Check className="w-5 h-5" /> : i + 1}
              </div>
              <span
                className={cn(
                  'mt-1.5 text-xs whitespace-nowrap',
                  i === currentStep ? 'text-foreground font-medium' : 'text-muted-foreground'
                )}
              >
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div className="flex-1 mx-3 mt-[-1.25rem]">
                <div className="h-0.5 bg-muted rounded-full">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      i < currentStep ? 'bg-success w-full' : 'bg-muted w-0'
                    )}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
