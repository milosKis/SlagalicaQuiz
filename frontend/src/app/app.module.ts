import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';
import { AppRoutingModule } from './app-routing.module';
import { UsersService } from './users.service';

import {HttpClientModule} from '@angular/common/http';
import { RegistrationComponent } from './registration/registration.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { RequestsComponent } from './requests/requests.component';
import { MatchRequestsComponent } from './match-requests/match-requests.component';
import { GameComponent } from './game/game.component';
import { WordsGameComponent } from './words-game/words-game.component';
import { GameWordsComponent } from './game-words/game-words.component';
import { GameNumbersComponent } from './game-numbers/game-numbers.component';
import { GameCombinationsComponent } from './game-combinations/game-combinations.component';
import { GamePairsSingleComponent } from './game-pairs-single/game-pairs-single.component';
import { GameSingleComponent } from './game-single/game-single.component';
import { GamePairsComponent } from './game-pairs/game-pairs.component';
import { GameAssociationsSingleComponent } from './game-associations-single/game-associations-single.component';
import { GameCombinationsSingleComponent } from './game-combinations-single/game-combinations-single.component';
import { RankingsComponent } from './rankings/rankings.component';
import { MatchHistoryComponent } from './match-history/match-history.component';
import { GameInputComponent } from './game-input/game-input.component';
import { GameDayInputComponent } from './game-day-input/game-day-input.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    AdminComponent,
    RegistrationComponent,
    NavBarComponent,
    PasswordChangeComponent,
    RequestsComponent,
    MatchRequestsComponent,
    GameComponent,
    WordsGameComponent,
    GameWordsComponent,
    GameNumbersComponent,
    GameCombinationsComponent,
    GamePairsSingleComponent,
    GameSingleComponent,
    GamePairsComponent,
    GameAssociationsSingleComponent,
    GameCombinationsSingleComponent,
    RankingsComponent,
    MatchHistoryComponent,
    GameInputComponent,
    GameDayInputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [UsersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
