// // assets/javascript/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ModelEditor from './pages/ModelEditor';
import Backtesting from './pages/Backtesting';
import DataExploration from './pages/DataExploration';
import Leaderboards from './pages/Leaderboards';
import Settings from './pages/Settings';
import CommandCenter from './pages/CommandCenter';
import Portfolio from './pages/Portfolio';
import Performance from './pages/Performance';
import Developer from './pages/Developer';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';

// const PrivateRoute = ({ component: Component, ...rest }) => {
//   const isAuthenticated = document.cookie.includes('sessionid=');  // Basic check for Django session cookie

//   return (
//     <Route
//       {...rest}
//       render={(props) =>
//         isAuthenticated ? (
//           <Component {...props} />
//         ) : (
//           window.location.href = '/accounts/login/'  // Redirect to Django login page
//         )
//       }
//     />
//   );
// };

// const App = () => {
//   return (
//     <ThemeProvider>
//       <ErrorBoundary>
//         <Router basename="/">
//           <div className="flex flex-col min-h-screen">
//             <Navbar />
//               <p>bro this working?</p>
//               <main className="flex-grow">
//                 <Routes>
//                   <Route exact path="/" render={() => <Navigate to="/command-center" />} />
//                   <PrivateRoute path="/command-center" component={CommandCenter} />
//                   <PrivateRoute path="/portfolio" component={Portfolio} />
//                   <PrivateRoute path="/performance" component={Performance} />
//                   <PrivateRoute path="/settings" component={Settings} />
//                   <PrivateRoute path="/developer" component={Developer} />
//                   <PrivateRoute path="/developer-mode/model-editor" component={ModelEditor} />
//                   <PrivateRoute path="/developer-mode/backtesting" component={Backtesting} />
//                   <PrivateRoute path="/developer-mode/data-exploration" component={DataExploration} />
//                   <PrivateRoute path="/developer-mode/leaderboards" component={Leaderboards} />
//                </Routes>
//               </main>
//           </div>
//         </Router>
//       </ErrorBoundary>
//     </ThemeProvider>
//   );
// };

// export default App;

const App = () => {
  // const isAuthenticated = document.cookie.includes('sessionid=');  // Basic check for Django session cookie
  const [isAuthenticated, setIsAuthenticated] = useState(true);  // Assume authenticated initially
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.getUserInfo();
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication check failed:', error);
        window.location.href = '/';  // Redirect to home page if not authenticated
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>Hello, React!</h1>
    </div>
  );
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Navigate to="/command-center" />} />
                <Route
                  path="/command-center"
                  element={isAuthenticated ? <CommandCenter /> : <Navigate to="/accounts/login/" />}
                />
                <Route
                  path="/portfolio"
                  element={isAuthenticated ? <Portfolio /> : <Navigate to="/accounts/login/" />}
                />
                <Route
                  path="/performance"
                  element={isAuthenticated ? <Performance /> : <Navigate to="/accounts/login/" />}
                />
                <Route
                  path="/settings"
                  element={isAuthenticated ? <Settings /> : <Navigate to="/accounts/login/" />}
                />
                <Route
                  path="/developer"
                  element={isAuthenticated ? <Developer /> : <Navigate to="/accounts/login/" />}
                />
                <Route
                  path="/developer-mode/model-editor"
                  element={isAuthenticated ? <ModelEditor /> : <Navigate to="/accounts/login/" />}
                />
                <Route
                  path="/developer-mode/backtesting"
                  element={isAuthenticated ? <Backtesting /> : <Navigate to="/accounts/login/" />}
                />
                <Route
                  path="/developer-mode/data-exploration"
                  element={isAuthenticated ? <DataExploration /> : <Navigate to="/accounts/login/" />}
                />
                <Route
                  path="/developer-mode/leaderboards"
                  element={isAuthenticated ? <Leaderboards /> : <Navigate to="/accounts/login/" />}
                />
                {/* <Route path="/accounts/login" element={<LoginPage />} /> */}
              </Routes>
            </main>
          </div>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;