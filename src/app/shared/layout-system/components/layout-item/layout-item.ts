import { Component, input } from '@angular/core';
import { Item } from '../../models/layout.model';
import { CommonModule } from '@angular/common';
import { Socials } from '../../../../components/socials/socials';
import { Link } from '../../../../components/link/link';
import { ImageBlock } from '../../../../components/image-block/image-block';
import { SelectLanguage } from '../../../../components/select-language/select-language';
import { GoogleTranslate } from '../../../../components/google-translate/google-translate';

@Component({
  selector: 'app-layout-item',
  imports: [CommonModule, Socials, Link, ImageBlock, SelectLanguage, GoogleTranslate],
  templateUrl: './layout-item.html',
  styleUrl: './layout-item.scss',
})
export class LayoutItem {
  readonly item = input<Item | null>(null);
}
