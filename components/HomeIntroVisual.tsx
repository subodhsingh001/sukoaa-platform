import { Code2, Globe, MoreHorizontal, Plus, Puzzle, ShieldCheck } from 'lucide-react';
import { SukoaaLogo } from './SukoaaLogo';

/** Decorative workspace composition, with no pretend interactive controls. */
export function HomeIntroVisual() {
  return <div className="home-intro-visual" aria-hidden="true">
    <span className="home-visual-label">Your browser workspace</span>
    <div className="home-visual-browser">
      <div className="home-visual-browser-bar">
        <span className="home-visual-dots"><i/><i/><i/></span>
        <span className="home-visual-address"><ShieldCheck size={13}/>www.sukoaa.com</span>
        <Plus size={15}/>
      </div>
      <div className="home-visual-browser-body">
        <span className="home-visual-brand"><SukoaaLogo height={31} decorative/></span>
        <span className="home-visual-browser-title">Run code in your browser.</span>
        <span className="home-visual-search"><Globe size={14}/>JavaScript, Python, React</span>
      </div>
    </div>
    <span className="home-visual-puzzle"><Puzzle size={32} strokeWidth={1.7}/></span>
    <span className="home-visual-callout"><Code2 size={16}/>No install for browser playgrounds</span>
    <div className="home-visual-editor">
      <div className="home-visual-editor-bar"><span className="home-visual-js">JS</span><span>main.js</span><MoreHorizontal size={18}/></div>
      <div className="home-visual-code">
        <div><span className="home-visual-line">1</span><span className="home-visual-comment">// Try a JavaScript example</span></div>
        <div><span className="home-visual-line">2</span><span><b>const</b> tools = [</span></div>
        <div><span className="home-visual-line">3</span><span>&nbsp;&nbsp;<em>'JavaScript'</em>, <em>'Python'</em>, <em>'React'</em></span></div>
        <div><span className="home-visual-line">4</span><span>];</span></div>
        <div><span className="home-visual-line">5</span><span>&nbsp;</span></div>
        <div><span className="home-visual-line">6</span><span>tools.forEach(console.log);</span></div>
      </div>
      <div className="home-visual-editor-foot"><ShieldCheck size={13}/><span>Browser JavaScript</span><span>Console output</span></div>
    </div>
  </div>;
}
