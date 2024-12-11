<script>
  export let data;
  console.log('elo', data.data[0]);
  const food = data.data[0];

</script>

<h1>Ingredient database</h1>
<h1 style='color:white'>{data.data[0]}</h1>

<!--
<table>
  <tr>
  {#each Object.keys(food) as key}
    <th>{key}</th>
  {/each}

  </tr>
  <tr>
    {#each Object.values(food) as value}
      <td>{value}</td>
    {/each}
  </tr>
</table> 
-->

<style>
  h1 {
    color: white;
  }

  table {
    color: white;
    background-color: rgba(0, 0, 0, 0.393);
  }

  th {
    padding: 20px;
  }
  tr:hover {
    background-color: #ffffff34;
  }

  tr {
    border-bottom: 1px solid #ddd;
  }
</style>
