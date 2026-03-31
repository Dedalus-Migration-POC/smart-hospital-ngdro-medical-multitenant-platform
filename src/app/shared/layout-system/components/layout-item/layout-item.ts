import { Component, input } from '@angular/core';
import { Item } from '../../models/layout.model';
import { CommonModule } from '@angular/common';
import { Socials } from '../../../../components/socials/socials';
import { Link } from '../../../../components/link/link';
import { ImageBlock } from '../../../../components/image-block/image-block';
import { SelectLanguage } from '../../../../components/select-language/select-language';
import { GoogleTranslate } from '../../../../components/google-translate/google-translate';
import { TextComponent } from '../../../../components/text-component/text-component';
import { AuthMethods } from '../../../../pages/auth/components/auth-methods/auth-methods';

@Component({
  selector: 'app-layout-item',
  imports: [
    CommonModule,
    Socials,
    Link,
    ImageBlock,
    SelectLanguage,
    GoogleTranslate,
    TextComponent,
    AuthMethods,
  ],
  templateUrl: './layout-item.html',
  styleUrl: './layout-item.scss',
})
export class LayoutItem {
  readonly item = input<Item | null>(null);
}
