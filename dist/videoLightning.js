"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

(function (document) {
  var _this = this;

  var dom = document; // SETUP

  var videoLightning = function videoLightning(obj) {
    var el;

    var noElErr = function noElErr() {
      console.error('VideoLightning was initialized without elements.');
    };

    var optEls = obj.elements || obj.element;

    if (!optEls) {
      return noElErr();
    }

    var rawEls = [];
    var els = [];

    var pushRawEls = function pushRawEls(e) {
      if (_isStr(e)) {
        return rawEls.push({
          el: e,
          opts: null
        });
      } else {
        var _el = _topKeyOfObj(e);

        return rawEls.push({
          el: _el,
          opts: e[_el] || null
        });
      }
    };

    if (_isAry(optEls)) {
      for (var _i = 0, _Array$from = Array.from(optEls); _i < _Array$from.length; _i++) {
        var e = _Array$from[_i];
        pushRawEls(e);
      }
    } else {
      pushRawEls(optEls);
    }

    for (var _i2 = 0, _Array$from2 = Array.from(rawEls); _i2 < _Array$from2.length; _i2++) {
      el = _Array$from2[_i2];
      var domEls;

      if (domEls = _getEl(el.el)) {
        if (_isElAry(domEls)) {
          for (var _i3 = 0, _Array$from3 = Array.from(domEls); _i3 < _Array$from3.length; _i3++) {
            var de = _Array$from3[_i3];
            els.push({
              el: de,
              opts: el.opts
            });
          }
        } else {
          els.push({
            el: domEls,
            opts: el.opts
          });
        }
      }
    }

    if (els.length === 0) {
      return noElErr();
    }

    var settings = obj.settings || {};

    for (var _i4 = 0, _Array$from4 = Array.from(els); _i4 < _Array$from4.length; _i4++) {
      el = _Array$from4[_i4];

      if (el) {
        _this.vlData.instances.push(new VideoLightning(el, settings));
      }
    }

    _initYTAPI();
  }; // VideoLightning Class


  var VideoLightning = /*#__PURE__*/function () {
    function VideoLightning(elObj, opts) {
      _classCallCheck(this, VideoLightning);

      this.buildOpts = this.buildOpts.bind(this);
      this.buildEls = this.buildEls.bind(this);
      this.popoverPos = this.popoverPos.bind(this);
      this.resize = this.resize.bind(this);
      this.regEvents = this.regEvents.bind(this);
      this.clicked = this.clicked.bind(this);
      this.hovered = this.hovered.bind(this);
      this.peek = this.peek.bind(this);
      this.play = this.play.bind(this);
      this.stop = this.stop.bind(this);
      this.clear = this.clear.bind(this);
      this.show = this.show.bind(this);
      this.hide = this.hide.bind(this);
      this.cover = this.cover.bind(this);
      this.initPlayerYT = this.initPlayerYT.bind(this);
      this.setYTPlayer = this.setYTPlayer.bind(this);
      this.ytPlay = this.ytPlay.bind(this);
      this.ytStop = this.ytStop.bind(this);
      this.ytState = this.ytState.bind(this);
      this.coverYT = this.coverYT.bind(this);
      this.initPlayerVM = this.initPlayerVM.bind(this);
      this.vmListen = this.vmListen.bind(this);
      this.vmPlay = this.vmPlay.bind(this);
      this.vmStop = this.vmStop.bind(this);
      this.elObj = elObj;
      this.opts = _extObj({}, opts);
      this.inst = _randar();
      this.el = this.elObj.el;
      this.buildOpts();
      this.buildEls();

      if (_boolify(this.opts.cover, false)) {
        this.cover();
      }

      this.regEvents();
    }

    _createClass(VideoLightning, [{
      key: "buildOpts",
      value: function buildOpts() {
        var _this2 = this;

        var k, v;
        var remap = [['backdrop_color', 'bdColor'], ['backdrop_opacity', 'bdOpacity'], ['ease_in', 'fadeIn'], ['ease_out', 'fadeOut'], ['glow_color', 'glowColor'], ['start_time', 'startTime'], ['z_index', 'zIndex'], ['rick_roll', 'rickRoll'], ['iv_load_policy', 'ivLoadPolicy']];

        _extObj(this.opts, this.elObj.opts);

        var elDataSet = this.el.dataset || [];

        if (elDataSet.length === 0) {
          for (var _i5 = 0, _arr = ['id', 'width', 'height']; _i5 < _arr.length; _i5++) {
            k = _arr[_i5];
            v = this.el.getAttribute("data-video-".concat(k));

            if (v) {
              elDataSet[k] = v;
            }
          }
        }

        var normalize = function normalize(k, v) {
          return _this2.opts[k.replace(/^video(.)(.*)/, function (a, b, c) {
            return b.toLowerCase() + c;
          })] = v;
        };

        for (k in elDataSet) {
          v = elDataSet[k];
          normalize(k, v);
        }

        this.opts.width = this.opts.width ? parseInt(this.opts.width, 10) : 640;
        this.opts.height = this.opts.height ? parseInt(this.opts.height, 10) : 390;
        var display_ratio = this.opts.height / this.opts.width;

        if (!this.opts.fullscreenAllowed && this.opts.width > window.innerWidth - 90) {
          this.opts.width = window.innerWidth - 90;
          this.opts.height = Math.round(display_ratio * this.opts.width);
        }

        if (this.opts.id == null) {
          this.opts.id = 'y-dQw4w9WgXcQ';
        }

        if (this.opts.id.match(/^v/)) {
          this.vendor = 'vimeo';
          this.vm = true;
        } else if (this.opts.id.match(/^f/)) {
          this.vendor = 'iframe';
          this.ifr = true;
        } else {
          this.vendor = 'youtube';
          this.yt = true;
        }

        window.vlData[this.vendor] = true;
        this.id = this.opts.id.replace(/([vyf]-)/i, '');
        return Array.from(remap).map(function (key) {
          return _this2.opts[key[1]] != null ? _this2.opts[key[1]] : _this2.opts[key[1]] = _this2.opts[key[0]];
        });
      }
    }, {
      key: "buildEls",
      value: function buildEls() {
        var g;
        (this.target = dom.createElement('span')).className = 'video-target';
        this.el.parentNode.insertBefore(this.target, this.el);
        this.target.appendChild(this.el);

        var bdc = _cc(_val(this.opts.bdColor, '#ddd'));

        var bdo = _val(this.opts.bdOpacity, 0.6);

        var bdbg = "background: rgba(".concat(bdc.r, ", ").concat(bdc.g, ", ").concat(bdc.b, ", ").concat(bdo, ");");
        var fdim = "width: ".concat(this.opts.width, "px; height: ").concat(this.opts.height, "px;");
        var fmar = "margin-top: -".concat(this.opts.height / 2, "px; margin-left: -").concat(this.opts.width / 2, "px;");
        var fglo = "box-shadow: 0px 0px ".concat(g = _val(this.opts.glow, 20), "px ").concat(g / 5, "px ").concat(_fullHex(_val(this.opts.glowColor, '#000')), ";");
        var wrapCss = _boolify(this.opts.popover, false) ? _wrapCssP(this.opts.width, this.opts.height) : _wrapCss;
        var xCss = "background: ".concat(_fullHex(_val(this.opts.xBgColor, '#000')), "; color: ").concat(_fullHex(_val(this.opts.xColor, '#fff')), "; border: ").concat(_val(this.opts.xBorder, 'none'), "; box-sizing: border-box;");
        var frameCss = "background: ".concat(_fullHex(_val(this.opts.frameColor, '#000')), "; border: ").concat(_val(this.opts.frameBorder, 'none'), "; box-sizing: border-box;");
        this.target.insertAdjacentHTML('beforeend', _domStr({
          tag: 'div',
          attrs: {
            id: "wrap_".concat(this.inst),
            "class": 'video-wrapper',
            style: "".concat(wrapCss, " ").concat(bdbg, " z-index: ").concat(_val(this.opts.zIndex, 2100), "; opacity: 0;")
          },
          children: [{
            tag: 'div',
            attrs: {
              "class": 'video-frame',
              style: "".concat(_frameCss, " ").concat(fdim, " ").concat(fmar, " ").concat(fglo)
            },
            children: [{
              tag: 'div',
              attrs: {
                "class": 'video'
              },
              children: [{
                tag: 'div',
                inner: '&times;',
                attrs: {
                  id: "close_".concat(this.inst),
                  "class": 'video-close',
                  style: "float: right; margin-right: -34px; ".concat(fglo, " ").concat(xCss, " padding: 0 10px 0 12px; font-size: 25px;")
                }
              }, {
                tag: 'iframe',
                // "#{if @yt then 'div' else 'iframe'}"
                attrs: {
                  type: 'text/html',
                  id: "iframe_".concat(this.inst),
                  "class": 'video-iframe',
                  style: "position: absolute; top: 0; left: 0; ".concat(frameCss)
                }
              }]
            }]
          }]
        }));
        this.wrapper = dom.getElementById("wrap_".concat(this.inst));
        this.iframe = dom.getElementById("iframe_".concat(this.inst));
        return this.close = dom.getElementById("close_".concat(this.inst));
      }
    }, {
      key: "popoverPos",
      value: function popoverPos() {
        var pos = _gravity(this.target, this.opts.width, this.opts.height, this.opts.fluidity);

        this.wrapper.style.left = "".concat(pos.x, "px");
        return this.wrapper.style.top = "".concat(pos.y, "px");
      }
    }, {
      key: "resize",
      value: function resize() {
        if (!window.vlData.throttle) {
          this.popoverPos();

          if (this.opts.throttle) {
            window.vlData.throttle = true;

            var throttleOff = function throttleOff() {
              return window.vlData.throttle = false;
            };

            return setTimeout(throttleOff, this.opts.throttle);
          }
        }
      }
    }, {
      key: "regEvents",
      value: function regEvents() {
        this.target.style.cursor = 'pointer';
        this.target.addEventListener('mouseup', this.clicked, false);

        if (_boolify(this.opts.popover, false)) {
          window.addEventListener('resize', this.resize, false);
          window.addEventListener('scroll', this.resize, false);
          window.addEventListener('orientationchange', this.resize, false);

          if (this.opts.peek) {
            this.target.addEventListener('mouseenter', this.hovered, false);
            return this.target.addEventListener('mouseleave', this.hovered, false);
          }
        }
      }
    }, {
      key: "clicked",
      value: function clicked(e) {
        if (this.peeking) {
          return this.peek(false, true);
        }

        if (e.buttons && e.buttons !== 1 || e.which && e.which !== 1 || e.button && e.button !== 1) {
          return;
        }

        if (this.playing) {
          return this.stop();
        } else {
          return this.play();
        }
      }
    }, {
      key: "hovered",
      value: function hovered(e) {
        if (e.type === 'mouseenter' && !this.playing) {
          this.peek();
        }

        if (e.type === 'mouseleave' && this.playing) {
          return this.peek(this.peeking);
        }
      }
    }, {
      key: "peek",
      value: function peek(close, pin) {
        if (close == null) {
          close = false;
        }

        if (pin == null) {
          pin = false;
        }

        if (!this.peeking && this.playing) {
          return;
        }

        this.close.innerHTML = close || pin ? '&times;' : '&#94;';
        this.peeking = !close || pin;

        if (close) {
          return this.stop();
        } else if (pin) {
          return null;
        } else {
          return this.play();
        }
      }
    }, {
      key: "play",
      value: function play() {
        if (_boolify(this.opts.popover, false)) {
          this.popoverPos();
        }

        this.show();

        if (this.ifr) {
          _setSrc(this.iframe, {
            url: encodeURI(this.id),
            attrs: {
              width: this.opts.width,
              height: this.opts.height,
              frameBorder: 0
            }
          });
        } else if (this.ready && !this.playing && this.iframe.src !== 'about:blank') {
          if (this.yt) {
            this.ytPlay();
          }

          if (this.vm) {
            this.vmPlay();
          }
        } else if (!this.playing) {
          if (this.vm) {
            this.initPlayerVM();
          }

          if (this.yt) {
            this.initPlayerYT();
          }
        }

        this.playing = true;

        if (this.clearAfter) {
          window.clearTimeout(this.clearAfter);
        }
      }
    }, {
      key: "stop",
      value: function stop(fade) {
        if (fade == null) {
          fade = 0;
        }

        if (_boolify(this.opts.rickRoll, false)) {
          return;
        }

        this.hide(fade);

        if (this.ready) {
          if (this.yt) {
            this.ytStop();
          }

          if (this.vm) {
            this.vmStop();
          }
        } else {
          this.clear();
        }

        this.playing = false;

        if (_boolify(this.opts.unload, true)) {
          this.clearAfter = window.setTimeout(this.clear, (_val(this.opts.unloadAfter) || 45) * 1000);
        }
      }
    }, {
      key: "clear",
      value: function clear() {
        this.iframe.src = 'about:blank';
      }
    }, {
      key: "show",
      value: function show() {
        _fadeIn(this.wrapper, _val(this.opts.fadeIn, 300));
      }
    }, {
      key: "hide",
      value: function hide(fade) {
        if (fade == null) {
          fade = 0;
        }

        _fadeOut(this.wrapper, _val(this.opts.fadeOut, fade));
      }
    }, {
      key: "cover",
      value: function cover() {
        if (this.yt) {
          this.coverYT();
        }
      }
    }, {
      key: "initPlayerYT",
      value: function initPlayerYT() {
        this.iframe.setAttribute('allow', 'fullscreen; autoplay');

        _setSrc(this.iframe, {
          url: "https://www.youtube.com/embed/".concat(this.id),
          params: {
            enablejsapi: 1,
            autoplay: _bitify(this.opts.autoplay, 1),
            autohide: _val(this.opts.autohide, 2),
            cc_load_policy: _val(this.opts.ccLoadPolicy, 0),
            color: _val(this.opts.color, null),
            controls: _val(this.opts.controls, 2),
            disablekb: _val(this.opts.disablekb, 0),
            end: _val(this.opts.endTime, null),
            fs: _val(this.opts.fs, 1),
            hl: _val(this.opts.hl, 'en'),
            iv_load_policy: _val(this.opts.ivLoadPolicy, 1),
            list: _val(this.opts.list, null),
            listType: _val(this.opts.listType, null),
            loop: _val(this.opts.loop, 0),
            modestbranding: _val(this.opts.modestbranding, 0),
            origin: encodeURIComponent(_val(this.opts.origin, "".concat(location.protocol, "//").concat(location.host))),
            playerapiid: this.inst,
            playlist: _val(this.opts.playlist, null),
            playsinline: _val(this.opts.playsinline, 0),
            rel: _val(this.opts.rel, 0),
            showinfo: _val(this.opts.showinfo, 1),
            start: _val(this.opts.startTime, 0),
            theme: _val(this.opts.theme, null)
          },
          attrs: {
            width: this.opts.width,
            height: this.opts.height,
            frameBorder: 0
          }
        });

        if (window.vlData.ytAPIReady) {
          return this.setYTPlayer();
        }
      }
    }, {
      key: "setYTPlayer",
      value: function setYTPlayer() {
        var _this3 = this;

        var ready = function ready() {
          return _this3.ready = true;
        };

        return this.ytPlayer != null ? this.ytPlayer : this.ytPlayer = new YT.Player("iframe_".concat(this.inst), {
          events: {
            onReady: ready,
            onStateChange: this.ytState
          }
        });
      }
    }, {
      key: "ytPlay",
      value: function ytPlay() {
        return this.ytPlayer.playVideo();
      }
    }, {
      key: "ytStop",
      value: function ytStop() {
        _ytReset(this.ytPlayer, this.opts.startTime);

        this.ytPlayer.stopVideo();
        this.ytPlayer.clearVideo();

        if (this.opts.startTime) {
          this.clear();
        }
      }
    }, {
      key: "ytState",
      value: function ytState(e) {
        if (e.data === 0 && _boolify(this.opts.autoclose, true)) {
          return this.stop(_val(this.opts.fadeOut, 1000));
        }
      }
    }, {
      key: "coverYT",
      value: function coverYT() {
        this.ytCover = _coverEl(this.target, "//img.youtube.com/vi/".concat(this.id, "/hqdefault.jpg"));
      }
    }, {
      key: "initPlayerVM",
      value: function initPlayerVM() {
        this.iframe.setAttribute('allowFullScreen', '');

        _setSrc(this.iframe, {
          url: "https://player.vimeo.com/video/".concat(this.id),
          params: {
            autoplay: _bitify(this.opts.autoplay, 1),
            loop: _val(this.opts.loop, 0),
            title: _val(this.opts.showinfo, 1),
            byline: _val(this.opts.byline, 1),
            portrait: _val(this.opts.portrait, 1),
            color: _prepHex(_val(this.opts.color, '#00adef')),
            api: 1,
            player_id: this.inst
          },
          attrs: {
            width: this.opts.width,
            height: this.opts.height,
            frameBorder: 0
          }
        });

        window.addEventListener('message', this.vmListen, false);
        return this.vmPlayer != null ? this.vmPlayer : this.vmPlayer = this.iframe;
      }
    }, {
      key: "vmListen",
      value: function vmListen(msg) {
        var data = JSON.parse(msg.data);

        if (data.player_id !== this.inst) {
          return;
        }

        switch (data.event) {
          case 'ready':
            this.ready = true;

            _postToVM(this.vmPlayer, this.id, 'addEventListener', 'finish');

            break;

          case 'finish':
            this.stop(1000);
            break;
        }
      }
    }, {
      key: "vmPlay",
      value: function vmPlay() {
        _postToVM(this.vmPlayer, this.id, 'play');
      }
    }, {
      key: "vmStop",
      value: function vmStop() {
        _postToVM(this.vmPlayer, this.id, 'pause');

        if (this.opts.startTime) {
          this.clear();
        }
      }
    }]);

    return VideoLightning;
  }(); // HELPERS


  var _val = function _val(p, d) {
    if ([false, 'false', 0, '0'].includes(p)) {
      return p;
    } else {
      return p || d;
    }
  };

  var _bitify = function _bitify(p, d) {
    if ([false, 'false', 0, '0'].includes(p)) {
      return 0;
    } else if ([true, 'true', '1', 1].includes(p)) {
      return 1;
    } else {
      return d;
    }
  };

  var _boolify = function _boolify(p, d) {
    if ([false, 'false', 0, '0'].includes(p)) {
      return false;
    } else {
      return !!p || d;
    }
  };

  var _domStr = function _domStr(o) {
    var attrs = '';
    var children = '';

    if (o.attrs) {
      for (var k in o.attrs) {
        var v = o.attrs[k];
        attrs += " ".concat(k, "=\"").concat(v, "\"");
      }
    }

    if (o.children) {
      for (var _i6 = 0, _Array$from5 = Array.from(o.children); _i6 < _Array$from5.length; _i6++) {
        var c = _Array$from5[_i6];
        children += _isObj(c) ? _domStr(c) : c;
      }
    }

    return "<".concat(o.tag).concat(attrs, ">").concat(o.inner || children, "</").concat(o.tag, ">");
  };

  var _setSrc = function _setSrc(el, o) {
    var k, v;
    var src = "".concat(o.url, "?");

    for (k in o.params) {
      v = o.params[k];

      if (v !== null) {
        src += "&".concat(k, "=").concat(v);
      }
    }

    el.src = src.replace(/&/, '');
    return function () {
      var result = [];

      for (k in o.attrs) {
        v = o.attrs[k];
        result.push(el[k] = v);
      }

      return result;
    }();
  };

  var _extObj = function _extObj(baseObj, extObj) {
    for (var k in extObj) {
      var v = extObj[k];
      baseObj[k] = v;
    }

    return baseObj;
  };

  var _isStr = function _isStr(obj) {
    return typeof obj === 'string';
  };

  var _isAry = function _isAry(obj) {
    return obj instanceof Array;
  };

  var _isElAry = function _isElAry(obj) {
    return obj instanceof HTMLCollection || obj instanceof NodeList;
  };

  var _isObj = function _isObj(obj) {
    return obj !== null && _typeof(obj) === 'object';
  };

  var _topKeyOfObj = function _topKeyOfObj(obj) {
    for (var k in obj) {
      var v = obj[k];
      return k;
    }
  };

  var _getEl = function _getEl(el) {
    var els = el.charAt(0) === '#' ? dom.getElementById(el.substr(1)) : dom.getElementsByClassName(el.substr(1));

    if (_isAry(els) && els.length === 0) {
      return null;
    } else {
      return els;
    }
  };

  var _randar = function _randar() {
    return (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).substring(0, 16);
  };

  var _prepHex = function _prepHex(hex) {
    hex = hex.replace(/^#/, '');

    if (hex.length === 3) {
      return "".concat(hex).concat(hex);
    } else {
      return hex;
    }
  };

  var _fullHex = function _fullHex(hex) {
    if (hex === 'transparent') {
      return hex;
    } else {
      return "#".concat(_prepHex(hex));
    }
  };

  var _cc = function _cc(hex) {
    return {
      r: parseInt(_prepHex(hex).substring(0, 2), 16),
      g: parseInt(_prepHex(hex).substring(2, 4), 16),
      b: parseInt(_prepHex(hex).substring(4, 6), 16)
    };
  };

  var _wrapCss = 'display: none; position: fixed; min-width: 100%; min-height: 100%; top: 0; right: 0; bottom: 0; left: 0;';

  var _wrapCssP = function _wrapCssP(w, h) {
    return "display: none; position: fixed; width: ".concat(w, "px; height: ").concat(h, "px;");
  };

  var _frameCss = 'position: absolute; top: 50%; left: 50%; background: #000000;';

  var _fadeCss = function _fadeCss(el, t) {
    return el.style.transition = el.style.mozTransition = el.style.webkitTransition = "opacity ".concat(t, "ms ease");
  };

  var _fadeIn = function _fadeIn(el, t) {
    _fadeCss(el, t);

    el.style.display = 'block';

    var applyFade = function applyFade() {
      return el.style.opacity = 1;
    };

    return setTimeout(applyFade, 20);
  };

  var _fadeOut = function _fadeOut(el, t) {
    _fadeCss(el, t);

    el.style.opacity = 0;

    var applyFade = function applyFade() {
      return el.style.display = 'none';
    };

    return setTimeout(applyFade, t);
  };

  var _initYTAPI = function _initYTAPI() {
    if (dom.getElementById('ytScript')) {
      return;
    }

    var scriptA = dom.getElementsByTagName('script')[0];
    var vFuncs = document.createElement('script');
    vFuncs.innerHTML = 'function onYouTubeIframeAPIReady() {vlData.ytReady()};';
    scriptA.parentNode.insertBefore(vFuncs, scriptA);
    var vScript = document.createElement('script');
    vScript.id = 'ytScript';
    vScript.async = true;
    vScript.src = 'https://www.youtube.com/iframe_api';
    vFuncs.parentNode.insertBefore(vScript, vFuncs.nextSibling);
  };

  var _ytReset = function _ytReset(p, s) {
    if (s == null) {
      s = 0;
    }

    if (p.getDuration() - 3 < p.getCurrentTime()) {
      p.pauseVideo();
      p.seekTo(s, false);
    }
  };

  var _postToVM = function _postToVM(player, id, k) {
    var v = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var data = v ? {
      method: k,
      value: v
    } : {
      method: k
    };
    return player.contentWindow.postMessage(JSON.stringify(data), "https://player.vimeo.com/video/".concat(id));
  };

  var _coverEl = function _coverEl(target, src) {
    var cover = dom.createElement('img');
    cover.className = 'video-cover';
    cover.src = src;
    target.appendChild(cover);
    return cover;
  };

  var _testEl = function _testEl() {
    var test;

    if (!(test = document.getElementById('vl-size-test'))) {
      test = document.createElement('div');
      test.id = 'vl-size-test';
      test.style.cssText = 'position:fixed;top:0;left:0;bottom:0;right:0;visibility:hidden;';
      document.body.appendChild(test);
    }

    return {
      width: test.offsetWidth,
      height: test.offsetHeight
    };
  };

  var _gravity = function _gravity(el, width, height, fluidity) {
    var page_height, page_width, x, y;
    var asc, end, i, step;
    var asc1, end1, j, step1;

    if (fluidity == null) {
      fluidity = 30;
    }

    var coords = el.getBoundingClientRect();
    var center = {
      x: (page_width = _testEl().width) / 2,
      y: (page_height = _testEl().height) / 2
    };
    var box_center = {
      x: width / 2,
      y: height / 2
    };
    var points = [];

    for (i = coords.left, x = i, end = coords.right + width, step = fluidity, asc = step > 0; asc ? i <= end : i >= end; i += step, x = i) {
      points.push([x - width, coords.top - height]);
      points.push([x - width, coords.bottom]);
    }

    for (j = coords.top, y = j, end1 = coords.bottom + height, step1 = fluidity, asc1 = step1 > 0; asc1 ? j <= end1 : j >= end1; j += step1, y = j) {
      points.push([coords.left - width, y - height]);
      points.push([coords.right, y - height]);
    }

    var sort = function sort(a, b) {
      var obja, objb;

      for (var _i7 = 0, _arr2 = [[a, obja = {}], [b, objb = {}]]; _i7 < _arr2.length; _i7++) {
        var ary = _arr2[_i7];
        var dax, day;
        x = ary[0][0];
        y = ary[0][1];
        ary[1].diffx = (dax = x + box_center.x) > center.x ? dax - center.x : center.x - dax;
        ary[1].diffy = (day = y + box_center.y) > center.y ? day - center.y : center.y - day;
        ary[1].diff = ary[1].diffx + ary[1].diffy;

        if (x < 0 || x + width > page_width) {
          ary[1].diff += 10000;
        }

        if (y < 0 || y + height > page_height) {
          ary[1].diff += 10000;
        }
      }

      return obja.diff - objb.diff;
    };

    points.sort(sort);
    return {
      x: parseInt((x = points[0][0]) < 0 || x + width > page_width ? center.x - box_center.x : x, 10),
      y: parseInt((y = points[0][1]) < 0 || y + height > page_height ? center.y - box_center.y : y, 10)
    };
  }; // INIT


  this.videoLightning = videoLightning;
  this.vlData = {};
  this.vlData.instances = [];

  this.vlData.ytReady = function () {
    return _this.vlData.ytAPIReady = true;
  };

  this.vlData.youtube = this.vlData.vimeo = false;

  var _$ = window.$ || document.$;

  if (typeof _$ !== 'undefined') {
    _$.fn.jqueryVideoLightning = function (options) {
      this.each(function () {
        if (!_$.data(this, 'plugin_jqueryVideoLightning')) {
          var inst = new VideoLightning({
            el: this,
            opts: options
          });
          vlData.instances.push(inst);

          _$.data(this, 'plugin_jqueryVideoLightning', inst);
        }
      });
      return _initYTAPI();
    };

    return _$.fn.jqueryVideoLightnin;
  }
})(document);
