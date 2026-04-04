import { CheckCircle, Clock, Phone, Rocket } from 'lucide-react'

interface ConfirmationScreenProps {
  name: string
}

export default function ConfirmationScreen({ name }: ConfirmationScreenProps) {
  const firstName = name.split(' ')[0] || name

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-3xl font-bold">
            You're All Set, {firstName}. Welcome Aboard.
          </h1>
        </div>

        <div className="text-left space-y-6 mb-8">
          <h2 className="text-lg font-semibold text-center">Here's what happens next:</h2>

          {[
            {
              icon: Clock,
              title: 'Strategy Review — Within 48 Hours',
              desc: 'Your strategist reviews your answers and researches your market.',
            },
            {
              icon: Phone,
              title: 'Kickoff Call — Within 3-5 Business Days',
              desc: '30-minute call to walk through the plan and set a launch date.',
            },
            {
              icon: Rocket,
              title: 'Campaign Launch — Within 7 Days of Kickoff',
              desc: 'Ads go live, leads start flowing. You\'ll have a direct line to your strategist.',
            },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {i + 1}
                </div>
                {i < 2 && <div className="w-0.5 h-full bg-border mt-1" />}
              </div>
              <div className="pb-4">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold">{title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-muted/50 rounded-lg p-6">
          <p className="text-sm text-muted-foreground">
            You don't need to do anything else. Go run your business — that's what you're best at.
            We'll handle the rest and keep you in the loop every step of the way.
          </p>
          <p className="text-xs text-muted-foreground mt-3">
            Check your email — we just sent you a confirmation with all of this info.
          </p>
        </div>
      </div>
    </div>
  )
}
