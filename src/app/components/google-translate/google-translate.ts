import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-google-translate',
  imports: [],
  templateUrl: './google-translate.html',
  styleUrl: './google-translate.scss',
})
export class GoogleTranslate implements AfterViewInit {
  ngAfterViewInit() {
    const googleTranslate = document.getElementById('google_translate_element');
    if (googleTranslate) {
      const checkExist = setInterval(() => {
        const selectElement = document.getElementsByClassName('goog-te-combo');
        if (selectElement.length > 0) {
          selectElement[0].setAttribute('id', 'language-select');
          selectElement[0].setAttribute('autocomplete', 'language');
          clearInterval(checkExist);
        } else {
          console.log('Ancora non trovato...');
        }
      }, 300);
    }
  }
}
