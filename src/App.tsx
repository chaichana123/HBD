import { useEffect, useMemo, useRef, useState } from "react";
import "./app.css";

/** ====== แก้ตรงนี้ ====== */
const CONFIG = {
  name: "เบเบ",
  subtitle:
    "วันนี้ขอให้โลกใจดีกับแกเป็นพิเศษเลยนะ ✨",
  messageLines: [
    "ถึงคนฉ๋วย(สวย)ของข้า 💗",
    "",
    "สุขสันต์วันเกิดนะ!",
    "ขอบคุณที่อยู่ด้วยกันในทุกวัน ทั้งวันที่ดีและวันที่แย่",
    "เราภูมิใจในตัวแกมาก ๆ และอยากให้แกรู้ว่า…",
    "แกคือคนที่ทำให้โลกของเราน่ารักขึ้นจริง ๆ ✨",
    "",
    "ขอให้ปีนี้เป็นปีที่แกยิ้มบ่อย ๆ",
    "ได้ทำในสิ่งที่อยากทำ มีงานเข้ามาเยอะ (มาเลี้ยงข้า)",
    "ได้พักผ่อนแบบเต็มที่ ตื่นมาสดใสเจอข้าทุกเช้า",
    "แล้วก็…ขอให้มีเราอยู่ข้าง ๆ แบบนี้ไปนาน ๆ นะ 🥺💞",
    "",
    "รักแกที่สุดเลย MY BEV 🤍",
  ],
  coupons: [
    { title: "กินของอร่อย 1 มื้อ (เธอเลือก!)", emoji: "🍜" },
    { title: "กอดแน่น ๆ 10 นาที", emoji: "🤗" },
    { title: "ซื้อของให้ 1 อย่าง (อย่าแพงนร้า)", emoji: "🛍" },
    { title: "นวดให้ 10 นาที", emoji: "💆" },
    { title: "พาไปเที่ยว 1 ทริปเล็ก ๆ", emoji: "🧳" },
  ],
  photos: [
    { src: "/photos/1.jpg", label: "รูปที่ 1" },
    { src: "/photos/2.jpg", label: "รูปที่ 2" },
    { src: "/photos/3.jpg", label: "รูปที่ 3" },
    { src: "/photos/4.jpg", label: "รูปที่ 4" },
    { src: "/photos/5.jpg", label: "รูปที่ 5" },
    { src: "/photos/6.jpg", label: "รูปที่ 6" },
  ],
};
/** ====================== */

function useTyping(text, start, speedMs = 14) {
  const [value, setValue] = useState("");
  useEffect(() => {
    if (!start) return;
    let i = 0;
    let raf = 0;
    let last = performance.now();

    const tick = (t) => {
      if (t - last >= speedMs) {
        last = t;
        i += 1;
        setValue(text.slice(0, i));
      }
      if (i < text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, start, speedMs]);

  return value;
}

function ConfettiCanvas({ fireKey }) {
  const canvasRef = useRef(null);
  const piecesRef = useRef([]);
  const animRef = useRef(0);

  const resize = () => {
    const c = canvasRef.current;
    if (!c) return;
    c.width = window.innerWidth;
    c.height = window.innerHeight;
  };

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (!fireKey) return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const W = c.width;
    const H = c.height;

    const count = fireKey;
    for (let i = 0; i < count; i++) {
      piecesRef.current.push({
        x: Math.random() * W,
        y: -20 - Math.random() * H * 0.2,
        vx: (Math.random() - 0.5) * 6,
        vy: 3 + Math.random() * 6,
        s: 6 + Math.random() * 8,
        r: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.25,
        a: 1,
      });
    }

    const roundRect = (x, y, w, h, r) => {
      const min = Math.min(w, h);
      const rr = Math.min(r, min / 2);
      ctx.beginPath();
      ctx.moveTo(x + rr, y);
      ctx.arcTo(x + w, y, x + w, y + h, rr);
      ctx.arcTo(x + w, y + h, x, y + h, rr);
      ctx.arcTo(x, y + h, x, y, rr);
      ctx.arcTo(x, y, x + w, y, rr);
      ctx.closePath();
    };

    const animate = () => {
      const c2 = canvasRef.current;
      if (!c2) return;
      const ctx2 = c2.getContext("2d");
      const W2 = c2.width;
      const H2 = c2.height;

      ctx2.clearRect(0, 0, W2, H2);

      const pieces = piecesRef.current;
      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.r += p.vr;
        p.a *= 0.992;
        p.vy *= 0.997;

        ctx2.save();
        ctx2.globalAlpha = Math.max(0, p.a);
        ctx2.translate(p.x, p.y);
        ctx2.rotate(p.r);
        const hue = (p.x / W2) * 360;
        ctx2.fillStyle = `hsl(${hue}, 90%, 65%)`;
        roundRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6, 3);
        ctx2.fill();
        ctx2.restore();
      }

      piecesRef.current = pieces.filter((p) => p.y < H2 + 40 && p.a > 0.05);
      if (piecesRef.current.length) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        ctx2.clearRect(0, 0, W2, H2);
      }
    };

    cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [fireKey]);

  return <canvas className="confetti" ref={canvasRef} />;
}

/** ====== เกม 1: จับคู่ emoji (Memory 4 คู่) ====== */
function GameMatch({ onWin }) {
  const base = useMemo(() => ["💗", "🎂", "🐻", "🍓"], []);
  const deck = useMemo(() => {
    const arr = [...base, ...base]
      .map((v, i) => ({ id: `${v}-${i}`, v }))
      .sort(() => Math.random() - 0.5);
    return arr;
  }, [base]);

  const [open, setOpen] = useState([]); // ids
  const [matched, setMatched] = useState(() => new Set());
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (matched.size === deck.length) {
      onWin();
    }
  }, [matched, deck.length, onWin]);

  const canFlip = (id) =>
    !matched.has(id) && !open.includes(id) && open.length < 2;

  const flip = (id) => {
    if (!canFlip(id)) return;
    setOpen((prev) => [...prev, id]);
  };

  useEffect(() => {
    if (open.length !== 2) return;
    setMoves((m) => m + 1);

    const [a, b] = open;
    const A = deck.find((x) => x.id === a);
    const B = deck.find((x) => x.id === b);
    if (!A || !B) return;

    if (A.v === B.v) {
      setMatched((prev) => new Set(prev).add(a).add(b));
      setOpen([]);
    } else {
      const t = setTimeout(() => setOpen([]), 600);
      return () => clearTimeout(t);
    }
  }, [open, deck]);

  return (
    <div className="gameCard">
      <h3>เกม 1: จับคู่หัวใจ ✨</h3>
      <p className="gameHint">จับคู่ emoji ให้ครบ (4 คู่) เพื่อผ่านด่าน</p>

      <div className="matchGrid">
        {deck.map((c) => {
          const isOpen = open.includes(c.id) || matched.has(c.id);
          return (
            <button
              key={c.id}
              className={`matchTile ${isOpen ? "open" : ""}`}
              onClick={() => flip(c.id)}
              aria-label="tile"
            >
              <span>{isOpen ? c.v : "?"}</span>
            </button>
          );
        })}
      </div>
      <div className="gameMeta">จำนวนครั้งที่ลอง: {moves}</div>
    </div>
  );
}

/** ====== เกม 2: กดหัวใจให้ครบ 15 ครั้ง (น่ารัก/ง่าย) ====== */
function GameHearts({ onWin }) {
  const target = 15;
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= target) onWin();
  }, [count, onWin]);

  return (
    <div className="gameCard">
      <h3>เกม 2: เติมหัวใจให้เต็ม 💗</h3>
      <p className="gameHint">
        กดหัวใจให้ครบ <b>{target}</b> ครั้ง เพื่อปลดล็อกความลับ
      </p>

      <div className="heartBar">
        <div
          className="heartFill"
          style={{ width: `${Math.min(100, (count / target) * 100)}%` }}
        />
      </div>

      <button
        className="btn primary"
        onClick={() => setCount((c) => c + 1)}
        style={{ marginTop: 12 }}
      >
        กดหัวใจ 💗 ({count}/{target})
      </button>
    </div>
  );
}

/** ====== เกม 3: Quiz เล็ก ๆ 3 ข้อ ====== */
function GameQuiz({ onWin }) {
  // เปลี่ยนคำถาม/คำตอบได้เอง
  const questions = useMemo(
    () => [
      {
        q: "คำที่เราบอกแกบ่อยที่สุดคือ?",
        options: ["ขอบคุณ", "รักนะ", "ไปกินไรดี", "นอนก่อนนะ"],
        answer: "รักนะ",
      },
      {
        q: "ของขวัญที่ดีที่สุดสำหรับแกคือ?",
        options: ["เงิน", "เวลาอยู่ด้วยกัน", "ของแพง", "ดอกไม้ 1000 ดอก"],
        answer: "เวลาอยู่ด้วยกัน",
      },
      {
        q: "วันนี้เป็นวันของใครเอ่ย? 😆",
        options: ["ของลีโอ", "ของเพื่อน", "ของเบเบ", "ของแมว"],
        answer: "ของเบเบ",
      },
    ],
    []
  );

  const [idx, setIdx] = useState(0);
  const [ok, setOk] = useState(0);
  const [selected, setSelected] = useState(null);

  const current = questions[idx];

  const choose = (opt) => {
    if (selected) return;
    setSelected(opt);
    const correct = opt === current.answer;
    if (correct) setOk((x) => x + 1);

    setTimeout(() => {
      const next = idx + 1;
      if (next >= questions.length) {
        // ผ่านถ้าตอบถูกอย่างน้อย 2/3
        if (correct ? ok + 1 : ok >= 2) onWin();
        else {
          // รีเซ็ตให้ลองใหม่
          setIdx(0);
          setOk(0);
        }
      } else {
        setIdx(next);
      }
      setSelected(null);
    }, 700);
  };

  return (
    <div className="gameCard">
      <h3>เกม 3: Quiz น่ารัก ๆ 🧠</h3>
      <p className="gameHint">
        ตอบให้ถูกอย่างน้อย <b>2 ใน 3</b> ข้อ
      </p>

      <div className="quizBox">
        <div className="quizQ">
          ข้อ {idx + 1}/{questions.length}: {current.q}
        </div>
        <div className="quizOpts">
          {current.options.map((opt) => {
            const isCorrect = selected && opt === current.answer;
            const isWrong = selected === opt && opt !== current.answer;
            return (
              <button
                key={opt}
                className={`quizOpt ${isCorrect ? "ok" : ""} ${
                  isWrong ? "bad" : ""
                }`}
                onClick={() => choose(opt)}
              >
                {opt}
              </button>
            );
          })}
        </div>

        <div className="gameMeta">คะแนนตอนนี้: {ok}</div>
      </div>
    </div>
  );
}

/** ====== หน้าเล่นเกมรวม (ต้องผ่านครบ 3) ====== */
function GamesGate({ onDone, pop }) {
  const [done, setDone] = useState([false, false, false]);

  const mark = (i) => {
    setDone((prev) => {
      const next = [...prev];
      next[i] = true;
      return next;
    });
    pop(180);
  };

  const all = done.every(Boolean);

  return (
    <div className="page">
      <div className="wrap">
        <section className="hero">
          <div className="sparkles" />
          <div className="badge">🕹️ ก่อนเข้า…ต้องผ่าน 3 เกมน่ารัก ๆ</div>
          <h1 className="title">
            Welcome <span className="name">{CONFIG.name}</span> 💖
          </h1>
          <p className="sub">
            ผ่านครบแล้วค่อยเข้าไปดูเซอร์ไพรส์ใหญ่ 🎁 (เล่นง่ายมาก!)
          </p>

          <div className="progressRow">
            {done.map((d, i) => (
              <div key={i} className={`chip ${d ? "done" : ""}`}>
                เกม {i + 1} {d ? "✅" : "⏳"}
              </div>
            ))}
          </div>

          <div className="ctaRow">
            <button
              className="btn primary"
              disabled={!all}
              onClick={onDone}
              title={!all ? "ผ่านให้ครบก่อนน้า" : "ไปหน้าเซอร์ไพรส์!"}
            >
              {all ? "เข้าไปดูเซอร์ไพรส์ 🎁" : "ผ่านให้ครบก่อนน้า 💗"}
            </button>
          </div>
        </section>

        <div className="grid">
          <div className="card" style={{ marginTop: 16 }}>
            {done[0] ? (
              <div className="winBox">เกม 1 ผ่านแล้ว ✅ เก่งมาก!</div>
            ) : (
              <GameMatch onWin={() => mark(0)} />
            )}
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            {done[1] ? (
              <div className="winBox">เกม 2 ผ่านแล้ว ✅ เย้!</div>
            ) : (
              <GameHearts onWin={() => mark(1)} />
            )}
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            {done[2] ? (
              <div className="winBox">เกม 3 ผ่านแล้ว ✅ สุดยอด!</div>
            ) : (
              <GameQuiz onWin={() => mark(2)} />
            )}
          </div>
        </div>

        <footer className="footer">
          ถ้าเล่นบนมือถือ แนะนำเปิดเต็มจอ จะน่ารักขึ้น 💖
        </footer>
      </div>
    </div>
  );
}

/** ====== หน้าเซอร์ไพรส์ (เหมือนเดิม) ====== */
function SurprisePage({ pop }) {
  const [started, setStarted] = useState(false);
  const [claimed, setClaimed] = useState(() => new Set());
  const [giftOpen, setGiftOpen] = useState(false);

  const fullMessage = useMemo(() => {
    const lines = [...CONFIG.messageLines];
    lines[0] = `ถึง ${CONFIG.name} ของเรา 💗`;
    return lines.join("\n");
  }, []);

  const typed = useTyping(fullMessage, started, 14);

  const claimCoupon = (idx) => {
    setClaimed((prev) => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
    pop(120);
  };

  const openGift = () => {
    setGiftOpen(true);
    pop(520);
  };

  return (
    <div className="page">
      <div className="wrap">
        <section className="hero">
          <div className="sparkles" />
          <div className="badge">💌 เว็บนี้ทำให้คนพิเศษโดยเฉพาะ</div>

          <h1 className="title">
            สุขสันต์วันเกิดนะ <span className="name">{CONFIG.name}</span> 🎂💖
          </h1>

          <p className="sub">{CONFIG.subtitle}</p>

          <div className="ctaRow">
            <button
              className="btn primary"
              onClick={() => {
                if (!started) {
                  setStarted(true);
                  pop(220);
                }
              }}
              disabled={started}
            >
              {started ? "กำลังพิมพ์ให้… ✍️" : "เริ่มเซอร์ไพรส์ 🎁"}
            </button>

            <a className="btn ghost" href="#memories">
              ไปดูความทรงจำ 📸
            </a>
          </div>
        </section>

        <div className="grid">
          <section className="card">
            <h2>💗 ข้อความถึงอ้วม</h2>
            <div className="typing">{typed}</div>
            <div className="mini">ปล. ข้อความจะค่อย ๆ โผล่เหมือนเราพิมพ์ให้จริง ๆ 🥺</div>
          </section>

          <section className="card">
            <h2>🎟️ คูปองแฟน (กดรับได้)</h2>
            <div className="couponList">
              {CONFIG.coupons.map((c, idx) => {
                const isClaimed = claimed.has(idx);
                return (
                  <div className="coupon" key={idx}>
                    <div className="couponLeft">
                      <div className="emoji">{c.emoji}</div>
                      <strong>{c.title}</strong>
                    </div>
                    <button
                      className="pill"
                      disabled={isClaimed}
                      onClick={() => claimCoupon(idx)}
                    >
                      {isClaimed ? "รับแล้ว ✅" : "รับคูปอง"}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="mini">ใช้ได้ทุกใบเลยนะ 😆</div>
          </section>
        </div>

        <section className="card" id="memories">
          <h2>📸 ความทรงจำของเรา</h2>
          {/* <div className="mini">
            ใส่รูปเองได้: วางรูปใน <b>public/photos</b> แล้วตั้งชื่อ <b>1.jpg</b>, <b>2.jpg</b> …
          </div> */}

          <div className="gallery">
            {CONFIG.photos.map((p, idx) => (
              <Photo key={idx} src={p.src} label={p.label} />
            ))}
          </div>

          <div className="bigGift">
            <div className="giftText">
              <b>🎀 ของขวัญใหญ่</b>
              <small>กดปุ่มนี้แล้วมีเซอร์ไพรส์เล็ก ๆ ให้ยิ้มหน่อย</small>
            </div>

            <button className="btn primary" onClick={openGift}>
              เปิดของขวัญ 💝
            </button>
          </div>

          {giftOpen && (
            <div className="giftModal" role="dialog" aria-modal="true">
              <div className="giftBox">
                <div className="giftHead">💝 ของขวัญคือ…</div>
                <div className="giftBody">
                  วันนี้แกขออะไรเราได้ 1 อย่างเลยนะ 🎀<br />
                </div>
                <button className="btn ghost" onClick={() => setGiftOpen(false)}>
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          )}
        </section>

        <footer className="footer">
          ทำด้วยความรัก 💖 | ตั้งใจทำเพื่ออะอ้วมคนเดียว
        </footer>
      </div>
    </div>
  );
}

function Photo({ src, label }) {
  const [ok, setOk] = useState(true);
  return (
    <div className="shot">
      {ok ? (
        <img src={src} alt={label} onError={() => setOk(false)} loading="lazy" />
      ) : (
        <div className="fallback">♡</div>
      )}
      <span className="tag">{ok ? label : `${label} (ใส่รูปได้)`}</span>
    </div>
  );
}

export default function App() {
  const [stage, setStage] = useState("games"); // games | surprise
  const [fire, setFire] = useState(0);

  const pop = (n) => {
    setFire(n);
    setTimeout(() => setFire(0), 50);
  };

  return (
    <>
      <ConfettiCanvas fireKey={fire} />
      {stage === "games" ? (
        <GamesGate onDone={() => setStage("surprise")} pop={pop} />
      ) : (
        <SurprisePage pop={pop} />
      )}
    </>
  );
}
