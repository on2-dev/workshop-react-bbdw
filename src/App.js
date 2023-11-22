/**
 * Busca a lista de estados no Brasil.
 * Ao clicar no botão, se um estado estiver selecionado, lista as cidades
 * daquele estado.
 * 
 * # Helpers
 * API para pegar a lista de estados do Brasil:
 * https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome
 *
 * API para pegar a lista de cidades em um determinado estado:
 * https://servicodados.ibge.gov.br/api/v1/localidades/estados/${UF}/distritos
 *
 */
import React from "react";
import CitiesGrid from "./components/cities-grid";

import "./App.scss";

/**
 * Generates the url used to retrieve the list of cities for a given state.
 * 
 * @param {String} UF The acronym for the state
 * @returns String The parsed URL for the API to return the list of cities within that state
 */
const getCitiesAPI_URL = function (UF = "") {
  UF = UF.substring(0, 2);
  return `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${UF}/distritos`;
};

// The url for the API to retrieve the list of states.
const API_STATES_UF = `https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome`;

/**
 * This object contains the list of cities already downloaded
 * for the states.
 * Each state is a `key` in the object.
 */
const CACHED_CITIES = {};

/**
 * Our main App entrypoint.
 * 
 * @returns ReactComponent
 */
export default function App() {

  const [statesList, setStatesList] = React.useState(null);
  const [loadingCities, setLoadingCities] = React.useState(null);
  const [selectedState, setSelectedState] = React.useState(null);
  const [citiesForState, setCitiesForCurrentUF] = React.useState(null);
  const [filteringBy, setFilteringBy] = React.useState('');

  // will load the list of states as soon as the component is ready (mount)
  React.useEffect((_) => {
    fetch(API_STATES_UF)
      .then(async (response) => {
        const data = await response.json();
        setStatesList(data);
      })
      .catch((error) => {
        alert("Failed loading countries data!");
        console.error(error);
      });
  }, []);

  /**
   * If the list of states is not yet available, we show only a placeholder
   */
  if (!statesList) {
    return <div className="no-data">Building up...</div>;
  }

  /**
   * Sorts a list based on item's names.
   */
  function sortByName(a, b) {
    return a.nome.localeCompare(b.nome);
  }

  /**
   * Handles the onChange event for the state.
   * Triggers when users select one state.
   *
   * @param {Event} event The onChange event
   */
  function onStateChange(event) {
    setCitiesForCurrentUF(null);
    setSelectedState(event.target.value);
  }

  /**
   * Will fetch and load the list of cities for
   * the currently selected state
   */
  function getCities() {

    if (CACHED_CITIES[selectedState]) {
      return setCitiesForCurrentUF(CACHED_CITIES[selectedState]);
    }

    // mark it as in the "loading" state
    setLoadingCities(true);

    fetch(getCitiesAPI_URL(selectedState))
      .then(async (response) => {
        const data = await response.json();
        CACHED_CITIES[selectedState] = data.sort(sortByName);
        setCitiesForCurrentUF(data);
      })
      .catch((error) => {
        alert("Erro ao buscar a lista de cidades!");
        console.error(error);
      })
      .finally((_) => {
        setLoadingCities(false);
      });
  }

  return (
    <div className="App">
      <div className="header">
        <select onChange={onStateChange}>
          <option value="">Selecione um estado</option>
          {statesList.sort(sortByName).map((state) => {
            return (
              <option key={state.sigla} value={state.sigla}>
                {state.sigla} - {state.nome}
              </option>
            );
          })}
        </select>
        <button disabled={!selectedState} onClick={getCities}>
          Ok
        </button>

        {
          selectedState && citiesForState?.length && (
            <input
              type="search"
              placeholder="Filtrar por..."
              onChange={event => {setFilteringBy(event.target.value);}}
            />
          )
        }
      </div>

      <div className="main">
        <CitiesGrid
          loading={loadingCities}
          state={selectedState}
          cities={citiesForState}
          filter={filteringBy}
        />
      </div>

    </div>
  );
}
