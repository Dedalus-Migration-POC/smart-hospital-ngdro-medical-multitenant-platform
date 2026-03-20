import { AfterViewInit, Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-google-translate',
  imports: [],
  templateUrl: './google-translate.html',
  styleUrl: './google-translate.scss',
})
export class GoogleTranslate implements AfterViewInit {
  constructor(private renderer: Renderer2) {}
  ngAfterViewInit() {
    const googleTranslate = document.getElementById('google_translate_element');
    if (googleTranslate) {
      // fix accessibility
      const checkExist = setInterval(() => {
        const selectElement = document.getElementsByClassName('goog-te-combo');
        if (selectElement.length > 0) {
          selectElement[0].setAttribute('id', 'language-select');
          selectElement[0].setAttribute('autocomplete', 'language');
          // Rimuovi aria-label per evitare conflitti WCAG
          selectElement[0].removeAttribute('aria-label');

          this.hideSvg('#goog-gt-thumbUpIcon svg');
          this.hideSvg('#goog-gt-thumbUpIconFilled svg');
          this.hideSvg('#goog-gt-thumbDownIcon svg');
          this.hideSvg('#goog-gt-thumbDownIconFilled svg');
          clearInterval(checkExist);
        } else {
          console.log('Ancora non trovato...');
        }
      }, 300);
    }
  }
  private hideSvg(selector: string) {
    const el = document.querySelector(selector);
    if (el) {
      this.renderer.setAttribute(el, 'aria-hidden', 'true');
      this.renderer.setAttribute(el, 'role', 'presentation');
      this.renderer.removeAttribute(el, 'aria-label');
    }
  }
}
