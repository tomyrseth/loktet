<script>
	import { fade } from "svelte/transition";

	let visible = false
	function expand() {
		visible = !visible
	}

	let tomSquat = 110;
	let tomBench = 80;
	let tomDL = 140;
	let tomOHP = 60;
</script>

<div class = "container1">
	<div class = container2>
		<div on:click={expand}><p>Squat</p></div>
		<div><p>Bench</p></div>
		<div><p>Deadlift</p></div>
		<div><p>Overhead Press</p></div>
	</div>

	{#if visible}
		<div class = "container3" transition:fade|global>
			<div><p>{tomSquat} kg</p></div>
			<div><p>{tomBench} kg</p></div>
			<div><p>{tomDL} kg</p></div>
			<div><p>{tomOHP} kg</p></div>
		</div>
	{/if}

</div>

<style>
    p {
		color: white;
		
	}

	p:hover {
		color: rgb(255, 118, 72);
		cursor: pointer;
		transition: color 0.2s linear;
	}

	.container1 {
		display: flex;
		border: 2px solid white;
		border-radius: 30px;
		background-color: rgb(57, 57, 57);
		padding: 10px 30px 10px 30px;
	}

	.container3 {
		border-left: 2px solid white;
		margin-left: 40px;
		padding-left: 10px;
	}
</style>