﻿import { Component, OnDestroy } from '@angular/core';
import { Http, Headers, Response, Request, RequestOptions, RequestMethod  } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { CloudinaryOptions, CloudinaryUploader, CloudinaryImageComponent } from 'ng2-cloudinary';
import { Subscription } from 'rxjs/Subscription';
import { RestService } from "./../RestService/RestService";
import { RoleService } from "./../RoleService/RoleService";
import { Language } from 'angular-l10n';

@Component({
    selector: 'profile',
    templateUrl: '/partial/profileComponent',
    styleUrls: ['./css/Components/profileComponent.css'],
    providers: [RestService, RoleService],
})

export class ProfileComponent {
    @Language() lang: string;
    private id: number;
    private subscription: Subscription;
    public user: UserProfile;
    public achivments: AchivmentUser[];
    instructionBool: boolean = true;
    uploader: CloudinaryUploader = new CloudinaryUploader(
        new CloudinaryOptions({ cloudName: 'dr4opxk5i', uploadPreset: 'ajvv2x7e' })
    );
    AuthUser: AuthUser;
    public checkRole(): boolean {
        this.AuthUser = RoleService.getCurrentAuthUser();
        return (this.AuthUser.role == 'Admin' || this.AuthUser.id == this.user.id) ? true : false;
    }
    public isAdmin(): boolean {
        return (RoleService.getCurrentAuthUser().role == 'Admin') ? true : false;       
    }
    constructor(private http: Http, private readonly activateRoute: ActivatedRoute, private service: RestService) {
        this.subscription = activateRoute.params.subscribe(params => this.id = params['id']);
        service.getUserById(this.id.toString()).subscribe(result => {
            this.user = result.json();
            if (this.user.urlPhoto == null)
                this.user.urlPhoto = "https://res.cloudinary.com/dr4opxk5i/image/upload/j8khmafnd7hbxwpxy0kb.jpg";    
            this.achivments = this.user.achivments;
        });

        this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
            let res: any = JSON.parse(response);          
            this.user.urlPhoto = "https://res.cloudinary.com/dr4opxk5i/image/upload/" + res.public_id + ".jpg";          
            return { item, response, status, headers };
        };

        
    }

    onChange(event: any) {      
        this.uploader.uploadAll();
    }

    changeField: boolean = true;

    change(): void {
        this.changeField = !this.changeField;
    }

    ngOnDestroy() {
        console.log(this.user);
        this.service.editProfile(this.user);
    }
}

class UserProfile {
    id: number;
    firstName: string;
    secondName: string;
    urlPhoto: string;
    rating: number;
    country: string;
    city: string;
    dataOfBirth: string;
    aboutMySelf: string;
    achivments: AchivmentUser[];
}

class Achivment {
    id: number;
    name: string;
    urlImage: string;
    description: string;
}

class AchivmentUser {
    id: number;
    achivment: Achivment;
}
class AuthUser {
    id: number = 0;
    role: string;
}


