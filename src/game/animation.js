game.module(
    'game.animation'
)
.require(
    'engine.core',
    'game.main',
    'game.assets'
)
.body(function(){

game.icon = 'media/icons/video.png';
game.addAsset(game.icon);
game.addAsset('media/papapino_spritesheet.png');
game.addAsset('media/papapino_spine.json');
game.addAsset('media/papapino_spritesheet.json');

Player = game.Class.extend({
    init: function(x, y) {
        this.sprite = new PIXI.Spine('media/papapino_spine.json');
        this.sprite.stateData.setMixByName('walk','stand', 0.1);
        this.sprite.stateData.setMixByName('stand','walk', 0.05);
        this.sprite.stateData.setMixByName('stand','jump', 0.1);
        this.sprite.stateData.setMixByName('walk','jump', 0.1);
        this.sprite.stateData.setMixByName('jump','fall', 0.4);
        this.sprite.stateData.setMixByName('walk','fall', 0.2);
        this.sprite.stateData.setMixByName('fall','walk', 0.1);
        this.sprite.stateData.setMixByName('jump','walk', 0.1);
        this.sprite.stateData.setMixByName('fall','stand', 0.1);
        this.sprite.stateData.setMixByName('stand','duck', 0.1);
        this.sprite.stateData.setMixByName('duck','stand', 0.1);
        this.sprite.position.x = x;
        this.sprite.position.y = y;
        this.changeAnim('walk', true);

        game.scene.stage.addChild(this.sprite);
    },

    changeAnim: function(anim, loop) {
        this.sprite.state.setAnimationByName(anim, !!loop);
    },

    jump: function() {
        if(this.sprite.state.current.name !== 'walk') return;
        
        this.changeAnim('jump');

        var speed = 0.5;
        var up = game.scene.addTween(this.sprite.position, {y: 500}, speed, {easing: game.Tween.Easing.Quadratic.Out, onComplete: this.changeAnim.bind(this,'fall')});
        var down = game.scene.addTween(this.sprite.position, {y: 800}, speed, {easing: game.Tween.Easing.Quadratic.In, onComplete: this.changeAnim.bind(this,'walk',true)});
        up.chain(down);
        up.start();
    }
});

SceneGame = game.Scene.extend({
    init: function() {
        this.player = new Player(game.system.width / 2, 800);

        var word = game.ua.mobile ? 'Touch' : 'Click';
        text = new game.BitmapText(word + ' to jump', {font:'HelveticaNeue'});
        text.position.x = game.system.width / 2 - text.width / 2;
        text.position.y = game.system.height - 50;
        this.stage.addChild(text);

        this.super();
    },

    mousedown: function() {
        this.player.jump();
    }
});

game.start();

});