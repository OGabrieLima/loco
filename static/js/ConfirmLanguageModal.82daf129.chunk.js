(this.webpackJsonpdashboard = this.webpackJsonpdashboard || []).push([
    [19], {
        1233: function(e, o, a) {
            "use strict";
            a.r(o);
            var n = a(7),
                t = a(22),
                r = a(19),
                i = a(122),
                c = a(142),
                l = a(71),
                p = a(360),
                s = a(41),
                d = a(82),
                g = a(29),
                x = a(10),
                b = (a(1), a(199)),
                u = a(4),
                h = a(0);
            o.default = () => {
                var e;
                const o = Object(u.c)(),
                    {
                        i18n: a,
                        t: j
                    } = Object(b.a)(),
                    {
                        me: m
                    } = Object(u.d)((e => e.login)),
                    {
                        previousVisit: f,
                        langToBeChanged: _
                    } = Object(u.d)((e => e.app)),
                    O = () => {
                        o(Object(t.j)(null))
                    },
                    v = e => {
                        e = Object(g.a)(e), a.changeLanguage(e), (e => {
                            const o = {
                                source_name: f,
                                platform: x.b.platform,
                                username: null === m || void 0 === m ? void 0 : m.username,
                                userid: null === m || void 0 === m ? void 0 : m.user_uid,
                                user_type: null === m || void 0 === m ? void 0 : m.user_type,
                                language_client: e,
                                source: "profile_section" === origin ? "settings" : "onboarding",
                                trigger: "user_choice"
                            };
                            x.a.sendAmplitudeData(x.b.language_change_client, { ...o
                            })
                        })(e), Object(n.Zb)({
                            language: e
                        }).then((() => {
                            o(Object(s.A)({
                                language: e
                            }))
                        })), O()
                    };
                if (!_) return Object(h.jsx)(h.Fragment, {});
                const k = (null === (e = d.b[_]) || void 0 === e ? void 0 : e.nativeName) || `${j("change_language.language_text")} - ${_}`;
                return Object(h.jsxs)(h.Fragment, {
                    children: [Object(h.jsx)(r.a, {
                        position: "fixed",
                        onClick: O,
                        className: "h-screen",
                        width: "100vw",
                        bg: "rgba(0,0,0,0.75)",
                        zIndex: 1e3,
                        top: "0px",
                        bottom: "0px",
                        left: "0px",
                        right: "0px"
                    }), Object(h.jsx)(r.a, {
                        id: "popover-content",
                        className: "popover-content",
                        role: "dialog",
                        "aria-modal": "true",
                        position: ["fixed", "fixed"],
                        top: ["auto", "50%"],
                        bottom: ["0px", "auto"],
                        left: ["0px", "50%"],
                        width: ["100%", "400px"],
                        transform: ["none", "translate(-50%,-50%)"],
                        marginTop: ["0px", "10px"],
                        backgroundColor: "brand.loco-grey-70",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                        borderRadius: ["16px 16px 0px 0px", "16px"],
                        color: "#FFFFFF",
                        fontSize: ["14px", "14px"],
                        fontWeight: "400",
                        zIndex: 1001,
                        lineHeight: "130%",
                        whiteSpace: ["initial", "initial"],
                        children: Object(h.jsxs)(r.a, {
                            display: "flex",
                            p: "24px",
                            flexDirection: "column",
                            gridGap: 2,
                            minWidth: ["auto", "250px"],
                            children: [Object(h.jsxs)(i.a, {
                                justifyContent: "space-between",
                                alignItems: "center",
                                cursor: "pointer",
                                children: [Object(h.jsx)(c.a, {}), Object(h.jsx)(c.a, {
                                    display: ["block"],
                                    position: ["absolute", "absolute"],
                                    top: ["12px"],
                                    right: ["12px"],
                                    children: Object(h.jsx)(l.a, {
                                        name: "crossGray",
                                        cursor: "pointer",
                                        color: "white",
                                        onClick: O,
                                        size: "24px"
                                    })
                                })]
                            }), Object(h.jsxs)(r.a, {
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                children: [Object(h.jsx)(c.a, {
                                    fontSize: "16px",
                                    fontWeight: 600,
                                    textAlign: "center",
                                    children: j("change_language.change_language_to", {
                                        language_full_name: k
                                    })
                                }), Object(h.jsx)(c.a, {
                                    fontSize: "14px",
                                    mt: ["8px", "16px"],
                                    textAlign: "center",
                                    color: "brand.loco-grey-20",
                                    children: j("change_language.change_language_description")
                                }), Object(h.jsxs)(i.a, {
                                    mt: "24px",
                                    gridGap: "16px",
                                    children: [Object(h.jsx)(p.a, {
                                        borderRadius: "10px",
                                        width: "150px",
                                        height: "48px",
                                        fontWeight: "bold",
                                        fontSize: "14px",
                                        lineHeight: "130%",
                                        backgroundColor: "transparent",
                                        _focus: {
                                            backgroundColor: "transparent"
                                        },
                                        _active: {
                                            backgroundColor: "transparent"
                                        },
                                        _hover: {
                                            backgroundColor: "transparent"
                                        },
                                        border: "2px solid",
                                        borderColor: "brand.loco-primary",
                                        color: "brand.loco-primary",
                                        textTransform: "capitalize",
                                        onClick: () => {
                                            O()
                                        },
                                        children: j("change_language.cancel")
                                    }), Object(h.jsx)(p.a, {
                                        borderRadius: "10px",
                                        width: "150px",
                                        height: "48px",
                                        fontWeight: "bold",
                                        fontSize: "14px",
                                        lineHeight: "130%",
                                        backgroundColor: "brand.loco-primary",
                                        _focus: {
                                            backgroundColor: "brand.loco-primary"
                                        },
                                        _active: {
                                            backgroundColor: "brand.loco-primary"
                                        },
                                        _hover: {
                                            backgroundColor: "brand.loco-primary"
                                        },
                                        color: "white",
                                        textTransform: "capitalize",
                                        onClick: () => v(_),
                                        children: j("change_language.confirm")
                                    })]
                                })]
                            })]
                        })
                    })]
                })
            }
        }
    }
]);
//# sourceMappingURL=ConfirmLanguageModal.82daf129.chunk.js.map