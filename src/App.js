import "bootstrap/scss/bootstrap.scss";

import SoftwareSearch from "./components/SoftwareSearch";

function App() {
  return (
    <div>
      <header className="bg-light border-bottom py-2">
        <div className="container">
          <h2 className="mb-0">Emergent Software</h2>
        </div>
      </header>
      <div className="container py-4">
        <SoftwareSearch />
    </div>
    </div>
  );
}

export default App;
