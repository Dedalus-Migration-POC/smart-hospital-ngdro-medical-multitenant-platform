export interface Departments {
  departments: Department[];
}

export interface Department {
  title: string;
  pavilion: string | null | any;
  manager: string | null;
  units: Unit[];
}

export interface Unit {
  title: string;
  pavilion?: string | null | any;
  manager: string | null;
  email: string | null;
  phoneNumber: string | null;
  detail: {
    floor: number | null;
    visitTime: {
      mon: string | null;
      thu: string | null;
      wed: string | null;
      tue: string | null;
      fri: string | null;
      sat: string | null;
      sun: string | null;
    };
  };
  services: string[] | null;
}
