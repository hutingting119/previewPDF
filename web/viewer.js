(function (modules) {

    var installedModules = {};

    function __webpack_require__(moduleId) {

        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}

        };
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.l = true;
        return module.exports;
    }

    return __webpack_require__(__webpack_require__.s = 33);
})
([

   (function (module, exports, __webpack_require__) {

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }

            return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var CSS_UNITS = 96.0 / 72.0;
        var DEFAULT_SCALE = 1.0;
        var RendererType = {
            CANVAS: 'canvas',
            SVG: 'svg'
        };
        function getOutputScale(ctx) {
            var devicePixelRatio = window.devicePixelRatio || 1;
            var backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
            var pixelRatio = devicePixelRatio / backingStoreRatio;
            return {
                sx: pixelRatio,
                sy: pixelRatio,
                scaled: pixelRatio !== 1
            };
        }

        function scrollIntoView(element, spot) {
            var skipOverflowHiddenElements = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            var parent = element.offsetParent;
            if (!parent) {
                console.error('offsetParent is not set -- cannot scroll');
                return;
            }
            var offsetY = element.offsetTop + element.clientTop;
            var offsetX = element.offsetLeft + element.clientLeft;
            while (parent.clientHeight === parent.scrollHeight || skipOverflowHiddenElements && getComputedStyle(parent).overflow === 'hidden') {
                if (parent.dataset._scaleY) {
                    offsetY /= parent.dataset._scaleY;
                    offsetX /= parent.dataset._scaleX;
                }
                offsetY += parent.offsetTop;
                offsetX += parent.offsetLeft;
                parent = parent.offsetParent;
                if (!parent) {
                    return;
                }
            }
            if (spot) {
                if (spot.top !== undefined) {
                    offsetY += spot.top;
                }
                if (spot.left !== undefined) {
                    offsetX += spot.left;
                    parent.scrollLeft = offsetX;
                }
            }
            parent.scrollTop = offsetY;
        }

        function watchScroll(viewAreaElement, callback) {
            var debounceScroll = function debounceScroll(evt) {
                if (rAF) {
                    return;
                }
                rAF = window.requestAnimationFrame(function viewAreaElementScrolled() {
                    rAF = null;
                    var currentY = viewAreaElement.scrollTop;
                    var lastY = state.lastY;
                    if (currentY !== lastY) {
                        state.down = currentY > lastY;
                    }
                    state.lastY = currentY;
                    callback(state);
                });
            };
            var state = {
                down: true,
                _eventHandler: debounceScroll
            };
            var rAF = null;
            return state;
        }

        function parseQueryString(query) {
            var parts = query.split('&');
            var params = Object.create(null);
            for (var i = 0, ii = parts.length; i < ii; ++i) {
                var param = parts[i].split('=');
                var key = param[0].toLowerCase();
                var value = param.length > 1 ? param[1] : null;
                params[decodeURIComponent(key)] = decodeURIComponent(value);
            }
            return params;
        }

        function binarySearchFirstItem(items, condition) {
            var minIndex = 0;
            var maxIndex = items.length - 1;
            if (items.length === 0 || !condition(items[maxIndex])) {
                return items.length;
            }
            if (condition(items[minIndex])) {
                return minIndex;
            }
            while (minIndex < maxIndex) {
                var currentIndex = minIndex + maxIndex >> 1;
                var currentItem = items[currentIndex];
                if (condition(currentItem)) {
                    maxIndex = currentIndex;
                } else {
                    minIndex = currentIndex + 1;
                }
            }
            return minIndex;
        }

        function approximateFraction(x) {
            if (Math.floor(x) === x) {
                return [x, 1];
            }
            var xinv = 1 / x;
            var limit = 8;
            if (xinv > limit) {
                return [1, limit];
            } else if (Math.floor(xinv) === xinv) {
                return [1, xinv];
            }
            var x_ = x > 1 ? xinv : x;
            var a = 0,
                b = 1,
                c = 1,
                d = 1;
            while (true) {
                var p = a + c,
                    q = b + d;
                if (q > limit) {
                    break;
                }
                if (x_ <= p / q) {
                    c = p;
                    d = q;
                } else {
                    a = p;
                    b = q;
                }
            }
            var result = void 0;
            if (x_ - a / b < c / d - x_) {
                result = x_ === x ? [a, b] : [b, a];
            } else {
                result = x_ === x ? [c, d] : [d, c];
            }
            return result;
        }

        function roundToDivide(x, div) {
            var r = x % div;
            return r === 0 ? x : Math.round(x - r + div);
        }

        function getVisibleElements(scrollEl, views) {
            var sortByVisibility = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            var top = scrollEl.scrollTop,
                bottom = top + scrollEl.clientHeight;
            var left = scrollEl.scrollLeft,
                right = left + scrollEl.clientWidth;

            function isElementBottomBelowViewTop(view) {
                var element = view.div;
                var elementBottom = element.offsetTop + element.clientTop + element.clientHeight;
                return elementBottom > top;
            }

            var visible = [],
                view = void 0,
                element = void 0;
            var currentHeight = void 0,
                viewHeight = void 0,
                hiddenHeight = void 0,
                percentHeight = void 0;
            var currentWidth = void 0,
                viewWidth = void 0;
            var firstVisibleElementInd = views.length === 0 ? 0 : binarySearchFirstItem(views, isElementBottomBelowViewTop);
            for (var i = firstVisibleElementInd, ii = views.length; i < ii; i++) {
                view = views[i];
                element = view.div;
                currentHeight = element.offsetTop + element.clientTop;
                viewHeight = element.clientHeight;
                if (currentHeight > bottom) {
                    break;
                }
                currentWidth = element.offsetLeft + element.clientLeft;
                viewWidth = element.clientWidth;
                if (currentWidth + viewWidth < left || currentWidth > right) {
                    continue;
                }
                hiddenHeight = Math.max(0, top - currentHeight) + Math.max(0, currentHeight + viewHeight - bottom);
                percentHeight = (viewHeight - hiddenHeight) * 100 / viewHeight | 0;
                visible.push({
                    id: view.id,
                    x: currentWidth,
                    y: currentHeight,
                    view: view,
                    percent: percentHeight
                });
            }
            var first = visible[0];
            var last = visible[visible.length - 1];
            if (sortByVisibility) {
                visible.sort(function (a, b) {
                    var pc = a.percent - b.percent;
                    if (Math.abs(pc) > 0.001) {
                        return -pc;
                    }
                    return a.id - b.id;
                });
            }
            return {
                first: first,
                last: last,
                views: visible
            };
        }

        function noContextMenuHandler(evt) {
            evt.preventDefault();
        }

        function isDataSchema(url) {
            var i = 0,
                ii = url.length;
            while (i < ii && url[i].trim() === '') {
                i++;
            }
            return url.substr(i, 5).toLowerCase() === 'data:';
        }

        function getPDFFileNameFromURL(url) {
            var defaultFilename = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'document.pdf';

            if (isDataSchema(url)) {
                console.warn('getPDFFileNameFromURL: ' + 'ignoring "data:" URL for performance reasons.');
                return defaultFilename;
            }
            var reURI = /^(?:(?:[^:]+:)?\/\/[^\/]+)?([^?#]*)(\?[^#]*)?(#.*)?$/;
            var reFilename = /[^\/?#=]+\.pdf\b(?!.*\.pdf\b)/i;
            var splitURI = reURI.exec(url);
            var suggestedFilename = reFilename.exec(splitURI[1]) || reFilename.exec(splitURI[2]) || reFilename.exec(splitURI[3]);
            if (suggestedFilename) {
                suggestedFilename = suggestedFilename[0];
                if (suggestedFilename.indexOf('%') !== -1) {
                    try {
                        suggestedFilename = reFilename.exec(decodeURIComponent(suggestedFilename))[0];
                    } catch (ex) {
                    }
                }
            }
            return suggestedFilename || defaultFilename;
        }

        function normalizeWheelEventDelta(evt) {
            var delta = Math.sqrt(evt.deltaX * evt.deltaX + evt.deltaY * evt.deltaY);
            var angle = Math.atan2(evt.deltaY, evt.deltaX);
            if (-0.25 * Math.PI < angle && angle < 0.75 * Math.PI) {
                delta = -delta;
            }
            var MOUSE_DOM_DELTA_PIXEL_MODE = 0;
            var MOUSE_DOM_DELTA_LINE_MODE = 1;
            var MOUSE_PIXELS_PER_LINE = 30;
            var MOUSE_LINES_PER_PAGE = 30;
            if (evt.deltaMode === MOUSE_DOM_DELTA_PIXEL_MODE) {
                delta /= MOUSE_PIXELS_PER_LINE * MOUSE_LINES_PER_PAGE;
            } else if (evt.deltaMode === MOUSE_DOM_DELTA_LINE_MODE) {
                delta /= MOUSE_LINES_PER_PAGE;
            }
            return delta;
        }

        var EventBus = function () {
            function EventBus() {
                _classCallCheck(this, EventBus);

                this._listeners = Object.create(null);
            }

            _createClass(EventBus, [{
                key: 'on',
                value: function on(eventName, listener) {
                    var eventListeners = this._listeners[eventName];
                    if (!eventListeners) {
                        eventListeners = [];
                        this._listeners[eventName] = eventListeners;
                    }
                    eventListeners.push(listener);
                }
            }, {
                key: 'off',
                value: function off(eventName, listener) {
                    var eventListeners = this._listeners[eventName];
                    var i = void 0;
                    if (!eventListeners || (i = eventListeners.indexOf(listener)) < 0) {
                        return;
                    }
                    eventListeners.splice(i, 1);
                }
            }, {
                key: 'dispatch',
                value: function dispatch(eventName) {
                    var eventListeners = this._listeners[eventName];
                    if (!eventListeners || eventListeners.length === 0) {
                        return;
                    }
                    var args = Array.prototype.slice.call(arguments, 1);
                    eventListeners.slice(0).forEach(function (listener) {
                        listener.apply(null, args);
                    });
                }
            }]);

            return EventBus;
        }();

        exports.CSS_UNITS = CSS_UNITS;
        exports.DEFAULT_SCALE = DEFAULT_SCALE;
        exports.RendererType = RendererType;
        exports.EventBus = EventBus;
        exports.getPDFFileNameFromURL = getPDFFileNameFromURL;
        exports.parseQueryString = parseQueryString;
        exports.getVisibleElements = getVisibleElements;
        exports.roundToDivide = roundToDivide;
        exports.approximateFraction = approximateFraction;
        exports.getOutputScale = getOutputScale;
        exports.scrollIntoView = scrollIntoView;
        exports.watchScroll = watchScroll;
        exports.binarySearchFirstItem = binarySearchFirstItem;
    }),
    (function (module, exports, __webpack_require__) {

        var pdfjsLib;
        pdfjsLib = window['pdfjs-dist/build/pdf'];
        module.exports = pdfjsLib;
    }),
    (function (module, exports, __webpack_require__) {

        var _ui_utils = __webpack_require__(0);

        function attachDOMEventsToEventBus(eventBus) {
            eventBus.on('documentload', function () {
                var event = document.createEvent('CustomEvent');
                event.initCustomEvent('documentload', true, true, {});
                window.dispatchEvent(event);
            });
            eventBus.on('pagerendered', function (evt) {
                var event = document.createEvent('CustomEvent');
                event.initCustomEvent('pagerendered', true, true, {
                    pageNumber: evt.pageNumber,
                    cssTransform: evt.cssTransform
                });
                evt.source.div.dispatchEvent(event);
            });
            eventBus.on('pagechange', function (evt) {
                var event = document.createEvent('UIEvents');
                event.initUIEvent('pagechange', true, true, window, 0);
                event.pageNumber = evt.pageNumber;
                evt.source.container.dispatchEvent(event);
            });
            eventBus.on('pagesinit', function (evt) {
                var event = document.createEvent('CustomEvent');
                event.initCustomEvent('pagesinit', true, true, null);
                evt.source.container.dispatchEvent(event);
            });
            eventBus.on('pagesloaded', function (evt) {
                var event = document.createEvent('CustomEvent');
                event.initCustomEvent('pagesloaded', true, true, {pagesCount: evt.pagesCount});
                evt.source.container.dispatchEvent(event);
            });
            eventBus.on('scalechange', function (evt) {
                var event = document.createEvent('UIEvents');
                event.initUIEvent('scalechange', true, true, window, 0);
                event.scale = evt.scale;
                event.presetValue = evt.presetValue;
                evt.source.container.dispatchEvent(event);
            });
            eventBus.on('updateviewarea', function (evt) {
                var event = document.createEvent('UIEvents');
                event.initUIEvent('updateviewarea', true, true, window, 0);
                event.location = evt.location;
                evt.source.container.dispatchEvent(event);
            });
            eventBus.on('sidebarviewchanged', function (evt) {
                var event = document.createEvent('CustomEvent');
                event.initCustomEvent('sidebarviewchanged', true, true, {view: evt.view});
            });
            eventBus.on('pagemode', function (evt) {
                var event = document.createEvent('CustomEvent');
                event.initCustomEvent('pagemode', true, true, {mode: evt.mode});
                evt.source.pdfViewer.container.dispatchEvent(event);
            });
            eventBus.on('namedaction', function (evt) {
                var event = document.createEvent('CustomEvent');
                event.initCustomEvent('namedaction', true, true, {action: evt.action});
                evt.source.pdfViewer.container.dispatchEvent(event);
            });
            eventBus.on('presentationmodechanged', function (evt) {
                var event = document.createEvent('CustomEvent');
                event.initCustomEvent('presentationmodechanged', true, true, {
                    active: evt.active,
                    switchInProgress: evt.switchInProgress
                });
                window.dispatchEvent(event);
            });
            eventBus.on('outlineloaded', function (evt) {
                var event = document.createEvent('CustomEvent');
                event.initCustomEvent('outlineloaded', true, true, {outlineCount: evt.outlineCount});
            });
        }

        var globalEventBus = null;

        function getGlobalEventBus() {
            if (globalEventBus) {
                return globalEventBus;
            }
            globalEventBus = new _ui_utils.EventBus();
            attachDOMEventsToEventBus(globalEventBus);
            return globalEventBus;
        }

        // exports.attachDOMEventsToEventBus = attachDOMEventsToEventBus;
        exports.getGlobalEventBus = getGlobalEventBus;

    }),

     (function (module, exports, __webpack_require__) {

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }

            return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var CLEANUP_TIMEOUT = 30000;
        var RenderingStates = {
            INITIAL: 0,
            RUNNING: 1,
            PAUSED: 2,
            FINISHED: 3
        };

        var PDFRenderingQueue = function () {
            console.log("this is 739")
            function PDFRenderingQueue() {
                _classCallCheck(this, PDFRenderingQueue);

                this.pdfViewer = null;
                this.pdfThumbnailViewer = null;
                this.onIdle = null;
                this.highestPriorityPage = null;
                this.idleTimeout = null;
                this.printing = false;
                this.isThumbnailViewEnabled = false;
            }

            _createClass(PDFRenderingQueue, [{
                key: "setViewer",
                value: function setViewer(pdfViewer) {
                    this.pdfViewer = pdfViewer;
                }
            }, {
                key: "setThumbnailViewer",
                value: function setThumbnailViewer(pdfThumbnailViewer) {
                    this.pdfThumbnailViewer = pdfThumbnailViewer;
                }
            }, {
                key: "isHighestPriority",
                value: function isHighestPriority(view) {
                    return this.highestPriorityPage === view.renderingId;
                }
            }, {
                key: "renderHighestPriority",
                value: function renderHighestPriority(currentlyVisiblePages) {
                    if (this.idleTimeout) {
                        clearTimeout(this.idleTimeout);
                        this.idleTimeout = null;
                    }
                    if (this.pdfViewer.forceRendering(currentlyVisiblePages)) {
                        return;
                    }
                    if (this.pdfThumbnailViewer && this.isThumbnailViewEnabled) {
                        if (this.pdfThumbnailViewer.forceRendering()) {
                            return;
                        }
                    }
                    if (this.printing) {
                        return;
                    }
                    if (this.onIdle) {
                        this.idleTimeout = setTimeout(this.onIdle.bind(this), CLEANUP_TIMEOUT);
                    }
                }
            }, {
                key: "getHighestPriority",
                value: function getHighestPriority(visible, views, scrolledDown) {
                    var visibleViews = visible.views;
                    var numVisible = visibleViews.length;
                    if (numVisible === 0) {
                        return false;
                    }
                    for (var i = 0; i < numVisible; ++i) {
                        var view = visibleViews[i].view;
                        if (!this.isViewFinished(view)) {
                            return view;
                        }
                    }
                    if (scrolledDown) {
                        var nextPageIndex = visible.last.id;
                        if (views[nextPageIndex] && !this.isViewFinished(views[nextPageIndex])) {
                            return views[nextPageIndex];
                        }
                    } else {
                        var previousPageIndex = visible.first.id - 2;
                        if (views[previousPageIndex] && !this.isViewFinished(views[previousPageIndex])) {
                            return views[previousPageIndex];
                        }
                    }
                    return null;
                }
            }, {
                key: "isViewFinished",
                value: function isViewFinished(view) {
                    return view.renderingState === RenderingStates.FINISHED;
                }
            }, {
                key: "renderView",
                value: function renderView(view) {
                    var _this = this;

                    switch (view.renderingState) {
                        case RenderingStates.FINISHED:
                            return false;
                        case RenderingStates.PAUSED:
                            this.highestPriorityPage = view.renderingId;
                            view.resume();
                            break;
                        case RenderingStates.RUNNING:
                            this.highestPriorityPage = view.renderingId;
                            break;
                        case RenderingStates.INITIAL:
                            this.highestPriorityPage = view.renderingId;
                            var continueRendering = function continueRendering() {
                                _this.renderHighestPriority();
                            };
                            view.draw().then(continueRendering, continueRendering);
                            break;
                    }
                    return true;
                }
            }]);

            return PDFRenderingQueue;
        }();

        exports.RenderingStates = RenderingStates;
        exports.PDFRenderingQueue = PDFRenderingQueue;
    }),

    (function (module, exports, __webpack_require__) {

        var _slicedToArray = function () {
            function sliceIterator(arr, i) {
                var _arr = [];
                var _n = true;
                var _d = false;
                var _e = undefined;
                try {
                    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                        _arr.push(_s.value);
                        if (i && _arr.length === i) break;
                    }
                } catch (err) {
                    _d = true;
                    _e = err;
                } finally {
                    try {
                        if (!_n && _i["return"]) _i["return"]();
                    } finally {
                        if (_d) throw _e;
                    }
                }
                return _arr;
            }

            return function (arr, i) {
                if (Array.isArray(arr)) {
                    return arr;
                } else if (Symbol.iterator in Object(arr)) {
                    return sliceIterator(arr, i);
                } else {
                    throw new TypeError("Invalid attempt to destructure non-iterable instance");
                }
            };
        }();

        var _ui_utils = __webpack_require__(0);

        var _pdfjsLib = __webpack_require__(1);

        var _pdf_cursor_tools = __webpack_require__(6);

        var _pdf_rendering_queue = __webpack_require__(3);

        var _pdf_sidebar = __webpack_require__(24);

        var _pdf_viewer = __webpack_require__(27);

        var _dom_events = __webpack_require__(2);

        var _overlay_manager = __webpack_require__(15);


        var _pdf_attachment_viewer = __webpack_require__(17);

        var _pdf_document_properties = __webpack_require__(18);

        var _pdf_history = __webpack_require__(20);

        var _pdf_link_service = __webpack_require__(5);

        var _pdf_outline_viewer = __webpack_require__(21);


        var _pdf_thumbnail_viewer = __webpack_require__(26);


        var _toolbar = __webpack_require__(31);

        var _view_history = __webpack_require__(32);


        function configure(PDFJS) {
            PDFJS.workerSrc = '../build/pdf.worker.js';
            PDFJS.cMapUrl = '../web/cmaps/';
            PDFJS.cMapPacked = true;
        }

        var DefaultExternalServices = {

            initPassiveLoading: function initPassiveLoading(callbacks) {
            },
            fallback: function fallback(data, callback) {
            },
            reportTelemetry: function reportTelemetry(data) {
            },
            createPreferences: function createPreferences() {
                throw new Error('Not implemented: createPreferences');
            },
            createL10n: function createL10n() {
                throw new Error('Not implemented: createL10n');
            },

            supportsDocumentFonts: true,
            supportsDocumentColors: true,
            supportedMouseWheelZoomModifierKeys: {
                ctrlKey: true,
                metaKey: true
            }
        };
        var PDFViewerApplication = {
            initialBookmark: document.location.hash.substring(1),
            initialDestination: null,
            initialized: false,
            fellback: false,
            appConfig: null,
            pdfDocument: null,
            pdfLoadingTask: null,
            printService: null,
            pdfViewer: null,
            pdfThumbnailViewer: null,
            pdfRenderingQueue: null,
            pdfPresentationMode: null,
            pdfDocumentProperties: null,
            pdfLinkService: null,
            pdfHistory: null,
            pdfSidebar: null,
            pdfOutlineViewer: null,
            pdfAttachmentViewer: null,
            pdfCursorTools: null,
            store: null,
            overlayManager: null,
            preferences: null,
            toolbar: null,
            eventBus: null,
            l10n: null,
            isInitialViewSet: false,
            viewerPrefs: {
                sidebarViewOnLoad: _pdf_sidebar.SidebarView.NONE,
                pdfBugEnabled: false,
                showPreviousViewOnLoad: true,
                defaultZoomValue: '',
                disablePageMode: false,
                disablePageLabels: false,
                renderer: 'canvas',
                enhanceTextSelection: false,
                renderInteractiveForms: false,
                enablePrintAutoRotate: false
            },
            isViewerEmbedded: window.parent !== window,
            url: '',
            baseUrl: '',
            externalServices: DefaultExternalServices,
            _boundEvents: {},
            initialize: function initialize(appConfig) {
                var _this = this;

                this.preferences = this.externalServices.createPreferences();
                configure(_pdfjsLib.PDFJS);
                this.appConfig = appConfig;
                return this._readPreferences().then(function () {
                    return _this._initializeL10n();
                }).then(function () {
                    return _this._initializeViewerComponents();
                }).then(function () {
                    _this.bindEvents();
                    _this.bindWindowEvents();
                    var appContainer = appConfig.appContainer || document.documentElement;
                    _this.l10n.translate(appContainer).then(function () {
                        _this.eventBus.dispatch('localized');
                    });
                    if (_this.isViewerEmbedded && !_pdfjsLib.PDFJS.isExternalLinkTargetSet()) {
                        _pdfjsLib.PDFJS.externalLinkTarget = _pdfjsLib.PDFJS.LinkTarget.TOP;
                    }
                    _this.initialized = true;
                });
            },
            _readPreferences: function _readPreferences() {
                var preferences = this.preferences,
                    viewerPrefs = this.viewerPrefs;

                return Promise.all([preferences.get('enableWebGL').then(function resolved(value) {
                    _pdfjsLib.PDFJS.disableWebGL = !value;
                }), preferences.get('sidebarViewOnLoad').then(function resolved(value) {
                    viewerPrefs['sidebarViewOnLoad'] = value;
                }), preferences.get('pdfBugEnabled').then(function resolved(value) {
                    viewerPrefs['pdfBugEnabled'] = value;
                }), preferences.get('showPreviousViewOnLoad').then(function resolved(value) {
                    viewerPrefs['showPreviousViewOnLoad'] = value;
                }), preferences.get('defaultZoomValue').then(function resolved(value) {
                    viewerPrefs['defaultZoomValue'] = value;
                }), preferences.get('enhanceTextSelection').then(function resolved(value) {
                    viewerPrefs['enhanceTextSelection'] = value;
                }),
                    preferences.get('disableRange').then(function resolved(value) {
                        if (_pdfjsLib.PDFJS.disableRange === true) {
                            return;
                        }
                        _pdfjsLib.PDFJS.disableRange = value;
                    }), preferences.get('disableStream').then(function resolved(value) {
                        if (_pdfjsLib.PDFJS.disableStream === true) {
                            return;
                        }
                        _pdfjsLib.PDFJS.disableStream = value;
                    }), preferences.get('disableAutoFetch').then(function resolved(value) {
                        _pdfjsLib.PDFJS.disableAutoFetch = value;
                    }), preferences.get('disableFontFace').then(function resolved(value) {
                        if (_pdfjsLib.PDFJS.disableFontFace === true) {
                            return;
                        }
                        _pdfjsLib.PDFJS.disableFontFace = value;
                    }), preferences.get('useOnlyCssZoom').then(function resolved(value) {
                        _pdfjsLib.PDFJS.useOnlyCssZoom = value;
                    }), preferences.get('externalLinkTarget').then(function resolved(value) {
                        if (_pdfjsLib.PDFJS.isExternalLinkTargetSet()) {
                            return;
                        }
                        _pdfjsLib.PDFJS.externalLinkTarget = value;
                    }), preferences.get('renderer').then(function resolved(value) {
                        viewerPrefs['renderer'] = value;
                    }), preferences.get('renderInteractiveForms').then(function resolved(value) {
                        viewerPrefs['renderInteractiveForms'] = value;
                    }), preferences.get('disablePageMode').then(function resolved(value) {
                        viewerPrefs['disablePageMode'] = value;
                    }), preferences.get('disablePageLabels').then(function resolved(value) {
                        viewerPrefs['disablePageLabels'] = value;
                    }), preferences.get('enablePrintAutoRotate').then(function resolved(value) {
                        viewerPrefs['enablePrintAutoRotate'] = value;
                    })]).catch(function (reason) {
                });
            },
            _initializeL10n: function _initializeL10n() {
                if (this.viewerPrefs['pdfBugEnabled']) {
                    var hash = document.location.hash.substring(1);
                    var hashParams = (0, _ui_utils.parseQueryString)(hash);
                    if ('locale' in hashParams) {
                        _pdfjsLib.PDFJS.locale = hashParams['locale'];
                    }
                }
                this.l10n = this.externalServices.createL10n();
                return this.l10n.getDirection().then(function (dir) {
                    document.getElementsByTagName('html')[0].dir = dir;
                });
            },
            _initializeViewerComponents: function _initializeViewerComponents() {
                var _this2 = this;

                var appConfig = this.appConfig;
                return new Promise(function (resolve, reject) {
                    _this2.overlayManager = new _overlay_manager.OverlayManager();
                    var eventBus = appConfig.eventBus || (0, _dom_events.getGlobalEventBus)();
                    _this2.eventBus = eventBus;
                    var pdfRenderingQueue = new _pdf_rendering_queue.PDFRenderingQueue();
                    pdfRenderingQueue.onIdle = _this2.cleanup.bind(_this2);
                    _this2.pdfRenderingQueue = pdfRenderingQueue;
                    var pdfLinkService = new _pdf_link_service.PDFLinkService({eventBus: eventBus});
                    _this2.pdfLinkService = pdfLinkService;
                    var container = appConfig.mainContainer;
                    var viewer = appConfig.viewerContainer;
                    _this2.pdfViewer = new _pdf_viewer.PDFViewer({
                        container: container,
                        viewer: viewer,
                        eventBus: eventBus,
                        renderingQueue: pdfRenderingQueue,
                        linkService: pdfLinkService,
                        renderer: _this2.viewerPrefs['renderer'],
                        l10n: _this2.l10n,
                        enhanceTextSelection: _this2.viewerPrefs['enhanceTextSelection'],
                        renderInteractiveForms: _this2.viewerPrefs['renderInteractiveForms'],
                        enablePrintAutoRotate: _this2.viewerPrefs['enablePrintAutoRotate']
                    });
                    pdfRenderingQueue.setViewer(_this2.pdfViewer);
                    pdfLinkService.setViewer(_this2.pdfViewer);
                    var thumbnailContainer = appConfig.sidebar.thumbnailView;
                    _this2.pdfThumbnailViewer = new _pdf_thumbnail_viewer.PDFThumbnailViewer({
                        container: thumbnailContainer,
                        renderingQueue: pdfRenderingQueue,
                        linkService: pdfLinkService,
                        l10n: _this2.l10n
                    });
                    pdfRenderingQueue.setThumbnailViewer(_this2.pdfThumbnailViewer);
                    _this2.pdfHistory = new _pdf_history.PDFHistory({
                        linkService: pdfLinkService,
                        eventBus: eventBus
                    });
                    pdfLinkService.setHistory(_this2.pdfHistory);
                    _this2.pdfDocumentProperties = new _pdf_document_properties.PDFDocumentProperties(appConfig.documentProperties, _this2.overlayManager, _this2.l10n);
                    _this2.pdfCursorTools = new _pdf_cursor_tools.PDFCursorTools({
                        container: container,
                        eventBus: eventBus,
                        preferences: _this2.preferences
                    });
                    _this2.toolbar = new _toolbar.Toolbar(appConfig.toolbar, container, eventBus, _this2.l10n);
                    _this2.pdfOutlineViewer = new _pdf_outline_viewer.PDFOutlineViewer({
                        container: appConfig.sidebar.outlineView,
                        eventBus: eventBus,
                        linkService: pdfLinkService
                    });
                    var sidebarConfig = Object.create(appConfig.sidebar);
                    sidebarConfig.pdfViewer = _this2.pdfViewer;
                    sidebarConfig.pdfThumbnailViewer = _this2.pdfThumbnailViewer;
                    sidebarConfig.pdfOutlineViewer = _this2.pdfOutlineViewer;
                    sidebarConfig.eventBus = eventBus;
                    _this2.pdfSidebar = new _pdf_sidebar.PDFSidebar(sidebarConfig, _this2.l10n);
                    _this2.pdfSidebar.onToggled = _this2.forceRendering.bind(_this2);
                    resolve(undefined);
                });
            },
            run: function run(config) {
                this.initialize(config).then(webViewerInitialized);
            },

            get pagesCount() {
                return this.pdfDocument ? this.pdfDocument.numPages : 0;
            },
            set page(val) {
                this.pdfViewer.currentPageNumber = val;
            },
            get page() {
                return this.pdfViewer.currentPageNumber;
            },
            get printing() {
                return !!this.printService;
            },
            get supportsPrinting() {
                return PDFPrintServiceFactory.instance.supportsPrinting;
            },
            get supportsDocumentFonts() {
                return this.externalServices.supportsDocumentFonts;
            },
            get supportsDocumentColors() {
                return this.externalServices.supportsDocumentColors;
            },
            get supportedMouseWheelZoomModifierKeys() {
                return this.externalServices.supportedMouseWheelZoomModifierKeys;
            },
            initPassiveLoading: function initPassiveLoading() {
                throw new Error('Not implemented: initPassiveLoading');
            },
            setTitleUsingUrl: function setTitleUsingUrl(url) {
                this.url = url;
                this.baseUrl = url.split('#')[0];
                var title = (0, _ui_utils.getPDFFileNameFromURL)(url, '');
                if (!title) {
                    try {
                        title = decodeURIComponent((0, _pdfjsLib.getFilenameFromUrl)(url)) || url;
                    } catch (ex) {
                        title = url;
                    }
                }
                this.setTitle(title);
            },
            setTitle: function setTitle(title) {
                if (this.isViewerEmbedded) {
                    return;
                }
                document.title = title;
            },
            close: function close() {
                errorWrapper.setAttribute('hidden', 'true');
                if (!this.pdfLoadingTask) {
                    return Promise.resolve();
                }
                var promise = this.pdfLoadingTask.destroy();
                this.pdfLoadingTask = null;
                if (this.pdfDocument) {
                    this.pdfDocument = null;
                    this.pdfThumbnailViewer.setDocument(null);
                    this.pdfViewer.setDocument(null);
                    this.pdfLinkService.setDocument(null, null);
                    this.pdfDocumentProperties.setDocument(null, null);
                }
                this.store = null;
                this.isInitialViewSet = false;
                this.pdfSidebar.reset();
                this.pdfOutlineViewer.reset();
                this.pdfAttachmentViewer.reset();
                this.toolbar.reset();
                if (typeof PDFBug !== 'undefined') {
                    PDFBug.cleanup();
                }
                return promise;
            },
            open: function open(file, args) {
                var _this3 = this;

                if (arguments.length > 2 || typeof args === 'number') {
                    return Promise.reject(new Error('Call of open() with obsolete signature.'));
                }
                if (this.pdfLoadingTask) {
                    return this.close().then(function () {
                        _this3.preferences.reload();
                        return _this3.open(file, args);
                    });
                }
                var parameters = Object.create(null),
                    scale = void 0;
                if (typeof file === 'string') {
                    this.setTitleUsingUrl(file);
                    parameters.url = file;
                } else if (file && 'byteLength' in file) {
                    parameters.data = file;
                } else if (file.url && file.originalUrl) {
                    this.setTitleUsingUrl(file.originalUrl);
                    parameters.url = file.url;
                }
                if (args) {
                    for (var prop in args) {
                        parameters[prop] = args[prop];
                    }
                    if (args.scale) {
                        scale = args.scale;
                    }
                    if (args.length) {
                        this.pdfDocumentProperties.setFileSize(args.length);
                    }
                }
                var loadingTask = (0, _pdfjsLib.getDocument)(parameters);
                this.pdfLoadingTask = loadingTask;
                loadingTask.onPassword = function (updateCallback, reason) {
                    _this3.passwordPrompt.setUpdateCallback(updateCallback, reason);
                    _this3.passwordPrompt.open();
                };
                loadingTask.onProgress = function (_ref) {
                    var loaded = _ref.loaded,
                        total = _ref.total;

                    _this3.progress(loaded / total);
                };
                loadingTask.onUnsupportedFeature = this.fallback.bind(this);
                return loadingTask.promise.then(function (pdfDocument) {
                    _this3.load(pdfDocument, scale);
                }, function (exception) {
                    var message = exception && exception.message;
                    var loadingErrorMessage = void 0;
                    if (exception instanceof _pdfjsLib.InvalidPDFException) {
                        loadingErrorMessage = _this3.l10n.get('invalid_file_error', null, 'Invalid or corrupted PDF file.');
                    } else if (exception instanceof _pdfjsLib.MissingPDFException) {
                        loadingErrorMessage = _this3.l10n.get('missing_file_error', null, 'Missing PDF file.');
                    } else if (exception instanceof _pdfjsLib.UnexpectedResponseException) {
                        loadingErrorMessage = _this3.l10n.get('unexpected_response_error', null, 'Unexpected server response.');
                    } else {
                        loadingErrorMessage = _this3.l10n.get('loading_error', null, 'An error occurred while loading the PDF.');
                    }
                    return loadingErrorMessage.then(function (msg) {
                        _this3.error(msg, {message: message});
                        throw new Error(msg);
                    });
                });
            },
            fallback: function fallback(featureId) {
            },
            error: function error(message, moreInfo) {
                var moreInfoText = [this.l10n.get('error_version_info', {
                    version: _pdfjsLib.version || '?',
                    build: _pdfjsLib.build || '?'
                }, 'PDF.js v{{version}} (build: {{build}})')];
                if (moreInfo) {
                    moreInfoText.push(this.l10n.get('error_message', {message: moreInfo.message}, 'Message: {{message}}'));
                    if (moreInfo.stack) {
                        moreInfoText.push(this.l10n.get('error_stack', {stack: moreInfo.stack}, 'Stack: {{stack}}'));
                    } else {
                        if (moreInfo.filename) {
                            moreInfoText.push(this.l10n.get('error_file', {file: moreInfo.filename}, 'File: {{file}}'));
                        }
                        if (moreInfo.lineNumber) {
                            moreInfoText.push(this.l10n.get('error_line', {line: moreInfo.lineNumber}, 'Line: {{line}}'));
                        }
                    }
                }

                moreInfoButton.onclick = function () {
                    moreInfoButton.setAttribute('hidden', 'true');
                    lessInfoButton.removeAttribute('hidden');
                };
                lessInfoButton.onclick = function () {
                    moreInfoButton.removeAttribute('hidden');
                    lessInfoButton.setAttribute('hidden', 'true');
                };
                moreInfoButton.oncontextmenu = _ui_utils.noContextMenuHandler;
                lessInfoButton.oncontextmenu = _ui_utils.noContextMenuHandler;
                closeButton.oncontextmenu = _ui_utils.noContextMenuHandler;
                moreInfoButton.removeAttribute('hidden');
                lessInfoButton.setAttribute('hidden', 'true');
                Promise.all(moreInfoText).then(function (parts) {
                });
            },
            progress: function progress(level) {
                var _this5 = this;

                var percent = Math.round(level * 100);
            },
            load: function load(pdfDocument, scale) {
                var _this6 = this;

                scale = scale || _ui_utils.UNKNOWN_SCALE;
                this.pdfDocument = pdfDocument;
                var pageModePromise = pdfDocument.getPageMode().catch(function () {
                });
                this.toolbar.setPagesCount(pdfDocument.numPages, false);
                var id = this.documentFingerprint = pdfDocument.fingerprint;
                var store = this.store = new _view_history.ViewHistory(id);
                var baseDocumentUrl = void 0;
                baseDocumentUrl = null;
                this.pdfLinkService.setDocument(pdfDocument, baseDocumentUrl);
                this.pdfDocumentProperties.setDocument(pdfDocument, this.url);
                var pdfViewer = this.pdfViewer;
                pdfViewer.setDocument(pdfDocument);
                var firstPagePromise = pdfViewer.firstPagePromise;
                var pagesPromise = pdfViewer.pagesPromise;
                var onePageRendered = pdfViewer.onePageRendered;
                var pdfThumbnailViewer = this.pdfThumbnailViewer;
                pdfThumbnailViewer.setDocument(pdfDocument);
                firstPagePromise.then(function (pdfPage) {
                    if (!_pdfjsLib.PDFJS.disableHistory && !_this6.isViewerEmbedded) {
                        if (!_this6.viewerPrefs['showPreviousViewOnLoad']) {
                            _this6.pdfHistory.clearHistoryState();
                        }
                        _this6.pdfHistory.initialize(_this6.documentFingerprint);
                        if (_this6.pdfHistory.initialDestination) {
                            _this6.initialDestination = _this6.pdfHistory.initialDestination;
                        } else if (_this6.pdfHistory.initialBookmark) {
                            _this6.initialBookmark = _this6.pdfHistory.initialBookmark;
                        }
                    }
                    var initialParams = {
                        destination: _this6.initialDestination,
                        bookmark: _this6.initialBookmark,
                        hash: null
                    };
                    var storePromise = store.getMultiple({
                        exists: false,
                        page: '1',
                        zoom: _ui_utils.DEFAULT_SCALE_VALUE,
                        scrollLeft: '0',
                        scrollTop: '0',
                        sidebarView: _pdf_sidebar.SidebarView.NONE
                    }).catch(function () {
                    });
                    Promise.all([storePromise, pageModePromise]).then(function (_ref2) {
                        var _ref3 = _slicedToArray(_ref2, 2),
                            _ref3$ = _ref3[0],
                            values = _ref3$ === undefined ? {} : _ref3$,
                            pageMode = _ref3[1];

                        var hash = _this6.viewerPrefs['defaultZoomValue'] ? 'zoom=' + _this6.viewerPrefs['defaultZoomValue'] : null;
                        var sidebarView = _this6.viewerPrefs['sidebarViewOnLoad'];
                        if (values.exists && _this6.viewerPrefs['showPreviousViewOnLoad']) {
                            hash = 'page=' + values.page + '&zoom=' + (_this6.viewerPrefs['defaultZoomValue'] || values.zoom) + ',' + values.scrollLeft + ',' + values.scrollTop;
                            sidebarView = sidebarView || values.sidebarView | 0;
                        }
                        if (pageMode && !_this6.viewerPrefs['disablePageMode']) {
                            sidebarView = sidebarView || apiPageModeToSidebarView(pageMode);
                        }
                        return {
                            hash: hash,
                            sidebarView: sidebarView
                        };
                    }).then(function (_ref4) {
                        var hash = _ref4.hash,
                            sidebarView = _ref4.sidebarView;

                        _this6.setInitialView(hash, {
                            sidebarView: sidebarView,
                            scale: scale
                        });
                        initialParams.hash = hash;
                        if (!_this6.isViewerEmbedded) {
                            pdfViewer.focus();
                        }
                        return pagesPromise;
                    }).then(function () {
                        if (!initialParams.destination && !initialParams.bookmark && !initialParams.hash) {
                            return;
                        }
                        if (pdfViewer.hasEqualPageSizes) {
                            return;
                        }
                        _this6.initialDestination = initialParams.destination;
                        _this6.initialBookmark = initialParams.bookmark;
                        pdfViewer.currentScaleValue = pdfViewer.currentScaleValue;
                        _this6.setInitialView(initialParams.hash);
                    }).then(function () {
                        pdfViewer.update();
                    });
                });
                pdfDocument.getPageLabels().then(function (labels) {
                    if (!labels || _this6.viewerPrefs['disablePageLabels']) {
                        return;
                    }
                    var i = 0,
                        numLabels = labels.length;
                    if (numLabels !== _this6.pagesCount) {
                        console.error('The number of Page Labels does not match ' + 'the number of pages in the document.');
                        return;
                    }
                    while (i < numLabels && labels[i] === (i + 1).toString()) {
                        i++;
                    }
                    if (i === numLabels) {
                        return;
                    }
                    pdfViewer.setPageLabels(labels);
                    pdfThumbnailViewer.setPageLabels(labels);
                    _this6.toolbar.setPagesCount(pdfDocument.numPages, true);
                    _this6.toolbar.setPageNumber(pdfViewer.currentPageNumber, pdfViewer.currentPageLabel);
                });
                pagesPromise.then(function () {
                    if (!_this6.supportsPrinting) {
                        return;
                    }
                    pdfDocument.getJavaScript().then(function (javaScript) {
                        if (javaScript.length) {
                            console.warn('Warning: JavaScript is not supported');
                            _this6.fallback(_pdfjsLib.UNSUPPORTED_FEATURES.javaScript);
                        }
                        var regex = /\bprint\s*\(/;
                        for (var i = 0, ii = javaScript.length; i < ii; i++) {
                            var js = javaScript[i];
                            if (js && regex.test(js)) {
                                setTimeout(function () {
                                    window.print();
                                });
                                return;
                            }
                        }
                    });
                });
                Promise.all([onePageRendered, _ui_utils.animationStarted]).then(function () {
                    pdfDocument.getOutline().then(function (outline) {
                        _this6.pdfOutlineViewer.render({outline: outline});
                    });

                });
                pdfDocument.getMetadata().then(function (_ref5) {
                    var info = _ref5.info,
                        metadata = _ref5.metadata;

                    _this6.documentInfo = info;
                    _this6.metadata = metadata;
                    console.log('PDF ' + pdfDocument.fingerprint + ' [' + info.PDFFormatVersion + ' ' + (info.Producer || '-').trim() + ' / ' + (info.Creator || '-').trim() + ']' + ' (PDF.js: ' + (_pdfjsLib.version || '-') + (!_pdfjsLib.PDFJS.disableWebGL ? ' [WebGL]' : '') + ')');
                    var pdfTitle = void 0;
                    if (metadata && metadata.has('dc:title')) {
                        var title = metadata.get('dc:title');
                        if (title !== 'Untitled') {
                            pdfTitle = title;
                        }
                    }
                    if (!pdfTitle && info && info['Title']) {
                        pdfTitle = info['Title'];
                    }
                    if (pdfTitle) {
                        _this6.setTitle(pdfTitle + ' - ' + document.title);
                    }
                    if (info.IsAcroFormPresent) {
                        console.warn('Warning: AcroForm/XFA is not supported');
                        _this6.fallback(_pdfjsLib.UNSUPPORTED_FEATURES.forms);
                    }
                });
            },
            setInitialView: function setInitialView(storedHash) {
                var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var _options$scale = options.scale,
                    scale = _options$scale === undefined ? 0 : _options$scale,
                    _options$sidebarView = options.sidebarView,
                    sidebarView = _options$sidebarView === undefined ? _pdf_sidebar.SidebarView.NONE : _options$sidebarView;

                this.isInitialViewSet = true;
                this.pdfSidebar.setInitialView(sidebarView);
                if (this.initialDestination) {
                    this.pdfLinkService.navigateTo(this.initialDestination);
                    this.initialDestination = null;
                } else if (this.initialBookmark) {
                    this.pdfLinkService.setHash(this.initialBookmark);
                    this.pdfHistory.push({hash: this.initialBookmark}, true);
                    this.initialBookmark = null;
                } else if (storedHash) {
                    this.pdfLinkService.setHash(storedHash);
                } else if (scale) {
                    this.pdfViewer.currentScaleValue = scale;
                    this.page = 1;
                }
                this.toolbar.setPageNumber(this.pdfViewer.currentPageNumber, this.pdfViewer.currentPageLabel);
                if (!this.pdfViewer.currentScaleValue) {
                    this.pdfViewer.currentScaleValue = _ui_utils.DEFAULT_SCALE_VALUE;
                }
            },
            cleanup: function cleanup() {
                if (!this.pdfDocument) {
                    return;
                }
                this.pdfViewer.cleanup();
                this.pdfThumbnailViewer.cleanup();
                if (this.pdfViewer.renderer !== _ui_utils.RendererType.SVG) {
                    this.pdfDocument.cleanup();
                }
            },
            forceRendering: function forceRendering() {
                this.pdfRenderingQueue.printing = this.printing;
                this.pdfRenderingQueue.isThumbnailViewEnabled = this.pdfSidebar.isThumbnailViewVisible;
                this.pdfRenderingQueue.renderHighestPriority();
            },
            beforePrint: function beforePrint() {
                var _this7 = this;

                if (this.printService) {
                    return;
                }
                if (!this.supportsPrinting) {
                    this.l10n.get('printing_not_supported', null, 'Warning: Printing is not fully supported by ' + 'this browser.').then(function (printMessage) {
                        _this7.error(printMessage);
                    });
                    return;
                }
                if (!this.pdfViewer.pageViewsReady) {
                    this.l10n.get('printing_not_ready', null, 'Warning: The PDF is not fully loaded for printing.').then(function (notReadyMessage) {
                        window.alert(notReadyMessage);
                    });
                    return;
                }
                var pagesOverview = this.pdfViewer.getPagesOverview();
                this.printService = printService;
                this.forceRendering();
                printService.layout();
            },

            afterPrint: function pdfViewSetupAfterPrint() {
                if (this.printService) {
                    this.printService.destroy();
                    this.printService = null;
                }
                this.forceRendering();
            },
            rotatePages: function rotatePages(delta) {
                if (!this.pdfDocument) {
                    return;
                }
                var pdfViewer = this.pdfViewer,
                    pdfThumbnailViewer = this.pdfThumbnailViewer;

                var pageNumber = pdfViewer.currentPageNumber;
                var newRotation = (pdfViewer.pagesRotation + 360 + delta) % 360;
                pdfViewer.pagesRotation = newRotation;
                pdfThumbnailViewer.pagesRotation = newRotation;
                this.forceRendering();
                pdfViewer.currentPageNumber = pageNumber;
            },
            requestPresentationMode: function requestPresentationMode() {
                if (!this.pdfPresentationMode) {
                    return;
                }
                this.pdfPresentationMode.request();
            },
            bindEvents: function bindEvents() {
                var eventBus = this.eventBus,
                    _boundEvents = this._boundEvents;

                _boundEvents.beforePrint = this.beforePrint.bind(this);
                _boundEvents.afterPrint = this.afterPrint.bind(this);
                eventBus.on('resize', webViewerResize);
                eventBus.on('hashchange', webViewerHashchange);
                eventBus.on('beforeprint', _boundEvents.beforePrint);
                eventBus.on('afterprint', _boundEvents.afterPrint);
                eventBus.on('pagerendered', webViewerPageRendered);
                eventBus.on('updateviewarea', webViewerUpdateViewarea);
                eventBus.on('pagechanging', webViewerPageChanging);
                eventBus.on('scalechanging', webViewerScaleChanging);
                eventBus.on('sidebarviewchanged', webViewerSidebarViewChanged);
                eventBus.on('pagemode', webViewerPageMode);
                eventBus.on('presentationmodechanged', webViewerPresentationModeChanged);
                eventBus.on('presentationmode', webViewerPresentationMode);
                eventBus.on('print', webViewerPrint);
                eventBus.on('firstpage', webViewerFirstPage);
                eventBus.on('lastpage', webViewerLastPage);
                eventBus.on('nextpage', webViewerNextPage);
                eventBus.on('previouspage', webViewerPreviousPage);
                eventBus.on('pagenumberchanged', webViewerPageNumberChanged);
                eventBus.on('scalechanged', webViewerScaleChanged);
                eventBus.on('rotatecw', webViewerRotateCw);
                eventBus.on('rotateccw', webViewerRotateCcw);
                eventBus.on('documentproperties', webViewerDocumentProperties);
                eventBus.on('fileinputchange', webViewerFileInputChange);
            },
            bindWindowEvents: function bindWindowEvents() {
                var eventBus = this.eventBus,
                    _boundEvents = this._boundEvents;

                _boundEvents.windowResize = function () {
                    eventBus.dispatch('resize');
                };
                _boundEvents.windowHashChange = function () {
                    eventBus.dispatch('hashchange', {hash: document.location.hash.substring(1)});
                };
                _boundEvents.windowBeforePrint = function () {
                    eventBus.dispatch('beforeprint');
                };
                _boundEvents.windowAfterPrint = function () {
                    eventBus.dispatch('afterprint');
                };
                window.addEventListener('wheel', webViewerWheel);
                window.addEventListener('keydown', webViewerKeyDown);
                window.addEventListener('resize', _boundEvents.windowResize);
                window.addEventListener('hashchange', _boundEvents.windowHashChange);
                window.addEventListener('beforeprint', _boundEvents.windowBeforePrint);
                window.addEventListener('afterprint', _boundEvents.windowAfterPrint);
                _boundEvents.windowChange = function (evt) {
                    var files = evt.target.files;
                    if (!files || files.length === 0) {
                        return;
                    }
                    eventBus.dispatch('fileinputchange', {fileInput: evt.target});
                };
                window.addEventListener('change', _boundEvents.windowChange);
            },
            unbindEvents: function unbindEvents() {
                var eventBus = this.eventBus,
                    _boundEvents = this._boundEvents;

                eventBus.off('resize', webViewerResize);
                eventBus.off('hashchange', webViewerHashchange);
                eventBus.off('beforeprint', _boundEvents.beforePrint);
                eventBus.off('afterprint', _boundEvents.afterPrint);
                eventBus.off('pagerendered', webViewerPageRendered);
                eventBus.off('updateviewarea', webViewerUpdateViewarea);
                eventBus.off('pagechanging', webViewerPageChanging);
                eventBus.off('scalechanging', webViewerScaleChanging);
                eventBus.off('sidebarviewchanged', webViewerSidebarViewChanged);
                eventBus.off('pagemode', webViewerPageMode);
                eventBus.off('namedaction', webViewerNamedAction);
                eventBus.off('presentationmodechanged', webViewerPresentationModeChanged);
                eventBus.off('presentationmode', webViewerPresentationMode);
                eventBus.off('print', webViewerPrint);
                eventBus.off('firstpage', webViewerFirstPage);
                eventBus.off('lastpage', webViewerLastPage);
                eventBus.off('nextpage', webViewerNextPage);
                eventBus.off('previouspage', webViewerPreviousPage);
                eventBus.off('pagenumberchanged', webViewerPageNumberChanged);
                eventBus.off('scalechanged', webViewerScaleChanged);
                eventBus.off('rotatecw', webViewerRotateCw);
                eventBus.off('rotateccw', webViewerRotateCcw);
                eventBus.off('documentproperties', webViewerDocumentProperties);
                eventBus.off('fileinputchange', webViewerFileInputChange);
                _boundEvents.beforePrint = null;
                _boundEvents.afterPrint = null;
            },
            unbindWindowEvents: function unbindWindowEvents() {
                var _boundEvents = this._boundEvents;

                window.removeEventListener('wheel', webViewerWheel);
                window.removeEventListener('click', webViewerClick);
                window.removeEventListener('keydown', webViewerKeyDown);
                window.removeEventListener('resize', _boundEvents.windowResize);
                window.removeEventListener('hashchange', _boundEvents.windowHashChange);
                window.removeEventListener('beforeprint', _boundEvents.windowBeforePrint);
                window.removeEventListener('afterprint', _boundEvents.windowAfterPrint);
                window.removeEventListener('change', _boundEvents.windowChange);
                _boundEvents.windowChange = null;
                _boundEvents.windowResize = null;
                _boundEvents.windowHashChange = null;
                _boundEvents.windowBeforePrint = null;
                _boundEvents.windowAfterPrint = null;
            }
        };
        var validateFileURL = void 0;
        {
            validateFileURL = function validateFileURL(file) {
                if (file === undefined) {
                    return;
                }
                try {
                    var viewerOrigin = new URL(window.location.href).origin || 'null';
                    var fileOrigin = new URL(file, window.location.href).origin;
                    if (fileOrigin !== viewerOrigin) {
                        throw new Error('file origin does not match viewer\'s');
                    }
                } catch (ex) {
                    var message = ex && ex.message;
                    PDFViewerApplication.l10n.get('loading_error', null, 'An error occurred while loading the PDF.').then(function (loadingErrorMessage) {
                        PDFViewerApplication.error(loadingErrorMessage, {message: message});
                    });
                    throw ex;
                }
            };
        }
        function loadAndEnablePDFBug(enabledTabs) {
            return new Promise(function (resolve, reject) {
                var appConfig = PDFViewerApplication.appConfig;
                var script = document.createElement('script');
                script.src = appConfig.debuggerScriptPath;
                script.onload = function () {
                    PDFBug.enable(enabledTabs);
                    PDFBug.init({
                        PDFJS: _pdfjsLib.PDFJS,
                        OPS: _pdfjsLib.OPS
                    }, appConfig.mainContainer);
                    resolve();
                };
                script.onerror = function () {
                    reject(new Error('Cannot load debugger at ' + script.src));
                };
                (document.getElementsByTagName('head')[0] || document.body).appendChild(script);
            });
        }

        function webViewerInitialized() {
            var appConfig = PDFViewerApplication.appConfig;
            var file = void 0;
            var queryString = document.location.search.substring(1);
            var params = (0, _ui_utils.parseQueryString)(queryString);
            file = 'file' in params ? params.file : appConfig.defaultUrl;
            validateFileURL(file);
            var waitForBeforeOpening = [];
            var fileInput = document.createElement('input');
            fileInput.id = appConfig.openFileInputName;
            fileInput.className = 'fileInput';
            fileInput.setAttribute('type', 'file');
            fileInput.oncontextmenu = _ui_utils.noContextMenuHandler;
            document.body.appendChild(fileInput);
            if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
                appConfig.toolbar.openFile.setAttribute('hidden', 'true');
            } else {
                fileInput.value = null;
            }
            if (PDFViewerApplication.viewerPrefs['pdfBugEnabled']) {
                var hash = document.location.hash.substring(1);
                var hashParams = (0, _ui_utils.parseQueryString)(hash);
                if ('disableworker' in hashParams) {
                    _pdfjsLib.PDFJS.disableWorker = hashParams['disableworker'] === 'true';
                }
                if ('disablerange' in hashParams) {
                    _pdfjsLib.PDFJS.disableRange = hashParams['disablerange'] === 'true';
                }
                if ('disablestream' in hashParams) {
                    _pdfjsLib.PDFJS.disableStream = hashParams['disablestream'] === 'true';
                }
                if ('disableautofetch' in hashParams) {
                    _pdfjsLib.PDFJS.disableAutoFetch = hashParams['disableautofetch'] === 'true';
                }
                if ('disablefontface' in hashParams) {
                    _pdfjsLib.PDFJS.disableFontFace = hashParams['disablefontface'] === 'true';
                }
                if ('disablehistory' in hashParams) {
                    _pdfjsLib.PDFJS.disableHistory = hashParams['disablehistory'] === 'true';
                }
                if ('webgl' in hashParams) {
                    _pdfjsLib.PDFJS.disableWebGL = hashParams['webgl'] !== 'true';
                }
                if ('useonlycsszoom' in hashParams) {
                    _pdfjsLib.PDFJS.useOnlyCssZoom = hashParams['useonlycsszoom'] === 'true';
                }
                if ('verbosity' in hashParams) {
                    _pdfjsLib.PDFJS.verbosity = hashParams['verbosity'] | 0;
                }
                if ('ignorecurrentpositiononzoom' in hashParams) {
                    _pdfjsLib.PDFJS.ignoreCurrentPositionOnZoom = hashParams['ignorecurrentpositiononzoom'] === 'true';
                }
                if ('pdfbug' in hashParams) {
                    _pdfjsLib.PDFJS.pdfBug = true;
                    var pdfBug = hashParams['pdfbug'];
                    var enabled = pdfBug.split(',');
                    waitForBeforeOpening.push(loadAndEnablePDFBug(enabled));
                }
            }
            if (!PDFViewerApplication.supportsPrinting) {
                appConfig.toolbar.print.classList.add('hidden');
            }
            appConfig.sidebar.mainContainer.addEventListener('transitionend', function (evt) {
                if (evt.target === this) {
                    PDFViewerApplication.eventBus.dispatch('resize');
                }
            }, true);
            Promise.all(waitForBeforeOpening).then(function () {
                webViewerOpenFileViaURL(file);
            }).catch(function (reason) {
                PDFViewerApplication.l10n.get('loading_error', null, 'An error occurred while opening.').then(function (msg) {
                    PDFViewerApplication.error(msg, reason);
                });
            });
        }

        var webViewerOpenFileViaURL = void 0;
        {
            webViewerOpenFileViaURL = function webViewerOpenFileViaURL(file) {
                if (file && file.lastIndexOf('file:', 0) === 0) {
                    PDFViewerApplication.setTitleUsingUrl(file);
                    var xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        PDFViewerApplication.open(new Uint8Array(xhr.response));
                    };
                    try {
                        xhr.open('GET', file);
                        xhr.responseType = 'arraybuffer';
                        xhr.send();
                    } catch (ex) {
                        PDFViewerApplication.l10n.get('loading_error', null, 'An error occurred while loading the PDF.').then(function (msg) {
                            PDFViewerApplication.error(msg, ex);
                        });
                    }
                    return;
                }
                if (file) {
                    PDFViewerApplication.open(file);
                }
            };
        }
        function webViewerPageRendered(evt) {
            var pageNumber = evt.pageNumber;
            var pageIndex = pageNumber - 1;
            var pageView = PDFViewerApplication.pdfViewer.getPageView(pageIndex);
            if (pageNumber === PDFViewerApplication.page) {
                PDFViewerApplication.toolbar.updateLoadingIndicatorState(false);
            }
            if (!pageView) {
                return;
            }
            if (PDFViewerApplication.pdfSidebar.isThumbnailViewVisible) {
                var thumbnailView = PDFViewerApplication.pdfThumbnailViewer.getThumbnail(pageIndex);
                thumbnailView.setImage(pageView);
            }
            if (_pdfjsLib.PDFJS.pdfBug && Stats.enabled && pageView.stats) {
                Stats.add(pageNumber, pageView.stats);
            }
            if (pageView.error) {
                PDFViewerApplication.l10n.get('rendering_error', null, 'An error occurred while rendering the page.').then(function (msg) {
                    PDFViewerApplication.error(msg, pageView.error);
                });
            }
        }

        function webViewerPageMode(evt) {
            var mode = evt.mode,
                view = void 0;
            switch (mode) {
                case 'thumbs':
                    view = _pdf_sidebar.SidebarView.THUMBS;
                    break;
                case 'bookmarks':
                case 'outline':
                    view = _pdf_sidebar.SidebarView.OUTLINE;
                    break;
                case 'attachments':
                    view = _pdf_sidebar.SidebarView.ATTACHMENTS;
                    break;
                case 'none':
                    view = _pdf_sidebar.SidebarView.NONE;
                    break;
                default:
                    console.error('Invalid "pagemode" hash parameter: ' + mode);
                    return;
            }
            PDFViewerApplication.pdfSidebar.switchView(view, true);
        }


        function webViewerPresentationModeChanged(evt) {
            var active = evt.active,
                switchInProgress = evt.switchInProgress;

            PDFViewerApplication.pdfViewer.presentationModeState = switchInProgress ? _pdf_viewer.PresentationModeState.CHANGING : active ? _pdf_viewer.PresentationModeState.FULLSCREEN : _pdf_viewer.PresentationModeState.NORMAL;
        }

        function webViewerSidebarViewChanged(evt) {
            PDFViewerApplication.pdfRenderingQueue.isThumbnailViewEnabled = PDFViewerApplication.pdfSidebar.isThumbnailViewVisible;
            var store = PDFViewerApplication.store;
            if (store && PDFViewerApplication.isInitialViewSet) {
                store.set('sidebarView', evt.view).catch(function () {
                });
            }
        }

        function webViewerUpdateViewarea(evt) {
            var location = evt.location,
                store = PDFViewerApplication.store;
            if (store && PDFViewerApplication.isInitialViewSet) {
                store.setMultiple({
                    'exists': true,
                    'page': location.pageNumber,
                    'zoom': location.scale,
                    'scrollLeft': location.left,
                    'scrollTop': location.top
                }).catch(function () {
                });
            }
            var href = PDFViewerApplication.pdfLinkService.getAnchorUrl(location.pdfOpenParams);
            PDFViewerApplication.pdfHistory.updateCurrentBookmark(location.pdfOpenParams, location.pageNumber);
            var currentPage = PDFViewerApplication.pdfViewer.getPageView(PDFViewerApplication.page - 1);
            var loading = currentPage.renderingState !== _pdf_rendering_queue.RenderingStates.FINISHED;
            PDFViewerApplication.toolbar.updateLoadingIndicatorState(loading);
        }

        function webViewerResize() {
            var pdfDocument = PDFViewerApplication.pdfDocument,
                pdfViewer = PDFViewerApplication.pdfViewer;

            if (!pdfDocument) {
                return;
            }
            var currentScaleValue = pdfViewer.currentScaleValue;
            if (currentScaleValue === 'auto' || currentScaleValue === 'page-fit' || currentScaleValue === 'page-width') {
                pdfViewer.currentScaleValue = currentScaleValue;
            }
            pdfViewer.update();
        }

        function webViewerHashchange(evt) {
            if (PDFViewerApplication.pdfHistory.isHashChangeUnlocked) {
                var hash = evt.hash;
                if (!hash) {
                    return;
                }
                if (!PDFViewerApplication.isInitialViewSet) {
                    PDFViewerApplication.initialBookmark = hash;
                } else {
                    PDFViewerApplication.pdfLinkService.setHash(hash);
                }
            }
        }

        var webViewerFileInputChange = void 0;
        {
            webViewerFileInputChange = function webViewerFileInputChange(evt) {
                var file = evt.fileInput.files[0];
                if (!_pdfjsLib.PDFJS.disableCreateObjectURL && URL.createObjectURL) {
                    PDFViewerApplication.open(URL.createObjectURL(file));
                } else {
                    var fileReader = new FileReader();
                    fileReader.onload = function webViewerChangeFileReaderOnload(evt) {
                        var buffer = evt.target.result;
                        PDFViewerApplication.open(new Uint8Array(buffer));
                    };
                    fileReader.readAsArrayBuffer(file);
                }
                PDFViewerApplication.setTitleUsingUrl(file.name);
                var appConfig = PDFViewerApplication.appConfig;
                appConfig.toolbar.viewBookmark.setAttribute('hidden', 'true');
            };
        }
        function webViewerPresentationMode() {
            PDFViewerApplication.requestPresentationMode();
        }


        function webViewerPrint() {
            window.print();
        }


        function webViewerFirstPage() {
            if (PDFViewerApplication.pdfDocument) {
                PDFViewerApplication.page = 1;
            }
        }

        function webViewerLastPage() {
            if (PDFViewerApplication.pdfDocument) {
                PDFViewerApplication.page = PDFViewerApplication.pagesCount;
            }
        }

        function webViewerNextPage() {
            PDFViewerApplication.page++;
        }

        function webViewerPreviousPage() {
            PDFViewerApplication.page--;
        }

        function webViewerPageNumberChanged(evt) {
            var pdfViewer = PDFViewerApplication.pdfViewer;
            pdfViewer.currentPageLabel = evt.value;
            if (evt.value !== pdfViewer.currentPageNumber.toString() && evt.value !== pdfViewer.currentPageLabel) {
                PDFViewerApplication.toolbar.setPageNumber(pdfViewer.currentPageNumber, pdfViewer.currentPageLabel);
            }
        }

        function webViewerScaleChanged(evt) {
            PDFViewerApplication.pdfViewer.currentScaleValue = evt.value;
        }

        function webViewerRotateCw() {
            PDFViewerApplication.rotatePages(90);
        }

        function webViewerRotateCcw() {
            PDFViewerApplication.rotatePages(-90);
        }

        function webViewerDocumentProperties() {
            PDFViewerApplication.pdfDocumentProperties.open();
        }



        function webViewerScaleChanging(evt) {
            PDFViewerApplication.toolbar.setPageScale(evt.presetValue, evt.scale);
            PDFViewerApplication.pdfViewer.update();
        }

        function webViewerPageChanging(evt) {
            var page = evt.pageNumber;
            PDFViewerApplication.toolbar.setPageNumber(page, evt.pageLabel || null);
            if (PDFViewerApplication.pdfSidebar.isThumbnailViewVisible) {
                PDFViewerApplication.pdfThumbnailViewer.scrollThumbnailIntoView(page);
            }
            if (_pdfjsLib.PDFJS.pdfBug && Stats.enabled) {
                var pageView = PDFViewerApplication.pdfViewer.getPageView(page - 1);
                if (pageView.stats) {
                    Stats.add(page, pageView.stats);
                }
            }
        }

        var zoomDisabled = false,
            zoomDisabledTimeout = void 0;

        function webViewerWheel(evt) {
            var pdfViewer = PDFViewerApplication.pdfViewer;
            if (pdfViewer.isInPresentationMode) {
                return;
            }
            if (evt.ctrlKey || evt.metaKey) {
                var support = PDFViewerApplication.supportedMouseWheelZoomModifierKeys;
                if (evt.ctrlKey && !support.ctrlKey || evt.metaKey && !support.metaKey) {
                    return;
                }
                evt.preventDefault();
                if (zoomDisabled) {
                    return;
                }
                var previousScale = pdfViewer.currentScale;
                var delta = (0, _ui_utils.normalizeWheelEventDelta)(evt);
                var MOUSE_WHEEL_DELTA_PER_PAGE_SCALE = 3.0;
                var ticks = delta * MOUSE_WHEEL_DELTA_PER_PAGE_SCALE;
                var currentScale = pdfViewer.currentScale;
                if (previousScale !== currentScale) {
                    var scaleCorrectionFactor = currentScale / previousScale - 1;
                    var rect = pdfViewer.container.getBoundingClientRect();
                    var dx = evt.clientX - rect.left;
                    var dy = evt.clientY - rect.top;
                    pdfViewer.container.scrollLeft += dx * scaleCorrectionFactor;
                    pdfViewer.container.scrollTop += dy * scaleCorrectionFactor;
                }
            } else {
                zoomDisabled = true;
                clearTimeout(zoomDisabledTimeout);
                zoomDisabledTimeout = setTimeout(function () {
                    zoomDisabled = false;
                }, 1000);
            }
        }

        function webViewerKeyDown(evt) {
            if (PDFViewerApplication.overlayManager.active) {
                return;
            }
            var handled = false,
                ensureViewerFocused = false;
            var cmd = (evt.ctrlKey ? 1 : 0) | (evt.altKey ? 2 : 0) | (evt.shiftKey ? 4 : 0) | (evt.metaKey ? 8 : 0);
            var pdfViewer = PDFViewerApplication.pdfViewer;
            var isViewerInPresentationMode = pdfViewer && pdfViewer.isInPresentationMode;
            if (cmd === 1 || cmd === 8 || cmd === 5 || cmd === 12) {
                switch (evt.keyCode) {
                    case 171:
                        handled = true;
                        break;
                    case 189:
                        handled = true;
                        break;
                    case 96:

                    case 38:
                        if (isViewerInPresentationMode || PDFViewerApplication.page > 1) {
                            PDFViewerApplication.page = 1;
                            handled = true;
                            ensureViewerFocused = true;
                        }
                        break;
                    case 40:
                        if (isViewerInPresentationMode || PDFViewerApplication.page < PDFViewerApplication.pagesCount) {
                            PDFViewerApplication.page = PDFViewerApplication.pagesCount;
                            handled = true;
                            ensureViewerFocused = true;
                        }
                        break;
                }
            }
            if (cmd === 3 || cmd === 10) {
                switch (evt.keyCode) {
                    case 80:
                        PDFViewerApplication.requestPresentationMode();
                        handled = true;
                        break;
                    case 71:
                        PDFViewerApplication.appConfig.toolbar.pageNumber.select();
                        handled = true;
                        break;
                }
            }
            if (handled) {
                if (ensureViewerFocused && !isViewerInPresentationMode) {
                    pdfViewer.focus();
                }
                evt.preventDefault();
                return;
            }
            var curElement = document.activeElement || document.querySelector(':focus');
            var curElementTagName = curElement && curElement.tagName.toUpperCase();
            if (curElementTagName === 'INPUT' || curElementTagName === 'TEXTAREA' || curElementTagName === 'SELECT') {
                if (evt.keyCode !== 27) {
                    return;
                }
            }
            if (cmd === 0) {
                switch (evt.keyCode) {
                    case 38:
                    case 33:
                    case 8:
                        if (!isViewerInPresentationMode && pdfViewer.currentScaleValue !== 'page-fit') {
                            break;
                        }
                    case 37:
                        if (pdfViewer.isHorizontalScrollbarEnabled) {
                            break;
                        }
                    case 75:
                    case 80:
                        if (PDFViewerApplication.page > 1) {
                            PDFViewerApplication.page--;
                        }
                        handled = true;
                        break;
                    case 32:
                        if (!isViewerInPresentationMode && pdfViewer.currentScaleValue !== 'page-fit') {
                            break;
                        }
                    case 39:
                        if (pdfViewer.isHorizontalScrollbarEnabled) {
                            break;
                        }
                    case 74:
                    case 78:
                        if (PDFViewerApplication.page < PDFViewerApplication.pagesCount) {
                            PDFViewerApplication.page++;
                        }
                        handled = true;
                        break;
                    case 36:
                        if (isViewerInPresentationMode || PDFViewerApplication.page > 1) {
                            PDFViewerApplication.page = 1;
                            handled = true;
                            ensureViewerFocused = true;
                        }
                        break;
                    case 35:
                        if (isViewerInPresentationMode || PDFViewerApplication.page < PDFViewerApplication.pagesCount) {
                            PDFViewerApplication.page = PDFViewerApplication.pagesCount;
                            handled = true;
                            ensureViewerFocused = true;
                        }
                        break;
                    case 83:
                        PDFViewerApplication.pdfCursorTools.switchTool(_pdf_cursor_tools.CursorTool.SELECT);
                        break;
                    case 72:
                        PDFViewerApplication.pdfCursorTools.switchTool(_pdf_cursor_tools.CursorTool.HAND);
                        break;
                    case 82:
                        PDFViewerApplication.rotatePages(90);
                        break;
                }
            }
            if (cmd === 4) {
                switch (evt.keyCode) {
                    case 32:
                        if (!isViewerInPresentationMode && pdfViewer.currentScaleValue !== 'page-fit') {
                            break;
                        }
                        if (PDFViewerApplication.page > 1) {
                            PDFViewerApplication.page--;
                        }
                        handled = true;
                        break;
                    case 82:
                        PDFViewerApplication.rotatePages(-90);
                        break;
                }
            }
            if (!handled && !isViewerInPresentationMode) {
                if (evt.keyCode >= 33 && evt.keyCode <= 40 || evt.keyCode === 32 && curElementTagName !== 'BUTTON') {
                    ensureViewerFocused = true;
                }
            }
            if (cmd === 2) {
                switch (evt.keyCode) {
                    case 37:
                        if (isViewerInPresentationMode) {
                            PDFViewerApplication.pdfHistory.back();
                            handled = true;
                        }
                        break;
                    case 39:
                        if (isViewerInPresentationMode) {
                            PDFViewerApplication.pdfHistory.forward();
                            handled = true;
                        }
                        break;
                }
            }
            if (ensureViewerFocused && !pdfViewer.containsElement(curElement)) {
                pdfViewer.focus();
            }
            if (handled) {
                evt.preventDefault();
            }
        }

        function apiPageModeToSidebarView(mode) {
            switch (mode) {
                case 'UseNone':
                    return _pdf_sidebar.SidebarView.NONE;
                case 'UseThumbs':
                    return _pdf_sidebar.SidebarView.THUMBS;
                case 'UseOutlines':
                    return _pdf_sidebar.SidebarView.OUTLINE;
                case 'UseAttachments':
                    return _pdf_sidebar.SidebarView.ATTACHMENTS;
                case 'UseOC':
            }
            return _pdf_sidebar.SidebarView.NONE;
        }

        var PDFPrintServiceFactory = {
            instance: {
                supportsPrinting: false,
                createPrintService: function createPrintService() {
                    throw new Error('Not implemented: createPrintService');
                }
            }
        };
        exports.PDFViewerApplication = PDFViewerApplication;
        exports.DefaultExternalServices = DefaultExternalServices;
        exports.PDFPrintServiceFactory = PDFPrintServiceFactory;
    }),

     (function (module, exports, __webpack_require__) {

        var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
            return typeof obj;
        } : function (obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }

            return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();

        var _dom_events = __webpack_require__(2);

        var _ui_utils = __webpack_require__(0);

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var PDFLinkService = function () {
            function PDFLinkService() {
                var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                    eventBus = _ref.eventBus;

                _classCallCheck(this, PDFLinkService);

                this.eventBus = eventBus || (0, _dom_events.getGlobalEventBus)();
                this.baseUrl = null;
                this.pdfDocument = null;
                this.pdfViewer = null;
                this.pdfHistory = null;
                this._pagesRefCache = null;
            }

            _createClass(PDFLinkService, [{
                key: 'setDocument',
                value: function setDocument(pdfDocument, baseUrl) {
                    this.baseUrl = baseUrl;
                    this.pdfDocument = pdfDocument;
                    this._pagesRefCache = Object.create(null);
                }
            }, {
                key: 'setViewer',
                value: function setViewer(pdfViewer) {
                    this.pdfViewer = pdfViewer;
                }
            }, {
                key: 'setHistory',
                value: function setHistory(pdfHistory) {
                    this.pdfHistory = pdfHistory;
                }
            }, {
                key: 'navigateTo',
                value: function navigateTo(dest) {
                    var _this = this;

                    var goToDestination = function goToDestination(_ref2) {
                        var namedDest = _ref2.namedDest,
                            explicitDest = _ref2.explicitDest;

                        var destRef = explicitDest[0],
                            pageNumber = void 0;
                        if (destRef instanceof Object) {
                            pageNumber = _this._cachedPageNumber(destRef);
                            if (pageNumber === null) {
                                _this.pdfDocument.getPageIndex(destRef).then(function (pageIndex) {
                                    _this.cachePageRef(pageIndex + 1, destRef);
                                    goToDestination({
                                        namedDest: namedDest,
                                        explicitDest: explicitDest
                                    });
                                }).catch(function () {
                                    console.error('PDFLinkService.navigateTo: "' + destRef + '" is not ' + ('a valid page reference, for dest="' + dest + '".'));
                                });
                                return;
                            }
                        } else if ((destRef | 0) === destRef) {
                            pageNumber = destRef + 1;
                        } else {
                            console.error('PDFLinkService.navigateTo: "' + destRef + '" is not ' + ('a valid destination reference, for dest="' + dest + '".'));
                            return;
                        }
                        if (!pageNumber || pageNumber < 1 || pageNumber > _this.pagesCount) {
                            console.error('PDFLinkService.navigateTo: "' + pageNumber + '" is not ' + ('a valid page number, for dest="' + dest + '".'));
                            return;
                        }
                        _this.pdfViewer.scrollPageIntoView({
                            pageNumber: pageNumber,
                            destArray: explicitDest
                        });
                        if (_this.pdfHistory) {
                            _this.pdfHistory.push({
                                dest: explicitDest,
                                hash: namedDest,
                                page: pageNumber
                            });
                        }
                    };
                    new Promise(function (resolve, reject) {
                        if (typeof dest === 'string') {
                            _this.pdfDocument.getDestination(dest).then(function (destArray) {
                                resolve({
                                    namedDest: dest,
                                    explicitDest: destArray
                                });
                            });
                            return;
                        }
                        resolve({
                            namedDest: '',
                            explicitDest: dest
                        });
                    }).then(function (data) {
                        if (!(data.explicitDest instanceof Array)) {
                            console.error('PDFLinkService.navigateTo: "' + data.explicitDest + '" is' + (' not a valid destination array, for dest="' + dest + '".'));
                            return;
                        }
                        goToDestination(data);
                    });
                }
            }, {
                key: 'getDestinationHash',
                value: function getDestinationHash(dest) {
                    if (typeof dest === 'string') {
                        return this.getAnchorUrl('#' + escape(dest));
                    }
                    if (dest instanceof Array) {
                        var str = JSON.stringify(dest);
                        return this.getAnchorUrl('#' + escape(str));
                    }
                    return this.getAnchorUrl('');
                }
            }, {
                key: 'getAnchorUrl',
                value: function getAnchorUrl(anchor) {
                    return (this.baseUrl || '') + anchor;
                }
            }, {
                key: 'setHash',
                value: function setHash(hash) {
                    var pageNumber = void 0,
                        dest = void 0;
                    if (hash.indexOf('=') >= 0) {
                        var params = (0, _ui_utils.parseQueryString)(hash);
                        if ('nameddest' in params) {
                            if (this.pdfHistory) {
                                this.pdfHistory.updateNextHashParam(params.nameddest);
                            }
                            this.navigateTo(params.nameddest);
                            return;
                        }
                        if ('page' in params) {
                            pageNumber = params.page | 0 || 1;
                        }
                        if ('zoom' in params) {
                            var zoomArgs = params.zoom.split(',');
                            var zoomArg = zoomArgs[0];
                            var zoomArgNumber = parseFloat(zoomArg);
                            if (zoomArg.indexOf('Fit') === -1) {
                                dest = [null, {name: 'XYZ'}, zoomArgs.length > 1 ? zoomArgs[1] | 0 : null, zoomArgs.length > 2 ? zoomArgs[2] | 0 : null, zoomArgNumber ? zoomArgNumber / 100 : zoomArg];
                            } else {
                                if (zoomArg === 'Fit' || zoomArg === 'FitB') {
                                    dest = [null, {name: zoomArg}];
                                } else if (zoomArg === 'FitH' || zoomArg === 'FitBH' || zoomArg === 'FitV' || zoomArg === 'FitBV') {
                                    dest = [null, {name: zoomArg}, zoomArgs.length > 1 ? zoomArgs[1] | 0 : null];
                                } else if (zoomArg === 'FitR') {
                                    if (zoomArgs.length !== 5) {
                                        console.error('PDFLinkService.setHash: Not enough parameters for "FitR".');
                                    } else {
                                        dest = [null, {name: zoomArg}, zoomArgs[1] | 0, zoomArgs[2] | 0, zoomArgs[3] | 0, zoomArgs[4] | 0];
                                    }
                                } else {
                                    console.error('PDFLinkService.setHash: "' + zoomArg + '" is not ' + 'a valid zoom value.');
                                }
                            }
                        }
                        if (dest) {
                            this.pdfViewer.scrollPageIntoView({
                                pageNumber: pageNumber || this.page,
                                destArray: dest,
                                allowNegativeOffset: true
                            });
                        } else if (pageNumber) {
                            this.page = pageNumber;
                        }
                        if ('pagemode' in params) {
                            this.eventBus.dispatch('pagemode', {
                                source: this,
                                mode: params.pagemode
                            });
                        }
                    } else {
                        if (/^\d+$/.test(hash) && hash <= this.pagesCount) {
                            console.warn('PDFLinkService_setHash: specifying a page number ' + 'directly after the hash symbol (#) is deprecated, ' + ('please use the "#page=' + hash + '" form instead.'));
                            this.page = hash | 0;
                        }
                        dest = unescape(hash);
                        try {
                            dest = JSON.parse(dest);
                            if (!(dest instanceof Array)) {
                                dest = dest.toString();
                            }
                        } catch (ex) {
                        }
                        if (typeof dest === 'string' || isValidExplicitDestination(dest)) {
                            if (this.pdfHistory) {
                                this.pdfHistory.updateNextHashParam(dest);
                            }
                            this.navigateTo(dest);
                            return;
                        }
                        console.error('PDFLinkService.setHash: "' + unescape(hash) + '" is not ' + 'a valid destination.');
                    }
                }
            }, {
                key: 'executeNamedAction',
                value: function executeNamedAction(action) {
                    switch (action) {
                        case 'GoBack':
                            if (this.pdfHistory) {
                                this.pdfHistory.back();
                            }
                            break;
                        case 'GoForward':
                            if (this.pdfHistory) {
                                this.pdfHistory.forward();
                            }
                            break;
                        case 'NextPage':
                            if (this.page < this.pagesCount) {
                                this.page++;
                            }
                            break;
                        case 'PrevPage':
                            if (this.page > 1) {
                                this.page--;
                            }
                            break;
                        case 'LastPage':
                            this.page = this.pagesCount;
                            break;
                        case 'FirstPage':
                            this.page = 1;
                            break;
                        default:
                            break;
                    }
                    this.eventBus.dispatch('namedaction', {
                        source: this,
                        action: action
                    });
                }
            }, {
                key: 'onFileAttachmentAnnotation',
                value: function onFileAttachmentAnnotation(_ref3) {
                    var id = _ref3.id,
                        filename = _ref3.filename,
                        content = _ref3.content;

                    this.eventBus.dispatch('fileattachmentannotation', {
                        source: this,
                        id: id,
                        filename: filename,
                        content: content
                    });
                }
            }, {
                key: 'cachePageRef',
                value: function cachePageRef(pageNum, pageRef) {
                    var refStr = pageRef.num + ' ' + pageRef.gen + ' R';
                    this._pagesRefCache[refStr] = pageNum;
                }
            }, {
                key: '_cachedPageNumber',
                value: function _cachedPageNumber(pageRef) {
                    var refStr = pageRef.num + ' ' + pageRef.gen + ' R';
                    return this._pagesRefCache && this._pagesRefCache[refStr] || null;
                }
            }, {
                key: 'pagesCount',
                get: function get() {
                    return this.pdfDocument ? this.pdfDocument.numPages : 0;
                }
            }, {
                key: 'page',
                get: function get() {
                    return this.pdfViewer.currentPageNumber;
                },
                set: function set(value) {
                    this.pdfViewer.currentPageNumber = value;
                }
            }]);

            return PDFLinkService;
        }();

        function isValidExplicitDestination(dest) {
            if (!(dest instanceof Array)) {
                return false;
            }
            var destLength = dest.length,
                allowNull = true;
            if (destLength < 2) {
                return false;
            }
            var page = dest[0];
            if (!((typeof page === 'undefined' ? 'undefined' : _typeof(page)) === 'object' && typeof page.num === 'number' && (page.num | 0) === page.num && typeof page.gen === 'number' && (page.gen | 0) === page.gen) && !(typeof page === 'number' && (page | 0) === page && page >= 0)) {
                return false;
            }
            var zoom = dest[1];
            if (!((typeof zoom === 'undefined' ? 'undefined' : _typeof(zoom)) === 'object' && typeof zoom.name === 'string')) {
                return false;
            }
            switch (zoom.name) {
                case 'XYZ':
                    if (destLength !== 5) {
                        return false;
                    }
                    break;
                case 'Fit':
                case 'FitB':
                    return destLength === 2;
                case 'FitH':
                case 'FitBH':
                case 'FitV':
                case 'FitBV':
                    if (destLength !== 3) {
                        return false;
                    }
                    break;
                case 'FitR':
                    if (destLength !== 6) {
                        return false;
                    }
                    allowNull = false;
                    break;
                default:
                    return false;
            }
            for (var i = 2; i < destLength; i++) {
                var param = dest[i];
                if (!(typeof param === 'number' || allowNull && param === null)) {
                    return false;
                }
            }
            return true;
        }

        exports.PDFLinkService = PDFLinkService;

    }),
    (function (module, exports, __webpack_require__) {

        var _slicedToArray = function () {
            function sliceIterator(arr, i) {
                var _arr = [];
                var _n = true;
                var _d = false;
                var _e = undefined;
                try {
                    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                        _arr.push(_s.value);
                        if (i && _arr.length === i) break;
                    }
                } catch (err) {
                    _d = true;
                    _e = err;
                } finally {
                    try {
                        if (!_n && _i["return"]) _i["return"]();
                    } finally {
                        if (_d) throw _e;
                    }
                }
                return _arr;
            }

            return function (arr, i) {
                if (Array.isArray(arr)) {
                    return arr;
                } else if (Symbol.iterator in Object(arr)) {
                    return sliceIterator(arr, i);
                } else {
                    throw new TypeError("Invalid attempt to destructure non-iterable instance");
                }
            };
        }();

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }

            return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();

        var _grab_to_pan = __webpack_require__(14);

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var CursorTool = {
            SELECT: 0,
            HAND: 1,
            ZOOM: 2
        };

        var PDFCursorTools = function () {
            function PDFCursorTools(_ref) {
                var _this = this;

                var container = _ref.container,
                    eventBus = _ref.eventBus,
                    preferences = _ref.preferences;

                _classCallCheck(this, PDFCursorTools);

                this.container = container;
                this.eventBus = eventBus;
                this.active = CursorTool.SELECT;
                this.activeBeforePresentationMode = null;
                this.handTool = new _grab_to_pan.GrabToPan({element: this.container});
                this._addEventListeners();
                Promise.all([preferences.get('cursorToolOnLoad'), preferences.get('enableHandToolOnLoad')]).then(function (_ref2) {
                    var _ref3 = _slicedToArray(_ref2, 2),
                        cursorToolPref = _ref3[0],
                        handToolPref = _ref3[1];

                    if (handToolPref === true) {
                        preferences.set('enableHandToolOnLoad', false);
                        if (cursorToolPref === CursorTool.SELECT) {
                            cursorToolPref = CursorTool.HAND;
                            preferences.set('cursorToolOnLoad', cursorToolPref).catch(function () {
                            });
                        }
                    }
                    _this.switchTool(cursorToolPref);
                }).catch(function () {
                });
            }

            _createClass(PDFCursorTools, [{
                key: 'switchTool',
                value: function switchTool(tool) {
                    var _this2 = this;

                    if (this.activeBeforePresentationMode !== null) {
                        return;
                    }
                    if (tool === this.active) {
                        return;
                    }
                    var disableActiveTool = function disableActiveTool() {
                        switch (_this2.active) {
                            case CursorTool.SELECT:
                                break;
                            case CursorTool.HAND:
                                _this2.handTool.deactivate();
                                break;
                            case CursorTool.ZOOM:
                        }
                    };
                    switch (tool) {
                        case CursorTool.SELECT:
                            disableActiveTool();
                            break;
                        case CursorTool.HAND:
                            disableActiveTool();
                            this.handTool.activate();
                            break;
                        case CursorTool.ZOOM:
                        default:
                            console.error('switchTool: "' + tool + '" is an unsupported value.');
                            return;
                    }
                    this.active = tool;
                    this._dispatchEvent();
                }
            }, {
                key: '_dispatchEvent',
                value: function _dispatchEvent() {
                    this.eventBus.dispatch('cursortoolchanged', {
                        source: this,
                        tool: this.active
                    });
                }
            }, {
                key: '_addEventListeners',
                value: function _addEventListeners() {
                    var _this3 = this;

                    this.eventBus.on('switchcursortool', function (evt) {
                        _this3.switchTool(evt.tool);
                    });
                    this.eventBus.on('presentationmodechanged', function (evt) {
                        if (evt.switchInProgress) {
                            return;
                        }
                        var previouslyActive = void 0;
                        if (evt.active) {
                            previouslyActive = _this3.active;
                            _this3.switchTool(CursorTool.SELECT);
                            _this3.activeBeforePresentationMode = previouslyActive;
                        } else {
                            previouslyActive = _this3.activeBeforePresentationMode;
                            _this3.activeBeforePresentationMode = null;
                            _this3.switchTool(previouslyActive);
                        }
                    });
                }
            }, {
                key: 'activeTool',
                get: function get() {
                    return this.active;
                }
            }]);

            return PDFCursorTools;
        }();

        exports.PDFCursorTools = PDFCursorTools;

    }),
     (function (module, exports, __webpack_require__) {
    }),

    (function (module, exports, __webpack_require__) {

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }

            return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();

        var _app = __webpack_require__(4);

        var _preferences = __webpack_require__(28);

        var _genericl10n = __webpack_require__(13);

        var _pdfjsLib = __webpack_require__(1);

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        function _possibleConstructorReturn(self, call) {
            if (!self) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self;
        }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                    value: subClass,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
            if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
        }

        var GenericPreferences = function (_BasePreferences) {
            _inherits(GenericPreferences, _BasePreferences);

            function GenericPreferences() {
                _classCallCheck(this, GenericPreferences);

                return _possibleConstructorReturn(this, (GenericPreferences.__proto__ || Object.getPrototypeOf(GenericPreferences)).apply(this, arguments));
            }

            _createClass(GenericPreferences, [{
                key: '_writeToStorage',
                value: function _writeToStorage(prefObj) {
                    return new Promise(function (resolve) {
                        localStorage.setItem('pdfjs.preferences', JSON.stringify(prefObj));
                        resolve();
                    });
                }
            }, {
                key: '_readFromStorage',
                value: function _readFromStorage(prefObj) {
                    return new Promise(function (resolve) {
                        var readPrefs = JSON.parse(localStorage.getItem('pdfjs.preferences'));
                        resolve(readPrefs);
                    });
                }
            }]);

            return GenericPreferences;
        }(_preferences.BasePreferences);

        var GenericExternalServices = Object.create(_app.DefaultExternalServices);

        GenericExternalServices.createPreferences = function () {
            return new GenericPreferences();
        };
        GenericExternalServices.createL10n = function () {
            return new _genericl10n.GenericL10n(_pdfjsLib.PDFJS.locale);
        };
        _app.PDFViewerApplication.externalServices = GenericExternalServices;
    }),
     (function (module, exports, __webpack_require__) {

        var _app = __webpack_require__(4);

        function dispatchEvent(eventType) {
            var event = document.createEvent('CustomEvent');
            event.initCustomEvent(eventType, false, false, 'custom');
            window.dispatchEvent(event);
        }

        var hasAttachEvent = !!document.attachEvent;
        window.addEventListener('keydown', function (event) {
            if (event.keyCode === 80 && (event.ctrlKey || event.metaKey) && !event.altKey && (!event.shiftKey || window.chrome || window.opera)) {
                window.print();
                if (hasAttachEvent) {
                    return;
                }
                event.preventDefault();
                if (event.stopImmediatePropagation) {
                    event.stopImmediatePropagation();
                } else {
                    event.stopPropagation();
                }
                return;
            }
        }, true);
        _app.PDFPrintServiceFactory.instance = {
            supportsPrinting: true,
        };
    }),

     (function (module, exports, __webpack_require__) {

        document.webL10n = function (window, document, undefined) {
            var gL10nData = {};
            var gTextData = '';
            var gTextProp = 'textContent';
            var gLanguage = '';
            var gMacros = {};
            var gReadyState = 'loading';
            var gAsyncResourceLoading = true;

            function getL10nResourceLinks() {
                return document.querySelectorAll('link[type="application/l10n"]');
            }

            function getTranslatableChildren(element) {
                return element ? element.querySelectorAll('*[data-l10n-id]') : [];
            }

            function getL10nAttributes(element) {
                if (!element) return {};
                var l10nId = element.getAttribute('data-l10n-id');
                var l10nArgs = element.getAttribute('data-l10n-args');
                var args = {};
                if (l10nArgs) {
                    try {
                        args = JSON.parse(l10nArgs);
                    } catch (e) {
                        console.warn('could not parse arguments for #' + l10nId);
                    }
                }
                return {
                    id: l10nId,
                    args: args
                };
            }

            function fireL10nReadyEvent(lang) {
                var evtObject = document.createEvent('Event');
                evtObject.initEvent('localized', true, false);
                evtObject.language = lang;
                document.dispatchEvent(evtObject);
            }

            function xhrLoadText(url, onSuccess, onFailure) {
                onSuccess = onSuccess || function _onSuccess(data) {
                    };
                onFailure = onFailure || function _onFailure() {
                    };
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, gAsyncResourceLoading);
                if (xhr.overrideMimeType) {
                    xhr.overrideMimeType('text/plain; charset=utf-8');
                }
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200 || xhr.status === 0) {
                            onSuccess(xhr.responseText);
                        } else {
                            onFailure();
                        }
                    }
                };
                xhr.onerror = onFailure;
                xhr.ontimeout = onFailure;
                try {
                    xhr.send(null);
                } catch (e) {
                    onFailure();
                }
            }

            function parseResource(href, lang, successCallback, failureCallback) {
                var baseURL = href.replace(/[^\/]*$/, '') || './';

                function evalString(text) {
                    if (text.lastIndexOf('\\') < 0) return text;
                    return text.replace(/\\\\/g, '\\').replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t').replace(/\\b/g, '\b').replace(/\\f/g, '\f').replace(/\\{/g, '{').replace(/\\}/g, '}').replace(/\\"/g, '"').replace(/\\'/g, "'");
                }

                function parseProperties(text, parsedPropertiesCallback) {
                    var dictionary = {};
                    var reBlank = /^\s*|\s*$/;
                    var reComment = /^\s*#|^\s*$/;
                    var reSection = /^\s*\[(.*)\]\s*$/;
                    var reImport = /^\s*@import\s+url\((.*)\)\s*$/i;
                    var reSplit = /^([^=\s]*)\s*=\s*(.+)$/;

                    function parseRawLines(rawText, extendedSyntax, parsedRawLinesCallback) {
                        var entries = rawText.replace(reBlank, '').split(/[\r\n]+/);
                        var currentLang = '*';
                        var genericLang = lang.split('-', 1)[0];
                        var skipLang = false;
                        var match = '';

                        function nextEntry() {
                            while (true) {
                                if (!entries.length) {
                                    parsedRawLinesCallback();
                                    return;
                                }
                                var line = entries.shift();
                                if (reComment.test(line)) continue;
                                if (extendedSyntax) {
                                    match = reSection.exec(line);
                                    if (match) {
                                        currentLang = match[1].toLowerCase();
                                        skipLang = currentLang !== '*' && currentLang !== lang && currentLang !== genericLang;
                                        continue;
                                    } else if (skipLang) {
                                        continue;
                                    }
                                    match = reImport.exec(line);
                                    if (match) {
                                        loadImport(baseURL + match[1], nextEntry);
                                        return;
                                    }
                                }
                                var tmp = line.match(reSplit);
                                if (tmp && tmp.length == 3) {
                                    dictionary[tmp[1]] = evalString(tmp[2]);
                                }
                            }
                        }

                        nextEntry();
                    }

                    function loadImport(url, callback) {
                        xhrLoadText(url, function (content) {
                            parseRawLines(content, false, callback);
                        }, function () {
                            console.warn(url + ' not found.');
                            callback();
                        });
                    }

                    parseRawLines(text, true, function () {
                        parsedPropertiesCallback(dictionary);
                    });
                }

                xhrLoadText(href, function (response) {
                    gTextData += response;
                    parseProperties(response, function (data) {
                        for (var key in data) {
                            var id,
                                prop,
                                index = key.lastIndexOf('.');
                            if (index > 0) {
                                id = key.substring(0, index);
                                prop = key.substr(index + 1);
                            } else {
                                id = key;
                                prop = gTextProp;
                            }
                            if (!gL10nData[id]) {
                                gL10nData[id] = {};
                            }
                            gL10nData[id][prop] = data[key];
                        }
                        if (successCallback) {
                            successCallback();
                        }
                    });
                }, failureCallback);
            }

            function loadLocale(lang, callback) {
                if (lang) {
                    lang = lang.toLowerCase();
                }
                callback = callback || function _callback() {
                    };
                gLanguage = lang;
                var langLinks = getL10nResourceLinks();
                var langCount = langLinks.length;

                var onResourceLoaded = null;
                var gResourceCount = 0;
                onResourceLoaded = function onResourceLoaded() {
                    gResourceCount++;
                    if (gResourceCount >= langCount) {
                        callback();
                        fireL10nReadyEvent(lang);
                        gReadyState = 'complete';
                    }
                };
                function L10nResourceLink(link) {
                    var href = link.href;
                    this.load = function (lang, callback) {
                        parseResource(href, lang, callback, function () {
                            gLanguage = '';
                            callback();
                        });
                    };
                }

                for (var i = 0; i < langCount; i++) {
                    var resource = new L10nResourceLink(langLinks[i]);
                    resource.load(lang, onResourceLoaded);
                }
            }


            function getPluralRules(lang) {
                var locales2rules = {
                    'af': 3,
                    'ak': 4,
                    'am': 4,
                    'ar': 1,
                    'asa': 3,
                    'az': 0,
                    'be': 11,
                    'bem': 3,
                    'bez': 3,
                    'bg': 3,
                    'bh': 4,
                    'bm': 0,
                    'bn': 3,
                    'bo': 0,
                    'br': 20,
                    'brx': 3,
                    'bs': 11,
                    'ca': 3,
                    'cgg': 3,
                    'chr': 3,
                    'cs': 12,
                    'cy': 17,
                    'da': 3,
                    'de': 3,
                    'dv': 3,
                    'dz': 0,
                    'ee': 3,
                    'el': 3,
                    'en': 3,
                    'eo': 3,
                    'es': 3,
                    'et': 3,
                    'eu': 3,
                    'fa': 0,
                    'ff': 5,
                    'fi': 3,
                    'fil': 4,
                    'fo': 3,
                    'fr': 5,
                    'fur': 3,
                    'fy': 3,
                    'ga': 8,
                    'gd': 24,
                    'gl': 3,
                    'gsw': 3,
                    'gu': 3,
                    'guw': 4,
                    'gv': 23,
                    'ha': 3,
                    'haw': 3,
                    'he': 2,
                    'hi': 4,
                    'hr': 11,
                    'hu': 0,
                    'id': 0,
                    'ig': 0,
                    'ii': 0,
                    'is': 3,
                    'it': 3,
                    'iu': 7,
                    'ja': 0,
                    'jmc': 3,
                    'jv': 0,
                    'ka': 0,
                    'kab': 5,
                    'kaj': 3,
                    'kcg': 3,
                    'kde': 0,
                    'kea': 0,
                    'kk': 3,
                    'kl': 3,
                    'km': 0,
                    'kn': 0,
                    'ko': 0,
                    'ksb': 3,
                    'ksh': 21,
                    'ku': 3,
                    'kw': 7,
                    'lag': 18,
                    'lb': 3,
                    'lg': 3,
                    'ln': 4,
                    'lo': 0,
                    'lt': 10,
                    'lv': 6,
                    'mas': 3,
                    'mg': 4,
                    'mk': 16,
                    'ml': 3,
                    'mn': 3,
                    'mo': 9,
                    'mr': 3,
                    'ms': 0,
                    'mt': 15,
                    'my': 0,
                    'nah': 3,
                    'naq': 7,
                    'nb': 3,
                    'nd': 3,
                    'ne': 3,
                    'nl': 3,
                    'nn': 3,
                    'no': 3,
                    'nr': 3,
                    'nso': 4,
                    'ny': 3,
                    'nyn': 3,
                    'om': 3,
                    'or': 3,
                    'pa': 3,
                    'pap': 3,
                    'pl': 13,
                    'ps': 3,
                    'pt': 3,
                    'rm': 3,
                    'ro': 9,
                    'rof': 3,
                    'ru': 11,
                    'rwk': 3,
                    'sah': 0,
                    'saq': 3,
                    'se': 7,
                    'seh': 3,
                    'ses': 0,
                    'sg': 0,
                    'sh': 11,
                    'shi': 19,
                    'sk': 12,
                    'sl': 14,
                    'sma': 7,
                    'smi': 7,
                    'smj': 7,
                    'smn': 7,
                    'sms': 7,
                    'sn': 3,
                    'so': 3,
                    'sq': 3,
                    'sr': 11,
                    'ss': 3,
                    'ssy': 3,
                    'st': 3,
                    'sv': 3,
                    'sw': 3,
                    'syr': 3,
                    'ta': 3,
                    'te': 3,
                    'teo': 3,
                    'th': 0,
                    'ti': 4,
                    'tig': 3,
                    'tk': 3,
                    'tl': 4,
                    'tn': 3,
                    'to': 0,
                    'tr': 0,
                    'ts': 3,
                    'tzm': 22,
                    'uk': 11,
                    'ur': 3,
                    've': 3,
                    'vi': 0,
                    'vun': 3,
                    'wa': 4,
                    'wae': 3,
                    'wo': 0,
                    'xh': 3,
                    'xog': 3,
                    'yo': 0,
                    'zh': 0,
                    'zu': 3
                };

                function isIn(n, list) {
                    return list.indexOf(n) !== -1;
                }

                function isBetween(n, start, end) {
                    return start <= n && n <= end;
                }

                var pluralRules = {
                    '0': function _(n) {
                        return 'other';
                    },
                    '1': function _(n) {
                        if (isBetween(n % 100, 3, 10)) return 'few';
                        if (n === 0) return 'zero';
                        if (isBetween(n % 100, 11, 99)) return 'many';
                        if (n == 2) return 'two';
                        if (n == 1) return 'one';
                        return 'other';
                    },
                    '2': function _(n) {
                        if (n !== 0 && n % 10 === 0) return 'many';
                        if (n == 2) return 'two';
                        if (n == 1) return 'one';
                        return 'other';
                    },
                    '3': function _(n) {
                        if (n == 1) return 'one';
                        return 'other';
                    },
                    '4': function _(n) {
                        if (isBetween(n, 0, 1)) return 'one';
                        return 'other';
                    },
                    '5': function _(n) {
                        if (isBetween(n, 0, 2) && n != 2) return 'one';
                        return 'other';
                    },
                    '6': function _(n) {
                        if (n === 0) return 'zero';
                        if (n % 10 == 1 && n % 100 != 11) return 'one';
                        return 'other';
                    },
                    '7': function _(n) {
                        if (n == 2) return 'two';
                        if (n == 1) return 'one';
                        return 'other';
                    },
                    '8': function _(n) {
                        if (isBetween(n, 3, 6)) return 'few';
                        if (isBetween(n, 7, 10)) return 'many';
                        if (n == 2) return 'two';
                        if (n == 1) return 'one';
                        return 'other';
                    },
                    '9': function _(n) {
                        if (n === 0 || n != 1 && isBetween(n % 100, 1, 19)) return 'few';
                        if (n == 1) return 'one';
                        return 'other';
                    },
                    '10': function _(n) {
                        if (isBetween(n % 10, 2, 9) && !isBetween(n % 100, 11, 19)) return 'few';
                        if (n % 10 == 1 && !isBetween(n % 100, 11, 19)) return 'one';
                        return 'other';
                    },
                    '11': function _(n) {
                        if (isBetween(n % 10, 2, 4) && !isBetween(n % 100, 12, 14)) return 'few';
                        if (n % 10 === 0 || isBetween(n % 10, 5, 9) || isBetween(n % 100, 11, 14)) return 'many';
                        if (n % 10 == 1 && n % 100 != 11) return 'one';
                        return 'other';
                    },
                    '12': function _(n) {
                        if (isBetween(n, 2, 4)) return 'few';
                        if (n == 1) return 'one';
                        return 'other';
                    },
                    '13': function _(n) {
                        if (isBetween(n % 10, 2, 4) && !isBetween(n % 100, 12, 14)) return 'few';
                        if (n != 1 && isBetween(n % 10, 0, 1) || isBetween(n % 10, 5, 9) || isBetween(n % 100, 12, 14)) return 'many';
                        if (n == 1) return 'one';
                        return 'other';
                    },
                    '14': function _(n) {
                        if (isBetween(n % 100, 3, 4)) return 'few';
                        if (n % 100 == 2) return 'two';
                        if (n % 100 == 1) return 'one';
                        return 'other';
                    },
                    '15': function _(n) {
                        if (n === 0 || isBetween(n % 100, 2, 10)) return 'few';
                        if (isBetween(n % 100, 11, 19)) return 'many';
                        if (n == 1) return 'one';
                        return 'other';
                    },
                    '16': function _(n) {
                        if (n % 10 == 1 && n != 11) return 'one';
                        return 'other';
                    },
                    '17': function _(n) {
                        if (n == 3) return 'few';
                        if (n === 0) return 'zero';
                        if (n == 6) return 'many';
                        if (n == 2) return 'two';
                        if (n == 1) return 'one';
                        return 'other';
                    },
                    '18': function _(n) {
                        if (n === 0) return 'zero';
                        if (isBetween(n, 0, 2) && n !== 0 && n != 2) return 'one';
                        return 'other';
                    },
                    '19': function _(n) {
                        if (isBetween(n, 2, 10)) return 'few';
                        if (isBetween(n, 0, 1)) return 'one';
                        return 'other';
                    },
                    '20': function _(n) {
                        if ((isBetween(n % 10, 3, 4) || n % 10 == 9) && !(isBetween(n % 100, 10, 19) || isBetween(n % 100, 70, 79) || isBetween(n % 100, 90, 99))) return 'few';
                        if (n % 1000000 === 0 && n !== 0) return 'many';
                        if (n % 10 == 2 && !isIn(n % 100, [12, 72, 92])) return 'two';
                        if (n % 10 == 1 && !isIn(n % 100, [11, 71, 91])) return 'one';
                        return 'other';
                    },
                    '21': function _(n) {
                        if (n === 0) return 'zero';
                        if (n == 1) return 'one';
                        return 'other';
                    },
                    '22': function _(n) {
                        if (isBetween(n, 0, 1) || isBetween(n, 11, 99)) return 'one';
                        return 'other';
                    },
                    '23': function _(n) {
                        if (isBetween(n % 10, 1, 2) || n % 20 === 0) return 'one';
                        return 'other';
                    },
                    '24': function _(n) {
                        if (isBetween(n, 3, 10) || isBetween(n, 13, 19)) return 'few';
                        if (isIn(n, [2, 12])) return 'two';
                        if (isIn(n, [1, 11])) return 'one';
                        return 'other';
                    }
                };
                var index = locales2rules[lang.replace(/-.*$/, '')];
                if (!(index in pluralRules)) {
                    console.warn('plural form unknown for [' + lang + ']');
                    return function () {
                        return 'other';
                    };
                }
                return pluralRules[index];
            }

            gMacros.plural = function (str, param, key, prop) {
                var n = parseFloat(param);
                if (isNaN(n)) return str;
                if (prop != gTextProp) return str;
                if (!gMacros._pluralRules) {
                    gMacros._pluralRules = getPluralRules(gLanguage);
                }
                var index = '[' + gMacros._pluralRules(n) + ']';
                if (n === 0 && key + '[zero]' in gL10nData) {
                    str = gL10nData[key + '[zero]'][prop];
                } else if (n == 1 && key + '[one]' in gL10nData) {
                    str = gL10nData[key + '[one]'][prop];
                } else if (n == 2 && key + '[two]' in gL10nData) {
                    str = gL10nData[key + '[two]'][prop];
                } else if (key + index in gL10nData) {
                    str = gL10nData[key + index][prop];
                } else if (key + '[other]' in gL10nData) {
                    str = gL10nData[key + '[other]'][prop];
                }
                return str;
            };
            function getL10nData(key, args, fallback) {
                var data = gL10nData[key];
                if (!data) {
                    if (!fallback) {
                        return null;
                    }
                    data = fallback;
                }
                var rv = {};
                for (var prop in data) {
                    var str = data[prop];
                    str = substIndexes(str, args, key, prop);
                    str = substArguments(str, args, key);
                    rv[prop] = str;
                }
                return rv;
            }

            function substIndexes(str, args, key, prop) {
                var reIndex = /\{\[\s*([a-zA-Z]+)\(([a-zA-Z]+)\)\s*\]\}/;
                var reMatch = reIndex.exec(str);
                if (!reMatch || !reMatch.length) return str;
                var macroName = reMatch[1];
                var paramName = reMatch[2];
                var param;
                if (args && paramName in args) {
                    param = args[paramName];
                } else if (paramName in gL10nData) {
                    param = gL10nData[paramName];
                }
                if (macroName in gMacros) {
                    var macro = gMacros[macroName];
                    str = macro(str, param, key, prop);
                }
                return str;
            }

            function substArguments(str, args, key) {
                var reArgs = /\{\{\s*(.+?)\s*\}\}/g;
                return str.replace(reArgs, function (matched_text, arg) {
                    if (args && arg in args) {
                        return args[arg];
                    }
                    if (arg in gL10nData) {
                        return gL10nData[arg];
                    }
                    console.log('argument {{' + arg + '}} for #' + key + ' is undefined.');
                    return matched_text;
                });
            }

            function translateElement(element) {
                var l10n = getL10nAttributes(element);
                if (!l10n.id) return;
                var data = getL10nData(l10n.id, l10n.args);
                if (!data) {
                    return;
                }
                if (data[gTextProp]) {
                    if (getChildElementCount(element) === 0) {
                        element[gTextProp] = data[gTextProp];
                    } else {
                        var children = element.childNodes;
                        var found = false;
                        for (var i = 0, l = children.length; i < l; i++) {
                            if (children[i].nodeType === 3 && /\S/.test(children[i].nodeValue)) {
                                if (found) {
                                    children[i].nodeValue = '';
                                } else {
                                    children[i].nodeValue = data[gTextProp];
                                    found = true;
                                }
                            }
                        }
                        if (!found) {
                            var textNode = document.createTextNode(data[gTextProp]);
                            element.insertBefore(textNode, element.firstChild);
                        }
                    }
                    delete data[gTextProp];
                }
                for (var k in data) {
                    element[k] = data[k];
                }
            }

            function getChildElementCount(element) {
                if (element.children) {
                    return element.children.length;
                }
                if (typeof element.childElementCount !== 'undefined') {
                    return element.childElementCount;
                }
                var count = 0;
                for (var i = 0; i < element.childNodes.length; i++) {
                    count += element.nodeType === 1 ? 1 : 0;
                }
                return count;
            }

            function translateFragment(element) {
                element = element || document.documentElement;
                var children = getTranslatableChildren(element);
                var elementCount = children.length;
                for (var i = 0; i < elementCount; i++) {
                    translateElement(children[i]);
                }
                translateElement(element);
            }

            return {
                get: function get(key, args, fallbackString) {
                    var index = key.lastIndexOf('.');
                    var prop = gTextProp;
                    if (index > 0) {
                        prop = key.substr(index + 1);
                        key = key.substring(0, index);
                    }
                    var fallback;
                    if (fallbackString) {
                        fallback = {};
                        fallback[prop] = fallbackString;
                    }
                    var data = getL10nData(key, args, fallback);
                    if (data && prop in data) {
                        return data[prop];
                    }
                    return '{{' + key + '}}';
                },
                getData: function getData() {
                    return gL10nData;
                },
                setLanguage: function setLanguage(lang, callback) {
                    loadLocale(lang, function () {
                        if (callback) callback();
                    });
                },
                getDirection: function getDirection() {
                    var rtlList = ['ar', 'he', 'fa', 'ps', 'ur'];
                    var shortCode = gLanguage.split('-', 1)[0];
                    return rtlList.indexOf(shortCode) >= 0 ? 'rtl' : 'ltr';
                },
                translate: translateFragment,

                ready: function ready(callback) {
                    if (!callback) {
                        return;
                    } else if (gReadyState == 'complete' || gReadyState == 'interactive') {
                        window.setTimeout(function () {
                            callback();
                        });
                    } else if (document.addEventListener) {
                        document.addEventListener('localized', function once() {
                            document.removeEventListener('localized', once);
                            callback();
                        });
                    }
                }
            };
        }(window, document);

    }),
    /* 11 */
    /***/ (function (module, exports, __webpack_require__) {
        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }

            return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();

        var _pdfjsLib = __webpack_require__(1);

        var _ui_utils = __webpack_require__(0);

        var _pdf_link_service = __webpack_require__(5);

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var AnnotationLayerBuilder = function () {
            function AnnotationLayerBuilder(_ref) {
                var pageDiv = _ref.pageDiv,
                    pdfPage = _ref.pdfPage,
                    linkService = _ref.linkService,
                    _ref$renderInteractiv = _ref.renderInteractiveForms,
                    renderInteractiveForms = _ref$renderInteractiv === undefined ? false : _ref$renderInteractiv,
                    _ref$l10n = _ref.l10n,
                    l10n = _ref$l10n === undefined ? _ui_utils.NullL10n : _ref$l10n;

                _classCallCheck(this, AnnotationLayerBuilder);

                this.pageDiv = pageDiv;
                this.pdfPage = pdfPage;
                this.linkService = linkService;
                this.renderInteractiveForms = renderInteractiveForms;
                this.l10n = l10n;
                this.div = null;
            }

            _createClass(AnnotationLayerBuilder, [{
                key: 'render',
                value: function render(viewport) {
                    var _this = this;

                    var intent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'display';

                    this.pdfPage.getAnnotations({intent: intent}).then(function (annotations) {
                        var parameters = {
                            viewport: viewport.clone({dontFlip: true}),
                            div: _this.div,
                            annotations: annotations,
                            page: _this.pdfPage,
                            renderInteractiveForms: _this.renderInteractiveForms,
                            linkService: _this.linkService,
                        };
                        if (_this.div) {
                            _pdfjsLib.AnnotationLayer.update(parameters);
                        } else {
                            if (annotations.length === 0) {
                                return;
                            }
                            _this.div = document.createElement('div');
                            _this.div.className = 'annotationLayer';
                            _this.pageDiv.appendChild(_this.div);
                            parameters.div = _this.div;
                            _pdfjsLib.AnnotationLayer.render(parameters);
                            _this.l10n.translate(_this.div);
                        }
                    });
                }
            }, {
                key: 'hide',
                value: function hide() {
                    if (!this.div) {
                        return;
                    }
                    this.div.setAttribute('hidden', 'true');
                }
            }]);

            return AnnotationLayerBuilder;
        }();

        var DefaultAnnotationLayerFactory = function () {
            function DefaultAnnotationLayerFactory() {
                _classCallCheck(this, DefaultAnnotationLayerFactory);
            }

            _createClass(DefaultAnnotationLayerFactory, [{
                key: 'createAnnotationLayerBuilder',
                value: function createAnnotationLayerBuilder(pageDiv, pdfPage) {
                    var renderInteractiveForms = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
                    var l10n = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _ui_utils.NullL10n;

                    return new AnnotationLayerBuilder({
                        pageDiv: pageDiv,
                        pdfPage: pdfPage,
                        renderInteractiveForms: renderInteractiveForms,
                        linkService: new _pdf_link_service.SimpleLinkService(),
                        l10n: l10n
                    });
                }
            }]);

            return DefaultAnnotationLayerFactory;
        }();

        exports.AnnotationLayerBuilder = AnnotationLayerBuilder;
        exports.DefaultAnnotationLayerFactory = DefaultAnnotationLayerFactory;

    }),
    /* 12 */
   (function (module, exports, __webpack_require__) {

    }),
    /* 13 */
    /***/ (function (module, exports, __webpack_require__) {

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }

            return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();

        __webpack_require__(10);

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var webL10n = document.webL10n;

        var GenericL10n = function () {
            function GenericL10n(lang) {
                _classCallCheck(this, GenericL10n);

                this._lang = lang;
                this._ready = new Promise(function (resolve, reject) {
                    webL10n.setLanguage(lang, function () {
                        resolve(webL10n);
                    });
                });
            }

            _createClass(GenericL10n, [{
                key: 'getDirection',
                value: function getDirection() {
                    return this._ready.then(function (l10n) {
                        return l10n.getDirection();
                    });
                }
            }, {
                key: 'get',
                value: function get(property, args, fallback) {
                    return this._ready.then(function (l10n) {
                        return l10n.get(property, args, fallback);
                    });
                }
            }, {
                key: 'translate',
                value: function translate(element) {
                    return this._ready.then(function (l10n) {
                        return l10n.translate(element);
                    });
                }
            }]);

            return GenericL10n;
        }();

        exports.GenericL10n = GenericL10n;
    }),
    /* 14 */
   (function (module, exports, __webpack_require__) {
        function GrabToPan(options) {
            this.element = options.element;
            this.document = options.element.ownerDocument;
            if (typeof options.ignoreTarget === 'function') {
                this.ignoreTarget = options.ignoreTarget;
            }
            this.onActiveChanged = options.onActiveChanged;
            this.activate = this.activate.bind(this);
            this.deactivate = this.deactivate.bind(this);
            this.toggle = this.toggle.bind(this);
            this._onmousedown = this._onmousedown.bind(this);
            this._onmousemove = this._onmousemove.bind(this);
            this._endPan = this._endPan.bind(this);
            var overlay = this.overlay = document.createElement('div');
            overlay.className = 'grab-to-pan-grabbing';
        }

        GrabToPan.prototype = {
            CSS_CLASS_GRAB: 'grab-to-pan-grab',
            activate: function GrabToPan_activate() {
                if (!this.active) {
                    this.active = true;
                    this.element.addEventListener('mousedown', this._onmousedown, true);
                    this.element.classList.add(this.CSS_CLASS_GRAB);
                    if (this.onActiveChanged) {
                        this.onActiveChanged(true);
                    }
                }
            },
            deactivate: function GrabToPan_deactivate() {
                if (this.active) {
                    this.active = false;
                    this.element.removeEventListener('mousedown', this._onmousedown, true);
                    this._endPan();
                    this.element.classList.remove(this.CSS_CLASS_GRAB);
                    if (this.onActiveChanged) {
                        this.onActiveChanged(false);
                    }
                }
            },
            toggle: function GrabToPan_toggle() {
                if (this.active) {
                    this.deactivate();
                } else {
                    this.activate();
                }
            },
            ignoreTarget: function GrabToPan_ignoreTarget(node) {
                return node[matchesSelector]('a[href], a[href] *, input, textarea, button, button *, select, option');
            },
            _onmousedown: function GrabToPan__onmousedown(event) {
                if (event.button !== 0 || this.ignoreTarget(event.target)) {
                    return;
                }
                if (event.originalTarget) {
                    try {
                        event.originalTarget.tagName;
                    } catch (e) {
                        return;
                    }
                }
                this.scrollLeftStart = this.element.scrollLeft;
                this.scrollTopStart = this.element.scrollTop;
                this.clientXStart = event.clientX;
                this.clientYStart = event.clientY;
                this.document.addEventListener('mousemove', this._onmousemove, true);
                this.document.addEventListener('mouseup', this._endPan, true);
                this.element.addEventListener('scroll', this._endPan, true);
                event.preventDefault();
                event.stopPropagation();
                var focusedElement = document.activeElement;
                if (focusedElement && !focusedElement.contains(event.target)) {
                    focusedElement.blur();
                }
            },
            _onmousemove: function GrabToPan__onmousemove(event) {
                this.element.removeEventListener('scroll', this._endPan, true);
                if (isLeftMouseReleased(event)) {
                    this._endPan();
                    return;
                }
                var xDiff = event.clientX - this.clientXStart;
                var yDiff = event.clientY - this.clientYStart;
                var scrollTop = this.scrollTopStart - yDiff;
                var scrollLeft = this.scrollLeftStart - xDiff;
                if (this.element.scrollTo) {
                    this.element.scrollTo({
                        top: scrollTop,
                        left: scrollLeft,
                        behavior: 'instant'
                    });
                } else {
                    this.element.scrollTop = scrollTop;
                    this.element.scrollLeft = scrollLeft;
                }
                if (!this.overlay.parentNode) {
                    document.body.appendChild(this.overlay);
                }
            },
            _endPan: function GrabToPan__endPan() {
                this.element.removeEventListener('scroll', this._endPan, true);
                this.document.removeEventListener('mousemove', this._onmousemove, true);
                this.document.removeEventListener('mouseup', this._endPan, true);
                this.overlay.remove();
            }
        };
        var matchesSelector;
        ['webkitM', 'mozM', 'msM', 'oM', 'm'].some(function (prefix) {
            var name = prefix + 'atches';
            if (name in document.documentElement) {
                matchesSelector = name;
            }
            name += 'Selector';
            if (name in document.documentElement) {
                matchesSelector = name;
            }
            return matchesSelector;
        });
        var isNotIEorIsIE10plus = !document.documentMode || document.documentMode > 9;
        var chrome = window.chrome;
        var isChrome15OrOpera15plus = chrome && (chrome.webstore || chrome.app);
        var isSafari6plus = /Apple/.test(navigator.vendor) && /Version\/([6-9]\d*|[1-5]\d+)/.test(navigator.userAgent);

        function isLeftMouseReleased(event) {
            if ('buttons' in event && isNotIEorIsIE10plus) {
                return !(event.buttons & 1);
            }
            if (isChrome15OrOpera15plus || isSafari6plus) {
                return event.which === 0;
            }
        }

        exports.GrabToPan = GrabToPan;

    }),
    /* 15 */
   (function (module, exports, __webpack_require__) {
        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }

            return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var OverlayManager = function () {
            function OverlayManager() {
                _classCallCheck(this, OverlayManager);

                this._overlays = {};
                this._active = null;
                this._keyDownBound = this._keyDown.bind(this);
            }

            _createClass(OverlayManager, [{
                key: 'register',
                value: function register(name, element) {
                    var _this = this;

                    var callerCloseMethod = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
                    var canForceClose = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

                    return new Promise(function (resolve) {
                        var container = void 0;
                        if (!name || !element || !(container = element.parentNode)) {
                        } else if (_this._overlays[name]) {
                            throw new Error('The overlay is already registered.');
                        }
                        _this._overlays[name] = {
                            element: element,
                            container: container,
                            callerCloseMethod: callerCloseMethod,
                            canForceClose: canForceClose
                        };
                        resolve();
                    });
                }
            }, {
                key: 'unregister',
                value: function unregister(name) {
                    var _this2 = this;

                    return new Promise(function (resolve) {
                        if (!_this2._overlays[name]) {
                            throw new Error('The overlay does not exist.');
                        } else if (_this2._active === name) {
                            throw new Error('The overlay cannot be removed while it is active.');
                        }
                        delete _this2._overlays[name];
                        resolve();
                    });
                }
            }, {
                key: 'open',
                value: function open(name) {
                    var _this3 = this;

                    return new Promise(function (resolve) {
                        if (!_this3._overlays[name]) {
                            throw new Error('The overlay does not exist.');
                        } else if (_this3._active) {
                            if (_this3._overlays[name].canForceClose) {
                                _this3._closeThroughCaller();
                            } else if (_this3._active === name) {
                                throw new Error('The overlay is already active.');
                            } else {
                                throw new Error('Another overlay is currently active.');
                            }
                        }
                        _this3._active = name;
                        _this3._overlays[_this3._active].element.classList.remove('hidden');
                        _this3._overlays[_this3._active].container.classList.remove('hidden');
                        window.addEventListener('keydown', _this3._keyDownBound);
                        resolve();
                    });
                }
            }, {
                key: 'close',
                value: function close(name) {
                    var _this4 = this;

                    return new Promise(function (resolve) {
                        if (!_this4._overlays[name]) {
                            throw new Error('The overlay does not exist.');
                        } else if (!_this4._active) {
                            throw new Error('The overlay is currently not active.');
                        } else if (_this4._active !== name) {
                            throw new Error('Another overlay is currently active.');
                        }
                        _this4._overlays[_this4._active].container.classList.add('hidden');
                        _this4._overlays[_this4._active].element.classList.add('hidden');
                        _this4._active = null;
                        window.removeEventListener('keydown', _this4._keyDownBound);
                        resolve();
                    });
                }
            }, {
                key: '_keyDown',
                value: function _keyDown(evt) {
                    if (this._active && evt.keyCode === 27) {
                        this._closeThroughCaller();
                        evt.preventDefault();
                    }
                }
            }, {
                key: '_closeThroughCaller',
                value: function _closeThroughCaller() {
                    if (this._overlays[this._active].callerCloseMethod) {
                        this._overlays[this._active].callerCloseMethod();
                    }
                    if (this._active) {
                        this.close(this._active);
                    }
                }
            }, {
                key: 'active',
                get: function get() {
                    return this._active;
                }
            }]);

            return OverlayManager;
        }();

        exports.OverlayManager = OverlayManager;
    }),
    /* 16 */
    (function (module, exports, __webpack_require__) {

    }),
    /* 17 */
     (function (module, exports, __webpack_require__) {

    }),
    /* 18 */
   (function (module, exports, __webpack_require__) {

        var _slicedToArray = function () {
            function sliceIterator(arr, i) {
                var _arr = [];
                var _n = true;
                var _d = false;
                var _e = undefined;
                try {
                    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                        _arr.push(_s.value);
                        if (i && _arr.length === i) break;
                    }
                } catch (err) {
                    _d = true;
                    _e = err;
                } finally {
                    try {
                        if (!_n && _i["return"]) _i["return"]();
                    } finally {
                        if (_d) throw _e;
                    }
                }
                return _arr;
            }

            return function (arr, i) {
                if (Array.isArray(arr)) {
                    return arr;
                } else if (Symbol.iterator in Object(arr)) {
                    return sliceIterator(arr, i);
                } else {
                    throw new TypeError("Invalid attempt to destructure non-iterable instance");
                }
            };
        }();

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }

            return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();

        // var _ui_utils = __webpack_require__(0);

        var _pdfjsLib = __webpack_require__(1);

        var DEFAULT_FIELD_CONTENT = '-';

        var PDFDocumentProperties = function () {
            function PDFDocumentProperties(_ref, overlayManager) {
                var overlayName = _ref.overlayName,
                    fields = _ref.fields,
                    container = _ref.container,
                    closeButton = _ref.closeButton;
                var l10n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _ui_utils.NullL10n;

                this.overlayName = overlayName;
                this.fields = fields;
                this.container = container;
                this.overlayManager = overlayManager;
                this.l10n = l10n;
                this._reset();
                if (closeButton) {
                    closeButton.addEventListener('click', this.close.bind(this));
                }
                this.overlayManager.register(this.overlayName, this.container, this.close.bind(this));
            }

            _createClass(PDFDocumentProperties, [{
                key: 'open',
                value: function open() {
                    var _this = this;

                    var freezeFieldData = function freezeFieldData(data) {
                        Object.defineProperty(_this, 'fieldData', {
                            value: Object.freeze(data),
                            writable: false,
                            enumerable: true,
                            configurable: true
                        });
                    };
                    Promise.all([this.overlayManager.open(this.overlayName), this._dataAvailableCapability.promise]).then(function () {
                        if (_this.fieldData) {
                            _this._updateUI();
                            return;
                        }
                        _this.pdfDocument.getMetadata().then(function (_ref2) {
                            var info = _ref2.info,
                                metadata = _ref2.metadata;

                            return Promise.all([info, metadata, _this._parseFileSize(_this.maybeFileSize), _this._parseDate(info.CreationDate), _this._parseDate(info.ModDate)]);
                        }).then(function (_ref3) {
                            var _ref4 = _slicedToArray(_ref3, 5),
                                info = _ref4[0],
                                metadata = _ref4[1],
                                fileSize = _ref4[2],
                                creationDate = _ref4[3],
                                modificationDate = _ref4[4];

                            freezeFieldData({
                                'fileName': (0, _ui_utils.getPDFFileNameFromURL)(_this.url),
                                'fileSize': fileSize,
                                'title': info.Title,
                                'author': info.Author,
                                'subject': info.Subject,
                                'keywords': info.Keywords,
                                'creationDate': creationDate,
                                'modificationDate': modificationDate,
                                'creator': info.Creator,
                                'producer': info.Producer,
                                'version': info.PDFFormatVersion,
                                'pageCount': _this.pdfDocument.numPages
                            });
                            _this._updateUI();
                        }).then(function (_ref5) {
                            var length = _ref5.length;

                            return _this._parseFileSize(length);
                        }).then(function (fileSize) {
                            var data = (0, _ui_utils.cloneObj)(_this.fieldData);
                            data['fileSize'] = fileSize;
                            freezeFieldData(data);
                            _this._updateUI();
                        });
                    });
                }
            }, {
                key: 'close',
                value: function close() {
                    this.overlayManager.close(this.overlayName);
                }
            }, {
                key: 'setDocument',
                value: function setDocument(pdfDocument, url) {
                    if (this.pdfDocument) {
                        this._reset();
                        this._updateUI(true);
                    }
                    if (!pdfDocument) {
                        return;
                    }
                    this.pdfDocument = pdfDocument;
                    this.url = url;
                    this._dataAvailableCapability.resolve();
                }
            }, {
                key: 'setFileSize',
                value: function setFileSize(fileSize) {
                    if (typeof fileSize === 'number' && fileSize > 0) {
                        this.maybeFileSize = fileSize;
                    }
                }
            }, {
                key: '_reset',
                value: function _reset() {
                    this.pdfDocument = null;
                    this.url = null;
                    this.maybeFileSize = 0;
                    delete this.fieldData;
                    this._dataAvailableCapability = (0, _pdfjsLib.createPromiseCapability)();
                }
            }, {
                key: '_updateUI',
                value: function _updateUI() {
                    var reset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

                    if (reset || !this.fieldData) {
                        for (var id in this.fields) {
                            this.fields[id].textContent = DEFAULT_FIELD_CONTENT;
                        }
                        return;
                    }
                    if (this.overlayManager.active !== this.overlayName) {
                        return;
                    }
                    for (var _id in this.fields) {
                        var content = this.fieldData[_id];
                        this.fields[_id].textContent = content || content === 0 ? content : DEFAULT_FIELD_CONTENT;
                    }
                }
            }, {
                key: '_parseFileSize',
                value: function _parseFileSize() {
                    var fileSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

                    var kb = fileSize / 1024;
                    if (!kb) {
                        return Promise.resolve(undefined);
                    } else if (kb < 1024) {
                        return this.l10n.get('document_properties_kb', {
                            size_kb: (+kb.toPrecision(3)).toLocaleString(),
                            size_b: fileSize.toLocaleString()
                        }, '{{size_kb}} KB ({{size_b}} bytes)');
                    }
                    return this.l10n.get('document_properties_mb', {
                        size_mb: (+(kb / 1024).toPrecision(3)).toLocaleString(),
                        size_b: fileSize.toLocaleString()
                    }, '{{size_mb}} MB ({{size_b}} bytes)');
                }
            }, {
                key: '_parseDate',
                value: function _parseDate(inputDate) {
                    if (!inputDate) {
                        return;
                    }
                    var dateToParse = inputDate;
                    if (dateToParse.substring(0, 2) === 'D:') {
                        dateToParse = dateToParse.substring(2);
                    }
                    var year = parseInt(dateToParse.substring(0, 4), 10);
                    var month = parseInt(dateToParse.substring(4, 6), 10) - 1;
                    var day = parseInt(dateToParse.substring(6, 8), 10);
                    var hours = parseInt(dateToParse.substring(8, 10), 10);
                    var minutes = parseInt(dateToParse.substring(10, 12), 10);
                    var seconds = parseInt(dateToParse.substring(12, 14), 10);
                    var utRel = dateToParse.substring(14, 15);
                    var offsetHours = parseInt(dateToParse.substring(15, 17), 10);
                    var offsetMinutes = parseInt(dateToParse.substring(18, 20), 10);
                    if (utRel === '-') {
                        hours += offsetHours;
                        minutes += offsetMinutes;
                    } else if (utRel === '+') {
                        hours -= offsetHours;
                        minutes -= offsetMinutes;
                    }
                    var date = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
                    var dateString = date.toLocaleDateString();
                    var timeString = date.toLocaleTimeString();
                    return this.l10n.get('document_properties_date_string', {
                        date: dateString,
                        time: timeString
                    }, '{{date}}, {{time}}');
                }
            }]);

            return PDFDocumentProperties;
        }();

        exports.PDFDocumentProperties = PDFDocumentProperties;
    }),
    /* 19 */
    (function (module, exports, __webpack_require__) {

    }),
    /* 20 */
    (function (module, exports, __webpack_require__) {

        var _dom_events = __webpack_require__(2);

        function PDFHistory(options) {
            this.linkService = options.linkService;
            this.eventBus = options.eventBus || (0, _dom_events.getGlobalEventBus)();
            this.initialized = false;
            this.initialDestination = null;
            this.initialBookmark = null;
        }

        PDFHistory.prototype = {
            initialize: function pdfHistoryInitialize(fingerprint) {
                this.initialized = true;
                this.reInitialized = false;
                this.allowHashChange = true;
                this.historyUnlocked = true;
                this.isViewerInPresentationMode = false;
                this.previousHash = window.location.hash.substring(1);
                this.currentBookmark = '';
                this.currentPage = 0;
                this.updatePreviousBookmark = false;
                this.previousBookmark = '';
                this.previousPage = 0;
                this.nextHashParam = '';
                this.fingerprint = fingerprint;
                this.currentUid = this.uid = 0;
                this.current = {};
                var state = window.history.state;
                if (this._isStateObjectDefined(state)) {
                    if (state.target.dest) {
                        this.initialDestination = state.target.dest;
                    } else {
                        this.initialBookmark = state.target.hash;
                    }
                    this.currentUid = state.uid;
                    this.uid = state.uid + 1;
                    this.current = state.target;
                } else {
                    if (state && state.fingerprint && this.fingerprint !== state.fingerprint) {
                        this.reInitialized = true;
                    }
                    this._pushOrReplaceState({fingerprint: this.fingerprint}, true);
                }
                var self = this;
                window.addEventListener('popstate', function pdfHistoryPopstate(evt) {
                    if (!self.historyUnlocked) {
                        return;
                    }
                    if (evt.state) {
                        self._goTo(evt.state);
                        return;
                    }
                    if (self.uid === 0) {
                        var previousParams = self.previousHash && self.currentBookmark && self.previousHash !== self.currentBookmark ? {
                            hash: self.currentBookmark,
                            page: self.currentPage
                        } : {page: 1};
                        replacePreviousHistoryState(previousParams, function () {
                            updateHistoryWithCurrentHash();
                        });
                    } else {
                        updateHistoryWithCurrentHash();
                    }
                });
                function updateHistoryWithCurrentHash() {
                    self.previousHash = window.location.hash.slice(1);
                    self._pushToHistory({hash: self.previousHash}, false, true);
                    self._updatePreviousBookmark();
                }

                function replacePreviousHistoryState(params, callback) {
                    self.historyUnlocked = false;
                    self.allowHashChange = false;
                    window.addEventListener('popstate', rewriteHistoryAfterBack);
                    history.back();
                    function rewriteHistoryAfterBack() {
                        window.removeEventListener('popstate', rewriteHistoryAfterBack);
                        window.addEventListener('popstate', rewriteHistoryAfterForward);
                        self._pushToHistory(params, false, true);
                        history.forward();
                    }

                    function rewriteHistoryAfterForward() {
                        window.removeEventListener('popstate', rewriteHistoryAfterForward);
                        self.allowHashChange = true;
                        self.historyUnlocked = true;
                        callback();
                    }
                }

                function pdfHistoryBeforeUnload() {
                    var previousParams = self._getPreviousParams(null, true);
                    if (previousParams) {
                        var replacePrevious = !self.current.dest && self.current.hash !== self.previousHash;
                        self._pushToHistory(previousParams, false, replacePrevious);
                        self._updatePreviousBookmark();
                    }
                    window.removeEventListener('beforeunload', pdfHistoryBeforeUnload);
                }

                window.addEventListener('beforeunload', pdfHistoryBeforeUnload);
                window.addEventListener('pageshow', function pdfHistoryPageShow(evt) {
                    window.addEventListener('beforeunload', pdfHistoryBeforeUnload);
                });
                self.eventBus.on('presentationmodechanged', function (e) {
                    self.isViewerInPresentationMode = e.active;
                });
            },
            clearHistoryState: function pdfHistory_clearHistoryState() {
                this._pushOrReplaceState(null, true);
            },
            _isStateObjectDefined: function pdfHistory_isStateObjectDefined(state) {
                return state && state.uid >= 0 && state.fingerprint && this.fingerprint === state.fingerprint && state.target && state.target.hash ? true : false;
            },
            _pushOrReplaceState: function pdfHistory_pushOrReplaceState(stateObj, replace) {
                if (replace) {
                    window.history.replaceState(stateObj, '', document.URL);
                } else {
                    window.history.pushState(stateObj, '', document.URL);
                }
            },
            get isHashChangeUnlocked() {
                if (!this.initialized) {
                    return true;
                }
                return this.allowHashChange;
            },
            _updatePreviousBookmark: function pdfHistory_updatePreviousBookmark() {
                if (this.updatePreviousBookmark && this.currentBookmark && this.currentPage) {
                    this.previousBookmark = this.currentBookmark;
                    this.previousPage = this.currentPage;
                    this.updatePreviousBookmark = false;
                }
            },
            updateCurrentBookmark: function pdfHistoryUpdateCurrentBookmark(bookmark, pageNum) {
                if (this.initialized) {
                    this.currentBookmark = bookmark.substring(1);
                    this.currentPage = pageNum | 0;
                    this._updatePreviousBookmark();
                }
            },
            updateNextHashParam: function pdfHistoryUpdateNextHashParam(param) {
                if (this.initialized) {
                    this.nextHashParam = param;
                }
            },
            push: function pdfHistoryPush(params, isInitialBookmark) {
                if (!(this.initialized && this.historyUnlocked)) {
                    return;
                }
                if (params.dest && !params.hash) {
                    params.hash = this.current.hash && this.current.dest && this.current.dest === params.dest ? this.current.hash : this.linkService.getDestinationHash(params.dest).split('#')[1];
                }
                if (params.page) {
                    params.page |= 0;
                }
                if (isInitialBookmark) {
                    var target = window.history.state.target;
                    if (!target) {
                        this._pushToHistory(params, false);
                        this.previousHash = window.location.hash.substring(1);
                    }
                    this.updatePreviousBookmark = this.nextHashParam ? false : true;
                    if (target) {
                        this._updatePreviousBookmark();
                    }
                    return;
                }
                if (this.nextHashParam) {
                    if (this.nextHashParam === params.hash) {
                        this.nextHashParam = null;
                        this.updatePreviousBookmark = true;
                        return;
                    }
                    this.nextHashParam = null;
                }
                if (params.hash) {
                    if (this.current.hash) {
                        if (this.current.hash !== params.hash) {
                            this._pushToHistory(params, true);
                        } else {
                            if (!this.current.page && params.page) {
                                this._pushToHistory(params, false, true);
                            }
                            this.updatePreviousBookmark = true;
                        }
                    } else {
                        this._pushToHistory(params, true);
                    }
                } else if (this.current.page && params.page && this.current.page !== params.page) {
                    this._pushToHistory(params, true);
                }
            },
            _getPreviousParams: function pdfHistory_getPreviousParams(onlyCheckPage, beforeUnload) {
                if (!(this.currentBookmark && this.currentPage)) {
                    return null;
                } else if (this.updatePreviousBookmark) {
                    this.updatePreviousBookmark = false;
                }
                if (this.uid > 0 && !(this.previousBookmark && this.previousPage)) {
                    return null;
                }
                if (!this.current.dest && !onlyCheckPage || beforeUnload) {
                    if (this.previousBookmark === this.currentBookmark) {
                        return null;
                    }
                } else if (this.current.page || onlyCheckPage) {
                    if (this.previousPage === this.currentPage) {
                        return null;
                    }
                } else {
                    return null;
                }
                var params = {
                    hash: this.currentBookmark,
                    page: this.currentPage
                };
                if (this.isViewerInPresentationMode) {
                    params.hash = null;
                }
                return params;
            },
            _stateObj: function pdfHistory_stateObj(params) {
                return {
                    fingerprint: this.fingerprint,
                    uid: this.uid,
                    target: params
                };
            },
            _pushToHistory: function pdfHistory_pushToHistory(params, addPrevious, overwrite) {
                if (!this.initialized) {
                    return;
                }
                if (!params.hash && params.page) {
                    params.hash = 'page=' + params.page;
                }
                if (addPrevious && !overwrite) {
                    var previousParams = this._getPreviousParams();
                    if (previousParams) {
                        var replacePrevious = !this.current.dest && this.current.hash !== this.previousHash;
                        this._pushToHistory(previousParams, false, replacePrevious);
                    }
                }
                this._pushOrReplaceState(this._stateObj(params), overwrite || this.uid === 0);
                this.currentUid = this.uid++;
                this.current = params;
                this.updatePreviousBookmark = true;
            },
            _goTo: function pdfHistory_goTo(state) {
                if (!(this.initialized && this.historyUnlocked && this._isStateObjectDefined(state))) {
                    return;
                }
                if (!this.reInitialized && state.uid < this.currentUid) {
                    var previousParams = this._getPreviousParams(true);
                    if (previousParams) {
                        this._pushToHistory(this.current, false);
                        this._pushToHistory(previousParams, false);
                        this.currentUid = state.uid;
                        window.history.back();
                        return;
                    }
                }
                this.historyUnlocked = false;
                if (state.target.dest) {
                    this.linkService.navigateTo(state.target.dest);
                } else {
                    this.linkService.setHash(state.target.hash);
                }
                this.currentUid = state.uid;
                if (state.uid > this.uid) {
                    this.uid = state.uid;
                }
                this.current = state.target;
                this.updatePreviousBookmark = true;
                var currentHash = window.location.hash.substring(1);
                if (this.previousHash !== currentHash) {
                    this.allowHashChange = false;
                }
                this.previousHash = currentHash;
                this.historyUnlocked = true;
            },
            back: function pdfHistoryBack() {
                this.go(-1);
            },
            forward: function pdfHistoryForward() {
                this.go(1);
            },
            go: function pdfHistoryGo(direction) {
                if (this.initialized && this.historyUnlocked) {
                    var state = window.history.state;
                    if (direction === -1 && state && state.uid > 0) {
                        window.history.back();
                    } else if (direction === 1 && state && state.uid < this.uid - 1) {
                        window.history.forward();
                    }
                }
            }
        };
        exports.PDFHistory = PDFHistory;

    }),
    /* 21 */
    (function (module, exports, __webpack_require__) {


        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }

            return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();

        var _pdfjsLib = __webpack_require__(1);

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var DEFAULT_TITLE = '\u2013';

        var PDFOutlineViewer = function () {
            function PDFOutlineViewer(_ref) {
                var container = _ref.container,
                    linkService = _ref.linkService,
                    eventBus = _ref.eventBus;

                _classCallCheck(this, PDFOutlineViewer);

                this.outline = null;
                this.lastToggleIsShow = true;
                this.container = container;
                this.linkService = linkService;
                this.eventBus = eventBus;
            }

            _createClass(PDFOutlineViewer, [{
                key: 'reset',
                value: function reset() {
                    this.outline = null;
                    this.lastToggleIsShow = true;
                    this.container.textContent = '';
                    this.container.classList.remove('outlineWithDeepNesting');
                }
            }, {
                key: '_dispatchEvent',
                value: function _dispatchEvent(outlineCount) {
                    this.eventBus.dispatch('outlineloaded', {
                        source: this,
                        outlineCount: outlineCount
                    });
                }
            }, {
                key: '_bindLink',
                value: function _bindLink(element, item) {
                    var _this = this;

                    if (item.url) {
                        (0, _pdfjsLib.addLinkAttributes)(element, {
                            url: item.url,
                            target: item.newWindow ? _pdfjsLib.PDFJS.LinkTarget.BLANK : undefined
                        });
                        return;
                    }
                    var destination = item.dest;
                    element.href = this.linkService.getDestinationHash(destination);
                    element.onclick = function () {
                        if (destination) {
                            _this.linkService.navigateTo(destination);
                        }
                        return false;
                    };
                }
            }, {
                key: '_setStyles',
                value: function _setStyles(element, item) {
                    var styleStr = '';
                    if (item.bold) {
                        styleStr += 'font-weight: bold;';
                    }
                    if (item.italic) {
                        styleStr += 'font-style: italic;';
                    }
                    if (styleStr) {
                        element.setAttribute('style', styleStr);
                    }
                }
            }, {
                key: '_addToggleButton',
                value: function _addToggleButton(div) {
                    var _this2 = this;

                    var toggler = document.createElement('div');
                    toggler.className = 'outlineItemToggler';
                    toggler.onclick = function (evt) {
                        evt.stopPropagation();
                        toggler.classList.toggle('outlineItemsHidden');
                        if (evt.shiftKey) {
                            var shouldShowAll = !toggler.classList.contains('outlineItemsHidden');
                            _this2._toggleOutlineItem(div, shouldShowAll);
                        }
                    };
                    div.insertBefore(toggler, div.firstChild);
                }
            }, {
                key: '_toggleOutlineItem',
                value: function _toggleOutlineItem(root, show) {
                    this.lastToggleIsShow = show;
                    var togglers = root.querySelectorAll('.outlineItemToggler');
                    for (var i = 0, ii = togglers.length; i < ii; ++i) {
                        togglers[i].classList[show ? 'remove' : 'add']('outlineItemsHidden');
                    }
                }
            }, {
                key: 'toggleOutlineTree',
                value: function toggleOutlineTree() {
                    if (!this.outline) {
                        return;
                    }
                    this._toggleOutlineItem(this.container, !this.lastToggleIsShow);
                }
            }, {
                key: 'render',
                value: function render(_ref2) {
                    var outline = _ref2.outline;

                    var outlineCount = 0;
                    if (this.outline) {
                        this.reset();
                    }
                    this.outline = outline || null;
                    if (!outline) {
                        this._dispatchEvent(outlineCount);
                        return;
                    }
                    var fragment = document.createDocumentFragment();
                    var queue = [{
                        parent: fragment,
                        items: this.outline
                    }];
                    var hasAnyNesting = false;
                    while (queue.length > 0) {
                        var levelData = queue.shift();
                        for (var i = 0, len = levelData.items.length; i < len; i++) {
                            var item = levelData.items[i];
                            var div = document.createElement('div');
                            div.className = 'outlineItem';
                            var element = document.createElement('a');
                            this._bindLink(element, item);
                            this._setStyles(element, item);
                            element.textContent = (0, _pdfjsLib.removeNullCharacters)(item.title) || DEFAULT_TITLE;
                            div.appendChild(element);
                            if (item.items.length > 0) {
                                hasAnyNesting = true;
                                this._addToggleButton(div);
                                var itemsDiv = document.createElement('div');
                                itemsDiv.className = 'outlineItems';
                                div.appendChild(itemsDiv);
                                queue.push({
                                    parent: itemsDiv,
                                    items: item.items
                                });
                            }
                            levelData.parent.appendChild(div);
                            outlineCount++;
                        }
                    }
                    if (hasAnyNesting) {
                        this.container.classList.add('outlineWithDeepNesting');
                    }
                    this.container.appendChild(fragment);
                    this._dispatchEvent(outlineCount);
                }
            }]);

            return PDFOutlineViewer;
        }();

        exports.PDFOutlineViewer = PDFOutlineViewer;
    }),
    /* 22 */
    (function (module, exports, __webpack_require__) {
        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }

            return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();

        var _ui_utils = __webpack_require__(0);

        var _pdfjsLib = __webpack_require__(1);

        var _dom_events = __webpack_require__(2);

        var _pdf_rendering_queue = __webpack_require__(3);

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var PDFPageView = function () {
            function PDFPageView(options) {
                _classCallCheck(this, PDFPageView);

                var container = options.container;
                var defaultViewport = options.defaultViewport;
                this.id = options.id;
                this.renderingId = 'page' + this.id;
                this.pdfPage = null;
                this.pageLabel = null;
                this.rotation = 0;
                this.scale = options.scale || _ui_utils.DEFAULT_SCALE;
                this.viewport = defaultViewport;
                this.pdfPageRotate = defaultViewport.rotation;
                this.hasRestrictedScaling = false;
                this.enhanceTextSelection = options.enhanceTextSelection || false;
                this.renderInteractiveForms = options.renderInteractiveForms || false;
                this.eventBus = options.eventBus || (0, _dom_events.getGlobalEventBus)();
                this.renderingQueue = options.renderingQueue;
                this.annotationLayerFactory = options.annotationLayerFactory;
                this.renderer = options.renderer || _ui_utils.RendererType.CANVAS;
                this.l10n = options.l10n || _ui_utils.NullL10n;
                this.paintTask = null;
                this.paintedViewportMap = new WeakMap();
                this.renderingState = _pdf_rendering_queue.RenderingStates.INITIAL;
                this.resume = null;
                this.error = null;
                this.onBeforeDraw = null;
                this.onAfterDraw = null;
                this.annotationLayer = null;
                this.zoomLayer = null;
                var div = document.createElement('div');
                div.className = 'page';
                div.style.width = Math.floor(this.viewport.width) + 'px';
                div.style.height = Math.floor(this.viewport.height) + 'px';
                div.setAttribute('data-page-number', this.id);
                this.div = div;
                container.appendChild(div);
            }

            _createClass(PDFPageView, [{
                key: 'setPdfPage',
                value: function setPdfPage(pdfPage) {
                    this.pdfPage = pdfPage;
                    this.pdfPageRotate = pdfPage.rotate;
                    var totalRotation = (this.rotation + this.pdfPageRotate) % 360;
                    this.viewport = pdfPage.getViewport(this.scale * _ui_utils.CSS_UNITS, totalRotation);
                    this.stats = pdfPage.stats;
                    this.reset();
                }
            }, {
                key: 'destroy',
                value: function destroy() {
                    this.reset();
                    if (this.pdfPage) {
                        this.pdfPage.cleanup();
                        this.pdfPage = null;
                    }
                }
            }, {
                key: '_resetZoomLayer',
                value: function _resetZoomLayer() {
                    var removeFromDOM = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

                    if (!this.zoomLayer) {
                        return;
                    }
                    var zoomLayerCanvas = this.zoomLayer.firstChild;
                    this.paintedViewportMap.delete(zoomLayerCanvas);
                    zoomLayerCanvas.width = 0;
                    zoomLayerCanvas.height = 0;
                    if (removeFromDOM) {
                        this.zoomLayer.remove();
                    }
                    this.zoomLayer = null;
                }
            }, {
                key: 'reset',
                value: function reset() {
                    var keepZoomLayer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
                    var keepAnnotations = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

                    this.cancelRendering();
                    var div = this.div;
                    div.style.width = Math.floor(this.viewport.width) + 'px';
                    div.style.height = Math.floor(this.viewport.height) + 'px';
                    var childNodes = div.childNodes;
                    var currentZoomLayerNode = keepZoomLayer && this.zoomLayer || null;
                    var currentAnnotationNode = keepAnnotations && this.annotationLayer && this.annotationLayer.div || null;
                    for (var i = childNodes.length - 1; i >= 0; i--) {
                        var node = childNodes[i];
                        if (currentZoomLayerNode === node || currentAnnotationNode === node) {
                            continue;
                        }
                        div.removeChild(node);
                    }
                    div.removeAttribute('data-loaded');
                    if (currentAnnotationNode) {
                        this.annotationLayer.hide();
                    } else {
                        this.annotationLayer = null;
                    }
                    if (!currentZoomLayerNode) {
                        if (this.canvas) {
                            this.paintedViewportMap.delete(this.canvas);
                            this.canvas.width = 0;
                            this.canvas.height = 0;
                            delete this.canvas;
                        }
                        this._resetZoomLayer();
                    }
                    if (this.svg) {
                        this.paintedViewportMap.delete(this.svg);
                        delete this.svg;
                    }
                    this.loadingIconDiv = document.createElement('div');
                    this.loadingIconDiv.className = 'loadingIcon';
                    div.appendChild(this.loadingIconDiv);
                }
            }, {
                key: 'update',
                value: function update(scale, rotation) {
                    this.scale = scale || this.scale;
                    if (typeof rotation !== 'undefined') {
                        this.rotation = rotation;
                    }
                    var totalRotation = (this.rotation + this.pdfPageRotate) % 360;
                    this.viewport = this.viewport.clone({
                        scale: this.scale * _ui_utils.CSS_UNITS,
                        rotation: totalRotation
                    });
                    if (this.svg) {
                        this.cssTransform(this.svg, true);
                        this.eventBus.dispatch('pagerendered', {
                            source: this,
                            pageNumber: this.id,
                            cssTransform: true
                        });
                        return;
                    }
                    var isScalingRestricted = false;
                    if (this.canvas && _pdfjsLib.PDFJS.maxCanvasPixels > 0) {
                        var outputScale = this.outputScale;
                        if ((Math.floor(this.viewport.width) * outputScale.sx | 0) * (Math.floor(this.viewport.height) * outputScale.sy | 0) > _pdfjsLib.PDFJS.maxCanvasPixels) {
                            isScalingRestricted = true;
                        }
                    }
                    if (this.canvas) {
                        if (_pdfjsLib.PDFJS.useOnlyCssZoom || this.hasRestrictedScaling && isScalingRestricted) {
                            this.cssTransform(this.canvas, true);
                            this.eventBus.dispatch('pagerendered', {
                                source: this,
                                pageNumber: this.id,
                                cssTransform: true
                            });
                            return;
                        }
                        if (!this.zoomLayer && !this.canvas.hasAttribute('hidden')) {
                            this.zoomLayer = this.canvas.parentNode;
                            this.zoomLayer.style.position = 'absolute';
                        }
                    }
                    if (this.zoomLayer) {
                        this.cssTransform(this.zoomLayer.firstChild);
                    }
                    this.reset(true, true);
                }
            }, {
                key: 'cancelRendering',
                value: function cancelRendering() {
                    if (this.paintTask) {
                        this.paintTask.cancel();
                        this.paintTask = null;
                    }
                    this.renderingState = _pdf_rendering_queue.RenderingStates.INITIAL;
                    this.resume = null;
                }
            }, {
                key: 'cssTransform',
                value: function cssTransform(target) {
                    var redrawAnnotations = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

                    var width = this.viewport.width;
                    var height = this.viewport.height;
                    var div = this.div;
                    target.style.width = target.parentNode.style.width = div.style.width = Math.floor(width) + 'px';
                    target.style.height = target.parentNode.style.height = div.style.height = Math.floor(height) + 'px';
                    var relativeRotation = this.viewport.rotation - this.paintedViewportMap.get(target).rotation;
                    var absRotation = Math.abs(relativeRotation);
                    var scaleX = 1,
                        scaleY = 1;
                    if (absRotation === 90 || absRotation === 270) {
                        scaleX = height / width;
                        scaleY = width / height;
                    }
                    var cssTransform = 'rotate(' + relativeRotation + 'deg) ' + 'scale(' + scaleX + ',' + scaleY + ')';
                    _pdfjsLib.CustomStyle.setProp('transform', target, cssTransform);
                    if (redrawAnnotations && this.annotationLayer) {
                        this.annotationLayer.render(this.viewport, 'display');
                    }
                }
            }, {
                key: 'getPagePoint',
                value: function getPagePoint(x, y) {
                    return this.viewport.convertToPdfPoint(x, y);
                }
            }, {
                key: 'draw',
                value: function draw() {
                    var _this = this;

                    if (this.renderingState !== _pdf_rendering_queue.RenderingStates.INITIAL) {
                        console.error('Must be in new state before drawing');
                        this.reset();
                    }
                    if (!this.pdfPage) {
                        this.renderingState = _pdf_rendering_queue.RenderingStates.FINISHED;
                        return Promise.reject(new Error('Page is not loaded'));
                    }
                    this.renderingState = _pdf_rendering_queue.RenderingStates.RUNNING;
                    var pdfPage = this.pdfPage;
                    var div = this.div;
                    var canvasWrapper = document.createElement('div');
                    canvasWrapper.style.width = div.style.width;
                    canvasWrapper.style.height = div.style.height;
                    canvasWrapper.classList.add('canvasWrapper');
                    if (this.annotationLayer && this.annotationLayer.div) {
                        div.insertBefore(canvasWrapper, this.annotationLayer.div);
                    } else {
                        div.appendChild(canvasWrapper);
                    }
                    var renderContinueCallback = null;
                    if (this.renderingQueue) {
                        renderContinueCallback = function renderContinueCallback(cont) {
                            if (!_this.renderingQueue.isHighestPriority(_this)) {
                                _this.renderingState = _pdf_rendering_queue.RenderingStates.PAUSED;
                                _this.resume = function () {
                                    _this.renderingState = _pdf_rendering_queue.RenderingStates.RUNNING;
                                    cont();
                                };
                                return;
                            }
                            cont();
                        };
                    }
                    var finishPaintTask = function finishPaintTask(error) {
                        if (paintTask === _this.paintTask) {
                            _this.paintTask = null;
                        }
                        if (error === 'cancelled' || error instanceof _pdfjsLib.RenderingCancelledException) {
                            _this.error = null;
                            return Promise.resolve(undefined);
                        }
                        _this.renderingState = _pdf_rendering_queue.RenderingStates.FINISHED;
                        if (_this.loadingIconDiv) {
                            div.removeChild(_this.loadingIconDiv);
                            delete _this.loadingIconDiv;
                        }
                        _this._resetZoomLayer(true);
                        _this.error = error;
                        _this.stats = pdfPage.stats;
                        if (_this.onAfterDraw) {
                            _this.onAfterDraw();
                        }
                        _this.eventBus.dispatch('pagerendered', {
                            source: _this,
                            pageNumber: _this.id,
                            cssTransform: false
                        });
                        if (error) {
                            return Promise.reject(error);
                        }
                        return Promise.resolve(undefined);
                    };
                    var paintTask = this.renderer === _ui_utils.RendererType.SVG ? this.paintOnSvg(canvasWrapper) : this.paintOnCanvas(canvasWrapper);
                    paintTask.onRenderContinue = renderContinueCallback;
                    this.paintTask = paintTask;
                    var resultPromise = paintTask.promise.then(function () {
                        return finishPaintTask(null).then(function () {
                        });
                    }, function (reason) {
                        return finishPaintTask(reason);
                    });
                    if (this.annotationLayerFactory) {
                        if (!this.annotationLayer) {
                            this.annotationLayer = this.annotationLayerFactory.createAnnotationLayerBuilder(div, pdfPage, this.renderInteractiveForms, this.l10n);
                        }
                        this.annotationLayer.render(this.viewport, 'display');
                    }
                    div.setAttribute('data-loaded', true);
                    if (this.onBeforeDraw) {
                        this.onBeforeDraw();
                    }
                    return resultPromise;
                }
            }, {
                key: 'paintOnCanvas',
                value: function paintOnCanvas(canvasWrapper) {
                    var renderCapability = (0, _pdfjsLib.createPromiseCapability)();
                    var result = {
                        promise: renderCapability.promise,
                        onRenderContinue: function onRenderContinue(cont) {
                            cont();
                        },
                        cancel: function cancel() {
                            renderTask.cancel();
                        }
                    };
                    var viewport = this.viewport;
                    var canvas = document.createElement('canvas');
                    canvas.id = this.renderingId;
                    canvas.setAttribute('hidden', 'hidden');
                    var isCanvasHidden = true;
                    var showCanvas = function showCanvas() {
                        if (isCanvasHidden) {
                            canvas.removeAttribute('hidden');
                            isCanvasHidden = false;
                        }
                    };
                    canvasWrapper.appendChild(canvas);
                    this.canvas = canvas;
                    canvas.mozOpaque = true;
                    var ctx = canvas.getContext('2d', {alpha: false});
                    var outputScale = (0, _ui_utils.getOutputScale)(ctx);
                    this.outputScale = outputScale;
                    if (_pdfjsLib.PDFJS.useOnlyCssZoom) {
                        var actualSizeViewport = viewport.clone({scale: _ui_utils.CSS_UNITS});
                        outputScale.sx *= actualSizeViewport.width / viewport.width;
                        outputScale.sy *= actualSizeViewport.height / viewport.height;
                        outputScale.scaled = true;
                    }
                    if (_pdfjsLib.PDFJS.maxCanvasPixels > 0) {
                        var pixelsInViewport = viewport.width * viewport.height;
                        var maxScale = Math.sqrt(_pdfjsLib.PDFJS.maxCanvasPixels / pixelsInViewport);
                        if (outputScale.sx > maxScale || outputScale.sy > maxScale) {
                            outputScale.sx = maxScale;
                            outputScale.sy = maxScale;
                            outputScale.scaled = true;
                            this.hasRestrictedScaling = true;
                        } else {
                            this.hasRestrictedScaling = false;
                        }
                    }
                    var sfx = (0, _ui_utils.approximateFraction)(outputScale.sx);
                    var sfy = (0, _ui_utils.approximateFraction)(outputScale.sy);
                    canvas.width = (0, _ui_utils.roundToDivide)(viewport.width * outputScale.sx, sfx[0]);
                    canvas.height = (0, _ui_utils.roundToDivide)(viewport.height * outputScale.sy, sfy[0]);
                    canvas.style.width = (0, _ui_utils.roundToDivide)(viewport.width, sfx[1]) + 'px';
                    canvas.style.height = (0, _ui_utils.roundToDivide)(viewport.height, sfy[1]) + 'px';
                    this.paintedViewportMap.set(canvas, viewport);
                    var transform = !outputScale.scaled ? null : [outputScale.sx, 0, 0, outputScale.sy, 0, 0];
                    var renderContext = {
                        canvasContext: ctx,
                        transform: transform,
                        viewport: this.viewport,
                        renderInteractiveForms: this.renderInteractiveForms
                    };
                    var renderTask = this.pdfPage.render(renderContext);
                    renderTask.onContinue = function (cont) {
                        showCanvas();
                        if (result.onRenderContinue) {
                            result.onRenderContinue(cont);
                        } else {
                            cont();
                        }
                    };
                    renderTask.promise.then(function () {
                        showCanvas();
                        renderCapability.resolve(undefined);
                    }, function (error) {
                        showCanvas();
                        renderCapability.reject(error);
                    });
                    return result;
                }
            }, {
                key: 'paintOnSvg',
                value: function paintOnSvg(wrapper) {
                    var _this2 = this;

                    var cancelled = false;
                    var ensureNotCancelled = function ensureNotCancelled() {
                        if (cancelled) {
                            if (_pdfjsLib.PDFJS.pdfjsNext) {
                                throw new _pdfjsLib.RenderingCancelledException('Rendering cancelled, page ' + _this2.id, 'svg');
                            } else {
                                throw 'cancelled';
                            }
                        }
                    };
                    var pdfPage = this.pdfPage;
                    var actualSizeViewport = this.viewport.clone({scale: _ui_utils.CSS_UNITS});
                    var promise = pdfPage.getOperatorList().then(function (opList) {
                        ensureNotCancelled();
                        var svgGfx = new _pdfjsLib.SVGGraphics(pdfPage.commonObjs, pdfPage.objs);
                        return svgGfx.getSVG(opList, actualSizeViewport).then(function (svg) {
                            ensureNotCancelled();
                            _this2.svg = svg;
                            _this2.paintedViewportMap.set(svg, actualSizeViewport);
                            svg.style.width = wrapper.style.width;
                            svg.style.height = wrapper.style.height;
                            _this2.renderingState = _pdf_rendering_queue.RenderingStates.FINISHED;
                            wrapper.appendChild(svg);
                        });
                    });
                    return {
                        promise: promise,
                        onRenderContinue: function onRenderContinue(cont) {
                            cont();
                        },
                        cancel: function cancel() {
                            cancelled = true;
                        }
                    };
                }
            }, {
                key: 'setPageLabel',
                value: function setPageLabel(label) {
                    this.pageLabel = typeof label === 'string' ? label : null;
                    if (this.pageLabel !== null) {
                        this.div.setAttribute('data-page-label', this.pageLabel);
                    } else {
                        this.div.removeAttribute('data-page-label');
                    }
                }
            }, {
                key: 'width',
                get: function get() {
                    return this.viewport.width;
                }
            }, {
                key: 'height',
                get: function get() {
                    return this.viewport.height;
                }
            }]);

            return PDFPageView;
        }();

        exports.PDFPageView = PDFPageView;

    }),
    /* 23 */
    /***/ (function (module, exports, __webpack_require__) {

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }

            return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();

        var _ui_utils = __webpack_require__(0);

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var DELAY_BEFORE_RESETTING_SWITCH_IN_PROGRESS = 1500;
        var DELAY_BEFORE_HIDING_CONTROLS = 3000;
        var ACTIVE_SELECTOR = 'pdfPresentationMode';
        var CONTROLS_SELECTOR = 'pdfPresentationModeControls';
        var MOUSE_SCROLL_COOLDOWN_TIME = 50;
        var PAGE_SWITCH_THRESHOLD = 0.1;
        var SWIPE_MIN_DISTANCE_THRESHOLD = 50;
        var SWIPE_ANGLE_THRESHOLD = Math.PI / 6;

        var PDFPresentationMode = function () {
            function PDFPresentationMode(_ref) {
                var _this = this;

                var container = _ref.container,
                    _ref$viewer = _ref.viewer,
                    viewer = _ref$viewer === undefined ? null : _ref$viewer,
                    pdfViewer = _ref.pdfViewer,
                    eventBus = _ref.eventBus,
                    _ref$contextMenuItems = _ref.contextMenuItems,
                    contextMenuItems = _ref$contextMenuItems === undefined ? null : _ref$contextMenuItems;

                _classCallCheck(this, PDFPresentationMode);

                this.container = container;
                this.viewer = viewer || container.firstElementChild;
                this.pdfViewer = pdfViewer;
                this.eventBus = eventBus;
                this.active = false;
                this.args = null;
                this.contextMenuOpen = false;
                this.mouseScrollTimeStamp = 0;
                this.mouseScrollDelta = 0;
                this.touchSwipeState = null;
            }

            _createClass(PDFPresentationMode, [{
                key: 'request',
                value: function request() {
                    if (this.switchInProgress || this.active || !this.viewer.hasChildNodes()) {
                        return false;
                    }
                    this._setSwitchInProgress();
                    this._notifyStateChange();
                    this.args = {
                        page: this.pdfViewer.currentPageNumber,
                        previousScale: this.pdfViewer.currentScaleValue
                    };
                    return true;
                }
            }, {
                key: '_mouseWheel',
                value: function _mouseWheel(evt) {
                    if (!this.active) {
                        return;
                    }
                    evt.preventDefault();
                    var delta = (0, _ui_utils.normalizeWheelEventDelta)(evt);
                    var currentTime = new Date().getTime();
                    var storedTime = this.mouseScrollTimeStamp;
                    if (currentTime > storedTime && currentTime - storedTime < MOUSE_SCROLL_COOLDOWN_TIME) {
                        return;
                    }
                    if (this.mouseScrollDelta > 0 && delta < 0 || this.mouseScrollDelta < 0 && delta > 0) {
                        this._resetMouseScrollState();
                    }
                    this.mouseScrollDelta += delta;
                    if (Math.abs(this.mouseScrollDelta) >= PAGE_SWITCH_THRESHOLD) {
                        var totalDelta = this.mouseScrollDelta;
                        this._resetMouseScrollState();
                        var success = totalDelta > 0 ? this._goToPreviousPage() : this._goToNextPage();
                        if (success) {
                            this.mouseScrollTimeStamp = currentTime;
                        }
                    }
                }
            }, {
                key: '_goToPreviousPage',
                value: function _goToPreviousPage() {
                    var page = this.pdfViewer.currentPageNumber;
                    if (page <= 1) {
                        return false;
                    }
                    this.pdfViewer.currentPageNumber = page - 1;
                    return true;
                }
            }, {
                key: '_goToNextPage',
                value: function _goToNextPage() {
                    var page = this.pdfViewer.currentPageNumber;
                    if (page >= this.pdfViewer.pagesCount) {
                        return false;
                    }
                    this.pdfViewer.currentPageNumber = page + 1;
                    return true;
                }
            }, {
                key: '_notifyStateChange',
                value: function _notifyStateChange() {
                    this.eventBus.dispatch('presentationmodechanged', {
                        source: this,
                        active: this.active,
                        switchInProgress: !!this.switchInProgress
                    });
                }
            }, {
                key: '_setSwitchInProgress',
                value: function _setSwitchInProgress() {
                    var _this2 = this;

                    if (this.switchInProgress) {
                        clearTimeout(this.switchInProgress);
                    }
                    this.switchInProgress = setTimeout(function () {
                        delete _this2.switchInProgress;
                        _this2._notifyStateChange();
                    }, DELAY_BEFORE_RESETTING_SWITCH_IN_PROGRESS);
                }
            }, {
                key: '_resetSwitchInProgress',
                value: function _resetSwitchInProgress() {
                    if (this.switchInProgress) {
                        clearTimeout(this.switchInProgress);
                        delete this.switchInProgress;
                    }
                }
            }, {
                key: '_enter',
                value: function _enter() {
                    var _this3 = this;

                    this.active = true;
                    this._resetSwitchInProgress();
                    this._notifyStateChange();
                    this.container.classList.add(ACTIVE_SELECTOR);
                    setTimeout(function () {
                        _this3.pdfViewer.currentPageNumber = _this3.args.page;
                        _this3.pdfViewer.currentScaleValue = 'page-fit';
                    }, 0);
                    this._addWindowListeners();
                    this._showControls();
                    this.contextMenuOpen = false;
                    this.container.setAttribute('contextmenu', 'viewerContextMenu');
                    window.getSelection().removeAllRanges();
                }
            }, {
                key: '_exit',
                value: function _exit() {
                    var _this4 = this;

                    var page = this.pdfViewer.currentPageNumber;
                    this.container.classList.remove(ACTIVE_SELECTOR);
                    setTimeout(function () {
                        _this4.active = false;
                        _this4._notifyStateChange();
                        _this4.pdfViewer.currentScaleValue = _this4.args.previousScale;
                        _this4.pdfViewer.currentPageNumber = page;
                        _this4.args = null;
                    }, 0);
                    this._removeWindowListeners();
                    this._hideControls();
                    this._resetMouseScrollState();
                    this.container.removeAttribute('contextmenu');
                    this.contextMenuOpen = false;
                }
            }, {
                key: '_mouseDown',
                value: function _mouseDown(evt) {
                    if (this.contextMenuOpen) {
                        this.contextMenuOpen = false;
                        evt.preventDefault();
                        return;
                    }
                    if (evt.button === 0) {
                        var isInternalLink = evt.target.href && evt.target.classList.contains('internalLink');
                        if (!isInternalLink) {
                            evt.preventDefault();
                            if (evt.shiftKey) {
                                this._goToPreviousPage();
                            } else {
                                this._goToNextPage();
                            }
                        }
                    }
                }
            }, {
                key: '_contextMenu',
                value: function _contextMenu() {
                    this.contextMenuOpen = true;
                }
            }, {
                key: '_showControls',
                value: function _showControls() {
                    var _this5 = this;

                    if (this.controlsTimeout) {
                        clearTimeout(this.controlsTimeout);
                    } else {
                        this.container.classList.add(CONTROLS_SELECTOR);
                    }
                    this.controlsTimeout = setTimeout(function () {
                        _this5.container.classList.remove(CONTROLS_SELECTOR);
                        delete _this5.controlsTimeout;
                    }, DELAY_BEFORE_HIDING_CONTROLS);
                }
            }, {
                key: '_hideControls',
                value: function _hideControls() {
                    if (!this.controlsTimeout) {
                        return;
                    }
                    clearTimeout(this.controlsTimeout);
                    this.container.classList.remove(CONTROLS_SELECTOR);
                    delete this.controlsTimeout;
                }
            }, {
                key: '_resetMouseScrollState',
                value: function _resetMouseScrollState() {
                    this.mouseScrollTimeStamp = 0;
                    this.mouseScrollDelta = 0;
                }
            }, {
                key: '_touchSwipe',
                value: function _touchSwipe(evt) {
                    if (!this.active) {
                        return;
                    }
                    if (evt.touches.length > 1) {
                        this.touchSwipeState = null;
                        return;
                    }
                    switch (evt.type) {
                        case 'touchstart':
                            this.touchSwipeState = {
                                startX: evt.touches[0].pageX,
                                startY: evt.touches[0].pageY,
                                endX: evt.touches[0].pageX,
                                endY: evt.touches[0].pageY
                            };
                            break;
                        case 'touchmove':
                            if (this.touchSwipeState === null) {
                                return;
                            }
                            this.touchSwipeState.endX = evt.touches[0].pageX;
                            this.touchSwipeState.endY = evt.touches[0].pageY;
                            evt.preventDefault();
                            break;
                        case 'touchend':
                            if (this.touchSwipeState === null) {
                                return;
                            }
                            var delta = 0;
                            var dx = this.touchSwipeState.endX - this.touchSwipeState.startX;
                            var dy = this.touchSwipeState.endY - this.touchSwipeState.startY;
                            var absAngle = Math.abs(Math.atan2(dy, dx));
                            if (Math.abs(dx) > SWIPE_MIN_DISTANCE_THRESHOLD && (absAngle <= SWIPE_ANGLE_THRESHOLD || absAngle >= Math.PI - SWIPE_ANGLE_THRESHOLD)) {
                                delta = dx;
                            } else if (Math.abs(dy) > SWIPE_MIN_DISTANCE_THRESHOLD && Math.abs(absAngle - Math.PI / 2) <= SWIPE_ANGLE_THRESHOLD) {
                                delta = dy;
                            }
                            if (delta > 0) {
                                this._goToPreviousPage();
                            } else if (delta < 0) {
                                this._goToNextPage();
                            }
                            break;
                    }
                }
            }, {
                key: '_addWindowListeners',
                value: function _addWindowListeners() {
                    this.showControlsBind = this._showControls.bind(this);
                    this.mouseDownBind = this._mouseDown.bind(this);
                    this.mouseWheelBind = this._mouseWheel.bind(this);
                    this.resetMouseScrollStateBind = this._resetMouseScrollState.bind(this);
                    this.contextMenuBind = this._contextMenu.bind(this);
                    this.touchSwipeBind = this._touchSwipe.bind(this);
                    window.addEventListener('mousemove', this.showControlsBind);
                    window.addEventListener('mousedown', this.mouseDownBind);
                    window.addEventListener('wheel', this.mouseWheelBind);
                    window.addEventListener('keydown', this.resetMouseScrollStateBind);
                    window.addEventListener('contextmenu', this.contextMenuBind);
                    window.addEventListener('touchstart', this.touchSwipeBind);
                    window.addEventListener('touchmove', this.touchSwipeBind);
                    window.addEventListener('touchend', this.touchSwipeBind);
                }
            }, {
                key: '_removeWindowListeners',
                value: function _removeWindowListeners() {
                    window.removeEventListener('mousemove', this.showControlsBind);
                    window.removeEventListener('mousedown', this.mouseDownBind);
                    window.removeEventListener('wheel', this.mouseWheelBind);
                    window.removeEventListener('keydown', this.resetMouseScrollStateBind);
                    window.removeEventListener('contextmenu', this.contextMenuBind);
                    window.removeEventListener('touchstart', this.touchSwipeBind);
                    window.removeEventListener('touchmove', this.touchSwipeBind);
                    window.removeEventListener('touchend', this.touchSwipeBind);
                    delete this.showControlsBind;
                    delete this.mouseDownBind;
                    delete this.mouseWheelBind;
                    delete this.resetMouseScrollStateBind;
                    delete this.contextMenuBind;
                    delete this.touchSwipeBind;
                }
            },
            ]);

            return PDFPresentationMode;
        }();

        exports.PDFPresentationMode = PDFPresentationMode;

    }),
    /* 24 */
     (function (module, exports, __webpack_require__) {

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }

            return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();

        var _ui_utils = __webpack_require__(0);


        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var SidebarView = {
            NONE: 0,
            THUMBS: 1,
            OUTLINE: 2,
            ATTACHMENTS: 3
        };

        var PDFSidebar = function () {
            function PDFSidebar(options) {
                var l10n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _ui_utils.NullL10n;

                _classCallCheck(this, PDFSidebar);

                this.isOpen = false;
                this.active = SidebarView.THUMBS;
                this.isInitialViewSet = false;
                this.onToggled = null;
                this.pdfViewer = options.pdfViewer;
                this.pdfThumbnailViewer = options.pdfThumbnailViewer;
                this.pdfOutlineViewer = options.pdfOutlineViewer;
                this.mainContainer = options.mainContainer;
                this.eventBus = options.eventBus;
                this.disableNotification = options.disableNotification || false;
                this.l10n = l10n;
                this._addEventListeners();
            }

            _createClass(PDFSidebar, [{
                key: 'reset',
                value: function reset() {
                    this.isInitialViewSet = false;
                    this._hideUINotification(null);
                    this.switchView(SidebarView.THUMBS);
                    ;
                }
            }, {
                key: 'setInitialView',
                value: function setInitialView(view) {
                    if (this.isInitialViewSet) {
                        return;
                    }
                    this.isInitialViewSet = true;
                    if (this.isOpen && view === SidebarView.NONE) {
                        this._dispatchEvent();
                        return;
                    }
                    var isViewPreserved = view === this.visibleView;
                    this.switchView(view, true);
                    if (isViewPreserved) {
                        this._dispatchEvent();
                    }
                }
            }, {
                key: 'switchView',
                value: function switchView(view) {
                    var forceOpen = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

                    if (view === SidebarView.NONE) {
                        this.close();
                        return;
                    }
                    var isViewChanged = view !== this.active;
                    var shouldForceRendering = false;
                    switch (view) {
                        case SidebarView.THUMBS:

                            this.outlineView.classList.add('hidden');
                            if (this.isOpen && isViewChanged) {
                                shouldForceRendering = true;
                            }
                            break;
                        case SidebarView.OUTLINE:
                            this.outlineView.classList.remove('hidden');
                            break;
                        case SidebarView.ATTACHMENTS:
                            ;
                            this.outlineView.classList.add('hidden');
                            break;
                        default:
                            console.error('PDFSidebar_switchView: "' + view + '" is an unsupported value.');
                            return;
                    }
                    this.active = view | 0;
                    if (forceOpen && !this.isOpen) {
                        this.open();
                        return;
                    }
                    if (shouldForceRendering) {
                        this._forceRendering();
                    }
                    if (isViewChanged) {
                        this._dispatchEvent();
                    }
                    this._hideUINotification(this.active);
                }
            }, {
                key: 'open',
                value: function open() {
                    if (this.isOpen) {
                        return;
                    }
                    this.isOpen = true;
                    this.toggleButton.classList.add('toggled');
                    this.outerContainer.classList.add('sidebarOpen');
                    if (this.active === SidebarView.THUMBS) {
                    }
                    this._forceRendering();
                    this._dispatchEvent();
                    this._hideUINotification(this.active);
                }
            }, {
                key: 'close',
                value: function close() {
                    if (!this.isOpen) {
                        return;
                    }
                    this.isOpen = false;
                    this._forceRendering();
                    this._dispatchEvent();
                }
            }, {
                key: 'toggle',
                value: function toggle() {
                    if (this.isOpen) {
                        this.close();
                    } else {
                        this.open();
                    }
                }
            }, {
                key: '_dispatchEvent',
                value: function _dispatchEvent() {
                    this.eventBus.dispatch('sidebarviewchanged', {
                        source: this,
                        view: this.visibleView
                    });
                }
            }, {
                key: '_forceRendering',
                value: function _forceRendering() {
                    if (this.onToggled) {
                        this.onToggled();
                    } else {
                        this.pdfViewer.forceRendering();
                    }
                }

            }, {
                key: '_showUINotification',
                value: function _showUINotification(view) {
                    var _this = this;

                    if (this.disableNotification) {
                        return;
                    }
                    this.l10n.get('toggle_sidebar_notification.title', null, 'Toggle Sidebar (document contains outline/attachments)').then(function (msg) {
                    });
                    if (!this.isOpen) {
                    } else if (view === this.active) {
                        return;
                    }
                    switch (view) {
                        case SidebarView.OUTLINE:
                        case SidebarView.ATTACHMENTS:
                    }
                }
            }, {
                key: '_hideUINotification',
                value: function _hideUINotification(view) {
                    var _this2 = this;

                    if (this.disableNotification) {
                        return;
                    }
                    var removeNotification = function removeNotification(view) {
                        switch (view) {
                            case SidebarView.OUTLINE:
                            case SidebarView.ATTACHMENTS:
                        }
                    };
                    if (!this.isOpen && view !== null) {
                        return;
                    }
                    if (view !== null) {
                        removeNotification(view);
                        return;
                    }
                    for (view in SidebarView) {
                        removeNotification(SidebarView[view]);
                    }
                    this.l10n.get('toggle_sidebar.title', null, 'Toggle Sidebar').then(function (msg) {
                    });
                }
            }, {
                key: '_addEventListeners',
                value: function _addEventListeners() {
                    var _this3 = this;

                    this.mainContainer.addEventListener('transitionend', function (evt) {
                        if (evt.target === _this3.mainContainer) {
                        }
                    });

                    this.eventBus.on('outlineloaded', function (evt) {
                        var outlineCount = evt.outlineCount;
                        if (outlineCount) {
                            _this3._showUINotification(SidebarView.OUTLINE);
                        } else if (_this3.active === SidebarView.OUTLINE) {
                            _this3.switchView(SidebarView.THUMBS);
                        }
                    });
                    this.eventBus.on('presentationmodechanged', function (evt) {
                        if (!evt.active && !evt.switchInProgress && _this3.isThumbnailViewVisible) {
                            _this3._updateThumbnailViewer();
                        }
                    });
                }
            }, {
                key: 'visibleView',
                get: function get() {
                    return this.isOpen ? this.active : SidebarView.NONE;
                }
            }, {
                key: 'isThumbnailViewVisible',
                get: function get() {
                    return this.isOpen && this.active === SidebarView.THUMBS;
                }
            }, {
                key: 'isOutlineViewVisible',
                get: function get() {
                    return this.isOpen && this.active === SidebarView.OUTLINE;
                }
            }, {
                key: 'isAttachmentsViewVisible',
                get: function get() {
                    return this.isOpen && this.active === SidebarView.ATTACHMENTS;
                }
            }]);

            return PDFSidebar;
        }();

        exports.SidebarView = SidebarView;
        exports.PDFSidebar = PDFSidebar;
    }),
    /* 25 */
     (function (module, exports, __webpack_require__) {


        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }

            return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();

        var _pdfjsLib = __webpack_require__(1);

        var _ui_utils = __webpack_require__(0);

        var _pdf_rendering_queue = __webpack_require__(3);

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var MAX_NUM_SCALING_STEPS = 3;
        var THUMBNAIL_CANVAS_BORDER_WIDTH = 1;
        var THUMBNAIL_WIDTH = 98;
        var TempImageFactory = function TempImageFactoryClosure() {
            var tempCanvasCache = null;
            return {
                getCanvas: function getCanvas(width, height) {
                    var tempCanvas = tempCanvasCache;
                    if (!tempCanvas) {
                        tempCanvas = document.createElement('canvas');
                        tempCanvasCache = tempCanvas;
                    }
                    tempCanvas.width = width;
                    tempCanvas.height = height;
                    tempCanvas.mozOpaque = true;
                    var ctx = tempCanvas.getContext('2d', {alpha: false});
                    ctx.save();
                    ctx.fillStyle = 'rgb(255, 255, 255)';
                    ctx.fillRect(0, 0, width, height);
                    ctx.restore();
                    return tempCanvas;
                },
                destroyCanvas: function destroyCanvas() {
                    var tempCanvas = tempCanvasCache;
                    if (tempCanvas) {
                        tempCanvas.width = 0;
                        tempCanvas.height = 0;
                    }
                    tempCanvasCache = null;
                }
            };
        }();

        var PDFThumbnailView = function () {
            function PDFThumbnailView(_ref) {
                var container = _ref.container,
                    id = _ref.id,
                    defaultViewport = _ref.defaultViewport,
                    linkService = _ref.linkService,
                    renderingQueue = _ref.renderingQueue,
                    _ref$disableCanvasToI = _ref.disableCanvasToImageConversion,
                    disableCanvasToImageConversion = _ref$disableCanvasToI === undefined ? false : _ref$disableCanvasToI,
                    _ref$l10n = _ref.l10n,
                    l10n = _ref$l10n === undefined ? _ui_utils.NullL10n : _ref$l10n;

                _classCallCheck(this, PDFThumbnailView);

                this.id = id;
                this.renderingId = 'thumbnail' + id;
                this.pageLabel = null;
                this.pdfPage = null;
                this.rotation = 0;
                this.viewport = defaultViewport;
                this.pdfPageRotate = defaultViewport.rotation;
                this.linkService = linkService;
                this.renderingQueue = renderingQueue;
                this.renderTask = null;
                this.renderingState = _pdf_rendering_queue.RenderingStates.INITIAL;
                this.resume = null;
                this.disableCanvasToImageConversion = disableCanvasToImageConversion;
                this.pageWidth = this.viewport.width;
                this.pageHeight = this.viewport.height;
                this.pageRatio = this.pageWidth / this.pageHeight;
                this.canvasWidth = THUMBNAIL_WIDTH;
                this.canvasHeight = this.canvasWidth / this.pageRatio | 0;
                this.scale = this.canvasWidth / this.pageWidth;
                this.l10n = l10n;
                var anchor = document.createElement('a');
                anchor.href = linkService.getAnchorUrl('#page=' + id);
                this.l10n.get('thumb_page_title', {page: id}, 'Page {{page}}').then(function (msg) {
                    anchor.title = msg;
                });
                anchor.onclick = function () {
                    linkService.page = id;
                    return false;
                };
                this.anchor = anchor;
                var div = document.createElement('div');
                div.className = 'thumbnail';
                div.setAttribute('data-page-number', this.id);
                this.div = div;
                if (id === 1) {
                    div.classList.add('selected');
                }
                var ring = document.createElement('div');
                ring.className = 'thumbnailSelectionRing';
                var borderAdjustment = 2 * THUMBNAIL_CANVAS_BORDER_WIDTH;
                ring.style.width = this.canvasWidth + borderAdjustment + 'px';
                ring.style.height = this.canvasHeight + borderAdjustment + 'px';
                this.ring = ring;
                div.appendChild(ring);
                anchor.appendChild(div);
                container.appendChild(anchor);
            }

            _createClass(PDFThumbnailView, [{
                key: 'setPdfPage',
                value: function setPdfPage(pdfPage) {
                    this.pdfPage = pdfPage;
                    this.pdfPageRotate = pdfPage.rotate;
                    var totalRotation = (this.rotation + this.pdfPageRotate) % 360;
                    this.viewport = pdfPage.getViewport(1, totalRotation);
                    this.reset();
                }
            }, {
                key: 'reset',
                value: function reset() {
                    this.cancelRendering();
                    this.pageWidth = this.viewport.width;
                    this.pageHeight = this.viewport.height;
                    this.pageRatio = this.pageWidth / this.pageHeight;
                    this.canvasHeight = this.canvasWidth / this.pageRatio | 0;
                    this.scale = this.canvasWidth / this.pageWidth;
                    this.div.removeAttribute('data-loaded');
                    var ring = this.ring;
                    var childNodes = ring.childNodes;
                    for (var i = childNodes.length - 1; i >= 0; i--) {
                        ring.removeChild(childNodes[i]);
                    }
                    var borderAdjustment = 2 * THUMBNAIL_CANVAS_BORDER_WIDTH;
                    ring.style.width = this.canvasWidth + borderAdjustment + 'px';
                    ring.style.height = this.canvasHeight + borderAdjustment + 'px';
                    if (this.canvas) {
                        this.canvas.width = 0;
                        this.canvas.height = 0;
                        delete this.canvas;
                    }
                    if (this.image) {
                        this.image.removeAttribute('src');
                        delete this.image;
                    }
                }
            }, {
                key: 'update',
                value: function update(rotation) {
                    if (typeof rotation !== 'undefined') {
                        this.rotation = rotation;
                    }
                    var totalRotation = (this.rotation + this.pdfPageRotate) % 360;
                    this.viewport = this.viewport.clone({
                        scale: 1,
                        rotation: totalRotation
                    });
                    this.reset();
                }
            }, {
                key: 'cancelRendering',
                value: function cancelRendering() {
                    if (this.renderTask) {
                        this.renderTask.cancel();
                        this.renderTask = null;
                    }
                    this.renderingState = _pdf_rendering_queue.RenderingStates.INITIAL;
                    this.resume = null;
                }
            }, {
                key: '_getPageDrawContext',
                value: function _getPageDrawContext() {
                    var noCtxScale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

                    var canvas = document.createElement('canvas');
                    this.canvas = canvas;
                    canvas.mozOpaque = true;
                    var ctx = canvas.getContext('2d', {alpha: false});
                    var outputScale = (0, _ui_utils.getOutputScale)(ctx);
                    canvas.width = this.canvasWidth * outputScale.sx | 0;
                    canvas.height = this.canvasHeight * outputScale.sy | 0;
                    canvas.style.width = this.canvasWidth + 'px';
                    canvas.style.height = this.canvasHeight + 'px';
                    if (!noCtxScale && outputScale.scaled) {
                        ctx.scale(outputScale.sx, outputScale.sy);
                    }
                    return ctx;
                }
            }, {
                key: '_convertCanvasToImage',
                value: function _convertCanvasToImage() {
                    var _this = this;

                    if (!this.canvas) {
                        return;
                    }
                    if (this.renderingState !== _pdf_rendering_queue.RenderingStates.FINISHED) {
                        return;
                    }
                    var id = this.renderingId;
                    var className = 'thumbnailImage';
                    if (this.disableCanvasToImageConversion) {
                        this.canvas.id = id;
                        this.canvas.className = className;
                        this.l10n.get('thumb_page_canvas', {page: this.pageId}, 'Thumbnail of Page {{page}}').then(function (msg) {
                            _this.canvas.setAttribute('aria-label', msg);
                        });
                        this.div.setAttribute('data-loaded', true);
                        this.ring.appendChild(this.canvas);
                        return;
                    }
                    var image = document.createElement('img');
                    image.id = id;
                    image.className = className;
                    this.l10n.get('thumb_page_canvas', {page: this.pageId}, 'Thumbnail of Page {{page}}').then(function (msg) {
                        image.setAttribute('aria-label', msg);
                    });
                    image.style.width = this.canvasWidth + 'px';
                    image.style.height = this.canvasHeight + 'px';
                    image.src = this.canvas.toDataURL();
                    this.image = image;
                    this.div.setAttribute('data-loaded', true);
                    this.ring.appendChild(image);
                    this.canvas.width = 0;
                    this.canvas.height = 0;
                    delete this.canvas;
                }
            }, {
                key: 'draw',
                value: function draw() {
                    var _this2 = this;

                    if (this.renderingState !== _pdf_rendering_queue.RenderingStates.INITIAL) {
                        console.error('Must be in new state before drawing');
                        return Promise.resolve(undefined);
                    }
                    this.renderingState = _pdf_rendering_queue.RenderingStates.RUNNING;
                    var renderCapability = (0, _pdfjsLib.createPromiseCapability)();
                    var finishRenderTask = function finishRenderTask(error) {
                        if (renderTask === _this2.renderTask) {
                            _this2.renderTask = null;
                        }
                        if (error === 'cancelled' || error instanceof _pdfjsLib.RenderingCancelledException) {
                            renderCapability.resolve(undefined);
                            return;
                        }
                        _this2.renderingState = _pdf_rendering_queue.RenderingStates.FINISHED;
                        _this2._convertCanvasToImage();
                        if (!error) {
                            renderCapability.resolve(undefined);
                        } else {
                            renderCapability.reject(error);
                        }
                    };
                    var ctx = this._getPageDrawContext();
                    var drawViewport = this.viewport.clone({scale: this.scale});
                    var renderContinueCallback = function renderContinueCallback(cont) {
                        if (!_this2.renderingQueue.isHighestPriority(_this2)) {
                            _this2.renderingState = _pdf_rendering_queue.RenderingStates.PAUSED;
                            _this2.resume = function () {
                                _this2.renderingState = _pdf_rendering_queue.RenderingStates.RUNNING;
                                cont();
                            };
                            return;
                        }
                        cont();
                    };
                    var renderContext = {
                        canvasContext: ctx,
                        viewport: drawViewport
                    };
                    var renderTask = this.renderTask = this.pdfPage.render(renderContext);
                    renderTask.onContinue = renderContinueCallback;
                    renderTask.promise.then(function () {
                        finishRenderTask(null);
                    }, function (error) {
                        finishRenderTask(error);
                    });
                    return renderCapability.promise;
                }
            }, {
                key: 'setImage',
                value: function setImage(pageView) {
                    if (this.renderingState !== _pdf_rendering_queue.RenderingStates.INITIAL) {
                        return;
                    }
                    var img = pageView.canvas;
                    if (!img) {
                        return;
                    }
                    if (!this.pdfPage) {
                        this.setPdfPage(pageView.pdfPage);
                    }
                    this.renderingState = _pdf_rendering_queue.RenderingStates.FINISHED;
                    var ctx = this._getPageDrawContext(true);
                    var canvas = ctx.canvas;
                    if (img.width <= 2 * canvas.width) {
                        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
                        this._convertCanvasToImage();
                        return;
                    }
                    var reducedWidth = canvas.width << MAX_NUM_SCALING_STEPS;
                    var reducedHeight = canvas.height << MAX_NUM_SCALING_STEPS;
                    var reducedImage = TempImageFactory.getCanvas(reducedWidth, reducedHeight);
                    var reducedImageCtx = reducedImage.getContext('2d');
                    while (reducedWidth > img.width || reducedHeight > img.height) {
                        reducedWidth >>= 1;
                        reducedHeight >>= 1;
                    }
                    reducedImageCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, reducedWidth, reducedHeight);
                    while (reducedWidth > 2 * canvas.width) {
                        reducedImageCtx.drawImage(reducedImage, 0, 0, reducedWidth, reducedHeight, 0, 0, reducedWidth >> 1, reducedHeight >> 1);
                        reducedWidth >>= 1;
                        reducedHeight >>= 1;
                    }
                    ctx.drawImage(reducedImage, 0, 0, reducedWidth, reducedHeight, 0, 0, canvas.width, canvas.height);
                    this._convertCanvasToImage();
                }
            }, {
                key: 'setPageLabel',
                value: function setPageLabel(label) {
                    var _this3 = this;

                    this.pageLabel = typeof label === 'string' ? label : null;
                    this.l10n.get('thumb_page_title', {page: this.pageId}, 'Page {{page}}').then(function (msg) {
                        _this3.anchor.title = msg;
                    });
                    if (this.renderingState !== _pdf_rendering_queue.RenderingStates.FINISHED) {
                        return;
                    }
                    this.l10n.get('thumb_page_canvas', {page: this.pageId}, 'Thumbnail of Page {{page}}').then(function (ariaLabel) {
                        if (_this3.image) {
                            _this3.image.setAttribute('aria-label', ariaLabel);
                        } else if (_this3.disableCanvasToImageConversion && _this3.canvas) {
                            _this3.canvas.setAttribute('aria-label', ariaLabel);
                        }
                    });
                }
            }, {
                key: 'pageId',
                get: function get() {
                    return this.pageLabel !== null ? this.pageLabel : this.id;
                }
            }], [{
                key: 'cleanup',
                value: function cleanup() {
                    TempImageFactory.destroyCanvas();
                }
            }]);

            return PDFThumbnailView;
        }();

        exports.PDFThumbnailView = PDFThumbnailView;
    }),
    /* 26 */
    (function (module, exports, __webpack_require__) {

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }

            return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();

        var _ui_utils = __webpack_require__(0);

        var _pdf_thumbnail_view = __webpack_require__(25);

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var THUMBNAIL_SCROLL_MARGIN = -19;

        var PDFThumbnailViewer = function () {
            function PDFThumbnailViewer(_ref) {
                var container = _ref.container,
                    linkService = _ref.linkService,
                    renderingQueue = _ref.renderingQueue,
                    _ref$l10n = _ref.l10n,
                    l10n = _ref$l10n === undefined ? _ui_utils.NullL10n : _ref$l10n;

                _classCallCheck(this, PDFThumbnailViewer);

                this.container = container;
                this.linkService = linkService;
                this.renderingQueue = renderingQueue;
                this.l10n = l10n;
                this.scroll = (0, _ui_utils.watchScroll)(this.container, this._scrollUpdated.bind(this));
                this._resetView();
            }

            _createClass(PDFThumbnailViewer, [{
                key: '_scrollUpdated',
                value: function _scrollUpdated() {
                    this.renderingQueue.renderHighestPriority();
                }
            }, {
                key: 'getThumbnail',
                value: function getThumbnail(index) {
                    return this._thumbnails[index];
                }
            }, {
                key: '_getVisibleThumbs',
                value: function _getVisibleThumbs() {
                    return (0, _ui_utils.getVisibleElements)(this.container, this._thumbnails);
                }
            }, {
                key: 'scrollThumbnailIntoView',
                value: function scrollThumbnailIntoView(page) {
                    var selected = document.querySelector('.thumbnail.selected');
                    if (selected) {
                        selected.classList.remove('selected');
                    }
                    var thumbnail = document.querySelector('div.thumbnail[data-page-number="' + page + '"]');
                    if (thumbnail) {
                        thumbnail.classList.add('selected');
                    }
                    var visibleThumbs = this._getVisibleThumbs();
                    var numVisibleThumbs = visibleThumbs.views.length;
                    if (numVisibleThumbs > 0) {
                        var first = visibleThumbs.first.id;
                        var last = numVisibleThumbs > 1 ? visibleThumbs.last.id : first;
                        if (page <= first || page >= last) {
                            (0, _ui_utils.scrollIntoView)(thumbnail, {top: THUMBNAIL_SCROLL_MARGIN});
                        }
                    }
                }
            }, {
                key: 'cleanup',
                value: function cleanup() {
                    _pdf_thumbnail_view.PDFThumbnailView.cleanup();
                }
            }, {
                key: '_resetView',
                value: function _resetView() {
                    this._thumbnails = [];
                    this._pageLabels = null;
                    this._pagesRotation = 0;
                    this._pagesRequests = [];
                }
            }, {
                key: 'setDocument',
                value: function setDocument(pdfDocument) {
                    var _this = this;

                    if (this.pdfDocument) {
                        this._cancelRendering();
                        this._resetView();
                    }
                    this.pdfDocument = pdfDocument;
                    if (!pdfDocument) {
                        return;
                    }
                    pdfDocument.getPage(1).then(function (firstPage) {
                        var pagesCount = pdfDocument.numPages;
                        var viewport = firstPage.getViewport(1.0);
                        for (var pageNum = 1; pageNum <= pagesCount; ++pageNum) {
                            var thumbnail = new _pdf_thumbnail_view.PDFThumbnailView({
                                container: _this.container,
                                id: pageNum,
                                defaultViewport: viewport.clone(),
                                linkService: _this.linkService,
                                renderingQueue: _this.renderingQueue,
                                disableCanvasToImageConversion: false,
                                l10n: _this.l10n
                            });
                            _this._thumbnails.push(thumbnail);
                        }
                    }).catch(function (reason) {
                    });
                }
            }, {
                key: '_cancelRendering',
                value: function _cancelRendering() {
                    for (var i = 0, ii = this._thumbnails.length; i < ii; i++) {
                        if (this._thumbnails[i]) {
                            this._thumbnails[i].cancelRendering();
                        }
                    }
                }
            }, {
                key: 'setPageLabels',
                value: function setPageLabels(labels) {
                    if (!this.pdfDocument) {
                        return;
                    }
                    if (!labels) {
                        this._pageLabels = null;
                    } else if (!(labels instanceof Array && this.pdfDocument.numPages === labels.length)) {
                        this._pageLabels = null;
                        console.error('PDFThumbnailViewer_setPageLabels: Invalid page labels.');
                    } else {
                        this._pageLabels = labels;
                    }
                    for (var i = 0, ii = this._thumbnails.length; i < ii; i++) {
                        var label = this._pageLabels && this._pageLabels[i];
                        this._thumbnails[i].setPageLabel(label);
                    }
                }
            }, {
                key: '_ensurePdfPageLoaded',
                value: function _ensurePdfPageLoaded(thumbView) {
                    var _this2 = this;

                    if (thumbView.pdfPage) {
                        return Promise.resolve(thumbView.pdfPage);
                    }
                    var pageNumber = thumbView.id;
                    if (this._pagesRequests[pageNumber]) {
                        return this._pagesRequests[pageNumber];
                    }
                    var promise = this.pdfDocument.getPage(pageNumber).then(function (pdfPage) {
                        thumbView.setPdfPage(pdfPage);
                        _this2._pagesRequests[pageNumber] = null;
                        return pdfPage;
                    }).catch(function (reason) {
                        console.error('Unable to get page for thumb view', reason);
                        _this2._pagesRequests[pageNumber] = null;
                    });
                    this._pagesRequests[pageNumber] = promise;
                    return promise;
                }
            }, {
                key: 'forceRendering',
                value: function forceRendering() {
                    var _this3 = this;

                    var visibleThumbs = this._getVisibleThumbs();
                    var thumbView = this.renderingQueue.getHighestPriority(visibleThumbs, this._thumbnails, this.scroll.down);
                    if (thumbView) {
                        this._ensurePdfPageLoaded(thumbView).then(function () {
                            _this3.renderingQueue.renderView(thumbView);
                        });
                        return true;
                    }
                    return false;
                }
            }, {
                key: 'pagesRotation',
                get: function get() {
                    return this._pagesRotation;
                },
                set: function set(rotation) {
                    if (!(typeof rotation === 'number' && rotation % 90 === 0)) {
                        throw new Error('Invalid thumbnails rotation angle.');
                    }
                    if (!this.pdfDocument) {
                        return;
                    }
                    this._pagesRotation = rotation;
                    for (var i = 0, ii = this._thumbnails.length; i < ii; i++) {
                        this._thumbnails[i].update(rotation);
                    }
                }
            }]);

            return PDFThumbnailViewer;
        }();

        exports.PDFThumbnailViewer = PDFThumbnailViewer;

    }),
    /* 27 */
    (function (module, exports, __webpack_require__) {

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }

            return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();

        var _pdfjsLib = __webpack_require__(1);

        var _ui_utils = __webpack_require__(0);

        var _pdf_rendering_queue = __webpack_require__(3);

        var _annotation_layer_builder = __webpack_require__(11);

        var _dom_events = __webpack_require__(2);

        var _pdf_page_view = __webpack_require__(22);

        var _pdf_link_service = __webpack_require__(5);


        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var PresentationModeState = {
            UNKNOWN: 0,
            NORMAL: 1,
            CHANGING: 2,
        };
        var DEFAULT_CACHE_SIZE = 10;

        function PDFPageViewBuffer(size) {
            var data = [];
            this.push = function cachePush(view) {
                var i = data.indexOf(view);
                if (i >= 0) {
                    data.splice(i, 1);
                }
                data.push(view);
                if (data.length > size) {
                    data.shift().destroy();
                }
            };
            this.resize = function (newSize) {
                size = newSize;
                while (data.length > size) {
                    data.shift().destroy();
                }
            };
        }

        function isSameScale(oldScale, newScale) {
            if (newScale === oldScale) {
                return true;
            }
            if (Math.abs(newScale - oldScale) < 1e-15) {
                return true;
            }
            return false;
        }

        function isPortraitOrientation(size) {
            return size.width <= size.height;
        }

        var PDFViewer = function () {
            function PDFViewer(options) {
                _classCallCheck(this, PDFViewer);

                this.container = options.container;
                this.viewer = options.viewer || options.container.firstElementChild;
                this.eventBus = options.eventBus || (0, _dom_events.getGlobalEventBus)();
                this.linkService = options.linkService || new _pdf_link_service.SimpleLinkService();
                this.removePageBorders = options.removePageBorders || false;
                this.enhanceTextSelection = options.enhanceTextSelection || false;
                this.renderInteractiveForms = options.renderInteractiveForms || false;
                this.enablePrintAutoRotate = options.enablePrintAutoRotate || false;
                this.renderer = options.renderer || _ui_utils.RendererType.CANVAS;
                this.l10n = options.l10n || _ui_utils.NullL10n;
                this.defaultRenderingQueue = !options.renderingQueue;
                if (this.defaultRenderingQueue) {
                    this.renderingQueue = new _pdf_rendering_queue.PDFRenderingQueue();
                    this.renderingQueue.setViewer(this);
                } else {
                    this.renderingQueue = options.renderingQueue;
                }
                this.scroll = (0, _ui_utils.watchScroll)(this.container, this._scrollUpdate.bind(this));
                this.presentationModeState = PresentationModeState.UNKNOWN;
                this._resetView();
                if (this.removePageBorders) {
                    this.viewer.classList.add('removePageBorders');
                }
            }

            _createClass(PDFViewer, [{
                key: 'getPageView',
                value: function getPageView(index) {
                    return this._pages[index];
                }
            }, {
                key: '_setCurrentPageNumber',
                value: function _setCurrentPageNumber(val) {
                    var resetCurrentPageView = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

                    if (this._currentPageNumber === val) {
                        if (resetCurrentPageView) {
                            this._resetCurrentPageView();
                        }
                        return;
                    }
                    if (!(0 < val && val <= this.pagesCount)) {
                        console.error('PDFViewer._setCurrentPageNumber: "' + val + '" is out of bounds.');
                        return;
                    }
                    var arg = {
                        source: this,
                        pageNumber: val,
                        pageLabel: this._pageLabels && this._pageLabels[val - 1]
                    };
                    this._currentPageNumber = val;
                    this.eventBus.dispatch('pagechanging', arg);
                    this.eventBus.dispatch('pagechange', arg);
                    if (resetCurrentPageView) {
                        this._resetCurrentPageView();
                    }
                }
            }, {
                key: 'setDocument',
                value: function setDocument(pdfDocument) {
                    var _this = this;

                    if (this.pdfDocument) {
                        this._cancelRendering();
                        this._resetView();
                    }
                    this.pdfDocument = pdfDocument;
                    if (!pdfDocument) {
                        return;
                    }
                    var pagesCount = pdfDocument.numPages;
                    var pagesCapability = (0, _pdfjsLib.createPromiseCapability)();
                    this.pagesPromise = pagesCapability.promise;
                    pagesCapability.promise.then(function () {
                        _this._pageViewsReady = true;
                        _this.eventBus.dispatch('pagesloaded', {
                            source: _this,
                            pagesCount: pagesCount
                        });
                    });
                    var isOnePageRenderedResolved = false;
                    var onePageRenderedCapability = (0, _pdfjsLib.createPromiseCapability)();
                    this.onePageRendered = onePageRenderedCapability.promise;
                    var bindOnAfterAndBeforeDraw = function bindOnAfterAndBeforeDraw(pageView) {
                        pageView.onBeforeDraw = function () {
                            _this._buffer.push(pageView);
                        };
                        pageView.onAfterDraw = function () {
                            if (!isOnePageRenderedResolved) {
                                isOnePageRenderedResolved = true;
                                onePageRenderedCapability.resolve();
                            }
                        };
                    };
                    var firstPagePromise = pdfDocument.getPage(1);
                    this.firstPagePromise = firstPagePromise;
                    firstPagePromise.then(function (pdfPage) {
                        var scale = _this.currentScale;
                        var viewport = pdfPage.getViewport(scale * _ui_utils.CSS_UNITS);
                        for (var pageNum = 1; pageNum <= pagesCount; ++pageNum) {
                            var pageView = new _pdf_page_view.PDFPageView({
                                container: _this.viewer,
                                eventBus: _this.eventBus,
                                id: pageNum,
                                scale: scale,
                                defaultViewport: viewport.clone(),
                                renderingQueue: _this.renderingQueue,
                                annotationLayerFactory: _this,
                                enhanceTextSelection: _this.enhanceTextSelection,
                                renderInteractiveForms: _this.renderInteractiveForms,
                                renderer: _this.renderer,
                                l10n: _this.l10n
                            });
                            bindOnAfterAndBeforeDraw(pageView);
                            _this._pages.push(pageView);
                        }
                        onePageRenderedCapability.promise.then(function () {
                            if (_pdfjsLib.PDFJS.disableAutoFetch) {
                                pagesCapability.resolve();
                                return;
                            }
                            var getPagesLeft = pagesCount;

                            var _loop = function _loop(_pageNum) {
                                pdfDocument.getPage(_pageNum).then(function (pdfPage) {
                                    var pageView = _this._pages[_pageNum - 1];
                                    if (!pageView.pdfPage) {
                                        pageView.setPdfPage(pdfPage);
                                    }
                                    _this.linkService.cachePageRef(_pageNum, pdfPage.ref);
                                    if (--getPagesLeft === 0) {
                                        pagesCapability.resolve();
                                    }
                                }, function (reason) {
                                    console.error('Unable to get page ' + _pageNum + ' to initialize viewer', reason);
                                    if (--getPagesLeft === 0) {
                                        pagesCapability.resolve();
                                    }
                                });
                            };

                            for (var _pageNum = 1; _pageNum <= pagesCount; ++_pageNum) {
                                _loop(_pageNum);
                            }
                        });
                        _this.eventBus.dispatch('pagesinit', {source: _this});
                        if (_this.defaultRenderingQueue) {
                            _this.update();
                        }
                    }).catch(function (reason) {
                        console.error('Unable to initialize viewer', reason);
                    });
                }
            }, {
                key: 'setPageLabels',
                value: function setPageLabels(labels) {
                    if (!this.pdfDocument) {
                        return;
                    }
                    if (!labels) {
                        this._pageLabels = null;
                    } else if (!(labels instanceof Array && this.pdfDocument.numPages === labels.length)) {
                        this._pageLabels = null;
                        console.error('PDFViewer.setPageLabels: Invalid page labels.');
                    } else {
                        this._pageLabels = labels;
                    }
                    for (var i = 0, ii = this._pages.length; i < ii; i++) {
                        var pageView = this._pages[i];
                        var label = this._pageLabels && this._pageLabels[i];
                        pageView.setPageLabel(label);
                    }
                }
            }, {
                key: '_resetView',
                value: function _resetView() {
                    this._pages = [];
                    this._currentPageNumber = 1;
                    this._currentScale = _ui_utils.UNKNOWN_SCALE;
                    this._currentScaleValue = null;
                    this._pageLabels = null;
                    this._buffer = new PDFPageViewBuffer(DEFAULT_CACHE_SIZE);
                    this._location = null;
                    this._pagesRotation = 0;
                    this._pagesRequests = [];
                    this._pageViewsReady = false;
                    this.viewer.textContent = '';
                }
            }, {
                key: '_scrollUpdate',
                value: function _scrollUpdate() {
                    if (this.pagesCount === 0) {
                        return;
                    }
                    this.update();
                }
            }, {
                key: '_setScaleDispatchEvent',
                value: function _setScaleDispatchEvent(newScale, newValue) {
                    var preset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

                    var arg = {
                        source: this,
                        scale: newScale,
                        presetValue: preset ? newValue : undefined
                    };
                    this.eventBus.dispatch('scalechanging', arg);
                    this.eventBus.dispatch('scalechange', arg);
                }
            }, {
                key: '_setScaleUpdatePages',
                value: function _setScaleUpdatePages(newScale, newValue) {
                    var noScroll = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
                    var preset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

                    this._currentScaleValue = newValue.toString();
                    if (isSameScale(this._currentScale, newScale)) {
                        if (preset) {
                            this._setScaleDispatchEvent(newScale, newValue, true);
                        }
                        return;
                    }
                    for (var i = 0, ii = this._pages.length; i < ii; i++) {
                        this._pages[i].update(newScale);
                    }
                    this._currentScale = newScale;
                    if (!noScroll) {
                        var page = this._currentPageNumber,
                            dest = void 0;
                        if (this._location && !_pdfjsLib.PDFJS.ignoreCurrentPositionOnZoom && !(this.isInPresentationMode || this.isChangingPresentationMode)) {
                            page = this._location.pageNumber;
                            dest = [null, {name: 'XYZ'}, this._location.left, this._location.top, null];
                        }
                        this.scrollPageIntoView({
                            pageNumber: page,
                            destArray: dest,
                            allowNegativeOffset: true
                        });
                    }
                    this._setScaleDispatchEvent(newScale, newValue, preset);
                    if (this.defaultRenderingQueue) {
                        this.update();
                    }
                }
            }, {
                key: '_setScale',
                value: function _setScale(value) {
                    var noScroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

                    var scale = parseFloat(value);
                    if (scale > 0) {
                        this._setScaleUpdatePages(scale, value, noScroll, false);
                    } else {
                        var currentPage = this._pages[this._currentPageNumber - 1];
                        if (!currentPage) {
                            return;
                        }
                        var hPadding = this.isInPresentationMode || this.removePageBorders ? 0 : _ui_utils.SCROLLBAR_PADDING;
                        var vPadding = this.isInPresentationMode || this.removePageBorders ? 0 : _ui_utils.VERTICAL_PADDING;
                        var pageWidthScale = (this.container.clientWidth - hPadding) / currentPage.width * currentPage.scale;
                        var pageHeightScale = (this.container.clientHeight - vPadding) / currentPage.height * currentPage.scale;
                        switch (value) {
                            case 'page-actual':
                                scale = 1;
                                break;
                            case 'page-width':
                                scale = pageWidthScale;
                                break;
                            case 'page-height':
                                scale = pageHeightScale;
                                break;
                            case 'page-fit':
                                scale = Math.min(pageWidthScale, pageHeightScale);
                                break;
                            case 'auto':
                                var isLandscape = currentPage.width > currentPage.height;
                                var horizontalScale = isLandscape ? Math.min(pageHeightScale, pageWidthScale) : pageWidthScale;
                                scale = Math.min(_ui_utils.MAX_AUTO_SCALE, horizontalScale);
                                break;
                            default:
                                console.error('PDFViewer._setScale: "' + value + '" is an unknown zoom value.');
                                return;
                        }
                        this._setScaleUpdatePages(scale, value, noScroll, true);
                    }
                }
            }, {
                key: '_resetCurrentPageView',
                value: function _resetCurrentPageView() {
                    if (this.isInPresentationMode) {
                        this._setScale(this._currentScaleValue, true);
                    }
                    var pageView = this._pages[this._currentPageNumber - 1];
                    (0, _ui_utils.scrollIntoView)(pageView.div);
                }
            }, {
                key: 'scrollPageIntoView',
                value: function scrollPageIntoView(params) {
                    if (!this.pdfDocument) {
                        return;
                    }
                    if (arguments.length > 1 || typeof params === 'number') {
                        console.warn('Call of scrollPageIntoView() with obsolete signature.');
                        var paramObj = {};
                        if (typeof params === 'number') {
                            paramObj.pageNumber = params;
                        }
                        if (arguments[1] instanceof Array) {
                            paramObj.destArray = arguments[1];
                        }
                        params = paramObj;
                    }
                    var pageNumber = params.pageNumber || 0;
                    var dest = params.destArray || null;
                    var allowNegativeOffset = params.allowNegativeOffset || false;
                    if (this.isInPresentationMode || !dest) {
                        this._setCurrentPageNumber(pageNumber, true);
                        return;
                    }
                    var pageView = this._pages[pageNumber - 1];
                    if (!pageView) {
                        console.error('PDFViewer.scrollPageIntoView: Invalid "pageNumber" parameter.');
                        return;
                    }
                    var x = 0,
                        y = 0;
                    var width = 0,
                        height = 0,
                        widthScale = void 0,
                        heightScale = void 0;
                    var changeOrientation = pageView.rotation % 180 === 0 ? false : true;
                    var pageWidth = (changeOrientation ? pageView.height : pageView.width) / pageView.scale / _ui_utils.CSS_UNITS;
                    var pageHeight = (changeOrientation ? pageView.width : pageView.height) / pageView.scale / _ui_utils.CSS_UNITS;
                    var scale = 0;
                    switch (dest[1].name) {
                        case 'XYZ':
                            x = dest[2];
                            y = dest[3];
                            scale = dest[4];
                            x = x !== null ? x : 0;
                            y = y !== null ? y : pageHeight;
                            break;
                        case 'Fit':
                        case 'FitB':
                            scale = 'page-fit';
                            break;
                        case 'FitH':
                        case 'FitBH':
                            y = dest[2];
                            scale = 'page-width';
                            if (y === null && this._location) {
                                x = this._location.left;
                                y = this._location.top;
                            }
                            break;
                        case 'FitV':
                        case 'FitBV':
                            x = dest[2];
                            width = pageWidth;
                            height = pageHeight;
                            scale = 'page-height';
                            break;
                        case 'FitR':
                            x = dest[2];
                            y = dest[3];
                            width = dest[4] - x;
                            height = dest[5] - y;
                            var hPadding = this.removePageBorders ? 0 : _ui_utils.SCROLLBAR_PADDING;
                            var vPadding = this.removePageBorders ? 0 : _ui_utils.VERTICAL_PADDING;
                            widthScale = (this.container.clientWidth - hPadding) / width / _ui_utils.CSS_UNITS;
                            heightScale = (this.container.clientHeight - vPadding) / height / _ui_utils.CSS_UNITS;
                            scale = Math.min(Math.abs(widthScale), Math.abs(heightScale));
                            break;
                        default:
                            console.error('PDFViewer.scrollPageIntoView: "' + dest[1].name + '" ' + 'is not a valid destination type.');
                            return;
                    }
                    if (scale && scale !== this._currentScale) {
                        this.currentScaleValue = scale;
                    } else if (this._currentScale === _ui_utils.UNKNOWN_SCALE) {
                        this.currentScaleValue = _ui_utils.DEFAULT_SCALE_VALUE;
                    }
                    if (scale === 'page-fit' && !dest[4]) {
                        (0, _ui_utils.scrollIntoView)(pageView.div);
                        return;
                    }
                    var boundingRect = [pageView.viewport.convertToViewportPoint(x, y), pageView.viewport.convertToViewportPoint(x + width, y + height)];
                    var left = Math.min(boundingRect[0][0], boundingRect[1][0]);
                    var top = Math.min(boundingRect[0][1], boundingRect[1][1]);
                    if (!allowNegativeOffset) {
                        left = Math.max(left, 0);
                        top = Math.max(top, 0);
                    }
                    (0, _ui_utils.scrollIntoView)(pageView.div, {
                        left: left,
                        top: top
                    });
                }
            }, {
                key: '_updateLocation',
                value: function _updateLocation(firstPage) {
                    var currentScale = this._currentScale;
                    var currentScaleValue = this._currentScaleValue;
                    var normalizedScaleValue = parseFloat(currentScaleValue) === currentScale ? Math.round(currentScale * 10000) / 100 : currentScaleValue;
                    var pageNumber = firstPage.id;
                    var pdfOpenParams = '#page=' + pageNumber;
                    pdfOpenParams += '&zoom=' + normalizedScaleValue;
                    var currentPageView = this._pages[pageNumber - 1];
                    var container = this.container;
                    var topLeft = currentPageView.getPagePoint(container.scrollLeft - firstPage.x, container.scrollTop - firstPage.y);
                    var intLeft = Math.round(topLeft[0]);
                    var intTop = Math.round(topLeft[1]);
                    pdfOpenParams += ',' + intLeft + ',' + intTop;
                    this._location = {
                        pageNumber: pageNumber,
                        scale: normalizedScaleValue,
                        top: intTop,
                        left: intLeft,
                        pdfOpenParams: pdfOpenParams
                    };
                }
            }, {
                key: 'update',
                value: function update() {
                    var visible = this._getVisiblePages();
                    var visiblePages = visible.views;
                    if (visiblePages.length === 0) {
                        return;
                    }
                    var suggestedCacheSize = Math.max(DEFAULT_CACHE_SIZE, 2 * visiblePages.length + 1);
                    this._buffer.resize(suggestedCacheSize);
                    this.renderingQueue.renderHighestPriority(visible);
                    var currentId = this._currentPageNumber;
                    var firstPage = visible.first;
                    var stillFullyVisible = false;
                    for (var i = 0, ii = visiblePages.length; i < ii; ++i) {
                        var page = visiblePages[i];
                        if (page.percent < 100) {
                            break;
                        }
                        if (page.id === currentId) {
                            stillFullyVisible = true;
                            break;
                        }
                    }
                    if (!stillFullyVisible) {
                        currentId = visiblePages[0].id;
                    }
                    if (!this.isInPresentationMode) {
                        this._setCurrentPageNumber(currentId);
                    }
                    this._updateLocation(firstPage);
                    this.eventBus.dispatch('updateviewarea', {
                        source: this,
                        location: this._location
                    });
                }
            }, {
                key: 'containsElement',
                value: function containsElement(element) {
                    return this.container.contains(element);
                }
            }, {
                key: 'focus',
                value: function focus() {
                    this.container.focus();
                }
            }, {
                key: '_getVisiblePages',
                value: function _getVisiblePages() {
                    if (!this.isInPresentationMode) {
                        return (0, _ui_utils.getVisibleElements)(this.container, this._pages, true);
                    }
                    var visible = [];
                    var currentPage = this._pages[this._currentPageNumber - 1];
                    visible.push({
                        id: currentPage.id,
                        view: currentPage
                    });
                    return {
                        first: currentPage,
                        last: currentPage,
                        views: visible
                    };
                }
            }, {
                key: 'cleanup',
                value: function cleanup() {
                    for (var i = 0, ii = this._pages.length; i < ii; i++) {
                        if (this._pages[i] && this._pages[i].renderingState !== _pdf_rendering_queue.RenderingStates.FINISHED) {
                            this._pages[i].reset();
                        }
                    }
                }
            }, {
                key: '_cancelRendering',
                value: function _cancelRendering() {
                    for (var i = 0, ii = this._pages.length; i < ii; i++) {
                        if (this._pages[i]) {
                            this._pages[i].cancelRendering();
                        }
                    }
                }
            }, {
                key: '_ensurePdfPageLoaded',
                value: function _ensurePdfPageLoaded(pageView) {
                    var _this2 = this;

                    if (pageView.pdfPage) {
                        return Promise.resolve(pageView.pdfPage);
                    }
                    var pageNumber = pageView.id;
                    if (this._pagesRequests[pageNumber]) {
                        return this._pagesRequests[pageNumber];
                    }
                    var promise = this.pdfDocument.getPage(pageNumber).then(function (pdfPage) {
                        if (!pageView.pdfPage) {
                            pageView.setPdfPage(pdfPage);
                        }
                        _this2._pagesRequests[pageNumber] = null;
                        return pdfPage;
                    }).catch(function (reason) {
                        console.error('Unable to get page for page view', reason);
                        _this2._pagesRequests[pageNumber] = null;
                    });
                    this._pagesRequests[pageNumber] = promise;
                    return promise;
                }
            }, {
                key: 'forceRendering',
                value: function forceRendering(currentlyVisiblePages) {
                    var _this3 = this;

                    var visiblePages = currentlyVisiblePages || this._getVisiblePages();
                    var pageView = this.renderingQueue.getHighestPriority(visiblePages, this._pages, this.scroll.down);
                    if (pageView) {
                        this._ensurePdfPageLoaded(pageView).then(function () {
                            _this3.renderingQueue.renderView(pageView);
                        });
                        return true;
                    }
                    return false;
                }
            }, {
                key: 'getPageTextContent',
                value: function getPageTextContent(pageIndex) {
                    return this.pdfDocument.getPage(pageIndex + 1).then(function (page) {
                        return page.getTextContent({normalizeWhitespace: true});
                    });
                }
            },
                {
                    key: 'createAnnotationLayerBuilder',
                    value: function createAnnotationLayerBuilder(pageDiv, pdfPage) {
                        var renderInteractiveForms = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
                        var l10n = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _ui_utils.NullL10n;

                        return new _annotation_layer_builder.AnnotationLayerBuilder({
                            pageDiv: pageDiv,
                            pdfPage: pdfPage,
                            renderInteractiveForms: renderInteractiveForms,
                            linkService: this.linkService,
                            l10n: l10n
                        });
                    }
                },  {
                    key: 'getPagesOverview',
                    value: function getPagesOverview() {
                        var pagesOverview = this._pages.map(function (pageView) {
                            var viewport = pageView.pdfPage.getViewport(1);
                            return {
                                width: viewport.width,
                                height: viewport.height,
                                rotation: viewport.rotation
                            };
                        });
                        if (!this.enablePrintAutoRotate) {
                            return pagesOverview;
                        }
                        var isFirstPagePortrait = isPortraitOrientation(pagesOverview[0]);
                        return pagesOverview.map(function (size) {
                            if (isFirstPagePortrait === isPortraitOrientation(size)) {
                                return size;
                            }
                            return {
                                width: size.height,
                                height: size.width,
                                rotation: (size.rotation + 90) % 360
                            };
                        });
                    }
                }, {
                    key: 'pagesCount',
                    get: function get() {
                        return this._pages.length;
                    }
                }, {
                    key: 'pageViewsReady',
                    get: function get() {
                        return this._pageViewsReady;
                    }
                }, {
                    key: 'currentPageNumber',
                    get: function get() {
                        return this._currentPageNumber;
                    },
                    set: function set(val) {
                        if ((val | 0) !== val) {
                            throw new Error('Invalid page number.');
                        }
                        if (!this.pdfDocument) {
                            return;
                        }
                        this._setCurrentPageNumber(val, true);
                    }
                }, {
                    key: 'currentPageLabel',
                    get: function get() {
                        return this._pageLabels && this._pageLabels[this._currentPageNumber - 1];
                    },
                    set: function set(val) {
                        var pageNumber = val | 0;
                        if (this._pageLabels) {
                            var i = this._pageLabels.indexOf(val);
                            if (i >= 0) {
                                pageNumber = i + 1;
                            }
                        }
                        this.currentPageNumber = pageNumber;
                    }
                }, {
                    key: 'currentScale',
                    get: function get() {
                        return this._currentScale !== _ui_utils.UNKNOWN_SCALE ? this._currentScale : _ui_utils.DEFAULT_SCALE;
                    },
                    set: function set(val) {
                        if (isNaN(val)) {
                            throw new Error('Invalid numeric scale');
                        }
                        if (!this.pdfDocument) {
                            return;
                        }
                        this._setScale(val, false);
                    }
                }, {
                    key: 'currentScaleValue',
                    get: function get() {
                        return this._currentScaleValue;
                    },
                    set: function set(val) {
                        if (!this.pdfDocument) {
                            return;
                        }
                        this._setScale(val, false);
                    }
                }, {
                    key: 'pagesRotation',
                    get: function get() {
                        return this._pagesRotation;
                    },
                    set: function set(rotation) {
                        if (!(typeof rotation === 'number' && rotation % 90 === 0)) {
                            throw new Error('Invalid pages rotation angle.');
                        }
                        if (!this.pdfDocument) {
                            return;
                        }
                        this._pagesRotation = rotation;
                        for (var i = 0, ii = this._pages.length; i < ii; i++) {
                            var pageView = this._pages[i];
                            pageView.update(pageView.scale, rotation);
                        }
                        this._setScale(this._currentScaleValue, true);
                        if (this.defaultRenderingQueue) {
                            this.update();
                        }
                    }
                }, {
                    key: 'isChangingPresentationMode',
                    get: function get() {
                        return this.presentationModeState === PresentationModeState.CHANGING;
                    }
                }, {
                    key: 'isHorizontalScrollbarEnabled',
                    get: function get() {
                        return this.isInPresentationMode ? false : this.container.scrollWidth > this.container.clientWidth;
                    }
                }, {
                    key: 'hasEqualPageSizes',
                    get: function get() {
                        var firstPageView = this._pages[0];
                        for (var i = 1, ii = this._pages.length; i < ii; ++i) {
                            var pageView = this._pages[i];
                            if (pageView.width !== firstPageView.width || pageView.height !== firstPageView.height) {
                                return false;
                            }
                        }
                        return true;
                    }
                }]);

            return PDFViewer;
        }();

        exports.PDFViewer = PDFViewer;
    }),
    /* 28 */
    (function (module, exports, __webpack_require__) {

        var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
            return typeof obj;
        } : function (obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }

            return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();

        var _ui_utils = __webpack_require__(0);

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var defaultPreferences = null;

        function getDefaultPreferences() {
            if (!defaultPreferences) {
                defaultPreferences = Promise.resolve({
                    "showPreviousViewOnLoad": true,
                    "defaultZoomValue": "",
                    "sidebarViewOnLoad": 0,
                    "enableHandToolOnLoad": false,
                    "cursorToolOnLoad": 0,
                    "enableWebGL": false,
                    "pdfBugEnabled": false,
                    "disableRange": false,
                    "disableStream": false,
                    "disableAutoFetch": false,
                    "disableFontFace": false,
                    "useOnlyCssZoom": false,
                    "externalLinkTarget": 0,
                    "enhanceTextSelection": false,
                    "renderer": "canvas",
                    "renderInteractiveForms": false,
                    "enablePrintAutoRotate": false,
                    "disablePageMode": false,
                    "disablePageLabels": false
                });
            }
            return defaultPreferences;
        }

        var BasePreferences = function () {
            function BasePreferences() {
                var _this = this;

                _classCallCheck(this, BasePreferences);

                if (this.constructor === BasePreferences) {
                    throw new Error('Cannot initialize BasePreferences.');
                }
                this.prefs = null;
                this._initializedPromise = getDefaultPreferences().then(function (defaults) {
                    Object.defineProperty(_this, 'defaults', {
                        value: Object.freeze(defaults),
                        writable: false,
                        enumerable: true,
                        configurable: false
                    });
                    _this.prefs = (0, _ui_utils.cloneObj)(defaults);
                    return _this._readFromStorage(defaults);
                }).then(function (prefObj) {
                    if (prefObj) {
                        _this.prefs = prefObj;
                    }
                });
            }

            _createClass(BasePreferences, [{
                key: "_writeToStorage",
                value: function _writeToStorage(prefObj) {
                    return Promise.reject(new Error('Not implemented: _writeToStorage'));
                }
            }, {
                key: "_readFromStorage",
                value: function _readFromStorage(prefObj) {
                    return Promise.reject(new Error('Not implemented: _readFromStorage'));
                }
            }, {
                key: "reset",
                value: function reset() {
                    var _this2 = this;

                    return this._initializedPromise.then(function () {
                        _this2.prefs = (0, _ui_utils.cloneObj)(_this2.defaults);
                        return _this2._writeToStorage(_this2.defaults);
                    });
                }
            }, {
                key: "reload",
                value: function reload() {
                    var _this3 = this;

                    return this._initializedPromise.then(function () {
                        return _this3._readFromStorage(_this3.defaults);
                    }).then(function (prefObj) {
                        if (prefObj) {
                            _this3.prefs = prefObj;
                        }
                    });
                }
            }, {
                key: "set",
                value: function set(name, value) {
                    var _this4 = this;

                    return this._initializedPromise.then(function () {
                        if (_this4.defaults[name] === undefined) {
                            throw new Error("Set preference: \"" + name + "\" is undefined.");
                        } else if (value === undefined) {
                            throw new Error('Set preference: no value is specified.');
                        }
                        var valueType = typeof value === "undefined" ? "undefined" : _typeof(value);
                        var defaultType = _typeof(_this4.defaults[name]);
                        if (valueType !== defaultType) {
                            if (valueType === 'number' && defaultType === 'string') {
                                value = value.toString();
                            } else {
                                throw new Error("Set preference: \"" + value + "\" is a " + valueType + ", " + ("expected a " + defaultType + "."));
                            }
                        } else {
                            if (valueType === 'number' && (value | 0) !== value) {
                                throw new Error("Set preference: \"" + value + "\" must be an integer.");
                            }
                        }
                        _this4.prefs[name] = value;
                        return _this4._writeToStorage(_this4.prefs);
                    });
                }
            }, {
                key: "get",
                value: function get(name) {
                    var _this5 = this;

                    return this._initializedPromise.then(function () {
                        var defaultValue = _this5.defaults[name];
                        if (defaultValue === undefined) {
                            throw new Error("Get preference: \"" + name + "\" is undefined.");
                        } else {
                            var prefValue = _this5.prefs[name];
                            if (prefValue !== undefined) {
                                return prefValue;
                            }
                        }
                        return defaultValue;
                    });
                }
            }]);

            return BasePreferences;
        }();

        exports.BasePreferences = BasePreferences;

    }),
    /* 29 */
    /***/ (function (module, exports, __webpack_require__) {

    }),
    /* 30 */
     (function (module, exports, __webpack_require__) {

    }),
    /* 31 */
    /***/ (function (module, exports, __webpack_require__) {

        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }

            return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();

        var _ui_utils = __webpack_require__(0);

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var PAGE_NUMBER_LOADING_INDICATOR = 'visiblePageIsLoading';

        var Toolbar = function () {
            function Toolbar(options, mainContainer, eventBus) {
                var l10n = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _ui_utils.NullL10n;

                _classCallCheck(this, Toolbar);

                this.toolbar = options.container;
                this.mainContainer = mainContainer;
                this.eventBus = eventBus;
                this.l10n = l10n;
                this.items = options;
                this._wasLocalized = false;
                this.reset();
                this._bindListeners();
            }

            _createClass(Toolbar, [{
                key: 'setPageNumber',
                value: function setPageNumber(pageNumber, pageLabel) {
                    this.pageNumber = pageNumber;
                    this.pageLabel = pageLabel;
                    this._updateUIState(false);
                }
            }, {
                key: 'setPagesCount',
                value: function setPagesCount(pagesCount, hasPageLabels) {
                    this.pagesCount = pagesCount;
                    this.hasPageLabels = hasPageLabels;
                    this._updateUIState(true);
                }
            }, {
                key: 'setPageScale',
                value: function setPageScale(pageScaleValue, pageScale) {
                    this.pageScaleValue = pageScaleValue;
                    this.pageScale = pageScale;
                    this._updateUIState(false);
                }
            }, {
                key: 'reset',
                value: function reset() {
                    this.pageNumber = 0;
                    this.pageLabel = null;
                    this.hasPageLabels = false;
                    this.pagesCount = 0;
                    this.pageScaleValue = _ui_utils.DEFAULT_SCALE_VALUE;
                    this.pageScale = _ui_utils.DEFAULT_SCALE;
                    this._updateUIState(true);
                }
            }, {
                key: '_bindListeners',
                value: function _bindListeners() {
                    var _this = this;

                    var eventBus = this.eventBus,
                        items = this.items;

                    var self = this;
                    items.previous.addEventListener('click', function () {
                        eventBus.dispatch('previouspage');
                    });
                    items.next.addEventListener('click', function () {
                        eventBus.dispatch('nextpage');
                    });
                    items.pageNumber.addEventListener('click', function () {
                        this.select();
                    });
                    items.pageNumber.addEventListener('change', function () {
                        eventBus.dispatch('pagenumberchanged', {
                            source: self,
                            value: this.value
                        });
                    });
                    eventBus.on('localized', function () {
                        _this._localized();
                    });
                }
            }, {
                key: '_localized',
                value: function _localized() {
                    this._wasLocalized = true;
                    this._updateUIState(true);
                }
            }, {
                key: '_updateUIState',
                value: function _updateUIState() {
                    var resetNumPages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

                    if (!this._wasLocalized) {
                        return;
                    }
                    var pageNumber = this.pageNumber,
                        pagesCount = this.pagesCount,
                        items = this.items;

                    var scaleValue = (this.pageScaleValue || this.pageScale).toString();
                    var scale = this.pageScale;
                    if (resetNumPages) {
                        items.pageNumber.type = 'number';
                        this.l10n.get('of_pages', {pagesCount: pagesCount}, 'of {{pagesCount}}').then(function (msg) {
                            items.numPages.textContent = msg;
                        });
                        items.pageNumber.max = pagesCount;
                    }
                    if (this.hasPageLabels) {
                        items.pageNumber.value = this.pageLabel;
                        this.l10n.get('page_of_pages', {
                            pageNumber: pageNumber,
                            pagesCount: pagesCount
                        }, '({{pageNumber}} of {{pagesCount}})').then(function (msg) {
                            items.numPages.textContent = msg;
                        });
                    } else {
                        items.pageNumber.value = pageNumber;
                    }
                    items.previous.disabled = pageNumber <= 1;
                    items.next.disabled = pageNumber >= pagesCount;
                    var customScale = Math.round(scale * 10000) / 100;
                    this.l10n.get('page_scale_percent', {scale: customScale}, '{{scale}}%').then(function (msg) {
                        var predefinedValueFound = false;
                    });
                }
            }, {
                key: 'updateLoadingIndicatorState',
                value: function updateLoadingIndicatorState() {
                    var loading = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

                    var pageNumberInput = this.items.pageNumber;
                    if (loading) {
                        pageNumberInput.classList.add(PAGE_NUMBER_LOADING_INDICATOR);
                    } else {
                        pageNumberInput.classList.remove(PAGE_NUMBER_LOADING_INDICATOR);
                    }
                }
            }]);

            return Toolbar;
        }();

        exports.Toolbar = Toolbar;

        /***/
    }),
    /* 32 */
    /***/ (function (module, exports, __webpack_require__) {


        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }

            return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        var DEFAULT_VIEW_HISTORY_CACHE_SIZE = 20;

        var ViewHistory = function () {
            function ViewHistory(fingerprint) {
                var _this = this;

                var cacheSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_VIEW_HISTORY_CACHE_SIZE;

                _classCallCheck(this, ViewHistory);

                this.fingerprint = fingerprint;
                this.cacheSize = cacheSize;
                this._initializedPromise = this._readFromStorage().then(function (databaseStr) {
                    var database = JSON.parse(databaseStr || '{}');
                    if (!('files' in database)) {
                        database.files = [];
                    }
                    if (database.files.length >= _this.cacheSize) {
                        database.files.shift();
                    }
                    var index = void 0;
                    for (var i = 0, length = database.files.length; i < length; i++) {
                        var branch = database.files[i];
                        if (branch.fingerprint === _this.fingerprint) {
                            index = i;
                            break;
                        }
                    }
                    if (typeof index !== 'number') {
                        index = database.files.push({fingerprint: _this.fingerprint}) - 1;
                    }
                    _this.file = database.files[index];
                    _this.database = database;
                });
            }

            _createClass(ViewHistory, [{
                key: '_readFromStorage',
                value: function _readFromStorage() {
                    return new Promise(function (resolve) {
                        var value = localStorage.getItem('pdfjs.history');
                        if (!value) {
                            var databaseStr = localStorage.getItem('database');
                            if (databaseStr) {
                                try {
                                    var database = JSON.parse(databaseStr);
                                    if (typeof database.files[0].fingerprint === 'string') {
                                        localStorage.setItem('pdfjs.history', databaseStr);
                                        localStorage.removeItem('database');
                                        value = databaseStr;
                                    }
                                } catch (ex) {
                                }
                            }
                        }
                        resolve(value);
                    });
                }
            }, {
                key: 'set',
                value: function set(name, val) {
                    var _this3 = this;

                    return this._initializedPromise.then(function () {
                        _this3.file[name] = val;
                        return _this3._writeToStorage();
                    });
                }
            }, {
                key: 'setMultiple',
                value: function setMultiple(properties) {
                    var _this4 = this;

                    return this._initializedPromise.then(function () {
                        for (var name in properties) {
                            _this4.file[name] = properties[name];
                        }
                        return _this4._writeToStorage();
                    });
                }
            }, {
                key: 'get',
                value: function get(name, defaultValue) {
                    var _this5 = this;

                    return this._initializedPromise.then(function () {
                        var val = _this5.file[name];
                        return val !== undefined ? val : defaultValue;
                    });
                }
            }, {
                key: 'getMultiple',
                value: function getMultiple(properties) {
                    var _this6 = this;

                    return this._initializedPromise.then(function () {
                        var values = Object.create(null);
                        for (var name in properties) {
                            var val = _this6.file[name];
                            values[name] = val !== undefined ? val : properties[name];
                        }
                        return values;
                    });
                }
            }]);

            return ViewHistory;
        }();

        exports.ViewHistory = ViewHistory;

    }),
    /* 33 */
    (function (module, exports, __webpack_require__) {

        var pdfjsWebApp = void 0;
        {
            pdfjsWebApp = __webpack_require__(4);
        }
        ;
        {
            __webpack_require__(8);
        }
        ;
        {
            __webpack_require__(9);
        }
        function getViewerConfiguration() {
            return {
                appContainer: document.body,
                mainContainer: document.getElementById('viewerContainer'),
                viewerContainer: document.getElementById('viewer'),
                eventBus: null,
                toolbar: {
                    container: document.getElementById('toolbarViewer'),
                    numPages: document.getElementById('numPages'),
                    pageNumber: document.getElementById('pageNumber'),
                    previous: document.getElementById('previous'),
                    next: document.getElementById('next'),
                    presentationModeButton: document.getElementById('presentationMode'),
                    viewBookmark: document.getElementById('viewBookmark')
                },
                sidebar: {
                    mainContainer: document.getElementById('mainContainer'),
                    thumbnailView: document.getElementById('thumbnailView'),
                },
                documentProperties: {
                    overlayName: 'documentPropertiesOverlay',
                    container: document.getElementById('documentPropertiesOverlay'),
                    closeButton: document.getElementById('documentPropertiesClose'),
                    fields: {
                        'fileName': document.getElementById('fileNameField'),
                        'fileSize': document.getElementById('fileSizeField'),
                        'title': document.getElementById('titleField'),
                        'author': document.getElementById('authorField'),
                        'subject': document.getElementById('subjectField'),
                        'keywords': document.getElementById('keywordsField'),
                        'creationDate': document.getElementById('creationDateField'),
                        'modificationDate': document.getElementById('modificationDateField'),
                        'creator': document.getElementById('creatorField'),
                        'producer': document.getElementById('producerField'),
                        'version': document.getElementById('versionField'),
                        'pageCount': document.getElementById('pageCountField')
                    }
                },
                openFileInputName: 'fileInput',
                defaultUrl: "test2.pdf"
            };
        }

        function webViewerLoad() {
            var config = getViewerConfiguration();
            window.PDFViewerApplication = pdfjsWebApp.PDFViewerApplication;
            pdfjsWebApp.PDFViewerApplication.run(config);
        }

        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            webViewerLoad();
        } else {
            document.addEventListener('DOMContentLoaded', webViewerLoad, true);
        }
    })
]);
