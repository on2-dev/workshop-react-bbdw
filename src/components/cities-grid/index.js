import React /*, { useEffect, useState, useCallback, useRef }*/ from 'react';

import './index.scss';

/**
 * React component: ComponentName
 * 
 * Description
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

  if (loading) {
    return <div>Carregando: {state}</div>;
  }

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
              <tr>
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


