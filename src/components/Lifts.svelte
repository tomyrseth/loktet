<script>

	const upperLifts = ["Flat Bench", "Incline Bench", "OHP", "Pullup", "Weighted Pullup", "Tri iso", "Bicep iso", "Front/Side delt iso", "Rear delt iso"]
	const lowerLifts = ["Squat", "Deadlift", "Quad iso", "Ham iso", "Calves"]

</script>

<div class = "container">

	<button class="programs">
		Programs		
	</button>
	<button class="stats">
		Stats		
	</button>

</div>

<style>
    p {
		color: white;
		
	}
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