import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  BookOpen, 
  Layers, 
  Droplets, 
  Activity, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Menu,
  X,
  BrainCircuit,
  Hammer
} from 'lucide-react';

// --- Data & Content ---

const LOGIC_CHAIN = [
  {
    step: 1,
    title: "地质环境 (Environment)",
    icon: <Layers className="w-6 h-6 text-stone-600" />,
    desc: "答题起点：描述'有什么'。",
    points: [
      "地层岩性 (Lithology)：软硬、成分。",
      "地质构造 (Tectonics)：断层、褶皱、节理。",
      "地形地貌 (Geomorphology)：高陡边坡、河谷深切。"
    ]
  },
  {
    step: 2,
    title: "介质属性 (Material)",
    icon: <BoxIcon />,
    desc: "核心特征：描述'它是个什么东西'。",
    points: [
      "非均质性 (Heterogeneity)：不均匀。",
      "各向异性 (Anisotropy)：方向不同性质不同。",
      "不连续性 (Discontinuity)：被裂隙切割。",
      "岩体结构控制论：结构面决定稳定性。"
    ]
  },
  {
    step: 3,
    title: "工程扰动 (Action)",
    icon: <Hammer className="w-6 h-6 text-stone-600" />,
    desc: "触发因素：描述'我们要干什么'。",
    points: [
      "开挖 (Excavation)：卸荷 (Unloading)，应力重分布。",
      "加载 (Loading)：增加荷载。",
      "蓄水 (Impoundment)：改变水动力场。"
    ]
  },
  {
    step: 4,
    title: "灾害响应 (Response)",
    icon: <AlertTriangle className="w-6 h-6 text-stone-600" />,
    desc: "最终结果：描述'发生了什么坏事'。",
    points: [
      "变形 (Deformation)：蠕变、扩容。",
      "破坏 (Failure)：滑移、崩塌、岩爆。",
      "失稳机制：强度降低 vs 应力集中。"
    ]
  }
];

const CORE_VARS = [
  {
    id: 'structure',
    title: '岩体结构 (Structure)',
    subtitle: '工程地质的“骨架”',
    color: 'bg-orange-50 border-orange-200 text-orange-800',
    icon: <Layers className="w-6 h-6" />,
    whyComplex: "岩体不是连续介质，而是被结构面（节理、断层）切割的块体系统。",
    mechanisms: [
      { term: "控制作用", desc: "岩体的破坏通常不是沿着岩石本身，而是沿着软弱结构面发生。" },
      { term: "各向异性", desc: "平行于层理强，垂直于层理弱。" },
      { term: "尺寸效应", desc: "小试块很强，大岩体因为有裂隙所以很弱。" }
    ]
  },
  {
    id: 'water',
    title: '地下水 (Water)',
    subtitle: '工程地质的“血液”与“润滑剂”',
    color: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: <Droplets className="w-6 h-6" />,
    whyComplex: "水是活跃因子，随时间、季节变化，且能改变岩土性质。",
    mechanisms: [
      { term: "有效应力原理", desc: "σ' = σ - u。孔隙水压力(u)上升，有效应力(σ')下降，抗剪强度降低。" },
      { term: "软化作用", desc: "水浸入岩石，泥化夹层，降低c, φ值。" },
      { term: "渗透力", desc: "动水压力，直接推着土体颗粒跑（潜蚀、流土）。" }
    ]
  },
  {
    id: 'stress',
    title: '地应力 (Stress)',
    subtitle: '看不见的“无形之手”',
    color: 'bg-rose-50 border-rose-200 text-rose-800',
    icon: <Activity className="w-6 h-6" />,
    whyComplex: "深部工程中，高地应力储存了巨大的弹性能。",
    mechanisms: [
      { term: "应力集中", desc: "开挖洞室后，围岩切向应力急剧升高。" },
      { term: "卸荷效应", desc: "开挖不仅是腾空，更是一种“力的释放”，导致回弹或拉裂。" },
      { term: "能量释放", desc: "硬岩在高应力下积聚能量，一旦扰动瞬间释放（岩爆）。" }
    ]
  }
];

const CASES = [
  {
    title: "深埋长隧道 - 岩爆 (Rockburst)",
    tags: ["高地应力", "硬岩", "脆性破坏"],
    analysis: [
      { label: "环境 (Env)", text: "埋深大（高地应力），岩性为坚硬脆性岩石（花岗岩、石英岩），完整性好。" },
      { label: "介质 (Mat)", text: "具有高储能能力，弹性模量大，脆性指数高。" },
      { label: "扰动 (Act)", text: "TBM或钻爆法快速开挖 -> 径向应力解除（卸荷） -> 切向应力高度集中。" },
      { label: "响应 (Res)", text: "围岩无法承受应力集中，弹性能瞬间释放。表现为岩块弹射、剥落，甚至爆炸式破坏。" },
      { label: "复杂性总结", text: "这是典型的'应力-结构'控制型问题。复杂在：不可预见性（随机发生）和高能释放机制。" }
    ]
  },
  {
    title: "水库滑坡 (Reservoir Landslide)",
    tags: ["水岩作用", "软弱夹层", "长期稳定性"],
    analysis: [
      { label: "环境 (Env)", text: "顺向坡结构（岩层倾向与坡向一致），存在软弱结构面（泥化夹层）。" },
      { label: "介质 (Mat)", text: "软弱带亲水性强，遇水易软化、泥化。" },
      { label: "扰动 (Act)", text: "水库蓄水（水位上升）或急剧泄水（水位骤降）。" },
      { label: "响应 (Res)", text: "蓄水时：浮力增加，抗滑力减小，夹层软化。骤降时：库水位降得快，坡体内地下水降得慢 -> 产生向外的巨大渗透压力 -> 推崩坡体。" },
      { label: "复杂性总结", text: "这是'水-岩-结构'耦合问题。复杂在：时间效应（蠕变）和动水压力的动态变化。" }
    ]
  }
];

const KEY_TERMS = [
  { term: "非均质性 (Heterogeneity)", def: "指岩体在不同位置性质不同。不能用一个点的参数代表整体，增加了勘察难度。" },
  { term: "各向异性 (Anisotropy)", def: "指在不同方向上性质不同（如层理方向强度高，垂直方向强度低）。分析时必须考虑受力方向与结构面的关系。" },
  { term: "有效应力 (Effective Stress)", def: "土力学核心：土骨架实际承担的力。水压力越大，有效应力越小，土体越容易坏。" },
  { term: "软弱夹层 (Weak Interlayer)", def: "岩体中最危险的部位，像汉堡里的沙拉酱，控制着整个山体是否会滑移。" },
  { term: "应力集中 (Stress Concentration)", def: "开挖洞室后，力流被迫绕道，导致洞壁附近的力比原岩应力大好几倍。" },
  { term: "卸荷 (Unloading)", def: "把石头挖走不仅仅是少了重量，更相当于给留下的石头施加了一个反向的拉力，容易导致张性裂隙。" },
  { term: "流变性 (Rheology)", def: "时间效应。力不变，变形随时间一直增加（蠕变）；或者变形不变，力随时间衰减（松弛）。" },
  { term: "渗透稳定性 (Seepage Stability)", def: "土体抵抗水流冲刷的能力。失效形式：管涌、流土。" },
  { term: "尺寸效应 (Scale Effect)", def: "实验室做的小石头很硬，但现场的大岩体很软，因为大岩体里有裂缝。复习必考点。" },
  { term: "剪胀性 (Dilatancy)", def: "致密岩土体剪切破坏时，体积反而膨胀的现象（因为颗粒要爬过颗粒）。" },
];

// --- Components ---

function BoxIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-stone-600">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  );
}

function SectionTitle({ title, subtitle }: { title: string, subtitle?: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-stone-800 serif">{title}</h2>
      {subtitle && <p className="text-stone-500 mt-2 text-lg">{subtitle}</p>}
      <div className="h-1 w-20 bg-emerald-600 mt-4 rounded-full"></div>
    </div>
  );
}

function LogicChainView() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <SectionTitle 
        title="万能答题逻辑链" 
        subtitle="遇到任何“分析论述题”，直接套用此四步模型，字数不仅够，逻辑还严密。" 
      />
      
      <div className="relative">
        {/* Connector Line */}
        <div className="absolute left-8 top-8 bottom-8 w-1 bg-stone-200 hidden md:block"></div>

        <div className="space-y-6">
          {LOGIC_CHAIN.map((item, idx) => (
            <div key={idx} className="relative flex flex-col md:flex-row gap-6 bg-white p-6 rounded-xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 z-10">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center shadow-sm">
                  {item.icon}
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">Step {item.step}</span>
                  <h3 className="text-xl font-bold text-stone-800">{item.title}</h3>
                </div>
                <p className="text-stone-500 italic mb-4">{item.desc}</p>
                <div className="bg-stone-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {item.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2 text-stone-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mt-8">
        <h4 className="font-bold text-amber-800 flex items-center gap-2">
          <BrainCircuit className="w-5 h-5" />
          教授点拨
        </h4>
        <p className="text-amber-700 mt-1">
          大部分同学只写“工程扰动”和“灾害响应”，忽略了前两步。一定要先写“环境”和“介质”，说明这里的地质条件为什么脆弱，这样你的答案才有深度！
        </p>
      </div>
    </div>
  );
}

function VariablesView() {
  const [activeTab, setActiveTab] = useState('structure');

  const activeData = CORE_VARS.find(v => v.id === activeTab);

  return (
    <div className="animate-fadeIn">
      <SectionTitle 
        title="三大核心变量" 
        subtitle="为什么工程问题会变“复杂”？这是三个罪魁祸首。" 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {CORE_VARS.map((v) => (
          <button
            key={v.id}
            onClick={() => setActiveTab(v.id)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              activeTab === v.id 
                ? `${v.color} shadow-md scale-105` 
                : 'bg-white border-stone-100 text-stone-500 hover:border-stone-300'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              {v.icon}
              <span className="font-bold text-lg">{v.title}</span>
            </div>
          </button>
        ))}
      </div>

      {activeData && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-stone-800 mb-2">{activeData.title}</h3>
            <p className="text-stone-500 text-lg">{activeData.subtitle}</p>
          </div>

          <div className="mb-8 p-4 bg-stone-50 rounded-lg border-l-4 border-stone-400">
            <h4 className="font-bold text-stone-800 mb-1">为什么它导致复杂性？</h4>
            <p className="text-stone-700 leading-relaxed">{activeData.whyComplex}</p>
          </div>

          <h4 className="font-bold text-stone-800 text-lg mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            核心机制（必背）
          </h4>
          <div className="grid gap-4">
            {activeData.mechanisms.map((mech, idx) => (
              <div key={idx} className="border border-stone-100 rounded-lg p-4 hover:bg-stone-50 transition-colors">
                <span className="font-bold text-emerald-700 block mb-1">{mech.term}</span>
                <span className="text-stone-600">{mech.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CasesView() {
  return (
    <div className="animate-fadeIn space-y-12">
      <SectionTitle 
        title="典型场景反推案例" 
        subtitle="如果考试让你分析“为什么这个工程难？”，请参考以下范文。" 
      />

      <div className="grid md:grid-cols-2 gap-8">
        {CASES.map((caseItem, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden flex flex-col">
            <div className="bg-stone-800 p-6">
              <h3 className="text-xl font-bold text-white mb-3">{caseItem.title}</h3>
              <div className="flex flex-wrap gap-2">
                {caseItem.tags.map(tag => (
                  <span key={tag} className="text-xs bg-stone-700 text-stone-200 px-2 py-1 rounded-md border border-stone-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-6 flex-grow flex flex-col gap-4">
              {caseItem.analysis.map((item, i) => (
                <div key={i} className={`p-3 rounded-lg ${item.label.includes("复杂性") ? "bg-amber-50 border border-amber-100 mt-2" : "bg-white"}`}>
                  <span className={`text-xs font-bold uppercase tracking-wider block mb-1 ${item.label.includes("复杂性") ? "text-amber-600" : "text-stone-400"}`}>
                    {item.label}
                  </span>
                  <p className={`text-sm ${item.label.includes("复杂性") ? "text-amber-900 font-medium" : "text-stone-700"}`}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TermsView() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="animate-fadeIn">
      <SectionTitle 
        title="高分术语速查表" 
        subtitle="把这些词撒进你的试卷里，老师会觉得你很专业。" 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {KEY_TERMS.map((term, idx) => (
          <div 
            key={idx} 
            className={`cursor-pointer rounded-xl border transition-all duration-300 overflow-hidden ${openIndex === idx ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-300 shadow-md' : 'bg-white border-stone-200 hover:border-emerald-300'}`}
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
          >
            <div className="p-4 flex justify-between items-center">
              <h3 className="font-bold text-stone-800 text-lg">{term.term}</h3>
              <div className={`transition-transform duration-300 text-stone-400 ${openIndex === idx ? 'rotate-180 text-emerald-600' : ''}`}>
                 <ArrowRight className="w-5 h-5 rotate-90" />
              </div>
            </div>
            
            <div className={`px-4 pb-4 text-stone-600 leading-relaxed border-t border-emerald-100 pt-3 ${openIndex === idx ? 'block' : 'hidden'}`}>
              <span className="font-bold text-emerald-700 text-sm block mb-1">【直白解释】</span>
              {term.def}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Main Layout ---

export default function App() {
  const [view, setView] = useState('logic');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'logic', label: '逻辑链 (Logic Chain)', icon: <BrainCircuit className="w-5 h-5" /> },
    { id: 'vars', label: '核心变量 (Variables)', icon: <Activity className="w-5 h-5" /> },
    { id: 'cases', label: '经典案例 (Cases)', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'terms', label: '重要术语 (Terms)', icon: <CheckCircle2 className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-stone-800">
      {/* Mobile Header */}
      <div className="md:hidden bg-stone-900 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="font-bold text-lg flex items-center gap-2">
          <Hammer className="w-5 h-5 text-emerald-400" />
          工程地质复习
        </h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-0 z-40 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-full md:w-72 bg-stone-900 text-stone-300 flex flex-col shadow-2xl md:shadow-none`}>
        <div className="p-8 hidden md:block">
          <h1 className="text-2xl font-bold text-white serif tracking-wide flex items-center gap-2">
            <Hammer className="w-6 h-6 text-emerald-500" />
            工程地质<br/>期末突击
          </h1>
          <p className="text-xs text-stone-500 mt-2 uppercase tracking-widest">Complexity Analysis</p>
        </div>
        
        <nav className="flex-grow px-4 mt-8 md:mt-0 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                view === item.id 
                  ? 'bg-emerald-800/50 text-white border-l-4 border-emerald-500' 
                  : 'hover:bg-stone-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-stone-800">
          <div className="bg-stone-800 rounded-lg p-4">
            <p className="text-xs text-stone-500 mb-2">Study Status</p>
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              正在突击中...
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-12 overflow-y-auto h-screen bg-stone-50/50">
        <div className="max-w-4xl mx-auto">
          {view === 'logic' && <LogicChainView />}
          {view === 'vars' && <VariablesView />}
          {view === 'cases' && <CasesView />}
          {view === 'terms' && <TermsView />}
        </div>
      </main>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
