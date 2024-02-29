<script>
	import Header from '../components/Header.svelte';
	import './styles.css';
	let passwordTom = "123";
	let passwordSaab = "234";
	let user;

	let submit;
	let login = false;

  let formValue = '';

  function handleSubmit(event) {
    // Prevent the form from submitting in the traditional way
    event.preventDefault();

    // Access the form data
    const formData = new FormData(event.target);
    formValue = formData.get('inputName'); // Replace 'inputName' with the name of your form input

    // Here you can do what you need with formValue, like sending it to an API
    console.log(formValue);

		if (formValue === passwordTom || passwordSaab){
			login = true;
			user = formValue;
		};
  }
</script>

<div class="app">
	<Header />

	{#if !login}
		<div class="block">
			<form on:submit={handleSubmit}>
				<input type="text" name="inputName" placeholder="Enter something...">
				<button type="submit">Submit</button>
			</form>
		</div>
	{/if}

	<main>
		<slot />
	</main>
</div>

<style>
	.block {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(51,51,51,0.7);
    z-index: 10;
	}
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
