'use strict';

const TRANSITION_TIME = '200ms';
const TRANSITION = `transform ${TRANSITION_TIME} ease`;
const FLIPPING_IN = `scale(1.0) rotateZ(0deg) rotateY(0deg)`;
const FLIPPING_OUT = `scale(0.9) rotateZ(-8deg) rotateY(90deg)`;

class SMCard extends HTMLElement {

  connectedCallback() {
    
    this.style.position = 'relative';

    this.sides = this.querySelectorAll('div');

    if (this.sides.length != 2) {
      throw "Unexpected number of sides " + this.sides.length;
    }

    this.front = this.sides[0],
    this.back = this.sides[1];

    this._styleAsCard(this.front);
    this._styleAsCard(this.back);

    this._primeContents();
    this._setupEventHandlers();
  }

  flip() {
    this.front.style.transition = TRANSITION;
    this.front.style.transform = FLIPPING_OUT;
    this.front.addEventListener('transitionend', this._frontFlipped);
  }

  _frontFlipped(evt) {

    this.front.style.opacity = 0;
    this.back.style.opacity = 1;

    this.front.removeEventListener('transitionend', this._frontFlipped); 

    this.back.style.transform = FLIPPING_IN;

    this.back.addEventListener('transitionend', this._backFlipped); 
  }

  _backFlipped(evt) {

    this.back.removeEventListener('transitionend', this._backFlipped);

    const copy = this.front;
    this.front = this.back;
    this.back = copy;

    this._primeContents();

    const changeEvent = new Event('change', {
      target:this
    });

    this.dispatchEvent(changeEvent);
  }

  _clickHandler(evt) {

    evt.preventDefault();
    
    const target = evt.target;

    if (target === this.front) {
      this.flip();
    }
  }

  _primeContents() {
    this.front.style.transition = TRANSITION;
    this.back.style.transition = TRANSITION;

    this.front.style.opacity = 1;
    this.front.style.transform = 'initial';
    this.front.style['will-change'] = 'transform';
    this.front.style['pointer-events'] = 'initial';

    this.back.style.opacity = 0;  
    this.back.style.transform = `scale(0.9) rotateZ(-8deg) rotateY(-90deg)`;
    this.back.style['will-change'] = 'transform';
    this.back.style['pointer-events'] = 'none';

    this.value = this.front.getAttribute('value') || null;
  }

  _styleAsCard(pElement) {

    pElement.style.width = '100%';
    pElement.style.height = '100%';
    pElement.style.position = 'absolute';
    pElement.style.top = 0;
    pElement.style.left = 0;
  }

  _setupEventHandlers() {
    this._frontFlipped = this._frontFlipped.bind(this);
    this._backFlipped = this._backFlipped.bind(this);
    this._clickHandler = this._clickHandler.bind(this);
    
    document.addEventListener('click', this._clickHandler);  
  }
}

window.customElements.define('sm-card', SMCard);

