export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text">Dashboard</h1>
        <p className="text-text-muted mt-1">Welcome back to NexAware Home AI.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 hover:-translate-y-1 transition-transform duration-300">
          <h3 className="font-semibold text-lg text-primary">System Status</h3>
          <p className="text-sm text-text-muted mt-2">All services operational</p>
        </div>
        <div className="glass-panel p-6 hover:-translate-y-1 transition-transform duration-300">
          <h3 className="font-semibold text-lg text-primary">Documents Indexed</h3>
          <p className="text-sm text-text-muted mt-2">12 Items in knowledge base</p>
        </div>
        <div className="glass-panel p-6 hover:-translate-y-1 transition-transform duration-300">
          <h3 className="font-semibold text-lg text-primary">Household Items</h3>
          <p className="text-sm text-text-muted mt-2">4 warranties expiring soon</p>
        </div>
      </div>
    </div>
  );
}
