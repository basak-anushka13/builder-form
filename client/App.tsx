import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FormBuilder from "./pages/FormBuilder";
import FormList from "./pages/FormList";
import FormPreview from "./pages/FormPreview";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/forms" element={<FormList />} />
          <Route path="/builder" element={<FormBuilder />} />
          <Route path="/builder/:id" element={<FormBuilder />} />
          <Route path="/preview/:id" element={<FormPreview />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
