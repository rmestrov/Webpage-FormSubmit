/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(8);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(4);
__webpack_require__(5);
__webpack_require__(6);
__webpack_require__(9);
__webpack_require__(11);
__webpack_require__(13);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(2);
__webpack_require__(2);
module.exports = __webpack_require__(14);


/***/ }),
/* 4 */
/***/ (function(module, exports) {

(function($) {
$.fn.menumaker = function(options) {  
 var cssmenu = $(this), settings = $.extend({
   format: "dropdown",
   sticky: false
 }, options);
 return this.each(function() {
   $(this).find(".button").on('click', function(){
     $(this).toggleClass('menu-opened');
     var mainmenu = $(this).next('ul');
     if (mainmenu.hasClass('open')) { 
       mainmenu.slideToggle().removeClass('open');
     }
     else {
       mainmenu.slideToggle().addClass('open');
       if (settings.format === "dropdown") {
         mainmenu.find('ul').show();
       }
     }
   });
   cssmenu.find('li ul').parent().addClass('has-sub');
multiTg = function() {
     cssmenu.find(".has-sub").prepend('<span class="submenu-button"></span>');
     cssmenu.find('.submenu-button').on('click', function() {
       $(this).toggleClass('submenu-opened');
       if ($(this).siblings('ul').hasClass('open')) {
         $(this).siblings('ul').removeClass('open').slideToggle();
       }
       else {
         $(this).siblings('ul').addClass('open').slideToggle();
       }
     });
   };
   if (settings.format === 'multitoggle') multiTg();
   else cssmenu.addClass('dropdown');
   if (settings.sticky === true) cssmenu.css('position', 'fixed');
resizeFix = function() {
  var mediasize = 768;
     if ($( window ).width() > mediasize) {
       cssmenu.find('ul').show();
     }
     if ($(window).width() <= mediasize) {
       cssmenu.find('ul').hide().removeClass('open');
     }
   };
   resizeFix();
   return $(window).on('resize', resizeFix);
 });
  };
})(jQuery);

(function($){
$(document).ready(function(){
$("#cssmenu").menumaker({
   format: "multitoggle"
});
});
})(jQuery);



/***/ }),
/* 5 */
/***/ (function(module, exports) {

$(function() {

  var ul = $(".slider ul");
  var slide_count = ul.children().length;
  var slide_width_pc = 100.0 / slide_count;
  var slide_index = 0;

  var first_slide = ul.find("li:first-child");
  var last_slide = ul.find("li:last-child");

  // Clone the last slide and add as first li element
  last_slide.clone().prependTo(ul);

  // Clone the first slide and add as last li element
  first_slide.clone().appendTo(ul);

  ul.find("li").each(function(indx) {
    var left_percent = (slide_width_pc * indx) + "%";
    $(this).css({"left":left_percent});
    $(this).css({width:(100 / slide_count) + "%"});
  });

  ul.css("margin-left", "-100%");

  // Listen for click of prev button
  $(".slider .prev").click(function() {
    console.log("prev button clicked");
    slide(slide_index - 1);
  });

  // Listen for click of next button
  $(".slider .next").click(function() {
    console.log("next button clicked");
    slide(slide_index + 1);
  });

  function slide(new_slide_index) {

    var margin_left_pc = (new_slide_index * (-100) - 100) + "%";

    ul.animate({"margin-left": margin_left_pc}, 500, function() {

      // If new slide is before first slide...
      if(new_slide_index < 0) {
        ul.css("margin-left", ((slide_count) * (-100)) + "%");
        new_slide_index = slide_count - 1;
      }
      // If new slide is after last slide...
      else if(new_slide_index >= slide_count) {
        ul.css("margin-left", "-100%");
        new_slide_index = 0;
      }

      slide_index = new_slide_index;

    });

  }

});


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./main.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./main.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "* {\r\n  margin: 0;\r\n  padding: 0;\r\n  box-sizing: border-box;\r\n}\r\n\r\n.page {\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  width: 100%;\r\n\tmargin: 0 auto;\r\n}\r\n\r\n.section {\r\n  width: 100%;\r\n  position: relative;\r\n}\r\n\r\n/*SECTION MENU*/\r\n.menu {\r\n  background-color: #00a1d1;\r\n  height: 75px;\r\n  width: 100%;\r\n  position: relative;\r\n}\r\n\r\n.flexnav {\r\n    -webkit-padding-start: 0px;\r\n    -webkit-margin-before: 0px;\r\n    -webkit-margin-after: 0px;\r\n    margin-top: 0px;\r\n    margin-right: auto;\r\n    margin-bottom: 0px;\r\n    margin-left: auto;\r\n    width:auto;\r\n    height: auto;\r\n    position: relative;\r\n    z-index: 1;\r\n}\r\n\r\n.logo {\r\n  position: relative;\r\n  padding: 25px;\r\n  width:15%;\r\n  font-size: 25px;\r\n  font-family: Arial, Helvetica, sans-serif;\r\n  font-weight: bold;\r\n  color: #fff;\r\n  float: left;\r\n}\r\n\r\nnav {\r\n  position:absolute;\r\n  width:80%;\r\n  margin:0 auto;\r\n}\r\n\r\n#cssmenu, #cssmenu ul,\r\n#cssmenu ul li, #cssmenu ul li a,\r\n#cssmenu #head-mobile {\r\n  border:0;\r\n  list-style:none;\r\n  line-height:1;\r\n  display:block;\r\n  position:relative;\r\n  -webkit-box-sizing:border-box;\r\n  -moz-box-sizing:border-box;\r\n  box-sizing:border-box;\r\n}\r\n\r\n#cssmenu {\r\n  font-family:Arial, Helvetica, sans-serif;\r\n}\r\n\r\n#cssmenu > ul > li {\r\n  float: right;\r\n}\r\n\r\n#cssmenu > ul > li > a {\r\n  padding: 26px;\r\n  font-size: 22px;\r\n  letter-spacing: 0px;\r\n  text-decoration: none;\r\n  color:#fff;\r\n}\r\n\r\n#cssmenu > ul > li:hover > a,\r\n#cssmenu ul li.active a {\r\n  color:#fff\r\n}\r\n\r\n#cssmenu > ul > li:hover, #cssmenu ul li.active:hover,\r\n#cssmenu ul li.active, #cssmenu ul li.has-sub.active:hover {\r\n  background:#008ab3;\r\n}\r\n\r\n#cssmenu > ul > li.has-sub > a {\r\n  padding-right: 20px;\r\n}\r\n\r\n#cssmenu > ul > li.has-sub:hover > a:before {\r\n  top:23px;\r\n  height:0;\r\n}\r\n\r\n#cssmenu ul ul {\r\n  position:absolute;\r\n  left:-9999px;\r\n}\r\n\r\n#cssmenu ul ul li {\r\n  height:0;\r\n  background:#333;\r\n  color: #fff;\r\n  -webkit-transition:all .25s ease;\r\n  -ms-transition:all .25s ease;\r\n  transition:all .25s ease\r\n}\r\n\r\n#cssmenu li:hover > ul {\r\n  left: auto;\r\n  right: 0;  \r\n}\r\n\r\n#cssmenu li:hover > ul > li {\r\n  height: auto;\r\n}\r\n\r\n#cssmenu ul ul li a {\r\n  padding:5px 15px;\r\n  min-width: 150px;\r\n  font-size: 18px;\r\n  text-decoration:none;\r\n  text-align: right;\r\n  color:#fff;\r\n  letter-spacing:0px;\r\n  line-height:36px;\r\n}\r\n\r\n#cssmenu ul ul li:last-child > a,\r\n#cssmenu ul ul li.last-item > a {\r\n  border-bottom: 0\r\n}\r\n\r\n#cssmenu ul ul li:hover > a,\r\n#cssmenu ul ul li a:hover {\r\n  background-color: #008ab3;\r\n}\r\n\r\n\r\n/*SECTION FOOTER*/\r\n.footer {\r\n  background-color: #4a4a4a;\r\n  color: #fff;\r\n}\r\n\r\n.footer-text {\r\n\twidth: 75%;\r\n\tmargin: 0 auto;\r\n\tmargin-top: 2%;\r\n  padding: 0;\r\n  overflow: hidden;\r\n\tdisplay: block;\r\n  color: #fff;\r\n  text-align: center;\r\n\tfont-family: Arial, Helvetica, sans-serif;\r\n  font-size: 16px;\r\n}\r\n\r\n/*SECTION FEATURES*/\r\n.features {\r\n\twidth: 80%;\r\n\tmargin-left: auto;\r\n\tmargin-right: auto;\r\n\theight: auto;\r\n\tmargin-bottom: 2rem;\r\n  margin-top: 1rem;\r\n}\r\n\r\n.flex-container {\r\n  padding: 0;\r\n  margin: 0 auto;\r\n  list-style: none;\r\n  -ms-box-orient: horizontal;\r\n  display: -webkit-box;\r\n  display: -moz-box;\r\n  display: -ms-flexbox;\r\n  display: -moz-flex;\r\n  display: -webkit-flex;\r\n  display: flex;\r\n  width: 100%;\r\n}\r\n\r\n.wrap { \r\n  -webkit-flex-wrap: wrap;\r\n  flex-wrap: wrap;\r\n}  \r\n\r\n.flex-item {\r\n  height: auto;\r\n  margin: 0 auto;\r\n  line-height: 100px;\r\n  color: #fff;\r\n  font-weight: bold;\r\n  font-size: 2em;\r\n  text-align: left;\r\n}\r\n\r\n#content-img {\r\n  width: 100%;\r\n  height: 236px;\r\n}\r\n\r\n.title {\r\n  font-family:Arial, Helvetica, sans-serif;\r\n  font-size:32px;\r\n  color:#4a4a4a;\r\n  letter-spacing:0px;\r\n  line-height:35px;\r\n}\r\n\r\n.content-text {\r\n  font-family:Arial, Helvetica, sans-serif;\r\n  font-size:22px;\r\n  color:#747474;\r\n  letter-spacing:0px;\r\n  line-height:34px;\r\n}\r\n\r\n.content-link {\r\n  font-family:Arial, Helvetica, sans-serif;\r\n  font-size:22px;\r\n  color:#00a1d1;\r\n  letter-spacing:0px;\r\n  line-height:34px;\r\n  text-decoration: none;\r\n}\r\n\r\n#load-more {\r\n  background-color: #b0b0b0;\r\n  width: 33%;\r\n  height: 60px;\r\n  margin: 0 auto;\r\n}\r\n\r\n#load-more:hover {\r\n  background-color: #333;\r\n}\r\n\r\n/*SLIDER (CAROUSEL)*/\r\n.slider {\r\n  width: 100%;\r\n  overflow: hidden;\r\n  height: 250px;\r\n  position: relative;\r\n  text-align: center;\r\n  color: #fff;\r\n  font-family: Arial, Helvetica, sans-serif;\r\n  font-size:50px;\r\n  letter-spacing:0px;\r\n  line-height:36px;\r\n  text-shadow: 2px 2px 8px #000;\r\n}\r\n\r\n.slider ul {\r\n  margin: 0;\r\n  padding: 0;\r\n  list-style: none;\r\n  position: absolute;\r\n  width: 300%;\r\n  height: 100%;\r\n  top: 0;\r\n}\r\n\r\n.slider li {\r\n  padding: 0;\r\n  margin: 0;\r\n  width: 33.333333%;\r\n  height: 100%;\r\n  overflow: hidden;\r\n  position: absolute;\r\n  top: 0;\r\n  bottom: 0;\r\n  border: none;\r\n}\r\n\r\n.slider li img {\r\n  border: none;\r\n  width: 100%;\r\n  min-height: 100%;\r\n  margin-bottom: 50px;\r\n}\r\n\r\n.slider button {\r\n  position: absolute;\r\n  display: block;\r\n  box-sizing: border-box;\r\n  border: none;\r\n  outline: none;\r\n  top: 0;\r\n  bottom: 0;\r\n  width: 20%;\r\n  background-color: rgba(0, 0, 0, 0.3);\r\n  color: #fff;\r\n  margin: 0;\r\n  padding: 0;\r\n  text-align:center;\r\n  opacity: 0;\r\n  z-index: 2;\r\n}\r\n\r\n.slider button.prev {\r\n  left: 0;\r\n}\r\n\r\n.slider button.next {\r\n  right: 0;\r\n}\r\n\r\n.slider button:hover, .slider button:active {\r\n  opacity: 1.0;\r\n}\r\n\r\n.slider .content {\r\n  position: absolute;\r\n  top: 50%;\r\n  left: 50%;\r\n  transform: translate(-50%, -50%);\r\n}\r\n\r\n/*SECTION CONTACT*/\r\n.contact {\r\n  background-color: #e9e9e9;\r\n  height: 922px;\r\n  width: 80%;\r\n  margin-left: auto;\r\n  margin-right: auto;\r\n}\r\n\r\n.contact-form {\r\n\tdisplay: block;\r\n}\r\n\r\n.contact-form h2 {\r\n\tmargin: 0 auto;\r\n\tfont-family: Arial, Helvetica, sans-serif;\r\n\tfont-size: 50px;\r\n\tmargin-top: 10%;\r\n\tcolor:#4a4a4a;\r\n\tletter-spacing:0px;\r\n\ttext-align: center;\r\n}\r\n\r\ninput[type=text], select, textarea {\r\n    width: 100%;\r\n    padding: 10px;\r\n    border: 1px solid #ccc;\r\n    border-radius: 4px;\r\n    box-sizing: border-box;\r\n    margin-top: 6px;\r\n    margin-bottom: 16px;\r\n    resize: vertical;\r\n    cursor: pointer;\r\n    height: 80px;\r\n    font-size:22px;\r\n    color:#4a4a4a;\r\n    letter-spacing:0px;\r\n    line-height:36px;\r\n    font-family: Arial, Helvetica, sans-serif;\r\n}\r\n\r\ninput[placeholder], textarea{\r\n\tfont-weight: bold;\r\n}\r\n\r\ninput[type=submit] {\r\n    background-color: #00a1d1;\r\n    color: #fff;\r\n\t  width: 100%;\r\n    height: 80px;\r\n    border: none;\r\n    border-radius: 4px;\r\n    cursor: pointer;\r\n    font-family: Arial, Helvetica, sans-serif;\r\n    font-size: 22px;\r\n    font-weight: bold;\r\n    letter-spacing:1px;\r\n    line-height:36px;\r\n}\r\n\r\ninput[type=submit]:hover {\r\n    background-color: #008ab3;\r\n}\r\n\r\n.container {\r\n\tpadding: 30px;\r\n  margin-top: 10%;\r\n\ttext-align:left;\r\n\tfont-family: Arial, Helvetica, sans-serif;\r\n\tfont-size: 22px;\r\n\tcolor:#4a4a4a;\r\n\tletter-spacing:0px;\r\n\tline-height:36px;\r\n}\r\n\r\n#email {\r\n\theight: 78px;\r\n}\r\n\r\n#message {\r\n\theight:202px;\r\n}\r\n\r\n/* Desktop Styles */\r\n@media only screen and (min-width: 769px) {\r\n  .header {\r\n\t  height: 250px;\r\n  }\r\n  \r\n  .footer {\r\n\t  height: 70px;\r\n\t  order: 2;\r\n  }\r\n  \r\n  .contact {\r\n\t  order: 1;\r\n\t  height: 922px;\r\n  }\r\n\r\n.footer-text .year {\r\n\tfloat: left;\r\n}\r\n\r\n.footer-text .copyright {\r\n\tfloat: right;\r\n\tlist-style-type: none;\r\n}\r\n\r\n.contact-form {\r\n\twidth: 50%;\r\n\theight: 922px;\r\n\tmargin: 0 auto;\r\n\ttext-align: center;\r\n}\r\n\r\n.contact-form h2 {\r\n\ttext-align: center;\r\n}\r\n\r\n.flex-item {\r\n  max-width: 28%;\r\n}\r\n}\r\n", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(10);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./style-mobile.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./style-mobile.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@media only screen and (max-width: 640px) {\r\n  .header {\r\n\t  height: 400px;\r\n  }\r\n\r\n  .menu {\r\n    height: auto;\r\n  }\r\n\r\n  .footer {\r\n\t  height: 119px;\r\n\t  text-align: center;\r\n\t  order: 2;\r\n  }\r\n  \r\n  .contact {\r\n  height: 865px;\r\n  order: 1;\r\n}\r\n\r\n.slider {\r\n\theight: 400px;\r\n}\r\n\r\n.flex-item {\r\n  max-width: 100%;\r\n}\r\n\r\n#item-four,\r\n#item-five,\r\n#item-six {\r\n  display: none;\r\n}\r\n\r\n.logo {\r\n  position:relative;\r\n  left: 10px;\r\n  top: 15px;\r\n  width:100%;\r\n  height:75px;\r\n  text-align: left;\r\n  float:none;\r\n}\r\n\r\n#cssmenu {\r\n  width:100%;\r\n}\r\n\r\n#cssmenu a {\r\n  font-size: 35px;\r\n}\r\n\r\n#cssmenu ul {\r\n  width:100%;\r\n  display:none;\r\n}\r\n\r\n#cssmenu ul li {\r\n  width:100%;\r\n  background-color: #333;\r\n  text-align: center;\r\n  color: #fff;\r\n}\r\n\r\n#cssmenu ul li:hover {\r\n  background:#333;\r\n}\r\n\r\n#cssmenu ul ul li,\r\n#cssmenu li:hover > ul > li {\r\n  height: auto;\r\n}\r\n\r\n#cssmenu ul ul li a {\r\n  text-align: center;\r\n}\r\n\r\n#cssmenu ul ul li:hover > a,\r\n#cssmenu ul ul li.active > a {\r\n  color:#008ab3;\r\n  background-color: #333;\r\n}\r\n\r\n#cssmenu ul ul {\r\n  position:relative;\r\n  left:0;\r\n  width:100%;\r\n  margin:0;\r\n}\r\n\r\n#cssmenu #head-mobile {\r\n  display:block;\r\n  padding:23px;\r\n  color:black;\r\n  font-size:12px;\r\n  font-weight:700\r\n}\r\n\r\n.button {\r\n  width:33px;\r\n  height:25px;\r\n  position:absolute;\r\n  right:26px;\r\n  top:25px;\r\n  cursor:pointer;\r\n}\r\n\r\n.button:after {\r\n  position:absolute;\r\n  top:23px;\r\n  right:26px;\r\n  display:block;\r\n  height:8px;\r\n  width:40px;\r\n  border-top:5px solid #fff;\r\n  border-bottom:5px solid #fff;\r\n  content:'';\r\n}\r\n\r\n.button:before {\r\n  -webkit-transition:all .3s ease;\r\n  -ms-transition:all .3s ease;\r\n  transition:all .3s ease;\r\n  position:absolute;\r\n  top:10px;\r\n  right:26px;\r\n  display:block;\r\n  height:5px;\r\n  width:40px;\r\n  background:#fff;\r\n  content:'';\r\n}\r\n\r\n.button.menu-opened:after {\r\n  -webkit-transition:all .3s ease;\r\n  -ms-transition:all .3s ease;\r\n  transition:all .3s ease;\r\n  top:33px;\r\n  border:0;\r\n  height:5px;\r\n  width:40px;\r\n  background:#fff;\r\n  -webkit-transform:rotate(45deg);\r\n  -moz-transform:rotate(45deg);\r\n  -ms-transform:rotate(45deg);\r\n  -o-transform:rotate(45deg);\r\n  transform:rotate(45deg);\r\n}\r\n\r\n.button.menu-opened:before {\r\n  top:33px;\r\n  background:#fff;\r\n  width:40px;\r\n  -webkit-transform:rotate(-45deg);\r\n  -moz-transform:rotate(-45deg);\r\n  -ms-transform:rotate(-45deg);\r\n  -o-transform:rotate(-45deg);\r\n  transform:rotate(-45deg);\r\n}\r\n\r\n#cssmenu .submenu-button {\r\n  position:absolute;\r\n  z-index:99;\r\n  right:0;\r\n  top:0;\r\n  display:block;\r\n  height:46px;\r\n  width:100%;\r\n  cursor:pointer\r\n}\r\n\r\n}", ""]);

// exports


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(12);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./style-tablet.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./style-tablet.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "/* Tablet Styles */\r\n@media only screen and (min-width: 641px) and (max-width: 768px) {\r\n  .header {\r\n\t  height: 250px;\r\n  }\r\n  \r\n  .footer {\r\n\t  height: 70px;\r\n\t  order: 2;\r\n  }\r\n  \r\n  .contact {\r\n\t  order: 1;\r\n\t  height: 897px;\r\n  }\r\n  \r\n  .footer-text .year {\r\n\tfloat: left;\r\n}\r\n\r\n.footer-text .copyright {\r\n\tfloat: right;\r\n\tlist-style-type: none;\r\n}\r\n\r\n.flex-item {\r\n  max-width: 44%;\r\n}\r\n\r\n#item-five,\r\n#item-six {\r\n  display: none;\r\n}\r\n\r\n.logo {\r\n  position:relative;\r\n  left: 10px;\r\n  top: 0;\r\n  width:100%;\r\n  height:75px;\r\n  text-align: left;\r\n  float:none;\r\n}\r\n\r\n.flexnav{\r\n    -webkit-padding-start: 0px;\r\n    -webkit-margin-before: 0px;\r\n    -webkit-margin-after: 0px;\r\n    margin-top: 0px;\r\n    margin-right: auto;\r\n    margin-bottom: 0px;\r\n    margin-left: auto;\r\n    width:50%;\r\n    height: 100%;\r\n    position: relative;\r\n    z-index: 1; \r\n}\r\n\r\n.flexnav:open {\r\n  width: 50%;\r\n  position: fixed;\r\n  bottom: 0;\r\n}\r\n\r\nnav {\r\n  width:100%;\r\n  height: 100%;\r\n}\r\n\r\n#cssmenu {\r\n  width:100%;\r\n  height: 100%;\r\n}\r\n\r\n#cssmenu a {\r\n  font-size: 35px;\r\n}\r\n\r\n#cssmenu ul {\r\n  width:50%;\r\n  margin-right: 0;\r\n}\r\n\r\n#cssmenu ul li {\r\n  width:100%;\r\n  background-color: #333;\r\n  text-align: center;\r\n  color: #fff;\r\n}\r\n\r\n#cssmenu ul li:hover {\r\n  background:#333;\r\n}\r\n\r\n#cssmenu ul ul li,\r\n#cssmenu li:hover > ul > li {\r\n  height: auto;\r\n}\r\n\r\n#cssmenu ul ul li a {\r\n  text-align: center;\r\n}\r\n\r\n#cssmenu ul ul li:hover > a,\r\n#cssmenu ul ul li.active > a {\r\n  color:#008ab3;\r\n  background-color: #333;\r\n}\r\n\r\n#cssmenu ul ul {\r\n  position:relative;\r\n  left:0;\r\n  width:100%;\r\n  margin:0;\r\n}\r\n\r\n#cssmenu #head-mobile {\r\n  display:block;\r\n  padding:0;\r\n  color:black;\r\n  font-size:12px;\r\n  font-weight:700;\r\n  height: 0;\r\n}\r\n\r\n.button {\r\n  width:33px;\r\n  height:25px;\r\n  position:absolute;\r\n  right:26px;\r\n  top:25px;\r\n  cursor:pointer;\r\n}\r\n\r\n.button:after {\r\n  position:absolute;\r\n  top:18px;\r\n  right:26px;\r\n  display:block;\r\n  height:8px;\r\n  width:40px;\r\n  border-top:5px solid #fff;\r\n  border-bottom:5px solid #fff;\r\n  content:'';\r\n}\r\n\r\n.button:before {\r\n  -webkit-transition:all .3s ease;\r\n  -ms-transition:all .3s ease;\r\n  transition:all .3s ease;\r\n  position:absolute;\r\n  top:5px;\r\n  right:26px;\r\n  display:block;\r\n  height:5px;\r\n  width:40px;\r\n  background:#fff;\r\n  content:'';\r\n}\r\n\r\n.button.menu-opened:after {\r\n  -webkit-transition:all .3s ease;\r\n  -ms-transition:all .3s ease;\r\n  transition:all .3s ease;\r\n  top:20px;\r\n  border:0;\r\n  height:5px;\r\n  width:40px;\r\n  background:#fff;\r\n  -webkit-transform:rotate(45deg);\r\n  -moz-transform:rotate(45deg);\r\n  -ms-transform:rotate(45deg);\r\n  -o-transform:rotate(45deg);\r\n  transform:rotate(45deg)\r\n}\r\n\r\n.button.menu-opened:before {\r\n  top:20px;\r\n  background:#fff;\r\n  width:40px;\r\n  -webkit-transform:rotate(-45deg);\r\n  -moz-transform:rotate(-45deg);\r\n  -ms-transform:rotate(-45deg);\r\n  -o-transform:rotate(-45deg);\r\n  transform:rotate(-45deg)\r\n}\r\n\r\n#cssmenu .submenu-button {\r\n  position:absolute;\r\n  z-index:99;\r\n  right:0;\r\n  top:0;\r\n  display:block;\r\n  height:46px;\r\n  width:100%;\r\n  cursor:pointer\r\n}\r\n\r\n}", ""]);

// exports


/***/ }),
/* 13 */
/***/ (function(module, exports) {

$(document).ready(function () {
    $("#submit").click(function () {
        
        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var message = document.getElementById('message').value;
        var regexName = /^[a-zA-Z\s]*$/; 
        var regexEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;

        if (name.length == 0) {
            alert("Please enter your name");
            event.preventDefault();
        }
        else if(regexName.test(name) == false) {
            alert("Please enter a valid name");
            event.preventDefault();
        }
        
        else if (email.length == 0) {
            alert("Please enter your email");
            event.preventDefault();
        }
        else if(regexEmail.test(email) == false) {
            alert("Please enter a valid email");
            event.preventDefault();
        }
        
        else if (message.length == 0) {
            alert("Please enter a message");
            event.preventDefault();
        }

       $("#formSubmit").submit(function(event) {
           event.preventDefault();
           var $form = $(this);
           url = $form.attr('action');
           var posting = $.post(
               url, {
                   contactname: $('#name').val(),
                   emailaddress: $('#email').val(),
                   message: $('#message').val()
                });
            });
        });
});


/***/ }),
/* 14 */
/***/ (function(module, exports) {

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(7);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

//require('./menu.js');
__webpack_require__(4);
__webpack_require__(5);
__webpack_require__(8);
__webpack_require__(10);
__webpack_require__(12);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(2);
__webpack_require__(2);
module.exports = __webpack_require__(13);


/***/ }),
/* 4 */
/***/ (function(module, exports) {

$(function() {

  var ul = $(".slider ul");
  var slide_count = ul.children().length;
  var slide_width_pc = 100.0 / slide_count;
  var slide_index = 0;

  var first_slide = ul.find("li:first-child");
  var last_slide = ul.find("li:last-child");

  // Clone the last slide and add as first li element
  last_slide.clone().prependTo(ul);

  // Clone the first slide and add as last li element
  first_slide.clone().appendTo(ul);

  ul.find("li").each(function(indx) {
    var left_percent = (slide_width_pc * indx) + "%";
    $(this).css({"left":left_percent});
    $(this).css({width:(100 / slide_count) + "%"});
  });

  ul.css("margin-left", "-100%");

  // Listen for click of prev button
  $(".slider .prev").click(function() {
    console.log("prev button clicked");
    slide(slide_index - 1);
  });

  // Listen for click of next button
  $(".slider .next").click(function() {
    console.log("next button clicked");
    slide(slide_index + 1);
  });

  function slide(new_slide_index) {

    var margin_left_pc = (new_slide_index * (-100) - 100) + "%";

    ul.animate({"margin-left": margin_left_pc}, 500, function() {

      // If new slide is before first slide...
      if(new_slide_index < 0) {
        ul.css("margin-left", ((slide_count) * (-100)) + "%");
        new_slide_index = slide_count - 1;
      }
      // If new slide is after last slide...
      else if(new_slide_index >= slide_count) {
        ul.css("margin-left", "-100%");
        new_slide_index = 0;
      }

      slide_index = new_slide_index;

    });

  }

});


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(6);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./main.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./main.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "* {\r\n  margin: 0;\r\n  padding: 0;\r\n  box-sizing: border-box;\r\n}\r\n\r\n.page {\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  width: 100%;\r\n\tmargin: 0 auto;\r\n}\r\n\r\n.section {\r\n  width: 100%;\r\n  position: relative;\r\n}\r\n\r\n/*SECTION MENU*/\r\n.menu {\r\n  background-color: #00a1d1;\r\n  height: 75px;\r\n  width: 100%;\r\n  position: relative;\r\n}\r\n\r\n.flexnav {\r\n    -webkit-padding-start: 0px;\r\n    -webkit-margin-before: 0px;\r\n    -webkit-margin-after: 0px;\r\n    margin-top: 0px;\r\n    margin-right: auto;\r\n    margin-bottom: 0px;\r\n    margin-left: auto;\r\n    width:auto;\r\n    height: auto;\r\n    position: relative;\r\n    z-index: 1;\r\n}\r\n\r\n.logo {\r\n  position: relative;\r\n  padding: 25px;\r\n  width:15%;\r\n  font-size: 25px;\r\n  font-family: Arial, Helvetica, sans-serif;\r\n  font-weight: bold;\r\n  color: #fff;\r\n  float: left;\r\n}\r\n\r\nnav {\r\n  position:absolute;\r\n  width:80%;\r\n  margin:0 auto;\r\n}\r\n\r\n#cssmenu, #cssmenu ul,\r\n#cssmenu ul li, #cssmenu ul li a,\r\n#cssmenu #head-mobile {\r\n  border:0;\r\n  list-style:none;\r\n  line-height:1;\r\n  display:block;\r\n  position:relative;\r\n  -webkit-box-sizing:border-box;\r\n  -moz-box-sizing:border-box;\r\n  box-sizing:border-box;\r\n}\r\n\r\n#cssmenu {\r\n  font-family:Arial, Helvetica, sans-serif;\r\n}\r\n\r\n#cssmenu > ul > li {\r\n  float: right;\r\n}\r\n\r\n#cssmenu > ul > li > a {\r\n  padding: 26px;\r\n  font-size: 22px;\r\n  letter-spacing: 0px;\r\n  text-decoration: none;\r\n  color:#fff;\r\n}\r\n\r\n#cssmenu > ul > li:hover > a,\r\n#cssmenu ul li.active a {\r\n  color:#fff\r\n}\r\n\r\n#cssmenu > ul > li:hover, #cssmenu ul li.active:hover,\r\n#cssmenu ul li.active, #cssmenu ul li.has-sub.active:hover {\r\n  background:#008ab3;\r\n}\r\n\r\n#cssmenu > ul > li.has-sub > a {\r\n  padding-right: 20px;\r\n}\r\n\r\n#cssmenu > ul > li.has-sub:hover > a:before {\r\n  top:23px;\r\n  height:0;\r\n}\r\n\r\n#cssmenu ul ul {\r\n  position:absolute;\r\n  left:-9999px;\r\n}\r\n\r\n#cssmenu ul ul li {\r\n  height:0;\r\n  background:#333;\r\n  color: #fff;\r\n  -webkit-transition:all .25s ease;\r\n  -ms-transition:all .25s ease;\r\n  transition:all .25s ease\r\n}\r\n\r\n#cssmenu li:hover > ul {\r\n  left: auto;\r\n  right: 0;  \r\n}\r\n\r\n#cssmenu li:hover > ul > li {\r\n  height: auto;\r\n}\r\n\r\n#cssmenu ul ul li a {\r\n  padding:5px 15px;\r\n  min-width: 150px;\r\n  font-size: 18px;\r\n  text-decoration:none;\r\n  text-align: right;\r\n  color:#fff;\r\n  letter-spacing:0px;\r\n  line-height:36px;\r\n}\r\n\r\n#cssmenu ul ul li:last-child > a,\r\n#cssmenu ul ul li.last-item > a {\r\n  border-bottom: 0\r\n}\r\n\r\n#cssmenu ul ul li:hover > a,\r\n#cssmenu ul ul li a:hover {\r\n  background-color: #008ab3;\r\n}\r\n\r\n\r\n/*SECTION FOOTER*/\r\n.footer {\r\n  background-color: #4a4a4a;\r\n  color: #fff;\r\n}\r\n\r\n.footer-text {\r\n\twidth: 75%;\r\n\tmargin: 0 auto;\r\n\tmargin-top: 2%;\r\n  padding: 0;\r\n  overflow: hidden;\r\n\tdisplay: block;\r\n  color: #fff;\r\n  text-align: center;\r\n\tfont-family: Arial, Helvetica, sans-serif;\r\n  font-size: 16px;\r\n}\r\n\r\n/*SECTION FEATURES*/\r\n.features {\r\n\twidth: 80%;\r\n\tmargin-left: auto;\r\n\tmargin-right: auto;\r\n\theight: auto;\r\n\tmargin-bottom: 2rem;\r\n  margin-top: 1rem;\r\n}\r\n\r\n.flex-container {\r\n  padding: 0;\r\n  margin: 0 auto;\r\n  list-style: none;\r\n  -ms-box-orient: horizontal;\r\n  display: -webkit-box;\r\n  display: -moz-box;\r\n  display: -ms-flexbox;\r\n  display: -moz-flex;\r\n  display: -webkit-flex;\r\n  display: flex;\r\n  width: 100%;\r\n}\r\n\r\n.wrap { \r\n  -webkit-flex-wrap: wrap;\r\n  flex-wrap: wrap;\r\n}  \r\n\r\n.flex-item {\r\n  height: auto;\r\n  margin: 0 auto;\r\n  line-height: 100px;\r\n  color: #fff;\r\n  font-weight: bold;\r\n  font-size: 2em;\r\n  text-align: left;\r\n}\r\n\r\n#content-img {\r\n  width: 100%;\r\n  height: 236px;\r\n}\r\n\r\n.title {\r\n  font-family:Arial, Helvetica, sans-serif;\r\n  font-size:32px;\r\n  color:#4a4a4a;\r\n  letter-spacing:0px;\r\n  line-height:35px;\r\n}\r\n\r\n.content-text {\r\n  font-family:Arial, Helvetica, sans-serif;\r\n  font-size:22px;\r\n  color:#747474;\r\n  letter-spacing:0px;\r\n  line-height:34px;\r\n}\r\n\r\n.content-link {\r\n  font-family:Arial, Helvetica, sans-serif;\r\n  font-size:22px;\r\n  color:#00a1d1;\r\n  letter-spacing:0px;\r\n  line-height:34px;\r\n  text-decoration: none;\r\n}\r\n\r\n#load-more {\r\n  background-color: #b0b0b0;\r\n  width: 33%;\r\n  height: 60px;\r\n  margin: 0 auto;\r\n}\r\n\r\n#load-more:hover {\r\n  background-color: #333;\r\n}\r\n\r\n/*SLIDER (CAROUSEL)*/\r\n.slider {\r\n  width: 100%;\r\n  overflow: hidden;\r\n  height: 250px;\r\n  position: relative;\r\n  text-align: center;\r\n  color: #fff;\r\n  font-family: Arial, Helvetica, sans-serif;\r\n  font-size:50px;\r\n  letter-spacing:0px;\r\n  line-height:36px;\r\n  text-shadow: 2px 2px 8px #000;\r\n}\r\n\r\n.slider ul {\r\n  margin: 0;\r\n  padding: 0;\r\n  list-style: none;\r\n  position: absolute;\r\n  width: 300%;\r\n  height: 100%;\r\n  top: 0;\r\n}\r\n\r\n.slider li {\r\n  padding: 0;\r\n  margin: 0;\r\n  width: 33.333333%;\r\n  height: 100%;\r\n  overflow: hidden;\r\n  position: absolute;\r\n  top: 0;\r\n  bottom: 0;\r\n  border: none;\r\n}\r\n\r\n.slider li img {\r\n  border: none;\r\n  width: 100%;\r\n  min-height: 100%;\r\n  margin-bottom: 50px;\r\n}\r\n\r\n.slider button {\r\n  position: absolute;\r\n  display: block;\r\n  box-sizing: border-box;\r\n  border: none;\r\n  outline: none;\r\n  top: 0;\r\n  bottom: 0;\r\n  width: 20%;\r\n  background-color: rgba(0, 0, 0, 0.3);\r\n  color: #fff;\r\n  margin: 0;\r\n  padding: 0;\r\n  text-align:center;\r\n  opacity: 0;\r\n  z-index: 2;\r\n}\r\n\r\n.slider button.prev {\r\n  left: 0;\r\n}\r\n\r\n.slider button.next {\r\n  right: 0;\r\n}\r\n\r\n.slider button:hover, .slider button:active {\r\n  opacity: 1.0;\r\n}\r\n\r\n.slider .content {\r\n  position: absolute;\r\n  top: 50%;\r\n  left: 50%;\r\n  transform: translate(-50%, -50%);\r\n}\r\n\r\n/*SECTION CONTACT*/\r\n.contact {\r\n  background-color: #e9e9e9;\r\n  height: 922px;\r\n  width: 80%;\r\n  margin-left: auto;\r\n  margin-right: auto;\r\n}\r\n\r\n.contact-form {\r\n\tdisplay: block;\r\n}\r\n\r\n.contact-form h2 {\r\n\tmargin: 0 auto;\r\n\tfont-family: Arial, Helvetica, sans-serif;\r\n\tfont-size: 50px;\r\n\tmargin-top: 10%;\r\n\tcolor:#4a4a4a;\r\n\tletter-spacing:0px;\r\n\ttext-align: center;\r\n}\r\n\r\ninput[type=text], select, textarea {\r\n    width: 100%;\r\n    padding: 10px;\r\n    border: 1px solid #ccc;\r\n    border-radius: 4px;\r\n    box-sizing: border-box;\r\n    margin-top: 6px;\r\n    margin-bottom: 16px;\r\n    resize: vertical;\r\n    cursor: pointer;\r\n    height: 80px;\r\n    font-size:22px;\r\n    color:#4a4a4a;\r\n    letter-spacing:0px;\r\n    line-height:36px;\r\n    font-family: Arial, Helvetica, sans-serif;\r\n}\r\n\r\ninput[placeholder], textarea{\r\n\tfont-weight: bold;\r\n}\r\n\r\ninput[type=submit] {\r\n    background-color: #00a1d1;\r\n    color: #fff;\r\n\t  width: 100%;\r\n    height: 80px;\r\n    border: none;\r\n    border-radius: 4px;\r\n    cursor: pointer;\r\n    font-family: Arial, Helvetica, sans-serif;\r\n    font-size: 22px;\r\n    font-weight: bold;\r\n    letter-spacing:1px;\r\n    line-height:36px;\r\n}\r\n\r\ninput[type=submit]:hover {\r\n    background-color: #008ab3;\r\n}\r\n\r\n.container {\r\n\tpadding: 30px;\r\n  margin-top: 10%;\r\n\ttext-align:left;\r\n\tfont-family: Arial, Helvetica, sans-serif;\r\n\tfont-size: 22px;\r\n\tcolor:#4a4a4a;\r\n\tletter-spacing:0px;\r\n\tline-height:36px;\r\n}\r\n\r\n#email {\r\n\theight: 78px;\r\n}\r\n\r\n#message {\r\n\theight:202px;\r\n}\r\n\r\n/* Desktop Styles */\r\n@media only screen and (min-width: 769px) {\r\n  .header {\r\n\t  height: 250px;\r\n  }\r\n  \r\n  .footer {\r\n\t  height: 70px;\r\n\t  order: 2;\r\n  }\r\n  \r\n  .contact {\r\n\t  order: 1;\r\n\t  height: 922px;\r\n  }\r\n\r\n.footer-text .year {\r\n\tfloat: left;\r\n}\r\n\r\n.footer-text .copyright {\r\n\tfloat: right;\r\n\tlist-style-type: none;\r\n}\r\n\r\n.contact-form {\r\n\twidth: 50%;\r\n\theight: 922px;\r\n\tmargin: 0 auto;\r\n\ttext-align: center;\r\n}\r\n\r\n.contact-form h2 {\r\n\ttext-align: center;\r\n}\r\n\r\n.flex-item {\r\n  max-width: 28%;\r\n}\r\n}\r\n", ""]);

// exports


/***/ }),
/* 7 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(9);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./style-mobile.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./style-mobile.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "@media only screen and (max-width: 640px) {\r\n  .header {\r\n\t  height: 400px;\r\n  }\r\n\r\n  .menu {\r\n    height: auto;\r\n  }\r\n\r\n  .footer {\r\n\t  height: 119px;\r\n\t  text-align: center;\r\n\t  order: 2;\r\n  }\r\n  \r\n  .contact {\r\n  height: 865px;\r\n  order: 1;\r\n}\r\n\r\n.slider {\r\n\theight: 400px;\r\n}\r\n\r\n.flex-item {\r\n  max-width: 100%;\r\n}\r\n\r\n#item-four,\r\n#item-five,\r\n#item-six {\r\n  display: none;\r\n}\r\n\r\n.logo {\r\n  position:relative;\r\n  left: 10px;\r\n  top: 15px;\r\n  width:100%;\r\n  height:75px;\r\n  text-align: left;\r\n  float:none;\r\n}\r\n\r\n#cssmenu {\r\n  width:100%;\r\n}\r\n\r\n#cssmenu a {\r\n  font-size: 35px;\r\n}\r\n\r\n#cssmenu ul {\r\n  width:100%;\r\n  display:none;\r\n}\r\n\r\n#cssmenu ul li {\r\n  width:100%;\r\n  background-color: #333;\r\n  text-align: center;\r\n  color: #fff;\r\n}\r\n\r\n#cssmenu ul li:hover {\r\n  background:#333;\r\n}\r\n\r\n#cssmenu ul ul li,\r\n#cssmenu li:hover > ul > li {\r\n  height: auto;\r\n}\r\n\r\n#cssmenu ul ul li a {\r\n  text-align: center;\r\n}\r\n\r\n#cssmenu ul ul li:hover > a,\r\n#cssmenu ul ul li.active > a {\r\n  color:#008ab3;\r\n  background-color: #333;\r\n}\r\n\r\n#cssmenu ul ul {\r\n  position:relative;\r\n  left:0;\r\n  width:100%;\r\n  margin:0;\r\n}\r\n\r\n#cssmenu #head-mobile {\r\n  display:block;\r\n  padding:23px;\r\n  color:black;\r\n  font-size:12px;\r\n  font-weight:700\r\n}\r\n\r\n.button {\r\n  width:33px;\r\n  height:25px;\r\n  position:absolute;\r\n  right:26px;\r\n  top:25px;\r\n  cursor:pointer;\r\n}\r\n\r\n.button:after {\r\n  position:absolute;\r\n  top:23px;\r\n  right:26px;\r\n  display:block;\r\n  height:8px;\r\n  width:40px;\r\n  border-top:5px solid #fff;\r\n  border-bottom:5px solid #fff;\r\n  content:'';\r\n}\r\n\r\n.button:before {\r\n  -webkit-transition:all .3s ease;\r\n  -ms-transition:all .3s ease;\r\n  transition:all .3s ease;\r\n  position:absolute;\r\n  top:10px;\r\n  right:26px;\r\n  display:block;\r\n  height:5px;\r\n  width:40px;\r\n  background:#fff;\r\n  content:'';\r\n}\r\n\r\n.button.menu-opened:after {\r\n  -webkit-transition:all .3s ease;\r\n  -ms-transition:all .3s ease;\r\n  transition:all .3s ease;\r\n  top:33px;\r\n  border:0;\r\n  height:5px;\r\n  width:40px;\r\n  background:#fff;\r\n  -webkit-transform:rotate(45deg);\r\n  -moz-transform:rotate(45deg);\r\n  -ms-transform:rotate(45deg);\r\n  -o-transform:rotate(45deg);\r\n  transform:rotate(45deg);\r\n}\r\n\r\n.button.menu-opened:before {\r\n  top:33px;\r\n  background:#fff;\r\n  width:40px;\r\n  -webkit-transform:rotate(-45deg);\r\n  -moz-transform:rotate(-45deg);\r\n  -ms-transform:rotate(-45deg);\r\n  -o-transform:rotate(-45deg);\r\n  transform:rotate(-45deg);\r\n}\r\n\r\n#cssmenu .submenu-button {\r\n  position:absolute;\r\n  z-index:99;\r\n  right:0;\r\n  top:0;\r\n  display:block;\r\n  height:46px;\r\n  width:100%;\r\n  cursor:pointer\r\n}\r\n\r\n}", ""]);

// exports


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./style-tablet.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./style-tablet.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "/* Tablet Styles */\r\n@media only screen and (min-width: 641px) and (max-width: 768px) {\r\n  .header {\r\n\t  height: 250px;\r\n  }\r\n  \r\n  .footer {\r\n\t  height: 70px;\r\n\t  order: 2;\r\n  }\r\n  \r\n  .contact {\r\n\t  order: 1;\r\n\t  height: 897px;\r\n  }\r\n  \r\n  .footer-text .year {\r\n\tfloat: left;\r\n}\r\n\r\n.footer-text .copyright {\r\n\tfloat: right;\r\n\tlist-style-type: none;\r\n}\r\n\r\n.flex-item {\r\n  max-width: 44%;\r\n}\r\n\r\n#item-five,\r\n#item-six {\r\n  display: none;\r\n}\r\n\r\n.logo {\r\n  position:relative;\r\n  left: 10px;\r\n  top: 0;\r\n  width:100%;\r\n  height:75px;\r\n  text-align: left;\r\n  float:none;\r\n}\r\n\r\n.flexnav{\r\n    -webkit-padding-start: 0px;\r\n    -webkit-margin-before: 0px;\r\n    -webkit-margin-after: 0px;\r\n    margin-top: 0px;\r\n    margin-right: auto;\r\n    margin-bottom: 0px;\r\n    margin-left: auto;\r\n    width:50%;\r\n    height: 100%;\r\n    position: relative;\r\n    z-index: 1; \r\n}\r\n\r\n.flexnav:open {\r\n  width: 50%;\r\n  position: fixed;\r\n  bottom: 0;\r\n}\r\n\r\nnav {\r\n  width:100%;\r\n  height: 100%;\r\n}\r\n\r\n#cssmenu {\r\n  width:100%;\r\n  height: 100%;\r\n}\r\n\r\n#cssmenu a {\r\n  font-size: 35px;\r\n}\r\n\r\n#cssmenu ul {\r\n  width:50%;\r\n  margin-right: 0;\r\n}\r\n\r\n#cssmenu ul li {\r\n  width:100%;\r\n  background-color: #333;\r\n  text-align: center;\r\n  color: #fff;\r\n}\r\n\r\n#cssmenu ul li:hover {\r\n  background:#333;\r\n}\r\n\r\n#cssmenu ul ul li,\r\n#cssmenu li:hover > ul > li {\r\n  height: auto;\r\n}\r\n\r\n#cssmenu ul ul li a {\r\n  text-align: center;\r\n}\r\n\r\n#cssmenu ul ul li:hover > a,\r\n#cssmenu ul ul li.active > a {\r\n  color:#008ab3;\r\n  background-color: #333;\r\n}\r\n\r\n#cssmenu ul ul {\r\n  position:relative;\r\n  left:0;\r\n  width:100%;\r\n  margin:0;\r\n}\r\n\r\n#cssmenu #head-mobile {\r\n  display:block;\r\n  padding:0;\r\n  color:black;\r\n  font-size:12px;\r\n  font-weight:700;\r\n  height: 0;\r\n}\r\n\r\n.button {\r\n  width:33px;\r\n  height:25px;\r\n  position:absolute;\r\n  right:26px;\r\n  top:25px;\r\n  cursor:pointer;\r\n}\r\n\r\n.button:after {\r\n  position:absolute;\r\n  top:18px;\r\n  right:26px;\r\n  display:block;\r\n  height:8px;\r\n  width:40px;\r\n  border-top:5px solid #fff;\r\n  border-bottom:5px solid #fff;\r\n  content:'';\r\n}\r\n\r\n.button:before {\r\n  -webkit-transition:all .3s ease;\r\n  -ms-transition:all .3s ease;\r\n  transition:all .3s ease;\r\n  position:absolute;\r\n  top:5px;\r\n  right:26px;\r\n  display:block;\r\n  height:5px;\r\n  width:40px;\r\n  background:#fff;\r\n  content:'';\r\n}\r\n\r\n.button.menu-opened:after {\r\n  -webkit-transition:all .3s ease;\r\n  -ms-transition:all .3s ease;\r\n  transition:all .3s ease;\r\n  top:20px;\r\n  border:0;\r\n  height:5px;\r\n  width:40px;\r\n  background:#fff;\r\n  -webkit-transform:rotate(45deg);\r\n  -moz-transform:rotate(45deg);\r\n  -ms-transform:rotate(45deg);\r\n  -o-transform:rotate(45deg);\r\n  transform:rotate(45deg)\r\n}\r\n\r\n.button.menu-opened:before {\r\n  top:20px;\r\n  background:#fff;\r\n  width:40px;\r\n  -webkit-transform:rotate(-45deg);\r\n  -moz-transform:rotate(-45deg);\r\n  -ms-transform:rotate(-45deg);\r\n  -o-transform:rotate(-45deg);\r\n  transform:rotate(-45deg)\r\n}\r\n\r\n#cssmenu .submenu-button {\r\n  position:absolute;\r\n  z-index:99;\r\n  right:0;\r\n  top:0;\r\n  display:block;\r\n  height:46px;\r\n  width:100%;\r\n  cursor:pointer\r\n}\r\n\r\n}", ""]);

// exports


/***/ }),
/* 12 */
/***/ (function(module, exports) {

$(document).ready(function () {
    $("#submit").click(function () {
        
        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var message = document.getElementById('message').value;
        var regexName = /^[a-zA-Z\s]*$/; 
        var regexEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;

        if (name.length == 0) {
            alert("Please enter your name");
            event.preventDefault();
        }
        else if(regexName.test(name) == false) {
            alert("Please enter a valid name");
            event.preventDefault();
        }
        
        else if (email.length == 0) {
            alert("Please enter your email");
            event.preventDefault();
        }
        else if(regexEmail.test(email) == false) {
            alert("Please enter a valid email");
            event.preventDefault();
        }
        
        else if (message.length == 0) {
            alert("Please enter a message");
            event.preventDefault();
        }

       $("#formSubmit").submit(function(event) {
           event.preventDefault();
           var $form = $(this);
           url = $form.attr('action');
           var posting = $.post(
               url, {
                   contactname: $('#name').val(),
                   emailaddress: $('#email').val(),
                   message: $('#message').val()
                });
            });
        });
});


/***/ }),
/* 13 */
/***/ (function(module, exports) {

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

(function($) {
$.fn.menumaker = function(options) {  
 var cssmenu = $(this), settings = $.extend({
   format: "dropdown",
   sticky: false
 }, options);
 return this.each(function() {
   $(this).find(".button").on('click', function(){
     $(this).toggleClass('menu-opened');
     var mainmenu = $(this).next('ul');
     if (mainmenu.hasClass('open')) { 
       mainmenu.slideToggle().removeClass('open');
     }
     else {
       mainmenu.slideToggle().addClass('open');
       if (settings.format === "dropdown") {
         mainmenu.find('ul').show();
       }
     }
   });
   cssmenu.find('li ul').parent().addClass('has-sub');
multiTg = function() {
     cssmenu.find(".has-sub").prepend('<span class="submenu-button"></span>');
     cssmenu.find('.submenu-button').on('click', function() {
       $(this).toggleClass('submenu-opened');
       if ($(this).siblings('ul').hasClass('open')) {
         $(this).siblings('ul').removeClass('open').slideToggle();
       }
       else {
         $(this).siblings('ul').addClass('open').slideToggle();
       }
     });
   };
   if (settings.format === 'multitoggle') multiTg();
   else cssmenu.addClass('dropdown');
   if (settings.sticky === true) cssmenu.css('position', 'fixed');
resizeFix = function() {
  var mediasize = 768;
     if ($( window ).width() > mediasize) {
       cssmenu.find('ul').show();
     }
     if ($(window).width() <= mediasize) {
       cssmenu.find('ul').hide().removeClass('open');
     }
   };
   resizeFix();
   return $(window).on('resize', resizeFix);
 });
  };
})(jQuery);

(function($){
$(document).ready(function(){
$("#cssmenu").menumaker({
   format: "multitoggle"
});
});
})(jQuery);



/***/ })
/******/ ]);

/***/ })
/******/ ]);

/***/ })
/******/ ]);