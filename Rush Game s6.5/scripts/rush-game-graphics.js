(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes
lib.webFontTxtFilters = {}; 

// library properties:
lib.properties = {
	width: 480,
	height: 320,
	fps: 24,
	color: "#FFFFFF",
	webfonts: {},
	manifest: []
};



lib.webfontAvailable = function(family) { 
	lib.properties.webfonts[family] = true;
	var txtFilters = lib.webFontTxtFilters && lib.webFontTxtFilters[family] || [];
	for(var f = 0; f < txtFilters.length; ++f) {
		txtFilters[f].updateCache();
	}
};
// symbols:



(lib.coinspixels_1 = function() {
	this.spriteSheet = ss["rush_game_graphics_atlas_"];
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.coinspixels_2 = function() {
	this.spriteSheet = ss["rush_game_graphics_atlas_"];
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.coinspixels_3 = function() {
	this.spriteSheet = ss["rush_game_graphics_atlas_"];
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.obstaclepixels_Layer1 = function() {
	this.spriteSheet = ss["rush_game_graphics_atlas_"];
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.obstaclepixels_Layer2 = function() {
	this.spriteSheet = ss["rush_game_graphics_atlas_"];
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.platform = function() {
	this.spriteSheet = ss["rush_game_graphics_atlas_"];
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.runningpixels_f1 = function() {
	this.spriteSheet = ss["rush_game_graphics_atlas_"];
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.runningpixels_f2 = function() {
	this.spriteSheet = ss["rush_game_graphics_atlas_"];
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.runningpixels_f3 = function() {
	this.spriteSheet = ss["rush_game_graphics_atlas_"];
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.runningpixels_f4 = function() {
	this.spriteSheet = ss["rush_game_graphics_atlas_"];
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.trees = function() {
	this.spriteSheet = ss["rush_game_graphics_atlas_"];
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.PlatformGraphic = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.platform();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,120,12);


(lib.ObstacleGraphic = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.obstaclepixels_Layer1();

	this.instance_1 = new lib.obstaclepixels_Layer2();

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,20,10);


(lib.HeroGraphic = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{run:0,jump:4});

	// timeline functions:
	this.frame_3 = function() {
		this.gotoAndPlay("run");
	}
	this.frame_5 = function() {
		this.gotoAndPlay("jump");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(3).call(this.frame_3).wait(2).call(this.frame_5).wait(1));

	// Layer 1
	this.instance = new lib.runningpixels_f1();

	this.instance_1 = new lib.runningpixels_f2();

	this.instance_2 = new lib.runningpixels_f3();

	this.instance_3 = new lib.runningpixels_f4();

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance}]},1).wait(2));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,14,14);


(lib.CoinGraphic = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.coinspixels_1();

	this.instance_1 = new lib.coinspixels_2();

	this.instance_2 = new lib.coinspixels_3();

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},2).to({state:[{t:this.instance_2}]},2).to({state:[{t:this.instance_1}]},2).wait(2));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,10,10);


(lib.BackgroundGraphic = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.trees();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,600,320);


// stage content:
(lib.RushGameGraphics = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.CoinGraphic();
	this.instance.setTransform(234,148,1,1,0,0,0,5,5);

	this.instance_1 = new lib.ObstacleGraphic();
	this.instance_1.setTransform(322,148,1,1,0,0,0,10,5);

	this.instance_2 = new lib.HeroGraphic();
	this.instance_2.setTransform(279,142,1,1,0,0,0,7,7);

	this.instance_3 = new lib.PlatformGraphic();
	this.instance_3.setTransform(285,159,1,1,0,0,0,60,6);

	this.instance_4 = new lib.BackgroundGraphic();
	this.instance_4.setTransform(300,160,1,1,0,0,0,300,160);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(240,160,600,320);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, createjs, ss;