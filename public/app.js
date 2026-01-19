
const TARGETS = ["USD","EUR","BTC","ETH","SOL","MATIC","BNB"];
const FIAT_OPEN_API = "https://open.er-api.com/v6/latest"; // 1x/dia (Open)
const BINANCE_TICKER = "https://api.binance.com/api/v3/ticker/price"; // tempo real para cripto

const $ = (q)=>document.querySelector(q);
const updatedTxt = $("#updatedTxt");
const baseSel = $("#baseCode");
const baseInp = $("#baseAmount");

async function fetchFiat() {
  try{
    const [u,e] = await Promise.all([
      fetch(`${FIAT_OPEN_API}/USD`).then(r=>r.json()),
      fetch(`${FIAT_OPEN_API}/EUR`).then(r=>r.json())
    ]);
    return { USD: u?.rates?.BRL, EUR: e?.rates?.BRL };
  }catch(err){ console.error(err); return {}; }
}

async function binancePrice(symbol){
  const r = await fetch(`${BINANCE_TICKER}?symbol=${symbol}`);
  if(!r.ok) throw new Error('Binance falhou');
  const d = await r.json();
  return parseFloat(d.price);
}

async function fetchCryptoBRL(){
  const pairs = { BTC:'BTCUSDT', ETH:'ETHUSDT', SOL:'SOLUSDT', MATIC:'MATICUSDT', BNB:'BNBUSDT'};
  const out = {};
  let usdtbrl;
  try{
    usdtbrl = await binancePrice('USDTBRL');
  }catch(_){
    const brlusdt = await binancePrice('BRLUSDT');
    usdtbrl = 1/ brlusdt;
  }
  for(const [k,sym] of Object.entries(pairs)){
    const p = await binancePrice(sym);
    out[k] = p * usdtbrl; // em BRL
  }
  return out;
}

function fmt(v){
  if(v==null || isNaN(v)) return '—';
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 6 }).format(v);
}

async function refresh(){
  const base = baseSel.value;
  const amt = parseFloat(baseInp.value.replace(',', '.')) || 0;
  updatedTxt.textContent = 'Atualizando...';

  const [fiat, crypto] = await Promise.all([fetchFiat(), fetchCryptoBRL()]);
  const ratesBRL = {...fiat, ...crypto, BRL: 1};

  TARGETS.forEach(code => {
    const toBRL = ratesBRL[code];
    const fromBRL = ratesBRL[base] ?? 1;
    const val = amt * (toBRL / fromBRL);
    const el = document.getElementById(`val-${code}`);
    if(el) el.textContent = fmt(val);
  });

  updatedTxt.textContent = 'Atualizado: ' + new Date().toLocaleString();
}

baseSel.addEventListener('change', refresh);
baseInp.addEventListener('input', refresh);
setInterval(refresh, 15000);
refresh();
