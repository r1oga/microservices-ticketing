export default ({ title, price, id }) => (
  <tr key={id}>
    <td>{title}</td>
    <td>{price}</td>
  </tr>
)
