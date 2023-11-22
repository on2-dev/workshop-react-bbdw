import React from 'react';

import './index.scss';

/**
 * This method treats the received string so it won't keep any variations
 * of characters.
 * 
 * @param {String} word The text to be treated
 * @param {String} wordSeparator An optional separator (default is [SPACE])
 * @returns String A normalized version of the string
 */
function removeDiacritics(word, wordSeparator = ' ') {
  return word
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ /g, wordSeparator);
}

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
    filter = '',
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
          {cities.filter(item => {
            if (
              !filter.length
              || removeDiacritics(item.nome.toLowerCase())
                .includes(removeDiacritics(filter.toLowerCase()))
            ) {
              return true;
            }

            return false;
          }).map((city, i) => {
            return (
              <tr key={city.nome + i}>
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


