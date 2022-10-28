import './App.css';
import USWDS from "@uswds/uswds/src/js/components";
import { useEffect, useState } from 'react';
const { comboBox }  = USWDS;

function App() {
  const ref = document.body;
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState();
  const [selectedCandidate, setSelectedCandidate] = useState();

  useEffect(() => {
    comboBox.on(ref);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddressSuggestions = (input) => {
    const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?text=${input}&category=address&f=json&countryCode=USA`;

    fetch(url).then(blob => {
      blob.json().then(({suggestions}) => {
        setSuggestions(suggestions);
      })
    });
  }

  const handleSelectedAddress = (magicKey) => {
    const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?magicKey=${magicKey}&f=json`;

    fetch(url).then(blob => {
      blob.json().then(({candidates}) => {
        setSelectedCandidate(candidates[0]);
      })
    });
  }

  return (
    <div className="App">
      <label className="usa-label" htmlFor="fruit">ComboBox: Type an address</label>
      <div
        className="usa-combo-box"
        data-filter="[\s\S]*"
        data-placeholder="Search for an address"
        onInput={(ev) => {
          handleAddressSuggestions(ev.target.value);
        }}
        onChange={(ev) => {
          console.log('did select');
          setSelectedSuggestion(ev.target.value);
        }}
      >
        <select className="usa-select" name="fruit" id="fruit">
          <option value></option>
          {suggestions.map((suggestion, idx) => <option key={idx} value={suggestion.magicKey}>{suggestion.text}</option>)}
        </select>
      </div>
      <button
        type=""
        disabled={!selectedSuggestion}
        className="usa-button usa-button--big"
        onClick={() => {
          handleSelectedAddress(selectedSuggestion);
        }}
      >Search</button>
      {selectedCandidate && <>
        <h3>Post Offices near {selectedCandidate.address}:</h3>
        <ul>
          <li>Cupcakes</li>
          <li>Cookies</li>
          <li>Biscuits</li>
          <li>Pies</li>
        </ul>
      </>}
    </div>
  );
}

export default App;
