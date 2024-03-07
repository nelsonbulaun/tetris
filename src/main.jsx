import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import ControlProvider from './contexts/ControlContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <ControlProvider> 
    <App />
    </ControlProvider>

)
