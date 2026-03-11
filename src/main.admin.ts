import { bootstrapApplication } from '@angular/platform-browser';
import { AppAdmin } from './app/admin/admin';
import { appAdminConfig } from './app/admin/admin.config';

bootstrapApplication(AppAdmin, appAdminConfig)
  .catch((err) => console.error(err));
