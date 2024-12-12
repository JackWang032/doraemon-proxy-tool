!(function (t, i) {
    'object' == typeof exports && 'object' == typeof module
        ? (module.exports = i())
        : 'function' == typeof define && define.amd
        ? define([], i)
        : 'object' == typeof exports
        ? (exports.sm2 = i())
        : (t.sm2 = i());
})('undefined' != typeof self ? self : this, function () {
    return (function (t) {
        function i(e) {
            if (r[e]) return r[e].exports;
            var n = (r[e] = { i: e, l: !1, exports: {} });
            return t[e].call(n.exports, n, n.exports, i), (n.l = !0), n.exports;
        }
        var r = {};
        return (
            (i.m = t),
            (i.c = r),
            (i.d = function (t, r, e) {
                i.o(t, r) ||
                    Object.defineProperty(t, r, {
                        configurable: !1,
                        enumerable: !0,
                        get: e,
                    });
            }),
            (i.n = function (t) {
                var r =
                    t && t.__esModule
                        ? function () {
                              return t.default;
                          }
                        : function () {
                              return t;
                          };
                return i.d(r, 'a', r), r;
            }),
            (i.o = function (t, i) {
                return Object.prototype.hasOwnProperty.call(t, i);
            }),
            (i.p = ''),
            i((i.s = 2))
        );
    })([
        function (t, i, r) {
            (function () {
                function r(t, i, r) {
                    null != t &&
                        ('number' == typeof t
                            ? this.fromNumber(t, i, r)
                            : null == i && 'string' != typeof t
                            ? this.fromString(t, 256)
                            : this.fromString(t, i));
                }
                function e() {
                    return new r(null);
                }
                function n(t, i, r, e, n, o) {
                    for (; --o >= 0; ) {
                        var s = i * this[t++] + r[e] + n;
                        (n = Math.floor(s / 67108864)), (r[e++] = 67108863 & s);
                    }
                    return n;
                }
                function o(t, i, r, e, n, o) {
                    for (var s = 32767 & i, u = i >> 15; --o >= 0; ) {
                        var h = 32767 & this[t],
                            a = this[t++] >> 15,
                            f = u * h + a * s;
                        (h =
                            s * h +
                            ((32767 & f) << 15) +
                            r[e] +
                            (1073741823 & n)),
                            (n = (h >>> 30) + (f >>> 15) + u * a + (n >>> 30)),
                            (r[e++] = 1073741823 & h);
                    }
                    return n;
                }
                function s(t, i, r, e, n, o) {
                    for (var s = 16383 & i, u = i >> 14; --o >= 0; ) {
                        var h = 16383 & this[t],
                            a = this[t++] >> 14,
                            f = u * h + a * s;
                        (h = s * h + ((16383 & f) << 14) + r[e] + n),
                            (n = (h >> 28) + (f >> 14) + u * a),
                            (r[e++] = 268435455 & h);
                    }
                    return n;
                }
                function u(t) {
                    return pi.charAt(t);
                }
                function h(t, i) {
                    var r = vi[t.charCodeAt(i)];
                    return null == r ? -1 : r;
                }
                function a(t) {
                    for (var i = this.t - 1; i >= 0; --i) t[i] = this[i];
                    (t.t = this.t), (t.s = this.s);
                }
                function f(t) {
                    (this.t = 1),
                        (this.s = t < 0 ? -1 : 0),
                        t > 0
                            ? (this[0] = t)
                            : t < -1
                            ? (this[0] = t + this.DV)
                            : (this.t = 0);
                }
                function l(t) {
                    var i = e();
                    return i.fromInt(t), i;
                }
                function c(t, i) {
                    var e;
                    if (16 == i) e = 4;
                    else if (8 == i) e = 3;
                    else if (256 == i) e = 8;
                    else if (2 == i) e = 1;
                    else if (32 == i) e = 5;
                    else {
                        if (4 != i) return void this.fromRadix(t, i);
                        e = 2;
                    }
                    (this.t = 0), (this.s = 0);
                    for (var n = t.length, o = !1, s = 0; --n >= 0; ) {
                        var u = 8 == e ? 255 & t[n] : h(t, n);
                        u < 0
                            ? '-' == t.charAt(n) && (o = !0)
                            : ((o = !1),
                              0 == s
                                  ? (this[this.t++] = u)
                                  : s + e > this.DB
                                  ? ((this[this.t - 1] |=
                                        (u & ((1 << (this.DB - s)) - 1)) << s),
                                    (this[this.t++] = u >> (this.DB - s)))
                                  : (this[this.t - 1] |= u << s),
                              (s += e) >= this.DB && (s -= this.DB));
                    }
                    8 == e &&
                        0 != (128 & t[0]) &&
                        ((this.s = -1),
                        s > 0 &&
                            (this[this.t - 1] |=
                                ((1 << (this.DB - s)) - 1) << s)),
                        this.clamp(),
                        o && r.ZERO.subTo(this, this);
                }
                function p() {
                    for (
                        var t = this.s & this.DM;
                        this.t > 0 && this[this.t - 1] == t;

                    )
                        --this.t;
                }
                function v(t) {
                    if (this.s < 0) return '-' + this.negate().toString(t);
                    var i;
                    if (16 == t) i = 4;
                    else if (8 == t) i = 3;
                    else if (2 == t) i = 1;
                    else if (32 == t) i = 5;
                    else {
                        if (4 != t) return this.toRadix(t);
                        i = 2;
                    }
                    var r,
                        e = (1 << i) - 1,
                        n = !1,
                        o = '',
                        s = this.t,
                        h = this.DB - ((s * this.DB) % i);
                    if (s-- > 0)
                        for (
                            h < this.DB &&
                            (r = this[s] >> h) > 0 &&
                            ((n = !0), (o = u(r)));
                            s >= 0;

                        )
                            h < i
                                ? ((r = (this[s] & ((1 << h) - 1)) << (i - h)),
                                  (r |= this[--s] >> (h += this.DB - i)))
                                : ((r = (this[s] >> (h -= i)) & e),
                                  h <= 0 && ((h += this.DB), --s)),
                                r > 0 && (n = !0),
                                n && (o += u(r));
                    return n ? o : '0';
                }
                function y() {
                    var t = e();
                    return r.ZERO.subTo(this, t), t;
                }
                function m() {
                    return this.s < 0 ? this.negate() : this;
                }
                function g(t) {
                    var i = this.s - t.s;
                    if (0 != i) return i;
                    var r = this.t;
                    if (0 != (i = r - t.t)) return this.s < 0 ? -i : i;
                    for (; --r >= 0; ) if (0 != (i = this[r] - t[r])) return i;
                    return 0;
                }
                function d(t) {
                    var i,
                        r = 1;
                    return (
                        0 != (i = t >>> 16) && ((t = i), (r += 16)),
                        0 != (i = t >> 8) && ((t = i), (r += 8)),
                        0 != (i = t >> 4) && ((t = i), (r += 4)),
                        0 != (i = t >> 2) && ((t = i), (r += 2)),
                        0 != (i = t >> 1) && ((t = i), (r += 1)),
                        r
                    );
                }
                function T() {
                    return this.t <= 0
                        ? 0
                        : this.DB * (this.t - 1) +
                              d(this[this.t - 1] ^ (this.s & this.DM));
                }
                function F(t, i) {
                    var r;
                    for (r = this.t - 1; r >= 0; --r) i[r + t] = this[r];
                    for (r = t - 1; r >= 0; --r) i[r] = 0;
                    (i.t = this.t + t), (i.s = this.s);
                }
                function b(t, i) {
                    for (var r = t; r < this.t; ++r) i[r - t] = this[r];
                    (i.t = Math.max(this.t - t, 0)), (i.s = this.s);
                }
                function B(t, i) {
                    var r,
                        e = t % this.DB,
                        n = this.DB - e,
                        o = (1 << n) - 1,
                        s = Math.floor(t / this.DB),
                        u = (this.s << e) & this.DM;
                    for (r = this.t - 1; r >= 0; --r)
                        (i[r + s + 1] = (this[r] >> n) | u),
                            (u = (this[r] & o) << e);
                    for (r = s - 1; r >= 0; --r) i[r] = 0;
                    (i[s] = u),
                        (i.t = this.t + s + 1),
                        (i.s = this.s),
                        i.clamp();
                }
                function w(t, i) {
                    i.s = this.s;
                    var r = Math.floor(t / this.DB);
                    if (r >= this.t) return void (i.t = 0);
                    var e = t % this.DB,
                        n = this.DB - e,
                        o = (1 << e) - 1;
                    i[0] = this[r] >> e;
                    for (var s = r + 1; s < this.t; ++s)
                        (i[s - r - 1] |= (this[s] & o) << n),
                            (i[s - r] = this[s] >> e);
                    e > 0 && (i[this.t - r - 1] |= (this.s & o) << n),
                        (i.t = this.t - r),
                        i.clamp();
                }
                function x(t, i) {
                    for (var r = 0, e = 0, n = Math.min(t.t, this.t); r < n; )
                        (e += this[r] - t[r]),
                            (i[r++] = e & this.DM),
                            (e >>= this.DB);
                    if (t.t < this.t) {
                        for (e -= t.s; r < this.t; )
                            (e += this[r]),
                                (i[r++] = e & this.DM),
                                (e >>= this.DB);
                        e += this.s;
                    } else {
                        for (e += this.s; r < t.t; )
                            (e -= t[r]),
                                (i[r++] = e & this.DM),
                                (e >>= this.DB);
                        e -= t.s;
                    }
                    (i.s = e < 0 ? -1 : 0),
                        e < -1 ? (i[r++] = this.DV + e) : e > 0 && (i[r++] = e),
                        (i.t = r),
                        i.clamp();
                }
                function D(t, i) {
                    var e = this.abs(),
                        n = t.abs(),
                        o = e.t;
                    for (i.t = o + n.t; --o >= 0; ) i[o] = 0;
                    for (o = 0; o < n.t; ++o)
                        i[o + e.t] = e.am(0, n[o], i, o, 0, e.t);
                    (i.s = 0), i.clamp(), this.s != t.s && r.ZERO.subTo(i, i);
                }
                function S(t) {
                    for (var i = this.abs(), r = (t.t = 2 * i.t); --r >= 0; )
                        t[r] = 0;
                    for (r = 0; r < i.t - 1; ++r) {
                        var e = i.am(r, i[r], t, 2 * r, 0, 1);
                        (t[r + i.t] += i.am(
                            r + 1,
                            2 * i[r],
                            t,
                            2 * r + 1,
                            e,
                            i.t - r - 1
                        )) >= i.DV &&
                            ((t[r + i.t] -= i.DV), (t[r + i.t + 1] = 1));
                    }
                    t.t > 0 && (t[t.t - 1] += i.am(r, i[r], t, 2 * r, 0, 1)),
                        (t.s = 0),
                        t.clamp();
                }
                function I(t, i, n) {
                    var o = t.abs();
                    if (!(o.t <= 0)) {
                        var s = this.abs();
                        if (s.t < o.t)
                            return (
                                null != i && i.fromInt(0),
                                void (null != n && this.copyTo(n))
                            );
                        null == n && (n = e());
                        var u = e(),
                            h = this.s,
                            a = t.s,
                            f = this.DB - d(o[o.t - 1]);
                        f > 0
                            ? (o.lShiftTo(f, u), s.lShiftTo(f, n))
                            : (o.copyTo(u), s.copyTo(n));
                        var l = u.t,
                            c = u[l - 1];
                        if (0 != c) {
                            var p =
                                    c * (1 << this.F1) +
                                    (l > 1 ? u[l - 2] >> this.F2 : 0),
                                v = this.FV / p,
                                y = (1 << this.F1) / p,
                                m = 1 << this.F2,
                                g = n.t,
                                T = g - l,
                                F = null == i ? e() : i;
                            for (
                                u.dlShiftTo(T, F),
                                    n.compareTo(F) >= 0 &&
                                        ((n[n.t++] = 1), n.subTo(F, n)),
                                    r.ONE.dlShiftTo(l, F),
                                    F.subTo(u, u);
                                u.t < l;

                            )
                                u[u.t++] = 0;
                            for (; --T >= 0; ) {
                                var b =
                                    n[--g] == c
                                        ? this.DM
                                        : Math.floor(
                                              n[g] * v + (n[g - 1] + m) * y
                                          );
                                if ((n[g] += u.am(0, b, n, T, 0, l)) < b)
                                    for (
                                        u.dlShiftTo(T, F), n.subTo(F, n);
                                        n[g] < --b;

                                    )
                                        n.subTo(F, n);
                            }
                            null != i &&
                                (n.drShiftTo(l, i),
                                h != a && r.ZERO.subTo(i, i)),
                                (n.t = l),
                                n.clamp(),
                                f > 0 && n.rShiftTo(f, n),
                                h < 0 && r.ZERO.subTo(n, n);
                        }
                    }
                }
                function q(t) {
                    var i = e();
                    return (
                        this.abs().divRemTo(t, null, i),
                        this.s < 0 && i.compareTo(r.ZERO) > 0 && t.subTo(i, i),
                        i
                    );
                }
                function E(t) {
                    this.m = t;
                }
                function O(t) {
                    return t.s < 0 || t.compareTo(this.m) >= 0
                        ? t.mod(this.m)
                        : t;
                }
                function A(t) {
                    return t;
                }
                function R(t) {
                    t.divRemTo(this.m, null, t);
                }
                function P(t, i, r) {
                    t.multiplyTo(i, r), this.reduce(r);
                }
                function M(t, i) {
                    t.squareTo(i), this.reduce(i);
                }
                function C() {
                    if (this.t < 1) return 0;
                    var t = this[0];
                    if (0 == (1 & t)) return 0;
                    var i = 3 & t;
                    return (
                        (i = (i * (2 - (15 & t) * i)) & 15),
                        (i = (i * (2 - (255 & t) * i)) & 255),
                        (i = (i * (2 - (((65535 & t) * i) & 65535))) & 65535),
                        (i = (i * (2 - ((t * i) % this.DV))) % this.DV),
                        i > 0 ? this.DV - i : -i
                    );
                }
                function k(t) {
                    (this.m = t),
                        (this.mp = t.invDigit()),
                        (this.mpl = 32767 & this.mp),
                        (this.mph = this.mp >> 15),
                        (this.um = (1 << (t.DB - 15)) - 1),
                        (this.mt2 = 2 * t.t);
                }
                function V(t) {
                    var i = e();
                    return (
                        t.abs().dlShiftTo(this.m.t, i),
                        i.divRemTo(this.m, null, i),
                        t.s < 0 &&
                            i.compareTo(r.ZERO) > 0 &&
                            this.m.subTo(i, i),
                        i
                    );
                }
                function H(t) {
                    var i = e();
                    return t.copyTo(i), this.reduce(i), i;
                }
                function N(t) {
                    for (; t.t <= this.mt2; ) t[t.t++] = 0;
                    for (var i = 0; i < this.m.t; ++i) {
                        var r = 32767 & t[i],
                            e =
                                (r * this.mpl +
                                    (((r * this.mph + (t[i] >> 15) * this.mpl) &
                                        this.um) <<
                                        15)) &
                                t.DM;
                        for (
                            r = i + this.m.t,
                                t[r] += this.m.am(0, e, t, i, 0, this.m.t);
                            t[r] >= t.DV;

                        )
                            (t[r] -= t.DV), t[++r]++;
                    }
                    t.clamp(),
                        t.drShiftTo(this.m.t, t),
                        t.compareTo(this.m) >= 0 && t.subTo(this.m, t);
                }
                function j(t, i) {
                    t.squareTo(i), this.reduce(i);
                }
                function L(t, i, r) {
                    t.multiplyTo(i, r), this.reduce(r);
                }
                function z() {
                    return 0 == (this.t > 0 ? 1 & this[0] : this.s);
                }
                function Z(t, i) {
                    if (t > 4294967295 || t < 1) return r.ONE;
                    var n = e(),
                        o = e(),
                        s = i.convert(this),
                        u = d(t) - 1;
                    for (s.copyTo(n); --u >= 0; )
                        if ((i.sqrTo(n, o), (t & (1 << u)) > 0))
                            i.mulTo(o, s, n);
                        else {
                            var h = n;
                            (n = o), (o = h);
                        }
                    return i.revert(n);
                }
                function K(t, i) {
                    var r;
                    return (
                        (r = t < 256 || i.isEven() ? new E(i) : new k(i)),
                        this.exp(t, r)
                    );
                }
                function _() {
                    var t = e();
                    return this.copyTo(t), t;
                }
                function X() {
                    if (this.s < 0) {
                        if (1 == this.t) return this[0] - this.DV;
                        if (0 == this.t) return -1;
                    } else {
                        if (1 == this.t) return this[0];
                        if (0 == this.t) return 0;
                    }
                    return (
                        ((this[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) |
                        this[0]
                    );
                }
                function U() {
                    return 0 == this.t ? this.s : (this[0] << 24) >> 24;
                }
                function Y() {
                    return 0 == this.t ? this.s : (this[0] << 16) >> 16;
                }
                function G(t) {
                    return Math.floor((Math.LN2 * this.DB) / Math.log(t));
                }
                function J() {
                    return this.s < 0
                        ? -1
                        : this.t <= 0 || (1 == this.t && this[0] <= 0)
                        ? 0
                        : 1;
                }
                function Q(t) {
                    if (
                        (null == t && (t = 10),
                        0 == this.signum() || t < 2 || t > 36)
                    )
                        return '0';
                    var i = this.chunkSize(t),
                        r = Math.pow(t, i),
                        n = l(r),
                        o = e(),
                        s = e(),
                        u = '';
                    for (this.divRemTo(n, o, s); o.signum() > 0; )
                        (u = (r + s.intValue()).toString(t).substr(1) + u),
                            o.divRemTo(n, o, s);
                    return s.intValue().toString(t) + u;
                }
                function W(t, i) {
                    this.fromInt(0), null == i && (i = 10);
                    for (
                        var e = this.chunkSize(i),
                            n = Math.pow(i, e),
                            o = !1,
                            s = 0,
                            u = 0,
                            a = 0;
                        a < t.length;
                        ++a
                    ) {
                        var f = h(t, a);
                        f < 0
                            ? '-' == t.charAt(a) &&
                              0 == this.signum() &&
                              (o = !0)
                            : ((u = i * u + f),
                              ++s >= e &&
                                  (this.dMultiply(n),
                                  this.dAddOffset(u, 0),
                                  (s = 0),
                                  (u = 0)));
                    }
                    s > 0 &&
                        (this.dMultiply(Math.pow(i, s)), this.dAddOffset(u, 0)),
                        o && r.ZERO.subTo(this, this);
                }
                function $(t, i, e) {
                    if ('number' == typeof i)
                        if (t < 2) this.fromInt(1);
                        else
                            for (
                                this.fromNumber(t, e),
                                    this.testBit(t - 1) ||
                                        this.bitwiseTo(
                                            r.ONE.shiftLeft(t - 1),
                                            ut,
                                            this
                                        ),
                                    this.isEven() && this.dAddOffset(1, 0);
                                !this.isProbablePrime(i);

                            )
                                this.dAddOffset(2, 0),
                                    this.bitLength() > t &&
                                        this.subTo(
                                            r.ONE.shiftLeft(t - 1),
                                            this
                                        );
                    else {
                        var n = new Array(),
                            o = 7 & t;
                        (n.length = 1 + (t >> 3)),
                            i.nextBytes(n),
                            o > 0 ? (n[0] &= (1 << o) - 1) : (n[0] = 0),
                            this.fromString(n, 256);
                    }
                }
                function tt() {
                    var t = this.t,
                        i = new Array();
                    i[0] = this.s;
                    var r,
                        e = this.DB - ((t * this.DB) % 8),
                        n = 0;
                    if (t-- > 0)
                        for (
                            e < this.DB &&
                            (r = this[t] >> e) != (this.s & this.DM) >> e &&
                            (i[n++] = r | (this.s << (this.DB - e)));
                            t >= 0;

                        )
                            e < 8
                                ? ((r = (this[t] & ((1 << e) - 1)) << (8 - e)),
                                  (r |= this[--t] >> (e += this.DB - 8)))
                                : ((r = (this[t] >> (e -= 8)) & 255),
                                  e <= 0 && ((e += this.DB), --t)),
                                0 != (128 & r) && (r |= -256),
                                0 == n && (128 & this.s) != (128 & r) && ++n,
                                (n > 0 || r != this.s) && (i[n++] = r);
                    return i;
                }
                function it(t) {
                    return 0 == this.compareTo(t);
                }
                function rt(t) {
                    return this.compareTo(t) < 0 ? this : t;
                }
                function et(t) {
                    return this.compareTo(t) > 0 ? this : t;
                }
                function nt(t, i, r) {
                    var e,
                        n,
                        o = Math.min(t.t, this.t);
                    for (e = 0; e < o; ++e) r[e] = i(this[e], t[e]);
                    if (t.t < this.t) {
                        for (n = t.s & this.DM, e = o; e < this.t; ++e)
                            r[e] = i(this[e], n);
                        r.t = this.t;
                    } else {
                        for (n = this.s & this.DM, e = o; e < t.t; ++e)
                            r[e] = i(n, t[e]);
                        r.t = t.t;
                    }
                    (r.s = i(this.s, t.s)), r.clamp();
                }
                function ot(t, i) {
                    return t & i;
                }
                function st(t) {
                    var i = e();
                    return this.bitwiseTo(t, ot, i), i;
                }
                function ut(t, i) {
                    return t | i;
                }
                function ht(t) {
                    var i = e();
                    return this.bitwiseTo(t, ut, i), i;
                }
                function at(t, i) {
                    return t ^ i;
                }
                function ft(t) {
                    var i = e();
                    return this.bitwiseTo(t, at, i), i;
                }
                function lt(t, i) {
                    return t & ~i;
                }
                function ct(t) {
                    var i = e();
                    return this.bitwiseTo(t, lt, i), i;
                }
                function pt() {
                    for (var t = e(), i = 0; i < this.t; ++i)
                        t[i] = this.DM & ~this[i];
                    return (t.t = this.t), (t.s = ~this.s), t;
                }
                function vt(t) {
                    var i = e();
                    return (
                        t < 0 ? this.rShiftTo(-t, i) : this.lShiftTo(t, i), i
                    );
                }
                function yt(t) {
                    var i = e();
                    return (
                        t < 0 ? this.lShiftTo(-t, i) : this.rShiftTo(t, i), i
                    );
                }
                function mt(t) {
                    if (0 == t) return -1;
                    var i = 0;
                    return (
                        0 == (65535 & t) && ((t >>= 16), (i += 16)),
                        0 == (255 & t) && ((t >>= 8), (i += 8)),
                        0 == (15 & t) && ((t >>= 4), (i += 4)),
                        0 == (3 & t) && ((t >>= 2), (i += 2)),
                        0 == (1 & t) && ++i,
                        i
                    );
                }
                function gt() {
                    for (var t = 0; t < this.t; ++t)
                        if (0 != this[t]) return t * this.DB + mt(this[t]);
                    return this.s < 0 ? this.t * this.DB : -1;
                }
                function dt(t) {
                    for (var i = 0; 0 != t; ) (t &= t - 1), ++i;
                    return i;
                }
                function Tt() {
                    for (
                        var t = 0, i = this.s & this.DM, r = 0;
                        r < this.t;
                        ++r
                    )
                        t += dt(this[r] ^ i);
                    return t;
                }
                function Ft(t) {
                    var i = Math.floor(t / this.DB);
                    return i >= this.t
                        ? 0 != this.s
                        : 0 != (this[i] & (1 << t % this.DB));
                }
                function bt(t, i) {
                    var e = r.ONE.shiftLeft(t);
                    return this.bitwiseTo(e, i, e), e;
                }
                function Bt(t) {
                    return this.changeBit(t, ut);
                }
                function wt(t) {
                    return this.changeBit(t, lt);
                }
                function xt(t) {
                    return this.changeBit(t, at);
                }
                function Dt(t, i) {
                    for (var r = 0, e = 0, n = Math.min(t.t, this.t); r < n; )
                        (e += this[r] + t[r]),
                            (i[r++] = e & this.DM),
                            (e >>= this.DB);
                    if (t.t < this.t) {
                        for (e += t.s; r < this.t; )
                            (e += this[r]),
                                (i[r++] = e & this.DM),
                                (e >>= this.DB);
                        e += this.s;
                    } else {
                        for (e += this.s; r < t.t; )
                            (e += t[r]),
                                (i[r++] = e & this.DM),
                                (e >>= this.DB);
                        e += t.s;
                    }
                    (i.s = e < 0 ? -1 : 0),
                        e > 0 ? (i[r++] = e) : e < -1 && (i[r++] = this.DV + e),
                        (i.t = r),
                        i.clamp();
                }
                function St(t) {
                    var i = e();
                    return this.addTo(t, i), i;
                }
                function It(t) {
                    var i = e();
                    return this.subTo(t, i), i;
                }
                function qt(t) {
                    var i = e();
                    return this.multiplyTo(t, i), i;
                }
                function Et() {
                    var t = e();
                    return this.squareTo(t), t;
                }
                function Ot(t) {
                    var i = e();
                    return this.divRemTo(t, i, null), i;
                }
                function At(t) {
                    var i = e();
                    return this.divRemTo(t, null, i), i;
                }
                function Rt(t) {
                    var i = e(),
                        r = e();
                    return this.divRemTo(t, i, r), new Array(i, r);
                }
                function Pt(t) {
                    (this[this.t] = this.am(0, t - 1, this, 0, 0, this.t)),
                        ++this.t,
                        this.clamp();
                }
                function Mt(t, i) {
                    if (0 != t) {
                        for (; this.t <= i; ) this[this.t++] = 0;
                        for (this[i] += t; this[i] >= this.DV; )
                            (this[i] -= this.DV),
                                ++i >= this.t && (this[this.t++] = 0),
                                ++this[i];
                    }
                }
                function Ct() {}
                function kt(t) {
                    return t;
                }
                function Vt(t, i, r) {
                    t.multiplyTo(i, r);
                }
                function Ht(t, i) {
                    t.squareTo(i);
                }
                function Nt(t) {
                    return this.exp(t, new Ct());
                }
                function jt(t, i, r) {
                    var e = Math.min(this.t + t.t, i);
                    for (r.s = 0, r.t = e; e > 0; ) r[--e] = 0;
                    var n;
                    for (n = r.t - this.t; e < n; ++e)
                        r[e + this.t] = this.am(0, t[e], r, e, 0, this.t);
                    for (n = Math.min(t.t, i); e < n; ++e)
                        this.am(0, t[e], r, e, 0, i - e);
                    r.clamp();
                }
                function Lt(t, i, r) {
                    --i;
                    var e = (r.t = this.t + t.t - i);
                    for (r.s = 0; --e >= 0; ) r[e] = 0;
                    for (e = Math.max(i - this.t, 0); e < t.t; ++e)
                        r[this.t + e - i] = this.am(
                            i - e,
                            t[e],
                            r,
                            0,
                            0,
                            this.t + e - i
                        );
                    r.clamp(), r.drShiftTo(1, r);
                }
                function zt(t) {
                    (this.r2 = e()),
                        (this.q3 = e()),
                        r.ONE.dlShiftTo(2 * t.t, this.r2),
                        (this.mu = this.r2.divide(t)),
                        (this.m = t);
                }
                function Zt(t) {
                    if (t.s < 0 || t.t > 2 * this.m.t) return t.mod(this.m);
                    if (t.compareTo(this.m) < 0) return t;
                    var i = e();
                    return t.copyTo(i), this.reduce(i), i;
                }
                function Kt(t) {
                    return t;
                }
                function _t(t) {
                    for (
                        t.drShiftTo(this.m.t - 1, this.r2),
                            t.t > this.m.t + 1 &&
                                ((t.t = this.m.t + 1), t.clamp()),
                            this.mu.multiplyUpperTo(
                                this.r2,
                                this.m.t + 1,
                                this.q3
                            ),
                            this.m.multiplyLowerTo(
                                this.q3,
                                this.m.t + 1,
                                this.r2
                            );
                        t.compareTo(this.r2) < 0;

                    )
                        t.dAddOffset(1, this.m.t + 1);
                    for (t.subTo(this.r2, t); t.compareTo(this.m) >= 0; )
                        t.subTo(this.m, t);
                }
                function Xt(t, i) {
                    t.squareTo(i), this.reduce(i);
                }
                function Ut(t, i, r) {
                    t.multiplyTo(i, r), this.reduce(r);
                }
                function Yt(t, i) {
                    var r,
                        n,
                        o = t.bitLength(),
                        s = l(1);
                    if (o <= 0) return s;
                    (r =
                        o < 18
                            ? 1
                            : o < 48
                            ? 3
                            : o < 144
                            ? 4
                            : o < 768
                            ? 5
                            : 6),
                        (n =
                            o < 8
                                ? new E(i)
                                : i.isEven()
                                ? new zt(i)
                                : new k(i));
                    var u = new Array(),
                        h = 3,
                        a = r - 1,
                        f = (1 << r) - 1;
                    if (((u[1] = n.convert(this)), r > 1)) {
                        var c = e();
                        for (n.sqrTo(u[1], c); h <= f; )
                            (u[h] = e()), n.mulTo(c, u[h - 2], u[h]), (h += 2);
                    }
                    var p,
                        v,
                        y = t.t - 1,
                        m = !0,
                        g = e();
                    for (o = d(t[y]) - 1; y >= 0; ) {
                        for (
                            o >= a
                                ? (p = (t[y] >> (o - a)) & f)
                                : ((p =
                                      (t[y] & ((1 << (o + 1)) - 1)) << (a - o)),
                                  y > 0 &&
                                      (p |= t[y - 1] >> (this.DB + o - a))),
                                h = r;
                            0 == (1 & p);

                        )
                            (p >>= 1), --h;
                        if (((o -= h) < 0 && ((o += this.DB), --y), m))
                            u[p].copyTo(s), (m = !1);
                        else {
                            for (; h > 1; )
                                n.sqrTo(s, g), n.sqrTo(g, s), (h -= 2);
                            h > 0 ? n.sqrTo(s, g) : ((v = s), (s = g), (g = v)),
                                n.mulTo(g, u[p], s);
                        }
                        for (; y >= 0 && 0 == (t[y] & (1 << o)); )
                            n.sqrTo(s, g),
                                (v = s),
                                (s = g),
                                (g = v),
                                --o < 0 && ((o = this.DB - 1), --y);
                    }
                    return n.revert(s);
                }
                function Gt(t) {
                    var i = this.s < 0 ? this.negate() : this.clone(),
                        r = t.s < 0 ? t.negate() : t.clone();
                    if (i.compareTo(r) < 0) {
                        var e = i;
                        (i = r), (r = e);
                    }
                    var n = i.getLowestSetBit(),
                        o = r.getLowestSetBit();
                    if (o < 0) return i;
                    for (
                        n < o && (o = n),
                            o > 0 && (i.rShiftTo(o, i), r.rShiftTo(o, r));
                        i.signum() > 0;

                    )
                        (n = i.getLowestSetBit()) > 0 && i.rShiftTo(n, i),
                            (n = r.getLowestSetBit()) > 0 && r.rShiftTo(n, r),
                            i.compareTo(r) >= 0
                                ? (i.subTo(r, i), i.rShiftTo(1, i))
                                : (r.subTo(i, r), r.rShiftTo(1, r));
                    return o > 0 && r.lShiftTo(o, r), r;
                }
                function Jt(t) {
                    if (t <= 0) return 0;
                    var i = this.DV % t,
                        r = this.s < 0 ? t - 1 : 0;
                    if (this.t > 0)
                        if (0 == i) r = this[0] % t;
                        else
                            for (var e = this.t - 1; e >= 0; --e)
                                r = (i * r + this[e]) % t;
                    return r;
                }
                function Qt(t) {
                    var i = t.isEven();
                    if ((this.isEven() && i) || 0 == t.signum()) return r.ZERO;
                    for (
                        var e = t.clone(),
                            n = this.clone(),
                            o = l(1),
                            s = l(0),
                            u = l(0),
                            h = l(1);
                        0 != e.signum();

                    ) {
                        for (; e.isEven(); )
                            e.rShiftTo(1, e),
                                i
                                    ? ((o.isEven() && s.isEven()) ||
                                          (o.addTo(this, o), s.subTo(t, s)),
                                      o.rShiftTo(1, o))
                                    : s.isEven() || s.subTo(t, s),
                                s.rShiftTo(1, s);
                        for (; n.isEven(); )
                            n.rShiftTo(1, n),
                                i
                                    ? ((u.isEven() && h.isEven()) ||
                                          (u.addTo(this, u), h.subTo(t, h)),
                                      u.rShiftTo(1, u))
                                    : h.isEven() || h.subTo(t, h),
                                h.rShiftTo(1, h);
                        e.compareTo(n) >= 0
                            ? (e.subTo(n, e), i && o.subTo(u, o), s.subTo(h, s))
                            : (n.subTo(e, n),
                              i && u.subTo(o, u),
                              h.subTo(s, h));
                    }
                    return 0 != n.compareTo(r.ONE)
                        ? r.ZERO
                        : h.compareTo(t) >= 0
                        ? h.subtract(t)
                        : h.signum() < 0
                        ? (h.addTo(t, h), h.signum() < 0 ? h.add(t) : h)
                        : h;
                }
                function Wt(t) {
                    var i,
                        r = this.abs();
                    if (1 == r.t && r[0] <= yi[yi.length - 1]) {
                        for (i = 0; i < yi.length; ++i)
                            if (r[0] == yi[i]) return !0;
                        return !1;
                    }
                    if (r.isEven()) return !1;
                    for (i = 1; i < yi.length; ) {
                        for (
                            var e = yi[i], n = i + 1;
                            n < yi.length && e < mi;

                        )
                            e *= yi[n++];
                        for (e = r.modInt(e); i < n; )
                            if (e % yi[i++] == 0) return !1;
                    }
                    return r.millerRabin(t);
                }
                function $t(t) {
                    var i = this.subtract(r.ONE),
                        n = i.getLowestSetBit();
                    if (n <= 0) return !1;
                    var o = i.shiftRight(n);
                    (t = (t + 1) >> 1) > yi.length && (t = yi.length);
                    for (var s = e(), u = 0; u < t; ++u) {
                        s.fromInt(yi[Math.floor(Math.random() * yi.length)]);
                        var h = s.modPow(o, this);
                        if (0 != h.compareTo(r.ONE) && 0 != h.compareTo(i)) {
                            for (var a = 1; a++ < n && 0 != h.compareTo(i); )
                                if (
                                    ((h = h.modPowInt(2, this)),
                                    0 == h.compareTo(r.ONE))
                                )
                                    return !1;
                            if (0 != h.compareTo(i)) return !1;
                        }
                    }
                    return !0;
                }
                function ti(t) {
                    (di[Ti++] ^= 255 & t),
                        (di[Ti++] ^= (t >> 8) & 255),
                        (di[Ti++] ^= (t >> 16) & 255),
                        (di[Ti++] ^= (t >> 24) & 255),
                        Ti >= wi && (Ti -= wi);
                }
                function ii() {
                    ti(new Date().getTime());
                }
                function ri() {
                    if (null == gi) {
                        for (
                            ii(), gi = hi(), gi.init(di), Ti = 0;
                            Ti < di.length;
                            ++Ti
                        )
                            di[Ti] = 0;
                        Ti = 0;
                    }
                    return gi.next();
                }
                function ei(t) {
                    var i;
                    for (i = 0; i < t.length; ++i) t[i] = ri();
                }
                function ni() {}
                function oi() {
                    (this.i = 0), (this.j = 0), (this.S = new Array());
                }
                function si(t) {
                    var i, r, e;
                    for (i = 0; i < 256; ++i) this.S[i] = i;
                    for (r = 0, i = 0; i < 256; ++i)
                        (r = (r + this.S[i] + t[i % t.length]) & 255),
                            (e = this.S[i]),
                            (this.S[i] = this.S[r]),
                            (this.S[r] = e);
                    (this.i = 0), (this.j = 0);
                }
                function ui() {
                    var t;
                    return (
                        (this.i = (this.i + 1) & 255),
                        (this.j = (this.j + this.S[this.i]) & 255),
                        (t = this.S[this.i]),
                        (this.S[this.i] = this.S[this.j]),
                        (this.S[this.j] = t),
                        this.S[(t + this.S[this.i]) & 255]
                    );
                }
                function hi() {
                    return new oi();
                }
                var ai,
                    fi = 'undefined' != typeof navigator;
                fi && 'Microsoft Internet Explorer' == navigator.appName
                    ? ((r.prototype.am = o), (ai = 30))
                    : fi && 'Netscape' != navigator.appName
                    ? ((r.prototype.am = n), (ai = 26))
                    : ((r.prototype.am = s), (ai = 28)),
                    (r.prototype.DB = ai),
                    (r.prototype.DM = (1 << ai) - 1),
                    (r.prototype.DV = 1 << ai);
                (r.prototype.FV = Math.pow(2, 52)),
                    (r.prototype.F1 = 52 - ai),
                    (r.prototype.F2 = 2 * ai - 52);
                var li,
                    ci,
                    pi = '0123456789abcdefghijklmnopqrstuvwxyz',
                    vi = new Array();
                for (li = '0'.charCodeAt(0), ci = 0; ci <= 9; ++ci)
                    vi[li++] = ci;
                for (li = 'a'.charCodeAt(0), ci = 10; ci < 36; ++ci)
                    vi[li++] = ci;
                for (li = 'A'.charCodeAt(0), ci = 10; ci < 36; ++ci)
                    vi[li++] = ci;
                (E.prototype.convert = O),
                    (E.prototype.revert = A),
                    (E.prototype.reduce = R),
                    (E.prototype.mulTo = P),
                    (E.prototype.sqrTo = M),
                    (k.prototype.convert = V),
                    (k.prototype.revert = H),
                    (k.prototype.reduce = N),
                    (k.prototype.mulTo = L),
                    (k.prototype.sqrTo = j),
                    (r.prototype.copyTo = a),
                    (r.prototype.fromInt = f),
                    (r.prototype.fromString = c),
                    (r.prototype.clamp = p),
                    (r.prototype.dlShiftTo = F),
                    (r.prototype.drShiftTo = b),
                    (r.prototype.lShiftTo = B),
                    (r.prototype.rShiftTo = w),
                    (r.prototype.subTo = x),
                    (r.prototype.multiplyTo = D),
                    (r.prototype.squareTo = S),
                    (r.prototype.divRemTo = I),
                    (r.prototype.invDigit = C),
                    (r.prototype.isEven = z),
                    (r.prototype.exp = Z),
                    (r.prototype.toString = v),
                    (r.prototype.negate = y),
                    (r.prototype.abs = m),
                    (r.prototype.compareTo = g),
                    (r.prototype.bitLength = T),
                    (r.prototype.mod = q),
                    (r.prototype.modPowInt = K),
                    (r.ZERO = l(0)),
                    (r.ONE = l(1)),
                    (Ct.prototype.convert = kt),
                    (Ct.prototype.revert = kt),
                    (Ct.prototype.mulTo = Vt),
                    (Ct.prototype.sqrTo = Ht),
                    (zt.prototype.convert = Zt),
                    (zt.prototype.revert = Kt),
                    (zt.prototype.reduce = _t),
                    (zt.prototype.mulTo = Ut),
                    (zt.prototype.sqrTo = Xt);
                var yi = [
                        2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47,
                        53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107,
                        109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167,
                        173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229,
                        233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283,
                        293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359,
                        367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431,
                        433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491,
                        499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571,
                        577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641,
                        643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709,
                        719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787,
                        797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859,
                        863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941,
                        947, 953, 967, 971, 977, 983, 991, 997,
                    ],
                    mi = (1 << 26) / yi[yi.length - 1];
                (r.prototype.chunkSize = G),
                    (r.prototype.toRadix = Q),
                    (r.prototype.fromRadix = W),
                    (r.prototype.fromNumber = $),
                    (r.prototype.bitwiseTo = nt),
                    (r.prototype.changeBit = bt),
                    (r.prototype.addTo = Dt),
                    (r.prototype.dMultiply = Pt),
                    (r.prototype.dAddOffset = Mt),
                    (r.prototype.multiplyLowerTo = jt),
                    (r.prototype.multiplyUpperTo = Lt),
                    (r.prototype.modInt = Jt),
                    (r.prototype.millerRabin = $t),
                    (r.prototype.clone = _),
                    (r.prototype.intValue = X),
                    (r.prototype.byteValue = U),
                    (r.prototype.shortValue = Y),
                    (r.prototype.signum = J),
                    (r.prototype.toByteArray = tt),
                    (r.prototype.equals = it),
                    (r.prototype.min = rt),
                    (r.prototype.max = et),
                    (r.prototype.and = st),
                    (r.prototype.or = ht),
                    (r.prototype.xor = ft),
                    (r.prototype.andNot = ct),
                    (r.prototype.not = pt),
                    (r.prototype.shiftLeft = vt),
                    (r.prototype.shiftRight = yt),
                    (r.prototype.getLowestSetBit = gt),
                    (r.prototype.bitCount = Tt),
                    (r.prototype.testBit = Ft),
                    (r.prototype.setBit = Bt),
                    (r.prototype.clearBit = wt),
                    (r.prototype.flipBit = xt),
                    (r.prototype.add = St),
                    (r.prototype.subtract = It),
                    (r.prototype.multiply = qt),
                    (r.prototype.divide = Ot),
                    (r.prototype.remainder = At),
                    (r.prototype.divideAndRemainder = Rt),
                    (r.prototype.modPow = Yt),
                    (r.prototype.modInverse = Qt),
                    (r.prototype.pow = Nt),
                    (r.prototype.gcd = Gt),
                    (r.prototype.isProbablePrime = Wt),
                    (r.prototype.square = Et),
                    (r.prototype.Barrett = zt);
                var gi, di, Ti;
                if (null == di) {
                    (di = new Array()), (Ti = 0);
                    var Fi;
                    if ('undefined' != typeof window && window.crypto)
                        if (window.crypto.getRandomValues) {
                            var bi = new Uint8Array(32);
                            for (
                                window.crypto.getRandomValues(bi), Fi = 0;
                                Fi < 32;
                                ++Fi
                            )
                                di[Ti++] = bi[Fi];
                        } else if (
                            'Netscape' == navigator.appName &&
                            navigator.appVersion < '5'
                        ) {
                            var Bi = window.crypto.random(32);
                            for (Fi = 0; Fi < Bi.length; ++Fi)
                                di[Ti++] = 255 & Bi.charCodeAt(Fi);
                        }
                    for (; Ti < wi; )
                        (Fi = Math.floor(65536 * Math.random())),
                            (di[Ti++] = Fi >>> 8),
                            (di[Ti++] = 255 & Fi);
                    (Ti = 0), ii();
                }
                (ni.prototype.nextBytes = ei),
                    (oi.prototype.init = si),
                    (oi.prototype.next = ui);
                var wi = 256;
                i = t.exports = { default: r, BigInteger: r, SecureRandom: ni };
            }.call(this));
        },
        function (t, i, r) {
            'use strict';
            function e(t, i) {
                for (
                    var r = [], e = ~~(i / 8), n = i % 8, o = 0, s = t.length;
                    o < s;
                    o++
                )
                    r[o] =
                        ((t[(o + e) % s] << n) & 255) +
                        ((t[(o + e + 1) % s] >>> (8 - n)) & 255);
                return r;
            }
            function n(t, i) {
                for (var r = [], e = t.length - 1; e >= 0; e--)
                    r[e] = 255 & (t[e] ^ i[e]);
                return r;
            }
            function o(t, i) {
                for (var r = [], e = t.length - 1; e >= 0; e--)
                    r[e] = t[e] & i[e] & 255;
                return r;
            }
            function s(t, i) {
                for (var r = [], e = t.length - 1; e >= 0; e--)
                    r[e] = 255 & (t[e] | i[e]);
                return r;
            }
            function u(t, i) {
                for (var r = [], e = 0, n = t.length - 1; n >= 0; n--) {
                    var o = t[n] + i[n] + e;
                    o > 255
                        ? ((e = 1), (r[n] = 255 & o))
                        : ((e = 0), (r[n] = 255 & o));
                }
                return r;
            }
            function h(t) {
                for (var i = [], r = t.length - 1; r >= 0; r--)
                    i[r] = 255 & ~t[r];
                return i;
            }
            function a(t) {
                return n(n(t, e(t, 9)), e(t, 17));
            }
            function f(t) {
                return n(n(t, e(t, 15)), e(t, 23));
            }
            function l(t, i, r, e) {
                return e >= 0 && e <= 15
                    ? n(n(t, i), r)
                    : s(s(o(t, i), o(t, r)), o(i, r));
            }
            function c(t, i, r, e) {
                return e >= 0 && e <= 15
                    ? n(n(t, i), r)
                    : s(o(t, i), o(h(t), r));
            }
            function p(t, i) {
                for (var r = [], o = [], s = 0; s < 16; s++) {
                    var h = 4 * s;
                    r.push(i.slice(h, h + 4));
                }
                for (var p = 16; p < 68; p++)
                    r.push(
                        n(
                            n(
                                f(n(n(r[p - 16], r[p - 9]), e(r[p - 3], 15))),
                                e(r[p - 13], 7)
                            ),
                            r[p - 6]
                        )
                    );
                for (var v = 0; v < 64; v++) o.push(n(r[v], r[v + 4]));
                for (
                    var y = [121, 204, 69, 25],
                        m = [122, 135, 157, 138],
                        g = t.slice(0, 4),
                        d = t.slice(4, 8),
                        T = t.slice(8, 12),
                        F = t.slice(12, 16),
                        b = t.slice(16, 20),
                        B = t.slice(20, 24),
                        w = t.slice(24, 28),
                        x = t.slice(28, 32),
                        D = void 0,
                        S = void 0,
                        I = void 0,
                        q = void 0,
                        E = 0;
                    E < 64;
                    E++
                ) {
                    var O = E >= 0 && E <= 15 ? y : m;
                    (D = e(u(u(e(g, 12), b), e(O, E)), 7)),
                        (S = n(D, e(g, 12))),
                        (I = u(u(u(l(g, d, T, E), F), S), o[E])),
                        (q = u(u(u(c(b, B, w, E), x), D), r[E])),
                        (F = T),
                        (T = e(d, 9)),
                        (d = g),
                        (g = I),
                        (x = w),
                        (w = e(B, 19)),
                        (B = b),
                        (b = a(q));
                }
                return n([].concat(g, d, T, F, b, B, w, x), t);
            }
            t.exports = function (t) {
                var i = 8 * t.length,
                    r = i % 512;
                r = r >= 448 ? 512 - (r % 448) - 1 : 448 - r - 1;
                for (
                    var e = new Array((r - 7) / 8), n = 0, o = e.length;
                    n < o;
                    n++
                )
                    e[n] = 0;
                var s = [];
                i = i.toString(2);
                for (var u = 7; u >= 0; u--)
                    if (i.length > 8) {
                        var h = i.length - 8;
                        (s[u] = parseInt(i.substr(h), 2)), (i = i.substr(0, h));
                    } else
                        i.length > 0
                            ? ((s[u] = parseInt(i, 2)), (i = ''))
                            : (s[u] = 0);
                for (
                    var a = [].concat(t, [128], e, s),
                        f = a.length / 64,
                        l = [
                            115, 128, 22, 111, 73, 20, 178, 185, 23, 36, 66,
                            215, 218, 138, 6, 0, 169, 111, 48, 188, 22, 49, 56,
                            170, 227, 141, 238, 77, 176, 251, 14, 78,
                        ],
                        c = 0;
                    c < f;
                    c++
                ) {
                    var v = 64 * c;
                    l = p(l, a.slice(v, v + 64));
                }
                return l;
            };
        },
        function (t, i, r) {
            'use strict';
            function e(t) {
                if (Array.isArray(t)) {
                    for (var i = 0, r = Array(t.length); i < t.length; i++)
                        r[i] = t[i];
                    return r;
                }
                return Array.from(t);
            }
            function n(t, i) {
                var r =
                    arguments.length > 2 && void 0 !== arguments[2]
                        ? arguments[2]
                        : 1;
                (t =
                    'string' == typeof t
                        ? m.hexToArray(m.utf8ToHex(t))
                        : Array.prototype.slice.call(t)),
                    (i = m.getGlobalCurve().decodePointHex(i));
                var n = m.generateKeyPairHex(),
                    o = new c(n.privateKey, 16),
                    s = n.publicKey;
                s.length > 128 && (s = s.substr(s.length - 128));
                var u = i.multiply(o),
                    h = m.hexToArray(
                        m.leftPad(u.getX().toBigInteger().toRadix(16), 64)
                    ),
                    a = m.hexToArray(
                        m.leftPad(u.getY().toBigInteger().toRadix(16), 64)
                    ),
                    f = m.arrayToHex(g([].concat(h, t, a))),
                    l = 1,
                    p = 0,
                    v = [],
                    y = [].concat(h, a),
                    d = function () {
                        (v = g(
                            [].concat(e(y), [
                                (l >> 24) & 255,
                                (l >> 16) & 255,
                                (l >> 8) & 255,
                                255 & l,
                            ])
                        )),
                            l++,
                            (p = 0);
                    };
                d();
                for (var T = 0, F = t.length; T < F; T++)
                    p === v.length && d(), (t[T] ^= 255 & v[p++]);
                var b = m.arrayToHex(t);
                return r === B ? s + b + f : s + f + b;
            }
            function o(t, i) {
                var r =
                        arguments.length > 2 && void 0 !== arguments[2]
                            ? arguments[2]
                            : 1,
                    n =
                        arguments.length > 3 && void 0 !== arguments[3]
                            ? arguments[3]
                            : {},
                    o = n.output,
                    s = void 0 === o ? 'string' : o;
                i = new c(i, 16);
                var u = t.substr(128, 64),
                    h = t.substr(192);
                r === B &&
                    ((u = t.substr(t.length - 64)),
                    (h = t.substr(128, t.length - 128 - 64)));
                var a = m.hexToArray(h),
                    f = m
                        .getGlobalCurve()
                        .decodePointHex('04' + t.substr(0, 128)),
                    l = f.multiply(i),
                    p = m.hexToArray(
                        m.leftPad(l.getX().toBigInteger().toRadix(16), 64)
                    ),
                    v = m.hexToArray(
                        m.leftPad(l.getY().toBigInteger().toRadix(16), 64)
                    ),
                    y = 1,
                    d = 0,
                    T = [],
                    F = [].concat(p, v),
                    b = function () {
                        (T = g(
                            [].concat(e(F), [
                                (y >> 24) & 255,
                                (y >> 16) & 255,
                                (y >> 8) & 255,
                                255 & y,
                            ])
                        )),
                            y++,
                            (d = 0);
                    };
                b();
                for (var w = 0, x = a.length; w < x; w++)
                    d === T.length && b(), (a[w] ^= 255 & T[d++]);
                return m.arrayToHex(g([].concat(p, a, v))) === u.toLowerCase()
                    ? 'array' === s
                        ? a
                        : m.arrayToUtf8(a)
                    : 'array' === s
                    ? []
                    : '';
            }
            function s(t, i) {
                var r =
                        arguments.length > 2 && void 0 !== arguments[2]
                            ? arguments[2]
                            : {},
                    e = r.pointPool,
                    n = r.der,
                    o = r.hash,
                    s = r.publicKey,
                    u = r.userId,
                    l = 'string' == typeof t ? m.utf8ToHex(t) : m.arrayToHex(t);
                o && ((s = s || a(i)), (l = h(l, s, u)));
                var p = new c(i, 16),
                    y = new c(l, 16),
                    g = null,
                    d = null,
                    T = null;
                do {
                    do {
                        var F = void 0;
                        (F = e && e.length ? e.pop() : f()),
                            (g = F.k),
                            (d = y.add(F.x1).mod(b));
                    } while (d.equals(c.ZERO) || d.add(g).equals(b));
                    T = p
                        .add(c.ONE)
                        .modInverse(b)
                        .multiply(g.subtract(d.multiply(p)))
                        .mod(b);
                } while (T.equals(c.ZERO));
                return n
                    ? v(d, T)
                    : m.leftPad(d.toString(16), 64) +
                          m.leftPad(T.toString(16), 64);
            }
            function u(t, i, r) {
                var e =
                        arguments.length > 3 && void 0 !== arguments[3]
                            ? arguments[3]
                            : {},
                    n = e.der,
                    o = e.hash,
                    s = e.userId,
                    u = 'string' == typeof t ? m.utf8ToHex(t) : m.arrayToHex(t);
                o && (u = h(u, r, s));
                var a = void 0,
                    f = void 0;
                if (n) {
                    var l = y(i);
                    (a = l.r), (f = l.s);
                } else
                    (a = new c(i.substring(0, 64), 16)),
                        (f = new c(i.substring(64), 16));
                var p = F.decodePointHex(r),
                    v = new c(u, 16),
                    g = a.add(f).mod(b);
                if (g.equals(c.ZERO)) return !1;
                var d = T.multiply(f).add(p.multiply(g)),
                    B = v.add(d.getX().toBigInteger()).mod(b);
                return a.equals(B);
            }
            function h(t, i) {
                var r =
                    arguments.length > 2 && void 0 !== arguments[2]
                        ? arguments[2]
                        : '1234567812345678';
                r = m.utf8ToHex(r);
                var e = m.leftPad(T.curve.a.toBigInteger().toRadix(16), 64),
                    n = m.leftPad(T.curve.b.toBigInteger().toRadix(16), 64),
                    o = m.leftPad(T.getX().toBigInteger().toRadix(16), 64),
                    s = m.leftPad(T.getY().toBigInteger().toRadix(16), 64);
                i.length > 128 && (i = i.substr(2, 128));
                var u = i.substr(0, 64),
                    h = i.substr(64, 64),
                    a = m.hexToArray(r + e + n + o + s + u + h),
                    f = 4 * r.length;
                a.unshift(255 & f), a.unshift((f >> 8) & 255);
                var l = g(a);
                return m.arrayToHex(g(l.concat(m.hexToArray(t))));
            }
            function a(t) {
                var i = T.multiply(new c(t, 16));
                return (
                    '04' +
                    m.leftPad(i.getX().toBigInteger().toString(16), 64) +
                    m.leftPad(i.getY().toBigInteger().toString(16), 64)
                );
            }
            function f() {
                var t = m.generateKeyPairHex(),
                    i = F.decodePointHex(t.publicKey);
                return (
                    (t.k = new c(t.privateKey, 16)),
                    (t.x1 = i.getX().toBigInteger()),
                    t
                );
            }
            var l = r(0),
                c = l.BigInteger,
                p = r(3),
                v = p.encodeDer,
                y = p.decodeDer,
                m = r(4),
                g = r(1),
                d = m.generateEcparam(),
                T = d.G,
                F = d.curve,
                b = d.n,
                B = 0;
            t.exports = {
                generateKeyPairHex: m.generateKeyPairHex,
                doEncrypt: n,
                doDecrypt: o,
                doSignature: s,
                doVerifySignature: u,
                getPoint: f,
                verifyPublicKey: m.verifyPublicKey,
            };
        },
        function (t, i, r) {
            'use strict';
            function e(t, i) {
                if (!t)
                    throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                    );
                return !i || ('object' != typeof i && 'function' != typeof i)
                    ? t
                    : i;
            }
            function n(t, i) {
                if ('function' != typeof i && null !== i)
                    throw new TypeError(
                        'Super expression must either be null or a function, not ' +
                            typeof i
                    );
                (t.prototype = Object.create(i && i.prototype, {
                    constructor: {
                        value: t,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0,
                    },
                })),
                    i &&
                        (Object.setPrototypeOf
                            ? Object.setPrototypeOf(t, i)
                            : (t.__proto__ = i));
            }
            function o(t, i) {
                if (!(t instanceof i))
                    throw new TypeError('Cannot call a class as a function');
            }
            function s(t) {
                var i = t.toString(16);
                if ('-' !== i[0])
                    i.length % 2 == 1
                        ? (i = '0' + i)
                        : i.match(/^[0-7]/) || (i = '00' + i);
                else {
                    i = i.substr(1);
                    var r = i.length;
                    r % 2 == 1 ? (r += 1) : i.match(/^[0-7]/) || (r += 2);
                    for (var e = '', n = 0; n < r; n++) e += 'f';
                    (e = new c(e, 16)),
                        (i = e.xor(t).add(c.ONE)),
                        (i = i.toString(16).replace(/^-/, ''));
                }
                return i;
            }
            function u(t, i) {
                return +t[i + 2] < 8 ? 1 : 128 & +t.substr(i + 2, 2);
            }
            function h(t, i) {
                var r = u(t, i),
                    e = t.substr(i + 2, 2 * r);
                return e
                    ? (+e[0] < 8
                          ? new c(e, 16)
                          : new c(e.substr(2), 16)
                      ).intValue()
                    : -1;
            }
            function a(t, i) {
                return i + 2 * (u(t, i) + 1);
            }
            var f = (function () {
                    function t(t, i) {
                        for (var r = 0; r < i.length; r++) {
                            var e = i[r];
                            (e.enumerable = e.enumerable || !1),
                                (e.configurable = !0),
                                'value' in e && (e.writable = !0),
                                Object.defineProperty(t, e.key, e);
                        }
                    }
                    return function (i, r, e) {
                        return r && t(i.prototype, r), e && t(i, e), i;
                    };
                })(),
                l = r(0),
                c = l.BigInteger,
                p = (function () {
                    function t() {
                        o(this, t),
                            (this.tlv = null),
                            (this.t = '00'),
                            (this.l = '00'),
                            (this.v = '');
                    }
                    return (
                        f(t, [
                            {
                                key: 'getEncodedHex',
                                value: function () {
                                    return (
                                        this.tlv ||
                                            ((this.v = this.getValue()),
                                            (this.l = this.getLength()),
                                            (this.tlv =
                                                this.t + this.l + this.v)),
                                        this.tlv
                                    );
                                },
                            },
                            {
                                key: 'getLength',
                                value: function () {
                                    var t = this.v.length / 2,
                                        i = t.toString(16);
                                    return (
                                        i.length % 2 == 1 && (i = '0' + i),
                                        t < 128
                                            ? i
                                            : (128 + i.length / 2).toString(
                                                  16
                                              ) + i
                                    );
                                },
                            },
                            {
                                key: 'getValue',
                                value: function () {
                                    return '';
                                },
                            },
                        ]),
                        t
                    );
                })(),
                v = (function (t) {
                    function i(t) {
                        o(this, i);
                        var r = e(
                            this,
                            (i.__proto__ || Object.getPrototypeOf(i)).call(this)
                        );
                        return (r.t = '02'), t && (r.v = s(t)), r;
                    }
                    return (
                        n(i, t),
                        f(i, [
                            {
                                key: 'getValue',
                                value: function () {
                                    return this.v;
                                },
                            },
                        ]),
                        i
                    );
                })(p),
                y = (function (t) {
                    function i(t) {
                        o(this, i);
                        var r = e(
                            this,
                            (i.__proto__ || Object.getPrototypeOf(i)).call(this)
                        );
                        return (r.t = '30'), (r.asn1Array = t), r;
                    }
                    return (
                        n(i, t),
                        f(i, [
                            {
                                key: 'getValue',
                                value: function () {
                                    return (
                                        (this.v = this.asn1Array
                                            .map(function (t) {
                                                return t.getEncodedHex();
                                            })
                                            .join('')),
                                        this.v
                                    );
                                },
                            },
                        ]),
                        i
                    );
                })(p);
            t.exports = {
                encodeDer: function (t, i) {
                    var r = new v(t),
                        e = new v(i);
                    return new y([r, e]).getEncodedHex();
                },
                decodeDer: function (t) {
                    var i = a(t, 0),
                        r = a(t, i),
                        e = h(t, i),
                        n = t.substr(r, 2 * e),
                        o = r + n.length,
                        s = a(t, o),
                        u = h(t, o),
                        f = t.substr(s, 2 * u);
                    return { r: new c(n, 16), s: new c(f, 16) };
                },
            };
        },
        function (t, i, r) {
            'use strict';
            function e() {
                return T;
            }
            function n() {
                var t = new p(
                        'FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00000000FFFFFFFFFFFFFFFF',
                        16
                    ),
                    i = new p(
                        'FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00000000FFFFFFFFFFFFFFFC',
                        16
                    ),
                    r = new p(
                        '28E9FA9E9D9F5E344D5A9E4BCF6509A7F39789F515AB8F92DDBCBD414D940E93',
                        16
                    ),
                    e = new m(t, i, r);
                return {
                    curve: e,
                    G: e.decodePointHex(
                        '0432C4AE2C1F1981195F9904466A39C9948FE30BBFF2660BE1715A4589334C74C7BC3736A2F4F6779C59BDCEE36B692153D0A9877CC62A474002DF32E52139F0A0'
                    ),
                    n: new p(
                        'FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFF7203DF6B21C6052B53BBF40939D54123',
                        16
                    ),
                };
            }
            function o(t, i, r) {
                var e = t ? new p(t, i, r) : new p(b.bitLength(), g),
                    n = e.mod(b.subtract(p.ONE)).add(p.ONE),
                    o = u(n.toString(16), 64),
                    s = F.multiply(n);
                return {
                    privateKey: o,
                    publicKey:
                        '04' +
                        u(s.getX().toBigInteger().toString(16), 64) +
                        u(s.getY().toBigInteger().toString(16), 64),
                };
            }
            function s(t) {
                t = unescape(encodeURIComponent(t));
                for (var i = t.length, r = [], e = 0; e < i; e++)
                    r[e >>> 2] |= (255 & t.charCodeAt(e)) << (24 - (e % 4) * 8);
                for (var n = [], o = 0; o < i; o++) {
                    var s = (r[o >>> 2] >>> (24 - (o % 4) * 8)) & 255;
                    n.push((s >>> 4).toString(16)),
                        n.push((15 & s).toString(16));
                }
                return n.join('');
            }
            function u(t, i) {
                return t.length >= i
                    ? t
                    : new Array(i - t.length + 1).join('0') + t;
            }
            function h(t) {
                return t
                    .map(function (t) {
                        return (
                            (t = t.toString(16)), 1 === t.length ? '0' + t : t
                        );
                    })
                    .join('');
            }
            function a(t) {
                for (var i = [], r = 0, e = 0; e < 2 * t.length; e += 2)
                    (i[e >>> 3] |= parseInt(t[r], 10) << (24 - (e % 8) * 4)),
                        r++;
                try {
                    for (var n = [], o = 0; o < t.length; o++) {
                        var s = (i[o >>> 2] >>> (24 - (o % 4) * 8)) & 255;
                        n.push(String.fromCharCode(s));
                    }
                    return decodeURIComponent(escape(n.join('')));
                } catch (t) {
                    throw new Error('Malformed UTF-8 data');
                }
            }
            function f(t) {
                var i = [],
                    r = t.length;
                r % 2 != 0 && (t = u(t, r + 1)), (r = t.length);
                for (var e = 0; e < r; e += 2)
                    i.push(parseInt(t.substr(e, 2), 16));
                return i;
            }
            function l(t) {
                var i = T.decodePointHex(t);
                if (!i) return !1;
                var r = i.getX();
                return i
                    .getY()
                    .square()
                    .equals(
                        r.multiply(r.square()).add(r.multiply(T.a)).add(T.b)
                    );
            }
            var c = r(0),
                p = c.BigInteger,
                v = c.SecureRandom,
                y = r(5),
                m = y.ECCurveFp,
                g = new v(),
                d = n(),
                T = d.curve,
                F = d.G,
                b = d.n;
            t.exports = {
                getGlobalCurve: e,
                generateEcparam: n,
                generateKeyPairHex: o,
                utf8ToHex: s,
                leftPad: u,
                arrayToHex: h,
                arrayToUtf8: a,
                hexToArray: f,
                verifyPublicKey: l,
            };
        },
        function (t, i, r) {
            'use strict';
            function e(t, i) {
                if (!(t instanceof i))
                    throw new TypeError('Cannot call a class as a function');
            }
            var n = (function () {
                    function t(t, i) {
                        for (var r = 0; r < i.length; r++) {
                            var e = i[r];
                            (e.enumerable = e.enumerable || !1),
                                (e.configurable = !0),
                                'value' in e && (e.writable = !0),
                                Object.defineProperty(t, e.key, e);
                        }
                    }
                    return function (i, r, e) {
                        return r && t(i.prototype, r), e && t(i, e), i;
                    };
                })(),
                o = r(0),
                s = o.BigInteger,
                u = new s('3'),
                h = (function () {
                    function t(i, r) {
                        e(this, t), (this.x = r), (this.q = i);
                    }
                    return (
                        n(t, [
                            {
                                key: 'equals',
                                value: function (t) {
                                    return (
                                        t === this ||
                                        (this.q.equals(t.q) &&
                                            this.x.equals(t.x))
                                    );
                                },
                            },
                            {
                                key: 'toBigInteger',
                                value: function () {
                                    return this.x;
                                },
                            },
                            {
                                key: 'negate',
                                value: function () {
                                    return new t(
                                        this.q,
                                        this.x.negate().mod(this.q)
                                    );
                                },
                            },
                            {
                                key: 'add',
                                value: function (i) {
                                    return new t(
                                        this.q,
                                        this.x.add(i.toBigInteger()).mod(this.q)
                                    );
                                },
                            },
                            {
                                key: 'subtract',
                                value: function (i) {
                                    return new t(
                                        this.q,
                                        this.x
                                            .subtract(i.toBigInteger())
                                            .mod(this.q)
                                    );
                                },
                            },
                            {
                                key: 'multiply',
                                value: function (i) {
                                    return new t(
                                        this.q,
                                        this.x
                                            .multiply(i.toBigInteger())
                                            .mod(this.q)
                                    );
                                },
                            },
                            {
                                key: 'divide',
                                value: function (i) {
                                    return new t(
                                        this.q,
                                        this.x
                                            .multiply(
                                                i
                                                    .toBigInteger()
                                                    .modInverse(this.q)
                                            )
                                            .mod(this.q)
                                    );
                                },
                            },
                            {
                                key: 'square',
                                value: function () {
                                    return new t(
                                        this.q,
                                        this.x.square().mod(this.q)
                                    );
                                },
                            },
                        ]),
                        t
                    );
                })(),
                a = (function () {
                    function t(i, r, n, o) {
                        e(this, t),
                            (this.curve = i),
                            (this.x = r),
                            (this.y = n),
                            (this.z = null == o ? s.ONE : o),
                            (this.zinv = null);
                    }
                    return (
                        n(t, [
                            {
                                key: 'getX',
                                value: function () {
                                    return (
                                        null === this.zinv &&
                                            (this.zinv = this.z.modInverse(
                                                this.curve.q
                                            )),
                                        this.curve.fromBigInteger(
                                            this.x
                                                .toBigInteger()
                                                .multiply(this.zinv)
                                                .mod(this.curve.q)
                                        )
                                    );
                                },
                            },
                            {
                                key: 'getY',
                                value: function () {
                                    return (
                                        null === this.zinv &&
                                            (this.zinv = this.z.modInverse(
                                                this.curve.q
                                            )),
                                        this.curve.fromBigInteger(
                                            this.y
                                                .toBigInteger()
                                                .multiply(this.zinv)
                                                .mod(this.curve.q)
                                        )
                                    );
                                },
                            },
                            {
                                key: 'equals',
                                value: function (t) {
                                    return (
                                        t === this ||
                                        (this.isInfinity()
                                            ? t.isInfinity()
                                            : t.isInfinity()
                                            ? this.isInfinity()
                                            : !!t.y
                                                  .toBigInteger()
                                                  .multiply(this.z)
                                                  .subtract(
                                                      this.y
                                                          .toBigInteger()
                                                          .multiply(t.z)
                                                  )
                                                  .mod(this.curve.q)
                                                  .equals(s.ZERO) &&
                                              t.x
                                                  .toBigInteger()
                                                  .multiply(this.z)
                                                  .subtract(
                                                      this.x
                                                          .toBigInteger()
                                                          .multiply(t.z)
                                                  )
                                                  .mod(this.curve.q)
                                                  .equals(s.ZERO))
                                    );
                                },
                            },
                            {
                                key: 'isInfinity',
                                value: function () {
                                    return (
                                        (null === this.x && null === this.y) ||
                                        (this.z.equals(s.ZERO) &&
                                            !this.y
                                                .toBigInteger()
                                                .equals(s.ZERO))
                                    );
                                },
                            },
                            {
                                key: 'negate',
                                value: function () {
                                    return new t(
                                        this.curve,
                                        this.x,
                                        this.y.negate(),
                                        this.z
                                    );
                                },
                            },
                            {
                                key: 'add',
                                value: function (i) {
                                    if (this.isInfinity()) return i;
                                    if (i.isInfinity()) return this;
                                    var r = this.x.toBigInteger(),
                                        e = this.y.toBigInteger(),
                                        n = this.z,
                                        o = i.x.toBigInteger(),
                                        u = i.y.toBigInteger(),
                                        h = i.z,
                                        a = this.curve.q,
                                        f = r.multiply(h).mod(a),
                                        l = o.multiply(n).mod(a),
                                        c = f.subtract(l),
                                        p = e.multiply(h).mod(a),
                                        v = u.multiply(n).mod(a),
                                        y = p.subtract(v);
                                    if (s.ZERO.equals(c))
                                        return s.ZERO.equals(y)
                                            ? this.twice()
                                            : this.curve.infinity;
                                    var m = f.add(l),
                                        g = n.multiply(h).mod(a),
                                        d = c.square().mod(a),
                                        T = c.multiply(d).mod(a),
                                        F = g
                                            .multiply(y.square())
                                            .subtract(m.multiply(d))
                                            .mod(a),
                                        b = c.multiply(F).mod(a),
                                        B = y
                                            .multiply(d.multiply(f).subtract(F))
                                            .subtract(p.multiply(T))
                                            .mod(a),
                                        w = T.multiply(g).mod(a);
                                    return new t(
                                        this.curve,
                                        this.curve.fromBigInteger(b),
                                        this.curve.fromBigInteger(B),
                                        w
                                    );
                                },
                            },
                            {
                                key: 'twice',
                                value: function () {
                                    if (this.isInfinity()) return this;
                                    if (!this.y.toBigInteger().signum())
                                        return this.curve.infinity;
                                    var i = this.x.toBigInteger(),
                                        r = this.y.toBigInteger(),
                                        e = this.z,
                                        n = this.curve.q,
                                        o = this.curve.a.toBigInteger(),
                                        s = i
                                            .square()
                                            .multiply(u)
                                            .add(o.multiply(e.square()))
                                            .mod(n),
                                        h = r.shiftLeft(1).multiply(e).mod(n),
                                        a = r.square().mod(n),
                                        f = a.multiply(i).multiply(e).mod(n),
                                        l = h.square().mod(n),
                                        c = s
                                            .square()
                                            .subtract(f.shiftLeft(3))
                                            .mod(n),
                                        p = h.multiply(c).mod(n),
                                        v = s
                                            .multiply(
                                                f.shiftLeft(2).subtract(c)
                                            )
                                            .subtract(
                                                l.shiftLeft(1).multiply(a)
                                            )
                                            .mod(n),
                                        y = h.multiply(l).mod(n);
                                    return new t(
                                        this.curve,
                                        this.curve.fromBigInteger(p),
                                        this.curve.fromBigInteger(v),
                                        y
                                    );
                                },
                            },
                            {
                                key: 'multiply',
                                value: function (t) {
                                    if (this.isInfinity()) return this;
                                    if (!t.signum()) return this.curve.infinity;
                                    for (
                                        var i = t.multiply(u),
                                            r = this.negate(),
                                            e = this,
                                            n = i.bitLength() - 2;
                                        n > 0;
                                        n--
                                    ) {
                                        e = e.twice();
                                        var o = i.testBit(n);
                                        o !== t.testBit(n) &&
                                            (e = e.add(o ? this : r));
                                    }
                                    return e;
                                },
                            },
                        ]),
                        t
                    );
                })(),
                f = (function () {
                    function t(i, r, n) {
                        e(this, t),
                            (this.q = i),
                            (this.a = this.fromBigInteger(r)),
                            (this.b = this.fromBigInteger(n)),
                            (this.infinity = new a(this, null, null));
                    }
                    return (
                        n(t, [
                            {
                                key: 'equals',
                                value: function (t) {
                                    return (
                                        t === this ||
                                        (this.q.equals(t.q) &&
                                            this.a.equals(t.a) &&
                                            this.b.equals(t.b))
                                    );
                                },
                            },
                            {
                                key: 'fromBigInteger',
                                value: function (t) {
                                    return new h(this.q, t);
                                },
                            },
                            {
                                key: 'decodePointHex',
                                value: function (t) {
                                    switch (parseInt(t.substr(0, 2), 16)) {
                                        case 0:
                                            return this.infinity;
                                        case 2:
                                        case 3:
                                            return null;
                                        case 4:
                                        case 6:
                                        case 7:
                                            var i = (t.length - 2) / 2,
                                                r = t.substr(2, i),
                                                e = t.substr(i + 2, i);
                                            return new a(
                                                this,
                                                this.fromBigInteger(
                                                    new s(r, 16)
                                                ),
                                                this.fromBigInteger(
                                                    new s(e, 16)
                                                )
                                            );
                                        default:
                                            return null;
                                    }
                                },
                            },
                        ]),
                        t
                    );
                })();
            t.exports = { ECPointFp: a, ECCurveFp: f };
        },
    ]);
});
