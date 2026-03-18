export interface ILink {
  text: {
    it: string;
  };
  description?: {
    it: string;
  };
  url: string;
  external: boolean;
  target?: '_self' | '_blank' | '_parent' | '_top';
  //Se c è già testo visibile ariaLabel non serve perche sovrascrive quel testo per screen reader
  ariaLabel?: {
    it: string;
  };
  disabled: boolean;
  style: {
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
    textDecoration: 'none' | 'underline' | 'overline';
    font: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
    fontWeight: 'normal' | 'semibold' | 'bold';
  };
}
