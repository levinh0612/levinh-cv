import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CVProvider } from './context/CVContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CVPage } from './pages/CVPage';
import { DashboardPage } from './pages/DashboardPage';
import { DeployPage } from './pages/DeployPage';

function App() {
  return (
    <CVProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CVPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/deploy"
            element={
              <ProtectedRoute>
                <DeployPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </CVProvider>
  );
}

export default App;
