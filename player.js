function Player(players, playerIds, key, duration){
	//Base player data
	this.playerId;
	this.championId;
	this.role;
	this.lane;
	this.team;
	this.items = new Array();

	//Nested structures
	this.matchup = new Matchup();
	this.gold = new Gold();
	this.creeps = new Creeps();
	this.kda = new Kda();
	this.wards = new Wards();

	this.init = function(players, playerIds, key, duration){
		var participant = players[key];
		var participantId = playerIds[key];
		var timeline = participant['timeline'];
		var stats = participant['stats'];

		//Base variables init
		this.playerId = participantId['player']['summonerId'];
		this.championId = participant['championId'];		
		this.role = timeline['role'];
		this.lane = timeline['lane'];
		this.team = participant['teamId'];

		var items = ['item0', 'item1', 'item2', 'item3', 'item4', 'item5'];
		for(var i in items){
			var item = stats[items[i]];				
			if(item != 0){
				this.items.push(item);
			}
		}			

		//Gold values init
		this.gold.goldTotal = stats['goldEarned'];
		this.gold.goldTen = timeline['goldPerMinDeltas']['zeroToTen'] * 10;
		this.gold.goldPerMin = this.gold.goldTotal * 1.0 / (duration * 1.0 / 60);

		//Creeps values init
		this.creeps.creepsTotal = stats['minionsKilled'];
		this.creeps.creepsTen = timeline['creepsPerMinDeltas']['zeroToTen'] * 10;
		this.creeps.creepsPerMin = this.creeps.creepsTotal * 1.0 / (duration * 1.0 / 60);

		//KDA values init
		this.kda.kills = stats['kills'];
		this.kda.deaths = stats['deaths'];
		this.kda.assists = stats['assists'];
		this.kda.ratio = (this.kda.kills + this.kda.assists) * 1.0 / this.kda.deaths;

		//Wards values init
		this.wards.bought = stats['sightWardsBoughtInGame'] + stats['visionWardsBoughtInGame'];
		this.wards.killed = stats['wardsKilled'];
		this.wards.placed = stats['wardsPlaced'];
		this.wards.wardsPerMin = this.wards.placed * 1.0 / (duration * 1.0 / 60);
	}

	function Matchup(){
		this.matchupId;
		this.csDiffTen;
		this.goldDiffTen;
	}

	function Gold(){
		this.goldTotal;
		this.goldTen;
		this.goldPerMin;
	}

	function Creeps(){
		this.creepsTotal;
		this.creepsTen;
		this.creepsPerMin;
	}

	function Kda(){
		this.kills;
		this.deaths;
		this.assists;
		this.ratio;
	}

	function Wards(){
		this.bought;
		this.killed;
		this.placed;
		this.wardsPerMin;
	}

	this.init(players, playerIds, key, duration);
}