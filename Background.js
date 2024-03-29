var Background = Entity.extend(function () {
	this.currState = undefined; // estado atual;


	this.states = {
		BACKGROUND: 'background',
		BACKGROUND_2: 'Background_2',
		BACKGROUND_3: 'Background_3',
		BACKGROUND_4: 'Background_4',
		BACKGROUND_5: 'Background_5',
		BACKGROUND_6: 'Background_6',
	};

	this.constructor = function (spriteSheet, x, y) {
		this.super();
		this.x = x;
		this.y = y;
		this.spriteSheet = spriteSheet;
		this.currState = this.states.BACKGROUND_2;
		this.currentFrame = 0;
		this.vx = 0;
		this.vy = 0;
		setup();
	};

	this.update = function () {
		this.x += this.vx;
		if ((this.x) == Math.round(this.width / 3 * 2))
			this.x = 0;

	};

	this.getSprite = function () {
		return this.frames[this.currentFrame];
	};

	var setup = function () {

		this.eStates[this.eStates.BACKGROUND] = this.spriteSheet.getStats('background');

		this.frames = this.eStates[this.eStates.BACKGROUND];
		this.width = this.frames[0].width; //atualizar a altura
		this.height = this.frames[0].height; // atualizar os

	}.bind(this);

	this.changeBackground = function (level) {
	
		this.fadeOutIn(100,level)
	
	}.bind(this);
	
	this.fadeOutIn=function(dur, level){
		const minAlfa=0.15;
		const delta=0.1;
		const maxAlfa=1;
		let dir=-1;
		const alphaTimer = setInterval(function(){
			this.alpha+=delta*dir;
			//console.log(this.alpha)
			if(this.alpha<=minAlfa && dir ===-1){
				dir=1;
				this.eStates['this.eStates.BACKGROUND_' + level] = this.spriteSheet.getStats('Background_' + level);
				this.frames = this.eStates['this.eStates.BACKGROUND_' + level];		
			} else
			if(this.alpha>=maxAlfa&& dir ===1) { 
				//console.log("para", alphaTimer)
				clearInterval(alphaTimer);
				this.alpha=maxAlfa;
			}
		}.bind(this), dur);

	}

	this.andar = function () {
		this.vx = 1;
	};

	this.parar = function () {
		this.vx = 0;
	};

});
