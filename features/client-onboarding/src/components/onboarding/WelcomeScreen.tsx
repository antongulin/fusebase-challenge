import { ArrowRight, Shield, Users, BarChart3, Zap } from 'lucide-react'

interface WelcomeScreenProps {
  onStart: () => void
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Welcome Aboard — Let's Put Your Business on the Map
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            You made a great decision. Give us about 10 minutes, and we'll have everything
            we need to start driving real customers to your door.
          </p>
        </div>

        <div className="text-left space-y-4 mb-8">
          {[
            { icon: BarChart3, text: 'We build your custom marketing gameplan — within 48 hours' },
            { icon: Zap, text: "Your accounts get set up — by us, not you" },
            { icon: Users, text: 'You get a kickoff call on your schedule — most clients are live within 7 days' },
            { icon: ArrowRight, text: 'Then you start getting leads — real phone calls from real people in your area' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-3">
              <div className="mt-0.5 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm sm:text-base">{text}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Get Started — It Only Takes 10 Minutes
        </button>

        <p className="mt-4 text-xs text-muted-foreground flex items-center justify-center gap-1">
          <Shield className="w-3 h-3" />
          Your information is secure and never shared with third parties.
        </p>

        <div className="mt-10 pt-8 border-t border-border">
          <p className="text-sm font-medium text-muted-foreground mb-3">Trusted by 200+ local businesses</p>
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span>4.9 avg rating</span>
            <span>$4.2M revenue generated</span>
            <span>35+ markets</span>
          </div>
        </div>
      </div>
    </div>
  )
}
