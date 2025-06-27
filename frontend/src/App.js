import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddApplication from "./pages/AddApplication";
import EditApplication from "./pages/EditApplication";
import ViewApplication from "./pages/ViewApplication";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddApplication />} />
        <Route path="/applications/:id" element={<ViewApplication />} />
        <Route path="/edit/:id" element={<EditApplication />} />
      </Routes>
    </Router>
  );
}

export default App;
