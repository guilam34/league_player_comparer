function Champion(championEntry, json){		
	this.id;
	this.name;
	this.title;
	this.tags;
	this.numGames;
	this.splashURL;	
	
	this.init = function(championEntry){				
		this.id = championEntry.championId;
		this.numGames = championEntry.val;			
		for(var index in json['data']){
			if(json['data'][index]['id'] == this.id){
				this.name = json['data'][index]['name'];
				this.title = json['data'][index]['title'];
				this.tags = json['data'][index]['tags'];
				this.splashURL = 'http://ddragon.leagueoflegends.com/cdn/img/champion/splash/' + this.name + '_0.jpg';						
			}				
		}						
	};	

	this.init(championEntry,json);
}
