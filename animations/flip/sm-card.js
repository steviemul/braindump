'use strict';

const TRANSITION_TIME = '200ms';
const TRANSITION = `transform ${TRANSITION_TIME} ease`;
const FLIPPING_IN = `scale(1.05) rotateZ(0deg) rotateY(0deg)`;
const FLIPPING_OUT = `scale(0.9) rotateZ(-8deg) rotateY(90deg)`;
const INITIAL_BACK = `scale(1.05) rotateZ(-8deg) rotateY(-90deg)`;

const FLIPPING_INS = [
  {
    transform:`scale(1.1)`,
  },
  {
    transform:`rotateZ(0deg)`
  }
];

const TIMING = {
  'duration':200,
  'iterations':1,
  'fill':'forwards'
};

class SMCard extends HTMLElement {

  connectedCallback() {
    
    this.style.position = 'relative';

    this.sides = this.querySelectorAll('div');

    if (this.sides.length < 2) {
      throw "Unexpected number of sides " + this.sides.length;
    }

    this.front = this.sides[0];

    this.back = this._getCandidate();

    this._styleAsCard(this.front);

    this._primeContents();
    this._setupEventHandlers();
  }

  flip() {
    this.front.style.transition = TRANSITION;
    this.front.style.transform = FLIPPING_OUT;
    this.front.addEventListener('transitionend', this._frontFlipped);
  }

  _getFrontIndex() {
    for (let i=0;i<this.sides.length;i++) {
      const card = this.sides[i];

      if (card === this.front) {
        return i;
      }
    }

    return 0;
  }

  _getRandom() {

    const candidates = Array.from(this.sides).filter(card => {
      return card !== this.front;
    });

    const index = Math.floor(Math.random() * (this.sides.length - 1));

    return candidates[index];
  }

  _getNext() {
    let index = this._getFrontIndex() + 1;
    
    if (index > (this.sides.length - 1)) {
      index = 0;
    }

    return this.sides[index];
  }

  _getCandidate() {
    const strategy = this.getAttribute('strategy') || 'next';

    if (strategy === 'random') {
      return this._getRandom();
    }
    
    return this._getNext();
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
    this.back = this._getCandidate();

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

    this.front.style.opacity = 1;
    this.front.style.transform = 'initial';
    this.front.style['will-change'] = 'transform';
    this.front.style['pointer-events'] = 'initial';

    Array.from(this.sides).forEach(card => {

      if (card !== this.front) {
        card.style.transition = TRANSITION;
        card.style.opacity = 0;  
        card.style.transform = INITIAL_BACK;
        card.style['will-change'] = 'transform';
        card.style['pointer-events'] = 'none';

        this._styleAsCard(card);
      }
    });
    

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

