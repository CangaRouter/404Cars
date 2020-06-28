import React from 'react';
import Table from 'react-bootstrap/Table';
import CarCell from './CarCell.js';
function CarList(props) {
  let splitCars=[];
  let i=0;
  for(i=0;i<=props.cars.length;i+=3){
  splitCars.push(props.cars.slice(i,i+3));
}
  return <main className="below-nav">
      <Table bordered responsive="sm"  className="carTable below-nav my-5">
  <tbody>

      {splitCars.map((cars,index)=><tr key={index}>{cars.map((car,index)=><td key={index} className="car"><CarCell car={car}/></td>)}</tr>)}
   
  </tbody>
</Table>
</main>

}

export default CarList;