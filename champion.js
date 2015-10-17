function champion(championEntry){		
	this.id;
	this.championJSON;
	this.name;
	this.title;
	this.tags;
	this.numGames;
	this.splashURL;	

	var instance = this;
	this.init = function(){		
		this.id = championEntry.id;
		console.log(this.id);
		this.numGames = championEntry.val;

		$.getJSON("./JSON/info.json", function(json){			
			for(var index in json['data']){
				if(json['data'][index]['id'] == instance.id){
					//console.log("hello");
				}
				// console.log(json['data'][index]);
				// console.log(instance.id);
			}
			instance.name = json['data'];
			
		});
		// instance.name = championJSON['name'];
		// instance.splashURL = 'http://ddragon.leagueoflegends.com/cdn/img/champion/splash/' + instance.name + '_0.jpg';		
		// instance.title = championJSON['title'];			
		// for(var x = 0; x < championJSON['tags'].length; x++){
		// 	instance.tags.push(championJSON['tags'][x]);
		// }		
	};	
}
