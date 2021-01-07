// var stage = new createjs.Stage('canvasId'),
//     spriteSheet = Object,
//     sprite = Object;
// stage.canvas.width = 300
// stage.canvas.height = 300
// createjs.Ticker.setFPS(30)
// createjs.Ticker.addEventListener("tick", stage)

var common = function() {}

common.prototype = {
    ratio: Number,
    lastUpdateTime: 0,
    curPage: 0,
    turnPageTimeGap: 200, //限制滑屏动作间隔时间
    pageCount: 4, //h5总页数
    firstPageAvailable: 0, //是否可回到首页,1为不可以，0为可以
    /**canvas参数 S */
    draw: true,
    init: function() {
        this.binging()
        this.default_()
        this.resizeFun()
    },
    limitTurnGap: function() {
        var _this = this
        var curTime = Date.now()
        if (curTime <= (_this.lastUpdateTime + _this.turnPageTimeGap)) {
            return false
        } else {
            _this.lastUpdateTime = curTime
            return true
        }
    },
    pageIndexExist: function(index, plus) {
        //页码是否存在
        var _this = this
        if ($('.page_' + index).hasClass('hd')) {
            var nextIndex = index + plus
            _this.pageIndexExist(nextIndex, plus)
        } else {
            _this.goPagedo(index)
        }
    },
    goPagedo: function(toIndex) {
        var _this = this
        _this.curPage = toIndex
        $('.page_' + toIndex).addClass('active').siblings('.page').removeClass('active')
        $('.page_' + toIndex).removeClass('blur')
        setTimeout(function() {
            $('.page_' + toIndex).removeClass('blur').siblings('.page').addClass('blur')
        }, 300)
    },
    prevPage: function() {
        //下一页
        var _this = this
        var index = parseInt($('.page.active').attr('data-page')) - 1
        _this.toPage(index)
    },
    nextPage: function() {
        //上一页
        var _this = this
        var index = parseInt($('.page.active').attr('data-page')) + 1
        _this.toPage(index)
    },
    toPage: function(index) {
        //索引翻页方法
        // 
        var _this = this
        var flag = _this.limitTurnGap()
        if (!flag) return false
        if (index == _this.firstPageAvailable || index > _this.pageCount) return false
        var curIndex = parseInt($('.page.active').attr('data-page'))
        var plus = curIndex > index ? -1 : 1
        var index = index == 0 ? 1 : index
        $('.page_' + curIndex).addClass('blur')
        setTimeout(function() {
            _this.pageIndexExist(index, plus)
        }, 0)
    },
    animFunc: function() {
        // 加载动画
        var _this = this;
        spriteSheet = new createjs.SpriteSheet(_this.data);
        sprite = new createjs.Sprite(spriteSheet, "open")
        stage.addChild(sprite);
        sprite.paused = 1
        // createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;

        stage.update(); //更新舞台 
    },
    default_: function() {
        //默认执行
        var _this = this
        /**
         * 禁止body默认滑动事件
         */
        document.body.style.overflow = 'hidden';

        function _preventDefault(e) {
            e.preventDefault()
        }
        document.addEventListener('touchmove', _preventDefault, {
            passive: false
        });

        /**
         * 微信登录
         **/
        // _this.openid = _this.getCookie('openid-in')
        // this.getUsrInfo(_this.openid)


        $(window).resize(function(event) {
            setTimeout(function() {
                _this.resizeFun()
            }, 200)
        })

    },
    mediaPlay: function(argId){
    var id = argId;
    document.getElementById(id).play();
    if (window.WeixinJSBridge) WeixinJSBridge.invoke('getNetworkType', {}, function(res){ document.getElementById(id).play(); });
    },
    resizeFun: function() {
        //适配短屏与长屏
        var _this = this
        $('body').height($(window).height())
        $('body').removeClass('hightscreen shortscreen portrait')
        _this.ratio = $(window).width() / $(window).height()
        // $('.loading_cover').css('transform','scale('+ _this.ratio + ')')
        if (screenState == 'portrait') {
            $('body').addClass('portrait');
            if (_this.ratio > .62) {
                $('body').addClass('shortscreen')
                if (_this.ratio > .65) {
                    $('body').addClass('xshortscreen')
                }
            } else if (_this.ratio < .56) {
                $('body').addClass('hightscreen')
                if (_this.ratio < .5) {
                    $('body').addClass('xhightscreen')
                }
            }
        }
    },
    checkWechat: function(){
        var bool = false;
        var userAgent = window.navigator.userAgent.toLowerCase();
        if (userAgent.match(/MicroMessenger/i) == 'micromessenger') bool = true;
        return bool;
    },
    checkAndroid: function(){
        var bool = false;
        var userAgent = navigator.userAgent;
        if (userAgent.toLowerCase().indexOf('android') > -1) bool = true;
        return bool;
    },
    //事件绑定
    binging: function() {
        var _this = this;
        $('.goVideo').click(function() {
            _this.toPage(2)
        })
        $('.controlVideo').click(function() {
            _this.mediaPlay('videoPlayer')
        })
        $('.playIcon').click(function() {
            $(this).removeClass('on')
            _this.mediaPlay('videoPlayer')
        })
        $('#videoPlayer').on('play', function() {
            $('.playIcon').removeClass('on')
        })
        $('#videoPlayer').on('ended', function() {
            $('.playIcon').addClass('on')
            _this.toPage(3)
        })
    }
}
var doit = new common()
doit.init()



// loading
var queue = new createjs.LoadQueue(true);

queue.loadManifest([
    "../img/loadingPage.jpg",
    '../img/callPage.jpg',
    '../img/text.png',
    '../img/avator.png',
    '../img/green.png',
    '../img/video.png',
    '../img/cut.png',
    '../img/txt1.png',
    '../img/txt2.png',
    '../img/video.mp4',
    '../img/videoTitle.png',
    '../img/txt3.png',
    '../img/icon.png',
    '../img/5gIcon.png',
    '../img/logo.png',
    '../img/role.png',
    '../img/sloganFinal.png',
    '../img/ball.png',
    '../img/txt4.png',
    '../img/btn.png',
    '../img/finalPage.jpg'
])
queue.on('progress', handleFileLoad, this);
queue.on('complete', handleFileComplete, this);

function handleFileLoad(e) {
    setTimeout(function() {
        var progress = Math.ceil(e.progress * 100)
        // if (progress < 99) {
            $('.loading').css('width', progress + '%')
            $('.loading_ani').css('transform','translateX(' + (0.035 * progress) +'rem)' )
        // }
    }, 1000)
}

function handleFileComplete() {
    setTimeout(function() {
        $('.loadingPage').hide()
        doit.goPagedo(1)
    }, 1000)
}