function champion(id){
	this.id = id;
	this.name;
	this.splashURL;
	this.title;
	this.tags = new Array();	

	this.initCallback = function(championJSON){
				
	};

	this.init = function(){
		//We need to create an instance variable to be able to reference the champion object from within the XMLHttpRequest object
		var instance = this;
		var oReq = new XMLHttpRequest();
		var championEndpoint = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/" + this.id +  "?champData=tags&api_key=9ec38048-8f55-418a-b5d5-0adf99d032d2";		

		oReq.addEventListener("load", function(){
			var championJSON = JSON.parse(this.response);
			instance.name = championJSON['name'];
			instance.splashURL = 'http://ddragon.leagueoflegends.com/cdn/img/champion/splash/' + instance.name + '_0.jpg';		
			instance.title = championJSON['title'];			
			for(var x = 0; x < championJSON['tags'].length; x++){
				instance.tags.push(championJSON['tags'][x]);
			}
		});
		oReq.open("GET", championEndpoint);
		oReq.send();
	};
	
	this.init();
}