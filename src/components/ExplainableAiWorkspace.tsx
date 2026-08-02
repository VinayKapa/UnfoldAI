import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  GitCommit,
  Network,
  Layers,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Info,
  RefreshCw,
  Search,
  Zap,
  Award,
  BookOpen,
  Sliders,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Target,
  Brain,
  ShieldCheck,
  TrendingUp,
  X,
  HelpCircle
} from 'lucide-react';
import * as d3 from 'd3';

export interface ExplainabilityData {
  recommendationId: string;
  recommendationTitle: string;
  category: string;
  confidenceScore: number;
  reasoningSummary: string;
  decisionProcess: Array<{
    step: number;
    title: string;
    description: string;
    stage: 'signal_ingestion' | 'skill_matching' | 'dna_alignment' | 'impact_propagation' | 'confidence_scoring';
    confidenceDelta: string;
    status: 'completed' | 'active' | 'pending';
    nodeRef?: string;
  }>;
  graphEvidenceNodes: Array<{
    id: string;
    category: string;
    label: string;
    confidence: number;
    weight: number;
    description: string;
    sourceType: string;
  }>;
  graphEvidenceEdges: Array<{
    id: string;
    source: string;
    target: string;
    relationship: string;
    weight: number;
  }>;
  evidencePaths: Array<{
    pathId: string;
    title: string;
    confidence: number;
    nodes: string[];
    description: string;
  }>;
  skillContributions: Array<{
    skill: string;
    currentScore: number;
    requiredScore: number;
    contributionWeight: number;
    status: string;
  }>;
  careerDnaContributions: Array<{
    trait: string;
    score: number;
    weight: number;
    alignmentLevel: string;
  }>;
  dependencyTree: {
    id: string;
    label: string;
    type: string;
    confidence: number;
    weight: number;
    children?: Array<{
      id: string;
      label: string;
      type: string;
      confidence: number;
      weight: number;
      children?: Array<{
        id: string;
        label: string;
        type: string;
        confidence: number;
        weight: number;
      }>;
    }>;
  };
}

interface ExplainableAiWorkspaceProps {
  initialRecommendationId?: string;
  recommendationTitle?: string;
  onCloseModal?: () => void;
  isModal?: boolean;
}

const PRESET_RECOMMENDATIONS = [
  { id: 'rec_mlops', title: 'Deploy MLOps Capstone Microservice' },
  { id: 'rec_pytorch', title: 'PyTorch Deep Learning Model Optimization' },
  { id: 'rec_cert_gcp', title: 'Google Cloud ML Engineer Certification' },
  { id: 'rec_internship', title: 'Apply to Tier-1 AI Research Internships' },
  { id: 'rec_ats_resume', title: 'Refine ATS Resume with System Architecture Keywords' }
];

export const ExplainableAiWorkspace: React.FC<ExplainableAiWorkspaceProps> = ({
  initialRecommendationId = 'rec_mlops',
  recommendationTitle,
  onCloseModal,
  isModal = false
}) => {
  const [selectedRecId, setSelectedRecId] = useState<string>(initialRecommendationId);
  const [data, setData] = useState<ExplainabilityData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Active view tab inside workspace
  const [activeView, setActiveView] = useState<'graph' | 'tree' | 'timeline' | 'contributions' | 'weights'>('graph');

  // Interactive selection state
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [expandedTreeNodeIds, setExpandedTreeNodeIds] = useState<Record<string, boolean>>({
    root: true,
    node_careerdna: true,
    sk_ml: true
  });
  const [activeStepFilter, setActiveStepFilter] = useState<number | null>(null);

  // D3 SVG Container Reference
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Fetch explanation data from API
  const fetchExplanation = async (recId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/core/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recommendationId: recId })
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch explanation (HTTP ${res.status})`);
      }

      const json: ExplainabilityData = await res.json();
      
      // Override title if explicitly passed from "Why?" trigger
      if (recommendationTitle && recId === initialRecommendationId) {
        json.recommendationTitle = recommendationTitle;
      }
      
      setData(json);
      if (json.graphEvidenceNodes.length > 0) {
        setSelectedNodeId(json.graphEvidenceNodes[0].id);
      }
      if (json.evidencePaths.length > 0) {
        setSelectedPathId(json.evidencePaths[0].pathId);
      }
    } catch (err: any) {
      console.error('Error fetching explainability data:', err);
      setError(err.message || 'Unable to load explainability engine output');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExplanation(selectedRecId);
  }, [selectedRecId]);

  // Render D3 Graph
  useEffect(() => {
    if (!data || !svgRef.current || activeView !== 'graph') return;

    const svgElement = svgRef.current;
    d3.select(svgElement).selectAll('*').remove();

    const width = svgElement.clientWidth || 800;
    const height = 480;

    const svg = d3.select(svgElement)
      .attr('viewBox', [0, 0, width, height])
      .style('width', '100%')
      .style('height', `${height}px`);

    // Add gradient defs
    const defs = svg.append('defs');
    
    // Node glows
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-20%')
      .attr('y', '-20%')
      .attr('width', '140%')
      .attr('height', '140%');
    filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
    filter.append('feComposite').attr('in', 'SourceGraphic').attr('in2', 'blur').attr('operator', 'over');

    // Arrowhead marker for edges
    defs.append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 22)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#818cf8');

    const container = svg.append('g').attr('class', 'zoom-container');

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 2.5])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    // Prepare nodes and links data
    const nodes = data.graphEvidenceNodes.map((n) => ({
      ...n,
      x: Math.random() * width,
      y: Math.random() * height
    }));

    const links = data.graphEvidenceEdges.map((e) => ({
      ...e,
      source: e.source,
      target: e.target
    }));

    // Force simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(140))
      .force('charge', d3.forceManyBody().strength(-380))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(45));

    // Draw Links
    const linkGroup = container.append('g').attr('class', 'links');
    const link = linkGroup.selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', (d: any) => {
        if (selectedNodeId && (d.source.id === selectedNodeId || d.target.id === selectedNodeId)) {
          return '#6366f1';
        }
        return '#cbd5e1';
      })
      .attr('stroke-opacity', 0.8)
      .attr('stroke-width', (d: any) => d.weight * 3)
      .attr('marker-end', 'url(#arrow)');

    // Link edge labels
    const linkLabels = container.append('g')
      .selectAll('text')
      .data(links)
      .enter()
      .append('text')
      .attr('font-size', '9px')
      .attr('font-weight', '600')
      .attr('fill', '#64748b')
      .attr('text-anchor', 'middle')
      .text((d: any) => `${d.relationship} (${Math.round(d.weight * 100)}%)`);

    // Category colors map
    const categoryColors: Record<string, string> = {
      ai_recommendations: '#8b5cf6',
      careerdna: '#4f46e5',
      skills: '#06b6d4',
      projects: '#10b981',
      certificates: '#f59e0b',
      career_goals: '#ec4899',
      education_level: '#3b82f6'
    };

    // Draw Nodes
    const nodeGroup = container.append('g').attr('class', 'nodes');
    const node = nodeGroup.selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .style('cursor', 'pointer')
      .on('click', (event, d: any) => {
        event.stopPropagation();
        setSelectedNodeId(d.id);
      })
      .call(
        d3.drag<any, any>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }) as any
      );

    // Node Outer Circle / Glow
    node.append('circle')
      .attr('r', (d: any) => (d.id === selectedNodeId ? 28 : 22))
      .attr('fill', (d: any) => categoryColors[d.category] || '#6366f1')
      .attr('fill-opacity', 0.15)
      .attr('stroke', (d: any) => categoryColors[d.category] || '#6366f1')
      .attr('stroke-width', (d: any) => (d.id === selectedNodeId ? 3 : 1.5))
      .attr('filter', (d: any) => (d.id === selectedNodeId ? 'url(#glow)' : null));

    // Node Inner Circle
    node.append('circle')
      .attr('r', (d: any) => (d.id === selectedNodeId ? 18 : 14))
      .attr('fill', (d: any) => categoryColors[d.category] || '#6366f1')
      .attr('shadow', '0 4px 6px -1px rgb(0 0 0 / 0.1)');

    // Node Confidence Label
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#ffffff')
      .attr('font-size', '10px')
      .attr('font-weight', '700')
      .text((d: any) => `${Math.round(d.confidence * 100)}%`);

    // Node Title Label Below
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', (d: any) => (d.id === selectedNodeId ? '40px' : '34px'))
      .attr('fill', '#0f172a')
      .attr('font-size', '11px')
      .attr('font-weight', '700')
      .text((d: any) => d.label);

    // Simulation Ticks
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      linkLabels
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2 - 6);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

  }, [data, activeView, selectedNodeId]);

  const activeNode = data?.graphEvidenceNodes.find((n) => n.id === selectedNodeId);
  const activePath = data?.evidencePaths.find((p) => p.pathId === selectedPathId);

  const toggleTreeNode = (id: string) => {
    setExpandedTreeNodeIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={`w-full ${isModal ? 'max-w-5xl mx-auto my-4' : ''}`}>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all">
        
        {/* TOP WORKSPACE HEADER BAR */}
        <div className="p-6 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 relative">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                <Brain className="w-3.5 h-3.5 text-indigo-400" />
                Explainable AI Engine
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Graph-Backed Audit
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                {isLoading ? 'Computing AI Decision Trace...' : data?.recommendationTitle || 'Recommendation Reasoning'}
              </h2>
            </div>
            
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Transparent graph evidence trace showing every node, confidence weight, decision step, and trait contribution supporting this recommendation.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Recommendation Preset Dropdown */}
            <div className="relative">
              <select
                value={selectedRecId}
                onChange={(e) => setSelectedRecId(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer pr-8"
              >
                {PRESET_RECOMMENDATIONS.map((rec) => (
                  <option key={rec.id} value={rec.id}>
                    💡 {rec.title}
                  </option>
                ))}
              </select>
            </div>

            {data && (
              <div className="p-2.5 rounded-2xl bg-indigo-950/80 border border-indigo-800 text-center px-4">
                <span className="text-[10px] text-indigo-300 font-bold block uppercase tracking-wider">Confidence Score</span>
                <span className="text-lg font-extrabold text-indigo-400">
                  {Math.round((data.confidenceScore || 0.94) * 100)}%
                </span>
              </div>
            )}

            {isModal && onCloseModal && (
              <button
                onClick={onCloseModal}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Close Window"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

        </div>

        {/* WORKSPACE NAVIGATION TABS */}
        <div className="px-6 pt-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            
            <button
              onClick={() => setActiveView('graph')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeView === 'graph'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <Network className="w-4 h-4" />
              <span>Evidence Nodes Graph</span>
            </button>

            <button
              onClick={() => setActiveView('tree')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeView === 'tree'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Animated Dependency Tree</span>
            </button>

            <button
              onClick={() => setActiveView('timeline')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeView === 'timeline'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <GitCommit className="w-4 h-4" />
              <span>Decision Timeline Process</span>
            </button>

            <button
              onClick={() => setActiveView('contributions')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeView === 'contributions'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Skill & CareerDNA Contributions</span>
            </button>

            <button
              onClick={() => setActiveView('weights')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeView === 'weights'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Weights & Confidence Matrix</span>
            </button>

          </div>

          <button
            onClick={() => fetchExplanation(selectedRecId)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors mb-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-500 ${isLoading ? 'animate-spin' : ''}`} />
            Recalculate Graph
          </button>
        </div>

        {/* LOADING & ERROR STATES */}
        {isLoading && (
          <div className="p-16 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto animate-bounce">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Traversing Student Intelligence Graph Subgraph...
            </p>
            <p className="text-xs text-slate-500">Executing multi-hop vector calculations and evidence path verification.</p>
          </div>
        )}

        {error && (
          <div className="p-8 text-center space-y-3">
            <div className="p-3 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 w-12 h-12 mx-auto flex items-center justify-center font-bold">
              !
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{error}</p>
            <button
              onClick={() => fetchExplanation(selectedRecId)}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
            >
              Retry Graph Query
            </button>
          </div>
        )}

        {/* MAIN DISPLAY CONTENT PANELS */}
        {!isLoading && !error && data && (
          <div className="p-6">
            
            {/* SUMMARY BANNER */}
            <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-indigo-950 dark:text-indigo-200">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block text-indigo-700 dark:text-indigo-300">EXPLAINABILITY SUMMARY:</span>
                  <p className="leading-relaxed text-slate-700 dark:text-slate-300 mt-0.5">{data.reasoningSummary}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                  {data.graphEvidenceNodes.length} Nodes
                </span>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                  {data.graphEvidenceEdges.length} Edges
                </span>
              </div>
            </div>

            {/* TAB 1: INTERACTIVE D3 EVIDENCE NODES GRAPH */}
            {activeView === 'graph' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* D3 SVG Canvas Area */}
                <div className="lg:col-span-8 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2 px-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Network className="w-4 h-4 text-indigo-500" />
                      Interactive Graph Relationships (Drag & Zoom)
                    </span>
                    <span className="text-[10px] text-slate-400">Click node to inspect evidence</span>
                  </div>

                  <svg ref={svgRef} className="w-full h-[480px] rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800" />

                  {/* Graph Legend */}
                  <div className="mt-3 flex flex-wrap gap-3 text-[11px] font-semibold text-slate-600 dark:text-slate-400 px-2">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" /> Recommendation
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#4f46e5]" /> CareerDNA
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4]" /> Skills
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" /> Projects
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" /> Certifications
                    </span>
                  </div>
                </div>

                {/* Node & Evidence Details Drawer */}
                <div className="lg:col-span-4 space-y-4">
                  {activeNode ? (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 shadow-lg space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                            {activeNode.category.replace('_', ' ')}
                          </span>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                            {activeNode.label}
                          </h4>
                        </div>

                        <div className="text-right">
                          <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                            {Math.round(activeNode.confidence * 100)}%
                          </span>
                          <span className="text-[9px] text-slate-400 block font-semibold">Confidence</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                          <span className="text-slate-500 font-medium">Node ID:</span>
                          <code className="text-indigo-600 dark:text-indigo-400 font-bold">{activeNode.id}</code>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                          <span className="text-slate-500 font-medium">Graph Weight:</span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {Math.round(activeNode.weight * 100)}%
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                          <span className="text-slate-500 font-medium">Source Verification:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            ✓ {activeNode.sourceType}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700">
                        {activeNode.description}
                      </p>
                    </motion.div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2 text-slate-500">
                      <Info className="w-5 h-5 mx-auto text-slate-400" />
                      <p className="text-xs font-semibold">Click any graph node to inspect detailed evidence attributes.</p>
                    </div>
                  )}

                  {/* Evidence Paths List */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-indigo-500" />
                      Validated Evidence Paths
                    </h4>

                    <div className="space-y-2">
                      {data.evidencePaths.map((path) => (
                        <button
                          key={path.pathId}
                          onClick={() => setSelectedPathId(path.pathId)}
                          className={`w-full p-3 rounded-xl border text-left transition-all ${
                            selectedPathId === path.pathId
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500'
                              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-bold text-slate-900 dark:text-white">{path.title}</span>
                            <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                              {Math.round(path.confidence * 100)}%
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-tight">{path.description}</p>
                          <div className="mt-2 flex items-center gap-1 flex-wrap text-[9px] font-mono font-bold text-slate-600 dark:text-slate-300">
                            {path.nodes.map((n, i) => (
                              <React.Fragment key={i}>
                                <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700">{n}</span>
                                {i < path.nodes.length - 1 && <span>→</span>}
                              </React.Fragment>
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 2: ANIMATED DEPENDENCY TREE */}
            {activeView === 'tree' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-500" />
                    <span>Hierarchical Evidence Dependency Tree</span>
                  </h3>
                  <span className="text-xs text-slate-500">Root Recommendation derived down to fundamental input anchors</span>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4 border border-slate-800">
                  
                  {/* Root Tree Item */}
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-indigo-950 border border-indigo-700/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                          ROOT
                        </span>
                        <div>
                          <h4 className="font-bold text-sm text-white">{data.dependencyTree.label}</h4>
                          <span className="text-[10px] text-indigo-300 font-semibold">{data.dependencyTree.type}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-emerald-400 px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                          Weight: {Math.round(data.dependencyTree.weight * 100)}%
                        </span>
                        <span className="text-xs font-bold text-indigo-400 px-2.5 py-0.5 rounded bg-indigo-900 border border-indigo-700">
                          Confidence: {Math.round(data.dependencyTree.confidence * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* Children Branches */}
                    <div className="pl-6 border-l-2 border-indigo-600/40 space-y-3">
                      {data.dependencyTree.children?.map((child, cIdx) => (
                        <motion.div
                          key={child.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: cIdx * 0.08 }}
                          className="space-y-2"
                        >
                          <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-between hover:border-indigo-500 transition-all">
                            <div className="flex items-center gap-2.5">
                              <button
                                onClick={() => toggleTreeNode(child.id)}
                                className="p-1 rounded bg-slate-700 text-slate-300 hover:text-white"
                              >
                                {expandedTreeNodeIds[child.id] ? (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronRight className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <div>
                                <h5 className="font-bold text-xs text-slate-100">{child.label}</h5>
                                <span className="text-[10px] text-slate-400">{child.type}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-[10px] font-semibold text-slate-300 px-2 py-0.5 rounded bg-slate-700">
                                Weight: {Math.round(child.weight * 100)}%
                              </span>
                              <span className="text-[10px] font-semibold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/80">
                                {Math.round(child.confidence * 100)}%
                              </span>
                            </div>
                          </div>

                          {/* Level 2 Sub-children */}
                          {expandedTreeNodeIds[child.id] && child.children && (
                            <div className="pl-6 border-l-2 border-slate-700 space-y-2">
                              {child.children.map((gChild) => (
                                <div
                                  key={gChild.id}
                                  className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/60 flex items-center justify-between text-xs"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                    <div>
                                      <p className="font-semibold text-slate-200">{gChild.label}</p>
                                      <span className="text-[9px] text-slate-400">{gChild.type}</span>
                                    </div>
                                  </div>

                                  <span className="text-[10px] text-indigo-300 font-bold">
                                    Confidence: {Math.round(gChild.confidence * 100)}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                  </div>

                </div>
              </div>
            )}

            {/* TAB 3: STEP-BY-STEP REASONING TIMELINE PROCESS */}
            {activeView === 'timeline' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <GitCommit className="w-4 h-4 text-indigo-500" />
                    <span>Decision Engine Execution Pipeline</span>
                  </h3>
                  <span className="text-xs text-slate-500">Step-by-step audit trace of reasoning stages</span>
                </div>

                <div className="space-y-4">
                  {data.decisionProcess.map((stepItem, idx) => (
                    <motion.div
                      key={stepItem.step}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4 hover:border-indigo-400 transition-all"
                    >
                      <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-md">
                        0{stepItem.step}
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                            {stepItem.title}
                          </h4>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                              {stepItem.confidenceDelta} Confidence
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                              {stepItem.stage.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {stepItem.description}
                        </p>

                        {stepItem.nodeRef && (
                          <div className="pt-1 flex items-center gap-1.5 text-[11px]">
                            <span className="text-slate-400">Inspected Graph Node:</span>
                            <code className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-900">
                              {stepItem.nodeRef}
                            </code>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: SKILL & CAREERDNA CONTRIBUTIONS */}
            {activeView === 'contributions' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Skill Contributions */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    <span>Skill Synergy Contributions</span>
                  </h4>

                  <div className="space-y-3">
                    {data.skillContributions.map((sk, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-900 dark:text-white">{sk.skill}</span>
                          <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
                            {sk.contributionWeight}% Weight
                          </span>
                        </div>

                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${(sk.currentScore / sk.requiredScore) * 100}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                          <span>Score: {sk.currentScore} / {sk.requiredScore} target</span>
                          <span className={`font-bold ${sk.status === 'Matched' ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {sk.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CareerDNA Contributions */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-500" />
                    <span>CareerDNA Trait Alignment</span>
                  </h4>

                  <div className="space-y-3">
                    {data.careerDnaContributions.map((dna, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-900 dark:text-white">{dna.trait}</span>
                          <span className="text-purple-600 dark:text-purple-400 font-extrabold">
                            {dna.weight}% Weight
                          </span>
                        </div>

                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
                          <div
                            className="h-full bg-purple-600 rounded-full"
                            style={{ width: `${dna.score}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                          <span>Aptitude Score: {dna.score}%</span>
                          <span className="font-bold text-purple-500">{dna.alignmentLevel} Alignment</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 5: WEIGHTS & CONFIDENCE MATRIX */}
            {activeView === 'weights' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-500" />
                    <span>Mathematical Confidence & Weight Allocation</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Skill Matrix Weight</span>
                      <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">45.0%</p>
                      <p className="text-[10px] text-slate-500">Verified code & domain skills</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">CareerDNA Vector</span>
                      <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">40.0%</p>
                      <p className="text-[10px] text-slate-500">Aptitude & interest alignment</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Stage Fit Factor</span>
                      <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">15.0%</p>
                      <p className="text-[10px] text-slate-500">Academic level suitability</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Market Demand Index</span>
                      <p className="text-2xl font-extrabold text-amber-500">95.0%</p>
                      <p className="text-[10px] text-slate-500">Hiring velocity multiplier</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
