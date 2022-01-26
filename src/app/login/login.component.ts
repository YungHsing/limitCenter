import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from './login.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { JSEncrypt } from 'jsencrypt/lib';
import { sha256 } from 'js-sha256';
import { environment } from 'src/environments/environment';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  jsEncrypt: JSEncrypt = new JSEncrypt({});
  hash: string;
  hide = true;
  SrcEyeOff = "outline_visibility_off_black_48dp";
  SrcEye = "outline_remove_red_eye_black_48dp";
  imgSrc = this.SrcEyeOff;
  faEyeSlash = faEyeSlash;

  no = '';
  pwd = '';
  private from: string = environment.from;
  public key: string;
  public iv: string;
  private bnIdle: BnNgIdleService = null;
  constructor(
    private router: Router,
    private loginService: LoginService,
    private route: ActivatedRoute
  ) { }

  private ticket: string;
  ngOnInit() {
    this.no = this.route.snapshot.queryParamMap.get('name');
    this.ticket = this.route.snapshot.queryParamMap.get('ticket');
  }

  ngAfterViewInit() {
    if (this.no != null && this.no.length > 0 && this.ticket != null && this.ticket.length > 0) {
      let element: HTMLElement = document.getElementById('loginBtn') as HTMLElement;
      element.click();
    }
  }

  async onClickMe(): Promise<void> {
    // this.bnIdle = new BnNgIdleService();

    //------------------------------------------------------------------
    // let publicKey = this.jsEncrypt.getKey().getPublicBaseKeyB64();
    // let privateKey = this.jsEncrypt.getKey().getPrivateBaseKeyB64();
    // console.log("pub=====>"+publicKey);
    // console.log("pri=====>"+privateKey);
    // this.jsEncrypt.setPublicKey(publicKey);
    // this.hash = sha256('19830330');
    // const enc = this.jsEncrypt.encrypt("19830330");
    // console.log("enc=====>"+enc);
    // this.jsEncrypt.setPrivateKey(privateKey);
    // const dec = this.jsEncrypt.decrypt(enc.toString());
    // console.log("dec=====>"+dec);
    //------------------------------------------------------------------

    // if (await this.loginService.initData(this.no, this.pwd)) {
    //   localStorage.setItem("empNo", this.no);
    //   this.router.navigate(['./home'], { queryParams: { empNo: this.no } });
    //   this.bnIdle.startWatching(60 * 10).subscribe((isTimedOut: boolean) => {
    //     if (isTimedOut) { this.routerGoUrl(); }
    //   });
    //   sessionStorage.setItem('BusType', JSON.stringify(await this.loginService.getRuleCode('BUS_TYPE')));
    //   sessionStorage.setItem('ParmType', JSON.stringify(await this.loginService.getRuleCode('PARM_TYPE')));
    //   sessionStorage.setItem('ParmDim', JSON.stringify(await this.loginService.getRuleCode('PARM_DIM')));
    //   sessionStorage.setItem('ParmClass', JSON.stringify(await this.loginService.getRuleCode('PARM_CLASS')));
    //   sessionStorage.setItem('Condition', JSON.stringify(await this.loginService.getCondition()));
    //   //sessionStorage.setItem('RuleStep', JSON.stringify(await this.loginService.getRuleStep()));
    //   //sessionStorage.setItem('PolicyId', JSON.stringify(await this.loginService.getPolicyId()));
    // } else {
    //   alert('帳號有誤!');
    // }

    let chkTicket: string = (this.ticket != null && this.ticket.length > 0) ? this.ticket : '';
    if ('local' == this.from || 'rstn' == this.from || 'dev' == this.from) { chkTicket = 'pass-ticket-validation'; }
    if (await this.loginService.initData(this.no, this.pwd, chkTicket)) {
      this.router.navigate(['./home'], { queryParams: { empNo: this.no } });
      this.loginService.setBnIdle();
      localStorage.setItem("loginKey", 'change');
      localStorage.removeItem('loginKey');
      localStorage.setItem("empNo", this.no);
    } else {
      alert('帳號有誤!');
      if ('stg' == this.from || 'uat' == this.from || 'prod' == this.from) {
        window.location.href = environment.allowOrigin + '/sso';
      } else {
        window.location.reload();
      }
    }
  }

}
