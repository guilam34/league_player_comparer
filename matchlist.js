function matchlist(matchlistJSON, callback){	
	this.matches = [];
	this.roleTracker = new Array();
	this.roleTracker.push({name: 'TOP', val: 0});
	this.roleTracker.push({name: 'JUNGLE', val: 0});
	this.roleTracker.push({name: 'MID', val: 0});
	this.roleTracker.push({name: 'CARRY', val: 0});
	this.roleTracker.push({name: 'SUPPORT', val: 0});	
	this.championTracker = new Array();
	this.numberOfMatches = matchlistJSON['totalGames'];

	var instance = this;
	this.init = function(){
		for(var key in matchlistJSON['matches']){		
			this.matches.push(new match(matchlistJSON['matches'][key]));
			var lastMatch = this.matches[this.matches.length-1];
			switch(lastMatch.lane){
				case "TOP":
					this.roleTracker[0].val++;
					break;			
				case "JUNGLE":
					this.roleTracker[1].val++;
					break;
				case "MID":
					this.roleTracker[2].val++;
					break;
				case "DUO_CARRY":
					this.roleTracker[3].val++;
					break;
				case "DUO_SUPPORT":
					this.roleTracker[4].val++;
					break;
				default:
			}
			if(!(lastMatch.championId in this.championTracker)){
				this.championTracker.push({championId: lastMatch.championId, val: 1});
			}else{
				for(var key in this.championTracker){
					if(this.championTracker[key].championId == lastMatch.championId){
						this.championTracker[key].val++;
						break;
					}
				}
			}
		}
		this.championTracker.sort(function(a,b){
			return b.val-a.val;
		});
		this.roleTracker.sort(function(a,b){
			return b.val-a.val;
		});
	};
	
	this.favChampions = function(numChampions, callback){
		if(typeof(numChampions) == 'undefined'){
			numChampions = 10;
		}
		var currentChampion;
		var favoriteChampions = new Array();
		$.getJSON("./JSON/info.json", function(json){
			for(var x = 0; x < numChampions; x++){
				currentChampion = new champion(instance.championTracker[x],json);			
				favoriteChampions.push(currentChampion);
			}				
			callback(favoriteChampions);
		});				
	};	

	this.bestWinChampions = function(minGames){
		if(typeof(minGames) == 'undefined'){
			minGames = 5;
		}
	};

	this.bestKDAChampions = function(minGames){
		if(typeof(minGames) == 'undefined'){
			minGames = 5;
		}
	};	
	this.init();	
	callback();
}

function match(matchJSON){	
	this.matchId = matchJSON['matchId'];
	this.championId = matchJSON['champion'];
	this.timestamp = matchJSON['timestamp'];	

	if(matchJSON['lane'] == "BOTTOM"){
		this.lane = matchJSON['role'];
	}else{
		this.lane = matchJSON['lane'];
	}
}
