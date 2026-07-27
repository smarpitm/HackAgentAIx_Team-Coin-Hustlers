import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'

// Placeholder components - to be implemented
const ChatPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Chat - Coming Soon</h1></div>
const VisionPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Vision - Coming Soon</h1></div>
const CommunicationPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Communication - Coming Soon</h1></div>
const NavigationPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Navigation - Coming Soon</h1></div>
const AuditPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Audit - Coming Soon</h1></div>

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/vision" element={<VisionPage />} />
        <Route path="/communication" element={<CommunicationPage />} />
        <Route path="/navigation" element={<NavigationPage />} />
        <Route path="/audit" element={<AuditPage />} />
      </Routes>
    </Layout>
  )
}

export default App
