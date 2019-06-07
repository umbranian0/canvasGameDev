var Female = Entity.extend(function () {
	this.currState = undefined; // estado atual;

	var podeDisparar = false;

	this.states = {
		Attack: 'Attack',
		Walk: 'Walk',
		Idle: 'Idle',
		Dead: 'Dead'
	};

	this.sounds = {};

	this.constructor = function (spriteSheet, x, y, sounds) {
		this.super();
		this.x = x;
		this.y = y;
		this.spriteSheet = spriteSheet;
		this.currState = this.states.PARADO;
		this.currentFrame = 0;
		this.sounds = sounds;
		setup();
	};

	this.update = function () {

		if (this.currState == this.states.ATINGIDO && this.currentFrame == this.frames.length - 1)
			return;

		this.currentFrame = (++this.currentFrame)%this.frames.length;
		
		this.width = this.frames[this.currentFrame].width; //atualizar a altura
		this.height = this.frames[this.currentFrame].height; // atualizar os
		this.updateSize();
		
		if (this.currState === this.states.DISPARAR && this.currentFrame == this.frames.length - 1) {
			this.parar();
		}

	};

	var setup = function () {

		this.eStates.Attack = this.spriteSheet.getStats('Attack');
		this.eStates.Walk = this.spriteSheet.getStats('Walk');
		this.eStates.Idle = this.spriteSheet.getStats('Idle');
		this.eStates.Dead = this.spriteSheet.getStats('Dead');

		this.frames = this.eStates[this.currState];
		this.width = this.frames[0].width; //atualizar a altura
		this.height = this.frames[0].height; // atualizar os
		// atualizar o array de frames atual

	}.bind(this);

	this.atacar = function () {
		toogleState(this.states.Attack);
	};

	this.andar = function () {
		toogleState(this.states.Walk);
	};

	this.parado = function () {
		toogleState(this.states.Idle);
	//	this.sounds.DISPARAR.play(false, 1);
	};

	this.morto = function () {
		toogleState(this.states.Dead);
	};

	var toogleState = function (theState) {
		if (this.killed)return;
		if (this.currState != theState) {
			this.currState = theState;
			this.frames = this.eStates[theState];
			this.currentFrame = 0;
		}
	}.bind(this);
});
