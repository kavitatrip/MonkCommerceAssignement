import { HashRouter, Routes, Route } from "react-router-dom";
import MainContainer from "./components/MainPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainContainer />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
