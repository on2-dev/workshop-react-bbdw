import React from "react";
import "./App.scss";


import CitiesGrid from "./components/cities-grid";

/**
 * # Desafio front-end
 *
 * É um componente que terá um select e um botão, e terá
 * uma listagem ou grid com dados logo abaixo.
 *
 * O componente deve ser montado inicialmente com um
 * placeholder.
 *
 * Deve então fazer um fetch na API para buscar a lista
 * de todos os estados do Brasil.
 *
 * Depois, listar no elemento do tipo select todos estes
 * países como opções.
 *
 * Quando o usuário selecionar um estado, o botão fica ativo.
 *
 * Se o usuário clicar no botão, deve então buscar a lista
 * de cidades naquele estado.
 *
 * Quando obtiver o resultado, deve listar as cidades daquele
 * estado exibindo o nome da cidade, e o nome da microrregião
 * daquela cidade.
 *
 * # Bonus points
 * - Colocar tanto os estados quanto as cidades em ordem
 *   alfabética
 * - Se o dispositivo for pequeno (mobile), este grid pode
 *   mostrar apenas o nome da cidade.
 *
 * # Helpers
 * API para pegar a lista de estados do Brasil:
 * https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome
 *
 * API para pegar a lista de cidades em um determinado estado:
 * https://servicodados.ibge.gov.br/api/v1/localidades/estados/${UF}/distritos
 *
 */

const getCitiesAPI_URL = function (UF = "") {
  UF = UF.substring(0, 2);
  return `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${UF}/distritos`;
};

const API_STATES_UF = `https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome`;

const CACHED_CITIES = {};

export default function App() {
  const [statesList, setStatesList] = React.useState(null);


  const [loadingCities, setLoadingCities] = React.useState(null);


  const [selectedState, setSelectedState] = React.useState(null);
  const [citiesForState, setCitiesForCurrentUF] = React.useState(null);

  const [filteringBy, setFilteringBy] = React.useState('');
  


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
   * in the first render, we show only the placeholder
   */
  if (!statesList) {
    return <div className="no-data">Building up...</div>;
  }

  /**
   * Sorts a list based on item's names.
   *
   * As both states and cities coming from the api have a
   * name, we can use the same function to sort them both.
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
          <option value=""></option>
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
      {/* <div className="main">{getCitiesGrid()}</div> */}
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
