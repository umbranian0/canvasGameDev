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
		this.currState = this.states.Idle;
		this.currentFrame = 0;
		this.sounds = sounds;
		//Physics properties
		this.accelerationX = 0;
		this.accelerationY = 0;
		this.speedLimit = 5;
		this.friction = 0.96;
		this.bounce = -0.7;
		this.gravity = 0.3;
		this.visible = undefined;

		//Platform game properties   
		this.isOnGround = undefined;
		this.jumpForce = -10;
	
		setup();
	};

	this.update = function () {

		if (this.currState == this.states.ATINGIDO && this.currentFrame == this.frames.length - 1)
			return;

		this.currentFrame = (++this.currentFrame) % this.frames.length;

		this.width = this.frames[this.currentFrame].width * 0.5; //atualizar a altura
		this.height = this.frames[this.currentFrame].height * 0.5; // atualizar os
		this.updateSize();

		if (this.currState === this.states.DISPARAR && this.currentFrame == this.frames.length - 1) {
			this.parar();
		}

	};

	var setup = function () {

		this.eStates.Attack = this.spriteSheet.getStats(this.states.Attack);
		this.eStates.Walk = this.spriteSheet.getStats(this.states.Walk);
		this.eStates.Idle = this.spriteSheet.getStats(this.states.Idle);
		this.eStates.Dead = this.spriteSheet.getStats(this.states.Dead);



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

	this.saltar = function () {
		this.vy += this.jumpForce;
		this.isOnGround = false;
		this.friction = 1;
	}

	this.parar = function () {
		toogleState(this.states.Idle);
		//	this.sounds.DISPARAR.play(false, 1);
	};

	this.morto = function () {
		toogleState(this.states.Dead);
	};

	var toogleState = function (theState) {
		if (this.killed) return;
		if (this.currState != theState) {
			this.currState = theState;
			this.frames = this.eStates[theState];
			this.currentFrame = 0;
		}
	}.bind(this);
});
