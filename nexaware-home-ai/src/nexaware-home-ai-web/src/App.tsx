import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { ChatPage } from './pages/Chat/ChatPage';
import { DocumentsPage } from './pages/Documents/DocumentsPage';
import { ItemsPage } from './pages/Items/ItemsPage';
import { ManualsPage } from './pages/Manuals/ManualsPage';
import { HelpPage } from './pages/Help/HelpPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="manuals" element={<ManualsPage />} />
          <Route path="items" element={<ItemsPage />} />
          <Route path="help" element={<HelpPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
