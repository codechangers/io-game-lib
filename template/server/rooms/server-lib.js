!(function (t, e) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = e())
    : 'function' == typeof define && define.amd
    ? define([], e)
    : 'object' == typeof exports
    ? (exports['server-lib'] = e())
    : (t['server-lib'] = e());
})(global, function () {
  return (
    (t = {
      541: (t) => {
        function e(t, e, i, s) {
          const o =
              'x' === i
                ? [e.x - e.width / 2, e.x + e.width / 2]
                : [e.y - e.height / 2, e.y + e.height / 2],
            n = 'x' === i ? t.width : t.height;
          return s < 0 ? o[1] + n / 2 : o[0] - n / 2;
        }
        function i(t, e, i) {
          const s = t[i] > e[i] ? 1 : -1,
            o = 'x' === i ? 'y' : 'x';
          return (
            Math.sqrt(
              Math.pow(t.width / 2 + e.width / 2 + 2e-6, 2) -
                Math.pow(t[o] - e[o], 2)
            ) *
              s +
            e[i]
          );
        }
        function s(t, e, s, o) {
          const n = t.width / 2;
          let c = [];
          for (let t in o) o[t] < n && c.push(t);
          const a = { left: !1, top: !1, right: !0, bottom: !0 };
          function r(o, n) {
            const r = e.x + (e.width / 2) * (a[o] ? 1 : -1),
              h = e.y + (e.height / 2) * (a[n] ? 1 : -1),
              l = a[o] ? [r, t.x] : [t.x, r],
              d = a[n] ? [h, t.y] : [t.y, h];
            if (
              c.includes(o + 'Dist') &&
              c.includes(n + 'Dist') &&
              l[0] < l[1] &&
              d[0] < d[1]
            ) {
              newPos = i(t, { x: r, y: h, width: 0 }, s);
              const e = a['x' === s ? o : n] ? [t[s], newPos] : [newPos, t[s]];
              return e[0] < e[1] ? newPos : t[s];
            }
          }
          return (
            r('left', 'top') ||
            r('left', 'bottom') ||
            r('right', 'top') ||
            r('right', 'bottom') ||
            -1
          );
        }
        const o = {
          useBarrier: function (t, e) {
            const { barriers: i } = this.game;
            Object.keys(i).includes(t) ? i[t].push(e) : (i[t] = [e]);
          },
          checkBarriers: function (t, o, n) {
            const { barriers: c, shapes: a } = this.game;
            let r = !0,
              h = -1;
            return (
              Object.keys(c).includes(t.type) &&
                c[t.type].forEach((c) => {
                  this.handleCollision(
                    { ...t, [o]: t[o] + n },
                    c,
                    (t, l, d) => {
                      if (
                        ((r = !1), 'circle' === a[c] && 'circle' === a[t.type])
                      )
                        h = i(t, l, o);
                      else if ('circle' === a[c]) {
                        const i = s(l, t, o, d);
                        h = -1 !== i ? t[o] + l[o] - i : e(t, l, o, n);
                      } else if ('circle' === a[t.type]) {
                        const i = s(t, l, o, d);
                        h = -1 !== i ? i : e(t, l, o, n);
                      } else h = e(t, l, o, n);
                    }
                  );
                }),
              { validMove: r, fallbackPos: h }
            );
          },
        };
        t.exports = { server: o };
      },
      222: (t) => {
        const e = {
          setupCharacters: function (t, e = 'box') {
            (this.game.state[t] = {}), (this.game.shapes[t] = e);
          },
          createACharacter: function (t, e, i) {
            this.game.state[t][e] = {
              ...this.getSize(t),
              ...i,
              id: e,
              type: t,
            };
          },
          getACharacter: function (t, e) {
            return this.game.state[t][e];
          },
          deleteACharacter: function (t, e) {
            delete this.game.state[t][e];
          },
          nextCharacterId: function (t) {
            return `${t}${Object.keys(this.game.state[t]).length + 1}`;
          },
        };
        t.exports = {
          client: {
            addCharacters: function (t, e = 1) {
              (this.game[t] = {}),
                (this.game.scales[t] = e),
                this.sendSpriteSize(t, e);
            },
            getCharacters: function (
              t,
              e = function () {},
              i = function () {},
              s = function () {}
            ) {
              const { game: o } = this;
              o.roomJoined
                ? (o.room.listen(t + '/:id', function (s) {
                    if ('add' == s.operation) {
                      const { id: i, x: n, y: c } = s.value,
                        a = o.add.sprite(n, c, t);
                      a.setScale(o.scales[t] || 1),
                        (o[t][i] = { sprite: a, ...s.value }),
                        e(o[t][i], s.value);
                    } else if ('remove' == s.operation) {
                      const { id: e } = s.path;
                      o[t][e].sprite.destroy(), delete o[t][e], i(e);
                    }
                  }),
                  o.room.listen(t + '/:id/:attribute', function (e) {
                    if ('replace' == e.operation) {
                      const { id: i, attribute: n } = e.path;
                      'x' == n || 'y' == n
                        ? (o[t][i].sprite[n] = e.value)
                        : (o[t][i][n] = e.value),
                        s(i, n, e.value);
                    }
                  }))
                : this.addConnectEvent('getCharacters', [t, e, i, s]);
            },
          },
          server: e,
        };
      },
      892: (t) => {
        class e {
          constructor(t, e, i, s) {
            (this.width = Number.isNaN(i) ? 0 : i),
              (this.height = Number.isNaN(s) ? 0 : s),
              (this.x = !Number.isNaN(t) && t >= 0 ? t - this.width / 2 : -100),
              (this.y =
                !Number.isNaN(e) && e >= 0 ? e - this.height / 2 : -100);
          }
          collide(t) {
            let s = -1,
              o = !1;
            if (t instanceof e)
              o =
                this.x < t.x + t.width &&
                this.x + this.width > t.x &&
                this.y < t.y + t.height &&
                this.y + this.height > t.y;
            else if (t instanceof i) {
              const e = t.collide(this);
              (o = e.collided), (s = e.distance);
            } else
              console.log(
                ' * CollisionBox.collide: You can only collide with another collision object!'
              );
            return { collided: o, distance: s };
          }
        }
        class i {
          constructor(t, e, i) {
            (this.x = !Number.isNaN(t) && t >= 0 ? t : -100),
              (this.y = !Number.isNaN(e) && e >= 0 ? e : -100),
              (this.radius = Number.isNaN(i) ? 0 : i / 2);
          }
          distanceTo(t) {
            let s = -1;
            if (t instanceof i) {
              const e = this.x - t.x,
                i = this.y - t.y;
              s = Math.sqrt(e * e + i * i);
            } else if (t instanceof e) {
              const e =
                  Math.abs(
                    t.height * this.x + t.x * t.y - t.x * (t.y + t.height)
                  ) / Math.sqrt(t.height ** 2),
                i =
                  Math.abs(
                    t.height * this.x +
                      (t.x + t.width) * t.y -
                      (t.x + t.width) * (t.y + t.height)
                  ) / Math.sqrt(t.height ** 2),
                o =
                  Math.abs(
                    -t.width * this.y + (t.x + t.width) * t.y - t.x * t.y
                  ) / Math.sqrt(t.width ** 2),
                n =
                  Math.abs(
                    -t.width * this.y +
                      (t.x + t.width) * (t.y + t.height) -
                      t.x * (t.y + t.height)
                  ) / Math.sqrt(t.width ** 2),
                c = this.x - (t.x + t.width / 2),
                a = this.y - (t.y + t.height / 2);
              s = {
                leftDist: e,
                rightDist: i,
                topDist: o,
                bottomDist: n,
                centerDist: Math.sqrt(c * c + a * a),
              };
            } else
              console.log(
                ' * CollisionCircle.distanceTo: You can only check with another collision object!'
              );
            return s;
          }
          collide(t) {
            let s = -1,
              o = !1;
            if (t instanceof i)
              (s = this.distanceTo(t)), (o = s < this.radius + t.radius);
            else if (t instanceof e) {
              s = this.distanceTo(t);
              const {
                  leftDist: e,
                  rightDist: i,
                  topDist: n,
                  bottomDist: c,
                  centerDist: a,
                } = s,
                r =
                  e < this.radius ||
                  i < this.radius ||
                  (this.x > t.x && this.x < t.x + t.width),
                h =
                  n < this.radius ||
                  c < this.radius ||
                  (this.y > t.y && this.y < t.y + t.height),
                l = Math.sqrt((t.width / 2) ** 2 + (t.height / 2) ** 2);
              o = r && h && a < this.radius + l;
            } else
              console.log(
                ' * CollisionCircle.collide: You can only collide with another collision object!'
              );
            return { collided: o, distance: s };
          }
        }
        const s = {
          handleCollision: function (t, s, o) {
            const { state: n, shapes: c } = this.game,
              a = 'string' == typeof t ? c[t] : c[t.type],
              r = 'string' == typeof s ? c[s] : c[s.type];
            Object.entries('string' == typeof t ? n[t] : { [t.id]: t }).forEach(
              function ([t, c]) {
                const { x: h, y: l, width: d, height: u } = c,
                  f = 'circle' === a ? new i(h, l, d) : new e(h, l, d, u);
                Object.entries(
                  'string' == typeof s ? n[s] : { [s.id]: s }
                ).forEach(function ([s, n]) {
                  if (t !== s) {
                    const { x: t, y: s, width: a, height: h } = n,
                      l = 'circle' === r ? new i(t, s, a) : new e(t, s, a, h),
                      d = f.collide(l);
                    d.collided && o(c, n, d.distance);
                  }
                });
              }
            );
          },
        };
        t.exports = { server: s };
      },
      228: (t) => {
        t.exports = {
          client: {
            connect: function (t = {}) {
              const { game: e, colyseus: i, connectEvents: s } = this;
              let o = this;
              (e.room = i.join('main', t)),
                e.room.onJoin.add(() => {
                  e.roomJoined = !0;
                  for (let t in s) for (let e in s[t]) this[t](...s[t][e]);
                }),
                e.room.listen('board/:id', function (t) {
                  'add' == t.operation &&
                    (o.setSize(500, 500),
                    o.createSquare(
                      0,
                      0,
                      t.value.width,
                      t.value.height,
                      t.value.color
                    ));
                });
            },
            addConnectEvent: function (t, e) {
              const { connectEvents: i } = this;
              i[t] || (i[t] = []), i[t].push(e);
            },
            canSend: function () {
              return this.game.roomJoined;
            },
            sendAction: function (t, e) {
              e
                ? this.game.room.send({ [t]: !0, ...e })
                : this.game.room.send({ [t]: !0 });
            },
            myId: function () {
              return this.game.room.sessionId;
            },
          },
          server: {
            handleActions: function (t, e) {
              const i = { ...this.defaultActions, ...t };
              for (let t in i) e[t] && i[t](e);
            },
          },
        };
      },
      800: (t) => {
        const e = {
            drawBackground: function (
              t,
              e = 1,
              i = this.game.width,
              s = this.game.height
            ) {
              const { game: o } = this,
                n = o.add.sprite(0, 0, t);
              n.setScale(e), (n.depth = 0);
              let { width: c, height: a } = n;
              (c *= e), (a *= e);
              for (let n = 0; n <= Math.floor(i / c) + 1; n++)
                for (let i = 0; i <= Math.floor(s / a) + 1; i++)
                  if (n > 0 || i > 0) {
                    const s = o.add.sprite(c * n, a * i, t);
                    s.setScale(e), (s.depth = 0);
                  }
            },
            createSquare: function (t, e, i, s, o, n = 0) {
              const c = new Phaser.Geom.Rectangle(t, e, i, s),
                a = this.game.add.graphics({
                  fillStyle: { color: '0x' + o },
                  depth: n,
                });
              return a.fillRectShape(c), a;
            },
            updateSquare: function (t, e, i, s, o, n) {
              const c = new Phaser.Geom.Rectangle(t, e, i, s);
              n.clear(),
                (n.fillStyle = { color: '0x' + o }),
                n.fillRectShape(c);
            },
            createSprite: function (t, e, i, s = 1) {
              let o = this.game.add.sprite(e, i, t);
              return o.setScale(s), o;
            },
            getSpriteSize: function (t, e = 1) {
              let i = this.game.add.sprite(-100, -100, t),
                { width: s, height: o } = i;
              return i.destroy(), (s *= e), (o *= e), { width: s, height: o };
            },
          },
          i = {
            setupBoard: function (t, e, i) {
              (this.boardWidth = t),
                (this.boardHeight = e),
                (this.game.state.board.board = {
                  width: t,
                  height: e,
                  color: i,
                });
            },
            getSize: function (t) {
              const { sizes: e } = this.game;
              let i = { width: 0, height: 0 };
              return Object.keys(e).includes(t) && (i = e[t]), i;
            },
          };
        t.exports = { client: e, server: i };
      },
      417: (t) => {
        const e = {
          setBounds: function (t, e) {
            t > 0 && (this.game.gameWidth = t),
              e > 0 && (this.game.gameHeight = e);
          },
          checkBounds: function (t, e, i) {
            const { gameWidth: s, gameHeight: o } = this.game;
            let n = !0,
              c = -1;
            if (s && o) {
              const a = 'x' === e ? s : o,
                r = 'x' === e ? t.width : t.height,
                h = 'x' === e ? t.width / 2 : t.height / 2;
              t[e] - h + i < 0
                ? ((n = !1), (c = h))
                : t[e] - h + i + r > a && ((n = !1), (c = a - r + h));
            }
            return { validMove: n, fallbackPos: c };
          },
          move: function (t, e, i) {
            let s = !0,
              o = -1;
            const n = this.checkBounds(t, e, i);
            n.validMove || ((s = !1), (o = n.fallbackPos));
            const c = this.checkBarriers(t, e, i);
            c.validMove || ((s = !1), (o = c.fallbackPos)),
              s ? (t[e] += i) : (t[e] = o);
          },
          purchase: function (t, e = 'score', i, s, o = 1) {
            t[e] >= i && ((t[e] -= i), (t[s] += o));
          },
          setDefaultActions: function () {
            const { state: t, sizes: e } = this.game;
            this.defaultActions = {
              setSpriteSize: (i) => {
                const { type: s, width: o, height: n } = i;
                (e[s] = { width: o, height: n }),
                  Object.values(t[s]).forEach((t) => {
                    (t.width = o), (t.height = n);
                  });
              },
            };
          },
          runGameLoop: function () {
            const t = this;
            let e = Date.now();
            this.game.onUpdate &&
              setImmediate(function i() {
                const s = Date.now(),
                  o = s - e;
                o > 0 && (t.game.onUpdate(o), (e = s)), setImmediate(i);
              });
          },
        };
        t.exports = {
          client: {
            setSize: function (t, e) {
              const { game: i } = this;
              t > 0 && (i.width = t), e > 0 && (i.height = e);
            },
            loadImage: function (t, e) {
              return this.game.load.image(t, 'asset/' + e);
            },
            setupKeys: function (t) {
              const { game: e, addConnectEvent: i } = this;
              e.roomJoined
                ? (this.keys = this.game.input.keyboard.addKeys(t))
                : i('setupKeys', [t]);
            },
            getKeysDown: function () {
              const t = {};
              for (let e in this.keys) t[e] = this.keys[e].isDown;
              return t;
            },
            cameraFollow: function (t) {
              this.game.cameras.main.startFollow(t);
            },
            cameraBounds: function (t = this.game.width, e = this.game.height) {
              this.game.cameras.main.setBounds(0, 0, t, e);
            },
            sendSpriteSize: function (t, e = 1) {
              this.canSend()
                ? this.game.textures.exists(t) &&
                  this.sendAction('setSpriteSize', {
                    type: t,
                    ...this.getSpriteSize(t, e),
                  })
                : this.addConnectEvent('sendSpriteSize', [t, e]);
            },
          },
          server: e,
        };
      },
      225: (t, e, i) => {
        const s = i(222),
          o = i(228),
          n = i(800),
          c = i(417),
          a = i(488),
          r = i(281),
          h = i(892),
          l = i(541),
          d = i(83),
          u = {
            ...s.client,
            ...o.client,
            ...n.client,
            ...c.client,
            ...a.client,
            ...r.client,
            ...d.client,
          },
          f = {
            ...s.server,
            ...o.server,
            ...n.server,
            ...c.server,
            ...a.server,
            ...h.server,
            ...l.server,
            ...d.server,
          };
        t.exports = {
          clientMethods: u,
          serverMethods: f,
          linkMethods: function (t, e) {
            for (let i in e) t[i] = e[i].bind(t);
          },
        };
      },
      83: (t) => {
        const e = {
          setupLocations: function (t) {
            this.game.state[t] = {};
          },
          createALocation: function (t, e, i, s, o) {
            this.game.state[t][e] = { ...i, color: s, rules: o };
          },
          handleLocations: function (t, e) {
            const i = this;
            Object.values(this.game.state[t]).forEach((s) => {
              const { width: o, height: n, x: c, y: a } = s;
              this.game.sizes[t]
                ? i.handleCollision(e, s, function (t, e) {
                    e.rules(t);
                  })
                : i.handleCollision(
                    e,
                    { ...s, x: c + o / 2, y: a + n / 2 },
                    function (t, e) {
                      e.rules(t);
                    }
                  );
            });
          },
          nextLocationId: function (t) {
            return `${t}${Object.keys(this.game.state[t]).length + 1}`;
          },
        };
        t.exports = {
          client: {
            addLocations: function (t, e = 1) {
              (this.game[t] = {}),
                (this.game.scales[t] = e),
                this.sendSpriteSize(t, e);
            },
            getLocations: function (
              t,
              e = function () {},
              i = function () {},
              s = function () {}
            ) {
              const { game: o } = this,
                n = this;
              o.roomJoined
                ? (o.room.listen(t + '/:id', function (s) {
                    if ('add' == s.operation) {
                      const {
                        id: i,
                        x: c,
                        y: a,
                        width: r,
                        height: h,
                        color: l,
                      } = s.value;
                      if (o.textures.exists(t)) {
                        const e = o.add.sprite(c, a, t);
                        e.setScale(o.scales[t] || 1),
                          (o[t][i] = { sprite: e, ...s.value });
                      } else {
                        const e = n.createSquare(r, h, c, a, l);
                        o[t][i] = { graphics: e, ...s.value };
                      }
                      e(o[t][i], s.value);
                    } else if ('remove' == s.operation) {
                      const { id: e } = s.path,
                        { graphics: n, sprite: c } = o[t][e];
                      n && n.destroy(), c && c.destroy(), delete o[t][e], i(e);
                    }
                  }),
                  o.room.listen(t + '/:id/:attribute', function (e) {
                    if ('replace' == e.operation) {
                      const { id: i, attribute: c } = e.path,
                        a = o[t][i];
                      !a.graphics ||
                      ('x' != c &&
                        'y' != c &&
                        'width' != c &&
                        'height' != c &&
                        'color' != c)
                        ? !a.sprite || ('x' != c && 'y' != c)
                          ? (a[c] = e.value)
                          : (a.sprite[c] = e.value)
                        : ((a[c] = e.value),
                          n.updateSquare(
                            a.width,
                            a.height,
                            a.x,
                            a.y,
                            a.color,
                            a.graphics
                          )),
                        s(i, c, e.value);
                    }
                  }))
                : this.addConnectEvent('getLocations', [t, e, i, s]);
            },
          },
          server: e,
        };
      },
      488: (t) => {
        const e = {
          setupResources: function (t) {
            (this.game.state[t] = {}), (this.counts[t] = 0);
          },
          createResources: function (t, e) {
            for (var i = 0; i < e; i++) {
              let e = Math.random() * boardWidth,
                i = Math.random() * boardHeight;
              this.createAResource(t, e, i);
            }
          },
          createAResource: function (t, e, i) {
            (this.counts[t] += 1),
              (this.game.state[t][this.counts[t]] = {
                id: this.counts[t],
                x: e,
                y: i,
                type: 'resource',
                height: 103,
                width: 61,
              });
          },
          deleteAResource: function (t, e) {
            delete this.game.state[t][e];
          },
        };
        t.exports = {
          client: {
            addResources: function (t) {
              this.game[t] = {};
            },
            getResources: function (
              t,
              e = function () {},
              i = function () {},
              s = function () {}
            ) {
              const { game: o } = this;
              o.room.listen(t + '/:id', function (s) {
                if ('add' == s.operation) {
                  const { id: i, x: n, y: c } = s.value;
                  (o[t][i] = { sprite: o.add.sprite(n, c, t), id: i }),
                    e(o[t][i], s.value);
                } else if ('remove' == s.operation) {
                  const { id: e } = s.path;
                  o[t][e].sprite.destroy(), delete o[t][e], i(e);
                }
              }),
                o.room.listen(t + '/:id/:attribute', function (e) {
                  if ('replace' == e.operation) {
                    const { id: i, attribute: n } = e.path;
                    (o[t][i].sprite[n] = e.value), s(i, n, e.value);
                  }
                });
            },
          },
          server: e,
        };
      },
      877: (t, e, i) => {
        const { serverMethods: s, linkMethods: o } = i(225);
        t.exports = class {
          constructor() {
            (this.game = null),
              (this.counts = {}),
              (this.boardWidth = 500),
              (this.boardHeight = 500),
              (this.defaultActions = {});
          }
          setup(t) {
            (this.game = t),
              this.game.setState({ board: {} }),
              (this.game.sizes = {}),
              (this.game.shapes = {}),
              (this.game.barriers = {}),
              o(this, s),
              this.setDefaultActions(),
              this.runGameLoop();
          }
        };
      },
      281: (t) => {
        function e(t) {
          const e = document.getElementById('input-overlay');
          t && e.classList.contains('hide')
            ? e.classList.remove('hide')
            : t || e.classList.contains('hide') || e.classList.add('hide');
        }
        function i(t) {
          console.log(t + ' is joining...');
        }
        const s = (t) => t.join('\n');
        function o({ lives: t }) {
          const e = [];
          for (let i = 0; i < t; i++) e.push('<span class="life"></span>');
          return s(e);
        }
        const n = {
          StoreItem: class {
            constructor(t, e, i, s, o) {
              (this.image = 'asset/' + t),
                (this.name = e),
                (this.costAttr = i),
                (this.cost = s),
                (this.action = o);
            }
          },
          useLoginScreen: function (
            t = i,
            o = 'IO Game',
            n = 'Display Name',
            c = 'START'
          ) {
            const a = document.querySelector('#input-overlay > form.login');
            (a.innerHTML = s([
              `<h1>${o}</h1>`,
              `<input id="displayName" type="text" placeholder="${n}" />`,
              `<button type="submit">${c}</button>`,
            ])),
              e(!0),
              a.classList.remove('hide'),
              (a.onsubmit = function (i) {
                i.preventDefault();
                const s =
                  document.getElementById('displayName').value || 'player';
                a.classList.add('hide'), e(!1), t(s);
              });
          },
          handleLeaderboard: function (t, e = 'Leaderboard') {
            const { game: i } = this;
            document.querySelector(
              '#game-overlay > .leaderboard'
            ).innerHTML = s([
              `<h3>${e}</h3>`,
              ...Object.entries(i[t]).map(
                ([t, e]) =>
                  `<div class="player" id="${t}">\n      ${
                    'number' == typeof e.lives
                      ? s(['<div class="lives">', o(e), '</div>'])
                      : ''
                  }\n        <div class="text">\n          ${
                    'string' == typeof e.name
                      ? s([
                          '<p class="name"' +
                            (this.myId() === t
                              ? ' style="color: #8BE1FF;"'
                              : '') +
                            '>',
                          e.name,
                          '</p>',
                        ])
                      : ''
                  }\n          ${
                    'number' == typeof e.score
                      ? s([
                          '<p class="score"' +
                            (this.myId() === t
                              ? ' style="color: #8BE1FF;"'
                              : '') +
                            '>',
                          e.score,
                          '</p>',
                        ])
                      : ''
                  }\n        </div>\n      </div>`
              ),
            ]);
          },
          useStore: function (t = 'Store', e) {
            document.querySelector('#input-overlay > .store').innerHTML = s([
              `<h1>${t}</h1>`,
              ...e.map(
                (t) =>
                  `<div class="store-item">\n    <img src="${t.image}" />\n    <h2>${t.name}</h2>\n    <p>Cost: ${t.cost} x ${t.costAttr}</p>\n    <button id="${t.action}">Buy</button>\n    </div>`
              ),
            ]);
            const i = this;
            e.forEach((t) => {
              document.getElementById(t.action).onclick = function () {
                i.sendAction(t.action);
              };
            });
          },
          toggleStore: function () {
            const t = document.querySelector('#input-overlay > .store');
            !t.classList.contains('locked') && t.classList.contains('hide')
              ? (e(!0), t.classList.remove('hide'), t.classList.add('locked'))
              : t.classList.contains('locked') ||
                (e(!1), t.classList.add('hide'), t.classList.add('locked'));
          },
          unlockStore: function () {
            const t = document.querySelector('#input-overlay > .store');
            t.classList.contains('locked') && t.classList.remove('locked');
          },
        };
        t.exports = { client: n };
      },
    }),
    (e = {}),
    (function i(s) {
      if (e[s]) return e[s].exports;
      var o = (e[s] = { exports: {} });
      return t[s](o, o.exports, i), o.exports;
    })(877)
  );
  var t, e;
});
