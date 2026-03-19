export interface ISocials {
  title: {
    text: {
      it: string;
      en: string;
    };
    fontSize: 'small' | 'normal' | 'large' | 'extraLarge';
    bold: boolean;
    color:
      | 'primary'
      | 'secondary'
      | 'success'
      | 'danger'
      | 'warning'
      | 'info'
      | 'light'
      | 'dark'
      | 'white'
      | 'black';
  };
  socials: {
    id: string;
    showLabel: boolean;
    label: {
      it: string;
      en: string;
    };
    ariaLabel: {
      it: string;
      en: string;
    };

    icon: {
      type: 'svg' | 'img' | 'font';
      value: string;
    };
    url: string;
    target: '_self' | '_blank' | '_parent' | '_top';
    disabled: boolean;
    color:
      | 'primary'
      | 'secondary'
      | 'success'
      | 'danger'
      | 'warning'
      | 'info'
      | 'light'
      | 'dark'
      | 'white'
      | 'black';
  }[];
  layout: {
    direction: 'row' | 'column';
    placement: 'start' | 'end';
    gap: 'gap-1' | 'gap-2' | 'gap-3' | 'gap-4' | 'gap-5';
    align: 'start' | 'center' | 'end';
  };
}
