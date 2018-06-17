/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.inflate = function(s) {
	var lbits = 9;
	var dbits = 6;
	var fixed_bl, fixed_tl = null, fixed_bd, fixed_td;
	var mask_bits = [0x0000, 0x0001, 0x0003, 0x0007, 0x000f, 0x001f, 0x003f, 0x007f, 0x00ff, 0x01ff, 0x03ff, 0x07ff, 0x0fff, 0x1fff, 0x3fff, 0x7fff, 0xffff];
	var cplens = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0];
	var cplext = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 99, 99];
	var cpdist = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577];
	var cpdext = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
	var border = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
	var arr = [], bin;
	var slide = new Array(0x10000);
	var wp = 0;
	var bit_buf = 0;
	var bit_len = 0;
	var method = -1;
	var eof = false;
	var copy_leng = 0;
	var copy_dist = 0;
	var td, tl = null;
	var data = s;
	var pos = 0;
	var bd, bl;
	var HuftBuild = function(b, n, s, d, e, mm) {
	    var hroot = null, tail = null;
		var a, el, f, g, h, i, j, k;
		var p, pidx, q, r = {e: 0, b: 0, n: 0, t: null};
		var w;
		var xp, y, z, o;
		var c = Array(17).fill(0);
		var lx = Array(17).fill(0);
		var u = Array(16).fill(null);
		var v = Array(288).fill(0);
		var x = Array(17).fill(0);
		el = n > 256 ? b[256] : 16;
		p = b;
		pidx = 0;
		i = n;
		do {
		    c[p[pidx]]++;
		    pidx++;
		} while (--i > 0);
		if (c[0] === n) {
		    return {status: 0, root: null, m: 0};
		}
		for (j = 1; j <= 16; j++) {
		    if (c[j] !== 0) {
				break;
			}
		}
		k = j;
		if (mm < j) {
		    mm = j;
		}
		for (i = 16; i !== 0; i--) {
		    if (c[i] !== 0) {
				break;
			}
		}
		g = i;
		if (mm > i) {
		    mm = i;
		}
		for (y = 1 << j; j < i; j++, y <<= 1) {
		    if ((y -= c[j]) < 0) {
				return {status: 2, root: null, m: mm};
		    }
		}
		if ((y -= c[i]) < 0) {
		    return {status: 2, root: null, m: mm};
		}
		c[i] += y;
		x[1] = j = 0;
		p = c;
		pidx = 1;
		xp = 2;
		while (--i > 0) {
		    x[xp++] = (j += p[pidx++]);
		}
		p = b;
		pidx = 0;
		i = 0;
		do {
		    if ((j = p[pidx++]) !== 0) {
				v[x[j]++] = i;
			}
		} while (++i < n);
		n = x[g];
		x[0] = i = 0;
		p = v;
		pidx = 0;
		h = -1;
		w = lx[0] = 0;
		q = null;
		z = 0;
		for (; k <= g; k++) {
		    a = c[k];
		    while (a-- > 0) {
				while (k > w + lx[1 + h]) {
				    w += lx[1 + h];
				    h++;
				    z = (z = g - w) > mm ? mm : z;
				    if ((f = 1 << (j = k - w)) > a + 1) {
						f -= a + 1;
						xp = k;
						while (++j < z) {
						    if ((f <<= 1) <= c[++xp]) {
								break;
							}
						    f -= c[xp];
						}
				    }
				    if (w + j > el && w < el) {
						j = el - w;
					}
				    z = 1 << j;
				    lx[1 + h] = j;
				    q = [];
				    for (o = 0; o < z; o++) {
						q.push({e: 0, b: 0, n: 0, t: null});
				    }
				    if (tail === null) {
						tail = hroot = {next: null, list: null};
				    } else {
						tail = tail.next = {next: null, list: null};
					}
				    tail.next = null;
				    tail.list = q;
				    u[h] = q;
				    if (h > 0) {
						x[h] = i;
						r.b = lx[h];
						r.e = 16 + j;
						r.t = q;
						j = (i & ((1 << w) - 1)) >> (w - lx[h]);
						u[h - 1][j].e = r.e;
						u[h - 1][j].b = r.b;
						u[h - 1][j].n = r.n;
						u[h - 1][j].t = r.t;
				    }
				}
				r.b = k - w;
				if (pidx >= n) {
				    r.e = 99;
				} else if (p[pidx] < s) {
				    r.e = p[pidx] < 256 ? 16 : 15;
				    r.n = p[pidx++];
				} else {
				    r.e = e[p[pidx] - s];
				    r.n = d[p[pidx++] - s];
				}
				f = 1 << (k - w);
				for (j = i >> w; j < z; j += f) {
				    q[j].e = r.e;
				    q[j].b = r.b;
				    q[j].n = r.n;
				    q[j].t = r.t;
				}
				for (j = 1 << (k - 1); (i & j) !== 0; j >>= 1) {
				    i ^= j;
				}
				i ^= j;
				while ((i & ((1 << w) - 1)) !== x[h]) {
				    w -= lx[h];
				    h--;
				}
		    }
		}
		return {status: y !== 0 && g !== 1 ? 1 : 0, root: hroot, m: lx[1]};
	};
	var needbits = function(n) {
		while (bit_len < n) {
			bit_buf |= (data.length === pos ? -1 : data.charCodeAt(pos++) & 0xff) << bit_len;
			bit_len += 8;
		}
	};
	var getbits = function(n) {
		while (bit_len < n) {
			bit_buf |= (data.length === pos ? -1 : data.charCodeAt(pos++) & 0xff) << bit_len;
			bit_len += 8;
		}
	    return bit_buf & mask_bits[n];
	};
	var dumpbits = function(n) {
	    bit_buf >>= n;
	    bit_len -= n;
	};
	var codes = function(buff, off, size) {
	    var e, t, n;
		if (size === 0) {
			return 0;
		}
	    n = 0;
	    for(;;) {
			t = tl.list[getbits(bl)];
			e = t.e;
			while (e > 16) {
				if (e === 99) {
					return -1;
				}
				dumpbits(t.b);
				e -= 16;
				t = t.t[getbits(e)];
				e = t.e;
			}
			dumpbits(t.b);
			if (e === 16) {
			    wp &= 0x7fff;
			    buff[off + n++] = slide[wp++] = t.n;
			    if (n === size) {
					return size;
				}
			    continue;
			}
			if (e === 15) {
			    break;
			}
			copy_leng = t.n + getbits(e);
			dumpbits(e);
			t = td.list[getbits(bd)];
			e = t.e;
			while (e > 16) {
			    if (e === 99) {
					return -1;
				}
			    dumpbits(t.b);
			    e -= 16;
			    t = t.t[getbits(e)];
			    e = t.e;
			}
			dumpbits(t.b);
			copy_dist = wp - t.n - getbits(e);
			dumpbits(e);
			while (copy_leng > 0 && n < size) {
			    copy_leng--;
			    copy_dist &= 0x7fff;
			    wp &= 0x7fff;
			    buff[off + n++] = slide[wp++] = slide[copy_dist++];
			}
			if (n === size) {
				return size;
			}
	    }
	    method = -1;
	    return n;
	};
	var stored = function(buff, off, size) {
	    var n;
	    n = bit_len & 7;
	    dumpbits(n);
	    n = getbits(16);
	    dumpbits(16);
	    needbits(16);
		if (n !== ((~bit_buf) & 0xffff)) {
			return -1;
		}
	    dumpbits(16);
	    copy_leng = n;
	    n = 0;
	    while (copy_leng > 0 && n < size) {
			copy_leng--;
			wp &= 0x7fff;
			buff[off + n++] = slide[wp++] = getbits(8);
			dumpbits(8);
	    }
	    if (copy_leng === 0) {
			method = -1;
		}
		return n;
	};
	var fixed = function(buff, off, size) {
		if (fixed_tl === null) {
			var l = Array(288).fill(8, 0, 144).fill(9, 144, 256).fill(7, 256, 280).fill(8, 280, 288);
			var h;
			fixed_bl = 7;
			h = HuftBuild(l, 288, 257, cplens, cplext, fixed_bl);
			if (h.status !== 0) {
			    return -1;
			}
			fixed_tl = h.root;
			fixed_bl = h.m;
			l.fill(5, 0, 30);
			fixed_bd = 5;
			h = HuftBuild(l, 30, 0, cpdist, cpdext, fixed_bd);
			if (h.status > 1) {
			    fixed_tl = null;
			    return -1;
			}
			fixed_td = h.root;
			fixed_bd = h.m;
	    }
	    tl = fixed_tl;
	    td = fixed_td;
	    bl = fixed_bl;
	    bd = fixed_bd;
	    return codes(buff, off, size);
	};
	var dynamic = function(buff, off, size) {
	    var i, j, h, l, n, t, nb, nl, nd, ll = Array(316).fill(0);
	    nl = 257 + getbits(5);
	    dumpbits(5);
	    nd = 1 + getbits(5);
	    dumpbits(5);
	    nb = 4 + getbits(4);
	    dumpbits(4);
	    if (nl > 286 || nd > 30) {
	    	return -1;
	    }
	    for (j = 0; j < nb; j++) {
			ll[border[j]] = getbits(3);
			dumpbits(3);
	    }
	    for (; j < 19; j++) {
			ll[border[j]] = 0;
		}
	    bl = 7;
	    h = HuftBuild(ll, 19, 19, null, null, bl);
	    if (h.status !== 0) {
			return -1;
		}
	    tl = h.root;
	    bl = h.m;
	    n = nl + nd;
	    i = l = 0;
	    while (i < n) {
			t = tl.list[getbits(bl)];
			j = t.b;
			dumpbits(j);
			j = t.n;
			if (j < 16) {
			    ll[i++] = l = j;
			} else if (j ===  16) {
			    j = 3 + getbits(2);
			    dumpbits(2);
			    if (i + j > n) {
					return -1;
				}
			    while (j-- > 0) {
					ll[i++] = l;
				}
			} else if (j === 17) {
			    j = 3 + getbits(3);
			    dumpbits(3);
			    if (i + j > n) {
					return -1;
				}
			    while (j-- > 0) {
					ll[i++] = 0;
				}
			    l = 0;
			} else {
			    j = 11 + getbits(7);
			    dumpbits(7);
			    if (i + j > n) {
					return -1;
				}
			    while (j-- > 0) {
					ll[i++] = 0;
				}
			    l = 0;
			}
	    }
	    bl = lbits;
	    h = HuftBuild(ll, nl, 257, cplens, cplext, bl);
	    if (bl === 0) {
			h.status = 1;
		}
	    if (h.status !== 0) {
			return -1;
	    }
	    tl = h.root;
	    bl = h.m;
	    for (i = 0; i < nd; i++) {
			ll[i] = ll[i + nl];
		}
	    bd = dbits;
	    h = HuftBuild(ll, nd, 0, cpdist, cpdext, bd);
	    td = h.root;
	    bd = h.m;
	    if (bd === 0 && nl > 257) {
			return -1;
	    }
	    if (h.status !== 0) {
			return -1;
		}
	    return codes(buff, off, size);
	};
	var internal = function(buff) {
	    var n, i, size = 1024;
	    n = 0;
	    while (n < size) {
			if (eof && method === -1) {
				return n;
			}
			if (copy_leng > 0) {
				if (method !== 0) {
					while (copy_leng > 0 && n < size) {
					    copy_leng--;
					    copy_dist &= 0x7fff;
					    wp &= 0x7fff;
					    buff[n++] = slide[wp++] = slide[copy_dist++];
					}
			    } else {
					while (copy_leng > 0 && n < size) {
					    copy_leng--;
					    wp &= 0x7fff;
					    buff[n++] = slide[wp++] = getbits(8);
					    dumpbits(8);
					}
					if (copy_leng === 0) {
					    method = -1;
					}
			    }
			    if (n === size) {
					return n;
				}
			}
			if (method === -1) {
			    if (eof) {
					break;
				}
			    if (getbits(1) !== 0) {
					eof = true;
				}
			    dumpbits(1);
			    method = getbits(2);
			    dumpbits(2);
			    tl = null;
			    copy_leng = 0;
			}
			switch (method) {
			  case 0:
			    i = stored(buff, n, size - n);
			    break;
			  case 1:
			    if (tl !== null) {
					i = codes(buff, n, size - n);
			    } else {
					i = fixed(buff, n, size - n);
				}
			    break;
			  case 2:
			    if (tl !== null) {
					i = codes(buff, n, size - n);
			    } else {
					i = dynamic(buff, n, size - n);
				}
			    break;
			  default:
			    i = -1;
			    break;
			}
			if (i === -1) {
			    if (eof) {
					return 0;
				}
			    return -1;
			}
			n += i;
	    }
	    return n;
	};
	do {
		bin = [];
		internal(bin);
		arr.push(bin.reduce(function(s, c) {return s + String.fromCharCode(c);}, ""));
	} while (bin.length > 0);
	return arr.join("");
};