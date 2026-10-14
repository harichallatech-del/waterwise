import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Droplets, CloudRain, Waves, ShowerHead, WashingMachine, House,
  ArrowUpRight, ChevronDown, SlidersHorizontal, Sparkles, Download,
  RotateCcw, Check, Leaf, Gauge, FlaskConical, ShieldCheck, Info,
  CircleHelp, ChartNoAxesCombined, Recycle, Zap, MapPin, CalendarDays,
  ChevronRight, Droplet, Sun, Menu, X
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

type Inputs = {
  roofSqft: number; rainfallMm: number; runoff: number; collectionLoss: number
  people: number; showerLpm: number; showerMinutes: number; showerDays: number
  laundryLoads: number; laundryLitres: number; greywaterCapture: number
  waterRate: number; rainDays: number; useRain: boolean; useGrey: boolean
}
const initial: Inputs = {
  roofSqft: 1800, rainfallMm: 820, runoff: 0.82, collectionLoss: 12,
  people: 4, showerLpm: 8, showerMinutes: 7, showerDays: 6,
  laundryLoads: 5, laundryLitres: 65, greywaterCapture: 65,
  waterRate: 0.055, rainDays: 55, useRain: true, useGrey: true
}
const fmt = (n: number) => Math.round(n).toLocaleString('en-IN')
const money = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const rainPattern = [0.01,0.01,0.01,0.02,0.08,0.17,0.22,0.20,0.16,0.08,0.03,0.01]

function estimate(i: Inputs) {
  const roofM2 = i.roofSqft * 0.092903
  const rainLitres = roofM2 * i.rainfallMm * i.runoff * (1 - i.collectionLoss / 100)
  const showerDay = i.people * i.showerLpm * i.showerMinutes * i.showerDays
  const laundryDay = i.laundryLoads * i.laundryLitres / 7
  const greyDaily = (showerDay + laundryDay) * (i.greywaterCapture / 100)
  const rainDaily = rainLitres / 365
  const rainUsable = i.useRain ? rainLitres : 0
  const greyAnnual = i.useGrey ? greyDaily * 365 : 0
  const combined = rainUsable + greyAnnual
  const annualDemand = i.people * 135 * 365
  const offset = Math.min(100, combined / Math.max(annualDemand, 1) * 100)
  const avoided = combined * i.waterRate
  const monthly = monthNames.map((month, idx) => {
    const rain = rainUsable * rainPattern[idx]
    const grey = greyAnnual / 12
    return { month, rain: Math.round(rain), grey: Math.round(grey), total: Math.round(rain + grey) }
  })
  const useableDaily = combined / 365
  const tankSuggested = Math.max(500, Math.min(20000, rainLitres / 12 * 0.6))
  return { roofM2, rainLitres, rainUsable, showerDay, laundryDay, greyDaily, greyAnnual, combined, annualDemand, offset, avoided, monthly, useableDaily, tankSuggested, rainDaily }
}

function Field({ label, value, min, max, step = 1, unit, onChange, hint }: {
  label: string; value: number; min: number; max: number; step?: number; unit: string
  onChange: (v: number) => void; hint?: string
}) {
  return <div className="field">
    <div className="field-top"><label>{label}</label><div className="field-value">{fmt(value)} <span>{unit}</span></div></div>
    <input aria-label={label} type="range" min={min} max={max} step={step} value={value}
      onChange={e => onChange(Number(e.target.value))} />
    <div className="range-labels"><span>{fmt(min)} {unit}</span><span>{fmt(max)} {unit}</span></div>
    {hint && <p className="field-hint">{hint}</p>}
  </div>
}

function App() {
  const [inputs, setInputs] = useState<Inputs>(initial)
  const [activeTab, setActiveTab] = useState<'overview'|'rain'|'grey'|'method'>('overview')
  const [showAssumptions, setShowAssumptions] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const result = useMemo(() => estimate(inputs), [inputs])
  const set = (key: keyof Inputs, value: number | boolean) => setInputs(prev => ({ ...prev, [key]: value }))
  const exportCsv = () => {
    const rows = [
      ['WaterWise building water estimate','Value'],
      ['Roof area (sq ft)', inputs.roofSqft],
      ['Annual rainfall (mm)', inputs.rainfallMm],
      ['Runoff coefficient', inputs.runoff],
      ['Collection losses (%)', inputs.collectionLoss],
      ['Rainwater estimate (L/year)', Math.round(result.rainLitres)],
      ['Greywater estimate (L/year)', Math.round(result.greyAnnual)],
      ['Combined potential (L/year)', Math.round(result.combined)],
      ['Daily average (L/day)', Math.round(result.useableDaily)],
      ['Estimated annual value (INR)', Math.round(result.avoided)],
      [],
      ['Month','Rainwater (L)','Greywater (L)','Combined (L)'],
      ...result.monthly.map(m => [m.month,m.rain,m.grey,m.total])
    ]
    const csv = rows.map(r => r.map(v => `"${String(v ?? '').replaceAll('"','""')}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], {type:'text/csv;charset=utf-8;'}))
    a.download = 'waterwise-estimate.csv'; a.click(); URL.revokeObjectURL(a.href)
  }
  const reset = () => setInputs(initial)
  const tabs = [{id:'overview',label:'Overview'},{id:'rain',label:'Rainwater'},{id:'grey',label:'Bath & wash'},{id:'method',label:'Model notes'}] as const
  const chartData = result.monthly
  const composition = [
    { name:'Rainwater', value: result.rainUsable, color:'#55c6ff' },
    { name:'Bath & wash', value: result.greyAnnual, color:'#a7f0c1' }
  ].filter(x => x.value > 0)
  const recommendations = [
    {icon:CloudRain,title:'Capture roof runoff',body:`Potential of ${fmt(result.rainLitres)} L/year before tank sizing and demand matching. Add leaf screens, first flush and filtration.`},
    {icon:Recycle,title:'Reuse greywater promptly',body:`About ${fmt(result.greyDaily)} L/day from your current bath and laundry assumptions before any treatment-related restrictions.`},
    {icon:ShieldCheck,title:'Keep systems separate',body:'Use dedicated labelled non-potable plumbing, backflow protection and treatment appropriate to the final use.'}
  ]

  return <div className="app-shell">
    <div className="ambient ambient-one"/><div className="ambient ambient-two"/>
    <header className="topbar">
      <a className="brand" href="#top" aria-label="WaterWise home"><span className="brand-mark"><Droplets size={21}/></span><span>waterwise<span className="brand-dot">.</span></span></a>
      <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
        <a href="#calculator" onClick={()=>setMenuOpen(false)}>Calculator</a>
        <a href="#insights" onClick={()=>setMenuOpen(false)}>Insights</a>
        <a href="#how-it-works" onClick={()=>setMenuOpen(false)}>Methodology</a>
      </nav>
      <div className="top-actions"><span className="live-pill"><span/> LIVE MODEL</span><button className="icon-button mobile-menu" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen?<X/>:<Menu/>}</button><button className="btn btn-light top-cta" onClick={exportCsv}><Download size={15}/> Export report</button></div>
    </header>

    <main id="top">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line"/> BUILDING WATER INTELLIGENCE <span className="eyebrow-chip">BETA 01</span></div>
          <h1>Your roof has a<br/><span>second source.</span></h1>
          <p className="hero-sub">Turn rainfall, showers and laundry into a measurable water strategy. Explore your building's recovery potential with a live, transparent estimator.</p>
          <div className="hero-buttons"><a className="btn btn-primary" href="#calculator">Build my water profile <ArrowUpRight size={17}/></a><a className="text-link" href="#how-it-works">Explore the model <ChevronRight size={16}/></a></div>
          <div className="hero-trust"><div className="avatar-stack"><span>R</span><span>B</span><span>↗</span></div><span>Estimate first. Engineer with confidence.</span></div>
        </div>
        <div className="hero-visual">
          <div className="visual-grid"/>
          <div className="orbit orbit-a"/><div className="orbit orbit-b"/>
          <motion.div className="water-orb" animate={{y:[0,-10,0],rotate:[0,4,0]}} transition={{duration:6,repeat:Infinity,ease:'easeInOut'}}>
            <div className="orb-shine"/><Droplets size={78} strokeWidth={1.15}/>
          </motion.div>
          <motion.div className="float-card float-rain" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:.25}}><span className="float-icon blue"><CloudRain size={17}/></span><div><small>ROOF CATCHMENT</small><strong>{fmt(result.rainLitres)} <i>L / yr</i></strong></div><span className="float-arrow"><ArrowUpRight size={15}/></span></motion.div>
          <motion.div className="float-card float-grey" initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:.4}}><span className="float-icon green"><Waves size={17}/></span><div><small>GREYWATER POTENTIAL</small><strong>{fmt(result.greyAnnual)} <i>L / yr</i></strong></div></motion.div>
          <div className="visual-caption"><span className="pulse-dot"/> YOUR BUILDING, REIMAGINED <span>01 / 03</span></div>
        </div>
      </section>

      <section className="metric-row" aria-label="Water recovery summary">
        <div className="metric-card metric-main"><div className="metric-label"><span className="metric-icon"><Droplets size={17}/></span> TOTAL RECOVERY POTENTIAL <span className="info-dot" title="Annual estimate before demand matching">i</span></div><div className="metric-number">{fmt(result.combined)}<span> L / year</span></div><div className="metric-foot"><span className="trend-up"><ArrowUpRight size={14}/>{fmt(result.useableDaily)} L/day</span> annualized average</div><div className="metric-spark"><svg viewBox="0 0 200 48" preserveAspectRatio="none"><path d="M0 39 C20 38 24 15 45 23 S70 40 92 19 S120 27 139 12 S172 19 200 2 L200 48 L0 48 Z" fill="rgba(85,198,255,.12)"/><path d="M0 39 C20 38 24 15 45 23 S70 40 92 19 S120 27 139 12 S172 19 200 2" fill="none" stroke="#55c6ff" strokeWidth="2"/></svg></div></div>
        <div className="metric-card"><div className="metric-label"><span className="mini-dot blue-dot"/> RAINWATER</div><div className="metric-number">{fmt(result.rainUsable)}<span> L</span></div><div className="metric-foot">Annual roof yield estimate</div><div className="metric-progress"><span style={{width:`${result.combined ? result.rainUsable/result.combined*100 : 0}%`,background:'#55c6ff'}}/></div><div className="metric-bottom">{Math.round(result.combined ? result.rainUsable/result.combined*100 : 0)}% of combined potential</div></div>
        <div className="metric-card"><div className="metric-label"><span className="mini-dot green-dot"/> BATH + WASH</div><div className="metric-number">{fmt(result.greyAnnual)}<span> L</span></div><div className="metric-foot">Annual greywater estimate</div><div className="metric-progress"><span style={{width:`${result.combined ? result.greyAnnual/result.combined*100 : 0}%`,background:'#a7f0c1'}}/></div><div className="metric-bottom">{Math.round(result.combined ? result.greyAnnual/result.combined*100 : 0)}% of combined potential</div></div>
        <div className="metric-card"><div className="metric-label"><span className="mini-dot purple-dot"/> WATER DEMAND OFFSET</div><div className="metric-number">{result.offset.toFixed(1)}<span>%</span></div><div className="metric-foot">Against assumed 135 L/person/day</div><div className="metric-progress"><span style={{width:`${result.offset}%`,background:'#c3a6ff'}}/></div><div className="metric-bottom">Illustrative, before use matching</div></div>
      </section>

      <section className="workspace" id="calculator">
        <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> INTERACTIVE PLANNER</div><h2>Model your building.</h2><p>Change any input. Every estimate updates instantly.</p></div><button className="btn btn-ghost" onClick={reset}><RotateCcw size={14}/> Reset assumptions</button></div>
        <div className="workspace-grid">
          <aside className="control-panel">
            <div className="panel-heading"><div className="panel-icon"><SlidersHorizontal size={17}/></div><div><h3>Building inputs</h3><p>Personalize the model</p></div><span className="step-badge">01</span></div>
            <div className="control-section">
              <div className="control-title"><House size={16}/><span>ROOF & CLIMATE</span></div>
              <Field label="Roof catchment area" value={inputs.roofSqft} min={200} max={10000} step={100} unit="sq ft" onChange={v=>set('roofSqft',v)} hint={`${fmt(result.roofM2)} m² converted for calculation`}/>
              <Field label="Annual rainfall" value={inputs.rainfallMm} min={200} max={1800} step={20} unit="mm" onChange={v=>set('rainfallMm',v)} hint="Use a local long-term average if known."/>
              <div className="select-row"><label>Roof material</label><select value={inputs.runoff} onChange={e=>set('runoff',Number(e.target.value))}><option value={0.95}>Metal / smooth roof · 0.95</option><option value={0.85}>Concrete / tile · 0.85</option><option value={0.82}>Typical planning value · 0.82</option><option value={0.65}>Rough / porous surface · 0.65</option></select><ChevronDown size={14}/></div>
              <Field label="Collection losses" value={inputs.collectionLoss} min={0} max={30} step={1} unit="%" onChange={v=>set('collectionLoss',v)} hint="Allows for first flush, leakage and handling losses."/>
              <Field label="Effective rainy days" value={inputs.rainDays} min={10} max={120} step={5} unit="days" onChange={v=>set('rainDays',v)} hint="Context for seasonality; annual yield uses total rainfall."/>
            </div>
            <div className="control-section">
              <div className="control-title"><ShowerHead size={16}/><span>BATH & SHOWER</span></div>
              <Field label="People in building" value={inputs.people} min={1} max={100} unit="people" onChange={v=>set('people',v)}/>
              <Field label="Shower flow rate" value={inputs.showerLpm} min={3} max={15} unit="L/min" onChange={v=>set('showerLpm',v)}/>
              <Field label="Average shower duration" value={inputs.showerMinutes} min={2} max={20} unit="min" onChange={v=>set('showerMinutes',v)}/>
              <Field label="Showers per person / week" value={inputs.showerDays} min={1} max={14} unit="/week" onChange={v=>set('showerDays',v)}/>
            </div>
            <div className="control-section">
              <div className="control-title"><WashingMachine size={16}/><span>LAUNDRY & REUSE</span></div>
              <Field label="Laundry loads" value={inputs.laundryLoads} min={1} max={30} unit="loads/week" onChange={v=>set('laundryLoads',v)}/>
              <Field label="Water per load" value={inputs.laundryLitres} min={25} max={150} step={5} unit="L/load" onChange={v=>set('laundryLitres',v)}/>
              <Field label="Greywater capture rate" value={inputs.greywaterCapture} min={10} max={95} step={5} unit="%" onChange={v=>set('greywaterCapture',v)} hint="Share realistically collected, not automatically safe to reuse."/>
              <Field label="Water cost / litre" value={Math.round(inputs.waterRate*1000)/1000} min={0.01} max={0.2} step={0.005} unit="₹/L" onChange={v=>set('waterRate',v)} hint="Illustrative marginal water cost; edit to match your bill."/>
            </div>
            <div className="control-toggles"><label className="toggle-row"><span><CloudRain size={16}/> Include rainwater</span><input type="checkbox" checked={inputs.useRain} onChange={e=>set('useRain',e.target.checked)}/><i/></label><label className="toggle-row"><span><Recycle size={16}/> Include greywater</span><input type="checkbox" checked={inputs.useGrey} onChange={e=>set('useGrey',e.target.checked)}/><i/></label></div>
          </aside>

          <div className="results-column">
            <div className="tabs">{tabs.map(t=><button key={t.id} className={activeTab===t.id?'tab active':'tab'} onClick={()=>setActiveTab(t.id)}>{t.label}</button>)}</div>
            <AnimatePresence mode="wait">
              {activeTab==='overview' && <motion.div key="overview" className="result-view" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}} transition={{duration:.2}}>
                <div className="chart-card"><div className="chart-header"><div><h3>Monthly recovery outlook</h3><p>Illustrative rainfall seasonality + steady greywater flow</p></div><div className="chart-legend"><span><i className="legend-blue"/> Rainwater</span><span><i className="legend-green"/> Bath & wash</span></div></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{top:12,right:8,left:0,bottom:0}}><defs><linearGradient id="rainFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#55c6ff" stopOpacity={.25}/><stop offset="95%" stopColor="#55c6ff" stopOpacity={0}/></linearGradient><linearGradient id="greyFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a7f0c1" stopOpacity={.22}/><stop offset="95%" stopColor="#a7f0c1" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#ffffff12" vertical={false}/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:'#7890a5',fontSize:11}} dy={8}/><YAxis axisLine={false} tickLine={false} tick={{fill:'#7890a5',fontSize:10}} tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}k`:v} width={42}/><Tooltip contentStyle={{background:'#10283b',border:'1px solid #28465a',borderRadius:12,color:'#fff'}} formatter={(v:any,n:any)=>[`${fmt(Number(v))} L`,n==='rain'?'Rainwater':'Bath & wash']}/><Area type="monotone" dataKey="rain" name="rain" stroke="#55c6ff" strokeWidth={2.5} fill="url(#rainFill)" activeDot={{r:5}}/><Area type="monotone" dataKey="grey" name="grey" stroke="#a7f0c1" strokeWidth={2.5} fill="url(#greyFill)" activeDot={{r:5}}/></AreaChart></ResponsiveContainer></div><div className="chart-insight"><Sparkles size={15}/><span><strong>Pattern insight:</strong> rainfall is modeled as seasonal; greywater is spread evenly through the year for planning.</span></div></div>
                <div className="lower-charts"><div className="mini-chart-card"><div className="mini-heading"><h3>Water source mix</h3><span>YEARLY</span></div><div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={composition} dataKey="value" nameKey="name" innerRadius={52} outerRadius={72} paddingAngle={4} stroke="none">{composition.map((e,i)=><Cell key={e.name} fill={e.color}/>)}</Pie><Tooltip contentStyle={{background:'#10283b',border:'1px solid #28465a',borderRadius:10,color:'#fff'}} formatter={(v:any)=>`${fmt(Number(v))} L`}/></PieChart></ResponsiveContainer><div className="donut-center"><strong>{fmt(result.combined/1000)}</strong><span>kL / yr</span></div></div><div className="mix-legend">{composition.map(c=><div key={c.name}><span style={{background:c.color}}/>{c.name}<strong>{Math.round(result.combined?c.value/result.combined*100:0)}%</strong></div>)}</div></div>
                <div className="mini-chart-card"><div className="mini-heading"><h3>Recovery vs demand</h3><span>ESTIMATE</span></div><div className="demand-graphic"><div className="demand-ring" style={{'--progress':`${result.offset}%`} as React.CSSProperties}><div><strong>{result.offset.toFixed(0)}<small>%</small></strong><span>offset</span></div></div><div className="demand-copy"><strong>{fmt(result.annualDemand)} L</strong><span>assumed annual demand</span><strong>{fmt(result.combined)} L</strong><span>potential recovered</span></div></div><p className="micro-note">Not all recovered water will match demand timing or water-quality requirements.</p></div></div>
              </motion.div>}
              {activeTab==='rain' && <motion.div key="rain" className="result-view" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}><div className="detail-hero blue-detail"><span className="detail-icon"><CloudRain size={22}/></span><div><span>ROOFTOP COLLECTION</span><h3>{fmt(result.rainLitres)} litres / year</h3><p>{fmt(result.rainLitres/1000)} kilolitres theoretical annual collection after modeled losses.</p></div></div><div className="detail-stats"><div><span>Catchment</span><strong>{fmt(result.roofM2)} m²</strong></div><div><span>Rainfall</span><strong>{fmt(inputs.rainfallMm)} mm</strong></div><div><span>Runoff factor</span><strong>{inputs.runoff.toFixed(2)}</strong></div></div><div className="chart-card"><div className="chart-header"><div><h3>Rainfall distribution</h3><p>Planning profile, not a local weather forecast</p></div></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid stroke="#ffffff12" vertical={false}/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:'#7890a5',fontSize:11}}/><YAxis axisLine={false} tickLine={false} tick={{fill:'#7890a5',fontSize:10}} tickFormatter={v=>`${Math.round(v/1000)}k`}/><Tooltip contentStyle={{background:'#10283b',border:'1px solid #28465a',borderRadius:12,color:'#fff'}} formatter={(v:any)=>`${fmt(Number(v))} L`}/><Bar dataKey="rain" name="Rainwater" fill="#55c6ff" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer></div></div><div className="notice"><Info size={17}/><p><strong>Tank sizing is a separate step.</strong> Use rainfall timing, daily demand, desired autonomy, overflow management and site constraints. Annual yield alone does not determine a suitable tank volume.</p></div></motion.div>}
              {activeTab==='grey' && <motion.div key="grey" className="result-view" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}><div className="detail-hero green-detail"><span className="detail-icon"><Waves size={22}/></span><div><span>BATH + LAUNDRY RECOVERY</span><h3>{fmt(result.greyDaily)} litres / day</h3><p>{fmt(result.greyAnnual)} litres per year potentially captured, before treatment constraints.</p></div></div><div className="source-breakdown"><div className="source-row"><div className="source-symbol"><ShowerHead size={19}/></div><div className="source-name"><strong>Showers</strong><span>{inputs.people} people · {inputs.showerMinutes} min · {inputs.showerLpm} L/min</span></div><div className="source-value">{fmt(result.showerDay)} <small>L/day</small></div></div><div className="source-row"><div className="source-symbol"><WashingMachine size={19}/></div><div className="source-name"><strong>Laundry</strong><span>{inputs.laundryLoads} loads/week · {inputs.laundryLitres} L/load</span></div><div className="source-value">{fmt(result.laundryDay)} <small>L/day</small></div></div><div className="source-row"><div className="source-symbol"><Recycle size={19}/></div><div className="source-name"><strong>Capture factor</strong><span>Modeled captured share</span></div><div className="source-value">{inputs.greywaterCapture}<small>%</small></div></div></div><div className="notice green-notice"><ShieldCheck size={17}/><p><strong>Potential is not guaranteed reuse.</strong> Treatment, product chemistry, storage time, local rules and end-use determine whether this water can be safely used.</p></div><div className="chart-card"><div className="chart-header"><div><h3>Weekly source profile</h3><p>Estimated water available from modeled sources</p></div></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={[{name:'Shower',litres:result.showerDay*7},{name:'Laundry',litres:result.laundryDay*7},{name:'Captured',litres:result.greyDaily*7}]}><CartesianGrid stroke="#ffffff12" vertical={false}/><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:'#7890a5',fontSize:11}}/><YAxis axisLine={false} tickLine={false} tick={{fill:'#7890a5',fontSize:10}}/><Tooltip contentStyle={{background:'#10283b',border:'1px solid #28465a',borderRadius:12,color:'#fff'}} formatter={(v:any)=>`${fmt(Number(v))} L/week`}/><Bar dataKey="litres" fill="#a7f0c1" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div></div></motion.div>}
              {activeTab==='method' && <motion.div key="method" className="result-view" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}><div className="model-card"><div className="model-card-head"><span className="model-icon"><Sparkles size={20}/></span><div><h3>Transparent model, AI-ready architecture</h3><p>Version 1 · deterministic estimator</p></div></div><p>This prototype uses transparent physical and usage-based equations. It does <strong>not</strong> claim to run a trained machine-learning model or live weather prediction. The interface is designed so measured sensor data, local rainfall history and a validated forecasting service can be added later.</p><div className="formula"><span>ROOF YIELD</span><code>roof_m² × rainfall_mm × runoff × (1 − losses)</code></div><div className="formula"><span>SHOWER FLOW</span><code>people × L/min × minutes × showers/week ÷ 7</code></div><div className="formula"><span>LAUNDRY FLOW</span><code>loads/week × litres/load ÷ 7</code></div><div className="formula"><span>GREYWATER CAPTURE</span><code>(shower + laundry) × capture rate</code></div><div className="model-warning"><Info size={17}/><span>Results are indicative, not an engineering design or a guarantee of potable water. Actual usable supply depends on rainfall timing, first flush, storage capacity, demand, treatment and local regulations.</span></div></div><div className="model-card"><div className="model-card-head"><span className="model-icon green-model"><ChartNoAxesCombined size={20}/></span><div><h3>Roadmap for real AI / ML</h3><p>From estimator to adaptive water intelligence</p></div></div><div className="roadmap-item"><span>01</span><div><strong>Weather-aware yield forecast</strong><p>Daily rainfall history + forecast API, roof parameters and uncertainty ranges.</p></div></div><div className="roadmap-item"><span>02</span><div><strong>Sensor-based demand learning</strong><p>Tank-level sensors, flow meters and occupancy signals to learn actual patterns.</p></div></div><div className="roadmap-item"><span>03</span><div><strong>Forecast & optimize</strong><p>Time-series model for supply/demand; recommend tank capacity and reuse priorities with confidence intervals.</p></div></div><div className="roadmap-item"><span>04</span><div><strong>Safety stays rule-based</strong><p>ML may forecast volume, but water-quality treatment and safety interlocks require validated controls.</p></div></div></div></motion.div>}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section className="insights-section" id="insights">
        <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> RECOMMENDATIONS</div><h2>From estimate to action.</h2><p>Practical next steps generated from your current inputs.</p></div><span className="ai-tag"><Sparkles size={14}/> RULE-BASED INSIGHTS</span></div>
        <div className="recommendation-grid">{recommendations.map((r,i)=>{const Icon=r.icon;return <motion.article className="recommendation-card" key={r.title} whileHover={{y:-4,transition:{duration:.2}}}><div className={`rec-icon rec-${i}`}><Icon size={19}/></div><div className="rec-number">0{i+1}</div><h3>{r.title}</h3><p>{r.body}</p><div className="rec-footer"><span>{i===0?'ROOF':i===1?'GREYWATER':'SAFETY'}</span><ArrowUpRight size={15}/></div></motion.article>})}</div>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="how-intro"><div className="eyebrow"><span className="eyebrow-line"/> THE SCIENCE, SIMPLIFIED</div><h2>Useful estimates.<br/><span>Honest assumptions.</span></h2><p>Good water planning starts with transparent math, then gets smarter with real measurements.</p><button className="assumption-toggle" onClick={()=>setShowAssumptions(!showAssumptions)}><CircleHelp size={16}/>{showAssumptions?'Hide model assumptions':'View model assumptions'}<ChevronDown size={15} className={showAssumptions?'rotated':''}/></button><AnimatePresence>{showAssumptions&&<motion.div className="assumptions-box" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}><ul><li>1 mm rainfall on 1 m² = 1 litre before losses.</li><li>Roof runoff coefficient is a planning assumption; surface and installation matter.</li><li>Greywater assumes shower and laundry sources only; other fixtures are excluded.</li><li>Demand offset uses 135 litres/person/day as an editable planning benchmark, not a universal measured demand.</li><li>Monthly rainfall curve is illustrative, not a live location-specific forecast.</li></ul></motion.div>}</AnimatePresence></div>
        <div className="principles"><div className="principle"><span className="principle-icon"><Gauge size={20}/></span><div><h3>Physics first</h3><p>Catchment area, rainfall and runoff determine the starting water budget.</p></div></div><div className="principle"><span className="principle-icon green-principle"><FlaskConical size={20}/></span><div><h3>Quality-aware reuse</h3><p>Volume is only one part of the decision; treatment and exposure matter.</p></div></div><div className="principle"><span className="principle-icon purple-principle"><Sparkles size={20}/></span><div><h3>Upgrade to ML</h3><p>Measured flows and local weather can support calibration and forecasting.</p></div></div></div>
      </section>

      <section className="closing-cta"><div className="cta-watermark"><Droplets size={80}/></div><div><div className="eyebrow"><span className="eyebrow-line"/> START SMALL. SCALE SMART.</div><h2>Every drop has a story.<br/><span>Start measuring yours.</span></h2><p>Export your current scenario and share it with your architect or water-system designer.</p></div><button className="btn btn-primary" onClick={exportCsv}><Download size={16}/> Download data <ArrowUpRight size={16}/></button></section>
    </main>
    <footer><a className="brand footer-brand" href="#top"><span className="brand-mark"><Droplets size={18}/></span><span>waterwise<span className="brand-dot">.</span></span></a><span>Concept prototype · estimates are indicative, not a design certification.</span><a href="#how-it-works">Model & safety notes <ArrowUpRight size={13}/></a></footer>
  </div>
}

export default App
