(this.webpackJsonpdashboard = this.webpackJsonpdashboard || []).push([
    [24], {
        1231: function(e, t, o) {
            "use strict";
            o.r(t);
            var n = o(122),
                a = o(142),
                r = o(360),
                i = o(130),
                l = o(6),
                s = o(118),
                d = o(10),
                c = o(1),
                p = o(199),
                u = o(4),
                m = o(0);
            t.default = () => {
                const [e, t] = Object(c.useState)(!1), {
                    me: o
                } = Object(u.d)((e => e.login)), {
                    t: _
                } = Object(p.a)(), b = null === o || void 0 === o ? void 0 : o.user_uid, g = s.a.colors.brand["loco-primary"];
                if (Object(c.useEffect)((() => {
                        if (!b) return;
                        const e = window.localStorage.getItem("terms_condition_modal_2023");
                        "ACCEPTED" !== e && "REJECTED" !== e && (d.a.sendAmplitudeData("visit_dashboard_terms", {
                            user_id: b,
                            user_type: o.user_type,
                            username: o.username
                        }), t(!0))
                    }), [b]), !b) return null;
                const x = {
                    user_id: b,
                    user_type: o.user_type,
                    username: o.username
                };
                return Object(m.jsx)(i.a, {
                    isOpen: e,
                    onClose: () => {
                        d.a.sendAmplitudeData("dashboard_terms_accepted", { ...x,
                            ctr_clicked: "dismissed"
                        }), window.localStorage.setItem("terms_condition_modal_2023", "REJECTED"), t(!1)
                    },
                    isCentered: !0,
                    closeOnEsc: !1,
                    closeOnOverlayClick: !1,
                    modalContentStyle: {
                        width: ["80%", "700px"],
                        borderBottomLeftRadius: "12px",
                        borderBottomRightRadius: "12px",
                        position: "relative",
                        top: null,
                        bottom: null,
                        mb: null
                    },
                    modalHeaderStyle: {
                        px: 0,
                        pb: 0
                    },
                    modalBodyStyle: {
                        py: [8, 8],
                        px: [0, 0]
                    },
                    modalBodyComponent: Object(m.jsxs)(n.a, {
                        w: "full",
                        direction: "column",
                        flex: 1,
                        px: [4, 8],
                        py: [2, 4],
                        children: [Object(m.jsx)(a.a, {
                            fontSize: "md",
                            fontWeight: 900,
                            letterSpacing: "1px",
                            children: _("login.annual_terms_page.title")
                        }), Object(m.jsx)("br", {}), Object(m.jsxs)(a.a, {
                            fontSize: "xs",
                            textAlign: "justify",
                            letterSpacing: "1px",
                            children: [_("login.annual_terms_page.description"), " ", Object(m.jsx)("a", {
                                href: l.b.terms,
                                target: "_blank",
                                style: {
                                    textDecoration: "underline",
                                    display: "inline",
                                    color: s.a.colors.brand["loco-primary"]
                                },
                                rel: "noreferrer",
                                children: _("login.annual_terms_page.description_link")
                            }), " ", _("login.annual_terms_page.description2")]
                        }), Object(m.jsx)(r.a, {
                            mt: "20px",
                            rounded: 10,
                            letterSpacing: "1px",
                            px: "4.5rem",
                            py: 1,
                            fontWeight: 700,
                            color: "white",
                            background: g,
                            _hover: {
                                background: g
                            },
                            _active: {
                                background: g,
                                transform: "scale(1.02)"
                            },
                            _focus: {
                                background: g,
                                outline: "none"
                            },
                            onClick: () => {
                                d.a.sendAmplitudeData("dashboard_terms_accepted", { ...x,
                                    ctr_clicked: "accepted"
                                }), window.localStorage.setItem("terms_condition_modal_2023", "ACCEPTED"), t(!1)
                            },
                            children: _("login.annual_terms_page.button_text")
                        })]
                    })
                })
            }
        }
    }
]);
//# sourceMappingURL=TermsAndConditionModal.f311d46a.chunk.js.map