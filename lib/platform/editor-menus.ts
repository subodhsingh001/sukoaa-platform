let installed=false;
// Monaco 0.57 portals overflow menus into their own shadow root. Bundled
// stylesheet links in the document cannot style that root.
export function installEditorMenuStyles(){
 if(installed||typeof document==='undefined')return;installed=true;
 const styleHost=(host:Element)=>{
  const root=host.shadowRoot;if(!root||root.querySelector('[data-sukoaa-menu-css]'))return;
  const link=document.createElement('link');link.rel='stylesheet';link.href='/runtime/monaco/editor.css';link.dataset.sukoaaMenuCss='true';root.appendChild(link);
  const style=document.createElement('style');style.textContent=`
   .context-view,.monaco-menu,.monaco-action-bar{--vscode-menu-background:#243b30;--vscode-menu-foreground:#edf3e6;--vscode-menu-selectionBackground:#486440;--vscode-menu-selectionForeground:#fff;--vscode-menu-border:#647c58;--vscode-menu-separatorBackground:#58704e;background:#243b30!important;color:#edf3e6!important;border-radius:8px}
   .monaco-action-bar{border:1px solid #647c58;box-shadow:0 8px 28px #0006;padding:5px 0}
   .monaco-action-bar .action-label,.monaco-action-bar .keybinding,.monaco-action-bar .submenu-indicator{color:#edf3e6!important}
   .monaco-action-bar .action-item.focused,.monaco-action-bar .action-item:hover{background:#486440!important}
   .monaco-action-bar .action-item.disabled{opacity:1!important}
   .monaco-action-bar .action-item.disabled .action-label,.monaco-action-bar .action-item.disabled .keybinding{color:#a6b6a0!important}
   .action-label.separator{border-bottom-color:#58704e!important}
  `;root.appendChild(style);
 };
 const scan=(node:Node)=>{if(!(node instanceof Element))return;if(node.matches('.shadow-root-host'))styleHost(node);node.querySelectorAll('.shadow-root-host').forEach(styleHost);};
 scan(document.body);
 new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(scan))).observe(document.body,{childList:true,subtree:true});
}
