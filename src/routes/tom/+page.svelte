<script>
    import Calendar from "../../components/Calendar.svelte"
		let programsOpen = false;
		function openPrograms() {
			programsOpen = true;
		}
</script>

<svelte:head>
	<title>Tom</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="Menu">
	<div class = "container">
		<button class="programs" on:click={openPrograms}>
			Programs		
		</button>
		<button class="stats">
			Stats		
		</button>
	</div>

	<div class="calendar">
			
	</div>
</div>

<style>
	button {
		transition: .2s;
		color:white;
		background-color: rgb(80, 80, 80);
		border: solid transparent 2px;
		border-radius: 20px;
		padding: 20px;
	}
	button:hover {
		border: solid white 2px;
	}
	button:active {
		background-color: rgb(31, 31, 31);
	}

	.programs {
		display: flex;
	}
	.stats {
		display: flex;
	}



	.container {
		display: flex;
		flex-direction: row;
	}

	.orange {
		color: rgb(255, 89, 33);
	}
</style>