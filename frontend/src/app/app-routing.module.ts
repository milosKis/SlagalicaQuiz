import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {LoginComponent} from './login/login.component';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';
import {RegistrationComponent } from './registration/registration.component';
import {PasswordChangeComponent} from './password-change/password-change.component';
import {RequestsComponent} from './requests/requests.component';
import {MatchRequestsComponent} from './match-requests/match-requests.component';
import {GameComponent} from './game/game.component';
import {GameSingleComponent} from './game-single/game-single.component';
import {RankingsComponent} from './rankings/rankings.component';
import {MatchHistoryComponent} from './match-history/match-history.component';
import {GameInputComponent} from './game-input/game-input.component';
import {GameDayInputComponent} from './game-day-input/game-day-input.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'user', component: UserComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'password-change', component: PasswordChangeComponent},
  {path: 'requests', component: RequestsComponent},
  {path: 'match-requests', component: MatchRequestsComponent},
  {path: 'game', component: GameComponent},
  {path: 'game-single', component: GameSingleComponent},
  {path: 'rankings', component: RankingsComponent},
  {path: 'match-history', component: MatchHistoryComponent},
  {path: 'game-input', component: GameInputComponent},
  {path: 'game-day-input', component: GameDayInputComponent},
  {path: '', component: LoginComponent}
]

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(routes)
  ]
})
export class AppRoutingModule { }
