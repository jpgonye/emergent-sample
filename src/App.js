import "./styles/app.scss";

import SoftwareSearch from "./components/SoftwareSearch";

function App() {
  return (
    <div>
      <header className="bg-white border-bottom py-2">
        <div className="container">
          <img src="/images/logo.svg" alt="Emergent Software" />
        </div>
      </header>
      <div className="container py-4">
        <SoftwareSearch />
    </div>
    </div>
  );
}

export default App;
