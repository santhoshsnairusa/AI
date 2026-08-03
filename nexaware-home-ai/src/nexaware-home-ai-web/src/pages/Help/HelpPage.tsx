import { FileText, MessageSquare, PackageSearch, Upload, Bot, Database } from 'lucide-react';

export function HelpPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text">How to Use NexAware</h1>
        <p className="text-text-muted mt-1">Your comprehensive guide to navigating and mastering your private home AI assistant.</p>
      </div>

      <div className="grid gap-6">
        {/* Dashboard */}
        <div className="glass-panel p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/20 p-3 rounded-lg text-primary">
              <Database size={24} />
            </div>
            <h2 className="text-xl font-semibold text-text">Dashboard</h2>
          </div>
          <p className="text-text-muted mb-4 leading-relaxed">
            The <strong>Dashboard</strong> is your home base. It gives you a high-level overview of everything happening in your smart home assistant.
          </p>
          <ul className="space-y-3 text-sm text-text-muted">
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
              <span><strong>Quick Insights:</strong> Instantly see how many documents the AI has memorized.</span>
            </li>
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
              <span><strong>Active Warnings:</strong> It highlights urgent alerts, like appliances whose warranties are about to expire.</span>
            </li>
          </ul>
        </div>

        {/* Chat Assistant */}
        <div className="glass-panel p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/20 p-3 rounded-lg text-primary">
              <MessageSquare size={24} />
            </div>
            <h2 className="text-xl font-semibold text-text">Chat Assistant</h2>
          </div>
          <p className="text-text-muted mb-4 leading-relaxed">
            The <strong>Chat Assistant</strong> is where you talk to the AI. It uses the documents and manuals you upload to answer highly specific questions about your home.
          </p>
          <ul className="space-y-3 text-sm text-text-muted">
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
              <span><strong>Ask Anything:</strong> <em>"What is the guest WiFi password?"</em> or <em>"How do I clean the filter on my LG fridge?"</em></span>
            </li>
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
              <span><strong>100% Private:</strong> The AI runs entirely on your local machine. Nothing is ever sent to the cloud.</span>
            </li>
          </ul>
        </div>

        {/* Documents & Manuals */}
        <div className="glass-panel p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/20 p-3 rounded-lg text-primary">
              <FileText size={24} />
            </div>
            <h2 className="text-xl font-semibold text-text">Documents & Service Manuals</h2>
          </div>
          <p className="text-text-muted mb-4 leading-relaxed">
            The AI needs context to be smart. Use the <strong>Documents</strong> and <strong>Service Manuals</strong> pages to build the AI's knowledge base.
          </p>
          <ul className="space-y-3 text-sm text-text-muted">
            <li className="flex gap-3">
              <Upload size={18} className="text-primary shrink-0" />
              <span><strong>File Uploads:</strong> Drag and drop PDF manuals for your appliances.</span>
            </li>
            <li className="flex gap-3">
              <FileText size={18} className="text-primary shrink-0" />
              <span><strong>Write Text:</strong> Directly type in text notes (like WiFi passwords or paint color codes) so the AI remembers them forever.</span>
            </li>
            <li className="flex gap-3">
              <Bot size={18} className="text-primary shrink-0" />
              <span><strong>Download/View:</strong> You can click the Download icon next to any document you've added to view its contents later.</span>
            </li>
          </ul>
        </div>

        {/* Household Items */}
        <div className="glass-panel p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/20 p-3 rounded-lg text-primary">
              <PackageSearch size={24} />
            </div>
            <h2 className="text-xl font-semibold text-text">Household Items</h2>
          </div>
          <p className="text-text-muted mb-4 leading-relaxed">
            The <strong>Household Items</strong> page is your digital home inventory. Use it to keep track of physical appliances, electronics, and perishables.
          </p>
          <ul className="space-y-3 text-sm text-text-muted">
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
              <span><strong>Track Details:</strong> Keep a record of the Make, Model Number, and Brand for easy reference when ordering parts.</span>
            </li>
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
              <span><strong>Smart Deadlines:</strong> Enter the Warranty End Date or Expiration Date. The system will alert you 30 days before they expire!</span>
            </li>
          </ul>
        </div>
        
        {/* Settings */}
        <div className="glass-panel p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/20 p-3 rounded-lg text-primary">
              <Bot size={24} />
            </div>
            <h2 className="text-xl font-semibold text-text">Settings</h2>
          </div>
          <p className="text-text-muted mb-4 leading-relaxed">
            The <strong>Settings</strong> button at the bottom of the sidebar will allow you to configure system preferences like selecting which underlying AI model (e.g., Llama 3) the assistant should use for generation.
          </p>
        </div>

      </div>
    </div>
  );
}
