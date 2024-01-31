import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { UserService } from "../core/user.service";
import { Observable, catchError, map, of, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UniqueEmailValidator implements AsyncValidator {

    constructor(private userService: UserService) {

    }

    validate(control: AbstractControl<any, any>): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        return this.userService.isEmailTaken(control.value).pipe(
            map((_: any) => (_ ? {uniqueEmail: true} : null)),
            catchError(() => of(null))
        )
    }
}