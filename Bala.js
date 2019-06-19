var Bala = Entity.extend(function () {

	this.exploding = false;
	this.damageLevel = 0;
	this.dir=1;

	this.states = {
		ATIVO: 'Bullet',
		EXPLODIR: 'Muzzle'
	};
	
	this.sounds = {};

	this.constructor = function (spriteSheet, x, y, damageLevel, dir, sons) {
		this.super();
		this.spriteSheet = spriteSheet; // spriteSheet
		this.x = x; //posX inicial
		this.y = y; // posY inicial
		this.currentState = this.states.ATIVO; //estado inicial
		this.currentFrame = 0; //frame inicial
		this.vx = 10;
		this.vy = 0;
		this.damageLevel = damageLevel;
		this.sounds = sons;
		this.dir=dir;
		setup();
	};

	this.update = function () {
		if (!this.active) return;

		this.x -= this.vx*this.dir;
		this.vx -= this.vx > 0 ? 0.005 : 0;

		this.y -= this.vy;

		this.width = this.frames[this.currentFrame].width;
		this.height = this.frames[this.currentFrame].height;
		this.updateSize();

		if (this.currState == this.states.EXPLODIR && this.currentFrame == this.frames.length - 1)
			this.active = false;

		this.currentFrame =  (++this.currentFrame)%this.frames.length;
		 
	};

	var setup = function () {
		this.eStates.ATIVO 		=	this.spriteSheet.getStats('Bullet');
		this.eStates.EXPLODIR	=	this.spriteSheet.getStats('Muzzle');

		this.frames = this.eStates[this.currentState];
		this.width = this.frames[0].width;
		this.height = this.frames[0].height;
	}.bind(this);

	this.explodir = function () {
		if (!this.active || this.exploding) return;

		toogleState(this.states.EXPLODIR);
		this.vx = 0;
		this.vy = 0;
		this.exploding = true;
		this.sounds.NOALVO.play(false, 1);
	};

	var toogleState = function (theState) {
		if (this.currState != theState) {
			this.currState = theState;
			this.frames = this.eStates[theState];
			this.currentFrame = 0;
		}
	}.bind(this);
});
