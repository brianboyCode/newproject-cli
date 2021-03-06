import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { PhotoService } from '../../services/photo.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-photo-owner',
  templateUrl: './photo-owner.component.html',
  styleUrls: ['./photo-owner.component.css']
})
export class PhotoOwnerComponent implements OnInit {


  username: any;
  dataUser: any;
  checkOwner: boolean;
  photoId: any;
  photoOwner: any;
  deleteMessage: string;

  baseUrl = environment.apiUrl;
  comments: any;
  comment: any;
  clickComment = false;


  formComment = {
    comment: ''
  };

  constructor(
    private photoService: PhotoService,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.idUser();
    this.idPhoto();
    this.getPhotoByOwner();
    this.getUserInfo();
    this.showComments();
  }

  // ------------------------------ USER INFO
  idUser() {
    this.route.params.subscribe(params => {
      this.username = params['id']; // --> Name must match wanted parameter
      console.log(this.username);
    });
  }
  idPhoto() {
    this.route.params.subscribe(params => {
      this.photoId = params['idPhoto']; // --> Name must match wanted parameter
      console.log(this.photoId);
    });
  }

  // --------------------------------OWNER PHOTO
  getPhotoByOwner() {
    //
    this.photoService.showPhotoByOwner(this.username, this.photoId).subscribe((data) => this.photoOwner = data);

  }

  getUserInfo() {
    this.userService.getUserId(this.username).subscribe((data) => {
      this.dataUser = data;
      if (this.username) {
        this.checkOwner = true;
      } else {
        this.checkOwner = false;
      }
      console.log(this.checkOwner);
    });
  }

  deletePhoto() {
    this.photoService.deletePhoto(this.username, this.photoId)
      .then((message) => {
        this.deleteMessage = message,
          this.router.navigate(['/user/', this.username]);
      });
  }

  goToOtherUser() {
    this.router.navigate(['/visitor', this.username]);
  }

  // -------------------------------comments

  addComment() {
    this.photoService.addComment(this.photoId, this.formComment)
      .subscribe((comment) => { this.comment = comment, this.formComment.comment = '', this.showComments(); });
    //
  }
  showComments() {
    this.photoService.showComments(this.photoId).subscribe((comments) => {
      this.comments = comments,
        console.log(this.comments.comments);
    });
  }

  clickComments() {
    if (!this.clickComment) {
      this.clickComment = true;
    } else {
      this.clickComment = false;
    }
  }

  goToGallery() {
    this.router.navigate(['/gallery']);
  }

  goToOwner(ownerComment) {
    this.router.navigate(['/user/', ownerComment]);
  }


}
