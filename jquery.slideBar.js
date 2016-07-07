/*
--------------------------------------slideBar滑动杆插件-------------------------------
author:ddd
date:2013.11.14
ver:1.1
describe:zepto,jquery通用
--------------------------------------------------------------------------------------
*/
(function($) {
    "use strict";
    var defalutOpt = {
        max: 100, //最大值
        min: 0, //最小值
        crossC: "#ddd", //划过区域的颜色
        handlerC: "#777", //滑动点的颜色
        defalutNum: 0, //滑动点默认值
        decimal: 0, //保留几位小数
        callBack: function(v) { //滑动时的执行函数
            //console.log(value);
        }
    }
    $.fn.slideBar = function(option) {
        var opt = $.extend({}, defalutOpt, option);
        return this.each(function(e) {
            var $this = $(this); //当前对象
            var value = opt.defalutNum; //当前滑动条对应的数值
            var thisX; //当前元素相对文档的X坐标
            var thisW = $this.width(); //~~元素的宽度
            var handler = $this.find(".handler"); //拉(滑)杆
            var handlerW = handler.width(); //拉(滑)杆的宽度
            var thisText = $("*[name='" + $this.attr("data-cell") + "']"); //数值容器
            var sliderW = thisW - handler.width(); //滑动宽度，（注意：与~~元素的宽度不一样）
            var cross = $this.find(".cross"); //滑过区域
            $this.isSlider = false; //boolean值，是否要开始滑动,默认falses

            init(); //初始化
            if (!isMobile()) { //for pc
                /*拉(滑)杆元素点击之后，isSlider变true,然后开始活动-start--*/
                handler.mousedown(function(evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    console.log('ddd');
                    $this.isSlider = true;
                    /*对文档绑定mousemove事件，滑动就是在该阶段发生*/
                    $(document).on("mousemove", function(e) {
                        thisX = $this.offset().left; //当前元素相对文档的X坐标
                        if (e.pageX <= thisX) {
                            handler.css({
                                left: 0
                            });
                        } else if (e.pageX >= (thisX + thisW - handlerW)) {
                            handler.css({
                                left: thisW - handlerW + "px"
                            });
                        } else {
                            handler.css({
                                left: (e.pageX - thisX) + "px"
                            });
                        }
                        value = (parseFloat(handler.position().left / sliderW) * (opt.max - opt.min) + opt.min).toString();
                        if (value.indexOf(".") > 0 || opt.decimal > 0) {
                            value = value.substr(0, value.indexOf(".") + opt.decimal);
                            if (value < 0) {
                                value = 0
                            }
                        }
                        //window.slideVal=value;//输出给全局变量
                        thisText.val(value);
                        cross.css({
                            width: handler.css("left")
                        });
                        opt.callBack(value);
                    });
                });
                /*拉(滑)杆元素点击之后，isSlider变true,然后开始活动-end--*/
                /*鼠标松开后注销document的mousemove事件*/
                $(document).mouseup(function(e) {
                    $(document).off("mousemove");
                });
            } else { //for mobile
                var handlerInitX = 0;
                handler[0].addEventListener('touchstart', function(event) {
                    event.preventDefault();
                    $this.isSlider = true;
                }, false);
                handler[0].addEventListener('touchend', function(event) {
                    event.preventDefault();
                    $this.isSlider = false;
                }, false);
                handler[0].addEventListener('touchmove', function(event) {
                    event.preventDefault();
                    if (!$this.isSlider) {
                        return;
                    }
                    thisX = $this.offset().left; //当前元素相对文档的X坐标
                    if (event.targetTouches[0].pageX <= thisX) {
                        handler.css({
                            left: 0
                        });
                    } else if (event.targetTouches[0].pageX >= (thisX + thisW - handlerW)) {
                        handler.css({
                            left: thisW - handlerW + "px"
                        });
                    } else {
                        handler.css({
                            left: (event.targetTouches[0].pageX - thisX) + "px"
                        });
                    }
                    value = (parseFloat(handler.position().left / sliderW) * (opt.max - opt.min) + opt.min).toString();
                    if (value.indexOf(".") > 0 || opt.decimal > 0) {
                        value = value.substr(0, value.indexOf(".") + opt.decimal);
                        if (value < 0) {
                            value = 0
                        }
                    }
                    //window.slideVal=value;//输出给全局变量
                    thisText.val(value);
                    cross.css({
                        width: handler.css("left")
                    });
                    opt.callBack(value);

                }, false);
            }
            //初始化函数
            function init() {
                thisText.on('change', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    value = $(this).val();
                    handler.css({
                        left: ([(value - opt.min) / (opt.max - opt.min)] * sliderW) + "px",
                        backgroundColor: opt.handlerC
                    });
                    cross.css({
                        backgroundColor: opt.crossC,
                        width: handler.css("left")
                    });
                    opt.callBack(value);

                });
                thisText.val(opt.defalutNum).trigger('change');
            }

            function isMobile() { //是否为移动终端
                var u = navigator.userAgent;
                if (u.match(/AppleWebKit.*Mobile.*/)) {
                    return true;
                } else {
                    return false;
                }
            }
        });
    }
})(typeof(Zepto) != 'undefined' ? Zepto : jQuery);
