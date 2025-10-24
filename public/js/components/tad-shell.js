// tad-shell.slotted-lightdom.js
const template = document.createElement('template');
template.innerHTML = /*html*/`
  <style>
    :host{
      --tad-bg: rgb(30,30,25);
      --tad-fg: white;
      --tad-panel-bg: rgba(30,30,25,0.5);
      --tad-panel-bg-hover: rgba(30,30,25,1);
      --tad-panel-width: 300px;
      --tad-panel-radius: 16px;
      --tad-panel-pad: 1rem;
      --tad-shadow: 0 0 6px rgba(0,0,0,.53), 0 0 6px rgba(0,0,0,.53);
      display:block; position:relative; inline-size:100vw; block-size:100vh;
      background:var(--tad-bg); color:var(--tad-fg);
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
      overflow:hidden;
    }

    /* stage area that hosts wrapper+canvas (wrapper is slotted light-DOM) */
    .stage {
      position:relative; 
    }

    /* draw the grid in shadow, *over* the slotted stage content */
    .grid-overlay{ pointer-events:none; position:absolute; inset:0; }
    .grid-overlay::after{
      content:""; position:absolute; inset:0; pointer-events:none;
      background-image:
        linear-gradient(to right, rgba(0,255,0,.15) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0,255,0,.15) 1px, transparent 1px);
      background-size:50px 50px;
    }
    :host(:not([grid])) .grid-overlay{ display:none; }

    /* style the LIGHT-DOM wrapper and canvas via ::slotted */
    ::slotted(#tad-wrapper){
      position:relative; display:flex; align-items:center; justify-content:center;
      /* no forced sizing; TaD owns canvas width/height */
    }
    ::slotted(canvas){
      display:block; box-sizing:border-box; box-shadow:var(--tad-shadow);
      cursor: var(--tad-cursor, none);
    }

    /* debug panel chrome lives in shadow; your debug content is slotted inside it */
    aside#debug{
      position:absolute; top:0; inset-inline-end:10px; inline-size:var(--tad-panel-width);
      background:var(--tad-panel-bg); padding:var(--tad-panel-pad);
      border-radius:var(--tad-panel-radius); transition:.3s ease; backdrop-filter:blur(2px);
      contain: layout paint;
    }
    aside#debug:hover{ background:var(--tad-panel-bg-hover); }
    :host([debug="off"]) aside#debug{ transform:translateX(calc(var(--tad-panel-width) + 60px)); }
    :host([debug="on"])  aside#debug{ transform:translateX(0); }
    #toggle{
      position:absolute; inset-inline-start:-3rem; inline-size:3rem; block-size:3rem;
      opacity:.6; border:none; border-radius:999px; box-shadow:var(--tad-shadow);
      background:#222; color:#fff; cursor:pointer;
    }
    aside#debug:hover #toggle{ opacity:1; }
    #panel-content{ margin-block-start:.5rem; min-block-size:3rem; overflow:auto; max-block-size:calc(100vh - 1rem); }

    /* we do NOT own dialog styling if it's slotted (backdrop styling must be page CSS) */
    ::slotted(dialog){ border:none; border-radius:14px; box-shadow:var(--tad-shadow); }
  </style>

  <div class="stage" part="wrapper">
    <!-- Your light-DOM wrapper (with canvas inside) renders here -->
    <slot name="stage"></slot>
    <div class="grid-overlay"></div>
  </div>

  <aside id="debug">
    <button id="toggle" title="Show/Hide debug">🔍</button>
    <section id="panel-content"><slot name="debug"></slot></section>
  </aside>

  <!-- Your light-DOM dialog renders here; we just expose helpers -->
  <slot name="dialog"></slot>
`;

export default class TadShell extends HTMLElement{
  static get observedAttributes(){ return ['debug','cursor','grid']; }

  #stageSlot; #dialogSlot;

  constructor(){
    super();
    this.attachShadow({mode:'open'}).appendChild(template.content.cloneNode(true));
    this.shadowRoot.getElementById('toggle')
      .addEventListener('click', () => this.toggleDebug());
    if (!this.hasAttribute('debug'))  this.setAttribute('debug','off');
    if (!this.hasAttribute('cursor')) this.setAttribute('cursor','none');
    this.#stageSlot  = this.shadowRoot.querySelector('slot[name="stage"]');
    this.#dialogSlot = this.shadowRoot.querySelector('slot[name="dialog"]');
    this.#applyCursor();
  }

  connectedCallback(){
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex','-1');

    // Ensure required LIGHT-DOM elements exist so document queries work:
    let wrapper = this.querySelector('#tad-wrapper');
    if (!wrapper){
      wrapper = document.createElement('div');
      wrapper.id = 'tad-wrapper';
      // ensure a canvas is inside wrapper for TaD to find
      let canvas = this.querySelector('#myCanvas');
      if (!canvas){
        canvas = document.createElement('canvas');
        canvas.id = 'myCanvas';
        wrapper.appendChild(canvas);
      }else if (!canvas.parentElement || canvas.parentElement !== wrapper){
        wrapper.appendChild(canvas);
      }
      this.appendChild(wrapper);
    }
    wrapper.setAttribute('slot','stage');

    let dlg = this.querySelector('#gameDialog');
    if (!dlg){
      dlg = document.createElement('dialog');
      dlg.id = 'gameDialog';
      const iframe = document.createElement('iframe');
      iframe.id = 'gameScreen';
      dlg.appendChild(iframe);
      this.appendChild(dlg);
    }
    dlg.setAttribute('slot','dialog');

    // Optional: click outside dialog rect closes it (we bind on the slotted dialog)
    const setDlgHandlers = () => {
      const [d] = this.#dialogSlot.assignedElements({flatten:true});
      if (!d) return;
      d.addEventListener('click', (e) => {
        const r = d.getBoundingClientRect();
        const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        if (!inside && typeof d.close === 'function' && d.open) d.close();
      });
      // ESC key close
      this.addEventListener('keydown', (e) => { if (e.key === 'Escape' && d.open) d.close(); });
    };
    this.#dialogSlot.addEventListener('slotchange', setDlgHandlers);
    setDlgHandlers();

    // Announce ready (hand back LIGHT-DOM refs TaD can also query)
    const canvas  = /** @type {HTMLCanvasElement} */(this.querySelector('#myCanvas'));
    const context = canvas.getContext('2d');
    this.dispatchEvent(new CustomEvent('tad:ready', {
      detail: {
        canvas, ctx: context,
        wrapper: wrapper,
        dialog: /** @type {HTMLDialogElement} */(this.querySelector('#gameDialog')),
        gameScreen: /** @type {HTMLIFrameElement} */(this.querySelector('#gameScreen')),
      },
      bubbles:true
    }));
  }

  attributeChangedCallback(name, oldV, newV){
    if (oldV === newV) return;
    if (name === 'cursor') this.#applyCursor();
    // debug/grid are pure-CSS toggles
  }

  // public helpers (optional)
  toggleDebug(){
    const open = this.getAttribute('debug') === 'on';
    this.setAttribute('debug', open ? 'off' : 'on');
    this.dispatchEvent(new CustomEvent('tad:toggle-debug', { detail:{ open: !open }, bubbles:true }));
  }
  toggleGrid(){
    if (this.hasAttribute('grid')) this.removeAttribute('grid'); else this.setAttribute('grid','');
    this.dispatchEvent(new CustomEvent('tad:toggle-grid', { detail:{ enabled: this.hasAttribute('grid') }, bubbles:true }));
  }

  // internal
  #applyCursor(){
    const c = (this.getAttribute('cursor') || 'none').toLowerCase();
    this.style.setProperty('--tad-cursor', c === 'auto' ? 'auto' : 'none');
  }
}
customElements.define('tad-shell', TadShell);
