export default function AuthExpiredModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-8 max-w-md mx-4 shadow-xl">
        <h2 className="text-xl font-semibold mb-2">Session Expired</h2>
        <p className="text-muted-foreground mb-6">
          Your session has expired. Please reload the page to continue.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-primary text-primary-foreground rounded-lg py-3 font-medium hover:opacity-90 transition-opacity"
        >
          Reload Page
        </button>
      </div>
    </div>
  )
}
