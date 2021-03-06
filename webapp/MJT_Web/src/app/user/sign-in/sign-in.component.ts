import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'
import { Router, ActivatedRoute } from "@angular/router"
import { User } from '../../shared/user.model';
import { UserService } from '../../shared/user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  selectedUser: User;
  user: User[];

  //생성자 왜 만들어줌? part2 19:00
  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router,
    private _route: ActivatedRoute) { }

  model = {
    id: '',
    password: ''
  };

  emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  serverErrorMessages: string;

  ngOnInit() {
    localStorage.clear();
    this.refreshUserList();
  }


  getUserList() {
    return this.http.get(environment.apiBaseUrl+'/member/info');
  }

  refreshUserList() {
    this.getUserList().subscribe((res) => {
      this.user = res as User[];
      // console.log("refresh"+this.user.indexOf);  
    });
  }

  onSubmit(form: NgForm) {
    //subscribe의 callback 함수 res,err

    this.userService.login(form.value).subscribe(
      res => {
        var num = "0";
        var i = parseInt(num);

        // form 전달시 id와 password를 비교해서 일치할 경우 userprofile로 전달
        for (i; i < this.user.length; i++) {
          if (this.user[i].id == form.value.id) {
            if (this.user[i].password == form.value.password) {
              localStorage.setItem('token', this.user[i].jsonWebToken);
              localStorage.setItem('profile', this.user[i]._id);
              this.router.navigateByUrl('/board')
              }
          }
        }
      },
      err => {
        this.serverErrorMessages = err.error.message;
      }
    );

  }

  // btnclick() {
  //   this._router.navigate(['/upload']);
  // }
}
