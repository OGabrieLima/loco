'use strict';

var Ni = require('react');
var jsxRuntime = require('react/jsx-runtime');
var classVarianceAuthority = require('class-variance-authority');
var splide = require('@splidejs/splide');
var splideExtensionAutoScroll = require('@splidejs/splide-extension-auto-scroll');
var react = require('@headlessui/react');

function _interopDefault(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}

var Ni__default = /*#__PURE__*/ _interopDefault(Ni);

var Ct = Object.defineProperty,
    At = Object.defineProperties;
var St = Object.getOwnPropertyDescriptors;
var le = Object.getOwnPropertySymbols;
var Ie = Object.prototype.hasOwnProperty,
    _e = Object.prototype.propertyIsEnumerable;
var Se = (e, t, i) => t in e ? Ct(e, t, {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: i
    }) : e[t] = i,
    q = (e, t) => {
        for (var i in t || (t = {})) Ie.call(t, i) && Se(e, i, t[i]);
        if (le)
            for (var i of le(t)) _e.call(t, i) && Se(e, i, t[i]);
        return e
    },
    ne = (e, t) => At(e, St(t));
var Fe = (e, t) => {
    var i = {};
    for (var r in e) Ie.call(e, r) && t.indexOf(r) < 0 && (i[r] = e[r]);
    if (e != null && le)
        for (var r of le(e)) t.indexOf(r) < 0 && _e.call(e, r) && (i[r] = e[r]);
    return i
};
var Ee = (e, t, i) => new Promise((r, u) => {
    var d = a => {
            try {
                p(i.next(a));
            } catch (o) {
                u(o);
            }
        },
        f = a => {
            try {
                p(i.throw(a));
            } catch (o) {
                u(o);
            }
        },
        p = a => a.done ? r(a.value) : Promise.resolve(a.value).then(d, f);
    p((i = i.apply(e, t)).next());
});
var Wi = () => {
    let [e, t] = Ni.useState(!1);
    return jsxRuntime.jsx("button", {
        className: `h-[50px] w-[200px] ${e?"bg-green-400":"bg-red-400"}`,
        onClick: () => t(i => !i),
        children: e ? "Clicked" : "Not Clicked"
    })
};
var Et = classVarianceAuthority.cva("button", {
        variants: {
            intent: {
                primary: ["bg-blue-500", "text-white", "border-transparent", "hover:bg-blue-600"],
                secondary: ["bg-white", "text-gray-800", "border-gray-400", "hover:bg-gray-100"]
            },
            size: {
                small: ["text-sm", "py-1", "px-2"],
                medium: ["text-base", "py-2", "px-4"]
            }
        },
        compoundVariants: [{
            intent: "primary",
            size: "medium",
            class: "uppercase"
        }],
        defaultVariants: {
            intent: "primary",
            size: "medium"
        }
    }),
    Vi = u => {
        var d = u,
            {
                className: e,
                intent: t,
                size: i
            } = d,
            r = Fe(d, ["className", "intent", "size"]);
        return jsxRuntime.jsx("button", q({
            className: Et({
                intent: t,
                size: i,
                className: e
            })
        }, r))
    };
var Pt = (e, t) => {
        let i = document.getElementById(e);
        if (!i) return;
        let r = i.getBoundingClientRect().top,
            u = 48,
            d = t ? u + 10 : u + 52 + 10,
            f = r + window.pageYOffset - d;
        window.scrollTo({
            behavior: "smooth",
            top: f
        });
    },
    Ji = ({
        isWebview: e = !1,
        tablist: t,
        customClasses: i
    }) => jsxRuntime.jsx("div", {
        id: "valorant-page-tabs",
        className: `ui-sticky ui-flex ui-overflow-x-scroll ui-py-2 ui-my-4 ui-px-3 ui-z-[20] ui-bg-black md:ui-hidden ${e?"ui-top-0":"ui-top-[52px]"}`,
        children: t.map((r, u) => jsxRuntime.jsx("button", {
            className: `ui-py-2 ui-px-4 ui-rounded-[35px]  ui-mr-[10px] ui-whitespace-nowrap ui-font-semibold ui-text-10 ui-leading-[14px] ui-border ui-border-[#52B098] ${i}`,
            onClick: () => Pt(r.value, e),
            children: r.name
        }, u))
    }),
    Zi = ({
        imagesList: e
    }) => (Ni.useEffect(() => {
        let t = new splide.Splide("#valorant-autoplay-image-carousel", {
            type: "loop",
            gap: "10px",
            perPage: 2,
            arrows: !1,
            pagination: !1,
            drag: !0,
            lazyLoad: "sequential",
            autoScroll: {
                speed: 1,
                rewind: !1
            }
        }).mount({
            AutoScroll: splideExtensionAutoScroll.AutoScroll
        });
        return () => {
            t.destroy();
        }
    }, []), jsxRuntime.jsx("div", {
        id: "valorant-autoplay-image-carousel",
        className: "splide ui-w-full ui-overflow-hidden ui-my-4",
        children: jsxRuntime.jsx("div", {
            className: "splide__track",
            children: jsxRuntime.jsx("ul", {
                className: "splide__list flex",
                children: e.map(t => jsxRuntime.jsx("li", {
                    className: "splide__slide ui-h-[203px] ui-min-w-[203px]",
                    children: jsxRuntime.jsx("img", {
                        "data-splide-lazy": t.item,
                        height: "100%",
                        width: "100%",
                        alt: "scroll-img",
                        className: "ui-h-full ui-w-full ui-object-fill"
                    })
                }, t.id))
            })
        })
    })),
    Qi = ({
        imagesList: e,
        paginationPrevArrow: t,
        paginationNextArrow: i
    }) => (Ni.useEffect(() => {
        let r = new splide.Splide("#valorant-image-carousel", {
            loop: !0,
            rewind: !0,
            perPage: 1,
            pagination: !0,
            classes: {
                page: "splide__pagination__page valorant-image-carousel-pagination-page"
            }
        }).mount();
        return () => {
            r.destroy();
        }
    }, []), jsxRuntime.jsx("div", {
        className: "ui-w-full ui-flex ui-justify-end",
        children: jsxRuntime.jsxs("div", {
            id: "valorant-image-carousel",
            className: "splide ui-w-full ui-max-w-[600px] ui-aspect-[1.10] ui-h-auto",
            children: [jsxRuntime.jsxs("div", {
                className: "splide__arrows",
                children: [jsxRuntime.jsx("img", {
                    src: t,
                    className: "splide__arrow splide__arrow--prev valorant-image-carousel-arrow-prev",
                    alt: "prev-arrow",
                    height: "38px",
                    width: "24px"
                }), jsxRuntime.jsx("img", {
                    src: i,
                    className: "splide__arrow splide__arrow--next valorant-image-carousel-arrow-next",
                    alt: "right-arrow",
                    height: "38px",
                    width: "24px"
                })]
            }), jsxRuntime.jsx("div", {
                className: "splide__track h-full w-full",
                children: jsxRuntime.jsx("ul", {
                    className: "splide__list h-full w-full",
                    children: e.map(r => jsxRuntime.jsx("li", {
                        className: "splide__slide h-full w-full",
                        children: jsxRuntime.jsx("img", {
                            src: r.item,
                            className: "ui-h-full ui-w-full ui-object-fill",
                            alt: "scroll-img"
                        })
                    }, r.id))
                })
            })]
        })
    })),
    Dt = {
        rank: "Rank",
        team: "Team",
        matches: "Matches",
        winloss: "Win-Loss",
        maps: "Maps(W-L)",
        rounds: "Rounds(W-L)",
        roundDifference: "Round Difference",
        time: "Time (IST)",
        group: "Group",
        map1: "Map 1",
        map2: "Map 2",
        map3: "Map 3",
        map4: "Map 4",
        map5: "Map 5",
        winner: "Winner",
        date: "Date",
        stage: "Stage",
        match: "Match"
    },
    Lt = (e, t) => {
        let i;
        return r => {
            i || (e(r), i = setTimeout(() => {
                i = void 0;
            }, t));
        }
    },
    er = ({
        currentTableType: e,
        formattedTableData: t,
        tableName: i,
        setIsScrolled: r
    }) => {
        let u = Ni.useRef(null),
            d = Ni.useRef(null);
        Ni.useEffect(() => {
            let a = u.current;

            function o() {
                r();
            }
            return a == null || a.addEventListener("scroll", o, {
                once: !0
            }), () => {
                a == null || a.removeEventListener("scroll", o);
            }
        }, []);
        let p = Lt(() => {
            if (window.innerWidth > 768) return;
            let o = u.current,
                s = d.current;
            !o || !s || (o.scrollLeft + o.clientWidth + 100 > o.scrollWidth ? s.style.display = "none" : s.style.display = "block");
        }, 50);
        return jsxRuntime.jsxs("div", {
            className: "ui-mt-8 ui-px-3 md:ui-mt-12",
            children: [jsxRuntime.jsx("p", {
                className: "ui-text-[12px] ui-font-semibold ui-mb-2 md:ui-text-[24px] md:ui-mb-3",
                children: i
            }), jsxRuntime.jsxs("div", {
                className: "ui-relative",
                children: [jsxRuntime.jsx("div", {
                    ref: u,
                    onScroll: p,
                    className: "points-table ui-border ui-border-[#424A53] ui-rounded-[5px] ui-max-h-[459px] md:ui-max-h-[560px] ui-overflow-auto ui-text-[10px] md:ui-text-[16px] md:ui-border-2",
                    children: t.map((a, o) => jsxRuntime.jsx("div", {
                        className: `${o===0?"ui-text-[#B5B5B5] ui-font-semibold":"ui-font-normal"} ui-flex ui-text-left`,
                        children: a.map((s, l) => jsxRuntime.jsx("div", {
                            className: `${o===0?"ui-border-b-2 ui-border-[#424A53]":""}
              ${o===t.length-1?"md:ui-border-b-0":""} 
              ${e==="groupEntry"?"md:ui-w-[14.285%]":["groupMatchesEntry","playOffEntry"].includes(e)?"md:ui-w-[12.5%]":"md:ui-w-[11.12%]"}
                      ui-flex-wrap ui-py-3 ui-border-[#424A53] ui-border  ui-min-w-[150px] ui-px-2`,
                            children: o === 0 ? Dt[s] : s
                        }, l))
                    }, o))
                }), jsxRuntime.jsx("div", {
                    className: "points-table-shadow ui-absolute ui-top-0 ui-right-0 ui-h-full ui-w-[35px] ui-z-[15] md:ui-hidden",
                    ref: d
                })]
            })]
        })
    },
    jt = ({
        isToday: e = !1,
        isBgmiQuest: t = !1,
        hideIsTodayText: i = !1,
        isBgmiShowAll: r = !1,
        winnersList: u,
        bgmiQuestWinningList: d,
        date: f,
        setSelectedWinnerData: p,
        textColor: a,
        showToday: o = !1
    }) => jsxRuntime.jsxs("div", {
        className: `ui-px-3 ui-mt-8 ui-w-full md:ui-mt-12 ${t||e?"md:ui-w-[700px]":"md:ui-w-[336px]"}`,
        children: [i ? null : jsxRuntime.jsxs("div", {
            className: "flex justify-between items-center ui-mb-2",
            children: [jsxRuntime.jsx("span", {
                className: "font-semibold ui-text-16 leading-[22px]",
                children: f
            }), e && !t || o ? jsxRuntime.jsx("span", {
                className: "ui-text-10 ui-text-[#52B098] tracking-[0.29em]",
                style: {
                    color: a || "#52B098"
                },
                children: "TODAY"
            }) : !1]
        }), jsxRuntime.jsxs("div", {
            className: `ui-border ui-border-[#424A53] ui-rounded-[9px] ui-p-3 ui-text-12 ui-leading-[15px] ui-relative md:ui-p-4 ui-overflow-hidden ${e?r?"ui-bg-black":"":t?"ui-h-[240px] md:ui-h-[250px]":"ui-h-[160px] md:ui-h-[170px]"}`,
            children: [jsxRuntime.jsxs("div", {
                className: "ui-pb-1 ui-border-b ui-border-[#B5B5B5] ui-flex ui-justify-between ui-mb-[10px] ui-text-[#B5B5B5] md:ui-mb-4",
                children: [jsxRuntime.jsx("span", {
                    children: "Username"
                }), jsxRuntime.jsx("span", {
                    children: t ? "Name" : "Reward Amt."
                })]
            }), u ? u.map((s, l) => l > (t ? 6 : 3) && !e ? null : jsxRuntime.jsxs("div", {
                className: `ui-flex ui-justify-between ${l===3&&!e||l===u.length-1?"ui-mb-2 md:ui-mb-1":"ui-mb-3"}`,
                children: [jsxRuntime.jsx("span", {
                    className: "ui-w-1/2 ui-break-all",
                    children: s
                }), jsxRuntime.jsx("span", {
                    className: "ui-min-w-[120px] ui-text-right",
                    children: "Riot Cash $10"
                })]
            }, l)) : d ? d.map((s, l) => l > (t ? 6 : 3) && !e ? null : jsxRuntime.jsxs("div", {
                className: `ui-flex ui-justify-between ${l===3&&!e||l===d.length-1?"ui-mb-2 md:ui-mb-1":"ui-mb-3"}`,
                children: [jsxRuntime.jsx("span", {
                    className: "ui-w-[45%] ui-break-all ui-text-xs",
                    children: s.usernames
                }), jsxRuntime.jsx("span", {
                    className: "ui-w-[45%] ui-text-xs md:ui-text-sm ui-text-right ui-break-all",
                    children: s.name.length ? s.name : "-"
                })]
            }, l)) : null, e && (!t || r) ? null : jsxRuntime.jsx("div", {
                className: "valorant-view-all-winners ui-absolute ui-bottom-0 ui-left-0 ui-h-[95px] ui-w-full ui-rounded-[9px] ui-flex ui-justify-center ui-items-end ui-pb-1",
                children: jsxRuntime.jsx("button", {
                    className: `ui-font-semibold ui-text-10 ui-p-[10px] ui-h-fit ${t?"ui-text-[#44B4D6]":"ui-text-[#52B098]"}`,
                    style: {
                        color: a || "#52B098"
                    },
                    onClick: () => p(),
                    children: "View all winners"
                })
            })]
        })]
    }),
    tr = ({
        date: e,
        isBgmiQuestEvent: t = !1,
        selectedWinnerData: i,
        bgmiSelectedWinnerData: r,
        setSelectedWinnerData: u,
        isMobile: d = !0,
        goBackArrowImage: f,
        webBackgroundImage: p,
        mobileBackgroundImage: a,
        isWebview: o
    }) => jsxRuntime.jsxs("div", {
        className: "ui-bg-[#0A1016] md:ui-bg-black",
        children: [jsxRuntime.jsx("div", {
            className: `ui-fixed ui-left-0 ui-z-10 ui-bg-black w-full ${o?"ui-top-0":"ui-top-[52px]"}`,
            children: jsxRuntime.jsxs("button", {
                className: `  ui-flex ui-items-center ui-py-3 ui-pl-[18px] ui-text-[#52B098] ui-text-16 ui-font-bold
        `,
                onClick: () => u(),
                children: [jsxRuntime.jsx("img", {
                    src: f,
                    className: `${t?"ui-h-[20px] ui-w-[20px]":"ui-h-[10px] ui-w-[8px]"}`,
                    alt: "back-arrow"
                }), jsxRuntime.jsx("span", {
                    className: `${t?"ui-text-[#33EDFD]":""}`,
                    children: "\xA0 Go Back"
                })]
            })
        }), jsxRuntime.jsx("div", {
            className: `ui-fixed ui-top-[100px] ui-left-0 ui-z-0 ui-w-full ui-h-auto md:ui-top-[52px] ui-aspect-[5]
       ${o?"ui-top-[50px]":"ui-top-[100px] md:ui-top-[52px]"}
      `,
            children: jsxRuntime.jsxs("div", {
                className: "ui-relative ui-flex ui-flex-col ui-h-full ui-gap-y-2 ui-items-center ui-justify-center md:ui-gap-y-4",
                children: [jsxRuntime.jsx("span", {
                    className: "ui-text-20 md:ui-text-[42px] ui-font-bold ",
                    children: "Winners List"
                }), jsxRuntime.jsx("span", {
                    className: `ui-text-16 ui-font-semibold md:ui-text-[24px] ${t?"ui-text-[#D522D7]":"ui-text-[#52B098]"}`,
                    children: e
                }), jsxRuntime.jsx("img", {
                    src: d ? a : p,
                    className: "ui-object-cover ui-h-full ui-w-full ui-absolute ui-top-0 ui-left-0 ui-z-[-1]",
                    alt: "valorant-bg"
                })]
            })
        }), jsxRuntime.jsxs("div", {
            className: `ui-absolute  ui-left-0 ui-w-full ui-h-[70vh] ui-z-1 ${o?"ui-top-[50px]":"ui-top-[100px] md:ui-top-[52px]"}`,
            children: [jsxRuntime.jsx("div", {
                className: "ui-bg-transparent ui-w-full ui-h-auto ui-aspect-[5]"
            }), jsxRuntime.jsx("div", {
                className: `ui-bg-black ui-w-full ui-h-full  md:ui-rounded-t-2xl ui-flex ui-justify-center ${t?"":"ui-border-t-2 ui-border-[#52B098]"}`,
                children: jsxRuntime.jsx(jt, {
                    date: e,
                    isBgmiQuest: t,
                    isBgmiShowAll: t,
                    isToday: !0,
                    hideIsTodayText: !0,
                    winnersList: i,
                    bgmiQuestWinningList: r,
                    setSelectedWinnerData: u
                })
            })]
        })]
    });
var Ot = [{
    href: "/account-settings",
    label: "Account settings"
}, {
    href: "/support",
    label: "Support"
}, {
    href: "/license",
    label: "License"
}, {
    href: "/sign-out",
    label: "Sign out"
}];

function ur() {
    return jsxRuntime.jsxs(react.Menu, {
        children: [jsxRuntime.jsx(react.Menu.Button, {
            className: "text-white",
            children: "Options"
        }), jsxRuntime.jsx(react.Menu.Items, {
            children: Ot.map(e => jsxRuntime.jsx(Ni.Fragment, {
                children: jsxRuntime.jsx(react.Menu.Item, {
                    as: "a",
                    href: e.href,
                    className: "ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-red-300 ui-not-active:text-black",
                    children: e.label
                })
            }, e.label))
        })]
    })
}
var qt = typeof global == "object" && global && global.Object === Object && global,
    Pe = qt;
var Ht = typeof self == "object" && self && self.Object === Object && self,
    $t = Pe || Ht || Function("return this")(),
    fe = $t;
var Vt = fe.Symbol,
    X = Vt;
var De = Object.prototype,
    zt = De.hasOwnProperty,
    Gt = De.toString,
    te = X ? X.toStringTag : void 0;

function Ut(e) {
    var t = zt.call(e, te),
        i = e[te];
    try {
        e[te] = void 0;
        var r = !0;
    } catch (d) {}
    var u = Gt.call(e);
    return r && (t ? e[te] = i : delete e[te]), u
}
var Le = Ut;
var Yt = Object.prototype,
    Kt = Yt.toString;

function Xt(e) {
    return Kt.call(e)
}
var je = Xt;
var Jt = "[object Null]",
    Zt = "[object Undefined]",
    Me = X ? X.toStringTag : void 0;

function Qt(e) {
    return e == null ? e === void 0 ? Zt : Jt : Me && Me in Object(e) ? Le(e) : je(e)
}
var Oe = Qt;

function ei(e) {
    return e != null && typeof e == "object"
}
var We = ei;
var ti = "[object Symbol]";

function ii(e) {
    return typeof e == "symbol" || We(e) && Oe(e) == ti
}
var qe = ii;
var ri = /\s/;

function ai(e) {
    for (var t = e.length; t-- && ri.test(e.charAt(t)););
    return t
}
var He = ai;
var oi = /^\s+/;

function ui(e) {
    return e && e.slice(0, He(e) + 1).replace(oi, "")
}
var $e = ui;

function si(e) {
    var t = typeof e;
    return e != null && (t == "object" || t == "function")
}
var V = si;
var Ve = 0 / 0,
    li = /^[-+]0x[0-9a-f]+$/i,
    ni = /^0b[01]+$/i,
    di = /^0o[0-7]+$/i,
    pi = parseInt;

function fi(e) {
    if (typeof e == "number") return e;
    if (qe(e)) return Ve;
    if (V(e)) {
        var t = typeof e.valueOf == "function" ? e.valueOf() : e;
        e = V(t) ? t + "" : t;
    }
    if (typeof e != "string") return e === 0 ? e : +e;
    e = $e(e);
    var i = ni.test(e);
    return i || di.test(e) ? pi(e.slice(2), i ? 2 : 8) : li.test(e) ? Ve : +e
}
var we = fi;
var mi = function() {
        return fe.Date.now()
    },
    me = mi;
var ci = "Expected a function",
    xi = Math.max,
    gi = Math.min;

function bi(e, t, i) {
    var r, u, d, f, p, a, o = 0,
        s = !1,
        l = !1,
        m = !0;
    if (typeof e != "function") throw new TypeError(ci);
    t = we(t) || 0, V(i) && (s = !!i.leading, l = "maxWait" in i, d = l ? xi(we(i.maxWait) || 0, t) : d, m = "trailing" in i ? !!i.trailing : m);

    function n(w) {
        var B = r,
            b = u;
        return r = u = void 0, o = w, f = e.apply(b, B), f
    }

    function g(w) {
        return o = w, p = setTimeout(_, t), s ? n(w) : f
    }

    function j(w) {
        var B = w - a,
            b = w - o,
            N = t - B;
        return l ? gi(N, d - b) : N
    }

    function R(w) {
        var B = w - a,
            b = w - o;
        return a === void 0 || B >= t || B < 0 || l && b >= d
    }

    function _() {
        var w = me();
        if (R(w)) return M(w);
        p = setTimeout(_, j(w));
    }

    function M(w) {
        return p = void 0, m && r ? n(w) : (r = u = void 0, f)
    }

    function G() {
        p !== void 0 && clearTimeout(p), o = 0, r = a = u = p = void 0;
    }

    function ge() {
        return p === void 0 ? f : M(me())
    }

    function Q() {
        var w = me(),
            B = R(w);
        if (r = arguments, u = this, a = w, B) {
            if (p === void 0) return g(a);
            if (l) return clearTimeout(p), p = setTimeout(_, t), n(a)
        }
        return p === void 0 && (p = setTimeout(_, t)), f
    }
    return Q.cancel = G, Q.flush = ge, Q
}
var ie = bi;
var hi = "Expected a function";

function vi(e, t, i) {
    var r = !0,
        u = !0;
    if (typeof e != "function") throw new TypeError(hi);
    return V(i) && (r = "leading" in i ? !!i.leading : r, u = "trailing" in i ? !!i.trailing : u), ie(e, t, {
        leading: r,
        maxWait: t,
        trailing: u
    })
}
var ye = vi;
var Ge = e => (t, i) => (e.set(t, i), i);
var Ue = Number.MAX_SAFE_INTEGER === void 0 ? 9007199254740991 : Number.MAX_SAFE_INTEGER,
    Ke = 536870912,
    Ye = Ke * 2,
    Xe = (e, t) => i => {
        let r = t.get(i),
            u = r === void 0 ? i.size : r < Ye ? r + 1 : 0;
        if (!i.has(u)) return e(i, u);
        if (i.size < Ke) {
            for (; i.has(u);) u = Math.floor(Math.random() * Ye);
            return e(i, u)
        }
        if (i.size > Ue) throw new Error("Congratulations, you created a collection of unique numbers which uses all available integers!");
        for (; i.has(u);) u = Math.floor(Math.random() * Ue);
        return e(i, u)
    };
var Je = new WeakMap,
    wi = Ge(Je),
    J = Xe(wi, Je);
var Ze = e => e.method !== void 0 && e.method === "call";
var Qe = e => e.error === null && typeof e.id == "number";
var et = e => {
    let t = new Map([
            [0, () => {}]
        ]),
        i = new Map([
            [0, () => {}]
        ]),
        r = new Map,
        u = new Worker(e);
    return u.addEventListener("message", ({
        data: o
    }) => {
        if (Ze(o)) {
            let {
                params: {
                    timerId: s,
                    timerType: l
                }
            } = o;
            if (l === "interval") {
                let m = t.get(s);
                if (typeof m == "number") {
                    let n = r.get(m);
                    if (n === void 0 || n.timerId !== s || n.timerType !== l) throw new Error("The timer is in an undefined state.")
                } else if (typeof m != "undefined") m();
                else throw new Error("The timer is in an undefined state.")
            } else if (l === "timeout") {
                let m = i.get(s);
                if (typeof m == "number") {
                    let n = r.get(m);
                    if (n === void 0 || n.timerId !== s || n.timerType !== l) throw new Error("The timer is in an undefined state.")
                } else if (typeof m != "undefined") m(), i.delete(s);
                else throw new Error("The timer is in an undefined state.")
            }
        } else if (Qe(o)) {
            let {
                id: s
            } = o, l = r.get(s);
            if (l === void 0) throw new Error("The timer is in an undefined state.");
            let {
                timerId: m,
                timerType: n
            } = l;
            r.delete(s), n === "interval" ? t.delete(m) : i.delete(m);
        } else {
            let {
                error: {
                    message: s
                }
            } = o;
            throw new Error(s)
        }
    }), {
        clearInterval: o => {
            let s = J(r);
            r.set(s, {
                timerId: o,
                timerType: "interval"
            }), t.set(o, s), u.postMessage({
                id: s,
                method: "clear",
                params: {
                    timerId: o,
                    timerType: "interval"
                }
            });
        },
        clearTimeout: o => {
            let s = J(r);
            r.set(s, {
                timerId: o,
                timerType: "timeout"
            }), i.set(o, s), u.postMessage({
                id: s,
                method: "clear",
                params: {
                    timerId: o,
                    timerType: "timeout"
                }
            });
        },
        setInterval: (o, s = 0) => {
            let l = J(t);
            return t.set(l, () => {
                o(), typeof t.get(l) == "function" && u.postMessage({
                    id: null,
                    method: "set",
                    params: {
                        delay: s,
                        now: performance.now(),
                        timerId: l,
                        timerType: "interval"
                    }
                });
            }), u.postMessage({
                id: null,
                method: "set",
                params: {
                    delay: s,
                    now: performance.now(),
                    timerId: l,
                    timerType: "interval"
                }
            }), l
        },
        setTimeout: (o, s = 0) => {
            let l = J(i);
            return i.set(l, o), u.postMessage({
                id: null,
                method: "set",
                params: {
                    delay: s,
                    now: performance.now(),
                    timerId: l,
                    timerType: "timeout"
                }
            }), l
        }
    }
};
var re = null,
    tt = (e, t) => () => {
        if (re !== null) return re;
        let i = new Blob([t], {
                type: "application/javascript; charset=utf-8"
            }),
            r = URL.createObjectURL(i);
        return re = e(r), re.setTimeout(() => URL.revokeObjectURL(r), 0), re
    };
var it = `(()=>{"use strict";const e=new Map,t=new Map,r=(e,t)=>{let r,o;const i=performance.now();r=i,o=e-Math.max(0,i-t);return{expected:r+o,remainingDelay:o}},o=(e,t,r,i)=>{const s=performance.now();s>r?postMessage({id:null,method:"call",params:{timerId:t,timerType:i}}):e.set(t,setTimeout(o,r-s,e,t,r,i))};addEventListener("message",(i=>{let{data:s}=i;try{if("clear"===s.method){const{id:r,params:{timerId:o,timerType:i}}=s;if("interval"===i)(t=>{const r=e.get(t);if(void 0===r)throw new Error('There is no interval scheduled with the given id "'.concat(t,'".'));clearTimeout(r),e.delete(t)})(o),postMessage({error:null,id:r});else{if("timeout"!==i)throw new Error('The given type "'.concat(i,'" is not supported'));(e=>{const r=t.get(e);if(void 0===r)throw new Error('There is no timeout scheduled with the given id "'.concat(e,'".'));clearTimeout(r),t.delete(e)})(o),postMessage({error:null,id:r})}}else{if("set"!==s.method)throw new Error('The given method "'.concat(s.method,'" is not supported'));{const{params:{delay:i,now:n,timerId:a,timerType:d}}=s;if("interval"===d)((t,i,s)=>{const{expected:n,remainingDelay:a}=r(t,s);e.set(i,setTimeout(o,a,e,i,n,"interval"))})(i,a,n);else{if("timeout"!==d)throw new Error('The given type "'.concat(d,'" is not supported'));((e,i,s)=>{const{expected:n,remainingDelay:a}=r(e,s);t.set(i,setTimeout(o,a,t,i,n,"timeout"))})(i,a,n)}}}}catch(e){postMessage({error:{message:e.message},id:s.id,result:null})}}))})();`;
var rt = tt(et, it);
var at = e => rt().clearTimeout(e);
var ce = (e, t) => rt().setTimeout(e, t);
var Ta = ({
    children: e,
    isChatVisible: t,
    uniqueUid: i,
    messages_per_2_sec: r,
    load_more_text: u,
    is_dashboard_activity: d,
    is_chat_popout: f = !1,
    trackChatPauseEvent: p
}) => {
    let a = Ni.useRef(""),
        o = i || "",
        s = Ni.useRef(null),
        l = Ni.useRef(0);
    l.current = Number(((r || 0) / 4).toFixed());
    let m = Ni.useRef(e),
        n = Ni.useRef(!0),
        g = Ni.useRef(!1),
        j = Ni.useRef(() => {}),
        [R, _] = Ni.useState(!1),
        M = Ni.useRef("unpaused"),
        G = b => {
            M.current !== b && (p == null || p(b), M.current = b);
        },
        ge = (b = "auto") => {
            if (!s.current) return;
            let {
                scrollHeight: N,
                clientHeight: F
            } = s.current;
            s.current.scrollTo({
                top: N - F,
                behavior: b
            });
        },
        Q = () => {
            if (!s.current) return !1;
            let {
                scrollTop: b,
                scrollHeight: N,
                clientHeight: F
            } = s.current;
            return N - b - F <= 60
        };
    j.current = b => {
        !t || !s.current || !n.current || window.requestAnimationFrame(() => {
            if (!s.current) return;
            let {
                offsetHeight: N,
                scrollHeight: F,
                clientHeight: $
            } = s.current, ee = F - N, U = N - $, Y = ee + U;
            s.current.scroll({
                top: Y,
                left: 0,
                behavior: b || (l.current >= 4 ? "auto" : "smooth")
            });
        });
    };
    let w = () => {
        if (!s.current) return;
        let {
            scrollTop: b,
            offsetHeight: N,
            scrollHeight: F,
            clientHeight: $
        } = s.current, ee = F - N, U = N - $, Y = ee + U;
        Math.abs(Y - b) >= 60 && (_(!0), n.current = !1);
    };
    Ni.useEffect(() => {
        n.current || w(), R || (m.current = e), n.current && !R && j.current();
    }), Ni.useEffect(() => {
        let b = s.current;
        if (!b || !t) return;
        let N = null,
            F = !1,
            $ = () => {
                if (!s.current) return;
                let {
                    scrollTop: Y,
                    offsetHeight: be,
                    scrollHeight: vt,
                    clientHeight: wt
                } = s.current, yt = vt - be, Nt = be - wt, he = yt + Nt;
                N = N === null ? Y : N;
                let Ae = N,
                    K = Y;
                N = K;
                let kt = K < Ae,
                    Tt = Math.abs(he - K) <= 60;
                kt ? Math.abs(he - K) > 1 && Math.abs(K - Ae) < 1e3 && Math.abs(he - K) > 20 && (_(!0), n.current = !1) : Tt && (n.current = !0, _(!1)), F = !0;
            },
            ee = ie(() => {
                F && (Q() ? G("unpaused") : G("paused"), F = !1);
            }, 300),
            U = ye(() => {
                $(), ee();
            }, 50);
        return b.addEventListener("scroll", U), b.addEventListener("click", w), b.addEventListener("touchstart", w), () => {
            b.removeEventListener("scroll", U), b.removeEventListener("touchstart", w), b.removeEventListener("click", w);
        }
    }, [t, o]), Ni.useEffect(() => {
        o !== a.current && (a.current = o, m.current = null, g.current = !1, _(!1), G("unpaused"), n.current = !0);
    }, [o]);
    let B = (() => {
        if (!R) return g.current = !1, !1;
        if (g.current) return g.current;
        let b = Array.isArray(m.current) && m.current || [],
            N = Array.isArray(e) && e || [],
            F = Array.isArray(b[1]) && b[1] || [],
            $ = Array.isArray(N[1]) && N[1] || [];
        return g.current = F.length !== $.length, g.current
    })();
    return jsxRuntime.jsxs("div", {
        className: `chat-elements-list ui-flex ui-flex-col ui-gap-[16px] ui-overflow-y-auto ${d?"ui-w-full":"ui-pl-[16px] ui-pr-[12px] ui-pt-[10px] ui-pb-[30px]"}`,
        style: {
            height: f ? "calc(100vh - 64px)" : "100%"
        },
        ref: s,
        children: [R && m.current || e, R && jsxRuntime.jsx("div", {
            className: "ui-flex ui-justify-center",
            children: jsxRuntime.jsxs("button", {
                className: `ui-absolute ui-bottom-4 ui-bg-[#FF5A12] ui-font-bold ui-self-center ui-flex ui-items-center ui-justify-center ui-outline-none ui-focus:outline-none ui-transition-all ui-duration-300 ui-ease-in-out ${B?"ui-py-1 ui-px-4 ui-rounded-full":"ui-p-2 ui-rounded-[8px]"}`,
                onClick: () => {
                    _(!1), ce(() => {
                        ge("smooth"), G("unpaused");
                    }, 5);
                },
                children: [jsxRuntime.jsx("div", {
                    className: `ui-flex ui-items-center ui-overflow-hidden ui-transition-all ui-duration-300 ui-ease-in-out ${B?"ui-w-auto ui-opacity-100 ui-mr-2":"ui-w-0 ui-opacity-0 ui-mr-0"}`,
                    children: jsxRuntime.jsx("p", {
                        style: {
                            fontSize: "14px",
                            whiteSpace: "nowrap",
                            color: "white"
                        },
                        children: u
                    })
                }), jsxRuntime.jsx("div", {
                    className: "ui-flex ui-items-center ui-justify-center ui-transition-all ui-duration-300 ui-ease-in-out",
                    children: jsxRuntime.jsxs("svg", {
                        width: "24",
                        height: "24",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        xmlns: "http://www.w3.org/2000/svg",
                        children: [jsxRuntime.jsx("g", {
                            clipPath: "url(#clip0_345_86)",
                            children: jsxRuntime.jsx("path", {
                                d: "M10.9509 5.02679V16.4961L5.8056 11.4853C5.3944 11.0849 4.7196 11.0849 4.3084 11.4853C3.8972 11.8858 3.8972 12.5326 4.3084 12.9331L11.2567 19.6997C11.6679 20.1001 12.3321 20.1001 12.7433 19.6997L19.6916 12.9331C20.1028 12.5326 20.1028 11.8858 19.6916 11.4853C19.2804 11.0849 18.6161 11.0849 18.2049 11.4853L13.0596 16.4961V5.02679C13.0596 4.46206 12.5852 4 12.0053 4C11.4254 4 10.9509 4.46206 10.9509 5.02679Z",
                                fill: "white"
                            })
                        }), jsxRuntime.jsx("defs", {
                            children: jsxRuntime.jsx("clipPath", {
                                id: "clip0_345_86",
                                children: jsxRuntime.jsx("rect", {
                                    x: "2",
                                    y: "2",
                                    width: "20",
                                    height: "20",
                                    rx: "2",
                                    fill: "black"
                                })
                            })
                        })]
                    })
                })]
            })
        })]
    })
};
var Ci = ({
        data: e,
        isLoading: t,
        handleAmplitudeEvent: i,
        selectedCategory: r
    }) => {
        let [u, d] = Ni.useState({});
        Ni.useEffect(() => {
            d({});
        }, [r]);
        let f = (a, o) => {
                !r && !u[a] && i("critical_faq", {
                    question: o
                }), u[a] = !u[a], d(q({}, u));
            },
            p = t ? Array.from({
                length: 5
            }, (a, o) => jsxRuntime.jsxs("div", {
                className: `ui-flex ui-items-center ui-w-full ui-px-4 sm:ui-px-6 ui-py-4 sm:ui-py-6 ${o!==0?"ui-border-t ui-border-white/10":""}`,
                children: [jsxRuntime.jsx("div", {
                    className: "ui-w-4/5 ui-h-4 sm:ui-h-6 ui-bg-white/20 ui-rounded-md"
                }), jsxRuntime.jsx("div", {
                    className: "ui-ml-auto ui-w-[20px] ui-h-[20px] md:ui-w-[24px] md:ui-h-[24px] ui-bg-[#FF5A12]/40 ui-rounded-lg"
                })]
            }, o)) : null;
        return jsxRuntime.jsx("div", {
            className: "ui-w-full ui-max-w-[900px] ui-mx-auto ui-bg-[#181818] ui-text-white ui-rounded-[20px]",
            children: t ? p : e.map((a, o) => jsxRuntime.jsxs("div", {
                className: "ui-border-b ui-border-white/10",
                children: [jsxRuntime.jsxs("button", {
                    onClick: () => f(o, a.question),
                    className: `
                  ui-grid ui-grid-cols-[95%_5%] ui-items-center ui-w-full ui-px-4 sm:ui-px-6 ui-py-4 sm:ui-py-6 ui-text-left ui-text-sm sm:ui-text-base ui-font-normal
                  ui-focus:outline-none ui-focus-visible:ring ui-focus-visible:ring-orange-500 ui-focus-visible:ring-opacity-75
                `,
                    children: [jsxRuntime.jsx("span", {
                        className: "ui-pr-2",
                        children: a.question
                    }), jsxRuntime.jsx("div", {
                        className: "ui-flex ui-w-[20px] ui-h-[20px] md:ui-w-[24px] md:ui-h-[24px] ui-items-center ui-justify-center ui-rounded-lg ui-bg-[#FF5A12] ui-text-white ui-text-base sm:ui-text-lg ui-leading-none",
                        children: jsxRuntime.jsx("span", {
                            className: "ui-inline-block ui-translate-y-[-1px] ui-text-white",
                            children: u[o] ? "\u2212" : "+"
                        })
                    })]
                }), jsxRuntime.jsx("div", {
                    className: `
                  ui-px-4 sm:ui-px-6 ui-mr-4 sm:ui-mr-8 ui-text-[#B2B2B2] ui-text-xs sm:ui-text-14 ui-overflow-hidden
                  ui-transition-all ui-duration-300 ui-ease-in-out
                  ${u[o]?"ui-max-h-screen ui-opacity-100 ui-pb-4 sm:ui-pb-6 ui--mt-3":"ui-max-h-0 ui-opacity-0"}
                `,
                    style: {
                        whiteSpace: "pre-wrap",
                        maxHeight: u[o] ? "1000px" : "0",
                        opacity: u[o] ? 1 : 0,
                        transition: "max-height 0.3s ease-in-out, opacity 0.3s ease-in-out"
                    },
                    children: a.answer
                })]
            }, o))
        })
    },
    ut = Ni__default.default.memo(Ci);
var Ai = ({
        translatedStrings: e
    }) => {
        let t = [{
            title: e.generalSupport,
            email: "support@loco.gg"
        }, {
            title: e.moderationSupport,
            email: "moderation@loco.gg"
        }, {
            title: e.engagementSupport,
            email: "engagement@loco.gg"
        }, {
            title: e.rewardsEnquiries,
            email: "reward@loco.gg"
        }, {
            title: e.streamersEnquiries,
            email: "streamers@loco.gg"
        }, {
            title: e.grievanceEnquiries,
            email: "grievance.officer@loco.gg"
        }];
        return jsxRuntime.jsxs("div", {
            className: "ui-bg-black ui-text-md ui-text-white ui-px-8 ui-rounded-lg ui-w-full sm:ui-w-[55rem] ui-mx-auto ui-mb-[66px]",
            children: [jsxRuntime.jsx("h1", {
                className: "ui-text-15 md:ui-text-xl ui-font-bold ui-mb-6 ui-text-center",
                children: e.contactSupportTeam
            }), jsxRuntime.jsx("div", {
                className: "ui-w-full ui-text-xs md:ui-text-md ui-mt-4 ui-border ui-border-[#3A3A3A]/60 ui-rounded-[20px] ui-overflow-hidden",
                children: jsxRuntime.jsx("div", {
                    children: t.map((i, r) => jsxRuntime.jsxs("div", {
                        className: "ui-grid ui-grid-cols-2",
                        children: [jsxRuntime.jsx("div", {
                            className: "ui-bg-[#181818] ui-leading-6 ui-py-4 ui-border-r ui-border-t ui-text-12 md:ui-text-16 ui-border-[#3A3A3A]/60 ui-flex ui-items-center ui-justify-center",
                            children: i.title
                        }), jsxRuntime.jsx("a", {
                            href: `mailto:${i.email}`,
                            className: "ui-py-4 ui-border-t ui-leading-6 ui-text-12 md:ui-text-16 ui-border-[#3A3A3A]/60 ui-hover:underline ui-flex ui-items-center ui-justify-center",
                            children: i.email
                        })]
                    }, r))
                })
            })]
        })
    },
    lt = Ai;
var Si = ({
        setSelectedCategory: e,
        translatedStrings: t,
        handleAmplitudeEvent: i,
        setIsSupportPage: r,
        scrollToTop: u
    }) => {
        let d = () => {
            i("email_us", {}), r(!0), e(t.contactSupportTeam), u();
        };
        return jsxRuntime.jsxs("div", {
            className: "ui-w-full ui-mb-[66px] ui-bg-[#181818] ui-text-center ui-py-8 ui-px-4 ui-flex ui-flex-col ui-items-center ui-justify-center",
            children: [jsxRuntime.jsx("h2", {
                className: "ui-text-white ui-text-md md:ui-text-2xl ui-font-bold ui-mb-2",
                children: t.noAnswerFound
            }), jsxRuntime.jsx("p", {
                className: "ui-text-xs md:ui-text-16 ui-leading-6 ui-text-[#B2B2B2] ui-mb-4",
                children: t.stillNeedHelp
            }), jsxRuntime.jsx("button", {
                onClick: d,
                className: "ui-bg-[#FF5A12] ui-text-white ui-text-xs md:ui-text-14 ui-h-8 md:ui-h-10 ui-py-2 md:ui-py-[10px] ui-px-3 md:ui-px-6 ui-rounded-[10px] ui-font-bold ui-flex ui-items-center ui-justify-center",
                children: t.emailUs
            })]
        })
    },
    nt = Si;
var _i = ({
        tabData: e,
        setSelectedCategory: t,
        defaultTabIndex: i = 0,
        translatedStrings: r,
        isLoading: u,
        handleAmplitudeEvent: d,
        scrollToTop: f,
        faqTextAppend: p
    }) => {
        let a = [{
                key: "Viewer",
                value: r.forViewers
            }, {
                key: "Streamer",
                value: r.forStreamers
            }],
            o = a.map(m => ({
                name: m.value,
                categories: Object.keys(e).filter(n => e[n].tab_name === m.key).map(n => ({
                    title: n,
                    faqCount: e[n].count,
                    icon: jsxRuntime.jsx("img", {
                        src: e[n].image_url,
                        alt: n
                    })
                }))
            })),
            s = m => {
                d("faq_category", {
                    category_name: m
                }), f(), t(m);
            },
            l = Array.from({
                length: 7
            }, (m, n) => jsxRuntime.jsxs("div", {
                className: "ui-bg-[#181818] ui-w-full ui-h-20 sm:ui-h-24 ui-rounded-md ui-border-[1px] ui-border-[#3A3A3A] ui-p-4 ui-flex ui-items-center ui-justify-start",
                children: [jsxRuntime.jsx("div", {
                    className: "ui-text-lg sm:ui-text-2xl ui-w-1/6 ui-flex ui-items-center ui-justify-center",
                    children: jsxRuntime.jsx("div", {
                        className: "ui-min-w-12 ui-min-h-12 sm:ui-min-w-14 sm:ui-min-h-14 ui-bg-[#3A3A3A] ui-rounded-full"
                    })
                }), jsxRuntime.jsxs("div", {
                    className: "ui-w-5/6 ui-text-left ui-ml-2",
                    children: [jsxRuntime.jsx("div", {
                        className: "ui-bg-[#3A3A3A] ui-h-4 ui-w-3/5 ui-rounded-md"
                    }), jsxRuntime.jsx("div", {
                        className: "ui-bg-[#3A3A3A] ui-h-3 ui-w-1/3 ui-rounded-md ui-mt-2"
                    })]
                })]
            }, n));
        return jsxRuntime.jsx("div", {
            className: "ui-w-full sm:ui-w-[62rem] ui-p-3",
            children: jsxRuntime.jsxs(react.Tab.Group, {
                defaultIndex: i,
                children: [jsxRuntime.jsx(react.Tab.List, {
                    className: "ui-flex ui-flex-wrap ui-justify-center ui-mb-4 ui-border-b ui-border-[#181818]",
                    children: a.map(m => jsxRuntime.jsx(react.Tab, {
                        className: ({
                            selected: n
                        }) => `
              ui-relative ui-px-4 ui-py-2 ui-text-xs sm:ui-text-sm ui-outline-none
              ${n?"ui-text-white ui-font-semibold tab-bottom-border":"ui-text-[#B2B2B2]"}
            `,
                        children: m.value
                    }, m.key))
                }), jsxRuntime.jsx(react.Tab.Panels, {
                    children: a.map((m, n) => jsxRuntime.jsx(react.Tab.Panel, {
                        className: "ui-outline-none",
                        children: u ? jsxRuntime.jsx("div", {
                            className: "ui-grid ui-grid-cols-2 sm:ui-grid-cols-3 ui-gap-3 sm:ui-gap-6",
                            children: l
                        }) : jsxRuntime.jsx("div", {
                            className: "ui-grid ui-grid-cols-2 sm:ui-grid-cols-3 ui-gap-3 sm:ui-gap-6",
                            children: o[n].categories.map(g => jsxRuntime.jsxs("div", {
                                role: "button",
                                tabIndex: 0,
                                onClick: () => s(g.title),
                                onKeyPress: j => {
                                    (j.key === "Enter" || j.key === " ") && t(g.title);
                                },
                                className: "ui-bg-[#181818] ui-w-full ui-h-20 sm:ui-h-24 ui-rounded-md ui-border-[1px] ui-border-[#3A3A3A] ui-p-4 ui-flex ui-items-center ui-justify-start ui-hover:bg-neutral-800 ui-transition-colors ui-cursor-pointer",
                                children: [jsxRuntime.jsx("div", {
                                    className: "ui-text-lg sm:ui-text-2xl ui-w-1/6 ui-flex ui-items-center ui-justify-center",
                                    children: g.icon
                                }), jsxRuntime.jsxs("div", {
                                    className: "ui-w-5/6 ui-text-left ui-ml-2",
                                    children: [jsxRuntime.jsx("h3", {
                                        className: "ui-text-white ui-font-medium ui-text-xs md:ui-text-16 md:ui-font-bold",
                                        children: g.title
                                    }), jsxRuntime.jsx("p", {
                                        className: "ui-text-[#B2B2B2] ui-text-10 ui-mt-[6px] md:ui-text-sm ui-font-light",
                                        children: `${g.faqCount} ${p}`
                                    })]
                                })]
                            }, g.title))
                        })
                    }, n))
                })]
            })
        })
    },
    dt = _i;
var Ei = (e, t) => {
        var f, p, a;
        let i = (t == null ? void 0 : t.isTrigger) !== !1,
            [r, u] = Ni.useState({
                faqData: null,
                isLoading: !1,
                isError: !1,
                errorMessage: null
            }),
            d = () => Ee(void 0, null, function*() {
                u(o => ne(q({}, o), {
                    isLoading: !0,
                    isError: !1,
                    errorMessage: null
                }));
                try {
                    let o = {
                            headers: {
                                "Content-Type": "application/json",
                                "X-APP-LANG": e.appLang,
                                "X-PLATFORM": e.platform.toString()
                            }
                        },
                        [s, l] = yield Promise.allSettled([fetch(`${e.url}/support/faq/info/`, o).then(g => {
                            if (!g.ok) throw new Error("Failed to fetch FAQ info");
                            return g.json()
                        }), fetch(`${e.url}/support/info/`, o).then(g => {
                            if (!g.ok) throw new Error("Failed to fetch category info");
                            return g.json()
                        })]), m = s.status === "fulfilled" ? s.value : {
                            faqs: []
                        }, n = l.status === "fulfilled" ? l.value : {
                            categories: {},
                            faq_categories: []
                        };
                    u(g => ne(q({}, g), {
                        faqData: {
                            generalFaqData: m.faqs || [],
                            count_categories: n.categories || {},
                            faqCategoriesData: n.faq_categories || []
                        },
                        isLoading: !1
                    }));
                } catch (o) {
                    u(s => ne(q({}, s), {
                        isError: !0,
                        errorMessage: o instanceof Error ? o.message : "An unknown error occurred",
                        isLoading: !1
                    }));
                }
            });
        return Ni.useEffect(() => {
            if (!i) return;
            let o = ce(() => {
                d();
            }, 250);
            return () => {
                at(o);
            }
        }, [i]), Ni.useEffect(() => {
            d();
        }, [e.appLang]), {
            generalFaqData: ((f = r.faqData) == null ? void 0 : f.generalFaqData) || [],
            count_categories: ((p = r.faqData) == null ? void 0 : p.count_categories) || {},
            faqCategoriesData: ((a = r.faqData) == null ? void 0 : a.faqCategoriesData) || [],
            isLoading: r.isLoading,
            isError: r.isError,
            errorMessage: r.errorMessage
        }
    },
    ft = Ei;
var Ua = ({
    isShowSkeletonOnly: e = !1,
    additionalHeaders: t,
    isDashboard: i = !1,
    translatedStrings: r,
    bgImage: u,
    handleAmplitudeEvent: d,
    title: f
}) => {
    let {
        generalFaqData: p,
        count_categories: a,
        faqCategoriesData: o,
        isLoading: s
    } = ft(t, {
        isTrigger: e
    }), [l, m] = Ni.useState(null), [n, g] = Ni.useState(!1), j = o.filter(M => M.category === l), R = Ni.useRef(null), _ = () => {
        var M;
        (M = R.current) == null || M.scrollIntoView({
            behavior: "smooth",
            block: "start"
        }), window.scroll({
            top: 0,
            left: 0
        });
    };
    return Ni.useEffect(() => {
        d("visit_support", {}), m("");
    }, []), Ni.useEffect(() => {
        m(""), g(!1);
    }, [t.appLang]), jsxRuntime.jsxs("div", {
        className: "ui-w-full ui-flex ui-flex-col ui-justify-center ui-items-center",
        children: [jsxRuntime.jsx("div", {
            ref: R
        }), e ? null : jsxRuntime.jsxs(jsxRuntime.Fragment, {
            children: [n ? jsxRuntime.jsxs("div", {
                className: "ui-hidden md:ui-flex ui-px-8 md:ui-px-0 ui-mt-10 md:ui-mt-0 ui-h-auto sm:ui-h-80 ui-mb-[40px] sm:ui-mb-[66px] ui-w-full ui-relative ui-flex-col ui-gap-3 ui-items-center ui-justify-center",
                children: [jsxRuntime.jsxs("div", {
                    className: "ui-absolute  ui-overflow-hidden ui-top-0 ui-left-0 ui-w-full ui-h-full",
                    children: [jsxRuntime.jsx("div", {
                        className: "ui-absolute ui-top-0 ui-left-0 ui-w-full ui-h-full ui-bg-black ui-opacity-40"
                    }), u]
                }), jsxRuntime.jsx("div", {
                    className: "ui-text-16 ui-text-white sm:ui-text-[32px] ui-font-bold ui-z-10",
                    children: r.contactSupportTeam
                }), jsxRuntime.jsx("div", {
                    className: "ui-w-full sm:ui-w-[850px] ui-leading-6 ui-text-[#B2B2B2] ui-text-12 sm:ui-text-16 ui-z-10 ui-text-center",
                    children: r.furtherHelpDescription
                })]
            }) : (l == null ? void 0 : l.length) === 0 && jsxRuntime.jsxs("div", {
                className: "ui-px-8 md:ui-px-0 ui-mt-10 md:ui-mt-0 ui-h-auto sm:ui-h-80 ui-mb-[40px] sm:ui-mb-[66px] ui-w-full ui-relative ui-flex ui-flex-col ui-gap-3 ui-items-center ui-justify-center",
                children: [jsxRuntime.jsxs("div", {
                    className: "ui-overflow-hidden ui-absolute ui-top-0 ui-left-0 ui-w-full ui-h-full ui-object-fill",
                    children: [u, jsxRuntime.jsx("div", {
                        className: "ui-opacity-10 ui-absolute ui-top-0 ui-left-0 ui-w-full ui-h-full ui-bg-black md:ui-opacity-40"
                    })]
                }), jsxRuntime.jsx("div", {
                    className: "ui-text-16 ui-text-white sm:ui-text-[32px] ui-font-bold ui-z-10",
                    children: r.faqSupport
                }), jsxRuntime.jsx("div", {
                    className: "ui-w-[90%] sm:ui-w-[460px] ui-leading-6 ui-text-[#B2B2B2] ui-text-12 md:ui-text-16 ui-z-10 ui-text-center",
                    children: r.generalDescription
                })]
            }), !s && l && (l == null ? void 0 : l.length) > 0 && jsxRuntime.jsxs("div", {
                className: "ui-px-4 ui-gap-2 md:ui-gap-4 ui-items-center ui-flex md:ui-px-0 ui-my-9 ui-w-full sm:ui-w-2/3 ui-lg:w-1/2 ui-text-[10px] md:ui-text-sm ui-text-[#B2B2B2]",
                children: [jsxRuntime.jsx("button", {
                    onClick: () => {
                        m(""), g(!1);
                    },
                    style: {
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        color: "inherit"
                    },
                    children: r.faqSupport
                }), jsxRuntime.jsx("svg", {
                    className: "ui-w-3 ui-h-3 md:ui-w-6 md:ui-h-6",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg",
                    children: jsxRuntime.jsx("path", {
                        d: "M9 5L15 12L9 19",
                        stroke: "#B2B2B2",
                        strokeWidth: "1.5",
                        strokeLinecap: "round",
                        strokeLinejoin: "round"
                    })
                }), jsxRuntime.jsx("span", {
                    children: l
                })]
            }), !n && jsxRuntime.jsxs("div", {
                className: "ui-px-4 md:ui-px-0 ui-w-full sm:ui-w-2/3 ui-lg:w-1/2 ui-flex ui-flex-col ui-gap-4 ui-items-center ui-justify-center ui-mb-[40px] sm:ui-mb-[66px]",
                children: [jsxRuntime.jsxs("div", {
                    className: "ui-text-16 sm:ui-text-xl ui-font-bold ui-z-10",
                    children: [l, " ", f || "FAQs"]
                }), jsxRuntime.jsx(ut, {
                    data: l ? j : p,
                    isLoading: s,
                    handleAmplitudeEvent: d,
                    selectedCategory: l
                })]
            })]
        }), !n && !l && jsxRuntime.jsxs("div", {
            className: "md:ui-border-[1px] md:ui-border-[#181818] ui-w-full sm:ui-w-[1016px] ui-rounded-[20px] ui-flex ui-flex-col ui-py-3 ui-px-2 md:ui-px-4 sm:ui-px-8 ui-items-center ui-justify-center ui-mb-[40px] sm:ui-mb-[66px]",
            children: [jsxRuntime.jsx("div", {
                className: "ui-text-lg sm:ui-text-xl ui-font-bold ui-z-10",
                children: r.faqCategories
            }), jsxRuntime.jsx(dt, {
                tabData: a,
                setSelectedCategory: m,
                defaultTabIndex: i ? 1 : 0,
                translatedStrings: r,
                isLoading: s,
                handleAmplitudeEvent: d,
                scrollToTop: _,
                faqTextAppend: f || "FAQs"
            })]
        }), e ? null : jsxRuntime.jsxs(jsxRuntime.Fragment, {
            children: [n && jsxRuntime.jsx(lt, {
                translatedStrings: r
            }), !n && jsxRuntime.jsx(nt, {
                translatedStrings: r,
                setSelectedCategory: m,
                setIsSupportPage: g,
                handleAmplitudeEvent: d,
                scrollToTop: _
            })]
        })]
    })
};
var xe = {
        background: "linear-gradient(179deg, #E7C946 0%, #CF8330 100%)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
    },
    Xa = ({
        crownImgPath: e,
        tickGoldenImgPath: t,
        goldCircle: i,
        children: r
    }) => jsxRuntime.jsxs("div", {
        className: "ui-flex ui-flex-col ui-gap-y-4",
        children: [jsxRuntime.jsxs("div", {
            className: "ui-grid ui-gap-y-2",
            children: [jsxRuntime.jsxs("h1", {
                className: "ui-flex ui-justify-center ui-items-center ui-gap-x-2 ui-text-20 ui-leading-7",
                children: [jsxRuntime.jsxs("p", {
                    children: ["Become a", " ", jsxRuntime.jsx("span", {
                        style: xe,
                        className: "ui-font-bold ",
                        children: "Loco VIP"
                    })]
                }), jsxRuntime.jsx("img", {
                    src: e,
                    alt: "crown",
                    height: "20px",
                    width: "20px"
                })]
            }), jsxRuntime.jsx("p", {
                className: "ui-text-14 ui-italic ui-text-center ui-leading-5",
                children: "Join the exclusive club and get many benefits!"
            })]
        }), r, jsxRuntime.jsxs("div", {
            className: "ui-grid ui-gap-y-4 ui-p-3 ui-rounded-lg ui-border ui-border-[#4A4A4A] ui-bg-[#1F1F1F] ui-text-14 my-4",
            children: [jsxRuntime.jsxs("div", {
                className: "ui-flex ui-items-center ui-justify-between ui-text-14 ui-font-bold ui-leading-5",
                children: [jsxRuntime.jsx("p", {
                    children: "What you get:"
                }), jsxRuntime.jsx("p", {
                    style: xe,
                    className: "ui-uppercase",
                    children: "LOCO VIP"
                })]
            }), jsxRuntime.jsxs("div", {
                className: "ui-flex ui-flex-col ui-gap-y-3 ui-text-14",
                children: [jsxRuntime.jsxs("div", {
                    className: "ui-flex ui-items-center ui-justify-between",
                    children: [jsxRuntime.jsx("p", {
                        children: "Access to VIP leaderboard"
                    }), jsxRuntime.jsx("img", {
                        src: t,
                        alt: "tick",
                        height: "20px",
                        width: "20px"
                    })]
                }), jsxRuntime.jsxs("div", {
                    className: "ui-flex ui-items-center ui-justify-between",
                    children: [jsxRuntime.jsx("p", {
                        children: "Gifts for High Ranks on VIP Leaderboard"
                    }), jsxRuntime.jsx("img", {
                        src: t,
                        alt: "tick",
                        height: "20px",
                        width: "20px"
                    })]
                }), jsxRuntime.jsxs("div", {
                    className: "ui-flex ui-items-center ui-justify-between",
                    children: [jsxRuntime.jsx("p", {
                        children: "VIP Chat Badge"
                    }), jsxRuntime.jsx("img", {
                        src: t,
                        alt: "tick",
                        height: "20px",
                        width: "20px"
                    })]
                }), jsxRuntime.jsxs("div", {
                    className: "ui-flex ui-items-center ui-justify-between",
                    children: [jsxRuntime.jsx("p", {
                        children: "Special Username Color"
                    }), jsxRuntime.jsx("img", {
                        src: t,
                        alt: "tick",
                        height: "20px",
                        width: "20px"
                    })]
                }), jsxRuntime.jsxs("div", {
                    className: "ui-flex ui-items-center ui-justify-between",
                    children: [jsxRuntime.jsx("p", {
                        children: "Stand out with VIP Stickers"
                    }), jsxRuntime.jsx("img", {
                        src: t,
                        alt: "tick",
                        height: "20px",
                        width: "20px"
                    })]
                }), jsxRuntime.jsxs("div", {
                    className: "ui-flex ui-items-center ui-justify-between",
                    children: [jsxRuntime.jsx("p", {
                        children: "Enjoy Ad-Free Viewing "
                    }), jsxRuntime.jsx("img", {
                        src: t,
                        alt: "tick",
                        height: "20px",
                        width: "20px"
                    })]
                })]
            })]
        }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsxs("p", {
                className: "ui-text-20 ui-font-bold ui-text-center ui-mb-4",
                children: [jsxRuntime.jsx("span", {
                    style: xe,
                    children: " How to become a VIP?"
                }), " "]
            }), jsxRuntime.jsxs("div", {
                className: "ui-grid ui-grid-cols-[20px,auto] ui-grid-rows-[repeat(3,50px)] ui-gap-x-2 ui-items-baseline ui-text-14",
                children: [jsxRuntime.jsxs("div", {
                    className: "ui-flex ui-flex-col ui-items-center ui-gap-y-1",
                    children: [jsxRuntime.jsx("div", {
                        className: "ui-h-5 ui-w-5 ui-rounded-full ui-flex ui-justify-center ui-items-center ui-text-[#1F1F1F] ui-font-bold ui-bg-cover ui-bg-center ui-bg-no-repeat before:ui-content",
                        style: {
                            backgroundImage: `url(${i})`
                        },
                        children: "1"
                    }), jsxRuntime.jsx("div", {
                        className: "ui-w-[1px] ui-h-[21px]",
                        style: {
                            background: "linear-gradient(180deg, #E7C946 0%, #CF8330 100%)"
                        }
                    })]
                }), jsxRuntime.jsxs("p", {
                    children: ["Go to the ", jsxRuntime.jsx("strong", {
                        className: "ui-font-bold",
                        children: "Wallet"
                    }), " section of the Loco app"]
                }), jsxRuntime.jsxs("div", {
                    className: "ui-flex ui-flex-col ui-items-center ui-gap-y-1",
                    children: [jsxRuntime.jsx("div", {
                        className: "ui-h-5 ui-w-5 ui-rounded-full ui-flex ui-justify-center ui-items-center ui-text-[#1F1F1F] ui-font-bold ui-bg-cover ui-bg-center ui-bg-no-repeat before:ui-content",
                        style: {
                            backgroundImage: `url(${i})`
                        },
                        children: "2"
                    }), jsxRuntime.jsx("div", {
                        className: "ui-w-[1px] ui-h-[21px]",
                        style: {
                            background: "linear-gradient(180deg, #E7C946 0%, #CF8330 100%)"
                        }
                    })]
                }), jsxRuntime.jsxs("p", {
                    children: ["Click on ", jsxRuntime.jsx("strong", {
                        className: "ui-font-bold",
                        children: "Buy Diamonds"
                    }), " to access the Diamond Store or click on Go To Store below"]
                }), jsxRuntime.jsxs("div", {
                    className: "ui-flex ui-flex-col ui-items-center ui-gap-y-1",
                    children: [jsxRuntime.jsx("div", {
                        className: "ui-h-5 ui-w-5 ui-rounded-full ui-flex ui-justify-center ui-items-center ui-text-[#1F1F1F] ui-font-bold ui-bg-cover ui-bg-center ui-bg-no-repeat before:ui-content",
                        style: {
                            backgroundImage: `url(${i})`
                        },
                        children: "3"
                    }), jsxRuntime.jsx("div", {
                        className: "ui-w-[1px] ui-h-[21px]",
                        style: {
                            background: "linear-gradient(180deg, #E7C946 0%, #CF8330 100%)"
                        }
                    })]
                }), jsxRuntime.jsxs("p", {
                    children: ["Purchase", " ", jsxRuntime.jsxs("strong", {
                        className: "ui-font-bold",
                        children: [" ", "any of the eligible bundles,", " "]
                    }), "marked with VIP tag"]
                }), jsxRuntime.jsx("div", {
                    className: "ui-h-5 ui-w-5 ui-rounded-full ui-flex ui-justify-center ui-items-center ui-text-[#1F1F1F] ui-font-bold ui-bg-cover ui-bg-center ui-bg-no-repeat",
                    style: {
                        backgroundImage: `url(${i})`
                    },
                    children: "4"
                }), jsxRuntime.jsxs("div", {
                    className: "ui-flex ui-flex-wrap",
                    children: ["Enjoy the benefits of", jsxRuntime.jsxs("span", {
                        style: xe,
                        className: "ui-font-bold ui-mx-2 ui-flex ui-items-center ui-whitespace-nowrap ui-gap-x-2",
                        children: ["VIP Membership", " ", jsxRuntime.jsx("img", {
                            src: e,
                            alt: "crown",
                            height: "18px",
                            width: "18px"
                        })]
                    })]
                })]
            })]
        })]
    });
var W = {
        background: "linear-gradient(179deg, #E7C946 0%, #CF8330 100%)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
    },
    eo = ({
        crownImgPath: e,
        tickGoldenImgPath: t,
        goldCircle: i,
        goldCoinImgPath: r,
        bgGradientImgPath: u,
        openVipDiamondStore: d,
        openBecomeVipModal: f
    }) => {
        let p = Ni.useRef(null),
            a = Ni.useRef(null),
            [o, s] = Ni.useState(!0),
            l = () => {
                var n;
                (n = p.current) == null || n.scrollTo({
                    top: a.current.offsetTop - 55,
                    behavior: "smooth"
                }), s(!1);
            };

        function m() {
            let n = p.current.scrollHeight,
                g = p.current.clientHeight;
            p.current.scrollTop + g + 10 >= n && s(!1);
        }
        return jsxRuntime.jsxs("div", {
            className: "ui-flex ui-flex-col ui-gap-y-4 ui-h-full ui-overflow-scroll",
            ref: p,
            onScroll: m,
            children: [o ? jsxRuntime.jsxs("div", {
                className: "ui-fixed ui-bottom-0 -ui-ml-4 ui-w-full ui-z-10 ui-flex ui-items-center ui-justify-between ui-gap-x-2 ui-h-12 ui-px-4 ui-py-2",
                style: {
                    background: `url(${u})`,
                    backgroundSize: "100% 100%"
                },
                children: [jsxRuntime.jsxs("p", {
                    className: "ui-text-12",
                    children: ["Learn how to become a", " ", jsxRuntime.jsx("span", {
                        className: "ui-font-bold",
                        style: W,
                        children: "VIP member"
                    }), " ", "and receive gifts"]
                }), jsxRuntime.jsx("button", {
                    className: "ui-text-10 ui-py-2 ui-px-4 ui-rounded-lg ui-whitespace-nowrap",
                    onClick: l,
                    style: {
                        background: "linear-gradient(180deg, #D89D39 0%, #A96500 100%)"
                    },
                    children: "Learn more"
                })]
            }) : null, jsxRuntime.jsxs("div", {
                className: "ui-grid ui-gap-y-2",
                children: [jsxRuntime.jsxs("div", {
                    className: "ui-flex ui-justify-center ui-items-center ui-gap-x-2",
                    children: [jsxRuntime.jsxs("p", {
                        children: ["Become a", " ", jsxRuntime.jsx("span", {
                            style: W,
                            className: "ui-font-bold",
                            children: "Loco VIP"
                        })]
                    }), jsxRuntime.jsx("img", {
                        src: e,
                        alt: "crown",
                        height: "20px",
                        width: "20px"
                    })]
                }), jsxRuntime.jsx("p", {
                    className: "ui-text-14 ui-italic ui-text-center",
                    children: "Join the exclusive club and get many benefits!"
                })]
            }), jsxRuntime.jsxs("div", {
                className: "ui-grid ui-gap-y-4 ui-p-3 ui-rounded-lg ui-border ui-border-[#4A4A4A] ui-bg-[#1F1F1F] ui-text-14",
                children: [jsxRuntime.jsxs("div", {
                    className: "ui-flex ui-items-center ui-justify-between ui-text-14 ui-font-bold",
                    children: [jsxRuntime.jsx("p", {
                        children: "What you get:"
                    }), jsxRuntime.jsx("p", {
                        style: W,
                        className: "ui-uppercase",
                        children: "LOCO VIP"
                    })]
                }), jsxRuntime.jsxs("div", {
                    className: "ui-flex ui-flex-col ui-gap-y-3 ui-text-14",
                    children: [jsxRuntime.jsxs("div", {
                        className: "ui-flex ui-items-center ui-justify-between",
                        children: [jsxRuntime.jsx("p", {
                            children: "Access to VIP leaderboard"
                        }), jsxRuntime.jsx("img", {
                            src: t,
                            alt: "tick",
                            height: "20px",
                            width: "20px"
                        })]
                    }), jsxRuntime.jsxs("div", {
                        className: "ui-flex ui-items-center ui-justify-between",
                        children: [jsxRuntime.jsx("p", {
                            children: "Enjoy Ad-Free Viewing"
                        }), jsxRuntime.jsx("img", {
                            src: t,
                            alt: "tick",
                            height: "20px",
                            width: "20px"
                        })]
                    }), jsxRuntime.jsxs("div", {
                        className: "ui-flex ui-items-center ui-justify-between",
                        children: [jsxRuntime.jsx("p", {
                            children: "Stand out with VIP Stickers"
                        }), jsxRuntime.jsx("img", {
                            src: t,
                            alt: "tick",
                            height: "20px",
                            width: "20px"
                        })]
                    }), jsxRuntime.jsx("p", {
                        style: W,
                        className: "ui-text-10 ui-italic",
                        children: "and many more..."
                    })]
                })]
            }), jsxRuntime.jsxs("div", {
                ref: a,
                children: [jsxRuntime.jsxs("p", {
                    className: "ui-text-14 ui-text-center ui-mb-4",
                    children: ["How to become a", " ", jsxRuntime.jsx("span", {
                        style: W,
                        className: "ui-italic",
                        children: "VIP Member"
                    }), "?", " "]
                }), jsxRuntime.jsxs("div", {
                    className: "ui-grid ui-grid-cols-[20px,auto] ui-grid-rows-[repeat(3,50px)] ui-gap-x-2 ui-items-baseline ui-text-14",
                    children: [jsxRuntime.jsxs("div", {
                        className: "ui-flex ui-flex-col ui-items-center ui-gap-y-1",
                        children: [jsxRuntime.jsx("div", {
                            className: "ui-h-5 ui-w-5 ui-rounded-full ui-flex ui-justify-center ui-items-center ui-text-[#1F1F1F] ui-font-bold ui-bg-cover ui-bg-center ui-bg-no-repeat before:ui-content",
                            style: {
                                backgroundImage: `url(${i})`
                            },
                            children: "1"
                        }), jsxRuntime.jsx("div", {
                            className: "ui-w-[1px] ui-h-[21px]",
                            style: {
                                background: "linear-gradient(180deg, #E7C946 0%, #CF8330 100%)"
                            }
                        })]
                    }), jsxRuntime.jsx("p", {
                        children: "Go to the Wallet section of the Loco app"
                    }), jsxRuntime.jsxs("div", {
                        className: "ui-flex ui-flex-col ui-items-center ui-gap-y-1",
                        children: [jsxRuntime.jsx("div", {
                            className: "ui-h-5 ui-w-5 ui-rounded-full ui-flex ui-justify-center ui-items-center ui-text-[#1F1F1F] ui-font-bold ui-bg-cover ui-bg-center ui-bg-no-repeat before:ui-content",
                            style: {
                                backgroundImage: `url(${i})`
                            },
                            children: "2"
                        }), jsxRuntime.jsx("div", {
                            className: "ui-w-[1px] ui-h-[21px]",
                            style: {
                                background: "linear-gradient(180deg, #E7C946 0%, #CF8330 100%)"
                            }
                        })]
                    }), jsxRuntime.jsxs("p", {
                        children: ["Click on ", jsxRuntime.jsx("span", {
                            className: "ui-font-bold",
                            children: "Buy Diamonds"
                        }), " to access the Diamond Store."]
                    }), jsxRuntime.jsxs("div", {
                        className: "ui-flex ui-flex-col ui-items-center ui-gap-y-1",
                        children: [jsxRuntime.jsx("div", {
                            className: "ui-h-5 ui-w-5 ui-rounded-full ui-flex ui-justify-center ui-items-center ui-text-[#1F1F1F] ui-font-bold ui-bg-cover ui-bg-center ui-bg-no-repeat before:ui-content",
                            style: {
                                backgroundImage: `url(${i})`
                            },
                            children: "3"
                        }), jsxRuntime.jsx("div", {
                            className: "ui-w-[1px] ui-h-[21px]",
                            style: {
                                background: "linear-gradient(180deg, #E7C946 0%, #CF8330 100%)"
                            }
                        })]
                    }), jsxRuntime.jsxs("p", {
                        children: ["Purchase any of the eligible bundles,", " ", jsxRuntime.jsx("span", {
                            className: "ui-font-bold",
                            children: "marked with VIP tag"
                        })]
                    }), jsxRuntime.jsx("div", {
                        className: "ui-h-5 ui-w-5 ui-rounded-full ui-flex ui-justify-center ui-items-center ui-text-[#1F1F1F] ui-font-bold ui-bg-cover ui-bg-center ui-bg-no-repeat",
                        style: {
                            backgroundImage: `url(${i})`
                        },
                        children: "4"
                    }), jsxRuntime.jsxs("p", {
                        className: "ui-flex ui-items-center",
                        children: ["Enjoy the benefits of", jsxRuntime.jsx("span", {
                            style: W,
                            className: "ui-font-bold ui-mx-2",
                            children: "VIP Membership"
                        }), jsxRuntime.jsx("img", {
                            src: e,
                            alt: "crown",
                            height: "18px",
                            width: "18px"
                        })]
                    })]
                })]
            }), jsxRuntime.jsxs("div", {
                className: "ui-border ui-border-[#D39733] ui-rounded-md ui-p-4 flex ui-justify-between ui-items-center",
                style: {
                    background: "linear-gradient(92deg, #2C2C2C 1.34%, #020202 99.08%)"
                },
                children: [jsxRuntime.jsxs("div", {
                    className: "ui-flex ui-flex-col ui-gap-y-[2px]",
                    children: [jsxRuntime.jsx("p", {
                        className: "ui-text-10 ui-font-semibold",
                        children: "Become a member by buying"
                    }), jsxRuntime.jsx("p", {
                        className: "ui-font-bold",
                        style: W,
                        children: "VIP Diamond Packs"
                    })]
                }), jsxRuntime.jsx("button", {
                    className: "ui-uppercase ui-text-12 ui-font-bold ui-px-6 ui-py-2 ui-rounded",
                    style: {
                        background: "linear-gradient(180deg, #D89D39 0%, #A96500 100%)"
                    },
                    onClick: d,
                    children: "GO TO STORE"
                })]
            }), jsxRuntime.jsxs("div", {
                className: "ui-flex ui-justify-between ui-items-center ui-gap-x-2",
                children: [jsxRuntime.jsx("div", {
                    className: "ui-bg-[#dca83c4d] ui-h-[1px] w-full"
                }), jsxRuntime.jsx("span", {
                    style: W,
                    className: "ui-text-12 ui-font-bold",
                    children: "OR"
                }), jsxRuntime.jsx("div", {
                    className: "ui-bg-[#dca83c4d] ui-h-[1px] w-full"
                })]
            }), jsxRuntime.jsxs("div", {
                className: "ui-border ui-border-[#D39733] ui-rounded-md ui-p-4 flex ui-justify-between ui-items-center ui-mb-24",
                style: {
                    background: "linear-gradient(92deg, #2C2C2C 1.34%, #020202 99.08%)"
                },
                children: [jsxRuntime.jsxs("div", {
                    className: "ui-flex ui-flex-col ui-gap-y-[2px]",
                    children: [jsxRuntime.jsx("p", {
                        className: "ui-text-10 ui-font-semibold",
                        children: "Become a member for"
                    }), jsxRuntime.jsxs("p", {
                        className: "ui-font-bold ui-flex ui-items-center ui-gap-x-[6px]",
                        style: W,
                        children: [jsxRuntime.jsx("img", {
                            src: r,
                            alt: "gold-coin",
                            height: "20px",
                            width: "20px"
                        }), "2,50,000 Gold"]
                    })]
                }), jsxRuntime.jsx("button", {
                    className: "ui-uppercase ui-text-12 ui-font-bold ui-px-6 ui-py-2 ui-rounded",
                    style: {
                        background: "linear-gradient(180deg, #D89D39 0%, #A96500 100%)"
                    },
                    onClick: f,
                    children: "BECOME VIP"
                })]
            })]
        })
    };

function ro({
    isVipLeaderboardActive: e,
    leaderboarsStartTime: t,
    isPreviousDay: i,
    emptyLeaderboardImgPath: r,
    leaderboardStandingImgPath: u,
    prevRankMedalImgPath: d,
    userPrevRank: f
}) {
    return e ? jsxRuntime.jsx("div", {
        className: "ui-w-full ui-flex ui-justify-center ui-items-center ui-text-center ui-overflow-auto ui-h-[calc(100%-120px)]",
        children: jsxRuntime.jsxs("div", {
            className: "ui-w-full ui-h-full ui-flex ui-flex-col ui-justify-center ui-items-center",
            style: {
                maxHeight: "20rem",
                maxWidth: "30rem"
            },
            children: [jsxRuntime.jsx("img", {
                className: "ui-mb-4",
                src: r,
                style: {
                    minHeight: "68px"
                },
                height: "68px",
                width: "68px",
                alt: "gift"
            }), jsxRuntime.jsx("span", {
                className: "ui-text-base ui-font-bold ui-mb-2",
                children: i ? "Oops, nothing here!" : "It's a bit quiet in here"
            }), jsxRuntime.jsx("span", {
                className: "ui-text-xs ui-w-4/6 ui-text-[#999999]",
                children: i ? "Check out the current leaderboard!" : " Score points receive gifts"
            })]
        })
    }) : jsxRuntime.jsx("div", {
        className: "ui-flex ui-justify-center ui-text-center ui-overflow-hidden ui-pt-4",
        children: jsxRuntime.jsxs("div", {
            className: "ui-flex ui-flex-col ui-items-center ui-pt-4 ui-h-[70vh] ui-overflow-scroll",
            children: [jsxRuntime.jsx("img", {
                className: "ui-mb-4 ui-min-h-[68px]",
                src: u,
                height: "68px",
                width: "68px",
                alt: "leaderboard-setting-up"
            }), jsxRuntime.jsx("p", {
                className: "ui-font-bold",
                children: "We are setting up a new leaderboard"
            }), jsxRuntime.jsxs("p", {
                className: `ui-text-[#999999] mt-2 ui-text-14 ${f>0?"":"ui-mb-16"}`,
                children: ["The new leaderboard begins daily at", " ", jsxRuntime.jsxs("span", {
                    className: "ui-text-white ui-whitespace-nowrap",
                    children: [t, "."]
                }), jsxRuntime.jsx("br", {}), " The final rankings of the leaderboard are published at", " ", jsxRuntime.jsx("span", {
                    className: "ui-text-white ui-whitespace-nowrap",
                    children: "5 PM the next day."
                }), jsxRuntime.jsx("br", {}), "Please visit your VIP page to see your final rankings and receive your gifts."]
            }), f > 0 ? jsxRuntime.jsxs("div", {
                className: "ui-flex ui-items-center ui-gap-x-2 ui-py-3 ui-px-4 ui-mt-4 ui-mb-16 ui-w-full",
                style: {
                    background: "linear-gradient(88deg, #393B3E 0%, #232326 100%)"
                },
                children: [jsxRuntime.jsx("img", {
                    src: d,
                    alt: "",
                    height: "24px",
                    width: "24px"
                }), jsxRuntime.jsxs("p", {
                    children: ["Your Previous Rank:", " ", jsxRuntime.jsx("span", {
                        className: "ui-font-bold",
                        children: f
                    })]
                })]
            }) : null]
        })
    })
}

function uo({
    crownImgPath: e,
    goldCoinImgPath: t,
    diamondImgPath: i,
    rewardSchema: r,
    rewardConfig: u,
    rewardCurrencyType: d
}) {
    return jsxRuntime.jsx("div", {
        className: "ui-h-full ui-overflow-scroll",
        children: jsxRuntime.jsxs("div", {
            className: "ui-grid ui-gap-y-4",
            children: [jsxRuntime.jsxs("div", {
                className: "ui-flex ui-bg-[#1F1F1F] ui-border ui-border-[#4A4A4A] ui-rounded-lg",
                children: [jsxRuntime.jsxs("div", {
                    className: "ui-flex ui-flex-col ui-gap-y-2 ui-items-center ui-justify-center ui-p-4 ui-border-r ui-border-[#FFFFFF] ui-border-opacity-10",
                    children: [jsxRuntime.jsx("img", {
                        src: e,
                        alt: "crown",
                        height: "60px",
                        width: "60px"
                    }), jsxRuntime.jsxs("p", {
                        className: "ui-text-14 ui-text-center ui-font-bold",
                        children: ["VIP", jsxRuntime.jsx("br", {}), " Leaderboard"]
                    })]
                }), jsxRuntime.jsxs("div", {
                    className: "ui-px-4 ui-py-3 ui-text-12 ui-grid ui-gap-y-2 ui-w-full",
                    children: [jsxRuntime.jsxs("div", {
                        children: [jsxRuntime.jsx("p", {
                            className: "ui-text-[#CCCCCC]",
                            children: "Send Diamond Stickers"
                        }), jsxRuntime.jsxs("p", {
                            className: "ui-flex ui-items-center ui-font-bold",
                            children: ["1", jsxRuntime.jsx("img", {
                                src: i,
                                className: "ui-mx-[2px] ui-min-h-[12px] ui-min-w-[12px]",
                                alt: "diamond-coin",
                                height: "12px",
                                width: "12px"
                            }), "= ", u.diamond, " points"]
                        })]
                    }), jsxRuntime.jsxs("div", {
                        children: [jsxRuntime.jsx("p", {
                            className: "ui-text-[#CCCCCC]",
                            children: "Send Gold Stickers"
                        }), jsxRuntime.jsxs("p", {
                            className: "ui-flex ui-items-center ui-font-bold",
                            children: ["1", jsxRuntime.jsx("img", {
                                src: t,
                                className: "ui-mx-[2px]",
                                alt: "gold-coin",
                                height: "10px",
                                width: "10px"
                            }), "= ", u.gold, " points"]
                        })]
                    }), jsxRuntime.jsxs("div", {
                        children: [jsxRuntime.jsx("p", {
                            className: "ui-text-[#CCCCCC] ui-leading-4",
                            children: "Watch live stream on Loco App"
                        }), jsxRuntime.jsxs("p", {
                            className: "ui-font-bold",
                            children: ["1 min = ", u.watch_per_min, " Points"]
                        })]
                    })]
                })]
            }), jsxRuntime.jsxs("div", {
                className: "ui-bg-[#1F1F1F] ui-border ui-border-[#4A4A4A] ui-rounded-lg ui-mb-20",
                children: [jsxRuntime.jsxs("div", {
                    className: "ui-flex ui-items-center ui-justify-between ui-py-2 ui-px-4 ui-border-b ui-border-[#FFFFFF] ui-border-opacity-10 ui-text-12 ui-text-[#999999]",
                    children: [jsxRuntime.jsx("span", {
                        children: "Rank"
                    }), jsxRuntime.jsx("span", {
                        children: "Gifts worth"
                    })]
                }), jsxRuntime.jsx("div", {
                    className: "ui-p-4 ui-grid ui-gap-y-4",
                    children: r.map((f, p) => {
                        var a, o;
                        return jsxRuntime.jsxs("div", {
                            className: "ui-flex ui-items-center ui-justify-between",
                            children: [p < 3 && f.start_rank === f.end_rank ? jsxRuntime.jsx("div", {
                                className: "ui-h-6 ui-w-6 ui-min-w-[24px] ui-rounded-full ui-text-center ui-font-bold ui-flex ui-justify-center ui-items-center",
                                style: {
                                    background: "linear-gradient(90deg, #393B3E 0%, #232326 100%)"
                                },
                                children: f.start_rank
                            }) : jsxRuntime.jsx("span", {
                                className: "ui-text-12 ui-text-[#CCCCCC] ui-font-semibold",
                                children: f.start_rank == f.end_rank ? `#${f.start_rank}` : `#${f.start_rank}-${f.end_rank}`
                            }), jsxRuntime.jsxs("p", {
                                className: "ui-text-14 ui-font-bold ui-flex ui-items-center",
                                children: [d === 10 ? jsxRuntime.jsx("img", {
                                    src: t,
                                    className: "ui-mr-[2px] ui-max-h-[10px] ui-max-w-[10px]",
                                    alt: "gold-coin",
                                    height: "10px",
                                    width: "10px"
                                }) : d === 20 ? jsxRuntime.jsx("img", {
                                    src: i,
                                    className: "ui-mr-[2px] ui-max-h-[10px] ui-max-w-[10px]",
                                    alt: "gold-coin",
                                    height: "10px",
                                    width: "10px"
                                }) : d === 30 ? "\u20B9" : "", jsxRuntime.jsx("span", {
                                    children: (o = (a = f.rewards[0]) == null ? void 0 : a.reward_amount) != null ? o : ""
                                })]
                            })]
                        }, p)
                    })
                })]
            })]
        })
    })
}
var bt = {
    1: "linear-gradient(271deg, #6D3D03 0%, #040402 83.88%)",
    2: "linear-gradient(271deg, #424D5A 0%, #040402 83.88%)",
    3: "linear-gradient(271deg, #692370 0%, #040402 83.88%)",
    99: "linear-gradient(90deg, #393B3E 0%, #232326 100%)"
};

function no({
    leaderboardData: e,
    currencyType: t,
    rankingMedalsImg: i,
    crownImgPath: r,
    goldCoinImgPath: u,
    diamondImgPath: d,
    loadMore: f
}) {
    let p = a => a.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return jsxRuntime.jsx("div", {
        className: "ui-flex ui-flex-col ui-gap-y-4",
        children: e.map((a, o) => {
            var s;
            return jsxRuntime.jsx("div", {
                className: `${a.rank<4?"ui-h-12":"ui-h-[30px]"} ${o===e.length-1?f?"ui-mb-5":"ui-mb-44":""}`,
                style: {
                    background: a.rank < 4 ? bt[a.rank] : "none"
                },
                children: jsxRuntime.jsxs("div", {
                    className: "ui-h-full ui-flex ui-justify-between ui-w-full ui-px-2",
                    children: [jsxRuntime.jsxs("div", {
                        className: "ui-flex ui-items-center ui-w-3/4",
                        children: [a.rank > 3 ? jsxRuntime.jsx("div", {
                            className: "ui-h-6 ui-w-6 ui-rounded-full ui-ml-1 ui-text-center ui-font-bold ui-flex ui-justify-center ui-items-center",
                            style: {
                                background: bt[99],
                                minWidth: "1.5rem"
                            },
                            children: a.rank
                        }) : jsxRuntime.jsx("img", {
                            src: i[a.rank],
                            className: "ui-w-8 ui-h-8",
                            alt: "medal"
                        }), jsxRuntime.jsxs("div", {
                            className: `ui-w-8 ui-flex ui-justify-center ui-relative ${a.rank<4?"ui-ml-2":"ui-ml-3"}`,
                            children: [a.rank < 4 ? jsxRuntime.jsx("img", {
                                src: r,
                                alt: "crown",
                                height: "16px",
                                width: "16px",
                                className: "ui-absolute ui-rotate-[-15deg] ui-z-10 -ui-top-2 ui-left-0"
                            }) : null, jsxRuntime.jsx("img", {
                                src: a.avatar_url,
                                className: `inline-block bg-gray-500 rounded-full ${a.rank<4?"ui-h-8 ui-w-8":"ui-h-6 ui-w-6"}`,
                                alt: "viewer"
                            })]
                        }), jsxRuntime.jsx("div", {
                            className: "ui-mx-1  ui-ml-2 ui-text-14 ui-font-bold ui-overflow-ellipsis ui-overflow-hidden ui-whitespace-nowrap",
                            children: a != null && a.user_name.length ? a == null ? void 0 : a.user_name : ""
                        })]
                    }), jsxRuntime.jsxs("div", {
                        className: "ui-w-16  ui-h-full ui-flex ui-flex-col ui-justify-center ui-items-end",
                        children: [jsxRuntime.jsxs("p", {
                            className: "ui-text-12 ui-font-bold ui-leading-4 ui-flex ui-items-center",
                            children: [t === 10 ? jsxRuntime.jsx("img", {
                                src: u,
                                className: "ui-mr-[2px] ui-max-h-[10px] ui-max-w-[10px]",
                                alt: "gold-coin",
                                height: "10px",
                                width: "10px"
                            }) : t === 20 ? jsxRuntime.jsx("img", {
                                src: d,
                                className: "ui-mr-[2px] ui-max-h-[10px] ui-max-w-[10px]",
                                alt: "gold-coin",
                                height: "10px",
                                width: "10px"
                            }) : t === 30 ? "\u20B9" : "", jsxRuntime.jsx("span", {
                                children: a.reward_amount
                            })]
                        }), jsxRuntime.jsx("p", {
                            className: "ui-text-10 ui-leading-3 ui-text-[#CCCCCC]",
                            children: p((s = a == null ? void 0 : a.value) != null ? s : "0")
                        })]
                    })]
                })
            }, a == null ? void 0 : a.user_uid)
        })
    })
}
var ht = {
    background: "linear-gradient(180deg, #E7C946 0%, #CF8330 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
};

function mo({
    data: e,
    isLeaderboardDataPresent: t,
    isUserVip: i,
    isPreviousDay: r,
    celebrateHippoImgPath: u,
    crownImgPath: d,
    crownImgProfilePath: f,
    bgGradientImgPath: p,
    infoImgPath: a,
    goldCoinImgPath: o,
    diamondImgPath: s
}) {
    var m, n;
    let l = g => g.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return jsxRuntime.jsxs("div", {
        className: "ui-fixed ui-bottom-0 -ui-ml-4 ui-w-full ui-z-10",
        children: [e.rank > 0 && !i ? jsxRuntime.jsxs("div", {
            className: "ui-w-full ui-bg-[#51442B] ui-text-12 ui-italic ui-pl-4 ui-pr-6 ui-py-[6px] ui-flex ui-items-center ui-gap-x-1",
            children: [jsxRuntime.jsx("img", {
                src: a,
                alt: "info",
                height: "12px",
                width: "12px"
            }), jsxRuntime.jsxs("p", {
                children: ["Your VIP Membership is ", jsxRuntime.jsx("span", {
                    className: "ui-font-bold",
                    children: "expired"
                }), ", renew it to earn points"]
            })]
        }) : null, jsxRuntime.jsx("div", {
            className: "ui-h-12 ui-w-full ui-pl-5 ui-flex ui-justify-between",
            style: {
                background: `url(${p})`,
                backgroundSize: "100% 100%"
            },
            children: e.rank > 0 && t || r ? jsxRuntime.jsxs(jsxRuntime.Fragment, {
                children: [jsxRuntime.jsxs("div", {
                    className: "ui-h-full ui-w-3/4 ui-px-1 ui-flex ui-items-center",
                    children: [jsxRuntime.jsx("div", {
                        className: "ui-h-8 ui-text-center ui-text-base ui-flex ui-justify-center ui-items-center",
                        style: {
                            minWidth: "2rem"
                        },
                        children: (e == null ? void 0 : e.rank) > 0 && t ? e == null ? void 0 : e.rank : "-"
                    }), jsxRuntime.jsxs("div", {
                        className: "ui-relative",
                        children: [e.rank > 0 && e.rank < 4 ? jsxRuntime.jsx("img", {
                            src: f,
                            alt: "crown",
                            height: "16px",
                            width: "16px",
                            className: "ui-absolute ui-rotate-[-15deg] ui-z-10 -ui-top-2 ui-left-2"
                        }) : null, jsxRuntime.jsx("img", {
                            src: (m = e == null ? void 0 : e.avatar_url) != null ? m : "",
                            className: "ui-h-8 ui-w-8 ui-bg-gray-500 ui-rounded-full ui-mx-2",
                            style: {
                                minWidth: "2rem"
                            },
                            alt: "avatar"
                        })]
                    }), jsxRuntime.jsx("div", {
                        className: "ui-mx-1 ui-text-sm ui-overflow-hidden ui-overflow-ellipsis ui-whitespace-nowrap ui-font-bold",
                        children: "YOU"
                    })]
                }), jsxRuntime.jsxs("div", {
                    className: "ui-h-full ui-flex ui-flex-col ui-justify-center ui-items-end ui-w-20  ui-pr-6",
                    children: [jsxRuntime.jsxs("p", {
                        className: "ui-text-12 ui-font-bold ui-leading-4 ui-flex ui-items-center",
                        style: ht,
                        children: [e.currencyType === 10 ? jsxRuntime.jsx("img", {
                            src: o,
                            className: "ui-mr-[2px] ui-max-h-[10px] ui-max-w-[10px]",
                            alt: "gold-coin",
                            height: "10px",
                            width: "10px"
                        }) : e.currencyType === 20 ? jsxRuntime.jsx("img", {
                            src: s,
                            className: "ui-mr-[2px] ui-max-h-[10px] ui-max-w-[10px]",
                            alt: "gold-coin",
                            height: "10px",
                            width: "10px"
                        }) : e.currencyType === 30 ? "\u20B9" : "", jsxRuntime.jsx("span", {
                            children: e.reward_amount
                        })]
                    }), jsxRuntime.jsx("p", {
                        className: "ui-text-10 ui-leading-3 ui-text-[#CCCCCC]",
                        children: !e.value && r ? "-" : l((n = e.value) != null ? n : 0)
                    })]
                })]
            }) : i ? jsxRuntime.jsxs("div", {
                className: "ui-flex ui-items-center ui-gap-x-1 ui-text-14 ui-font-bold",
                children: [jsxRuntime.jsx("img", {
                    src: u,
                    width: "40px",
                    height: "32px",
                    alt: "celebrating-hippo"
                }), "\u2002Earn points to join the race!"]
            }) : jsxRuntime.jsxs("span", {
                className: "ui-flex ui-items-center ui-gap-x-1 ui-text-14",
                children: [jsxRuntime.jsx("img", {
                    src: d,
                    alt: "crown",
                    height: "32px",
                    width: "32px"
                }), jsxRuntime.jsxs("p", {
                    children: ["Become a", " ", jsxRuntime.jsx("span", {
                        style: ht,
                        className: "ui-font-bold",
                        children: "VIP member"
                    }), " ", "and receive gifts"]
                })]
            })
        })]
    })
}
/*! Bundled license information:

lodash-es/lodash.js:
  (**
   * @license
   * Lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="es" -o ./`
   * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   *)
*/

exports.AutoChatScroll = Ta;
exports.AutoPlayImageCarousel = Zi;
exports.Button = Wi;
exports.CvaButton = Vi;
exports.HelpAndSupport = Ua;
exports.HowToBecomeVIP = Xa;
exports.ImageCarousel = Qi;
exports.MyMenu = ur;
exports.PointsTableUI = er;
exports.Tabs = Ji;
exports.VipDetailsTab = eo;
exports.VipEmptyRankRows = ro;
exports.VipGuidelinesTab = uo;
exports.VipRankRows = no;
exports.VipYourRanking = mo;
exports.WinnerDayScreen = tr;
exports.WinnerTable = jt;