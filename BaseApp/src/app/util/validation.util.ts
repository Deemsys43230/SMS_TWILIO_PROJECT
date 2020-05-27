import { FormControl, AbstractControl } from '@angular/forms';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { map } from 'rxjs/operators';


export class ValidationUtil {


  //checks whether email matches with email regex pattern
  static validateEmail(Ac: AbstractControl) {
    let emailRegexPattern = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return observableOf(emailRegexPattern.test(Ac.value)).pipe(
      map(result => result ? null : { checkEmailPattern: true })
    );

  }

  //checks whether mobile matches with mobile regex pattern
  static validateMobile(Ac: AbstractControl) {
    let mobileRegexPattern = new RegExp(/^(\+?\d{1,3}[- ]?)?\d{10}$/);
    return observableOf(mobileRegexPattern.test(Ac.value)).pipe(
      map(result => result ? null : { checkMobilePattern: true })
    );
  }

//checks whether password matches with confirm password
static comparePasswords(AC: AbstractControl) {
  let password = AC.get('newPassword').value; // to get value in input tag
  let confirmNewPassword = AC.get('confirmNewPassword').value; // to get value in input tag
  if(password != confirmNewPassword) {
      AC.get('confirmNewPassword').setErrors( {passwordMisMatches: true} )
  } else {
      AC.get('confirmNewPassword').setErrors(null)
      return null
  }
}

  //check password with Regex pattern
  static validatePasswordPattern(Ac: AbstractControl) {
    let passwordPattern = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,100})/);
    return observableOf(passwordPattern.test(Ac.value)).pipe(
      map(result => result ? null : { checkPasswordPattern: true })
    );
  }

  //check FirstName and LastName
  static validateNamePattern(Ac: AbstractControl) {
    let nameRegexPattern = new RegExp(/^[a-zA-Z]+(\s[a-zA-Z]+)?$/);
    return observableOf(nameRegexPattern.test(Ac.value)).pipe(
      map(result => result ? null : { checkNamePattern: true })
    )
  }

  //validate Zipcode USA pattern
  static validateZipcode(Ac: AbstractControl) {
    let zipcodePattern = new RegExp(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
    return observableOf(zipcodePattern.test(Ac.value)).pipe(
      map(result => result ? null : { checkZipcodePattern: true })
    )
  }

}
