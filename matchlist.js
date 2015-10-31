function Matchlist(matchlistJSON, playerId, callback){	
	this.matches = [];
	this.roleTracker = new Array();
	this.roleTracker.push({name: 'TOP', val: 0});
	this.roleTracker.push({name: 'JUNGLE', val: 0});
	this.roleTracker.push({name: 'MID', val: 0});
	this.roleTracker.push({name: 'CARRY', val: 0});
	this.roleTracker.push({name: 'SUPPORT', val: 0});	
	this.championTracker = new Array();
	this.numGames = matchlistJSON['totalGames'];

	var instance = this;
	this.init = function(callback){
		for(var key in matchlistJSON['matches']){	
			if(key < 10){	
				var matchNum = key;			
				var matchJSON;				
				var oReq = new XMLHttpRequest({mozSystem: true});
				var matchEndpoint = "https://na.api.pvp.net/api/lol/na/v2.2/match/" + matchlistJSON['matches'][key]['matchId'] + "?api_key=9ec38048-8f55-418a-b5d5-0adf99d032d2";
				
				oReq.addEventListener("load", function(){					
					matchJSON = JSON.parse(this.response);						
					instance.matches.push(new Match(matchJSON, matchlistJSON['matches'][matchNum]['matchId'], playerId, matchNum));
					
					var newest_match = instance.matches[instance.matches.length - 1];
					
					if(newest_match.mainPlayer.lane == "TOP")
						instance.roleTracker[0].val++;
					else if(newest_match.mainPlayer.role == "DUO_CARRY")
						instance.roleTracker[3].val++;
					else if(newest_match.mainPlayer.role == "DUO_SUPPORT")
						instance.roleTracker[4].val++;
					else if(newest_match.mainPlayer.lane == "JUNGLE")
						instance.roleTracker[1].val++;
					else if(newest_match.mainPlayer.lane == "MIDDLE")
						instance.roleTracker[2].val++;
																

					var found = false;
					for(var entry in instance.championTracker){
						if(instance.championTracker[entry].championId == newest_match.mainPlayer.championId){
							instance.championTracker[entry].val++;
							found = true;
							break;
						}
					}

					if(!found){
						instance.championTracker.push({championId: newest_match.mainPlayer.championId, val: 1});
					}					
					console.log(newest_match);
					if(instance.matches.length == 8){						
						callback();
					}
				});

				oReq.open("GET", matchEndpoint, true);
				oReq.send();				
			}				
		}								
	};
	
	this.favChampions = function(callback){
		var curChampion;
		var favChampions = new Array();

		$.getJSON("./JSON/info.json", function(json){
			for(var x = 0; x < instance.championTracker.length; x++){
				curChampion = new Champion(instance.championTracker[x],json);			
				favChampions.push(curChampion);
			}	

			favChampions.sort(function(a, b){
				return b.numGames - a.numGames;
			});		

			callback(favChampions);
		});				
	};	

	this.favRoles = function(callback){
		var favRoles = new Array();

		for(var x = 0; x < this.roleTracker.length; x++){
			var formatted_name = this.roleTracker[x].name.toLowerCase();
			formatted_name = formatted_name.charAt(0).toUpperCase() + formatted_name.slice(1);
			if(formatted_name == 'Carry'){
				formatted_name = 'AD ' + formatted_name;
			}

			favRoles.push({
				name: formatted_name,
				val: this.roleTracker[x].val,
				pct: (this.roleTracker[x].val * 1.0) / this.numGames
			});
		}

		favRoles.sort(function(a, b){
			return b.val - a.val;
		});

		callback(favRoles);
	};	

	this.kdaStats = function(callback){
		var kdaStats = new Array(
			{"category" : "Average KDA", "val" : 0},
			{"category" : "Kills Per Game", "val" : 0},
			{"category" : "Deaths Per Game", "val" : 0},
			{"category" : "Assists Per Game", "val" : 0}			
		);

		for(var i = 0; i < this.matches.length; i++){
			kdaStats[1].val += this.matches[i].mainPlayer.kda.kills * 1.0 / this.matches.length;
			kdaStats[2].val += this.matches[i].mainPlayer.kda.deaths * 1.0 / this.matches.length;
			kdaStats[3].val += this.matches[i].mainPlayer.kda.assists * 1.0 / this.matches.length;			
		}

		kdaStats[0].val = (kdaStats[1].val + kdaStats[3].val) * 1.0 / kdaStats[2].val;
		
		callback(kdaStats);
	}

	this.matchupStats = function(callback){
		var matchupStats = new Array(			
			{"category" : "Average CS Difference at Ten", "val" : 0},
			{"category" : "Average Gold Difference at Ten", "val" : 0}
		);

		for(var i = 0; i < this.matches.length; i++){
			matchupStats[0].val += this.matches[i].mainPlayer.matchup.csDiffTen * 1.0 / this.matches.length;
			matchupStats[1].val += this.matches[i].mainPlayer.matchup.goldDiffTen * 1.0 / this.matches.length;			
		}

		callback(matchupStats);
	}

	this.creepsStats = function(callback){
		var creepsStats = new Array(			
			{"category" : "Average CS Per Game", "val" : 0},
			{"category" : "Average CS at Ten", "val" : 0},
			{"category" : "Average CS Per Min", "val" : 0}
		);

		for(var i = 0; i < this.matches.length; i++){
			creepsStats[0].val += this.matches[i].mainPlayer.creeps.creepsTotal * 1.0 / this.matches.length;
			creepsStats[1].val += this.matches[i].mainPlayer.creeps.creepsTen * 1.0 / this.matches.length;			
			creepsStats[2].val += this.matches[i].mainPlayer.creeps.creepsPerMin * 1.0 / this.matches.length;
		}

		callback(creepsStats);
	}

	this.goldStats = function(callback){
		var goldStats = new Array(
			{"category" : "Average Gold Per Game", "val" : 0},
			{"category" : "Average Gold at 10 Minutes", "val" : 0},
			{"category" : "Average Gold Per Min", "val" : 0}
		);

		for(var i = 0; i < this.matches.length; i++){
			goldStats[0].val += this.matches[i].mainPlayer.gold.goldTotal * 1.0 / this.matches.length;
			goldStats[1].val += this.matches[i].mainPlayer.gold.goldTen * 1.0 / this.matches.length;
			goldStats[2].val += this.matches[i].mainPlayer.gold.goldPerMin * 1.0 / this.matches.length;
		}

		callback(goldStats);
	}

	this.wardsStats = function(callback){
		var wardsStats = new Array(			
			{"category" : "Wards Bought Per Game", "val" : 0},
			{"category" : "Wards Placed Per Game", "val" : 0},
			{"category" : "Wards Killed Per Game", "val" : 0},
			{"category" : "Wards Placed Per Min", "val" : 0}
		);

		for(var i = 0; i < this.matches.length; i++){
			wardsStats[0].val += this.matches[i].mainPlayer.wards.bought * 1.0 / this.matches.length;
			wardsStats[1].val += this.matches[i].mainPlayer.wards.placed * 1.0 / this.matches.length;			
			wardsStats[2].val += this.matches[i].mainPlayer.wards.killed * 1.0 / this.matches.length;
			wardsStats[3].val += this.matches[i].mainPlayer.wards.wardsPerMin * 1.0 / this.matches.length;

		}

		callback(wardsStats);
	}

	this.init(callback);	
}

function Match(matchJSON, matchId, playerId, counter){		
	this.mainPlayer;
	this.matchId = matchId;		
	this.duration;	
	this.playerList = new Array();

	for(var key in matchJSON['participants']){				
		var player = new Player(matchJSON['participants'], matchJSON['participantIdentities'], key, matchJSON['matchDuration']);
		if(player.playerId == playerId){
			this.mainPlayer = player;
		}
		this.playerList.push(player);
	}

	for(var x in this.playerList){
		var playerOne = this.playerList[x];
		for(var y in this.playerList){
			var playerTwo = this.playerList[y];
			if(playerOne.role == playerTwo.role && playerOne.team != playerTwo.team){
				playerOne.matchup.matchupId = playerTwo.playerId;
				playerOne.matchup.csDiffTen = playerOne.creeps.creepsTen - playerTwo.creeps.creepsTen;
				playerOne.matchup.goldDiffTen = playerOne.gold.goldTen  - playerTwo.gold.goldTen;

				playerTwo.matchup.matchupId = playerOne.playerId;
				playerTwo.matchup.csDiffTen = playerTwo.creeps.creepsTen - playerOne.creeps.creepsTen;
				playerTwo.matchup.goldDiffTen = playerTwo.gold.goldTen - playerOne.gold.goldTen;
			}
		}
	}			
}
