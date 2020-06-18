import React from 'react';
import Table from 'react-bootstrap/Table';
import CarCell from './CarCell.js';
function MyBody() {
  return <main className="below-nav"><Table bordered responsive="sm" fluid className="carTable below-nav my-5">
  <tbody>
    <tr>
      <td className="car"><CarCell/></td>
      <td className="car"><CarCell/></td>
      <td className="car"><CarCell/></td>
    </tr>
    <tr >
 
      <td className="car"><CarCell/></td>
      <td className="car"><CarCell/></td>
      <td className="car"><CarCell/></td>
    </tr>
    <tr >

      <td className="car"><CarCell/></td>
      <td className="car"><CarCell/></td>
      <td className="car"><CarCell/></td>
    </tr>
  </tbody>
</Table>
</main>

}

export default MyBody;