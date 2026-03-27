import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home';
import { BranchesPage } from './pages/branches/branches';
import { RepoPage } from './pages/repo/repo';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: ':repo', component: BranchesPage },
  { path: ':repo/:ref', component: RepoPage },
];
