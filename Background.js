var Background = Entity.extend(function () {
	this.currState = undefined; // estado atual;


	this.states = {
		BACKGROUND: 'background',
		BACKGROUND_2: 'Background_2',
                BACKGROUND_3: 'Background_3',
                BACKGROUND_4: 'Background_4',
                BACKGROUND_5: 'Background_5',
                BACKGROUND_6: 'Background_6'
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
		//this.eStates[this.eStates.BACKGROUND_2] = this.spriteSheet.getStats('background_2');

		this.frames = this.eStates[this.eStates.BACKGROUND];
		this.width = this.frames[0].width; //atualizar a altura
		this.height = this.frames[0].height; // atualizar os

	}.bind(this);

	this.changeBackground1 = function () {

		this.eStates[this.eStates.BACKGROUND_2] = this.spriteSheet.getStats('Background_2');
		this.frames = this.eStates[this.eStates.BACKGROUND_2];
		this.width = this.frames[0].width; //atualizar a altura
		this.height = this.frames[0].height; // atualizar os
	}
        this.changeBackground2 = function () {

		this.eStates[this.eStates.BACKGROUND_3] = this.spriteSheet.getStats('Background_3');
		this.frames = this.eStates[this.eStates.BACKGROUND_3];
		this.width = this.frames[0].width; //atualizar a altura
		this.height = this.frames[0].height; // atualizar os
	}
        this.changeBackground3 = function () {

		this.eStates[this.eStates.BACKGROUND_4] = this.spriteSheet.getStats('Background_4');
		this.frames = this.eStates[this.eStates.BACKGROUND_4];
		this.width = this.frames[0].width; //atualizar a altura
		this.height = this.frames[0].height; // atualizar os
	}
this.changeBackground4 = function () {

		this.eStates[this.eStates.BACKGROUND_5] = this.spriteSheet.getStats('Background_5');
		this.frames = this.eStates[this.eStates.BACKGROUND_5];
		this.width = this.frames[0].width; //atualizar a altura
		this.height = this.frames[0].height; // atualizar os
	}
this.changeBackground5 = function () {

		this.eStates[this.eStates.BACKGROUND_6] = this.spriteSheet.getStats('Background_6');
		this.frames = this.eStates[this.eStates.BACKGROUND_6];
		this.width = this.frames[0].width; //atualizar a altura
		this.height = this.frames[0].height; // atualizar os
	}
	this.andar = function () {
		this.vx = 1;
	};

	this.parar = function () {
		this.vx = 0;
	};

});
