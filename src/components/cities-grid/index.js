import React from 'react';

import './index.scss';

/**
 * CitiesGrid
 * 
 * Responsible for rendering the list of cities or possible
 * alternative states, such as "loading" or "empty".
 * 
 * @param {Object} props Component's properties
 * @return {ReactComponent} ComponentName
 */
export default function CitiesGrid (props) {

  const {
    className = '',
    children,
    loading=false,
    cities=[],
    state=null,
    ...other
  } = props;

  // when loading
  if (loading) {
    return <div>Carregando: {state}</div>;
  }

  // if not loading, but has no cities to list
  if (!loading && !cities?.length) {
    return <div>Selecione um estado e clique em OK</div>;
  }

  return (
    <div
      className={"cities-grid-container " + className}
      {...other}
    >
      <table className="cities-table">
        <thead>
          <tr>
            <td>Nome</td>
            <td>Microrregiao</td>
          </tr>
        </thead>
        <tbody>
          {cities.map((city) => {
            return (
              <tr key={city.nome}>
                <td>{city.nome}</td>
                <td>{city.municipio.microrregiao.nome}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


